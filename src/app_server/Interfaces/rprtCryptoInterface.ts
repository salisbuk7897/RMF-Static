export interface crypto{
    ccaCoProcessor: type[] | Partial<type[]>
    icsfServices: icsf[] | Partial<icsf[]>
}

export interface type{
    type: string
    lpar: cclparcpc | Partial<cclparcpc>
    cpc: cclparcpc | Partial<cclparcpc>
}

export interface cclparcpc{
    rate: number
    exxecTime: number
    util: number
    keyGenRate: number
}

export interface icsf{
    type: string
    rate: number
    size: number
}