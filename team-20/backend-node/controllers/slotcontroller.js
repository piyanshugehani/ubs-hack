import Slot from '../models/Slot.js';
import Chapter from '../models/Chapter.js';
import Topic from '../models/Topic.js';
import Session from '../models/Session.js';
import Volunteer from '../models/Volunteer.js';

export const createSlot = async (req, res) => {
    try {
        const { chapter_id } = req.params;
        const { language, is_urgent, start_date, end_date } = req.body;

        // Validate dates
        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: 'Start and end dates are required'
            });
        }

        // Check if chapter exists and get its topics
        const chapter = await Chapter.findById(chapter_id);
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: 'Chapter not found'
            });
        }

        // Update chapter's session date range
        chapter.session_daterange = {
            start: new Date(start_date),
            end: new Date(end_date)
        };
        await chapter.save();

        // Get all topics for this chapter
        const topics = await Topic.find({ chapter_id });

        // Create new slot
        const slot = await Slot.create({
            chapter_id,
            topics_covered: topics.map(topic => topic._id),
            language: language || 'English',
            is_urgent: is_urgent || false,
            assignedOrNot: 'unassigned'
        });

        // Populate the created slot with chapter and topic details
        const populatedSlot = await Slot.findById(slot._id)
            .populate('chapter_id')
            .populate('topics_covered');

        res.status(201).json({
            success: true,
            message: 'Slot created successfully',
            data: populatedSlot
        });

    } catch (error) {
        console.error('Error creating slot:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating slot',
            error: error.message
        });
    }
};

export const getAllSlots = async (req, res) => {
    try {
        // Fetch all slots and populate related fields
        const slots = await Slot.find()
            .populate('chapter_id', 'title description session_daterange') // Populate chapter details
            .populate('topics_covered', 'title'); // Populate topic details

        res.status(200).json({
            success: true,
            data: slots
        });
    } catch (error) {
        console.error('Error fetching slots:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching slots',
            error: error.message
        });
    }
};

export const updateSlotStatus = async (req, res) => {
    try {
        const { slot_id } = req.params;
        const { assignedOrNot, start_date, end_time } = req.body;
        const volunteer_id = req.user.id; // Get the logged-in user's ID

        // Find the slot
        const slot = await Slot.findById(slot_id);
        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Slot not found'
            });
        }

        // Check if the status is being changed to "assigned"
        if (assignedOrNot === 'assigned') {
            // Check if the slot is already assigned
            if (slot.assignedOrNot === 'assigned') {
                return res.status(400).json({
                    success: false,
                    message: 'Slot is already assigned'
                });
            }

            // Create a new session
            const session = await Session.create({
                slot_id: slot._id,
                volunteer_id,
                session_type: 'live', // Default session type, can be modified as needed
                session_date: new Date(start_date), // Use provided start date
                duration: 60 // Default duration in minutes, can be modified as needed
            });

            // Append the session details to the volunteer's booked schedule
            await Volunteer.findByIdAndUpdate(volunteer_id, {
                $push: {
                    bookedSchedule: {
                        date: new Date(start_date),
                        time: {
                            start: start_date,
                            end: end_time
                        },
                        chapter_id: slot.chapter_id
                    }
                }
            });

            // Update the slot status and assign the volunteer
            slot.assignedOrNot = 'assigned';
            slot.volunteer_id = volunteer_id;
            await slot.save();

            return res.status(200).json({
                success: true,
                message: 'Slot assigned and session created successfully',
                data: {
                    slot,
                    session
                }
            });
        }

        // If the status is not "assigned", just update the slot status
        slot.assignedOrNot = assignedOrNot;
        slot.volunteer_id = null; // Remove volunteer if unassigned
        await slot.save();

        res.status(200).json({
            success: true,
            message: 'Slot status updated successfully',
            data: slot
        });
    } catch (error) {
        console.error('Error updating slot status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating slot status',
            error: error.message
        });
    }
};