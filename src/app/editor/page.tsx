'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { InvitationEditor } from '@/components/invitation-editor';
import { Skeleton } from '@/components/ui/skeleton';

function EditorPageSkeleton() {
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
      <div className="flex justify-center p-4">
        <Skeleton className="h-[80vh] w-full max-w-3xl" />
      </div>
    </div>
  );
}


export default function EditorPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth state is done loading and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // While checking auth, show a skeleton
  if (isUserLoading || !user) {
    return <EditorPageSkeleton />;
  }
  
  // If user is logged in, show the editor
  // The editor component itself will handle loading existing data or starting new
  return (
    <main className="bg-background min-h-screen">
      <InvitationEditor />
    </main>
  );
}
