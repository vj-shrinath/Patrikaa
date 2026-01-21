"use client";

import type { InvitationData } from "@/lib/initial-data";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { WelcomeSection, DateSection, ScheduleSection, VenueSection, CoupleSection, TopBannerSection, CustomCardSection, CreatorFooterSection } from "./sections";
import { FallingLeaves } from "./falling-leaves";

type InvitationCardProps = {
  data: InvitationData;
};

export function InvitationCard({ data }: InvitationCardProps) {
  const containerRef = useScrollAnimation() as React.RefObject<HTMLDivElement>;

  // Default order if not provided
  const order = data.sectionOrder || ['welcome', 'couple', 'date', 'schedule', 'venue'];

  const renderSection = (section: string) => {
    if (section.startsWith('custom-')) {
      return <CustomCardSection key={section} data={data} sectionId={section} />;
    }

    switch (section) {
      case 'welcome':
        return <WelcomeSection key="welcome" data={data} />;
      case 'couple':
        return <CoupleSection key="couple" data={data} />;
      case 'date':
        return <DateSection key="date" data={data} />;
      case 'schedule':
        return <ScheduleSection key="schedule" data={data} />;
      case 'venue':
        return <VenueSection key="venue" data={data} />;
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className={cn("text-center font-body text-primary-foreground relative flex flex-col bg-background gap-2 sm:gap-4", data.theme)}>
      {data.theme === 'theme-autumn-floral' && <FallingLeaves />}
      <TopBannerSection data={data} />
      {order.map(section => renderSection(section))}
      <CreatorFooterSection data={data} />
    </div>
  );
}
