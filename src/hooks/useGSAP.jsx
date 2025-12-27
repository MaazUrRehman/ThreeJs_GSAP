import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const useGSAP = (callback, dependencies = []) => {
  const scope = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (callback) {
        callback();
      }
    }, scope);

    return () => ctx.revert();
  }, dependencies);

  return scope;
};

export default useGSAP;