export interface domino{
    userActivity: Activity
    task: task
    messages: messages
    accessRates: access
    databaseCache: cache
    vThread: virtual
    pThread: physical
    availability: availability
    buffer: pool
    transaction: transaction
    port: port
}

export interface Activity{
    max: number
    connected: number
    active: active
}

export interface active{
    oneMin: number
    threeMin: number
    fiveMin: number
    fifteenMin: number
    thirtyMin: number
}

export interface task{
    max: number
    current: number
    updates: number
    maxReplics: number
    countReplics: number
}

export interface messages{
    mailBoxes: Record<number , mails[]>
}

export interface mails{
    mailDelivered: msg
    mailSent: msg
    smtpReceived: msg
    smtpSent: msg
}

export interface msg{
    count: number
    rate: number
    size: number
}

export interface access{
    ioRead: number
    ioWrite: number
    pop3Read: number
    imapRead: number
    httpRead: number
    httpWrite: number
}

export interface cache{
    status: string
    maxEntries: number
    curEntries: number
    waterMark: number
    dbOpens: number
    rejections: number
    hits: number
}

export interface virtual{
    max: number
    current: number
}

export interface physical{
    max: number
    current: number
    total: number
}

export interface availability{
    threshold: number
    index: number
}

export interface pool{
    max: number
    current: number
}

export interface transaction{
    ConcurrentTransactions: number | "No Limit"
    count: countTotal
    total: countTotal
}

export interface countTotal{
    type: number
    name: string
    count: number
    total: number
    rate: number
    rtAvg: number
    rtTotal: number
}

export interface port{
    concurrentTransactions: number | "No Limit"
    session: number
    activity: activePort
}

export interface activePort{
    name: string
    sessionsIn: inOut
    sessionsOut: inOut
    sent: number
    received: number
}

export interface inOut{
    count: number
    rate: number
}