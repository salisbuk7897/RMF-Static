export interface Paging{
    pagingRate: PagingRate | Partial<PagingRate>
    movementAndRequestRate: mrRate | Partial<mrRate>
    frameAndSlotCount: fsCount | Partial<fsCount>
    objectAndHVSFrames: Frames | Partial<Frames>
}

export interface PagingRate{
    pageMovement: PMovement | Partial<PMovement>
    pageableSystemAddress: Pages[] | Partial<Pages[]>
    addressSpaces: Pages[] | Partial<Pages[]>
    totalSystem: Pages[] | Partial<Pages[]>
}

export interface PMovement{
    pageMovementCStorage: number | "N/A"
    pageMovementTime: number | "N/A"
    pagesPerBlock: number | "N/A"
    blockPerSecond: number | "N/A"
    paginEvents: number | "N/A"
}

export interface Pages{
    pageIn: PageIn | Partial<PageIn>
    pageOut: PageOut | Partial<PageOut>
    category: string
}

export interface PageIn{
    swap: number
    nonSwap: NonSwap | Partial<NonSwap>
    total: Total | Partial<Total>
}

export interface PageOut{
    swap: number
    nonSwap: number
    total: Total | Partial<Total>
}

export interface NonSwap{
    block: number
    nonBlock: number
}

export interface Total{
    rate: number
    percent: number
}

export interface mrRate{
    systemUIC: UIC | Partial<UIC>
    centralStorage: CS[] | Partial<CS[]>
    storageRequests: Rate | Partial<Rate>
}

export interface UIC{
    min : number | "N/A"
    max: number | "N/A"
    avg: number | "N/A"
}

export interface CS{
    pageWrite: number
    pageRead: number
    frameCounts: FrameCounts | Partial<FrameCounts>
    category: string
}

export interface FrameCounts{
    min : number
    max: number
    avg: number
}

export interface Rate{
    getmain: Getmain | Partial<Getmain>
    fixed: Fixed | Partial<Fixed>
    refFaults: Ref | Partial<Ref>
}

export interface Getmain{
    requests: number | "N/A"
    framesBacked: number | "N/A"
}

export interface Fixed{
    req2gb: number | "N/A"
    frames2gb: number | "N/A"
}

export interface Ref{
    first: number | "N/A"
    nonFirst: number | "N/A"
}


export interface fsCount{
    centralStorageFrames: csFrames[] | Partial<csFrames>
    fixedFrames: fxFrames[] | Partial<fxFrames>
    sharedFrames: shFrames[] | Partial<shFrames>
    localPageDataSet: Local[] | Partial<Local>
}

export interface csFrames{
    category: string
    total: number
    available: number
    sqa: number
    lpa: number
    csa: number
    lsqa: number
    regionsSWA: number
    highShared: number
    highCommon: number
}

export interface fxFrames{
    category: string
    total: number
    nucleus: number
    sqa: number
    lpa: number
    csa: number
    lsqa: number
    regionsSWA: number
    below16mb: number
    between16mband2gb: number
}

export interface shFrames{
    category: string
    total: number
    centralStorage: number
    fixedTotal: number
    fixedBelow16MB: number
    high1m: number
    high4k: number
    auxillaryDASD: number
}

export interface Local{
    category: string
    total: number
    available: number
    bad: number
    nonVIO: number
    VIO: number
}

export interface Frames{
    lfAreaMaximum: Area | Partial<Area>
    memoryObjects: Mem[] | Partial<Mem[]>
    oneMBFrames: OneMB[] | Partial<OneMB[]>
    twoGBFrames: TwoGB[] | Partial<TwoGB[]>
    highSharedFrames: Shared[] | Partial<Shared[]>
    highCommonFrames: Common[] | Partial<Common[]>
}

export interface Area{
    oneMBFrames: number | "N/A"
    twoGBFrames: number | "N/A"
}

export interface Mem{
    fixedOneM: number
    fixedTwoG: number
    common: number
    shared: number
    sharedOneM: number
    category: string
}

export interface OneMB{
    fixed: Fixed | Partial<fixed>
    pageable: number
    available: number
    total: number
    category: string
}

export interface TwoGB{
    fixed: fixed | Partial<fixed>
    category: string
}

export interface fixed{
    maximum: number
    available: number
    inUse: number
}

export interface Shared{
    total: number
    centralStorage: number
    backedOneM: number
    auxillaryDASD: number
    category: string
}

export interface Common{
    total: number
    centralStorage: number
    backedOneM: number
    fixed: number
    fixedOneM: number
    auxDasd: number
    category: string
}
