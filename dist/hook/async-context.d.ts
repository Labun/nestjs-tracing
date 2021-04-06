import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class AsyncContext implements OnModuleInit, OnModuleDestroy {
    private readonly internalStorage;
    private readonly asyncHookRef;
    private static _instance;
    private constructor();
    static getInstance(): AsyncContext;
    onModuleInit(): void;
    onModuleDestroy(): void;
    set<TKey = any, TValue = any>(key: TKey, value: TValue): void;
    get<TKey = any, TReturnValue = any>(key: TKey): TReturnValue;
    run(fn: (...args: any) => any): any;
    private getAsyncStorage;
    private static initialize;
}
