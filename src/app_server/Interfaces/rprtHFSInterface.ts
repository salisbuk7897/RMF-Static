export interface HFS{
    global: global | Partial<global>
}

export interface global{
    storage: storage | Partial<storage>
}

export interface storage{
    virtual: virtual | Partial<virtual>
    fixed: fixed | Partial<fixed>
}

export interface virtual{
    max: number | "N/A"
    use: number | "N/A"
}

export interface fixed{
    min: number | "N/A"
    use: number | "N/A"
}