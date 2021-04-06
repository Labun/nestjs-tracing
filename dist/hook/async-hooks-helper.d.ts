/// <reference types="node" />
import * as asyncHooks from 'async_hooks';
import { AsyncHooksStorage } from './async-hooks-storage';
export declare class AsyncHooksHelper {
    static createHooks(storage: AsyncHooksStorage): asyncHooks.AsyncHook;
}
