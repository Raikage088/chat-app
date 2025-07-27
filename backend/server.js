import dotenv from 'dotenv';
import { connectDB } from  "./src/lib/db.js";
import app from './src/app.js';
// Initialize dotenv
dotenv.config();
// Port configuration
const PORT = process.env.PORT || 5001;

// Start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
});