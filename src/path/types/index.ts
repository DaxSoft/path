import PathRoute from '..';

export type RoutesDataContext = {
    routeName: string;
    routePath: string;
    routePrefix?: string;
};

export type RoutesStorageContext = Record<string, any>;

export interface PathRouteStructure {
    routes(): RoutesDataContext[];
    has(routeName: string): boolean;
    add(context: RoutesDataContext): PathRoute;
    get(routeName: string): RoutesDataContext | undefined;
    remove(routeName: string): PathRoute;
    size(): number;
    alias(aliasRouteName: string, routeName: string): PathRoute;
    join(
        newRouteName: string,
        referenceRouteName: string,
        filepath?: string
    ): PathRoute;
}
