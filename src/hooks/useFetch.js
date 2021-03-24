import { useRef, useState, useEffect } from "react";

const useFetch = (promiseOrFunction, isImmediate = false, inputs) => {
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
        .catch((error) => {
          if (!isSubscribed) {
            return null;
          }

          const newState = {
            ...state,
            error: {
              code: error.response?.status ?? 500,
              error:
                error.response?.data?.error_description ??
                error.response?.statusText,
              error_description:
                typeof error.response?.data === "string"
                  ? error.response?.data
                  : error.response?.data?.error_description,
            },
            isPending: false,
          };

          if (error.response?.data?.errors) {
            newState.error.errors = error.response.data.errors;
          }

          setState(newState);
        });
    } else {
      didMountRef.current = true;
    }
    return () => (isSubscribed = false);
  }, inputs); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, error, isPending } = state;
  return [data, error, isPending];
};

export default useFetch;
