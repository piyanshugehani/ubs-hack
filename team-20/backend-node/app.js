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
import syllabusRoutes from './routes/syllabusroutes.js';
import slotRoutes from './routes/slotroutes.js';
import volunteerRoutes from './routes/volunteerroutes.js';

app.use('/api', authRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.get('/test', (req, res) => {
    res.send('Test endpoint hit');
});






export { app }