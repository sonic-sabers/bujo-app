import * as React from "react";
import { useInView } from "framer-motion";

interface UseIsInViewOptions {
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
}

function useIsInView<T extends HTMLElement = HTMLElement>(
  ref: React.Ref<T>,
  options: UseIsInViewOptions = {}
) {
  const { inView, inViewOnce = false, inViewMargin } = options;
  const localRef = React.useRef<T>(null);
  React.useImperativeHandle(ref, () => localRef.current as T);
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
  });
  const isInView = !inView || inViewResult;
  return { ref: localRef, isInView };
}

export { useIsInView, type UseIsInViewOptions };
