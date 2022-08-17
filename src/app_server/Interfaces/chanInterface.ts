export interface Chan{
    systemInfo: Info | Partial<Info>
    allChannels: AllChannels[] | Partial<AllChannels[]>
    hiperSocket: HiperSocket[] | Partial<HiperSocket[]>
}

export interface Info{ 
    iodfSuffix: string
    iodfDate: string
    iodfTime: string
    configurationState: string
    cpcModel: string
    cpmfMode: string
    cssid: number
}

export interface AllChannels{
    channelPath: cPath | Partial<cPath>; 
    utilization: Util | Partial<Util>;
    read: Read | Partial<Read>;
    write: Write | Partial<Write>;
    ficonOperations: Ficon | Partial<Ficon>;
    ZHPFOperations: ZHPF | Partial<ZHPF>;
    physicalNetworkIDS: IDS | Partial<IDS>;
}

export interface HiperSocket{
    channelPath: cPath | Partial<cPath>;
    messageRate: Rate | Partial<Rate>;
    messageSize: Size | Partial<Size>;
    sendFail: sFail | Partial<sFail>;
    receiveFail: rFail | Partial<rFail>;
    physical: string;
}

export interface cPath{
    id: string
    type: string
    G: number
    speed: number
    SHR: string
    status: string
}

export interface Util{
    lpar: number
    total: number
    bus: number
}

export interface Read{
    lpar: number
    total: number
}

export interface Write{
    lpar: number
    total: number
}

export interface Ficon{
    rate: number
    active: number
    defer: number
}

export interface ZHPF{
    rate: number
    active: number
    defer: number
}

export interface IDS{
    port1: string
    port2: string
}

export interface Rate{
    lpar: number
    total: number
}

export interface Size{
    lpar: number
    total: number
}

export interface sFail{
    lpar: number
}

export interface rFail{
    lpar: number
    total: number
}