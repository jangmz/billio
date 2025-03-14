import { Schema, model, models } from "mongoose";

// schema definition
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
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
    },
    image: {
        type: String,
    },
    emailVerified: {
        type: Boolean,
        default: null,
    },
}, { timestamps: true });

// export model
const User = models.user || model("user", userSchema);

export default User;