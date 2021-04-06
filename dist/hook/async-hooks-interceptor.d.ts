import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AsyncContext } from './async-context';
export declare class AsyncHooksInterceptor implements NestInterceptor {
    private readonly asyncContext;
    constructor(asyncContext: AsyncContext);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>>;
}
