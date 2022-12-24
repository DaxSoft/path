import PathFileManager from '../path/io';

export type FS_CONSTANTS_ACCESS = 'F_OK' | 'R_OK' | 'W_OK';

export interface PathFileManagerStructure {
    setRouteName(routeName: string): PathFileManager;
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
}
