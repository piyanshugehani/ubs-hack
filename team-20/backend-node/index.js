import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import connectDB from "./db/index.js";
import { app } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv with the correct path
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug environment variables
console.log('Environment check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('Current directory:', __dirname);

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
})
.catch((error) => {
    console.log("MongoDB connection failed:", error);
    process.exit(1);
});
