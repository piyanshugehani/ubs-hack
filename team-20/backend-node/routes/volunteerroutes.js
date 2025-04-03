import express from 'express';
import { getAllVolunteers } from '../controllers/volunteercontroller.js';


const router = express.Router();

router.get('/',  getAllVolunteers); // Route to fetch all volunteers

export default router;