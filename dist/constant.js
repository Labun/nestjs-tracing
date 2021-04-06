"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRACER_STATE_HEADER_NAME = exports.TRACER_BAGGAGE_HEADER_PREFIX = exports.TRACER_CARRIER_INFO = exports.TRACER = exports.TRACING_MODULE_OPTIONS = void 0;
exports.TRACING_MODULE_OPTIONS = Symbol('TRACING_MODULE_OPTIONS');
exports.TRACER = Symbol('tracerProvider');
exports.TRACER_CARRIER_INFO = Symbol('tracingInfo');
exports.TRACER_BAGGAGE_HEADER_PREFIX = 'uberctx-';
exports.TRACER_STATE_HEADER_NAME = 'uber-trace-id';
