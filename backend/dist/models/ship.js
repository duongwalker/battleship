import mongoose, { Schema } from 'mongoose';
const shipCellSchema = new Schema({
    id: String,
    cells: [[Number]],
});
const shipSchema = new Schema({
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
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});
const ShipModel = mongoose.model('Ship', shipSchema);
export default ShipModel;
//# sourceMappingURL=ship.js.map