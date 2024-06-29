import mongoose from "mongoose";

const userschema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String },
    tags: { type: [String] }, // Array of strings for multiple tags
    joinedon: { type: Date, default: Date.now },
});

export default mongoose.model("User",userschema)