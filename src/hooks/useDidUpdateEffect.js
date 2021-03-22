import { useRef, useEffect } from "react";

const useDidUpdateEffect = (fn, inputs) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      fn();
    } else {
      didMountRef.current = true;
    }
  }, inputs); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useDidUpdateEffect;
