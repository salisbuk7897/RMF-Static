export interface Vstor{
    commonStorage: CS | Partial<CS>
}

export interface CS{
    info: Info | Partial<Info>
    staticStorageMap: Map[] | Partial<Map[]>
    allocatedCSAbyKey: CSABK[] | Partial<CSABK[]>
    allocatedSQA: SQA[] | Partial<SQA[]>
    freeSpace: FreeSpace | Partial<FreeSpace>
    noName: NoName[] | Partial<NoName[]>
    plpa: PLPA | Partial<PLPA>
}

export interface Info{
    samples: number
}

export interface Map{
    area: string
    address: string
    size: string
}

export interface CSABK{
    key: string
    below16M: Time | Partial<Time>
    above16M: Time | Partial<Time>
}

export interface Time{
    min: string
    minTime: string
    max: string
    maxTime: string
    avg: string
}

export interface SQA{
    area: string
    below16M: Time | Partial<Time>
    above16M: Time | Partial<Time>
}

export interface FreeSpace{
    userRegionBelow16m: string
    userRegionAbove16m: string
}

export interface NoName{
    category: string
    below16M: Time | Partial<Time>
    above16M: Time | Partial<Time>
}

export interface PLPA{
    plpaSpace: string
    eplpaSpace: string
    plpaRedundantSpace: string
    eplpaRedundantSpace: string
}