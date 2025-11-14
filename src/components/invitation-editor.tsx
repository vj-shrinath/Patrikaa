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
import { Skeleton } from './ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';

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
            setInvitationData({...initialData });
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
            setInvitationData({...initialData});
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
        <EditForm data={invitationData} setData={setInvitationData} />
      ) : (
        <InvitationCard data={invitationData} />
      )}

      <MusicToggle />
    </>
  );
}
