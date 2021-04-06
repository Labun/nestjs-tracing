"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncHooksInterceptor = void 0;
const common_1 = require("@nestjs/common");
const async_context_1 = require("./async-context");
let AsyncHooksInterceptor = class AsyncHooksInterceptor {
    constructor(asyncContext) {
        this.asyncContext = asyncContext;
    }
    intercept(context, next) {
        return this.asyncContext.run(() => next.handle());
    }
};
AsyncHooksInterceptor = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [async_context_1.AsyncContext])
], AsyncHooksInterceptor);
exports.AsyncHooksInterceptor = AsyncHooksInterceptor;
