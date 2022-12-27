export interface PathJsonManagerStructure {
    read<T = Record<string, any>>(filepath: string): Promise<T | undefined>;
    write(filepath: string, data: any, force: boolean): Promise<boolean>;
}
