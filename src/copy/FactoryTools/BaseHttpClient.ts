import { FileLoggable, FileLoggableObjectSummary } from '../RuntimeEngine/FileLoggable.js';

import type { LoggableObject } from '../RuntimeEngine/Loggable.js';

export type GETParams = Record<string, string | number | boolean>;
export type jsonLike = unknown | string;

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const PATCH = 'PATCH';
const DELETE = 'DELETE';

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

function httpClientFolderNamer(client: HttpClient): string {
    return `HTTPClient-${client.id}`;
}

export class BaseHttpClient extends FileLoggable('HTTPClient', 4, httpClientFolderNamer) implements HttpClient {
    readonly envName: string;
    readonly apiUrl: string;
    private _responseType: string;
    private _jwt: string;
    private readonly _jwtHistory: string[];
    campaignVariables: any;
    readonly #isStandalone: boolean;

    constructor(folderLocation: string, campaignVariables: any, isStandalone: boolean) {
        super(folderLocation);
        this.campaignVariables = campaignVariables;
        this.envName = this.campaignVariables.envName;
        this.apiUrl = this.campaignVariables.environment.apiUrl;
        this.#isStandalone = isStandalone;
        this._responseType = 'json';
        this._jwt = null;
        this._jwtHistory = [];
    }

    get responseType(): string {
        return this._responseType;
    }

    set responseType(newResponseType: string) {
        this.debug(`ResponseType changed to ${newResponseType}`);
        this._responseType = newResponseType;
    }

    get jwt(): string {
        return this._jwt;
    }

    set jwt(newJwt: string) {
        if (newJwt === this._jwt) {
            this.debug('JWT unchanged');
        } else {
            this._jwtHistory.push(this._jwt);
            this._jwt = newJwt;
            this.debug('New JWT received');
        }
    }

    get jwtHistory(): string[] {
        return this._jwtHistory;
    }

    async promiseWrapper<T>(httpPromise: Promise<T>): Promise<T> {
        return httpPromise.catch((error) => this.handleRequestError(error));
    }

    protected handleRequestError(error: Error): never {
        throw error
    }

    private formatBodyToSend(jsonOrString: jsonLike): { json: unknown } | { body: string } {
        return this.responseType === 'json' ? { json: jsonOrString } : { body: jsonOrString.toString() };
    }

    get httpRequest(): any {
        return {}
    }

    protected handleResponse(response: any): any {
        this.debug(`HTTP Response code ${response.statusCode}`);
        const responseKeysForLogging = [
            'requestUrls',
            'redirectUrls',
            'ip',
            'isFromCache',
            'statusCode',
            'url',
            'retryCount',
            'aborted',
            'httpVersion',
            'httpVersionMajor',
            'httpVersionMinor',
            'rawHeaders',
            'method',
            'url',
            'statusMessage',
        ];
        this.debug(`HTTP Response: ${JSON.stringify(response, responseKeysForLogging, 2)}`);

        if (response.body) {
            if (typeof response.body === 'string') {
                try {
                    this.debug(`Response body: ${this.obfuscateBody(JSON.parse(response.body))}`);
                } catch {
                    this.warn('Parsing the response body failed');
                    this.warn(`Response body as a raw string: ${response.body}`);
                }
            } else {
                this.debug(`Response body: ${this.obfuscateBody(response.body as Record<string, unknown>)}`);
            }
        }

        if (response.headers.authorization) {
            this.jwt = response.headers.authorization.toString().replace('Bearer ', '');
        }

        return response;
    }

    handleBeforeRequestLogging(method: any, url: string, paramsOrBody?: GETParams | jsonLike): void {
        if (paramsOrBody) {
            this.debug(`HTTP ${method} on /${url} with params/body ${paramsOrBody}`);
        } else {
            this.debug(`HTTP ${method} on /${url}`);
        }
    }

    private obfuscateBody(body: Record<string, unknown>) {
        const obfuscatedBody = { ...body };
        ['token', 'password'].forEach((keyToObfuscate) => {
            if (Object.keys(body).includes(keyToObfuscate)) {
                obfuscatedBody[keyToObfuscate] = 'OBFUSCATED';
            }
        });
        return obfuscatedBody;
    }

    async _GET(path: string, params?: GETParams): Promise<any> {
        this.handleBeforeRequestLogging(GET, path, params);
        const response: any = (await this.promiseWrapper(
            this.httpRequest.get(path, { searchParams: params })
        ));
        return this.handleResponse(response);
    }

    async GET(path: string, params?: GETParams): Promise<unknown> {
        return (await this._GET(path, params)).body;
    }

    async _POST(path: string, jsonOrString: jsonLike): Promise<any> {
        this.handleBeforeRequestLogging(POST, path, jsonOrString);
        const response = (await this.promiseWrapper(
            this.httpRequest.post(path, this.formatBodyToSend(jsonOrString))
        ));
        return this.handleResponse(response);
    }

    async POST(path: string, json: unknown): Promise<unknown> {
        return (await this._POST(path, json)).body;
    }

    get summary(): HttpClientSummary {
        return Object.assign(super.summary, {
            jwt: this.jwt,
            envName: this.envName,
            apiUrl: this.apiUrl,
        });
    }
}
