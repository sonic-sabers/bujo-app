import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const fadeInUp = (element: HTMLElement, delay = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay,
      ease: "power3.out",
    }
  );
};

export const fadeInScale = (element: HTMLElement, delay = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.9,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      delay,
      ease: "back.out(1.2)",
    }
  );
};

export const slideInLeft = (element: HTMLElement, delay = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      x: -50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay,
      ease: "power2.out",
    }
  );
};

export const staggerCards = (elements: HTMLElement[], stagger = 0.1) => {
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger,
      ease: "power3.out",
    }
  );
};

export const hoverScale = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true });

  tl.to(element, {
    scale: 1.05,
    duration: 0.3,
    ease: "power2.out",
  });

  return tl;
};

export const magneticEffect = (element: HTMLElement, strength = 0.3) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

export const scrollReveal = (elements: HTMLElement[] | NodeListOf<Element>) => {
  Array.from(elements).forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "top 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

export const parallaxEffect = (element: HTMLElement, speed = 0.5) => {
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
};

export const textReveal = (element: HTMLElement) => {
  const text = element.textContent || "";
  const chars = text.split("");

  element.innerHTML = chars
    .map(
      (char) =>
        `<span style="display: inline-block; opacity: 0;">${
          char === " " ? "&nbsp;" : char
        }</span>`
    )
    .join("");

  const spans = element.querySelectorAll("span");

  return gsap.to(spans, {
    opacity: 1,
    duration: 0.05,
    stagger: 0.03,
    ease: "power1.in",
  });
};
