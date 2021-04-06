export declare class AsyncHooksStorage {
    private readonly asyncStorage;
    constructor(asyncStorage?: Map<number, unknown>);
    get<T = any>(triggerId: number): T;
    has(triggerId: number): boolean;
    inherit(asyncId: number, triggerId: number): void;
    delete(asyncId: number): void;
    getInternalStorage(): Map<number, unknown>;
    private initialize;
}
