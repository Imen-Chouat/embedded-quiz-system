import Question from '../modules/Question.js';

// Ajouter une question
export const createQuestion = async (req, res) => {
    try {
        const { quiz_id, question_text, duration_seconds, grade } = req.body;
        if (!quiz_id || !question_text) return res.status(400).json({ error: "Missing required fields" });

        const newQuestion = await Question.createQuestion({ quiz_id, question_text, duration_seconds, grade });
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une question par ID
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

// Mettre à jour le texte d'une question
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

// Mettre à jour la durée d'une question
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

// Mettre à jour la note d'une question
export const updateQuestionGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const { grade } = req.body;
        const updatedQuestion = await Question.updateQuestionGrade(id, { grade });
        if (updatedQuestion.error) return res.status(404).json({ error: updatedQuestion.error });
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer une question
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

// Récupérer toutes les questions d'un quiz
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
    updateQuestionGrade,
    deleteQuestion,
    getQuizQuestions,
    getQuestionById
};


