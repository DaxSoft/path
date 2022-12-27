import PathRoute from '../path';
import PathFileManager from '../path/io';
import PathJsonManager from '../path/json';
import PathStreamManager from '../path/stream';

export type RoutesDataContext = {
    routeName: string;
    routePath: string;
};

export type RoutesStorageContext = Record<string, any>;

export type PathHierarchyContext = {
    path?: string;
    index: number;
    parent: string;
    next: string;
    current: string;
};

export type FilesDataContext = {
    name: string;
    filename: string;
    filepath: string;
    extension: string;
    routeName: string;
};

export type FolderDataContext = {
    name: string;
    path: string;
};

export interface PathRouteStructure {
    stream(): PathStreamManager;
    json(): PathJsonManager;
    io(): PathFileManager;
    routes(): RoutesDataContext[];
    has(routeName: string): boolean;
    add(routeName: string, routePath: string): PathRoute;
    get(routeName: string): RoutesDataContext | undefined;
    edit(routeName: string, routePath: string): PathRoute;
    remove(routeName: string): PathRoute;
    size(): number;
    alias(aliasRouteName: string, routeName: string): PathRoute;
    join(
        newRouteName: string,
        referenceRouteName: string,
        filepath?: string
    ): PathRoute;
    plug(routeName: string, filepath: string): string | undefined;
    sanitize(routeName: string): string | undefined;
    endsWith(filepath: string): string;
    backward(routeName: string, level: number): string | undefined;
    towards(filepath: string, to: string, strict?: boolean): string | undefined;
    hierarchy(routeName: string): Record<string, PathHierarchyContext>;
    resolve(...paths: string[]): string;
    basename(filepath: string, suffix?: string): string;
    dirname(filepath: string): string;
    files(routeName: string, extension?: string): Promise<FilesDataContext[]>;
    lastFiles(
        routeName: string,
        extension?: string
    ): Promise<FilesDataContext[]>;
    allFilepaths(folderpath: string, files: string[]): Promise<string[]>;
    folders(routeName: string): FolderDataContext[];
    inject(
        newRouteName: string,
        referenceRouteName: string,
        filepath?: string
    ): PathRoute;
    foldersJoin(routeName: string): PathRoute;
}
