"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTracingModuleOptions = void 0;
function formatTracingModuleOptions(tracingModuleOptions) {
    var _a, _b;
    const { tracingConfig, tracingOption } = tracingModuleOptions;
    if (tracingOption && tracingOption.contextKey) {
        tracingOption.contextKey = (_a = tracingOption.contextKey) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    }
    if (tracingOption && tracingOption.baggagePrefix) {
        tracingOption.baggagePrefix = (_b = tracingOption.baggagePrefix) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    }
    return { tracingConfig, tracingOption };
}
exports.formatTracingModuleOptions = formatTracingModuleOptions;
