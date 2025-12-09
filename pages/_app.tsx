
import type { AppProps } from 'next/app';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css"; // Import global styles here

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseClientProvider>
      <Component {...pageProps} />
      <Toaster />
    </FirebaseClientProvider>
  );
}

export default MyApp;
