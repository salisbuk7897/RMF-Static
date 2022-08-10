export interface Device{
    totalSamples: number
    iodfNameSuffix: string
    iodfCreationDate: string
    iodfCreationTime: string
    configurationState: string
    storageGroup: Record<string, SG | Partial<SG>>
}

export interface SG{
    storageGroup: string
    deviceNumber: number
    deviceType: string
    numberOfCylinders: number
    volumeserialNumber: number
    availablePAvDevices: number
    hyperPAV: number
    lcuNumber: number
    deviceActivityRate: number
    responseTime: number
    iosQueueTime: number
    cmrDelay: number
    deviceBusyDelay: number
    interruptDelayTime: number
    devicePendingTime: number
    deviceDisconnectTime: number
    deviceConnectTimeAVG: number
    deviceConnectTimePercent: number
    deviceUtilized: number
    devicedReserved: number
    numberAllocated: number
    deviceAllocatedPercentage: number
    message: string
}