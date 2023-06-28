export function eventbus(config) {
  const bus = {};

  const on = (key, handler) => {
    if (bus[key] === undefined) {
      bus[key] = [];
    }
    bus[key]?.push(handler);

    // unsubscribe function
    return () => {
      off(key, handler);
    };
  };

  const off = (key, handler) => {
    const index = bus[key]?.indexOf(handler) ?? -1;
    bus[key]?.splice(index >>> 0, 1);
  };

  const emit = (key, payload) => {
    bus[key]?.forEach((fn) => {
      try {
        fn(payload);
      } catch (e) {
        config?.onError(e);
      }
    });
  };
  const once = (key, handler) => {
    const handleOnce = (payload) => {
      handler(payload);
      off(key, handleOnce);
    };

    on(key, handleOnce);
  };
  return { on, off, emit, once };
}
