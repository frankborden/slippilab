/// <reference types="node" />
import { Command, EventCallbackFunc, EventPayloadTypes, MetadataType } from "../types";
export declare enum SlpInputSource {
    BUFFER = "buffer",
    FILE = "file"
}
export interface SlpReadInput {
    source: SlpInputSource;
    filePath?: string;
    buffer?: Buffer;
}
export declare type SlpRefType = SlpFileSourceRef | SlpBufferSourceRef;
export interface SlpFileType {
    ref: SlpRefType;
    rawDataPosition: number;
    rawDataLength: number;
    metadataPosition: number;
    metadataLength: number;
    messageSizes: {
        [command: number]: number;
    };
}
export interface SlpFileSourceRef {
    source: SlpInputSource;
    fileDescriptor: number;
}
export interface SlpBufferSourceRef {
    source: SlpInputSource;
    buffer: Buffer;
}
/**
 * Opens a file at path
 */
export declare function openSlpFile(input: SlpReadInput): SlpFileType;
export declare function closeSlpFile(file: SlpFileType): void;
/**
 * Iterates through slp events and parses payloads
 */
export declare function iterateEvents(slpFile: SlpFileType, callback: EventCallbackFunc, startPos?: number | null): number;
export declare function parseMessage(command: Command, payload: Uint8Array): EventPayloadTypes | null;
export declare function getMetadata(slpFile: SlpFileType): MetadataType | null;
