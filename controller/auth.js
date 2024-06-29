import users from '../model/auth.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = await users.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT token
        const token = jwt.sign({
            email: newUser.email,
            id: newUser._id  // Assuming your user model has an '_id' field
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with user data and token
        res.status(201).json({ result: newUser, token });
    } catch (error) {
        // Handle errors
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Something went wrong..." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            // User not found
            return res.status(404).json({ message: "User does not exist" });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            // Incorrect password
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id  // Assuming your user model has an '_id' field
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with user data and token
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        // Handle errors
        console.error("Error in login:", error);
        res.status(500).json({ message: "Something went wrong..." });
    }
};
