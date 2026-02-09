import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { InterfacePreview } from "@/components/InterfacePreview";
import type { HeroSectionDocument } from "@/types/cms";

interface HeroSectionProps {
  data?: HeroSectionDocument;
}

export function HeroSection({ data }: HeroSectionProps) {
  const eyebrowText = data?.highlights?.[0]?.label || "Build Financial Habits";
  const heading = data?.caption || "Take Control of Your Finances with";
  const subheading = data?.name || "Expenny";
  const description =
    data?.description ||
    "Expenny is a free and open-source expense tracker that helps you with financial clarity";
  const primaryAction = data?.actions?.[0] || {
    id: 1,
    label: "Get Started",
    link: "#",
    variant: "default" as const,
  };
  const videoUrl = data?.video?.url;

  return (
    <section className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden border-b py-24">
      <div className="relative z-10 flex flex-col items-center gap-y-6 w-full">
        <InterfacePreview videoUrl={videoUrl} />

        <div className="relative z-10 flex max-w-2xl flex-col items-center gap-y-6 px-4 xs:px-0 text-center">
          <div className="mb-2 flex justify-center bg-accent/80 px-6 py-3 sm:px-6 sm:py-3 rounded-full">
            <span className="text-xs sm:text-sm font-semibold text-primary/80 uppercase tracking-wider">
              {eyebrowText}
            </span>
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground text-balance leading-tighter">
              {heading}
            </h1>
            <h1 className="mt-1 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary text-balance leading-tighter">
              {subheading}
            </h1>
          </div>

          <p className="max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={primaryAction.link}
              target="_blank"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant={primaryAction.variant}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto group"
              >
                {primaryAction.label}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        role="presentation"
        className="absolute start-1/2 bottom-8 -translate-x-1/2"
      >
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-muted-foreground/30 p-1.5 animate-bounce">
          <div className="h-1.5 w-1 rounded-full bg-muted-foreground/50"></div>
        </div>
      </div>
    </section>
  );
}
