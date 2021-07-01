/// <reference types="node" />
export declare enum CommunicationType {
    HANDSHAKE = 1,
    REPLAY = 2,
    KEEP_ALIVE = 3
}
export interface CommunicationMessage {
    type: CommunicationType;
    payload: {
        cursor: Uint8Array;
        clientToken: Uint8Array;
        pos: Uint8Array;
        nextPos: Uint8Array;
        data: Uint8Array;
        nick: string | null;
        forcePos: boolean;
        nintendontVersion: string | null;
    };
}
export declare class ConsoleCommunication {
    private receiveBuf;
    private messages;
    receive(data: Buffer): void;
    getReceiveBuffer(): Buffer;
    getMessages(): Array<CommunicationMessage>;
    genHandshakeOut(cursor: Uint8Array, clientToken: number, isRealtime?: boolean): Buffer;
}
