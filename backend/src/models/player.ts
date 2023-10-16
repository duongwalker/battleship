import mongoose, { Schema, Document, Types } from 'mongoose';
import { Ship } from "../types/ShipTypes.js";
import ShipModel from './ship.js';
interface Player extends Document {
    name: string;
    ships: mongoose.Types.ObjectId
}

const playerSchema: Schema<Player> = new Schema({
    name: String,
    ships: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShipModel'
    }
})

playerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})
const PlayerModel = mongoose.model<Player>('Player', playerSchema)

export default PlayerModel