export interface crypto{
    ccaCoProcessor: Record<string, type | Partial<type>> 
    icsfServices: Record<string, icsf | Partial<icsf>>;
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
    rate: number
    size: number
}