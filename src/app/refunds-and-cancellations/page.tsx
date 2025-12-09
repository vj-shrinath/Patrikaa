'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RefundsAndCancellationsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
           <Button variant="ghost" size="sm" className="w-fit mb-4 -ml-2" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4"/> Go to Home
          </Button>
          <CardTitle className="text-3xl font-headline text-primary">Refund & Cancellation Policy</CardTitle>
          <CardDescription>Last updated: July 26, 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>Thank you for using our services. We value your business and strive to provide the best experience possible. Please read our policy on refunds and cancellations carefully.</p>

          <h3 className="text-lg font-semibold text-foreground pt-4">Wallet Top-Ups</h3>
          <p>Funds added to your wallet are non-refundable. Once a payment is made to top-up your wallet balance, it cannot be reversed or refunded. This balance can only be used for purchasing services offered on our platform, such as creating or editing invitations.</p>

          <h3 className="text-lg font-semibold text-foreground pt-4">Service Fees (Invitation Creation/Editing)</h3>
          <p>The fees deducted from your wallet for creating or editing an invitation are for the digital service provided. These service fees are final and non-refundable once the service has been rendered (i.e., once you save the invitation after payment).</p>
          <p>We do not offer refunds for any invitations that have been created, edited, or for any unused wallet balances.</p>
          
          <h3 className="text-lg font-semibold text-foreground pt-4">Cancellations</h3>
          <p>Since our services are digital and rendered instantly, we do not have a cancellation process. Once a fee is deducted from your wallet for a service, that action is considered complete and cannot be cancelled.</p>
          
          <h3 className="text-lg font-semibold text-foreground pt-4">Exceptional Circumstances</h3>
          <p>In the rare event of a technical failure where a service fee was deducted but the service was not rendered (e.g., an invitation failed to save due to a server error), please contact our support team with your user details and the approximate time of the transaction. We will investigate the issue and, if a fault on our side is confirmed, we will credit the deducted amount back to your wallet.</p>
          
          <h3 className="text-lg font-semibold text-foreground pt-4">Contact Us</h3>
          <p>If you have any questions about our Refunds and Cancellations Policy, please contact us at: <a href="mailto:support@digitalinvite.com" className="text-primary hover:underline">support@digitalinvite.com</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
