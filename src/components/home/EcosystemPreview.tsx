import { Radio, Smartphone, Users } from "lucide-react";
import { appName, appTagline } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import GsapReveal from "@/components/ui/GsapReveal";
import HomeImageCard from "@/components/home/HomeImageCard";
import SacredSectionBackdrop from "@/components/home/SacredSectionBackdrop";

export default function EcosystemPreview() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <SacredSectionBackdrop motif="constellation" className="opacity-35" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Beyond the Website"
          title="An ecosystem of support"
          subtitle="Guidance that travels with you across app, community and live sessions."
        />

        <div className="mt-14 grid gap-7 lg:grid-cols-3">
          <GsapReveal y={50}>
            <HomeImageCard
              href="/app"
              image="/images/home-cards/shakti-app.png"
              alt={appName}
              eyebrow="App"
              title={appName}
              description={appTagline}
              cta="Coming soon"
              icon={Smartphone}
              imagePosition="center 42%"
            />
          </GsapReveal>

          <GsapReveal delay={0.1} y={50}>
            <HomeImageCard
              href="/community"
              image="/images/page-heroes/community-hero.png"
              alt="Community"
              eyebrow="Community"
              title="Sacred circles"
              description="Monthly wisdom, shared reflection and Q&A with Manisha."
              cta="Join community"
              icon={Users}
              imagePosition="68% center"
            />
          </GsapReveal>

          <GsapReveal delay={0.2} y={50}>
            <HomeImageCard
              href="/live"
              image="/images/page-heroes/live-hero.png"
              alt="Live Sessions"
              eyebrow="Live"
              title="Live sessions"
              description="Online sessions and interactive workshops from anywhere."
              cta="Attend live"
              icon={Radio}
              imagePosition="64% center"
            />
          </GsapReveal>
        </div>
      </div>
    </section>
  );
}
