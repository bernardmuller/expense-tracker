import { useRef, useEffect } from "react";

interface InterfacePreviewProps {
  videoUrl?: string;
}

export function InterfacePreview({ videoUrl }: InterfacePreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 4;
    }
  }, []);

  return (
    <div className="relative w-full max-w-[200px] sm:max-w-[200px] md:max-w-[320px] lg:max-w-[320px] xl:max-w-[380px] mx-auto px-4 -mb-24 md:-mb-40">
      <div className="relative animate-float">
        <div className="absolute -inset-8 rounded-3xl bg-primary/30 blur-3xl animate-glow-pulse" />
        <div className="relative rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-black/50">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none w-full h-auto rounded-2xl"
          >
            <source src={videoUrl || "/product_demo_1.mov"} type="video/mp4" />
          </video>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-40% via-transparent to-background"
          />
        </div>
      </div>
    </div>
  );
}
