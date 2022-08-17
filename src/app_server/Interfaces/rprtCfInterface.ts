export interface CF{
    cf: RPRTCF[] | Partial<RPRTCF[]>
}

export interface RPRTCF{
    name: string
    usageSummary: Usage | Partial<Usage>
}

export interface Usage{
    totalSamples: Samples | Partial<Samples>
    couplingFacility: Facility | Partial<Facility>
    logicalProcessors: Processors | Partial<Processors>
}

export interface Samples{
    average: number
    maximum: number
    minimum: number
}

export interface Facility{
    type: string
    model: string
    level: number
    dynamicDispatch: string
    cfUtilization: number
}

export interface Processors{
    defined: number
    effective: number
}