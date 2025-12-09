import { InvitationCard } from "@/components/invitation-card";
import { AdminBar } from "@/components/admin-bar";
import { initialData } from "@/lib/initial-data";
import { MusicToggle } from "@/components/music-toggle";

export default function Home() {
  // This page will now show a default/sample public invitation.
  // The AdminBar will show a login/edit button.
  return (
    <main className="bg-background min-h-screen">
       <AdminBar
        isEditing={false}
        isSaving={false}
        invitationId={null}
      />
      <InvitationCard data={initialData} />
      <MusicToggle />
    </main>
  );
}
