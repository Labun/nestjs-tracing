import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AsyncContext } from './async-context';
export declare class AsyncHooksMiddleware implements NestMiddleware {
    private readonly asyncContext;
    constructor(asyncContext: AsyncContext);
    use(req: Request, res: Response, next: () => void): void;
}
