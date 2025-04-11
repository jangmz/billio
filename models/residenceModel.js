import { Schema, model, models } from "mongoose";

const residenceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: null,
    },
    imageUrl: {
        type: String,
        default: null,
    }
}, { timestamps: true });

const Residence = models.residence || model("residence", residenceSchema);
export default Residence;