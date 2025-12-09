'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import type { InvitationData } from '@/lib/initial-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Edit, Loader2, Wallet, IndianRupee, Info } from 'lucide-react';
import { AdminBar } from '@/components/admin-bar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type UserProfile = {
    walletBalance?: number;
};

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <AdminBar isEditing={false} isSaving={false} invitationId={null} />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const [dialogState, setDialogState] = useState<{
      isOpen: boolean;
      title: string;
      description: string;
      action?: () => void;
      actionLabel: string;
      isInsufficientFunds: boolean;
  }>({
      isOpen: false,
      title: '',
      description: '',
      actionLabel: '',
      isInsufficientFunds: false,
  });

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const walletBalance = userProfile?.walletBalance ?? 0;

  const userInvitationsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'users', user.uid, 'invitations');
  }, [db, user?.uid]);

  const { data: invitations, isLoading: isLoadingInvitations } = useCollection<InvitationData>(userInvitationsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handlePayment = (cost: number, onConfirm: () => void) => {
    if (!userProfileRef) return;

    if (walletBalance >= cost) {
      const newBalance = walletBalance - cost;
      updateDoc(userProfileRef, { walletBalance: newBalance })
        .then(() => {
          onConfirm();
        })
        .catch((err) => {
          console.error("Error updating balance:", err);
          // Optionally show a toast notification for the error
        });
    } else {
       setDialogState({
            isOpen: true,
            title: 'Insufficient Funds',
            description: `You need ₹${cost.toFixed(2)} but your wallet only has ₹${walletBalance.toFixed(2)}. Please add funds to continue.`,
            action: () => router.push(`/checkout?amount=${cost}`),
            actionLabel: 'Add Funds',
            isInsufficientFunds: true,
        });
    }
  };

  const handleCreateClick = () => {
    const isFirstInvitation = !invitations || invitations.length === 0;
    if (isFirstInvitation) {
      router.push('/editor');
    } else {
      const cost = 150;
       if (walletBalance < cost) {
         setDialogState({
            isOpen: true,
            title: 'Insufficient Funds',
            description: `Creating a new invitation costs ₹${cost.toFixed(2)}, but you only have ₹${walletBalance.toFixed(2)}. Please add funds.`,
            action: () => router.push(`/checkout?amount=${cost}`),
            actionLabel: 'Add Funds',
            isInsufficientFunds: true,
         });
       } else {
         setDialogState({
            isOpen: true,
            title: 'Create New Invitation',
            description: `This will cost ₹${cost.toFixed(2)}. This amount will be deducted from your wallet.`,
            action: () => handlePayment(cost, () => router.push('/editor')),
            actionLabel: `Pay ₹${cost.toFixed(2)} & Create`,
            isInsufficientFunds: false,
         });
       }
    }
  };

  const handleEditClick = (invitationId: string) => {
    const cost = 50;
     if (walletBalance < cost) {
        setDialogState({
            isOpen: true,
            title: 'Insufficient Funds',
            description: `Editing this invitation costs ₹${cost.toFixed(2)}, but you only have ₹${walletBalance.toFixed(2)}. Please add funds.`,
            action: () => router.push(`/checkout?amount=${cost}`),
            actionLabel: 'Add Funds',
            isInsufficientFunds: true,
        });
     } else {
        setDialogState({
            isOpen: true,
            title: 'Edit Invitation',
            description: `Editing this invitation will cost ₹${cost.toFixed(2)}. This amount will be deducted from your wallet.`,
            action: () => handlePayment(cost, () => router.push(`/editor?id=${invitationId}`)),
            actionLabel: `Pay ₹${cost.toFixed(2)} & Edit`,
            isInsufficientFunds: false,
        });
     }
  };

  if (isUserLoading || isProfileLoading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminBar
        isEditing={false}
        isSaving={false}
        invitationId={null}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">My Invitations</h1>
            <p className="text-muted-foreground">Manage your wedding invitations here.</p>
          </div>
          <Button onClick={handleCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Invitation
          </Button>
        </div>

        <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-headline text-primary flex items-center">
                        <Wallet className="mr-2 h-6 w-6"/>
                        My Wallet
                    </CardTitle>
                    <CardDescription>Your current balance for services.</CardDescription>
                </div>
                 <Button onClick={() => router.push('/checkout')}>
                    Add Funds
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-center text-4xl font-bold text-primary">
                    <IndianRupee className="h-8 w-8 mr-2"/>
                    <span>{walletBalance.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>


        {isLoadingInvitations && (
           <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading your invitations...</p>
           </div>
        )}

        {!isLoadingInvitations && invitations && invitations.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {invitations.map((inv) => (
              <Card key={inv.id}>
                <CardHeader>
                  <CardTitle className="text-xl font-headline text-primary">{inv.brideName} & {inv.groomName}</CardTitle>
                  <CardDescription>Created on: {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end gap-2">
                     <Button variant="outline" size="sm" onClick={() => router.push(`/invitation/${inv.id}`)}>
                        View
                     </Button>
                     <Button size="sm" onClick={() => handleEditClick(inv.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoadingInvitations && (!invitations || invitations.length === 0) && (
           <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <div className="flex justify-center items-center mb-4">
                  <Info className="h-8 w-8 text-primary"/>
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground">Your First Invitation is Free!</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">Create your first beautiful digital invitation on us. Subsequent invitations will require a small fee.</p>
                <Button onClick={handleCreateClick} className="mt-6">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your Free Invitation
                </Button>
           </div>
        )}
      </main>
      <AlertDialog open={dialogState.isOpen} onOpenChange={(isOpen) => setDialogState(prev => ({...prev, isOpen}))}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>{dialogState.title}</AlertDialogTitle>
                  <AlertDialogDescription>
                      {dialogState.description}
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={dialogState.action}>
                      {dialogState.actionLabel}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
