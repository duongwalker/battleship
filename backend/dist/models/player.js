import mongoose, { Schema } from 'mongoose';
const playerSchema = new Schema({
    name: String,
    ships: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShipModel'
    }
});
playerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});
const PlayerModel = mongoose.model('Player', playerSchema);
export default PlayerModel;
//# sourceMappingURL=player.js.map