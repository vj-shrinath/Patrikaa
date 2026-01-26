'use client';

import { useEffect, useState, use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import { InvitationCard } from '@/components/invitation-card';
import { MusicToggle } from '@/components/music-toggle';
import { Button } from '@/components/ui/button';
import { RefreshCcw, ShieldAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { InvitationData } from '@/lib/initial-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function PublicInvitationSkeleton() {
    return (
        <div className="relative min-h-screen w-full bg-background overflow-hidden">
            {/* Background Skeleton */}
            <div className="absolute inset-0 p-4 flex justify-center items-center opacity-50 pointer-events-none blur-sm">
                <Skeleton className="h-[80vh] w-full max-w-2xl" />
            </div>

            {/* Overlay Loading Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-black/5 backdrop-blur-[2px]">
                <div className="bg-background/90 p-8 rounded-2xl shadow-2xl border border-primary/20 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-lg font-bold text-primary tracking-wider animate-pulse">पत्रिका लोड होत आहे...</p>
                </div>
            </div>
        </div>
    );
}

export default function PublicInvitationPage({ params }: { params: Promise<{ id: string }> }) {
    const db = useFirestore();
    const { id: invitationId } = use(params);

    const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvitation = async () => {
        if (!db || !invitationId) return;

        setIsLoading(true);
        setError(null);
        // Step 1: Look up the owner's ID from the public collection
        const publicDocRef = doc(db, 'publicInvitations', invitationId);
        try {
            const publicDocSnap = await getDoc(publicDocRef);
            if (!publicDocSnap.exists()) {
                setError('ही पत्रिका सापडली नाही किंवा ती खाजगी आहे.');
                setIsLoading(false);
                return;
            }

            const { ownerId } = publicDocSnap.data();
            if (!ownerId) {
                setError('Invitiation configuration error.');
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
                setError('ही पत्रिका सापडली नाही.');
            }

        } catch (err) {
            console.error(err);
            if (err instanceof Error && err.message.includes('permission-denied')) {
                const contextualError = new FirestorePermissionError({ path: publicDocRef.path, operation: 'get' });
                errorEmitter.emit('permission-error', contextualError);
            }

            setError('पत्रिका लोड करण्यास असमर्थ, कृपया इंटरनेट तपासा');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (db && invitationId) {
            fetchInvitation();
        } else if (db && !invitationId) {
            setIsLoading(false);
            setError("Invalid ID");
        }
    }, [db, invitationId]);

    if (isLoading) {
        return <PublicInvitationSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 gap-6">
                <Alert variant="destructive" className="max-w-lg border-2">
                    <ShieldAlert className="h-5 w-5" />
                    <AlertTitle className="text-lg font-bold ml-2">त्रुटी (Error)</AlertTitle>
                    <AlertDescription className="text-base mt-2 ml-2">
                        {error}
                    </AlertDescription>
                </Alert>

                <Button
                    onClick={() => window.location.reload()}
                    size="lg"
                    className="gap-2 text-lg px-8 shadow-lg hover:scale-105 transition-transform"
                >
                    <RefreshCcw className="w-5 h-5" />
                    पुन्हा लोड करा (Reload)
                </Button>
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
