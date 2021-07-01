/// <reference types="node" />
import { EventEmitter } from "events";
import { Connection, ConnectionDetails, ConnectionSettings, ConnectionStatus } from "./types";
export declare const NETWORK_MESSAGE = "HELO\0";
declare const consoleConnectionOptions: {
    autoReconnect: boolean;
};
export declare type ConsoleConnectionOptions = typeof consoleConnectionOptions;
/**
 * Responsible for maintaining connection to a Slippi relay connection or Wii connection.
 * Events are emitted whenever data is received.
 *
 * Basic usage example:
 *
 * ```javascript
 * const { ConsoleConnection } = require("@slippi/slippi-js");
 *
 * const connection = new ConsoleConnection();
 * connection.connect("localhost", 667); // You should set these values appropriately
 *
 * connection.on("data", (data) => {
 *   // Received data from console
 *   console.log(data);
 * });
 *
 * connection.on("statusChange", (status) => {
 *   console.log(`status changed: ${status}`);
 * });
 * ```
 */
export declare class ConsoleConnection extends EventEmitter implements Connection {
    private ipAddress;
    private port;
    private connectionStatus;
    private connDetails;
    private client;
    private connection;
    private options;
    private shouldReconnect;
    constructor(options?: Partial<ConsoleConnectionOptions>);
    /**
     * @returns The current connection status.
     */
    getStatus(): ConnectionStatus;
    /**
     * @returns The IP address and port of the current connection.
     */
    getSettings(): ConnectionSettings;
    /**
     * @returns The specific details about the connected console.
     */
    getDetails(): ConnectionDetails;
    /**
     * Initiate a connection to the Wii or Slippi relay.
     * @param ip   The IP address of the Wii or Slippi relay.
     * @param port The port to connect to.
     * @param timeout Optional. The timeout in milliseconds when attempting to connect
     *                to the Wii or relay.
     */
    connect(ip: string, port: number, timeout?: number): void;
    private _connectOnPort;
    /**
     * Terminate the current connection.
     */
    disconnect(): void;
    private _getInitialCommState;
    private _processMessage;
    private _handleReplayData;
    private _setStatus;
}
export {};
