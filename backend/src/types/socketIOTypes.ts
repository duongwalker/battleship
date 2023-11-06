import { Model, Schema, Types } from "mongoose";

interface PlayerObject {
    name: string;
    ship1: Types.Array<string>;
    ship2: Types.Array<string>;
    ship3: Types.Array<string>;
}

interface ShipObject {
    id: string
    cells: [number, number][]
    count: number
    playerId: any
}


interface SavedShipData {
    ship1: any[]; 
    ship2: any[];
    ship3: any[];
    owner: string;
    count: number;
  }

interface ShootedShip {
    id: string;
    playerId: string;
}

interface ShootedCell {
    cell: [number, number]
    playerId: string;
}


export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    savingInfoResult: (info: string) => void
    shootResult: (event: string) => void;
    // checkEvent:(event: string) => void;
    opponentShipData: any;
    // shootData: [number, number];
    sinkedShip: (event: []) => void
    checkResult:(event: string) => void;
}

export interface ClientToServerEvents {
    hello: () => void;
    joinGameRoom: (id: string, player: PlayerObject, ship: Array<ShipObject>) => void;
    joinGameState: (joined: boolean) => void;
    shootEvent: (event: string) => void;
    shootResult: (event: ShootedCell) => void;
    checkEvent:(event: string) => void;
    
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    gameRoomId: string;
    playerInfo: object;
    ships: ShipObject[];
    reservedSquares: string[];
    opponentShip: any
}
