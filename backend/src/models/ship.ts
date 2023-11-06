import mongoose, { Schema, Document, Types } from 'mongoose';
import PlayerModel from './player.js';

interface ShipCell {
    id: string;
    cells: number[][];
}
interface Ship extends Document {
    ship1: ShipCell;
    ship2: ShipCell;
    ship3: ShipCell;
    owner: mongoose.Types.ObjectId;
    count: number;
}

const shipCellSchema: Schema<ShipCell> = new Schema({
    id: String,
    cells: [[Number]],
});

const shipSchema: Schema<Ship> = new Schema({
    ship1: shipCellSchema,
    ship2: shipCellSchema,
    ship3: shipCellSchema,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlayerModel'
    },
    count: Number,
});

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