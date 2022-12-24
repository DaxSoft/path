export type FS_CONSTANTS_ACCESS = 'F_OK' | 'R_OK' | 'W_OK';

export interface PathFileManagerStructure {
    isFileValid(
        filepath: string,
        modes: FS_CONSTANTS_ACCESS[]
    ): Promise<boolean>;
    copy(sourceFilepath: string, targetFilepath: string): Promise<boolean>;
    read(
        filepath: string,
        enconding: BufferEncoding
    ): Promise<string | undefined>;
    write(
        filepath: string,
        data: string,
        force: boolean,
        enconding: BufferEncoding
    ): Promise<boolean>;
    remove(filepath: string): Promise<boolean>;
    isFolderValid(folderpath: string): boolean;
    createFolder(folderpath: string): boolean;
    removeFolder(folderpath: string): Promise<boolean>;
    exists(filepath: string): boolean;
    isDirectory(folderpath: string): boolean;
}
