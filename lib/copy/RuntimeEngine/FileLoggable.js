import { Loggable } from './Loggable.js';
export function FileLoggable(nameForLogging, loggingIdLength, objectFolderNamer) {
    class FileLoggableObject extends Loggable(nameForLogging, loggingIdLength) {
        #activeLogging;
        #folderLocation;
        #fileName;
        #logFileName;
        #_fileLogger;
        #_fileWriter;
        /**
         *
         * @param {string} folderLocation Folder containing that object (relative path/name)
         * @protected
         */
        constructor(folderLocation) {
            super();
            this.#folderLocation = folderLocation;
            this.#activeLogging = this.#folderLocation !== undefined;
            this.#logFileName = `${this.loggingId}.log`;
            this.#fileName = `${this.loggingId}.json`;
        }
        get #objectFolderName() {
            return objectFolderNamer(this);
        }
        get objectFolder() {
            return undefined;
        }
        get #filePath() {
            return undefined;
        }
        get #logFilePath() {
            return undefined;
        }
        get #fileWriter() {
            if (!this.#_fileWriter) {
                this.#_fileWriter =
                    undefined;
            }
            return this.#_fileWriter;
        }
        get #fileLogger() {
            if (!this.#_fileLogger) {
                this.#_fileLogger =
                    undefined;
            }
            return this.#_fileLogger;
        }
        get folderLocation() {
            return this.#folderLocation;
        }
        /**
         * @protected
         * @param {LogLine} logLine LogLine object
         */
        _storeLog(logLine) {
            super._storeLog(logLine);
            this.#fileLogger?.log(logLine);
        }
        save() {
            this.#fileWriter?.add(this.json());
        }
        get summary() {
            return {
                type: FileLoggableObject.nameForLogging,
                id: this.id,
                logs: this.getLogs(),
            };
        }
        json() {
            return JSON.stringify(this.summary);
        }
    }
    return FileLoggableObject;
}
//# sourceMappingURL=FileLoggable.js.map