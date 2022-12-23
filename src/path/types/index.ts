import PathRoute from '..';

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

export interface PathRouteStructure {
    routes(): RoutesDataContext[];
    has(routeName: string): boolean;
    add(routeName: string, routePath: string): PathRoute;
    get(routeName: string): RoutesDataContext | undefined;
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
    basename(filepath: string, ext: string): string;
    dirname(filepath: string): string;
}
