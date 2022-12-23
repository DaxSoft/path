export type RoutesDataContext = {
    routeName: string;
    routePath: string;
    routePrefix?: string;
};

export type RoutesStorageContext = Record<string, any>;

export interface PathRouteStructure {
    routes(): RoutesDataContext[];
    has(routeName: string): boolean;
}
