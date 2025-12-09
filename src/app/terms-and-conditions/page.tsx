'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TermsAndConditionsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
            <Button variant="ghost" size="sm" className="w-fit mb-4 -ml-2" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4"/> Go to Home
          </Button>
          <CardTitle className="text-3xl font-headline text-primary">Terms & Conditions</CardTitle>
          <CardDescription>Last updated: July 26, 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>Please read these terms and conditions carefully before using Our Service.</p>
          
          <h3 className="text-lg font-semibold text-foreground pt-4">Interpretation and Definitions</h3>
          <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

          <h3 className="text-lg font-semibold text-foreground pt-4">Acknowledgment</h3>
          <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
          <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>

           <h3 className="text-lg font-semibold text-foreground pt-4">User Accounts</h3>
          <p>When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.</p>

          <h3 className="text-lg font-semibold text-foreground pt-4">Intellectual Property</h3>
          <p>The Service and its original content, features and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws of both the India and foreign countries.</p>
          
          <h3 className="text-lg font-semibold text-foreground pt-4">Changes to These Terms and Conditions</h3>
          <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect.</p>

          <h3 className="text-lg font-semibold text-foreground pt-4">Contact Us</h3>
          <p>If you have any questions about these Terms and Conditions, You can contact us by email at support@digitalinvite.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
