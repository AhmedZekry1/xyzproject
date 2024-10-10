import connectionToDataBase from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) { // Corrected parameter name
    try {
        await connectionToDataBase();
        const { name, email } = await request.json();
        const newUser = new User({ name, email });
        await newUser.save();
        return NextResponse.json(newUser, { status: 201 });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 }); // Return an error response
    }
}
