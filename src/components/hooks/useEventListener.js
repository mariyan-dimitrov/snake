import { useEffect, useRef } from "react";

const useEventListener = (eventName, callback, element = document) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;

    if (!isSupported) {
      return;
    }

    const eventListener = event => savedCallback.current(event);

    element.addEventListener(eventName, eventListener, false);

    return () => {
      element.removeEventListener(eventName, eventListener, false);
    };
  });
};

export default useEventListener;
