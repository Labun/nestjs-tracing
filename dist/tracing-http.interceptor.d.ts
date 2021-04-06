import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Tracer } from 'opentracing';
import { Observable } from 'rxjs';
import { AsyncContext } from './hook';
import { TracingModuleOptions } from './interface/tracing.interface';
export declare class TracingHttpInterceptor implements NestInterceptor {
    private readonly asyncContext;
    private readonly tracer;
    private readonly tracingModuleOptions;
    constructor(asyncContext: AsyncContext, tracer: Tracer, tracingModuleOptions: TracingModuleOptions);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>>;
    private getTracingContext;
    getTracingCarrier(carrierList: Record<string, any>[]): Record<string, any>;
}
