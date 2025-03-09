import jwt from 'jsonwebtoken';

import envConfig from '../config/envConfig.js';
import Quiz from '../modules/Quiz.js';
import pool from '../config/dbConfig.js';


// Create a new quiz
const createQuiz = async (req, res) => {
    try {
        const teacher_id = req.teacher.id ;
        const {  title, module, status , timed_by, duration_minutes } = req.body;
        const [teacher] = await pool.execute(
            `SELECT id FROM teachers WHERE id = ?`,
            [teacher_id]
        );

        if (teacher.length === 0) {
            throw new Error(`Teacher with ID ${teacher_id} does not exist.`);
        }

        const quizId = await Quiz.create (teacher_id,module, title,status, timed_by, duration_minutes);
        const quiz = await Quiz.findById(quizId);

        return res.status(201).json({ message: "Quiz created successfully.", quiz });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return res.status(500).json({ message: "Failed to create quiz. Please try again later." });
    }
};


const deleteQuiz = async (req, res) => {
    try {
        const teacherId = req.teacher.id; 
        const { id } = req.params;
        const quiz = await Quiz.findById(id);
        if (!quiz || quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce quiz." });
        }
        await Quiz.delete(id);
        res.status(200).json({ message: "Quiz supprimé avec succès." });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du quiz." });
    }
};

const update_title = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update(id, title);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }

        return res.status(400).json({ message: "Quiz update failed." });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
};
const update_module = async (req, res) => {
    try {
        const { id } = req.params;
        const { module } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update(id, module );
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }

        return res.status(400).json({ message: "Quiz update failed." });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
};
const update_duration = async (req, res) => {
    try {
        const { id } = req.params;
        const { duration } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update(id, duration);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }

        return res.status(400).json({ message: "Quiz update failed." });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
};
const update_status = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update(id, status);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }

        return res.status(400).json({ message: "Quiz update failed." });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
};
const update_timedby = async (req, res) => {
    try {
        const { id } = req.params;
        const { timedby } = req.body;
        const teacherId = req.teacher.id; 

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.teacher_id !== teacherId) {
            return res.status(403).json({ message: "Unauthorized. You can only update your own quizzes." });
        }

        const isUpdated = await Quiz.update(id, timedby);
        if (isUpdated) {
            const updatedQuiz = await Quiz.findById(id);
            return res.status(200).json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
        }

        return res.status(400).json({ message: "Quiz update failed." });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: "Failed to update quiz. Please try again later." });
    }
};
const randomazation = async (req, res) => {
    try {
        const { quizId } = req.params;
        
        const questions = await Quiz.getRandomizedQuestions(quizId);

        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for this quiz." });
        }

        return res.status(200).json({ questions });

    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        return res.status(500).json({ message: "Failed to fetch quiz questions. Please try again later." });
    }
};


export default {
    createQuiz,
    deleteQuiz,
    update_title ,
    update_module,
    update_duration ,
    update_status ,
    update_timedby ,
    randomazation
} ; 
