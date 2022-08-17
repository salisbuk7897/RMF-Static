export interface OMVS{
    callActivity: cActivity | Partial<cActivity[]>
    processActivity: pActivity[] | Partial<pActivity[]>
    interProcess: pActivity | Partial<pActivity[]>
    generalInfo: Info | Partial<Info>

}

export interface cActivity{
    activity: string
    min: number
    avg: number
    max: number
}

export interface Current{
    min: number
    avg: number
    max: number
}

export interface Overruns{
    min: number
    avg: number
    max: number
}

export interface pActivity{
    process: string
    current: Current | Partial<Current>
    overruns: Overruns | Partial<Overruns>
    maxTotal: number
}

export interface Info{
    totalSamples: number
}