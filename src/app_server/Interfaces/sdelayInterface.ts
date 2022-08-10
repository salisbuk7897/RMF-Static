export interface Sdelay{
    summary: Summary | Partial<Summary>
    details: Details | Partial<Details>
}

export interface Summary{
    locks: Locks[] | Partial<Locks[]>
    setCreator: Creator[] | Partial<Creator[]>
    enqueue: Enqueue[] | Partial<Enqueue[]>
}

export interface Locks{
    type: string
    totalContentionTime: number
    avgContentionTime: number
    totalContentionCount: number
    contentionCountWithQlen: number
}

export interface Creator{
    totalContentionTime: number
    avgContentionTime: number
    stdDevContentionTime: number
    totalContentionCount: number
}

export interface Enqueue{
    scope: string
    totalContentionTime: number
    avgContentionTime: number
    stdDevContentionTime: number
    totalRequestCount: number
    totalContentionCount: number
}

export interface Details{
    cmlAndLocalLock: Local[] | Partial<Local[]>
    grsLatch: GRS[] | Partial<GRS[]>
    grsEnqueue: GRSE[] | Partial<GRSE[]>
}

export interface Local{
    addressSpace: string
    jobName: string
    serviceClassName: string
    serviceClassPeriod: string
    cmlLockOwner: Contention | Partial<Contention>
    localLock: Contention | Partial<Contention>
    cmlLockRequestor: Contention | Partial<Contention>
}

export interface Contention{
    totalContentionTime: number
    avgContentionTime: number
    totalContentionCount: number
    contentionCountWithQlen: number
}

export interface GRS{
    addressSpace: string
    jobName: string
    serviceClassName: string
    serviceClassPeriod: string
    latchSetCreator: grsContention | Partial<grsContention>
    latchRequestor: grsContention | Partial<grsContention>
}

export interface grsContention{
    totalContentionTime: number
    avgContentionTime: number
    totalContentionCount: number
    stdDevContentionTime: number
}

export interface GRSE{
    addressSpace: string
    jobName: string
    serviceClassName: string
    serviceClassPeriod: string
    enqStep: grseContention | Partial<grseContention>
    enqSystem: grseContention | Partial<grseContention>
    enqSystems: grseContention | Partial<grseContention>
}

export interface grseContention{
    totalContentionTime: number
    avgContentionTime: number
    contentionCount: number
    stdDevContentionTime: number
    requestCount: number
}