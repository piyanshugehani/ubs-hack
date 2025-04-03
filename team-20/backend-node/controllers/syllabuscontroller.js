import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Topic from '../models/Topic.js';
import Syllabus from '../models/Syllabus.js';

export const uploadSyllabus = async (req, res) => {
    try {
        const syllabusData = req.body;
        const school_id = req.user.id; // Get school ID from authenticated user

        // Create main syllabus document
        const syllabus = await Syllabus.create({
            school_id,
            title: syllabusData.title,
            description: syllabusData.description,
            grade: syllabusData.grade || 'Not Specified',
            file_url: syllabusData.file_url
        });

        const createdSubjects = [];

        // Create subjects and their chapters
        for (const subjectData of syllabusData.subjects) {
            // Create subject
            const subject = await Subject.create({
                syllabus_id: syllabus._id,
                title: subjectData.title,
                description: subjectData.description
            });

            const chaptersWithTopics = [];

            // Create chapters for this subject
            for (const chapterData of subjectData.chapters) {
                const chapter = await Chapter.create({
                    subject_id: subject._id,
                    title: chapterData.title,
                    description: chapterData.description,
                    year: chapterData.year,
                    required_skills: {
                        skills: Array.isArray(chapterData.required_skills.skills) 
                            ? chapterData.required_skills.skills 
                            : []
                    },
                    weightage: chapterData.weightage,
                    assignedOrNot: chapterData.assignedOrNot,
                    session_daterange: chapterData.session_daterange,
                    numberOfHours: chapterData.numberOfHours
                });

                // Create topics for each chapter
                const topic = await Topic.create({
                    chapter_id: chapter._id,
                    title: chapterData.title,
                    weightage: chapterData.weightage || 25  // Default weightage
                });

                chaptersWithTopics.push({
                    ...chapter.toObject(),
                    topics: [topic]
                });
            }

            createdSubjects.push({
                ...subject.toObject(),
                chapters: chaptersWithTopics
            });
        }

        res.status(201).json({
            success: true,
            message: 'Syllabus uploaded successfully',
            data: {
                syllabus: {
                    _id: syllabus._id,
                    title: syllabus.title,
                    description: syllabus.description,
                    grade: syllabus.grade,
                    file_url: syllabus.file_url
                },
                subjects: createdSubjects
            }
        });

    } catch (error) {
        console.error('Error uploading syllabus:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading syllabus',
            error: error.message
        });
    }
};

// Get syllabus with populated topics
export const getSyllabus = async (req, res) => {
    try {
        const syllabus = await Syllabus.findById(req.params.id)
            .populate({
                path: 'school_id',
                select: 'name'
            })
            .populate({
                path: 'subjects',
                populate: {
                    path: 'chapters',
                    populate: {
                        path: 'topics',
                        select: 'title weightage'
                    }
                }
            });

        if (!syllabus) {
            return res.status(404).json({
                success: false,
                message: 'Syllabus not found'
            });
        }

        res.status(200).json({
            success: true,
            data: syllabus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};