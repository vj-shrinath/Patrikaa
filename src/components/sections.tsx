"use client";
import { useState, useEffect } from "react";

import type { InvitationData } from "@/lib/initial-data";
import { Sparkles } from "./Sparkles";
import { SwastikIcon } from "./icons";
import { ArrowDown, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

import { DecorativeFrame } from "./decorative-frame";
import { CountdownTimer } from "./countdown-timer";

type SectionProps = {
    data: InvitationData;
};

export function WelcomeSection({ data }: SectionProps) {

    const ganeshaImage = PlaceHolderImages.find(img => img.id === 'ganesha-idol');

    return (
        <section className="first-page fade-in-element justify-center p-2 sm:p-8">
            <div className="inner-card-solid w-[95vw] sm:w-full p-2 sm:p-10 flex flex-col justify-center">
                <DecorativeFrame>
                    <Sparkles />
                    <div className="flex flex-col items-center gap-4 text-primary-foreground">
                        {ganeshaImage && (
                            <div className="mb-2">
                                <Image
                                    src={ganeshaImage.imageUrl}
                                    alt={ganeshaImage.description}
                                    width={80}
                                    height={80}
                                    className="mx-auto drop-shadow-lg"
                                    data-ai-hint={ganeshaImage.imageHint}
                                />
                            </div>
                        )}
                        <p className="text-md font-semibold tracking-wide text-primary-foreground">|| श्री गणेशाय नमः ||</p>

                        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4 my-4">


                            {/* Right Side: Text Content */}
                            <div className="flex-1 flex flex-col items-center order-1 md:order-2">
                                <div className="flex items-start justify-center w-full text-center">
                                    {/* Logic to swap sides based on hostSide */}
                                    {(() => {
                                        const brideBlock = (align: 'left' | 'right') => (
                                            <div className={`flex-1 px-2 text-${align}`}>
                                                <p className="text-sm italic opacity-80">चि. सौ. कां.</p>
                                                <p className={cn("text-primary-foreground whitespace-normal sm:whitespace-nowrap", data.fonts?.brideName || 'font-headline', data.boldText?.brideName && "font-bold", data.fontSizes?.brideName || 'text-xl sm:text-3xl')}>{data.brideName}</p>
                                                <p className={cn("mt-1 opacity-90", data.fonts?.brideParents || 'font-body', data.boldText?.brideParents && "font-bold", data.fontSizes?.brideParents || 'text-xs')}>{data.brideParentsDetails ?? `श्री. ${data.brideFather} व श्रीमती ${data.brideMother} यांची ज्येष्ठ कन्या`}</p>
                                            </div>
                                        );

                                        const groomBlock = (align: 'left' | 'right') => (
                                            <div className={`flex-1 px-2 text-${align}`}>
                                                <p className="text-sm italic opacity-80">चि.</p>
                                                <p className={cn("text-primary-foreground whitespace-normal sm:whitespace-nowrap", data.fonts?.groomName || 'font-headline', data.boldText?.groomName && "font-bold", data.fontSizes?.groomName || 'text-xl sm:text-3xl')}>{data.groomName}</p>
                                                <p className={cn("mt-1 opacity-90", data.fonts?.groomParents || 'font-body', data.boldText?.groomParents && "font-bold", data.fontSizes?.groomParents || 'text-xs')}>{data.groomParentsDetails ?? `श्री. ${data.groomFather} व श्रीमती ${data.groomMother} यांचे ज्येष्ठ चिरंजीव`}</p>
                                            </div>
                                        );

                                        const swastikBlock = (
                                            <div className="px-4 pt-4 text-4xl font-normal text-accent animate-pulse">
                                                <SwastikIcon className="w-10 h-10 drop-shadow-md" />
                                            </div>
                                        );

                                        if (data.hostSide === 'groom') {
                                            // Groom on Left (text-right), Bride on Right (text-left)
                                            return (
                                                <>
                                                    {groomBlock('right')}
                                                    {swastikBlock}
                                                    {brideBlock('left')}
                                                </>
                                            );
                                        } else {
                                            // Default: Bride on Left (text-right), Groom on Right (text-left)
                                            return (
                                                <>
                                                    {brideBlock('right')}
                                                    {swastikBlock}
                                                    {groomBlock('left')}
                                                </>
                                            );
                                        }
                                    })()}
                                </div>

                                <p className="text-xl mt-6 font-serif text-primary-foreground/80">यांचा</p>
                                <p className={cn("text-primary-foreground my-2", data.fonts?.weddingHeader || 'font-custom-header', data.boldText?.weddingHeader && "font-bold", data.fontSizes?.weddingHeader || 'text-4xl sm:text-6xl')}>{data.weddingHeader || "शुभविवाह"}</p>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-primary-foreground/80 animate-bounce">
                            <ArrowDown className="w-6 h-6 mx-auto" />
                        </div>
                    </div>
                </DecorativeFrame>
            </div>
        </section>
    );
}

export function CoupleSection({ data }: SectionProps) {
    const hasGallery = data.gallery && data.gallery.length > 0;
    const hasCoupleImage = !!data.coupleImageUrl;

    if (!hasGallery && !hasCoupleImage) return null;

    const mediaItems = hasGallery
        ? data.gallery!
        : [{ type: 'image' as const, url: data.coupleImageUrl! }];

    return (
        <section className="page fade-in-element justify-center p-2 sm:p-8">
            <div className="inner-card-solid w-[95vw] sm:w-full p-2 sm:p-10 flex flex-col justify-center items-center overflow-visible">
                <div className="w-full mt-4 mb-8 sm:mt-8 sm:mb-12">
                    {/* Increased padding (py-10) to prevent glow cutoff. 
                        Responsive padding (px) to allow full scroll. 
                        items-center and snap logic retained. */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-8 py-10 px-4 no-scrollbar items-center justify-start sm:justify-center w-full">
                        {mediaItems.map((item, index) => (
                            <div key={index} className="snap-center shrink-0 transform transition-transform duration-300">
                                <div className="premium-photo-frame">
                                    {/* Responsive width: 75vw on mobile for carousel effect, fixed on desktop */}
                                    <div className="relative w-[75vw] h-[100vw] sm:w-80 sm:h-[28rem] premium-photo-inner overflow-hidden bg-background/50 shadow-inner">
                                        {item.type === 'video' ? (
                                            <video
                                                src={item.url}
                                                controls
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Image
                                                src={item.url}
                                                alt={`Couple Media ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}



export function DateSection({ data }: SectionProps) {
    return (
        <section className="page fade-in-element p-2 sm:p-8">
            <div className="inner-card-solid w-[95vw] sm:w-full p-2 sm:p-8">
                <DecorativeFrame>
                    <Sparkles />
                    <h2 className={cn("text-primary-foreground mb-6", data.fonts?.shubhMuhhurt || 'font-headline', data.boldText?.shubhMuhhurt && "font-bold", data.fontSizes?.shubhMuhhurt || 'text-2xl sm:text-4xl')}>शुभ मुहूर्त</h2>

                    {/* Countdown Timer */}
                    {data.countdown?.isEnabled && data.countdown.targetDate && (
                        <CountdownTimer targetDate={data.countdown.targetDate} />
                    )}

                    <div className="my-8 p-6 border border-accent/30 rounded-lg bg-accent/5 backdrop-blur-sm">
                        <p className={cn("text-2xl text-primary-foreground/90", data.fonts?.mainDay || 'font-serif', data.boldText?.mainDay && "font-bold", data.fontSizes?.mainDay || 'text-2xl')} style={{ color: data.colors?.mainDay }}>{data.mainDay}</p>
                        <div className="flex justify-between items-center my-4">
                            <div className="text-right w-1/3 space-y-2">
                                <hr className="border-accent/50 w-full ml-auto" />
                                <p className={cn("text-xl", data.fonts?.mainMonth || 'font-body', data.boldText?.mainMonth && "font-bold", data.fontSizes?.mainMonth || 'text-xl')} style={{ color: data.colors?.mainMonth }}>{data.mainMonth || "जुलै"}</p>
                            </div>
                            <p className={cn("text-primary-foreground mx-2 sm:mx-6 scale-110 transform", data.fonts?.mainDate || 'font-headline', data.boldText?.mainDate && "font-bold", data.fontSizes?.mainDate || 'text-6xl sm:text-9xl')} style={{ color: data.colors?.mainDate }}>
                                {data.mainDate}
                            </p>
                            <div className="text-left w-1/3 space-y-2">
                                <hr className="border-accent/50 w-full mr-auto" />
                                <p className={cn("text-xl", data.fonts?.mainTime || 'font-body', data.boldText?.mainTime && "font-bold", data.fontSizes?.mainTime || 'text-xl')} style={{ color: data.colors?.mainTime }}>{data.mainTime}</p>
                            </div>
                        </div>
                        <p className={cn("text-primary-foreground/90", data.fonts?.mainYear || 'font-body', data.boldText?.mainYear && "font-bold", data.fontSizes?.mainYear || 'text-5xl')} style={{ color: data.colors?.mainYear }}>{data.mainYear}</p>
                    </div>
                    <p className={cn("text-primary-foreground/90 max-w-md mx-auto leading-relaxed italic", data.fonts?.requestMessage || 'font-serif', data.boldText?.requestMessage && "font-bold", data.fontSizes?.requestMessage || 'text-lg')}>
                        {data.requestMessage ?? "या शुभमुहूर्तावर करण्याचे योजिले आहे, तरी या मंगलप्रसंगी आपण उपस्थित राहून वधू-वरास शुभाशीर्वाद द्यावेत, ह्यासाठीचे हे अग्रहाचे निमंत्रण."}
                    </p>
                </DecorativeFrame>
            </div>
        </section>
    );
}

export function CustomCardSection({ data, sectionId }: SectionProps & { sectionId: string }) {
    const section = data.customSections?.find(s => s.id === sectionId);
    if (!section) return null;

    return (
        <section className="page fade-in-element p-2 sm:p-8">
            <div className="inner-card-solid w-[95vw] sm:w-full p-2 sm:p-8">
                <DecorativeFrame>
                    <Sparkles />
                    {section.imageUrl && (
                        <div className="mb-6 relative w-full h-64 sm:h-80 rounded-lg overflow-hidden border-2 border-accent/20 shadow-md">
                            <Image
                                src={section.imageUrl}
                                alt={section.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <h2 className={cn("mb-4 text-primary-foreground", section.fontTitle || 'font-headline', section.boldTitle && "font-bold")} >{section.title}</h2>
                    <p className={cn("text-primary-foreground/90 whitespace-pre-wrap", section.fontContent || 'font-serif', section.boldContent && "font-bold")} >{section.content}</p>
                </DecorativeFrame>
            </div>
        </section>
    );
}

export function ScheduleSection({ data }: SectionProps) {
    return (
        <section className="page fade-in-element p-2 sm:p-8">
            <div className="inner-card-solid w-[95vw] sm:w-full p-2 sm:p-8">
                <DecorativeFrame>
                    <Sparkles />
                    <h2 className={cn("text-primary-foreground mb-6 sm:mb-10", data.fonts?.scheduleSectionTitle || 'font-headline', data.boldText?.scheduleSectionTitle && "font-bold", data.fontSizes?.scheduleSectionTitle || 'text-2xl sm:text-4xl')} style={{ color: data.colors?.scheduleSectionTitle }}>{data.scheduleSectionTitle || "कार्यक्रमाची रूपरेषा"}</h2>
                    <div className="space-y-8 w-full max-w-md mx-auto px-6 sm:px-0">
                        {data.schedule.map((event, index) => (
                            <div key={index} className="fade-in-element text-center border-b border-accent/30 pb-6 last:border-none relative">
                                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-accent text-xl">❦</div>
                                <h3 className={cn("text-primary-foreground mb-2", data.fonts?.scheduleName || 'font-headline', data.boldText?.scheduleName && "font-bold", data.fontSizes?.scheduleName || 'text-xl sm:text-3xl')} style={{ color: data.colors?.scheduleName }}>{event.name}</h3>
                                <p className={cn("text-primary-foreground/80", data.fonts?.scheduleDetails || 'font-serif', data.boldText?.scheduleDetails && "font-bold", data.fontSizes?.scheduleDetails || 'text-xl')} style={{ color: data.colors?.scheduleDetails }}>{event.details}</p>
                            </div>
                        ))}
                    </div>
                </DecorativeFrame>
            </div>
        </section>
    );
}

export function VenueSection({ data }: SectionProps) {
    return (
        <section className="page fade-in-element p-2 sm:p-8">
            <div className="inner-card-solid w-[95vw] sm:w-full p-2 sm:p-8">
                <DecorativeFrame>
                    <Sparkles />
                    <h2 className="text-2xl sm:text-4xl font-bold font-headline mb-6 sm:mb-10 text-primary-foreground">विवाह स्थळ</h2>
                    <div className="flex flex-col items-center gap-6">
                        <div className="p-4 rounded-full bg-accent/10 border-2 border-accent/50">
                            <MapPin className="w-16 h-16 text-accent animate-bounce" />
                        </div>
                        <p className={cn("text-primary-foreground drop-shadow-md", data.fonts?.place || 'font-headline', data.boldText?.place && "font-bold", data.fontSizes?.place || 'text-2xl sm:text-5xl')} style={{ color: data.colors?.place }}>{data.venueName}</p>
                        <p className={cn("text-primary-foreground/90", data.fonts?.venueCity || 'font-body', data.boldText?.venueCity && "font-bold", data.fontSizes?.venueCity || 'text-xl sm:text-3xl')} style={{ color: data.colors?.venueCity }}>{data.venueCity}</p>
                        <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105">
                            <a
                                href={data.venueMapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                नकाशा पहा
                            </a>
                        </Button>
                        <p className="mt-10 text-2xl font-serif italic text-primary-foreground">आपली उपस्थिती प्रार्थनीय आहे.</p>
                    </div>
                </DecorativeFrame>
            </div>
        </section>
    );
}

export function TopBannerSection({ data }: SectionProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Should be visible if at very top or scrolling up
            // Hide if scrolling down and not at top
            if (currentScrollY < 20) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!data.topBanner?.enabled) return null;

    return (
        <div className={cn(
            "w-full flex justify-center sticky top-0 z-50 pointer-events-none transition-transform duration-300 ease-in-out",
            isVisible ? "translate-y-0" : "-translate-y-[120%]"
        )}>
            {/* Wrapper to match card width constraints (w-[95vw] sm:w-full, max-w-2xl) and mimic the padding (px-2 sm:px-8) */}
            <div className="w-[95vw] sm:w-full max-w-2xl px-2 sm:px-8 pt-2">
                <div
                    className={cn(
                        "pointer-events-auto bg-primary border-x border-b border-accent/60 rounded-b-2xl shadow-xl py-3 text-center tracking-widest flex items-center justify-center gap-3",
                        data.topBanner?.font || 'font-headline',
                        data.topBanner?.bold && "font-bold",
                        data.topBanner?.fontSize || 'text-xs sm:text-sm'
                    )}
                    style={{ color: data.topBanner?.color || 'hsl(var(--primary-foreground))' }}
                >
                    <span className="text-accent animate-pulse">✦</span>
                    <span className="tracking-widest">{data.topBanner.text}</span>
                    <span className="text-accent animate-pulse">✦</span>
                </div>
            </div>
        </div>
    );
}

export function BrandingSection({ data }: SectionProps) {
    if (!data.branding?.isEnabled) return null;

    return (
        <section className="page fade-in-element p-2 sm:p-8">
            <div className="w-[95vw] sm:w-full max-w-2xl px-2 sm:px-8 pb-4 mx-auto">
                <div className="flex flex-col items-center justify-center p-6 bg-background/50 backdrop-blur-sm rounded-xl border border-accent/20">
                    {data.branding.logoUrl && (
                        <div className="mb-3 relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-accent/30 shadow-sm">
                            <Image
                                src={data.branding.logoUrl}
                                alt="Brand Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    {data.branding.text && (
                        <p className="text-sm font-medium text-accent tracking-wider uppercase mb-1">
                            {data.branding.text}
                        </p>
                    )}
                    {data.branding.contact && (
                        <p className="text-xs text-muted-foreground">
                            {data.branding.contact}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
