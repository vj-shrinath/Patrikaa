
"use client";

import type { InvitationData } from "@/lib/initial-data";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { MapPin, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Sparkles } from "./Sparkles";
import { SwastikIcon } from "./icons";
import { cn } from "@/lib/utils";

type InvitationCardProps = {
  data: InvitationData;
};

export function InvitationCard({ data }: InvitationCardProps) {
  const containerRef = useScrollAnimation() as React.RefObject<HTMLDivElement>;

<<<<<<< HEAD
  const ganeshaImage = PlaceHolderImages.find(img => img.id === 'ganesha-idol');
  const dholImage = PlaceHolderImages.find(img => img.id === 'dhol-shahnai');
  const darkGreenCorner = PlaceHolderImages.find(img => img.id === 'dark-green-corner');
  
  // Only use the coupleImageUrl from the data. No fallback to default.
  const coupleImageToShow = data.coupleImageUrl;
  const coupleImageHint = 'custom couple photo';

=======
  const dholImage = PlaceHolderImages.find(img => img.id === 'dhol-shahnai');
  const ganeshaImage = PlaceHolderImages.find(img => img.id === 'ganesha-idol');
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f

  return (
    <div ref={containerRef} className={cn("text-center font-body text-primary-foreground space-y-8", data.theme)}>
      {/* Page 1: Main Welcome */}
<<<<<<< HEAD
      <section className="first-page fade-in-element relative">
        <div className="absolute left-0 bottom-5 z-20 md:ml-[203px]">
          {coupleImageToShow && (
            <Image
              src={coupleImageToShow}
              alt="Marathi couple illustration"
              width={300}
              height={700}
              className="object-contain"
              data-ai-hint={coupleImageHint}
              unoptimized
            />
          )}
        </div>
        <div className="inner-card-solid w-[90vw] sm:w-full p-6 sm:p-10 flex flex-col justify-center items-center relative overflow-hidden">
          {data.theme === 'theme-dark-green' && darkGreenCorner && (
            <>
              <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner top-0 left-0" data-ai-hint={darkGreenCorner.imageHint} />
              <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner top-0 right-0 transform scale-x-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
              <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner bottom-0 left-0 transform scale-y-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
              <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner bottom-0 right-0 transform scale-x-[-1] scale-y-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
            </>
          )}
          <Sparkles />
          <div className="relative z-10 flex flex-col items-center gap-4 text-primary-foreground">
=======
      <section className="first-page fade-in-element">
        <div className="inner-card-solid w-[90vw] sm:w-full p-6 sm:p-10 flex flex-col justify-center">
          <Sparkles />
          <div className="flex flex-col items-center gap-4 text-primary-foreground">
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
            {ganeshaImage && (
                <div className="mb-2">
                    <Image
                        src={ganeshaImage.imageUrl}
                        alt={ganeshaImage.description}
                        width={80}
                        height={80}
                        className="mx-auto"
                        data-ai-hint={ganeshaImage.imageHint}
                    />
                </div>
            )}
            <p className="text-md">श्री गणेशाय नमः</p>
            
            <div className="flex items-start justify-center w-full my-4 text-center">
                <div className="flex-1 px-2 text-right">
                    <p className="text-sm">चि. सौ. कां.</p>
                    <p className="text-2xl font-headline font-bold text-accent whitespace-nowrap">{data.brideName}</p>
                    <p className="text-xs mt-1">श्री. {data.brideFather} व श्रीमती {data.brideMother} यांची ज्येष्ठ कन्या</p>
                </div>

                <div className="px-4 pt-4 text-4xl font-normal text-accent">
<<<<<<< HEAD
                    卐
=======
                    <SwastikIcon className="w-8 h-8" />
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
                </div>

                <div className="flex-1 px-2 text-left">
                    <p className="text-sm">चि.</p>
                    <p className="text-2xl font-headline font-bold text-accent whitespace-nowrap">{data.groomName}</p>
                    <p className="text-xs mt-1">श्री. {data.groomFather} व श्रीमती {data.groomMother} यांचे ज्येष्ठ चिरंजीव</p>
                </div>
            </div>

            <p className="text-lg">यांचा</p>
            <p className="text-5xl font-headline font-bold text-accent">शुभविवाह</p>

<<<<<<< HEAD
            <div className="my-2 flex justify-center items-end gap-4">
              {dholImage && (
                <div className="dhol-animate">
                  <Image
                    src={dholImage.imageUrl}
                    alt={dholImage.description}
                    width={150}
                    height={75}
                    className="mx-auto [filter:drop-shadow(0_10px_8px_rgba(0,0,0,0.25))]"
                    data-ai-hint={dholImage.imageHint}
                  />
                </div>
              )}
            </div>
=======
            {dholImage && (
              <div className="my-2 dhol-animate">
                <Image
                  src={dholImage.imageUrl}
                  alt={dholImage.description}
                  width={150}
                  height={75}
                  className="mx-auto [filter:drop-shadow(0_10px_8px_rgba(0,0,0,0.25))]"
                  data-ai-hint={dholImage.imageHint}
                />
              </div>
            )}

>>>>>>> dc8c8cad2180a258e377915c758104047d66109f

            <div className="mt-4 text-center text-primary-foreground/80 animate-bounce">
                <ArrowDown className="w-6 h-6 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Page 2: Date and Time */}
      <section className="page fade-in-element p-8">
<<<<<<< HEAD
        <div className="inner-card-solid w-[90vw] sm:w-full p-6 sm:p-8 relative overflow-hidden">
             {data.theme === 'theme-dark-green' && darkGreenCorner && (
                <>
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner top-0 left-0" data-ai-hint={darkGreenCorner.imageHint} />
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner top-0 right-0 transform scale-x-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner bottom-0 left-0 transform scale-y-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner bottom-0 right-0 transform scale-x-[-1] scale-y-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
                </>
             )}
=======
        <div className="inner-card-solid w-[90vw] sm:w-full p-6 sm:p-8">
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
            <Sparkles />
            <h2 className="text-3xl font-headline font-bold text-accent mb-4">दिनांक</h2>
            <div className="my-6">
                <p className="text-xl text-primary-foreground/80">जुलै</p>
                <div className="flex justify-between items-center my-2">
                    <div className="text-right w-1/3 space-y-1">
                        <hr className="border-accent/50 w-full ml-auto"/>
                        <p className="text-lg">{data.mainDay}</p>
                    </div>
                    <p className="text-8xl font-headline font-bold text-accent mx-4" style={{ WebkitTextStroke: '2px hsl(var(--primary-foreground))', textShadow: '3px 3px 0px hsl(var(--primary) / 0.5)' }}>
                        {data.mainDate}
                    </p>
                     <div className="text-left w-1/3 space-y-1">
                        <hr className="border-accent/50 w-full mr-auto"/>
                        <p className="text-lg">{data.mainTime}</p>
                    </div>
                </div>
                <p className="text-4xl text-primary-foreground/90">{data.mainYear}</p>
            </div>
            <p className="text-md text-primary-foreground/90 max-w-md mx-auto leading-relaxed">
                या शुभमुहूर्तावर करण्याचे योजिले आहे, तरी या मंगलप्रसंगी आपण उपस्थित राहून वधू-वरास शुभाशीर्वाद द्यावेत, ह्यासाठीचे ही अग्रहाचे निमंत्रण.
            </p>
        </div>
      </section>

      {/* Page 3: Schedule */}
      <section className="page fade-in-element p-8">
<<<<<<< HEAD
        <div className="inner-card-solid w-[90vw] sm:w-full p-6 sm:p-8 relative overflow-hidden">
             {data.theme === 'theme-dark-green' && darkGreenCorner && (
                <>
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner top-0 left-0" data-ai-hint={darkGreenCorner.imageHint} />
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner top-0 right-0 transform scale-x-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner bottom-0 left-0 transform scale-y-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner bottom-0 right-0 transform scale-x-[-1] scale-y-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
                </>
             )}
=======
        <div className="inner-card-solid w-[90vw] sm:w-full p-6 sm:p-8">
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
          <Sparkles />
          <h2 className="text-3xl font-bold font-headline mb-8 text-accent">कार्यक्रमाची रूपरेषा</h2>
          <div className="space-y-6 w-full max-w-md mx-auto px-6 sm:px-0">
            {data.schedule.map((event, index) => (
              <div key={index} className="fade-in-element text-center border-b-2 border-dashed border-accent/50 pb-4 last:border-none">
                <h3 className="text-2xl font-bold text-primary-foreground">{event.name}</h3>
                <p className="text-lg text-primary-foreground/80">{event.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Page 4: Venue */}
      <section className="page fade-in-element p-8">
<<<<<<< HEAD
        <div className="inner-card-solid w-[90vw] sm:w-full p-6 sm:p-8 relative overflow-hidden">
            {data.theme === 'theme-dark-green' && darkGreenCorner && (
                <>
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner top-0 left-0" data-ai-hint={darkGreenCorner.imageHint} />
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner top-0 right-0 transform scale-x-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner bottom-0 left-0 transform scale-y-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
                  <Image src={darkGreenCorner.imageUrl} alt={darkGreenCorner.description} width={160} height={160} className="floral-corner bottom-0 right-0 transform scale-x-[-1] scale-y-[-1]" data-ai-hint={darkGreenCorner.imageHint} />
                </>
            )}
=======
        <div className="inner-card-solid w-[90vw] sm:w-full p-6 sm:p-8">
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
          <Sparkles />
          <h2 className="text-3xl font-bold font-headline mb-8 text-accent">स्थळ</h2>
          <div className="flex flex-col items-center gap-4">
            <MapPin className="w-16 h-16 text-accent" />
            <p className="text-4xl font-bold">{data.venueName}</p>
            <p className="text-2xl">{data.venueCity}</p>
            <Button asChild className="mt-6">
              <a 
                href={data.venueMapLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                नकाशा पहा
              </a>
            </Button>
            <p className="mt-8 text-lg">आपली उपस्थिती प्रार्थनीय आहे.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
