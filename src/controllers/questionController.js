import Question from '../modules/Question.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';

// syrine: Ajouter une question
export const createQuestion = async (req, res) => {
    try {
        const { quiz_id, question_text, duration_seconds } = req.body;
        const newQuestion = await Question.createQuestion({ quiz_id, question_text, duration_seconds });
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// syrine: Récupérer une question par ID
export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.getQuestionById(id);
        if (question.error) return res.status(404).json({ error: question.error });
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// syrine: Vérifier si une question est expirée
export const checkQuestionExpiration = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Question.isQuestionExpired(Number(id));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// syrine: Mettre à jour le texte d'une question
export const updateQuestionText = async (req, res) => {
    try {
        const { id } = req.params;
        const { question_text } = req.body;
        const updatedQuestion = await Question.updateQuestionText(id, { question_text });
        if (updatedQuestion.error) return res.status(404).json({ error: updatedQuestion.error });
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// syrine: Mettre à jour la durée d'une question
export const updateQuestionDuration = async (req, res) => {
    try {
        const { id } = req.params;
        const { duration_seconds } = req.body;
        const updatedQuestion = await Question.updateQuestionDuration(id, { duration_seconds });
        if (updatedQuestion.error) return res.status(404).json({ error: updatedQuestion.error });
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// syrine: Supprimer une question par ID
export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuestion = await Question.deleteQuestion(id);
        if (deletedQuestion.error) return res.status(404).json({ error: deletedQuestion.error });
        res.json(deletedQuestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// syrine: Rechercher des questions par texte
export const searchQuestions = async (req, res) => {
    try {
        const { text } = req.query;
        const questions = await Question.searchQuestions(text);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// syrine: Récupérer toutes les questions d'un quiz
export const getQuizQuestions = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const questions = await Question.getQuizQuestions(quiz_id);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    createQuestion,
    updateQuestionText,
    updateQuestionDuration,
    deleteQuestion,
    getQuizQuestions,
    searchQuestions,
    getQuestionById,
    checkQuestionExpiration
};

