import { useRef, useState, useEffect } from "react";

const useFetch = (promiseOrFunction, isImmediate = false, deps) => {
  const didMountRef = useRef(isImmediate);

  const [state, setState] = useState({
    data: null,
    error: null,
    isPending: isImmediate,
  });

  useEffect(() => {
    let isSubscribed = true;
    if (isImmediate || didMountRef.current) {
      if (!state.isPending) {
        setState({
          ...state,
          isPending: true,
        });
      }

      const promise =
        typeof promiseOrFunction === "function"
          ? promiseOrFunction()
          : promiseOrFunction;

      promise
        .then((data) =>
          isSubscribed
            ? setState({ data, error: null, isPending: false })
            : null
        )
        .catch((error) =>
          isSubscribed ? setState({ ...state, error, isPending: false }) : null
        );
    } else {
      didMountRef.current = true;
    }

    return () => (isSubscribed = false);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, error, isPending } = state;
  return [data, error, isPending];
};

export default useFetch;
