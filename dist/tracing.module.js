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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var TracingModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracingModule = void 0;
const common_1 = require("@nestjs/common");
const jaeger_client_1 = require("jaeger-client");
const constant_1 = require("./constant");
const hook_1 = require("./hook");
const http_service_interceptors_1 = require("./http-service.interceptors");
const tracing_module_options_util_1 = require("./util/tracing-module-options.util");
let TracingModule = TracingModule_1 = class TracingModule {
    constructor(httpService) {
        this.httpService = httpService;
    }
    static forRoot(option) {
        const { tracingConfig, tracingOption } = tracing_module_options_util_1.formatTracingModuleOptions(option);
        const providers = [];
        const tracerModuleOption = {
            provide: constant_1.TRACING_MODULE_OPTIONS,
            useValue: { tracingConfig, tracingOption },
        };
        providers.push(tracerModuleOption);
        const tracerProvider = {
            provide: constant_1.TRACER,
            useFactory() {
                const tracer = jaeger_client_1.initTracer(tracingConfig, tracingOption);
                TracingModule_1.tracer = tracer;
                return tracer;
            },
        };
        providers.push(tracerProvider);
        return {
            imports: [common_1.HttpModule],
            module: TracingModule_1,
            providers,
            exports: [...providers, common_1.HttpModule],
        };
    }
    static forRootAsync(options) {
        const providers = [];
        const TracerServiceProvider = {
            provide: constant_1.TRACER,
            useFactory: (_options) => {
                const { tracingConfig, tracingOption } = tracing_module_options_util_1.formatTracingModuleOptions(_options);
                const tracer = jaeger_client_1.initTracer(tracingConfig, tracingOption);
                TracingModule_1.tracer = tracer;
                return tracer;
            },
            inject: [constant_1.TRACING_MODULE_OPTIONS],
        };
        providers.push(TracerServiceProvider);
        providers.push(...TracingModule_1.createAsyncProviders(options));
        return {
            imports: [common_1.HttpModule],
            module: TracingModule_1,
            providers,
            exports: [...providers, common_1.HttpModule],
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: constant_1.TRACING_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        const inject = [
            (options.useClass || options.useExisting),
        ];
        return {
            provide: constant_1.TRACING_MODULE_OPTIONS,
            useFactory: (optionsFactory) => __awaiter(this, void 0, void 0, function* () { return yield optionsFactory.createTracingOptions(); }),
            inject,
        };
    }
    onApplicationBootstrap() {
        this.httpService.axiosRef.interceptors.request.use(...http_service_interceptors_1.HttpServiceInterceptors.interceptRequest());
        this.httpService.axiosRef.interceptors.response.use(...http_service_interceptors_1.HttpServiceInterceptors.interceptResponse());
    }
    onApplicationShutdown(signal) {
        TracingModule_1.tracer.close();
    }
};
TracingModule = TracingModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [hook_1.AsyncHooksModule],
        providers: [],
        exports: [],
    }),
    __metadata("design:paramtypes", [common_1.HttpService])
], TracingModule);
exports.TracingModule = TracingModule;
