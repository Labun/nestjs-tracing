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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracingHttpInterceptor = void 0;
const common_1 = require("@nestjs/common");
const opentracing_1 = require("opentracing");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const constant_1 = require("./constant");
const hook_1 = require("./hook");
const span_util_1 = require("./util/span.util");
let TracingHttpInterceptor = class TracingHttpInterceptor {
    constructor(asyncContext, tracer, tracingModuleOptions) {
        this.asyncContext = asyncContext;
        this.tracer = tracer;
        this.tracingModuleOptions = tracingModuleOptions;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const handler = context.getHandler().name;
        const controller = context.getClass().name;
        const tracingContext = this.getTracingContext(request);
        const carrier = (tracingContext === null || tracingContext === void 0 ? void 0 : tracingContext.carrier) ? tracingContext.carrier : {};
        let span;
        if (tracingContext && tracingContext.spanContext) {
            span = this.tracer.startSpan(`${controller}.${handler}`, {
                childOf: tracingContext.spanContext,
            });
        }
        else {
            span = this.tracer.startSpan(`${controller}.${handler}`);
        }
        return this.asyncContext.run(() => {
            this.tracer.inject(span, opentracing_1.FORMAT_TEXT_MAP, carrier);
            this.asyncContext.set(constant_1.TRACER_CARRIER_INFO, carrier);
            span.setTag('path', request.path);
            span.setTag('method', request.method);
            span.log({ url: request.url });
            return next.handle().pipe(operators_1.tap(() => {
                span.finish();
            }), operators_1.catchError((error) => {
                span.setTag(opentracing_1.Tags.ERROR, true);
                span.log({
                    'err.stack': error.stack,
                    statusCode: response.statusCode,
                });
                span.finish();
                return rxjs_1.throwError(error);
            }));
        });
    }
    getTracingContext(req) {
        const carrier = this.getTracingCarrier([req.headers, req.query]);
        const spanContext = this.tracer.extract(opentracing_1.FORMAT_HTTP_HEADERS, carrier);
        if (span_util_1.isSpanContext(spanContext)) {
            return { carrier, spanContext };
        }
        return null;
    }
    getTracingCarrier(carrierList) {
        var _a, _b;
        const carrierEnd = {};
        const { tracingOption } = this.tracingModuleOptions;
        const contextKey = (_a = tracingOption === null || tracingOption === void 0 ? void 0 : tracingOption.contextKey) !== null && _a !== void 0 ? _a : constant_1.TRACER_STATE_HEADER_NAME;
        const baggagePrefix = (_b = tracingOption === null || tracingOption === void 0 ? void 0 : tracingOption.baggagePrefix) !== null && _b !== void 0 ? _b : constant_1.TRACER_BAGGAGE_HEADER_PREFIX;
        for (const carrier of carrierList) {
            const keys = Object.keys(carrier);
            for (const key of keys) {
                const lowKey = key.toLowerCase();
                if (lowKey === contextKey) {
                    carrierEnd[key] = carrier[key];
                }
                if (lowKey.startsWith(baggagePrefix)) {
                    carrierEnd[key] = carrier[key];
                }
            }
        }
        return carrierEnd;
    }
};
TracingHttpInterceptor = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(constant_1.TRACER)),
    __param(2, common_1.Inject(constant_1.TRACING_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [hook_1.AsyncContext,
        opentracing_1.Tracer, Object])
], TracingHttpInterceptor);
exports.TracingHttpInterceptor = TracingHttpInterceptor;
