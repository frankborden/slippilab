/// <reference types="node" />
import { Writable, WritableOptions } from "stream";
import { Command, EventPayloadTypes } from "../types";
export declare enum SlpStreamMode {
    AUTO = "AUTO",
    MANUAL = "MANUAL"
}
declare const defaultSettings: {
    suppressErrors: boolean;
    mode: SlpStreamMode;
};
export declare type SlpStreamSettings = typeof defaultSettings;
export declare type MessageSizes = Map<Command, number>;
export interface SlpCommandEventPayload {
    command: Command;
    payload: EventPayloadTypes | MessageSizes;
}
export interface SlpRawEventPayload {
    command: Command;
    payload: Buffer;
}
export declare enum SlpStreamEvent {
    RAW = "slp-raw",
    COMMAND = "slp-command"
}
/**
 * SlpStream is a writable stream of Slippi data. It passes the data being written in
 * and emits an event based on what kind of Slippi messages were processed.
 *
 * SlpStream emits two events: "slp-raw" and "slp-command". The "slp-raw" event emits the raw buffer
 * bytes whenever it processes each command. You can manually parse this or write it to a
 * file. The "slp-command" event returns the parsed payload which you can access the attributes.
 *
 * @class SlpStream
 * @extends {Writable}
 */
export declare class SlpStream extends Writable {
    private gameEnded;
    private settings;
    private payloadSizes;
    private previousBuffer;
    /**
     *Creates an instance of SlpStream.
     * @param {Partial<SlpStreamSettings>} [slpOptions]
     * @param {WritableOptions} [opts]
     * @memberof SlpStream
     */
    constructor(slpOptions?: Partial<SlpStreamSettings>, opts?: WritableOptions);
    restart(): void;
    _write(newData: Buffer, encoding: string, callback: (error?: Error | null, data?: any) => void): void;
    private _writeCommand;
    private _processCommand;
}
export {};
