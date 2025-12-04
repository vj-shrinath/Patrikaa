'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
    const pathname = usePathname();

    // Don't show footer on invitation pages (shared card view)
    if (pathname?.startsWith('/invitation/')) {
        return null;
    }

    return (
        <footer className="w-full py-6 bg-background border-t mt-auto no-print">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <div className="text-center md:text-left">
                    &copy; {new Date().getFullYear()} Digital Invite. All rights reserved.
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link href="/contact-us" className="hover:text-primary transition-colors">
                        Contact Us
                    </Link>
                    <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
                        Terms & Conditions
                    </Link>
                    <Link href="/refunds-and-cancellations" className="hover:text-primary transition-colors">
                        Refunds & Cancellations
                    </Link>
                </div>
            </div>
        </footer>
    );
}
