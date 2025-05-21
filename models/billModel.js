import { Schema, model, models } from "mongoose";

const billSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    residenceId: {
        type: Schema.Types.ObjectId,
        ref: "residence",
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    forMonth: {
        type: String,
        enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        default: "January",
        required: true,
    },
    forYear: {
        type: Number,
        default: new Date().getFullYear(),
        required: true,
    },
    dueDate: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ["Paid", "Unpaid"],
        default: "Unpaid",
        required: true,
    },
    recurring: {
        type: Boolean,
        default: null,
    },
    recurrencePeriod: {
        type: String,
        enum: ["Monthly", "Quarterly", "Yearly", null],
        default: null
    },
    receiptUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Bill = models.bill || model("bill", billSchema);
export default Bill;