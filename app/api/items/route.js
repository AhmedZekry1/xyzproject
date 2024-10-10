import connectionToDataBase from "@/lib/mongoose";
import Item from "@/models/Item"; // Assuming the Item model exists
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectionToDataBase();   //connecting to db
        const { productName, quantity } = await request.json();
        const newItem = new Item({ productName, quantity, dateOfEntry: new Date() });
        await newItem.save();
        return NextResponse.json(newItem, { status: 201 });   //send json response
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });   //send error response
    }
}

export async function GET() {
    try {
        await connectionToDataBase(); // Ensure you are connecting to the database
        const items = await Item.find(); // Fetch all items from the Item model
        return NextResponse.json(items, { status: 200 });   //return el items
    } catch (error) {
        console.error('Failed to fetch items:', error);
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}


