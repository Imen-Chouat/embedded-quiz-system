import notification from '../modules/notification.js';

// Notifier la publication d’un nouveau quiz
const notifyNewQuiz = async (req, res) => {
    const { quizId } = req.body;

    if (!quizId) {
        return res.status(400).json({ error: 'quizId manquant' });
    }

    try {
        await notification.notifyNewQuiz(quizId);
        res.status(200).json({ message: 'Notifications envoyées avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l’envoi des notifications' });
    }
};

// Vérifier si un étudiant a de nouveaux quiz à faire
const checkNewQuiz = async (req, res) => {
    const { studentId } = req.query;

    if (!studentId) {
        return res.status(400).json({ error: 'studentId manquant' });
    }

    try {
        const result = await notification.checkNewQuiz(studentId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la vérification des notifications' });
    }
};

export default {
    notifyNewQuiz,
    checkNewQuiz
};

