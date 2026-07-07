import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export const useGSAP = (callback, dependencies = []) => {
  const scope = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context((context) => {
      callback(context);
    }, scope);

    return () => ctx.revert();
  }, dependencies);

  return scope;
};
