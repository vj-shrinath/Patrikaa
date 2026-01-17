
import { Metadata, ResolvingMetadata } from 'next';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { InvitationData } from '@/lib/initial-data';
import { InvitationClient } from '@/components/invitation-client';

type Props = {
  params: Promise<{ id: string }>
}

async function getInvitationData(id: string): Promise<InvitationData | null> {
  const { firestore: db } = initializeFirebase();

  if (!id) return null;

  try {
    // Step 1: Look up the owner's ID from the public collection
    const publicDocRef = doc(db, 'publicInvitations', id);
    const publicDocSnap = await getDoc(publicDocRef);

    if (!publicDocSnap.exists()) {
      return null;
    }

    const { ownerId } = publicDocSnap.data();
    if (!ownerId) {
      return null;
    }

    // Step 2: Fetch the actual invitation data from the user's private collection
    const privateDocRef = doc(db, 'users', ownerId, 'invitations', id);
    const privateDocSnap = await getDoc(privateDocRef);

    if (privateDocSnap.exists()) {
      return privateDocSnap.data() as InvitationData;
    }
  } catch (error) {
    console.error("Error fetching invitation for metadata:", error);
  }

  return null;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const data = await getInvitationData(id);

  if (!data) {
    return {
      title: 'Invitation Not Found',
    };
  }

  const title = `Wedding Invitation: ${data.brideName} & ${data.groomName}`;
  const description = `You are cordially invited to the wedding of ${data.brideName} and ${data.groomName} on ${data.mainDate} ${data.mainDay}. Click to view details.`;

  // Prioritize ogImageUrl, fall back to coupleImageUrl, then default
  const images = [];
  if (data.ogImageUrl) {
    images.push(data.ogImageUrl);
  } else if (data.coupleImageUrl) {
    images.push(data.coupleImageUrl);
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: images,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: images,
    }
  };
}

export default async function InvitationPage({ params }: Props) {
  const { id } = await params;

  return (
    <InvitationClient id={id} />
  );
}
