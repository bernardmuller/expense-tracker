import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="container py-20 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          Smart Budget Management
        </div>
        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Take Control of Your Finances with{" "}
          <span className="text-primary">Expense Tracker</span>
        </h1>
        <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl lg:text-2xl">
          Stop wondering where your money goes. Track expenses in real-time,
          manage budgets effortlessly, and achieve financial clarity with our
          intuitive budget management app.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="gap-2">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  );
}
