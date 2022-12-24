import fs from 'node:fs';

import { FS_CONSTANTS_ACCESS, PathFileManagerStructure } from '../../types/io';

export default class PathFileManager implements PathFileManagerStructure {
    constructor() {}

    /**
     * @description Asynchronously uses 'fs.access' to verify if file is valid
     * @param {String} filepath
     * @param {Array} [fsModes] Default is ['R_OK', 'F_OK']
     * uses like this ['F_OK', 'R_OK']
     * Rather than fs.constants.F_OK | fs.constants.R_OK
     * F_OK -> file exists
     * R_OK -> file is readable
     * W_OK -> file is writable
     * @see https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fspromises_access_path_mode
     */

    async isFileValid(
        filepath: string,
        modes: FS_CONSTANTS_ACCESS[] = ['R_OK', 'F_OK']
    ): Promise<boolean> {
        const mode: number = modes
            .map((el) => fs.constants[el])
            .reduce((acc, cur) => cur | acc);

        const itCanBeAccessed = () =>
            new Promise<boolean>((resolve) =>
                fs.access(filepath, mode, (err) => resolve(!err))
            );

        const itFileExists = await itCanBeAccessed();

        return itFileExists;
    }

    /**
     * @description Asynchronously copy a file
     * @param {String} sourceFilepath  the target filepath
     * @param {String} targetFilepath to the new source
     * @returns {Boolean}
     */

    async copy(
        sourceFilepath: string,
        targetFilepath: string
    ): Promise<boolean> {
        try {
            const fileExists = await this.isFileValid(sourceFilepath);
            if (!fileExists) return false;
            await fs.promises.copyFile(sourceFilepath, targetFilepath);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * @description synchronously read the file and return his data
     * @param filepath
     */

    async read(
        filepath: string,
        encoding: BufferEncoding = 'utf-8'
    ): Promise<string | undefined> {
        try {
            const isValid = await this.isFileValid(filepath);

            if (isValid) {
                const content: string = await fs.promises.readFile(filepath, {
                    encoding,
                });

                return content;
            }

            return undefined;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * Asynchronously write a new file
     * @param filepath
     * @param data
     * @param force if it exists, then overwrite
     * @param enconding
     */
    async write(
        filepath: string,
        data: string,
        force: boolean = true,
        enconding: BufferEncoding = 'utf-8'
    ): Promise<boolean> {
        try {
            const isReadable = await this.isFileValid(filepath);
            if (isReadable && !force) return false;
            await fs.promises.writeFile(filepath, data, enconding);
            return true;
        } catch (error) {
            return false;
        }
    }
    /**
     *  Asynchronously delete a file
     * @param filepath
     */
    async remove(filepath: string): Promise<boolean> {
        try {
            const isReadable = await this.isFileValid(filepath);
            if (!isReadable) return false;
            await fs.promises.unlink(filepath);
            return true;
        } catch (error) {
            return false;
        }
    }
    /**
     * @description Checks if the folder is valid
     * @param folderpath
     */

    isFolderValid(folderpath: string): boolean {
        return (
            !!fs.existsSync(folderpath) &&
            fs.lstatSync(folderpath).isDirectory()
        );
    }

    /**
     * @description create a new folder if it doesn't exist
     * @param {String} routeName
     * @param {String} folderName
     */

    createFolder(folderpath: string): boolean {
        try {
            if (this.isFolderValid(folderpath)) return false;
            fs.mkdirSync(folderpath, {
                recursive: false,
            });

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * @description Asynchronously deletes folder if it doesn't exist
     * @param {String} routeName
     * @param {String} folderName
     */

    async removeFolder(folderpath: string): Promise<boolean> {
        try {
            const hasFolder = await this.isFolderValid(folderpath);
            if (!hasFolder) return false;
            await fs.promises.rmdir(folderpath);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * @description check if the path exists
     * @param filepath
     */

    exists(filepath: string): boolean {
        return fs.existsSync(filepath);
    }

    /**
     * @description check if it is a directory
     * @param filepath
     */

    isDirectory(folderpath: string): boolean {
        return fs.lstatSync(folderpath).isDirectory();
    }
}
