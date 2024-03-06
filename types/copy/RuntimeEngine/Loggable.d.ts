export interface LoggingContext {
    objectToPassTo: LoggableObject;
}
export interface LoggableObject {
    setUpwardsLoggingContext(obj: LoggableObject): void;
    upwardsLoggingContext?: LoggingContext;
    _storeLog(logLine: string): void;
    _handleLog(logLine: string): void;
    _logInMessageContext: boolean;
    id: string;
    log(message: string): void;
    loggingId: string;
}
export declare function Loggable(nameForLogging: string, loggingIdLength?: number): (abstract new () => {
    "__#1@#loggingId": string;
    "__#1@#logs": string[];
    "__#1@#upwardsLoggingContext"?: LoggingContext;
    _logInMessageContext: boolean;
    readonly id: string;
    readonly loggingId: string;
    readonly _logLines: string[];
    setUpwardsLoggingContext(objectToPassTo: LoggableObject): void;
    readonly upwardsLoggingContext: LoggingContext;
    readonly logs: string[];
    getLogs(prefixed?: boolean): string[];
    _handleLog(logLine: string): void;
    _storeLog(logLine: string): void;
    /**
     * Logs a message on the object.
     * At runtime, the `info` logs will be output to the global log output.
     * The `debug` logs will be stored in the object.
     *
     * @param {string} message Content to log
     * @param {LogLevel} level Level of debug (`debug` => `info` => `warn` => `error`). Defaults to `info`
     */
    log(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}) & {
    "__#1@#nameForLogging": string;
    "__#1@#loggingIdLength": number;
    readonly nameForLogging: string;
};
//# sourceMappingURL=Loggable.d.ts.map