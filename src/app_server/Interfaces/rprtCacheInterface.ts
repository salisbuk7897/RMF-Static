export interface Cache{
    cacheInterval: CacheInt | Partial<CacheInt>
    cacheSubsystem: CacheSub[] | Partial<CacheSub[]>
}

export interface CacheInt{
    start: string
    interval: string
}

export interface CacheSub{
    name: string
    storageDescriptor: Descriptor | Partial<Descriptor>
    storageAndStatus: storage | Partial<storage>
    cacheOverview: Overview | Partial<Overview>
    miscellaneousCache: Miscellaneous | Partial<Miscellaneous>
    synchronousIO: Synchronous | Partial<Synchronous>
    hostAdapter: Adapter | Partial<Adapter>
    diskActivity: Disk | Partial<Disk>
    cacheDevice: Device | Partial<Device>
}

export interface Descriptor{
    subsystem: string
    physical: string
    subsystemID: string
    typeModel: string
    manufacturer: string
    plant: number
    serialNumber: string
}

export interface storage{
    Configured: string
    available: string
    pinned: number
    offline: number
    nvsConfigured: string
    nvsPinned: number
    nonVolatileStorage: string
    cacheFastWrite: string
}

export interface Overview{
    ioCountTotal: number
    hitRatioTotal: number
    ioCountCache: number
    hitRatioCache: number
    cacheMiss: number
    cacheMissRate: number
    ioRequestCategory: RC[] | Partial<RC[]>
}

export interface RC{
    requestCategory: string
    readCount: number
    writeHitsRatio: number
    readRate: number
    readHits: number
    readHitsRate: number
    readHitsRatio: number
    writeCount: number
    writeRate: number
    fastWrite: number
    fastWriteRate: number
    writeHits: number
    writeHitsRate: number
    readWrite: number
    readMisses: number
    readMissRate: number
    writeMisses: number
    writeMissRate: number
    cacheMissesTracks: number
    cacheMissesTrackRate: number
}

export interface Miscellaneous{
    delayedNVSCount: number
    delayedNVSRate: number
    delayedCacheCount: number
    delayedCacheRate: number
    dfwInhibitCout: number
    dfwInhibitRate: number
    ioCount: number
    ioRate: number
    ckdWrites: number
    ckdWriteHits: number
    cachingReadMisses: number
    cachingWritePromotes: number
}

export interface Synchronous{
    readRequests: number
    readHits: number
    writeRequests: number
    writeHits: number
}
export interface Adapter{
    bytesReqWrite: string
    bytesSecWrite: string
    bytesReqRead: string
    bytesSecRead: string
}

export interface Disk{
    readResponseTime: number
    writeResponseTime: number
    bytesReqRead: number
    bytesSecRead: number
    bytesReqWrite: number
    bytesSecWrite: number
}

export interface Device{
    volumeSerial: VS[] | Partial<VS[]>
}

export interface VS{
    volumeSerial: string
    deviceNumber: number
    extentPoolID: number
    ioOfTotal: number
    ioRate: number
    cacheHitReadRate: number
    cacheHitDFWRate: number
    cacheHitCFWRate: number
    dasdStageRate: number
    dasdOperationsDelaybyNVS: number
    dasdOperationsDelaybyCache: number
    asyncRate: number
    totlHitRatio: number
    readHitRatio: number
    writeHitRatio: number
    readWrite: number
}