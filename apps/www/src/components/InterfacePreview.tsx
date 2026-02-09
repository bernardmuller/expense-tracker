import { useRef, useEffect } from "react";

export function InterfacePreview() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 4;
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/70 via-50% to-background to-65%" />
      <div className="absolute inset-x-0 top-0 flex justify-center px-4">
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] mt-4 sm:mt-8 md:mt-12 rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-black/50">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-2xl"
          >
            <source src="/product_demo_1.mov" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
