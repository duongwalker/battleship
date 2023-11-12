import express from 'express';
const app = express();
import { Server } from "socket.io";

import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types/socketIOTypes.js";
import http from 'http';
import { GameStateMapType } from './types/gameRoomTypes.js';
import { generateRandomId } from './utils/generateId.js';
import mongoose from "mongoose";
import Event from "./models/gameEvent.js"
import PlayerModel from './models/player.js';
import ShipModel from './models/ship.js';
import cors from 'cors';
app.use(cors())

const server = http.createServer(app);

const PORT = 3001

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
        
    }
});

const MONGODB_URI = 'mongodb+srv://fullstack:0989542210@cluster0.ozbig34.mongodb.net/battleShip?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

//ServerSide
io.on("connection", (socket) => {
    // console.log("New connection!")

    socket.on("joinGameRoom", async (id, player, ship) => {
        socket.join(id)
        socket.data.gameRoomId = id
        // console.log('joined game')

        try {
            const newPlayer = new PlayerModel({
                name: player.name
            })

            if (!socket.data.playerInfo) {
                socket.data.playerInfo = [];
            }
            const savedPlayer = await newPlayer.save()
            console.log('New Player saved to MongoDB:', savedPlayer)

            const owner = await PlayerModel.findOne({ name: player.name })
            const shipCount = ship.length
            const newShip = new ShipModel({
                ship1: ship[0],
                ship2: ship[1],
                ship3: ship[2],
                owner: savedPlayer._id,
                count: shipCount
            })

            
            const savedShip = await newShip.save()
            owner.ships = savedShip._id
            await owner.save()
            // console.log('New Ship saved to MongoDB:', savedShip)

            socket.data.playerInfo = savedPlayer
            socket.data.ships = ship

            console.log('this is ship saved to socket')
            console.log(socket.data.ships)
            // console.log(`new ship + ${socket.data.ship}`)
            io.to(id).emit("savingInfoResult", `info of ${owner.name} saved: ${owner}`)
            socket.to(id).emit("opponentShipData", ship);
            
        }

        catch (error) {
            console.error('Error: ', error)
        }
    })

    socket.on("shootEvent", async (event) => {
        const roomId = socket.data.gameRoomId
        if (!roomId) {
            return;
        }

        console.log('Da bannn')
        const room = io.sockets.adapter.rooms.get(roomId);
        const roomSockets = await io.in(roomId).fetchSockets()

        const ships = socket.data.ships


        socket.to(roomId).emit('shootResult', event)  

        // opponentSocket.data.ship = opponentShips
        // io.emit("shootResult", event)

        // try {
        //     const newEvent = new Event({ event: event })
        //     const savedEvent = await newEvent.save()
        //     console.log('New Event saved to MongoDB:', savedEvent)
        // }
        // catch (error) {
        //     console.error('Error saving event:', error)
        // }

        // try {
        //     //update the ship state to Mongo
        //     const shipOwner = opponentSocket.data.playerInfo['_id']
        //     const ship = ShipModel.findOne({ owner: shipOwner })
        //     const updatedShip = await ship.updateOne({ count: opponentSocket.data.ship["count"] })
        //     console.log(`Ship updated ${updatedShip}`)
        // }
        // catch (error) {
        //     console.log(error)
        // }

    })

    // socket.on('shootResult', (event) => {
    //     const ships = socket.data.ships
    //     const updatedShips = ships.map((ship) => {
    //         if (ship.cells.includes(event)) {
    //             return { ...ship, count: ship.count - 1 };
    //         }
    //         return ship;
    //     }) 
    //     socket.data.ships = updatedShips
    //     console.log(socket.data.ships)
    // })


    socket.on("checkEvent", (event) => {
        const roomId = socket.data.gameRoomId
        socket.to(roomId).emit('checkResult', event)
    })

    
})

const games: GameStateMapType = {

}

app.get("/new-game", (req, res) => {
    const id = generateRandomId(8)
    games[id] = {};
    return res.json({ gameRoom: id })
})

server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})