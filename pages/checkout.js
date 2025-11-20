import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import Script from "next/script";

export default function Checkout() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(10);
  const router = useRouter();
  const { amount: queryAmount } = router.query;

  useEffect(() => {
    if (router.isReady) {
      const parsedAmount = parseFloat(queryAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        setAmount(parsedAmount);
      }
    }
  }, [router.isReady, queryAmount]);

  const createOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/createCashfreeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  order_amount: parseFloat(amount),
  customer_id: user.uid,             
  customer_email: user.email,
  customer_phone: user.phoneNumber || "9999999999",
  order_note: `Add to wallet: ${amount}`,
}),
      });

      const data = await res.json();

      if (data?.payment_session_id) {
        const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";

        const cashfree = new window.Cashfree({ mode });

        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self",
        });
      } else {
        alert("Order creation failed: " + (data.message || "Unknown error"));
        console.error("ORDER ERROR:", data);
      }
    } catch (err) {
      alert("Error creating order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button variant="ghost" size="sm" className="w-fit mb-2 -ml-2" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
              <CreditCard className="h-7 w-7 text-primary" />
              Add Funds to Wallet
            </CardTitle>
            <CardDescription>
              Enter the amount you wish to add to your balance.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={createOrder} className="space-y-6">
              <div>
                <Label htmlFor="amount">Amount (INR)</Label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground">₹</span>
                  </div>

                  <Input
                    type="number"
                    id="amount"
                    className="pl-7 h-11 text-base"
                    placeholder="10.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    required
                    disabled={!!queryAmount}
                  />
                </div>

                {queryAmount && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    This amount is required to complete your previous action.
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !amount || amount < 1}
                className="w-full h-11 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Processing...
                  </>
                ) : (
                  `Pay ₹${amount}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />
    </>
  );
}
