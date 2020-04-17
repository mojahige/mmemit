type Callback = (mediaQueryList: MediaQueryListEvent) => void;
type On = (callback: Callback) => void;
type Off = () => void;
type Matches = () => boolean;
type MMEMIT = [On, Off, Matches];

export default function mmemit(mediaQueryString: string): MMEMIT {
  let changeCallback: Callback | null = null;
  let mediaQueryList: MediaQueryList | null = window.matchMedia(
    mediaQueryString
  );

  const onChange = (event: MediaQueryListEvent): void => {
    if (changeCallback !== null) {
      changeCallback(event);
    }
  };

  const on: On = (callback: Callback) => {
    changeCallback = callback;
  };

  const off: Off = () => {
    changeCallback = null;

    if (mediaQueryList) {
      mediaQueryList.removeEventListener('change', onChange);
      mediaQueryList = null;
    }
  };

  const matches: Matches = () => {
    return mediaQueryList ? mediaQueryList.matches : false;
  };

  mediaQueryList.addEventListener('change', onChange);

  return [on, off, matches];
}
