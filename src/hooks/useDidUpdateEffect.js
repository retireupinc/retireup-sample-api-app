import { useRef, useEffect } from "react";

const useDidUpdateEffect = (fn, deps) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      fn();
    } else {
      didMountRef.current = true;
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useDidUpdateEffect;
