import connectionToDataBase from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import Item from "@/models/Item";
import { NextResponse } from "next/server";

// POST method for creating transactions
export async function POST(request) {
    try {
        await connectionToDataBase();
        const { action, productName, quantity } = await request.json();

        // Fetch product by name
        const product = await Item.findOne({ productName });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const quantityNumber = Number(quantity); // Ensure the quantity is a number

        if (action === 'Out' && quantityNumber > product.quantity) {
            return NextResponse.json({ error: 'Quantity exceeds available stock' }, { status: 400 });
        }

        // Adjust the product quantity based on action
        if (action === 'In') {
            product.quantity += quantityNumber;
        } else if (action === 'Out') {
            product.quantity -= quantityNumber;
        }
        await product.save();

        // Create new transaction
        const newTransaction = new Transaction({
            action,
            productName,
            productId: product._id,
            quantity: quantityNumber
        });
        await newTransaction.save();

        return NextResponse.json(newTransaction, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}

// GET method for fetching transactions
export async function GET() {
    try {
        await connectionToDataBase();
        const transactions = await Transaction.find().populate('productId', 'productName'); // Populate productId to get product details

        return NextResponse.json(transactions, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}
