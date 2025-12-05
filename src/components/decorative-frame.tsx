import { cn } from "@/lib/utils";

export function DecorativeFrame({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("relative p-4 sm:p-12 border-2 border-accent/40 rounded-sm decorative-frame", className)}>
            {/* Inner Border */}
            <div className="absolute inset-2 border border-accent/20 rounded-sm pointer-events-none decorative-corner hidden sm:block" />

            {/* Top Left Corner */}
            <div className="absolute -top-1 -left-1 w-16 h-16 text-accent pointer-events-none decorative-corner">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-md">
                    <path d="M0 0 L40 0 C25 0 20 5 20 20 L20 40 C20 25 15 20 0 20 Z" />
                    <circle cx="10" cy="10" r="3" className="text-primary-foreground" />
                    <path d="M5 5 L35 5 C25 5 25 10 25 25 L25 35" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* Top Right Corner */}
            <div className="absolute -top-1 -right-1 w-16 h-16 text-accent pointer-events-none rotate-90 decorative-corner">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-md">
                    <path d="M0 0 L40 0 C25 0 20 5 20 20 L20 40 C20 25 15 20 0 20 Z" />
                    <circle cx="10" cy="10" r="3" className="text-primary-foreground" />
                    <path d="M5 5 L35 5 C25 5 25 10 25 25 L25 35" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute -bottom-1 -right-1 w-16 h-16 text-accent pointer-events-none rotate-180 decorative-corner">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-md">
                    <path d="M0 0 L40 0 C25 0 20 5 20 20 L20 40 C20 25 15 20 0 20 Z" />
                    <circle cx="10" cy="10" r="3" className="text-primary-foreground" />
                    <path d="M5 5 L35 5 C25 5 25 10 25 25 L25 35" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* Bottom Left Corner */}
            <div className="absolute -bottom-1 -left-1 w-16 h-16 text-accent pointer-events-none -rotate-90 decorative-corner">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-md">
                    <path d="M0 0 L40 0 C25 0 20 5 20 20 L20 40 C20 25 15 20 0 20 Z" />
                    <circle cx="10" cy="10" r="3" className="text-primary-foreground" />
                    <path d="M5 5 L35 5 C25 5 25 10 25 25 L25 35" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* Floral Accents (Hidden by default, shown for Royal Scroll) */}
            <div className="absolute -top-4 -left-4 w-24 h-24 pointer-events-none floral-accent floral-tl" />
            <div className="absolute -top-4 -right-4 w-24 h-24 pointer-events-none rotate-90 floral-accent floral-tr" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 pointer-events-none rotate-180 floral-accent floral-br" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 pointer-events-none -rotate-90 floral-accent floral-bl" />

            {children}
        </div>
    )
}
