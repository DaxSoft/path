import PathRoute from '..';

export type RoutesDataContext = {
    routeName: string;
    routePath: string;
};

export type RoutesStorageContext = Record<string, any>;

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
}
