export interface eadm{
    device: device | Partial<device>
    compression: compression | Partial<compression>
    storage: storage | Partial<storage>
}

export interface device{
    totalSSCH: number
    sschRate: number
    pendingTime: number
    responseTime: number
    queueTime: number
}

export interface compression{
    compressionRR: number
    compressionThroughput: number
    compressionRatio: number
    decompressionRR: number
    decompressionThroughput: number
    decompressionRatio: number
}

export interface storage{
    id: string
    lparUtil: number
    totalUtil: number
    lparRead: number
    totalRead: number
    lparWrite: number
    totalWrite: number
    lparRR: number
    totalRR: number
    lparResponse: number
    totalResponse: number
    totalQueue: number
    lparRequests: number
    totalRequests: number
}