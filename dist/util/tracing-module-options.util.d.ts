import { TracingModuleOptions } from '..';
import { TracingConfig, TracingOptions } from 'jaeger-client';
export declare function formatTracingModuleOptions(tracingModuleOptions: TracingModuleOptions): {
    tracingConfig: TracingConfig;
    tracingOption: TracingOptions;
};
