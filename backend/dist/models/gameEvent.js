import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
    event: String
});
eventSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
const Event = mongoose.model('Event', eventSchema);
export default Event;
//# sourceMappingURL=gameEvent.js.map