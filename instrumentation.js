const { NodeSDK } = require('@opentelemetry/sdk-node')
const { PeriodicExportingMetricReader, ConsoleMetricExporter } = require('@opentelemetry/sdk-metrics');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const {ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION} = require('@opentelemetry/semantic-conventions');
const { SimpleLogRecordProcessor, ConsoleLogRecordExporter } = require('@opentelemetry/sdk-logs');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-proto');

const sdk = new NodeSDK({
    resource: new Resource({
        [ATTR_SERVICE_NAME]: "dice-roll-app",
        [ATTR_SERVICE_VERSION]: "1.0"
    }),
    // traceExporter: new ConsoleSpanExporter(),
    traceExporter: new OTLPTraceExporter(),
    metricReader: new PeriodicExportingMetricReader({
     // exporter: new ConsoleMetricExporter()
        exporter: new OTLPMetricExporter(),
    }),
    // logRecordProcessors: [new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())],
    logRecordProcessors: [new SimpleLogRecordProcessor(new OTLPLogExporter())],

    instrumentations: [getNodeAutoInstrumentations()]
})

sdk.start();