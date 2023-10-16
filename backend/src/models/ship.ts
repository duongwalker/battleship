import mongoose, { Schema, Document, Types } from 'mongoose';
import PlayerModel from './player.js';
interface Ship extends Document {
    ship1: string[];
    ship2: string[];
    ship3: string[];
    owner: mongoose.Types.ObjectId;
    count: number;
}

const shipSchema: Schema<Ship> = new Schema({
    ship1: [String],
    ship2: [String],
    ship3: [String],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlayerModel'
    },
    count: Number,
})

shipSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})
const ShipModel = mongoose.model<Ship>('Ship', shipSchema)

export default ShipModel