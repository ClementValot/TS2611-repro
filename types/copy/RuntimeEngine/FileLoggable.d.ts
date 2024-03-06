import { LoggableObject } from './Loggable.js';
type Logger = {
    log: (a: string) => void;
};
type WriteFileQueue = {
    add: (a: string) => void;
};
export interface FileLoggableObjectSummary {
    id: string;
    type: string;
    logs: string[];
}
type ObjectFolderNamer<T extends LoggableObject> = (obj: T) => string;
export declare function FileLoggable<T extends LoggableObject>(nameForLogging: string, loggingIdLength: number, objectFolderNamer: ObjectFolderNamer<T>): (abstract new (folderLocation?: string) => {
    readonly "__#2@#activeLogging": boolean;
    readonly "__#2@#folderLocation"?: string;
    readonly "__#2@#fileName": string;
    readonly "__#2@#logFileName": string;
    "__#2@#_fileLogger"?: Logger;
    "__#2@#_fileWriter"?: WriteFileQueue;
    readonly "__#2@#objectFolderName": string;
    readonly objectFolder: string;
    readonly "__#2@#filePath": string;
    readonly "__#2@#logFilePath": string;
    readonly "__#2@#fileWriter": WriteFileQueue;
    readonly "__#2@#fileLogger": Logger;
    readonly folderLocation: string;
    /**
     * @protected
     * @param {LogLine} logLine LogLine object
     */
    _storeLog(logLine: string): void;
    save(): void;
    readonly summary: FileLoggableObjectSummary;
    json(): string;
    "__#1@#loggingId": string;
    "__#1@#logs": string[];
    "__#1@#upwardsLoggingContext"?: import("./Loggable.js").LoggingContext;
    _logInMessageContext: boolean;
    readonly id: string;
    readonly loggingId: string;
    readonly _logLines: string[];
    setUpwardsLoggingContext(objectToPassTo: LoggableObject): void;
    readonly upwardsLoggingContext: import("./Loggable.js").LoggingContext;
    readonly logs: string[];
    getLogs(prefixed?: boolean): string[];
    _handleLog(logLine: string): void;
    log(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}) & {
    readonly nameForLogging: string;
};
export {};
//# sourceMappingURL=FileLoggable.d.ts.map