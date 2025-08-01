import jwt from 'jsonwebtoken';
import User  from '../models/userModel.js';

const protectRoute = async (req, res, next) => {
    try {
       const token = req.cookies.jwt;

        if(!token) {
        return res.status(401).json({ message: "Unauthorized acces: No Token Provided" });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if(!decode) {
            return res.status(401).json({ message: "Unauthorized access: Invalid Token" }); 
        }

        const user = await User.findById(decode.id).select("-password");

        if(!user) {
            return res.status(401).json({ message: "Unauthorized access: User not found" });
        }

        req.user = user;
        
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}