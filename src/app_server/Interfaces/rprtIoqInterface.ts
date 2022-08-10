export interface IOQ{
    processors: Record<string, Processors | Partial<Processors>>
    logicalControlUnits: Record<string, LCU | Partial<LCU>>
    systemInfo: Info | Partial<Info>
}

export interface Processors{
    initiative: Initiative | Partial<Initiative>
    utilization: Utilization | Partial<Utilization>
    requestRetried: request | Partial<request>
    retries: retry | Partial<retry>
}

export interface Initiative{
    iop: number
    activityRate: number
    qLngth: number
}

export interface Utilization{
    iopBusy: number
    cmprBusy: number
    scmBusy: number
    startRate: number
    interruptRate: number
}

export interface request{
    all: number
    cpBusy: number
    dpBusy: number
    cuBusy: number
    dvBusy: number
}

export interface retry{
    all: number
    cpBusy: number
    dpBusy: number
    cuBusy: number
    dvBusy: number
}

export interface LCU{
    managementGroup: Management | Partial<Management>
    controlUnits: Control | Partial<Control>
}

export interface Info{
    totalSamples: number
    iodfSuffix: string
    iodfDate: string
    iodfTime: string
    configurationState: string
}

export interface Management{
    chanPaths: number
    chanAttribute: number
    status: string
    chpidTaken: number
    dpBusy: number
    cuBusy: number
    cubDly: number
    cmrDly: number
    contentionRate: number
    qLngth: number
    cssDly: number
    hpavWait: number
    hpavMax: number
    openExch: number
    dataTransferConc: number
}

export interface Control{
    amg: string
    lcu: string
    firstCU: number
    secondCU: number
    thirdCU: number
    fourthCU: number
    dcmGroupMin: number
    dcmGroupMax: number
    dcmGroupDefined: number
}