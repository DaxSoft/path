export interface PathStreamManagerStructure {
    read(
        filepath: string,
        onData?: (chunk: string | Buffer, data: string | Buffer) => void
    ): Promise<string | undefined>;
    write(filepath: string, data: any): Promise<boolean>;
    download(
        url: string,
        destination: string,
        protocol: 'http' | 'https'
    ): Promise<boolean>;
}
