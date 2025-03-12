import { Schema, model, models } from "mongoose";

const categorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
}, { timestamps: true });

const Category = models.category || model("category", categorySchema);
export default Category;