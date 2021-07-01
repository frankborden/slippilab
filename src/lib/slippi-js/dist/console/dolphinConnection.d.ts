/// <reference types="node" />
import { EventEmitter } from "events";
import { Connection, ConnectionDetails, ConnectionSettings, ConnectionStatus } from "./types";
export declare enum DolphinMessageType {
    CONNECT_REPLY = "connect_reply",
    GAME_EVENT = "game_event",
    START_GAME = "start_game",
    END_GAME = "end_game"
}
export declare class DolphinConnection extends EventEmitter implements Connection {
    private ipAddress;
    private port;
    private connectionStatus;
    private gameCursor;
    private nickname;
    private version;
    private peer;
    constructor();
    /**
     * @returns The current connection status.
     */
    getStatus(): ConnectionStatus;
    /**
     * @returns The IP address and port of the current connection.
     */
    getSettings(): ConnectionSettings;
    getDetails(): ConnectionDetails;
    connect(ip: string, port: number): Promise<void>;
    disconnect(): void;
    private _handleReplayData;
    private _setStatus;
    private _updateCursor;
}
