import { FileLoggable } from '../RuntimeEngine/FileLoggable.js';
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const PATCH = 'PATCH';
const DELETE = 'DELETE';
function httpClientFolderNamer(client) {
    return `HTTPClient-${client.id}`;
}
export class BaseHttpClient extends FileLoggable('HTTPClient', 4, httpClientFolderNamer) {
    envName;
    apiUrl;
    _responseType;
    _jwt;
    _jwtHistory;
    campaignVariables;
    #isStandalone;
    constructor(folderLocation, campaignVariables, isStandalone) {
        super(folderLocation);
        this.campaignVariables = campaignVariables;
        this.envName = this.campaignVariables.envName;
        this.apiUrl = this.campaignVariables.environment.apiUrl;
        this.#isStandalone = isStandalone;
        this._responseType = 'json';
        this._jwt = null;
        this._jwtHistory = [];
    }
    get responseType() {
        return this._responseType;
    }
    set responseType(newResponseType) {
        this.debug(`ResponseType changed to ${newResponseType}`);
        this._responseType = newResponseType;
    }
    get jwt() {
        return this._jwt;
    }
    set jwt(newJwt) {
        if (newJwt === this._jwt) {
            this.debug('JWT unchanged');
        }
        else {
            this._jwtHistory.push(this._jwt);
            this._jwt = newJwt;
            this.debug('New JWT received');
        }
    }
    get jwtHistory() {
        return this._jwtHistory;
    }
    async promiseWrapper(httpPromise) {
        return httpPromise.catch((error) => this.handleRequestError(error));
    }
    handleRequestError(error) {
        throw error;
    }
    formatBodyToSend(jsonOrString) {
        return this.responseType === 'json' ? { json: jsonOrString } : { body: jsonOrString.toString() };
    }
    get httpRequest() {
        return {};
    }
    handleResponse(response) {
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
                }
                catch {
                    this.warn('Parsing the response body failed');
                    this.warn(`Response body as a raw string: ${response.body}`);
                }
            }
            else {
                this.debug(`Response body: ${this.obfuscateBody(response.body)}`);
            }
        }
        if (response.headers.authorization) {
            this.jwt = response.headers.authorization.toString().replace('Bearer ', '');
        }
        return response;
    }
    handleBeforeRequestLogging(method, url, paramsOrBody) {
        if (paramsOrBody) {
            this.debug(`HTTP ${method} on /${url} with params/body ${paramsOrBody}`);
        }
        else {
            this.debug(`HTTP ${method} on /${url}`);
        }
    }
    obfuscateBody(body) {
        const obfuscatedBody = { ...body };
        ['token', 'password'].forEach((keyToObfuscate) => {
            if (Object.keys(body).includes(keyToObfuscate)) {
                obfuscatedBody[keyToObfuscate] = 'OBFUSCATED';
            }
        });
        return obfuscatedBody;
    }
    async _GET(path, params) {
        this.handleBeforeRequestLogging(GET, path, params);
        const response = (await this.promiseWrapper(this.httpRequest.get(path, { searchParams: params })));
        return this.handleResponse(response);
    }
    async GET(path, params) {
        return (await this._GET(path, params)).body;
    }
    async _POST(path, jsonOrString) {
        this.handleBeforeRequestLogging(POST, path, jsonOrString);
        const response = (await this.promiseWrapper(this.httpRequest.post(path, this.formatBodyToSend(jsonOrString))));
        return this.handleResponse(response);
    }
    async POST(path, json) {
        return (await this._POST(path, json)).body;
    }
    get summary() {
        return Object.assign(super.summary, {
            jwt: this.jwt,
            envName: this.envName,
            apiUrl: this.apiUrl,
        });
    }
}
//# sourceMappingURL=BaseHttpClient.js.map