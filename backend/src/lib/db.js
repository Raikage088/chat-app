import mongoose from "mongoose";
//  Used to connect to MongoDB using Mongoose
//  It exports a function that connects to the database using the MONGO_URI from environment variables
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI) 
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}