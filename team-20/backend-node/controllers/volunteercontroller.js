import Volunteer from '../models/Volunteer.js';

export const getAllVolunteers = async (req, res) => {
    try {
        // Fetch all volunteers and populate their booked schedules
        const volunteers = await Volunteer.find()
            .populate({
                path: 'bookedSchedule.chapter_id',
                select: 'title description session_daterange'
            });

        res.status(200).json({
            success: true,
            data: volunteers
        });
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching volunteers',
            error: error.message
        });
    }
};