"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSpanContext = void 0;
function isSpanContext(span) {
    return span && span.isValid;
}
exports.isSpanContext = isSpanContext;
