import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();

app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true  // Allow credentials
  }));

app.use(cookieParser());
app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))

import authRoutes from './routes/authroutes.js'; 
app.use('/api', authRoutes);


app.get('/test', (req, res) => {
    res.send('Test endpoint hit');
});






export { app }