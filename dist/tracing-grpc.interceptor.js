"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracingGrpcInterceptor = void 0;
const grpc_1 = require("grpc");
const hook_1 = require("./hook");
const constant_1 = require("./constant");
function tracingGrpcInterceptor(options, nextCall) {
    const request = {
        start(metadata, listener, next) {
            const carrier = hook_1.AsyncContext.getInstance().get(constant_1.TRACER_CARRIER_INFO);
            for (const key of Object.keys(carrier)) {
                metadata.add(key, carrier[key]);
            }
            next(metadata, listener);
        },
    };
    return new grpc_1.InterceptingCall(nextCall(options), request);
}
exports.tracingGrpcInterceptor = tracingGrpcInterceptor;
