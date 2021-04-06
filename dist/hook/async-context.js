"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncContext = void 0;
const asyncHooks = __importStar(require("async_hooks"));
const async_hooks_helper_1 = require("./async-hooks-helper");
const async_hooks_storage_1 = require("./async-hooks-storage");
class AsyncContext {
    constructor(internalStorage, asyncHookRef) {
        this.internalStorage = internalStorage;
        this.asyncHookRef = asyncHookRef;
    }
    static getInstance() {
        if (!this._instance) {
            this.initialize();
        }
        return this._instance;
    }
    onModuleInit() {
        this.asyncHookRef.enable();
    }
    onModuleDestroy() {
        this.asyncHookRef.disable();
    }
    set(key, value) {
        const store = this.getAsyncStorage();
        store.set(key, value);
    }
    get(key) {
        const store = this.getAsyncStorage();
        return store.get(key);
    }
    run(fn) {
        const eid = asyncHooks.executionAsyncId();
        this.internalStorage.set(eid, new Map());
        return fn();
    }
    getAsyncStorage() {
        const eid = asyncHooks.executionAsyncId();
        const state = this.internalStorage.get(eid);
        if (!state) {
            throw new Error(`Async ID (${eid}) is not registered within internal cache.`);
        }
        return state;
    }
    static initialize() {
        const asyncHooksStorage = new async_hooks_storage_1.AsyncHooksStorage();
        const asyncHook = async_hooks_helper_1.AsyncHooksHelper.createHooks(asyncHooksStorage);
        const storage = asyncHooksStorage.getInternalStorage();
        this._instance = new AsyncContext(storage, asyncHook);
    }
}
exports.AsyncContext = AsyncContext;
