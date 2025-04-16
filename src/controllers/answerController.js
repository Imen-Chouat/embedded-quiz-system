import Answer from '../modules/answer.js';


// Ajouter une réponse
export const createAnswer = async (req, res) => {
    try {
        const { question_id, answer_text, is_correct } = req.body;
        const newAnswer = await Answer.createAnswer({ question_id, answer_text, is_correct });
        if (newAnswer.error) return res.status(400).json({ error: newAnswer.error });
        res.status(201).json(newAnswer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une réponse par ID
export const getAnswerById = async (req, res) => {
    try {
        const { id } = req.params;
        const answer = await Answer.getAnswerById(id);
        if (answer.error) return res.status(404).json({ error: answer.error });
        res.json(answer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer toutes les réponses d'une question
export const getAnswersByQuestionId = async (req, res) => {
    try {
        const { question_id } = req.params;
        const answers = await Answer.getAnswersByQuestionId(question_id);
        res.json(answers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour le texte d'une réponse
export const updateAnswerText = async (req, res) => {
    try {
        const { id } = req.params;
        const { answer_text } = req.body;
        const updatedAnswer = await Answer.updateAnswerText(id, { answer_text });
        if (updatedAnswer.error) return res.status(404).json({ error: updatedAnswer.error });
        res.json(updatedAnswer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour si une réponse est correcte ou non
export const updateAnswerCorrectness = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_correct } = req.body;
        const updatedAnswer = await Answer.updateAnswerCorrectness(id, { is_correct });
        if (updatedAnswer.error) return res.status(404).json({ error: updatedAnswer.error });
        res.json(updatedAnswer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnswer = await Answer.deleteAnswer(id);
        if (deletedAnswer.error) return res.status(404).json({ error: deletedAnswer.error });
        res.json(deletedAnswer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const submitAnswer = async (req, res) => {
    try {
        const { student_id, quiz_id, question_id, answer_id } = req.body;

        if (!student_id || !quiz_id || !question_id) {
            return res.status(400).json({ error: "Champs requis manquants" });
        }

        // Vérifier si une réponse existe déjà pour cet étudiant, quiz, et question
        const [existing] = await pool.query(
            `SELECT * FROM student_responses WHERE student_id = ? AND quiz_id = ? AND question_id = ?`,
            [student_id, quiz_id, question_id]
        );

        let is_correct = null;

        // Vérifie si la réponse est correcte
        if (answer_id !== null) {
            const [correctAnswer] = await pool.query(
                `SELECT is_correct FROM answers WHERE id = ?`,
                [answer_id]
            );
            if (correctAnswer.length > 0) {
                is_correct = correctAnswer[0].is_correct;
            }
        }

        if (existing.length > 0) {
            // Si la réponse existe déjà, la mettre à jour
            await pool.query(
                `UPDATE student_responses SET answer_id = ?, is_correct = ? WHERE student_id = ? AND quiz_id = ? AND question_id = ?`,
                [answer_id, is_correct, student_id, quiz_id, question_id]
            );
            return res.status(200).json({ message: "Réponse mise à jour" });
        }

        // Si la réponse n'existe pas, l'insérer
        const [result] = await pool.query(
            `INSERT INTO student_responses (student_id, quiz_id, question_id, answer_id, is_correct)
             VALUES (?, ?, ?, ?, ?)`,
            [student_id, quiz_id, question_id, answer_id, is_correct]
        );

        res.status(201).json({ message: "Réponse soumise", response_id: result.insertId, is_correct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    createAnswer,
    getAnswerById,
    getAnswersByQuestionId,
    updateAnswerText,
    updateAnswerCorrectness,
    deleteAnswer,
    submitAnswer
    
};
