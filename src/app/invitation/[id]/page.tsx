'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import { InvitationCard } from '@/components/invitation-card';
import { MusicToggle } from '@/components/music-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import type { InvitationData } from '@/lib/initial-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

function PublicInvitationSkeleton() {
  return (
    <div className="space-y-8 p-4 flex justify-center items-center min-h-screen bg-background">
      <Skeleton className="h-[80vh] w-full max-w-2xl" />
    </div>
  );
}

export default function PublicInvitationPage({ params }: { params: { id: string } }) {
  const db = useFirestore();
  const { id: invitationId } = params;

  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !invitationId) {
        if(db && !invitationId) {
            setError("Invalid invitation ID provided.");
            setIsLoading(false);
        }
      return;
    }

    const fetchInvitation = async () => {
        setIsLoading(true);
        // Step 1: Look up the owner's ID from the public collection
        const publicDocRef = doc(db, 'publicInvitations', invitationId);
        try {
            const publicDocSnap = await getDoc(publicDocRef);
            if (!publicDocSnap.exists()) {
                setError('This invitation could not be found or is not public.');
                setIsLoading(false);
                return;
            }

            const { ownerId } = publicDocSnap.data();
            if (!ownerId) {
                 setError('Invitation is improperly configured.');
                 setIsLoading(false);
                 return;
            }

            // Step 2: Fetch the actual invitation data from the user's private collection
            const privateDocRef = doc(db, 'users', ownerId, 'invitations', invitationId);
            const privateDocSnap = await getDoc(privateDocRef);

            if (privateDocSnap.exists()) {
                setInvitationData(privateDocSnap.data() as InvitationData);
                setError(null);
            } else {
                setError('This invitation could not be found.');
            }

        } catch (err) {
            if (err instanceof Error && err.message.includes('permission-denied')) {
                const contextualError = new FirestorePermissionError({ path: publicDocRef.path, operation: 'get' });
                errorEmitter.emit('permission-error', contextualError);
            }
            
            setError('There was a problem loading this invitation. It may have been removed or the link is incorrect.');
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchInvitation();

  }, [db, invitationId]);

  if (isLoading) {
    return <PublicInvitationSkeleton />;
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Alert variant="destructive" className="max-w-lg">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Loading Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }

  if (!invitationData) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
             <Alert variant="destructive" className="max-w-lg">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>The invitation you are looking for does not exist.</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <>
      <InvitationCard data={invitationData} />
      <MusicToggle />
    </>
  );
}
