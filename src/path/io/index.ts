import fs from 'node:fs';
import path from 'node:path';
import PathRoute from '..';

import {
    FileManagerDataContext,
    FS_CONSTANTS_ACCESS,
    PathFileManagerStructure,
} from '../../types/io';

export default class PathFileManager implements PathFileManagerStructure {
    #pathRoute: PathRoute;
    #routeName: string = '';
    #data: FileManagerDataContext[] = [];

    constructor(pathRoute: PathRoute) {
        this.#pathRoute = pathRoute;
    }
}
