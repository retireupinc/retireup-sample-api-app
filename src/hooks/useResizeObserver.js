import React from "react";

const useResizeObserver = (containerRef, onResize) => {
  const [ro, setRO] = React.useState();
  const [size, setSize] = React.useState();

  const initResizeObserver = React.useCallback(
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

          if (onResize == null) {
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

  React.useLayoutEffect(() => {
    if (containerRef.current != null && ro == null) {
      if (window.ResizeObserver) {
        initResizeObserver(window.ResizeObserver);
      } else {
        import("resize-observer-polyfill").then((mod) => {
          initResizeObserver(mod.default);
        });
      }
    }
    let node;
    if (ro != null && containerRef.current != null) {
      node = containerRef.current;
      ro.observe(node);
    }
    return () => {
      if (ro != null && ro.unobserve != null) {
        ro.unobserve(node);
      }
    };
  }, [ro, initResizeObserver, containerRef]);

  if (onResize == null) {
    return size;
  }
};

export default useResizeObserver;
