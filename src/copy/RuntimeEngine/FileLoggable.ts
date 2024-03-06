
import { Loggable, LoggableObject } from './Loggable.js';

type Logger = { log:(a:string) => void}

type WriteFileQueue = {add: (a:string)=> void}
export interface FileLoggableObjectSummary {
  id: string;
  type: string;
  logs: string[];
}

type ObjectFolderNamer<T extends LoggableObject> = (obj: T) => string;
export function FileLoggable<T extends LoggableObject>(
  nameForLogging: string,
  loggingIdLength: number,
  objectFolderNamer: ObjectFolderNamer<T>
) {
  abstract class FileLoggableObject extends Loggable(nameForLogging, loggingIdLength) {
    readonly #activeLogging: boolean;
    readonly #folderLocation?: string;
    readonly #fileName: string;
    readonly #logFileName: string;
    #_fileLogger?: Logger;
    #_fileWriter?: WriteFileQueue;

    /**
     *
     * @param {string} folderLocation Folder containing that object (relative path/name)
     * @protected
     */
    protected constructor(folderLocation?: string) {
      super();
      this.#folderLocation = folderLocation;
      this.#activeLogging = this.#folderLocation !== undefined;
      this.#logFileName = `${this.loggingId}.log`;
      this.#fileName = `${this.loggingId}.json`;
    }

    get #objectFolderName(): string {
      return objectFolderNamer(this as unknown as T);
    }

    get objectFolder(): string | undefined {
      return undefined;
    }

    get #filePath(): string | undefined {
      return undefined;
    }

    get #logFilePath(): string | undefined {
      return  undefined;
    }

    get #fileWriter(): WriteFileQueue | undefined {
      if (!this.#_fileWriter) {
        this.#_fileWriter =
           undefined;
      }
      return this.#_fileWriter;
    }

    get #fileLogger(): Logger | undefined {
      if (!this.#_fileLogger) {
        this.#_fileLogger =
           undefined;
      }
      return this.#_fileLogger;
    }

    get folderLocation(): string | undefined {
      return this.#folderLocation;
    }

    /**
     * @protected
     * @param {LogLine} logLine LogLine object
     */
    public _storeLog(logLine: string) {
      super._storeLog(logLine);
      this.#fileLogger?.log(logLine);
    }

    public save(): void {
      this.#fileWriter?.add(this.json());
    }

    get summary(): FileLoggableObjectSummary {
      return {
        type: FileLoggableObject.nameForLogging,
        id: this.id,
        logs: this.getLogs(),
      };
    }

    json(): string {
      return JSON.stringify(this.summary);
    }
  }

  return FileLoggableObject;
}
