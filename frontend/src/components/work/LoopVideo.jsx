import { useEffect, useRef, useState } from "react";

export default function LoopVideo({ hero, base, className, threshold = 0.35 }) {
  const videoRef = useRef(null);
  const [preload, setPreload] = useState("none");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0) {
          setPreload((p) => (p === "none" ? "metadata" : p));
        }
        if (entry.intersectionRatio >= threshold && !reduceMotion) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, threshold] }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [hero, threshold]);

  if (!hero) return null;

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload={preload}
      poster={`${base}/${hero.poster}`}
      className={className}
    >
      <source src={`${base}/${hero.webm}`} type="video/webm" />
      <source src={`${base}/${hero.mp4}`} type="video/mp4" />
    </video>
  );
}
