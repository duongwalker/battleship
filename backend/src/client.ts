import { io, Socket } from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types/socketIOTypes.js"

const socket: Socket<ServerToClientEvents, SocketData> = io("ws://localhost:3001/");

socket.on("connect", () => {
    console.log("Connected babieee")
});
