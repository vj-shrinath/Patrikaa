'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ContactUsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
           <Button variant="ghost" size="sm" className="w-fit mb-4 -ml-2" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4"/> Go to Home
          </Button>
          <CardTitle className="text-3xl font-headline text-primary">Contact Us</CardTitle>
          <CardDescription>We're here to help with any questions you may have.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Email Support</h3>
              <p className="text-muted-foreground">For any inquiries, please email us. We'll get back to you within 24 hours.</p>
              <a href="mailto:itsyoboyvj@gmail.com" className="text-primary hover:underline">itsyoboyvj@gmail.com</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Phone Support</h3>
              <p className="text-muted-foreground">You can call us during our business hours, 10 AM - 6 PM IST.</p>
              <p className="text-primary">8485812410</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
