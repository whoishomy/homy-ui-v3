export const Platform = {
  OS: 'ios',
  select: (obj: any) => obj.ios,
};

export const NativeModules = {
  HealthKitManager: {
    initialize: async () => true,
    requestPermissions: async () => true,
    startMonitoring: async () => {},
    stopMonitoring: () => {},
  },
};

export class NativeEventEmitter {
  constructor(nativeModule: any) {}

  addListener(eventType: string, listener: Function) {
    return {
      remove: () => {},
    };
  }
}
