"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useScrollAnimation
 * Returns a ref and a boolean `isVisible`.
 * Attach the ref to any element — `isVisible` becomes true once it
 * enters the viewport.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  threshold = 0.15,
  rootMargin = "0px"
): { ref: React.RefObject<T>; isVisible: boolean } {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref: ref as unknown as React.RefObject<T>, isVisible };
}
