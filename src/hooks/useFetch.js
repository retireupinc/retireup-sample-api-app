import { useState, useEffect } from "react";

const areAllDefined = (deps) =>
  deps.every((i) => typeof i !== "undefined" && i !== null);

const useFetch = (promiseOrFunction, deps = []) => {
  if (!Array.isArray(deps)) {
    throw new Error(`"deps" must be set to an array or undefined.`);
  }

  const shouldFetch = deps.length < 1 || areAllDefined(deps);

  const [state, setState] = useState({
    data: null,
    error: null,
    isPending: shouldFetch,
  });

  useEffect(() => {
    let isSubscribed = true;
    if (shouldFetch) {
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
    }

    return () => (isSubscribed = false);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, error, isPending } = state;
  return [data, error, isPending];
};

export default useFetch;
