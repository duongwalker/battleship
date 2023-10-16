import express from 'express';
const app = express();
import { Server } from "socket.io";
import http from 'http';
import { generateRandomId } from './utils/generateId.js';
import mongoose from "mongoose";
import Event from "./models/gameEvent.js";
import PlayerModel from './models/player.js';
import ShipModel from './models/ship.js';
const server = http.createServer(app);
const PORT = 3001;
const io = new Server(server);
const MONGODB_URI = 'mongodb+srv://fullstack:0989542210@cluster0.ozbig34.mongodb.net/battleShip?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
    .then(() => {
    console.log('connected to MongoDB');
})
    .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
});
//ServerSide
io.on("connection", (socket) => {
    console.log("New connection!");
    socket.on("joinGameRoom", async (id, player, ship) => {
        socket.join(id);
        socket.data.gameRoomId = id;
        console.log('joined game');
        try {
            const newPlayer = new PlayerModel({
                name: player.name
            });
            if (!socket.data.playerInfo) {
                socket.data.playerInfo = [];
            }
            const savedPlayer = await newPlayer.save();
            console.log('New Player saved to MongoDB:', savedPlayer);
            const owner = await PlayerModel.findOne({ name: player.name });
            const shipCount = ship.ship1.length + ship.ship2.length + ship.ship3.length;
            const newShip = new ShipModel({
                ship1: ship.ship1,
                ship2: ship.ship2,
                ship3: ship.ship3,
                owner: savedPlayer._id,
                count: shipCount
            });
            const savedShip = await newShip.save();
            owner.ships = savedShip._id;
            await owner.save();
            console.log('New Ship saved to MongoDB:', savedShip);
            socket.data.playerInfo = savedPlayer;
            socket.data.ship = savedShip;
            console.log(`new ship + ${socket.data.ship}`);
            io.to(id).emit("savingInfoResult", `info of ${owner.name} saved: ${owner}`);
        }
        catch (error) {
            console.error('Error: ', error);
        }
    });
    socket.on("shootEvent", async (event) => {
        const roomId = socket.data.gameRoomId;
        if (!roomId) {
            return;
        }
        const room = io.sockets.adapter.rooms.get(roomId);
        const room3 = await io.in(roomId).fetchSockets();
        // console.log(room)
        const socketIds = Array.from(room);
        const componentSocket = room3.find((playerSocket) => playerSocket.id !== socket.id);
        const componentShip = componentSocket.data.ship;
        for (const key in componentShip) {
            const value = componentShip[key];
            if (Array.isArray(value) && value.includes(event)) {
                componentShip["count"] -= 1;
            }
        }
        componentSocket.data.ship = componentShip;
        io.emit("shootResult", event);
        try {
            const newEvent = new Event({ event: event });
            const savedEvent = await newEvent.save();
            console.log('New Event saved to MongoDB:', savedEvent);
        }
        catch (error) {
            console.error('Error saving event:', error);
        }
        try {
            //update the ship state to Mongo
            const shipOwner = componentSocket.data.playerInfo['_id'];
            const ship = ShipModel.findOne({ owner: shipOwner });
            const updatedShip = await ship.updateOne({ count: componentSocket.data.ship["count"] });
            console.log(`Ship updated ${updatedShip}`);
        }
        catch (error) {
            console.log(error);
        }
    });
    socket.on("checkEvent", (event) => {
        console.log(`${event} ${socket.data.ship}`);
    });
});
const games = {};
app.post("/new-game", (req, res) => {
    const id = generateRandomId(8);
    games[id] = {};
    return res.json({ gameRoom: id });
});
server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map