<<<<<<< HEAD

'use client';

import { Button } from "@/components/ui/button";
import { Loader2, Edit, Eye, Save, Copy, LogOut, LayoutDashboard, ArrowLeft } from "lucide-react";
=======
'use client';

import { Button } from "@/components/ui/button";
import { Loader2, Edit, Eye, Save, Copy, LogOut, LayoutDashboard } from "lucide-react";
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
import { useToast } from "@/hooks/use-toast";
import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

type AdminBarProps = {
  isEditing: boolean;
  isSaving: boolean;
  invitationId: string | null;
  onToggle?: () => void;
  onSave?: () => void;
};

export function AdminBar({
  isEditing,
  isSaving,
  invitationId,
  onToggle,
  onSave,
}: AdminBarProps) {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleCopyLink = () => {
    if (!invitationId) return;
    const link = `${window.location.origin}/invitation/${invitationId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "The invitation link has been copied to your clipboard.",
    });
  };

  const handleLogout = () => {
    signOut(auth);
    router.push('/');
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
    })
  };

  const handleEditClick = () => {
    if(user) {
        router.push('/dashboard');
    } else {
        router.push('/login');
    }
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="text-xl font-headline font-bold text-primary">
          Digital Invite
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
<<<<<<< HEAD
           {user && !isEditing && onToggle && (
            <Button onClick={onToggle} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
          )}

          {user && !isEditing && !onToggle && (
=======
          {user && !isEditing && (
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
            <Button onClick={() => router.push('/dashboard')} variant="outline" size="sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          )}

          {user && invitationId && (
             <Button onClick={handleCopyLink} variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          )}

          {user && isEditing && onToggle && (
             <Button onClick={onToggle} variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
            </Button>
          )}
          
          {!user && !isUserLoading && (
             <Button onClick={handleEditClick} variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Create / Edit
            </Button>
          )}

          {user && isEditing && onSave && (
            <Button onClick={onSave} disabled={isSaving} size="sm">
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}

          {user && (
             <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
