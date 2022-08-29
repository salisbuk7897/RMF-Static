export interface cpc{
    caption: Caption | Partial<Caption>
    lpars: Lpar[] | Partial<Lpar>
}

export interface Caption{
    CPCHPNAM: string
    CPCHMOD: number
    CPCHMDL: string
    CPCHBSTT: string
    CPCHCMSU: number
    CPCHWF: string
    CPCHLMSU: number
    CPCHGNAM: string
    CPCHIMSU: number
    CPCHCAP: number
    CPCHLMAX: number
    CPCHGLIM: string
    CPCHGL4H: string
    CPCHMTMS: string
    CPCHPRDS: string
    CPCHAMSU: string
    CPCHRMSU: number
    CPCHRGRP: string
    CPCHGAUN: string
    CPCHCPU: string
    CPCHCPCN: string
    CPCHCPNO: number
    CPCHIFAN: number
    CPCHCBPN: string
    CPCHICFN: number
    CPCHIFLN: number
    CPCHSUPN: number
    CPCHPANO: number
    CPCHWAIT: string
    CPCHPMSU: number
    CPCHDEDC: number
    CPCHDEDA: number
    CPCHDEDO: string
    CPCHDEDI: number
    CPCHSHRC: number
    CPCHSHRA: number
    CPCHSHRO: string
    CPCHSHRI: number
    CPCHVCPU: string
    CPCHWMGT: string
    CPCHCCAI: number
    CPCHCCCR: number
    CPCHPRD: string
    CPCHMCFS: string
    CPCHMCF: string
    CPCHCFS: string
    CPCHCF: string
    CPCHATDS: string
    CPCHATD: string
    CPCHMTM: string
    CPCHMDLX: string
    CPCHBSTC: string
    CPCHCUTL: number
    CPCHAUTL: number
    CPCHOUTL: string
    CPCHUUTL: number
    CPCHLUTL: number
    CPCHFUTL: number
}

export interface Lpar{
    CPCPPNAM: string
    CPCPDMSU: number
    CPCPAMSU: number
    CPCPCAPD: number
    CPCPLPNO: number
    CPCPLEFU: number
    CPCPLTOU: number
    CPCPPLMU: number
    CPCPPEFU: number
    CPCPPTOU: number
    CPCPIND: string
    CPCPLPND: number
    CPCPDEDP: number
    CPCPWGHT: number
    CPCPLPSH: number
    CPCPVCMH: number
    CPCPVCMM: number
    CPCPVCML: number
    CPCPOSNM: string
    CPCPLPCN: string
    CPCPLCIW: number
    CPCPLCMW: string
    CPCPLCXW: string
    CPCPCGNM: string
    CPCPCGLT: string
    CPCPCGEM: string
    CPCPCGEX: string
    CPCPCSMB: number
    CPCPUPID: number
    CPCPCAPI: string
    CPCPHWCC: number
    CPCPHGNM: string
    CPCPHWGC: string
    CPCPBIIP: string
    CPCPBSPD: string
}