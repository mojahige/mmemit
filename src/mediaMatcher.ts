export type MediaQueryString = string;

export type CallbackArguments = MediaQueryList | MediaQueryListEvent;

export type Callback = (mediaQueryList: CallbackArguments) => void;

export type RegisterCallback = Callback;

export type RegisteredCallbacks = Callback[];

export type RegisteredData = {
  mediaQueryString: MediaQueryString;
  mediaQueryList: MediaQueryList;
  callbacks: RegisteredCallbacks;
};

export type RegisteredDataMap = {
  [key: string]: RegisteredData;
};

export class MediaMatcher {
  registeredDataMap: RegisteredDataMap;

  constructor() {
    this.registeredDataMap = {};
    this.onChangeMatches = this.onChangeMatches.bind(this);
  }

  private addCallback(
    registeredCallbacks: RegisteredCallbacks,
    addCallback: RegisterCallback
  ): void {
    registeredCallbacks.push(addCallback);
  }

  private removeCallback(
    registeredCallbacks: RegisteredCallbacks,
    removeCallback: RegisterCallback
  ): void {
    const index = registeredCallbacks.indexOf(removeCallback);

    if (index > -1) {
      registeredCallbacks.splice(index, 1);
    }
  }

  private createRegistrationData(
    mediaQueryString: MediaQueryString
  ): RegisteredData {
    const mediaQueryList = window.matchMedia(mediaQueryString);

    mediaQueryList.addListener(this.onChangeMatches);

    return {
      mediaQueryString,
      mediaQueryList,
      callbacks: [],
    };
  }

  private registration(mediaQueryString: MediaQueryString): RegisteredData {
    this.registeredDataMap[mediaQueryString] = this.createRegistrationData(
      mediaQueryString
    );

    return this.registeredDataMap[mediaQueryString];
  }

  private unregistration({
    mediaQueryString,
    mediaQueryList,
  }: RegisteredData): void {
    mediaQueryList.removeListener(this.onChangeMatches);

    delete this.registeredDataMap[mediaQueryString];
  }

  private onChangeMatches = (event: MediaQueryListEvent): void => {
    const registeredData = this.findRegisteredData(event);

    if (registeredData) {
      this.fire(event, registeredData.callbacks);
    }
  };

  /**
   * 登録した時のメディアクエリストリングと、MediaQueryList.media がブラウザで差異がある (IE おまえのことだぞ) ので、
   * 実際に登録されている MediaQueryList.media と照らし合わせてデータを返却する。
   */
  private findRegisteredData(
    mediaQueryList: MediaQueryListEvent
  ): RegisteredData | undefined {
    if (!mediaQueryList) {
      return undefined;
    }

    const { media } = mediaQueryList;

    return Object.values(this.registeredDataMap).find(
      (data) => data.mediaQueryList.media === media
    );
  }

  private fire(
    mediaQueryListEvent: MediaQueryListEvent,
    callbacks: RegisteredCallbacks
  ): void {
    callbacks.forEach((callback) => callback(mediaQueryListEvent));
  }

  register(
    mediaQueryString: MediaQueryString,
    callback: RegisterCallback
  ): MediaQueryList {
    const registeredData =
      this.registeredDataMap[mediaQueryString] ??
      this.registration(mediaQueryString);

    this.addCallback(registeredData.callbacks, callback);

    return registeredData.mediaQueryList;
  }

  unregister(
    mediaQueryString: MediaQueryString,
    callback: RegisterCallback
  ): void {
    const registeredData = this.registeredDataMap[mediaQueryString];

    if (registeredData === undefined) {
      return;
    }

    this.removeCallback(registeredData.callbacks, callback);

    if (!registeredData.callbacks.length) {
      this.unregistration(registeredData);
    }
  }
}

export default new MediaMatcher();
