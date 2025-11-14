
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase client-side
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export default function Success() {
  const router = useRouter();
  const { order_id } = router.query;
  const [status, setStatus] = useState("checking"); // 'checking', 'paid', 'failed', 'error'
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (!order_id) {
        setStatus("error");
        setPaymentDetails({ error: "No order ID found in URL." });
        return;
    }
    
    if (!user) {
        // Wait for user auth state to be determined
        return;
    }

    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);

    fetch(`/api/verifyCashfreePayment?order_id=${order_id}`)
      .then(res => res.json())
      .then(async (data) => {
        setPaymentDetails(data);
        if (data.order_status === 'PAID') {
          setStatus('paid');
          try {
            const update = await fetch("/api/updateWallet", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uid: user.uid,
    amount: data.order_amount,
  }),
});

const result = await update.json();

if (!result.success) {
  throw new Error("Wallet update failed");
}


            setTimeout(() => {
                router.push('/dashboard');
            }, 3000); // 3-second delay
          } catch (dbError) {
             console.error("Failed to update wallet balance:", dbError);
             setStatus('error');
             setPaymentDetails(prev => ({...prev, error: "Failed to update wallet balance."}));
          }
        } else {
          setStatus('failed');
        }
      })
      .catch((err) => {
        console.error("Verification error:", err);
        setStatus("error");
        setPaymentDetails({ error: "Failed to verify payment status." });
      });
  }, [order_id, router.isReady, router, user]);

  const renderIcon = () => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-16 h-16 text-destructive" />;
      default:
        return <Loader2 className="w-16 h-16 animate-spin text-primary" />;
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
        case 'paid':
            return { title: "Payment Successful!", description: "Your wallet has been credited. Redirecting..." };
        case 'failed':
            return { title: "Payment Failed", description: paymentDetails?.order_status || "Your payment was not successful." };
        case 'error':
            return { title: "Verification Error", description: paymentDetails?.error || "Could not verify payment." };
        default:
            return { title: "Verifying Payment...", description: "Please wait while we confirm your transaction." };
    }
  }
  
  const { title, description } = renderStatusMessage();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
       <Card className="w-full max-w-md text-center">
            <CardHeader className="items-center">
                <div className="p-4">{renderIcon()}</div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            {paymentDetails && (
                <CardContent className="text-left bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                    {paymentDetails.order_id && <p><strong>Order ID:</strong> {paymentDetails.order_id}</p>}
                    {paymentDetails.order_amount && <p><strong>Amount:</strong> ₹{paymentDetails.order_amount.toFixed(2)}</p>}
                    {paymentDetails.payment_method?.card?.card_number && <p><strong>Card:</strong> {paymentDetails.payment_method.card.card_number}</p>}
                    {paymentDetails.order_status && <p><strong>Status:</strong> <span className="font-semibold">{paymentDetails.order_status}</span></p>}
                    {paymentDetails.error && <p className="text-destructive"><strong>Error:</strong> {paymentDetails.error}</p>}
                </CardContent>
            )}
            <CardContent>
                <Button onClick={() => router.push('/dashboard')} className="w-full mt-4">
                    Go to Dashboard
                </Button>
            </CardContent>
       </Card>
    </div>
  );
}
