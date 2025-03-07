//import pool from "mysql2";
import pool from '../config/dbConfig.js';

class Answer {
    // Ajouter une réponse
    static async createAnswer({ question_id, answer_text, is_correct }) {
        try {
            const [result] = await pool.query(
                "INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)",
                [question_id, answer_text, is_correct]
            );
            return { id: result.insertId, question_id, answer_text, is_correct };
        } catch (error) {
            return { error: error.message };
        }
    }

    // Récupérer une réponse par ID
    static async getAnswerById(id) {
        try {
            const [rows] = await pool.query("SELECT * FROM answers WHERE id = ?", [id]);
            if (rows.length === 0) return { error: "Réponse non trouvée" };
            return rows[0];
        } catch (error) {
            return { error: error.message };
        }
    }

    // Récupérer toutes les réponses d’une question
    static async getAnswersByQuestionId(question_id) {
        try {
            const [rows] = await pool.query("SELECT * FROM answers WHERE question_id = ?", [question_id]);
            return rows;
        } catch (error) {
            return { error: error.message };
        }
    }

    // Mettre à jour le texte d'une réponse
    static async updateAnswerText(id, { answer_text }) {
        try {
            const [result] = await pool.query(
                "UPDATE answers SET answer_text = ? WHERE id = ?",
                [answer_text, id]
            );
            if (result.affectedRows === 0) return { error: "Réponse non trouvée" };
            return { id, answer_text };
        } catch (error) {
            return { error: error.message };
        }
    }

    // Mettre à jour si une réponse est correcte ou non
    static async updateAnswerCorrectness(id, { is_correct }) {
        try {
            const [result] = await pool.query(
                "UPDATE answers SET is_correct = ? WHERE id = ?",
                [is_correct, id]
            );
            if (result.affectedRows === 0) return { error: "Réponse non trouvée" };
            return { id, is_correct };
        } catch (error) {
            return { error: error.message };
        }
    }

    // Supprimer une réponse
    static async deleteAnswer(id) {
        try {
            const [result] = await pool.query("DELETE FROM answers WHERE id = ?", [id]);
            if (result.affectedRows === 0) return { error: "Réponse non trouvée" };
            return { message: "Réponse supprimée" };
        } catch (error) {
            return { error: error.message };
        }
    }
}

export default Answer;
