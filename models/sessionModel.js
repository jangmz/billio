import { Schema, model, models } from "mongoose";

const sessionSchema = new Schema({
    sessionToken: {
        type: String,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    expires: {
        type: Date
    }
}, { timestamps: true });

const Session = models.session || model("session", sessionSchema);

export default Session;