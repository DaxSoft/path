import PathRoute from './instance';

export interface IRoutes {
    _routes: Array<PathRoute>;
    route: Record<string, PathRoute>;
    instance: Function;
    save: Function;
    load: Function;
}

export interface IRoutes_Save {
    instance: PathRoute;
    routeName: string;
    filename: string;
    force?: boolean;
}

export interface IPathRoute_Routes {
    name: string;
    filepath: string;
    prefix?: string;
}

export interface IFileManager_Historic {
    routeName: string;
    filename: string;
    field: string;
}

export interface IFileManager_ControlFile {
    routeName?: string;
    filename: string;
    folder?: string | null;
    force?: boolean;
    data?: any;
}

export interface IFileManager_Files {
    name: string;
    filename: string;
    filepath: string;
    extension: string;
    routeName: string;
}

export interface IFileManager_ListFiles {
    routeName?: string;
    extension?: string | RegExp;
    options?: any;
}

export interface IFileManager_ListFolders {
    name: string;
    path: string;
}

export interface IFileStream_Download {
    url: string;
    destination: string;
}
