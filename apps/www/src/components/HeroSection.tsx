import { Button } from "@/components/ui/button";
import { cmsClient } from "@/lib/cms-client";
import { ArrowRight } from "lucide-react";
import type { HeroSectionDocument } from "@/types/cms";

export async function HeroSection() {
  const res = await cmsClient.heroSection.find({
    populate: ["highlights", "actions"],
  });
  const data: HeroSectionDocument = res.data;
  return (
    <section className="container py-20 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {data.highlights.map((h) => (
          <div
            key={h.id}
            className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          >
            {h.label}
          </div>
        ))}
        <div className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          <h2>{data.caption}</h2>
          <h1 className="text-primary">{data.name}</h1>
        </div>
        <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl lg:text-2xl">
          {data.description}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {data.actions.map((h) => (
            <a href={h.link} target="_blank">
              <Button
                key={h.id}
                size="lg"
                variant={h.variant}
                className="gap-2"
              >
                {h.label} {h.link && <ArrowRight className="h-4 w-4" />}
              </Button>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
