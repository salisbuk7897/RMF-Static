export interface cpuReport{
    activity: CPUActivity | Partial<CPUActivity>;
    partitionData: PartitionDataReport | Partial<PartitionDataReport>;
}

export interface CPUActivity{
    hardware: CPUHardware | Partial<CPUHardware>;
    cpcCapacity: number;
    changeReason: "NONE" | "POWERSAVE" | "MACHINE" | "N/A";
    hiperdispatch: "YES" | "NO" | "N/A";
    boostType: "NONE" | "ZIIP" | "SPEED" | "ALL";
    boostClass: "NONE" | "IPL" | "SHUTDOWN" | "RECOVERY";
    logical: Record<string, LogicalActivity | Partial<LogicalActivity>>;
    addressSpace: SystemAddress | Partial<SystemAddress>;
    workUnit: WorkUnit | Partial<WorkUnit>;
    blockedWorkload: BlockWorkload | Partial<BlockWorkload>;
}

export interface CPUHardware{
    cpu: string;
    model: string;
    hwModel: string;
    sequence: string;
}

export interface LogicalActivity{
    cpuNumber: string;
    online?: number;
    lparBusy: number;
    mvsBusy?: number;
    parked?: number;
    procShare: number;
    hiperdispatchPriority?: "HIGH" | "MED" | "LOW" | "N/A";
    ioInterrupts: number;
    tpiInterrupts: number;
}

export interface SystemAddress{
    queue: SystemAddressQueue | Partial<SystemAddressQueue>;
    space: SystemAddressSpace | Partial<SystemAddressSpace>;
}

export interface SystemAddressQueue{
    in: StatSummary | Partial<StatSummary>;
    inReady: StatSummary | Partial<StatSummary>;
    outReady: StatSummary| Partial<StatSummary>;
    outWait: StatSummary | Partial<StatSummary>;
    logicalOutReady: StatSummary | Partial<StatSummary>;
    logicalOutWait: StatSummary | Partial<StatSummary>;
}

export interface StatSummary{
    min: number;
    max: number;
    avg: number;
}

export interface SystemAddressSpace{
    batch: StatSummary | Partial<StatSummary>;
    stc: StatSummary | Partial<StatSummary>;
    tso: StatSummary | Partial<StatSummary>;
    asch: StatSummary | Partial<StatSummary>;
    omvs: StatSummary | Partial<StatSummary>;
}

export interface WorkUnit{
    distribution: WorkUnitDistribution |  Partial<WorkUnitDistribution>;
    analysis: Record<string, StatSummary | Partial<StatSummary>>;

}

export interface WorkUnitDistribution{
    "N": number;
    "<=N": number;
    "=N+1": number;
    "=N+2": number;
    "=N+3": number;
    "<=N+5": number;
    "<=N+10": number;
    "<=N+15": number;
    "<=N+20": number;
    "<=N+30": number;
    "<=N+40": number;
    "<=N+60": number;
    "<=N+80": number;
    "<=N+100": number;
    "<=N+120": number;
    "<=N+150": number;
    ">N+150": number;
}

export interface BlockWorkload{
    optParams: BlockedWorkloadOpt | Partial<BlockedWorkloadOpt>;
    promoteRate: BlockedWorkloadPromoteRate | Partial<BlockedWorkloadPromoteRate>;
    waiters: BlockedWorkloadWaiters | Partial<BlockedWorkloadWaiters>;
}

export interface BlockedWorkloadOpt{
    percent: number;
    threshold: number;
}

export interface BlockedWorkloadPromoteRate{
    defined: number;
    used: number;
}

export interface BlockedWorkloadWaiters{
    avg: number;
    peak: number;
}

export interface PartitionDataReport{
    mvsPartition: string;
    imageCapacity: number;
    configuredPartitions: number;
    waitCompletion: "YES" | "NO" | "MIX";
    dispatchInterval?: number | string;
    group?: CapacityGroup | Partial<CapacityGroup>;
    capping: CappingInfo  | Partial<CappingInfo>;
    physicalProcs: Map<"CP" | "AAP" | "IIP" | "ICF" | "IFL", number>;
    partitions: Record<string, Partition | Partial<Partition>>
}

export interface CapacityGroup{
    name: string;
    limit: number | "N/A";
    isNew: boolean;
    available: number | "N/A";
}

export interface CappingInfo{
    initial: "YES" | "NO";
    lparHardware: "YES" | "NO";
    groupHardware: "YES" | "NO";
    msu: "YES" | "NO";
}

export interface Partition{
    active: boolean;
    boost: string;
    weight: PartitionWeight | Partial<PartitionWeight>;
    msu?: PartitionMSU | Partial<PartitionMSU>;
    capping: PartitionCapping | Partial<PartitionCapping>;
    processor: PartitionProcessor | Partial<PartitionProcessor>;
    dispatch: PartitionDispatch | Partial<PartitionDispatch>;
    util: PartitionUtil | Partial<PartitionUtil>;
}

export interface PartitionWeight{
    weight: number;
}

export interface PartitionMSU{
    defined: number;
    actual: number;
}

export interface PartitionCapping{
    defined: number | string;
    wlm: number;
}


export interface PartitionProcessor{
    logicalProcs: number;
    type: "CP" | "IIP" | "AAP" | "IFL" | "ICF";
}

export interface PartitionDispatch{
    effective: any;
    total: any;
}

export interface PartitionUtil{
    logical: PartitionUtilLogical | Partial<PartitionUtilLogical>;
    physical: PartitionUtilPhysical | Partial<PartitionUtilPhysical>;
}

export interface PartitionUtilLogical{
    effective: number;
    total: number;
}

export interface PartitionUtilPhysical extends PartitionUtilLogical{
    lparMgmt: number;
}