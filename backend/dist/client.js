import { io } from "socket.io-client";
const socket = io("ws://localhost:3001/");
socket.on("connect", () => {
    console.log("Connected babieee");
});
//# sourceMappingURL=client.js.map