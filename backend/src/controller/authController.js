import User from "../models/userModel.js";
import bycrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";

// Export function for user signup
// Takes email, fullName, and password from request body and validates them
export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        // Validate input
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const user = await User.findOne({ email });

        if(user){
            return res.status(400).json({ message: "User already exists" });
        }

        // Hashed password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        // Save user to database
        await newUser.save();

        // Generate token for new accound
        if(newUser){
            generateToken(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePicture: newUser.profilePicture,
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("Error in signup: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bycrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.log("Error in login", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};