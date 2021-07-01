/// <reference types="node" />
import { Moment } from "moment";
import { WritableOptions } from "stream";
import { SlpStream, SlpStreamSettings } from "./slpStream";
export interface SlpFileWriterOptions extends Partial<SlpStreamSettings> {
    outputFiles: boolean;
    folderPath: string;
    consoleNickname: string;
    newFilename: (folder: string, startTime: Moment) => string;
}
export declare enum SlpFileWriterEvent {
    NEW_FILE = "new-file",
    FILE_COMPLETE = "file-complete"
}
/**
 * SlpFileWriter lets us not only emit events as an SlpStream but also
 * writes the data that is being passed in to an SLP file. Use this if
 * you want to process Slippi data in real time but also want to be able
 * to write out the data to an SLP file.
 *
 * @export
 * @class SlpFileWriter
 * @extends {SlpStream}
 */
export declare class SlpFileWriter extends SlpStream {
    private currentFile;
    private options;
    /**
     * Creates an instance of SlpFileWriter.
     */
    constructor(options?: Partial<SlpFileWriterOptions>, opts?: WritableOptions);
    private _writePayload;
    private _setupListeners;
    /**
     * Return the name of the SLP file currently being written or null if
     * no file is being written to currently.
     *
     * @returns {(string | null)}
     * @memberof SlpFileWriter
     */
    getCurrentFilename(): string | null;
    /**
     * Ends the current file being written to.
     *
     * @returns {(string | null)}
     * @memberof SlpFileWriter
     */
    endCurrentFile(): void;
    /**
     * Updates the settings to be the desired ones passed in.
     *
     * @param {Partial<SlpFileWriterOptions>} settings
     * @memberof SlpFileWriter
     */
    updateSettings(settings: Partial<SlpFileWriterOptions>): void;
    private _handleNewGame;
    private _handleEndGame;
}
