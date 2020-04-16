import mediaMatcher from './mediaMatcher';
import type { MediaQueryString, RegisterCallback } from './mediaMatcher';

export const on = (
  mediaQueryString: MediaQueryString,
  callback: RegisterCallback
): MediaQueryList => {
  return mediaMatcher.register(mediaQueryString, callback);
};

export const off = (
  mediaQueryString: MediaQueryString,
  callback: RegisterCallback
): void => {
  mediaMatcher.unregister(mediaQueryString, callback);
};
