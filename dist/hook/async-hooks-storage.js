"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncHooksStorage = void 0;
class AsyncHooksStorage {
    constructor(asyncStorage = new Map()) {
        this.asyncStorage = asyncStorage;
        this.initialize();
    }
    get(triggerId) {
        return this.asyncStorage.get(triggerId);
    }
    has(triggerId) {
        return this.asyncStorage.has(triggerId);
    }
    inherit(asyncId, triggerId) {
        const value = this.asyncStorage.get(triggerId);
        this.asyncStorage.set(asyncId, value);
    }
    delete(asyncId) {
        this.asyncStorage.delete(asyncId);
    }
    getInternalStorage() {
        return this.asyncStorage;
    }
    initialize() {
        const initialAsyncId = 1;
        this.asyncStorage.set(initialAsyncId, new Map());
    }
}
exports.AsyncHooksStorage = AsyncHooksStorage;
