import mongoose from "mongoose";     //table el item

const itemSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    dateOfEntry: { type: Date, default: Date.now }
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
export default Item;
