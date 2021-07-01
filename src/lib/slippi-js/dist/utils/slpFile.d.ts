/// <reference types="node" />
import { Moment } from "moment";
import { Writable, WritableOptions } from "stream";
import { SlpStream } from "./slpStream";
export interface SlpFileMetadata {
    startTime: Moment;
    lastFrame: number;
    players: {
        [playerIndex: number]: {
            characterUsage: {
                [internalCharacterId: number]: number;
            };
            names: {
                netplay: string;
                code: string;
            };
        };
    };
    consoleNickname?: string;
}
/**
 * SlpFile is a class that wraps a Writable stream. It handles the writing of the binary
 * header and footer, and also handles the overwriting of the raw data length.
 *
 * @class SlpFile
 * @extends {Writable}
 */
export declare class SlpFile extends Writable {
    private filePath;
    private metadata;
    private fileStream;
    private rawDataLength;
    private slpStream;
    private usesExternalStream;
    /**
     * Creates an instance of SlpFile.
     * @param {string} filePath The file location to write to.
     * @param {WritableOptions} [opts] Options for writing.
     * @memberof SlpFile
     */
    constructor(filePath: string, slpStream?: SlpStream, opts?: WritableOptions);
    /**
     * Get the current file path being written to.
     *
     * @returns {string} The location of the current file path
     * @memberof SlpFile
     */
    path(): string;
    /**
     * Sets the metadata of the Slippi file, such as consoleNickname, lastFrame, and players.
     * @param metadata The metadata to be written
     */
    setMetadata(metadata: Partial<SlpFileMetadata>): void;
    _write(chunk: Uint8Array, encoding: string, callback: (error?: Error | null) => void): void;
    /**
     * Here we define what to do on each command. We need to populate the metadata field
     * so we keep track of the latest frame, as well as the number of frames each character has
     * been used.
     *
     * @param data The parsed data from a SlpStream
     */
    private _onCommand;
    private _setupListeners;
    private _initializeNewGame;
    _final(callback: (error?: Error | null) => void): void;
}
