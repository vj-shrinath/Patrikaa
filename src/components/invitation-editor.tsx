'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  Query,
  DocumentData,
  writeBatch,
} from 'firebase/firestore';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError, useMemoFirebase } from '@/firebase';
import { initialData, type InvitationData } from '@/lib/initial-data';
import { useToast } from '@/hooks/use-toast';

import { AdminBar } from './admin-bar';
import { InvitationCard } from './invitation-card';
import { EditForm } from './edit-form';
import { MusicToggle } from './music-toggle';
import { DownloadCardButton } from './download-card-button';

import { Skeleton } from './ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';

function InvitationEditorSkeleton() {
  return (
    <div>
      <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Skeleton className="h-8 w-36" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
      <div className="space-y-8 p-4">
        <div className="flex justify-center">
          <Skeleton className="h-screen w-full max-w-3xl" />
        </div>
      </div>
    </div>
  );
}

export function InvitationEditor() {
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<InvitationData>(initialData);
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Set invitationId from URL search param `id` if it exists
  useEffect(() => {
    const idFromParams = searchParams.get('id');
    if (idFromParams) {
      setInvitationId(idFromParams);
    } else {
      setIsLoading(false); // No ID, so we're creating a new one. Not loading.
    }
  }, [searchParams]);

  // Memoize the query to prevent re-renders
  const userInvitationQuery = useMemoFirebase<Query<DocumentData> | null>(() => {
    if (!db || !user?.uid) return null;

    const invitationsCollection = collection(db, 'users', user.uid, 'invitations');

    if (invitationId) {
      // If we have an ID, we query for that specific doc.
      return query(
        invitationsCollection,
        where('__name__', '==', invitationId)
      );
    }
    // If no ID is specified, you might want to fetch the first invitation or handle as new.
    // For this app, we'll just handle new creation if no ID.
    return null;
  }, [db, user?.uid, invitationId]);


  // Subscribe to the user's invitation data
  useEffect(() => {
    if (!user?.uid) return;

    if (!userInvitationQuery) {
      if (!invitationId) {
        setInvitationData({ ...initialData });
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    const unsubscribe = onSnapshot(
      userInvitationQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setInvitationData(doc.data() as InvitationData);
          setInvitationId(doc.id);
        } else {
          toast({
            variant: 'destructive',
            title: 'Not Found',
            description: 'Could not find an invitation with that ID for your account.',
          });
          setInvitationId(null);
          setInvitationData({ ...initialData });
          router.replace('/editor', { scroll: false });
        }
        setIsLoading(false);
      },
      (error) => {
        const path = `users/${user.uid}/invitations`;
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Data Loading Error',
          description: 'Could not load your invitation. Check your connection or permissions.',
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userInvitationQuery, toast, router, user?.uid, invitationId]);


  const saveInvitation = useCallback(async () => {
    if (!db || !user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to save.',
      });
      return;
    }
    setIsSaving(true);

    const dataToSave = { ...invitationData };

    if (invitationId) {
      // Update existing invitation
      const docRef = doc(db, 'users', user.uid, 'invitations', invitationId);
      setDoc(docRef, dataToSave, { merge: true })
        .then(() => {
          toast({
            title: 'Saved!',
            description: 'Your invitation has been saved successfully.',
          });
        })
        .catch((e) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: dataToSave,
          });
          errorEmitter.emit('permission-error', permissionError);
          toast({
            variant: 'destructive',
            title: 'Save Error',
            description: 'Could not save the invitation. Please check your permissions.',
          });
        })
        .finally(() => {
          setIsSaving(false);
        });
    } else {
      // Create new invitation
      const userInvitationsColRef = collection(db, 'users', user.uid, 'invitations');
      addDoc(userInvitationsColRef, dataToSave)
        .then((newDocRef) => {
          const newId = newDocRef.id;

          // In a batch, create a public pointer to this new invitation
          const batch = writeBatch(db);
          const publicDocRef = doc(db, "publicInvitations", newId);
          batch.set(publicDocRef, { ownerId: user.uid });

          batch.commit().then(() => {
            toast({
              title: 'Invitation Created!',
              description: 'Your invitation has been created and saved.',
            });
            router.push('/dashboard'); // Redirect to dashboard
          }).catch((e) => {
            const permissionError = new FirestorePermissionError({
              path: publicDocRef.path,
              operation: 'create',
              requestResourceData: { ownerId: user.uid },
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({
              variant: 'destructive',
              title: 'Public Link Error',
              description: 'Could not create public link. Please save again.',
            });
          })
        })
        .catch((e) => {
          const permissionError = new FirestorePermissionError({
            path: userInvitationsColRef.path,
            operation: 'create',
            requestResourceData: dataToSave,
          });
          errorEmitter.emit('permission-error', permissionError);
          toast({
            variant: 'destructive',
            title: 'Creation Error',
            description: 'Could not create the invitation. Please check your permissions.',
          });
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  }, [db, user, invitationData, invitationId, toast, router]);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...(invitationData.sectionOrder || ['welcome', 'date', 'schedule', 'venue'])];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setInvitationData({ ...invitationData, sectionOrder: newOrder });
  };

  const [editorMode, setEditorMode] = useState<'content' | 'visual'>('content');

  if (isLoading) {
    return <InvitationEditorSkeleton />;
  }

  return (
    <>
      <AdminBar
        isEditing={isEditing}
        isSaving={isSaving}
        invitationId={invitationId}
        onToggle={() => setIsEditing(!isEditing)}
        onSave={saveInvitation}
      />

      {isEditing ? (
        <div className="container mx-auto max-w-3xl py-4 px-4">
          <div className="flex justify-center gap-4 mb-6">
            <Button
              variant={editorMode === 'content' ? 'default' : 'outline'}
              onClick={() => setEditorMode('content')}
            >
              Content Editor
            </Button>
            <Button
              variant={editorMode === 'visual' ? 'default' : 'outline'}
              onClick={() => setEditorMode('visual')}
            >
              Visual Editor
            </Button>
          </div>

          {editorMode === 'content' ? (
            <EditForm data={invitationData} setData={setInvitationData} />
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground mb-4">
                <p>Reorder sections by using the Up and Down buttons.</p>
              </div>

              <div className="flex justify-end mb-4">
                <DownloadCardButton targetId="invitation-card-preview" fileName={`${invitationData.brideName}-${invitationData.groomName}-invite`} />
              </div>

              {(invitationData.sectionOrder || ['welcome', 'date', 'schedule', 'venue']).map((section, index) => (
                <div key={section} className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
                  <span className="font-semibold capitalize">{section} Section</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => moveSection(index, 'up')} disabled={index === 0}>
                      Up
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => moveSection(index, 'down')} disabled={index === (invitationData.sectionOrder?.length || 4) - 1}>
                      Down
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-8 border-t pt-8">
                <h3 className="text-xl font-bold mb-4 text-center">Preview</h3>
                <div id="invitation-card-preview">
                  <InvitationCard data={invitationData} />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <InvitationCard data={invitationData} />
      )
      }

      {!isEditing && <MusicToggle />}
    </>
  );
}
