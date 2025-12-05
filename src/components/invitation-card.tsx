"use client";

import type { InvitationData } from "@/lib/initial-data";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { WelcomeSection, DateSection, ScheduleSection, VenueSection } from "./sections";
import { FallingLeaves } from "./falling-leaves";

type InvitationCardProps = {
  data: InvitationData;
};

export function InvitationCard({ data }: InvitationCardProps) {
  const containerRef = useScrollAnimation() as React.RefObject<HTMLDivElement>;

  // Default order if not provided
  const order = data.sectionOrder || ['welcome', 'date', 'schedule', 'venue'];

  const renderSection = (section: string) => {
    switch (section) {
      case 'welcome':
        return <WelcomeSection key="welcome" data={data} />;
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
    <div ref={containerRef} className={cn("text-center font-body text-primary-foreground relative flex flex-col", data.theme === 'theme-autumn-floral' ? 'gap-48' : 'gap-8', data.theme)}>
      {data.theme === 'theme-autumn-floral' && <FallingLeaves />}
      {order.map(section => renderSection(section))}
    </div>
  );
}
