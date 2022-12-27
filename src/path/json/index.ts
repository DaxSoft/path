import PathRoute from '..';
import { PathJsonManagerStructure } from '../../types/json';

export default class PathJsonManager implements PathJsonManagerStructure {
    #route: PathRoute;

    constructor(pr: PathRoute) {
        this.#route = pr;
    }

    /**
     * @description Asynchronously read a json file
     * @param filepath
     */
    async read<T = Record<string, any>>(
        filepath: string
    ): Promise<T | undefined> {
        const content = await this.#route.io().read(filepath);
        if (!content) return undefined;
        return JSON.parse(content) as T;
    }

    /**
     * @description Asynchronously write a json file
     * @param {String} filename
     * @param {Object} data
     * @returns {Boolean}
     */

    async write(
        filepath: string,
        data: any,
        force: boolean = true
    ): Promise<boolean> {
        const string = JSON.stringify(data, null, '\t');
        const response = await this.#route.io().write(filepath, string, force);
        return response;
    }
}
