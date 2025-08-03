// src/enums/device_type_enum.ts
export const DeviceType = {
    MOBILE: '1',
    COMPUTER: '2',
    TABLET: '3'
  } as const;
  
  export type DeviceType = typeof DeviceType[keyof typeof DeviceType];
  
  export const DeviceTypeLabels: Record<DeviceType, string> = {
    [DeviceType.MOBILE]: 'Mobile',
    [DeviceType.COMPUTER]: 'Computer',
    [DeviceType.TABLET]: 'Tablet'
  };
  
  export const getDeviceTypeLabel = (deviceType?: string): string => {
    if (!deviceType) return 'Unknown';
    return DeviceTypeLabels[deviceType as DeviceType] || 'Unknown';
  };