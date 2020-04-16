type Callback = (mediaQueryList?: MediaQueryListEvent) => void;

export default function mmemit(mediaQueryString: string): any {
  if (!mediaQueryString) return null;

  let changeCallback: Callback | null = null;
  const mediaQueryList = window.matchMedia(mediaQueryString);

  const on = (callback: Callback): void => {
    changeCallback = callback;
  };

  const off = (): void => {
    changeCallback = null;
  };

  const onChange = (event: MediaQueryListEvent): void => {
    if (changeCallback !== null) {
      changeCallback(event);
    }
  };

  mediaQueryList.addEventListener('change', onChange);

  return [on, off];
}
