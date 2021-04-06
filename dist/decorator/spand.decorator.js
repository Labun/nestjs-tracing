"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpanD = void 0;
const opentracing_1 = require("opentracing");
const hook_1 = require("../hook");
const tracing_module_1 = require("../tracing.module");
const constant_1 = require("../constant");
function SpanD(name) {
    return (target, propertyKey, descriptor) => {
        const original = descriptor.value;
        descriptor.value = function (...args) {
            let context;
            try {
                context = hook_1.AsyncContext.getInstance().get(constant_1.TRACER_CARRIER_INFO);
            }
            catch (err) {
                return original.apply(this, args);
            }
            if (!context) {
                context = {};
                hook_1.AsyncContext.getInstance().set(constant_1.TRACER_CARRIER_INFO, context);
            }
            const tracer = tracing_module_1.TracingModule.tracer;
            const ctx = tracer.extract(opentracing_1.FORMAT_TEXT_MAP, context);
            let span;
            if (ctx) {
                span = tracer.startSpan(name, { childOf: ctx });
            }
            else {
                span = tracer.startSpan(name);
            }
            const result = original.apply(this, args);
            if (result.then) {
                result
                    .then(() => {
                    tracer.inject(span, opentracing_1.FORMAT_TEXT_MAP, context);
                    span.finish();
                })
                    .catch(() => {
                    tracer.inject(span, opentracing_1.FORMAT_TEXT_MAP, context);
                    span.setTag(opentracing_1.Tags.ERROR, true);
                    span.finish();
                });
            }
            else {
                span.finish();
            }
            return result;
        };
    };
}
exports.SpanD = SpanD;
