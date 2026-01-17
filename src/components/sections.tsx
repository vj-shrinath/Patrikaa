"use client";

import type { InvitationData } from "@/lib/initial-data";
import { Sparkles } from "./Sparkles";
import { SwastikIcon } from "./icons";
import { ArrowDown, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import { DecorativeFrame } from "./decorative-frame";

type SectionProps = {
    data: InvitationData;
};

export function WelcomeSection({ data }: SectionProps) {
    const dholImage = PlaceHolderImages.find(img => img.id === 'dhol-shahnai');
    const ganeshaImage = PlaceHolderImages.find(img => img.id === 'ganesha-idol');

    return (
        <section className="first-page fade-in-element">
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
                            {/* Left Side: Couple Photo */}
                            {data.coupleImageUrl && (
                                <div className="relative w-32 h-44 sm:w-56 sm:h-80 flex-shrink-0 order-2 md:order-1">
                                    <Image
                                        src={data.coupleImageUrl}
                                        alt="Couple"
                                        fill
                                        className="object-cover rounded-lg drop-shadow-2xl"
                                    />
                                </div>
                            )}

                            {/* Right Side: Text Content */}
                            <div className="flex-1 flex flex-col items-center order-1 md:order-2">
                                <div className="flex items-start justify-center w-full text-center">
                                    {/* Logic to swap sides based on hostSide */}
                                    {(() => {
                                        const brideBlock = (align: 'left' | 'right') => (
                                            <div className={`flex-1 px-2 text-${align}`}>
                                                <p className="text-sm italic opacity-80">चि. सौ. कां.</p>
                                                <p className="text-xl sm:text-3xl font-headline font-bold text-primary-foreground whitespace-normal sm:whitespace-nowrap">{data.brideName}</p>
                                                <p className="text-xs mt-1 opacity-90">{data.brideParentsDetails ?? `श्री. ${data.brideFather} व श्रीमती ${data.brideMother} यांची ज्येष्ठ कन्या`}</p>
                                            </div>
                                        );

                                        const groomBlock = (align: 'left' | 'right') => (
                                            <div className={`flex-1 px-2 text-${align}`}>
                                                <p className="text-sm italic opacity-80">चि.</p>
                                                <p className="text-xl sm:text-3xl font-headline font-bold text-primary-foreground whitespace-normal sm:whitespace-nowrap">{data.groomName}</p>
                                                <p className="text-xs mt-1 opacity-90">{data.groomParentsDetails ?? `श्री. ${data.groomFather} व श्रीमती ${data.groomMother} यांचे ज्येष्ठ चिरंजीव`}</p>
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
                                <p className="text-4xl sm:text-6xl font-custom-header text-primary-foreground my-2">{data.weddingHeader || "शुभविवाह"}</p>
                            </div>
                        </div>

                        {dholImage && (
                            <div className="dhol-animate mt-4">
                                <Image
                                    src={dholImage.imageUrl}
                                    alt={dholImage.description}
                                    width={180}
                                    height={90}
                                    className="mx-auto [filter:drop-shadow(0_10px_8px_rgba(0,0,0,0.4))]"
                                    data-ai-hint={dholImage.imageHint}
                                />
                            </div>
                        )}

                        <div className="mt-8 text-center text-primary-foreground/80 animate-bounce">
                            <ArrowDown className="w-6 h-6 mx-auto" />
                        </div>
                    </div>
                </DecorativeFrame>
            </div>
        </section>
    );
}

export function DateSection({ data }: SectionProps) {
    return (
        <section className="page fade-in-element p-8">
            <div className="inner-card-solid w-[95vw] sm:w-full p-3 sm:p-8">
                <DecorativeFrame>
                    <Sparkles />
                    <h2 className="text-2xl sm:text-4xl font-headline font-bold text-primary-foreground mb-6">शुभ मुहूर्त</h2>
                    <div className="my-8 p-6 border border-accent/30 rounded-lg bg-accent/5 backdrop-blur-sm">
                        <p className="text-2xl text-primary-foreground/90 font-serif">जुलै</p>
                        <div className="flex justify-between items-center my-4">
                            <div className="text-right w-1/3 space-y-2">
                                <hr className="border-accent/50 w-full ml-auto" />
                                <p className="text-xl font-semibold">{data.mainDay}</p>
                            </div>
                            <p className="text-6xl sm:text-9xl font-headline font-bold text-primary-foreground mx-2 sm:mx-6 scale-110 transform">
                                {data.mainDate}
                            </p>
                            <div className="text-left w-1/3 space-y-2">
                                <hr className="border-accent/50 w-full mr-auto" />
                                <p className="text-xl font-semibold">{data.mainTime}</p>
                            </div>
                        </div>
                        <p className="text-5xl text-primary-foreground/90 font-bold">{data.mainYear}</p>
                    </div>
                    <p className="text-lg text-primary-foreground/90 max-w-md mx-auto leading-relaxed font-serif italic">
                        {data.requestMessage ?? "या शुभमुहूर्तावर करण्याचे योजिले आहे, तरी या मंगलप्रसंगी आपण उपस्थित राहून वधू-वरास शुभाशीर्वाद द्यावेत, ह्यासाठीचे हे अग्रहाचे निमंत्रण."}
                    </p>
                </DecorativeFrame>
            </div>
        </section>
    );
}

export function ScheduleSection({ data }: SectionProps) {
    return (
        <section className="page fade-in-element p-8">
            <div className="inner-card-solid w-[95vw] sm:w-full p-3 sm:p-8">
                <DecorativeFrame>
                    <Sparkles />
                    <h2 className="text-2xl sm:text-4xl font-bold font-headline mb-6 sm:mb-10 text-primary-foreground">कार्यक्रमाची रूपरेषा</h2>
                    <div className="space-y-8 w-full max-w-md mx-auto px-6 sm:px-0">
                        {data.schedule.map((event, index) => (
                            <div key={index} className="fade-in-element text-center border-b border-accent/30 pb-6 last:border-none relative">
                                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-accent text-xl">❦</div>
                                <h3 className="text-xl sm:text-3xl font-bold text-primary-foreground mb-2">{event.name}</h3>
                                <p className="text-xl text-primary-foreground/80 font-serif">{event.details}</p>
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
        <section className="page fade-in-element p-8">
            <div className="inner-card-solid w-[95vw] sm:w-full p-3 sm:p-8">
                <DecorativeFrame>
                    <Sparkles />
                    <h2 className="text-2xl sm:text-4xl font-bold font-headline mb-6 sm:mb-10 text-primary-foreground">विवाह स्थळ</h2>
                    <div className="flex flex-col items-center gap-6">
                        <div className="p-4 rounded-full bg-accent/10 border-2 border-accent/50">
                            <MapPin className="w-16 h-16 text-accent animate-bounce" />
                        </div>
                        <p className="text-2xl sm:text-5xl font-bold text-primary-foreground drop-shadow-md">{data.venueName}</p>
                        <p className="text-xl sm:text-3xl text-primary-foreground/90">{data.venueCity}</p>
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
