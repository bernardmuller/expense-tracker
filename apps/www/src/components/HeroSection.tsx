import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { InterfacePreview } from "@/components/InterfacePreview";
import type { HeroSectionDocument } from "@/types/cms";

interface HeroSectionProps {
  data?: HeroSectionDocument;
}

export function HeroSection({ data }: HeroSectionProps) {
  // Use provided data or fallback defaults
  const eyebrowText = data?.highlights?.[0]?.label || "Finally,";
  const heading = data?.caption || "A free and open-source";
  const subheading = data?.name || "expense tracker";
  const description =
    data?.description ||
    "Expenny is a free and open-source expense tracker that simplifies the process of tracking, managing, and sharing your expenses.";
  const primaryAction = data?.actions?.[0] || {
    id: 1,
    label: "Get Started",
    link: "#",
    variant: "default" as const,
  };
  const secondaryAction = data?.actions?.[1] || {
    id: 2,
    label: "Learn More",
    link: "#",
    variant: "outline" as const,
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-end pb-16 sm:pb-24 md:pb-32 lg:pb-48 px-4 sm:px-6 lg:px-8 pt-12 mt-12">
      <InterfacePreview />

      <div className="relative z-20 mx-auto max-w-4xl w-full text-center flex flex-col items-center px-2 sm:px-4">
        <div className="mb-4 sm:mb-6 flex justify-center bg-accent/80 px-6 py-3 sm:px-8 sm:py-4 rounded-full max-w-full sm:max-w-72">
          <span className="text-xs sm:text-sm font-semibold text-primary/80 uppercase tracking-wider">
            {eyebrowText}
          </span>
        </div>

        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground text-balance font-grotesk leading-tighter">
            {heading}
          </h1>
          <h1 className="mb-4 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter font-grotesk leading-tighter text-primary">
            {subheading}
          </h1>
        </div>

        <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed px-2">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto">
          <a
            href={primaryAction.link}
            target="_blank"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant={primaryAction.variant}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              {primaryAction.label}
              {/*<ArrowRight className="w-4 h-4 ml-2" />*/}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
