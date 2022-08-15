export interface xcf{
    usageBySystem: bySystem[] | Partial<bySystem[]>
    usageByMember: byMember[] | Partial<byMember[]>
}

export interface bySystem{
    transportClass: string
    status: string
    requestsRejected: number
}

export interface byMember{
    onSystem: System[] | Partial<System[]>
}

export interface System{
    group: string
    member: string
    status: string
    requestOut: number
    requestIn: number
}