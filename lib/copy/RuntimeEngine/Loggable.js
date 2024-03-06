const GlobalLogger = { log: (a) => { } };
export function Loggable(nameForLogging, loggingIdLength = 5) {
    class LoggableClass {
        static #nameForLogging = nameForLogging;
        static #loggingIdLength = loggingIdLength;
        #loggingId = LoggableClass.#loggingIdLength.toString();
        #logs = [];
        #upwardsLoggingContext = undefined;
        _logInMessageContext = true;
        static get nameForLogging() {
            return LoggableClass.#nameForLogging;
        }
        get id() {
            return this.#loggingId;
        }
        get loggingId() {
            return LoggableClass.nameForLogging + ' ' + this.#loggingId;
        }
        get _logLines() {
            return this.#logs;
        }
        setUpwardsLoggingContext(objectToPassTo) {
            this.#upwardsLoggingContext = { objectToPassTo };
        }
        get upwardsLoggingContext() {
            return this.#upwardsLoggingContext;
        }
        get logs() {
            return this.getLogs();
        }
        getLogs(prefixed = false) {
            return this.#logs;
        }
        _handleLog(logLine) {
            this._storeLog(logLine);
            GlobalLogger.log(logLine);
        }
        _storeLog(logLine) {
            this.#logs.push(logLine);
        }
        /**
         * Logs a message on the object.
         * At runtime, the `info` logs will be output to the global log output.
         * The `debug` logs will be stored in the object.
         *
         * @param {string} message Content to log
         * @param {LogLevel} level Level of debug (`debug` => `info` => `warn` => `error`). Defaults to `info`
         */
        log(message) {
            const logLine = message;
            this._handleLog(logLine);
        }
        debug(message) {
            this.log(message);
        }
        info(message) {
            this.log(message);
        }
        warn(message) {
            this.log(message);
        }
        error(message) {
            this.log(message);
        }
    }
    return LoggableClass;
}
//# sourceMappingURL=Loggable.js.map