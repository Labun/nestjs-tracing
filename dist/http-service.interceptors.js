"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServiceInterceptors = void 0;
const opentracing_1 = require("opentracing");
const constant_1 = require("./constant");
const hook_1 = require("./hook");
const tracing_module_1 = require("./tracing.module");
class HttpServiceInterceptors {
    static interceptRequest() {
        return [
            (config) => {
                const tracer = tracing_module_1.TracingModule.tracer;
                const asyncContext = hook_1.AsyncContext.getInstance();
                let context = asyncContext.get(constant_1.TRACER_CARRIER_INFO);
                if (!context) {
                    context = {};
                    asyncContext.set(constant_1.TRACER_CARRIER_INFO, context);
                }
                const ctx = tracer.extract(opentracing_1.FORMAT_TEXT_MAP, context);
                let span;
                if (ctx) {
                    span = tracer.startSpan('http', { childOf: ctx });
                }
                else {
                    span = tracer.startSpan('http');
                }
                span.addTags({ url: config.url, method: config.method });
                tracer.inject(span, opentracing_1.FORMAT_HTTP_HEADERS, config.headers);
                const spanConfig = config;
                spanConfig.span = span;
                return spanConfig;
            },
            (error) => Promise.reject(error),
        ];
    }
    static interceptResponse() {
        return [
            (response) => {
                const config = response.config;
                config.span.log({
                    result: response.data,
                    statusCode: response.status,
                });
                config.span.finish();
                return response;
            },
            (error) => {
                var _a, _b;
                const config = error.config;
                config === null || config === void 0 ? void 0 : config.span.log({
                    result: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data,
                    statusCode: (_b = error.response) === null || _b === void 0 ? void 0 : _b.status,
                });
                config === null || config === void 0 ? void 0 : config.span.setTag(opentracing_1.Tags.ERROR, true);
                config === null || config === void 0 ? void 0 : config.span.finish();
                return Promise.reject(error);
            },
        ];
    }
}
exports.HttpServiceInterceptors = HttpServiceInterceptors;
