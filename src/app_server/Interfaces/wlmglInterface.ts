export interface WLMGL{
    policyActivation: Activation | Partial<Activation>
    classes: SClass[] | Partial<SClass[]>
    workload: Workload[] | Partial<Workload[]>
    servicePolicy: Policy | Partial<Policy>
}

export interface SClass{
    serviceClass?: SC | Partial<SC>
    transactions?: Transactions | Partial<Transactions>
    transactionTime?: tTime | Partial<tTime>
    transactionApplicationTime?: TAT[] | Partial<TAT[]>
    enclaves?: Enclaves | Partial<Enclaves>
    service?: Service | Partial<Service>
    serviceTime?: sTime | Partial<sTime>
    applicationTime?: aTime | Partial<aTime>
    promotedTransaction?: Promoted | Partial<Promoted>
    dasdIO?: dasd | Partial<dasd>
    sharedFrames?: Frames | Partial<Frames>
    pageInRates?: Rates | Partial<Rates>
    goalSummary?: Summary[] | Partial<Summary[]>
}

export interface Summary{
    period: number
    importance: number
    performanceIndex: number
    numberOfTransactions: number
    percentageOfTransactions: number
    responseTimeGoal: number
    responseTimeActual: number
    responseTimeTotal: number
    executionVelocityGoal: number
    executionVelocityActual: number
    totalUsing: number
    executionDelay: number
}

export interface Activation{
    date: string
    time: string
}

export interface Policy{
    serviceDefinition: Definition | Partial<Definition>
    serviceDefinitionCoefficients: Coefficients | Partial<Coefficients>
    normalizationFactors: Factors | Partial<Factors>
    systems: Systems[] | Partial<Systems[]>
}

export interface Definition{
    name: string
    description: string
    installDate: string
    installTime: string
    installedBy: string
    policy: string
    policyDescription: string
    goalManagement: string
    aliasManagement: string
    priorityManagement: string
}

export interface Coefficients{
    ioc: number
    cpu: number | "N/A"
    srb: number | "N/A"
    mso: number | "N/A"
}

export interface Factors{
    zaap: number
    ziip: number
}

export interface Systems{
    systemID: string
    member: number | "N/A"
    su: number | "N/A"
    capacity: number | "N/A"
    time: string
    interval: string
    boost: string
}

export interface SC{
    policy: string
    workload: string
    serviceClass: string
    description: string
    resourceGroup: string
    critical: string
    honorPriority: string
    message: Message | Partial<Message>
}

export interface Message{
    description: string
    severity: string
}

export interface Workload{
    details?: NoName | Partial<NoName>
    transactions?: Transactions | Partial<Transactions>
    transactionTime?: tTime | Partial<tTime>
    transactionApplicationTime?: TAT[] | Partial<TAT[]>
    enclaves?: Enclaves | Partial<Enclaves>
    service?: Service | Partial<Service>
    serviceTime?: sTime | Partial<sTime>
    applicationTime?: aTime | Partial<aTime>
    promotedTransaction?: Promoted | Partial<Promoted>
    dasdIO?: dasd | Partial<dasd>
    sharedFrames?: Frames | Partial<Frames>
    pageInRates?: Rates | Partial<Rates>
    goalSummary?: Summary[] | Partial<Summary[]>
}

export interface NoName{
    policy: string
    workload: string
    description: string
}

export interface Transactions{
    average: number
    mpl: number
    ended: number
    endedSec: number
    swaps: number
    executed: number
}

export interface tTime{
    actual: string
    executed: string
    queued: string
    resource: string
    ineligible: string
    conversion: string
    stDev: string
}

export interface TAT{
    category: string
    cp: number | "N/A"
    ziipOrzaapOnCP: number | "N/A"
    ziipOrzaap: number | "N/A"
}

export interface Enclaves{
    average: number | "N/A"
    remote: number | "N/A"
    multiSystems: number | "N/A"
}

export interface Service{
    ioc: number
    cpu: number | "N/A"
    mso: number | "N/A"
    srb: number | "N/A"
    total: number | "N/A"
    perSecond: number | "N/A"
    absorptionRate: number | "N/A"
    serviceRate: number | "N/A"
}

export interface sTime{
    cpu: number | "N/A"
    srb: number | "N/A"
    rct: number | "N/A"
    ioInterrupts: number | "N/A"
    hyperSpace: number | "N/A"
    ziip: number | "N/A"
    zaap: number | "N/A"
}

export interface aTime{
    cp: number | "N/A"
    ziipOnCP: number | "N/A"
    zaapOnCP: number | "N/A"
    ziip: number | "N/A"
    zaap: number | "N/A"
}

export interface Promoted{
    blocked: number | "N/A"
    enqueue: number | "N/A"
    crm: number | "N/A"
    lock: number | "N/A"
    sup: number | "N/A"
}

export interface dasd{
    ssch: number | "N/A"
    responseTime: number | "N/A"
    connectTime: number | "N/A"
    disconnectTime: number | "N/A"
    pendingTime: number | "N/A"
    iosQueueTime: number | "N/A"
}

export interface Frames{
    average: number | "N/A"
    total: number | "N/A"
    shared: number | "N/A"
}

export interface Rates{
    single: number | "N/A"
    blocked: number | "N/A"
    shared: number | "N/A"
    hyperSpace: number | "N/A"
}