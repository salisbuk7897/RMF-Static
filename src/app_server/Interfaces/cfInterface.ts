export interface cf{
    Interval: number;
    cfName: string;
    totalSamples : number;
    cfUsageSummary: CFUsageSummary;
    cfStructureActivity: CFStructureActivity;
    subchannelActivity: SubchannelActivity;
    cfTocfActivity: CF2CFActivity;
}

export interface CFUsageSummary{
    generalStructureSummary: GeneralStructureSummary;
    scmStructureSummary: SCMStructureSummary;
    storageSummary: StorageSummary;
    asynchronousCFDuplexingSummary : ACFDS;
    processorSummary: ProcessorSummary;
}

export interface ProcessorSummary{
    couplingFacility: string;
    model: string;
    cfLevel: string;
    dynDisp: string;
    averageCFUtilization: number;
    logicalProcessorsDefined: number;
    logicalProcessorsEffective: number;
    logicalProcessorsShared: number;
    logicalProcessorsAvgWeight: number;
}

export interface GeneralStructureSummary{
    structures: Structure;
    totalAvgReqSec: number;
    totalPercentageofCFUtil: number;
    totalPercentageofAllReq: number;
    totalNumberReq: number;
    totalPercentageofCFStor: number;
    totalAllocSize: number;
}

export interface SCMStructureSummary{
    scm: SCM;
}

export interface StorageSummary{
    totalCFStorageUsedByStructures: ACDF;
    totalCFDumpStorage: ACDF;
    totalCFAugmentedSpace: ACDF;
    totalCFStorageAvailable: ACDF;
    totalCFStorageSize: number;
    totalControlStorageDefined: CSD;
    totalDataStorageDefined: CSD;
    totalCFStorageClassMemory: CM;
}

export interface ACFDS{
    type: string;
    structureName: string;
    asyncDuplexCFOperations: ADO;
    asyncDuplexSync_UpRequests: ASR;
}

export interface ASR{
    total: number;
    numberSuspend: number;
    suspendTimeAvg: number;
    suspendTimeStdDev: number;
}

export interface ADO{
    total: number;
    transmitTimeAvg: number;
    transmitTimeStdDev: number;
    serviceTimeAvg: number;
    serviceTimeStdDev: number;
}

export interface CM{
    assigned: number;
    percentageInUse: number;
    sumMaxSCM: number;
}

export interface CSD{
    allocSize: number;
    percentageAllocated: number;
}

export interface ACDF{
    totalCFAugmentedSpace: CFAS;
    dumpSpace: DS;
}

export interface SCM{
    type: string;
    structureName: string;
    alg: "KP1" | "UNK";
    scmSpace: "MAX" | "%USED";
    augmented: "EST.MAX" | "%USED";
    lstEntry: "CUR" | "EST.MAX" | "N/A";
    lstElem: "EST.MAX" | "CUR";
    scmRead: "CNT" | "BYTE X'FERRED" | "AVG ST" | "STD_DEV";
    scmWrite: "CNT" | "BYTE X'FERRED" | "AVG ST" | "STD_DEV";
    scmAuxEnabled: "CMD" | "%ALL";
    delayedFaults: "CNT" | "%ALL";
}

export interface Structure{
    type: string;
    structureName: string;
    chg: string;
    enc: "YES" | "NO" | "N/A";
    allocSize: number;
    percentageOfCFStor: number;
    numberOfReq: number;
    percentageOfAllReq: number;
    percentageOfCFUtil: number;
    avgReqSec: number;
    lstOfdirEntries: "TOT" | "CUR" | "N/A";
    dataElements: "TOT" | "CUR";
    lockEntries: "TOT" | "CUR";
    dirRec: number;
}

export interface CFAS{
    AllocSize: number;
    percentageOfCFStorage: number;
}

export interface DS{
    percentageInUse: number;
    maxPercentageRequested: number;
}

export interface CF2CFActivity{
    peerCF: string
    receiver: receiver
    sender: sender
    requests: Request
    delayedRequests: DRequest
    channelPath: Record<string, peer[]>
}

export interface peer{
    ID: string;
    type: string;
    rs: string;
    operationMode: string;
    degraded: string;
    distance: number;
}

export interface sender {
    type: string;
    use: number;
}
export interface receiver{
    type: string;
    use: number;
}

export interface DRequest{
    sync: DREQ
}

export interface DREQ{
    numberReq: number;
    percentagOfREQ: number;
    avgTimeDel: number;
    avgTimeStdDev: number;
    avgTimeAll: number;
}

export interface Request{
    numberReq: number;
    avgSec: number;
    servTimeAvg: number;
    servTimeStdDev: number;
    sync: true | false;
}

export interface CFStructureActivity{
    structureName: string;
    type: string;
    status: string;
    encrypted: string;
    structureActivity: StructureActivity;
}

export interface StructureActivity{
    systemName: string;
    numberReqTotalAvgSec: number;
    requests: SARequest;
    delayed: DelayedRequest;
    total: Total;
}

export interface SARequest{
    sync: REQ
    async: REQ
    chngd: REQ
    suppr: REQ
}

export interface DelayedRequest{
    noSCH: DREQ;
    prWt: DREQ;
    prCmp: DREQ;
    dump: DREQ;
    monop: DREQ;
}

export interface Total{
    numberOfReqTotal: number;
    totalRequest: TREQ;
    totalDelayedRequest: TDREQ;
}

export interface REQ{
    numberOfReq: number;
    percentageofAll: number;
    servTimeAVG: number;
    servTimeStdDev: number;
}

export interface TREQ{
    sync: REQ;
    async: REQ;
    chngd: REQ;
    suppr: REQ;
}

export interface TDREQ{
    noSCH: DREQ;
    prWt: DREQ;
    prCMP: DREQ;
    dump: DREQ;
    monop: DREQ;
}

export interface SubchannelActivity{
    systemName: string;
    numberReqTotalAvgSec: number;
    cfLinks: Link;
    pthBusy: number;
    Requests: SCRequest;
    delayedRequests: SCDelayedRequest;
    channelPath: SubchannelPath;
}

export interface Link{
    type: string;
    gen: number;
    use: number;
}

export interface SCRequest{
    sync: SCREQ;
    async: SCREQ;
    changed: SCREQ;
    unsucc: SCREQ;
}

export interface SCREQ{
    numberOfReq: number;
    servTimeAvg: number;
    servTimeStdDev: number;
}

export interface SCDelayedRequest{
    listCatch: SCDREQ;
    lock: SCDREQ;
    total: SCDREQ;
}

export interface SCDREQ{
    numberOfReq: number;
    percentageOfREQ: number;
    avgTimeDel: number;
    avgTimeStdDev: number;
    avgTimeAll: number;
}

export interface SubchannelPath{
    systemName: string;
    id: string;
    type: string;
    operationMode: string;
    degraded: string;
    distance: number;
    pchid: number;
    aid: string;
    port: number;
    ioPIDS: number;
}