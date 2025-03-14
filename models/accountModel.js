import { Schema, models, model } from "mongoose";

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
    },
    provider: {
        type: String,
    },
    providerAccountId: {
        type: String,
    },
    refresh_token: {
        type: String,
    },
    access_token: {
        type: String,
    },
    expires_at: {
        type: Number,
    },
    token_type: {
        type: String,
    },
    scope: {
        type: String,
    },
    id_token: {
        type: String,
    },
    session_state: {
        type: String,
    },
}, { timestamps: true });

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account = models.account || model("account", accountSchema);

export default Account;