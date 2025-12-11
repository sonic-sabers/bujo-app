"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useGSAP<T extends HTMLElement = HTMLDivElement>() {
  const elementRef = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline();
    timelineRef.current = timeline;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return { elementRef, timelineRef };
}

export function useFadeIn<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const { elementRef } = useGSAP<T>();

  useEffect(() => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay, ease: "power3.out" }
      );
    }
  }, [delay]);

  return elementRef;
}

export function useStaggerChildren<T extends HTMLElement = HTMLDivElement>(
  stagger = 0.1
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (containerRef.current) {
      const children = containerRef.current.children;
      gsap.fromTo(
        children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger,
          ease: "power3.out",
        }
      );
    }
  }, [stagger]);

  return containerRef;
}

export function useHoverScale<T extends HTMLElement = HTMLDivElement>(
  scale = 1.05
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [scale]);

  return elementRef;
}
