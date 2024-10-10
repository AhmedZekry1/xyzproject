import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, required: true}
})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User 