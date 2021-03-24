import { useState, useCallback, useLayoutEffect } from "react";

const useResizeObserver = (containerRef, onResize) => {
  const [ro, setRO] = useState();
  const [size, setSize] = useState();

  const initResizeObserver = useCallback(
    (ResizeObserver) => {
      const ro = new ResizeObserver((entries) => {
        // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
        window.requestAnimationFrame(() => {
          if (!Array.isArray(entries) || !entries.length) {
            return;
          }

          const e = entries[0];
          const width = e.target.clientWidth;
          const height = e.target.clientHeight;

          if (!onResize) {
            setSize({
              width,
              height,
            });
          } else {
            onResize({
              width,
              height,
            });
          }
        });
      });

      setRO(ro);
    },
    [onResize]
  );

  useLayoutEffect(() => {
    if (containerRef.current && !ro) {
      initResizeObserver(window.ResizeObserver);
    }

    let node;
    if (ro && containerRef.current) {
      node = containerRef.current;
      ro.observe(node);
    }

    return () => {
      if (ro && ro.unobserve) {
        ro.unobserve(node);
      }
    };
  }, [ro, initResizeObserver, containerRef]);

  if (!onResize) {
    return size;
  }
};

export default useResizeObserver;
