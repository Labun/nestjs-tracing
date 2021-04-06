import { DynamicModule, HttpService, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { TracingConfig, TracingOptions } from 'jaeger-client';
import { Tracer } from 'opentracing';
import { TracingModuleAsyncOptions } from './interface/tracing.interface';
export declare class TracingModule implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly httpService;
    constructor(httpService: HttpService);
    static tracer: Tracer;
    static forRoot(option: {
        tracingConfig: TracingConfig;
        tracingOption: TracingOptions & {
            contextKey?: string;
            baggagePrefix?: string;
        };
    }): DynamicModule;
    static forRootAsync(options: TracingModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
    onApplicationBootstrap(): void;
    onApplicationShutdown(signal?: string): any;
}
