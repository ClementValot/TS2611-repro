const GlobalLogger = {log:(a: string) => {}}

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

export function Loggable(nameForLogging: string, loggingIdLength = 5) {
  abstract class LoggableClass implements LoggableObject {
    static #nameForLogging: string = nameForLogging;
    static #loggingIdLength: number = loggingIdLength;
    #loggingId: string = LoggableClass.#loggingIdLength.toString();
    #logs: string[] = [];
    #upwardsLoggingContext?: LoggingContext = undefined;
    _logInMessageContext = true;

    public static get nameForLogging() {
      return LoggableClass.#nameForLogging;
    }
    get id(): string {
      return this.#loggingId;
    }
    get loggingId(): string {
      return LoggableClass.nameForLogging + ' ' + this.#loggingId;
    }

    get _logLines(): string[] {
      return this.#logs;
    }

    setUpwardsLoggingContext(objectToPassTo: LoggableObject): void {
      this.#upwardsLoggingContext = { objectToPassTo };
    }

    get upwardsLoggingContext(): LoggingContext | undefined {
      return this.#upwardsLoggingContext;
    }

    get logs(): string[] {
      return this.getLogs();
    }

    getLogs( prefixed: boolean = false): string[] {
      return this.#logs
    }

    public _handleLog(logLine: string) {
      this._storeLog(logLine);

        GlobalLogger.log(logLine);

    }

    public _storeLog(logLine: string) {
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
    public log(message: string): void {
      const logLine: string = message;
      this._handleLog(logLine);
    }

    public debug(message: string): void {
      this.log(message);
    }

    public info(message: string): void {
      this.log(message);
    }

    public warn(message: string): void {
      this.log(message);
    }

    public error(message: string): void {
      this.log(message);
    }
  }
  return LoggableClass;
}
