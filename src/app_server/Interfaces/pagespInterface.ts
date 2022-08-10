export interface Pagesp{
    info: Info | Partial<Info>
    dataset: Dataset[] | Partial<Dataset[]>
}

export interface Info{
    totalSamples: number | "N/A"
}

export interface Dataset{
    spaceType: string
    volumeSerial: string
    deviceNumber: string
    deviceType: number
    slots: Slots | Partial<Slots>
    inUse: number
    transferTime: number
    ioRequest: number
    pagesTransferred: number
    vio: number
    datasetName: string
    message: string
}

export interface Slots{
    allocated: number
    usedMin: number
    usedMax: number
    useAvg: number
    badSlots: number
}
