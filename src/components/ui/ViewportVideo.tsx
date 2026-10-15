"use client";

import { useEffect, useRef, useState } from "react";

interface ViewportVideoProps {
  src: string;
  poster?: string;
  className?: string;
  ariaLabel?: string;
}

export default function ViewportVideo({ src, poster, className, ariaLabel }: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry?.isIntersecting ?? false),
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !nearViewport) return;
    void video.play().catch(() => undefined);
    return () => video.pause();
  }, [nearViewport]);

  return <video ref={videoRef} src={nearViewport ? src : undefined} poster={poster} muted loop playsInline preload="none" aria-label={ariaLabel} className={className} />;
}
