export interface crypto{
    ccaCoProcessor: cca;
    pkcs11CoProcessor: pkcs;
    accelerator: accelerators;
    icsfServices: icsf;
}

export interface accelerators{
    type: Record<string, accelerator[]>
}

export interface accelerator{
    id: number
    lpar: LparCPC
    cpc: LparCPC
    function: accFunction
}

export interface LparCPC{
    rate: number
    exxecTime: number
    util: number
}

export interface accFunction{
    rsame1024: accchild
    rsame2048: accchild
    rsame4096: accchild
    rsacrt1024: accchild
    rsacrt2048: accchild
    rsacrt4096: accchild
}

export interface accchild{
    lpar: cpclpar
    cpc: cpclpar
}

export interface cpclpar{
    rate: number
    exxecTime: number
    util: number
}

export interface icsf{
    encryption: encryption
    decryption: decryption
    hash: hash
    pin: pin
    mac: mac
    aesMac: aes
    rsadsig: rsa
    eccdsig: ecc
    formatPreserving: format
    qsadsig: qsa
    feistelBased: fistel
}

export interface encryption{
    rate: icchild1
    size: icchild1
}

export interface decryption{
    rate: icchild1
    size: icchild1
}

export interface icchild1{
    sdes: number
    tdes: number
    aes: number
}

export interface hash{
    rate: icchild2
    size: icchild2
}

export interface icchild2{
    sha1: number
    sha256: number
    sha512: number
}

export interface pin{
    rate: icchild3
    size: icchild3
}

export interface icchild3{
    translate: number
    verify: number
}

export interface mac{
    rate: icchild4
    size: icchild4
}

export interface rsa{
    rate: icchild4
    size: icchild4
}

export interface qsa{
    rate: icchild4
    size: icchild4
}

export interface ecc{
    rate: icchild4
    size: icchild4
}

export interface aes{
    rate: icchild4
    size: icchild4
}

export interface dsig{
    rate: icchild4
    size: icchild4
}

export interface icchild4{
    translate: number
    verify: number
}

export interface format{
    rate: icchild5
    size: icchild5
}

export interface fistel{
    rate: icchild5
    size: icchild5
}

export interface icchild5{
    encipher: number
    decipher: number
    translate: number
}

export interface pkcs{
    type: Record<string, pkc[]>
}

export interface pkc{
    id: number
    lpar: pklparcpc
    cpc: pklparcpc
    function : pkfunction
}

export interface pklparcpc{
    rate: number
    exxecTime: number
    util: number
}

export interface pkfunction{
    asymFast: pkchild
    asymGen: pkchild
    asymSlow: pkchild
    symmComplete: pkchild
    symmPartial: pkchild
}

export interface pkchild{
    lpar: pklparcpc
    cpc: pklparcpc
}

export interface cca{
    type: Record<string, type[]>
}

export interface type{
    id: number
    lpar: cclparcpc
    cpc: cclparcpc
}

export interface cclparcpc{
    rate: number
    exxecTime: number
    util: number
    keyGenRate: number
}