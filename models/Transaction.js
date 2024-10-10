import mongoose from "mongoose";    //table el transaction

const transactionSchema = new mongoose.Schema({
    action: { type: String, enum: ['In', 'Out'], required: true },
    transactionId: { type: Number, autoIncrement: true }, // Auto-incremented ID
    date: { type: Date, default: Date.now }, // Automatically set the date
    productName: { type: String, required: true }, // Dropdown from available products
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // Retrieved based on selected product name
    quantity: { type: Number, required: true }, // Quantity to be added or removed
});

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
export default Transaction;
