export interface xcf{
    usageBySystem: bySystem | Partial<bySystem>
    usageByMember: byMember | Partial<byMember>
}

export interface bySystem{
    local: System[] | Partial<System[]>
}

export interface System{
    transportClass: string
    status: string
    requestsRejected: number
}

export interface byMember{
    onSystem: Member[] | Partial<Member[]>
}

export interface Member{
    group: string
    member: string
    status: string
    requestOut: number
    requestIn: number
}