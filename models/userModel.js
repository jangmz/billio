import { Schema, model, models } from "mongoose";

// schema definition
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// export model
const User = models.user || model("user", userSchema);

export default User;