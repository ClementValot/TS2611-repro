import { FileLoggableObjectSummary } from '../RuntimeEngine/FileLoggable.js';
import type { LoggableObject } from '../RuntimeEngine/Loggable.js';
export type GETParams = Record<string, string | number | boolean>;
export type jsonLike = unknown | string;
export interface HttpClientSummary extends FileLoggableObjectSummary {
    jwt: string;
    envName: string;
    apiUrl: string;
}
/**
 * Public interface for HttpClient
 */
interface HttpClient extends LoggableObject {
    responseType: string;
    jwt: string;
    summary: HttpClientSummary;
}
declare const BaseHttpClient_base: (abstract new (folderLocation?: string) => {
    readonly "__#2@#activeLogging": boolean;
    readonly "__#2@#folderLocation"?: string;
    readonly "__#2@#fileName": string;
    readonly "__#2@#logFileName": string;
    "__#2@#_fileLogger"?: {
        log: (a: string) => void;
    };
    "__#2@#_fileWriter"?: {
        add: (a: string) => void;
    };
    readonly "__#2@#objectFolderName": string;
    readonly objectFolder: string;
    readonly "__#2@#filePath": string;
    readonly "__#2@#logFilePath": string;
    readonly "__#2@#fileWriter": {
        add: (a: string) => void;
    };
    readonly "__#2@#fileLogger": {
        log: (a: string) => void;
    };
    readonly folderLocation: string;
    _storeLog(logLine: string): void;
    save(): void;
    readonly summary: FileLoggableObjectSummary;
    json(): string;
    "__#1@#loggingId": string;
    "__#1@#logs": string[];
    "__#1@#upwardsLoggingContext"?: import("../RuntimeEngine/Loggable.js").LoggingContext;
    _logInMessageContext: boolean;
    readonly id: string;
    readonly loggingId: string;
    readonly _logLines: string[];
    setUpwardsLoggingContext(objectToPassTo: LoggableObject): void;
    readonly upwardsLoggingContext: import("../RuntimeEngine/Loggable.js").LoggingContext;
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
export declare class BaseHttpClient extends BaseHttpClient_base implements HttpClient {
    #private;
    readonly envName: string;
    readonly apiUrl: string;
    private _responseType;
    private _jwt;
    private readonly _jwtHistory;
    campaignVariables: any;
    constructor(folderLocation: string, campaignVariables: any, isStandalone: boolean);
    get responseType(): string;
    set responseType(newResponseType: string);
    get jwt(): string;
    set jwt(newJwt: string);
    get jwtHistory(): string[];
    promiseWrapper<T>(httpPromise: Promise<T>): Promise<T>;
    protected handleRequestError(error: Error): never;
    private formatBodyToSend;
    get httpRequest(): any;
    protected handleResponse(response: any): any;
    handleBeforeRequestLogging(method: any, url: string, paramsOrBody?: GETParams | jsonLike): void;
    private obfuscateBody;
    _GET(path: string, params?: GETParams): Promise<any>;
    GET(path: string, params?: GETParams): Promise<unknown>;
    _POST(path: string, jsonOrString: jsonLike): Promise<any>;
    POST(path: string, json: unknown): Promise<unknown>;
    get summary(): HttpClientSummary;
}
export {};
//# sourceMappingURL=BaseHttpClient.d.ts.map