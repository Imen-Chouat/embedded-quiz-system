import Result from '../modules/Result.js';
import Answer from '../modules/answer.js';
import Question from '../modules/Question.js';
 const getQuizAttendance = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const attendance = await Result.getQuizAttendance(quiz_id);
        res.json({ quiz_id, attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStudentModules = async (req, res) => {
    const studentId = Number(req.params.studentId);
    if (isNaN(studentId)) {
        return res.status(400).json({ error: 'Invalid student ID' });
    }

    try {
        const modules = await Result.getStudentModules(studentId);
        if (!modules.length) {
            return res.status(404).json({ message: 'No modules found for this student' });
        }
        res.status(200).json({ studentId, modules });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCompletedQuizzesForStudentInModule = async (req, res) => {
    const { studentId, moduleName } = req.params;

    // Vérifier si studentId ou moduleName sont indéfinis
    if (!studentId || !moduleName) {
        return res.status(400).json({ error: 'Student ID and Module Name are required' });
    }

    try {
        const quizzes = await Result.getCompletedQuizzesForStudentInModule(studentId, moduleName);

        if (quizzes.length === 0) {
            return res.status(404).json({ message: 'No completed quizzes found for this student in this module' });
        }

        return res.status(200).json({ studentId, moduleName, quizzes });
    } catch (error) {
        console.error('Error fetching completed quizzes:', error);
        return res.status(500).json({ error: error.message });
    }
};



const getStudentQuizzes = async (req, res) => {
    const { studentId } = req.params;
    //try {
        const quizzes = await Result.getStudentQuizzes(studentId);
        res.status(200).json({ studentId, quizzes });
    /*} catch (error) {
        res.status(500).json({ error: error.message });
    }*/
};


export const getStudentMissedQuizzes = async (req, res) => {
    try {
        const quizzes = await Student.getMissedQuizzes(req.params.studentId);
        res.json({ missed_quizzes: quizzes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getStudentCompletedQuizzes = async (req, res) => {
    try {
        const quizzes = await Student.getCompletedQuizzes(req.params.studentId);
        res.json({ completed_quizzes: quizzes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const calculateScore = async (req, res) => {
    const { studentId, quizId } = req.params;

    try {
        // Calculer le score de l'étudiant pour ce quiz
        const score = await calculateScore(studentId, quizId);

        if (score === 0) {
            return res.status(404).json({ message: 'Aucune réponse trouvée pour cet étudiant dans ce quiz.' });
        }

        // Répondre avec le score
        return res.status(200).json({ score });
    } catch (error) {
        console.error('Erreur lors du calcul du score:', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
/*const getQuizParticipantsTable = async (req, res) => {
    const { quizId } = req.params;

    try {
        // Récupérer tous les étudiants ayant participé à ce quiz
        const participants = await Result.getQuizParticipantsTable(quizId); // Utiliser le modèle approprié pour récupérer les participants

        if (participants.length === 0) {
            return res.status(404).json({ message: 'Aucun étudiant n\'a participé à ce quiz.' });
        }

        // Calculer le score de chaque participant
        const results = [];
        for (const participant of participants) {
            const score = await calculateScore(participant.id, quizId);
            results.push({
                first_name: participant.first_name,
                last_name: participant.last_name,
 
                score
            });
        }

        // Répondre avec la liste des participants et leurs scores
        return res.status(200).json({ participants: results });
    } catch (error) {
        console.error('Erreur lors de la récupération des participants et des scores:', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
export const getQuizParticipantsTable = async (req, res) => {
    const { quizId } = req.params;

    if (!quizId) {
        return res.status(400).json({ message: 'quizId est requis.' });
    }

    try {
        const participants  = await Result.getQuizParticipantsTable(quizId);
        return res.status(200).json(participants);
    } catch (error) {
        console.error('Erreur dans getQuizParticipantsTable controller:', error);
        return res.status(500).json({ message: 'Erreur serveur lors de la récupération des scores.' });
    }
};*/


// GET /api/results/quiz/:quizId
export const getQuizParticipantsTable = async (req, res) => {
    const { quizId } = req.params;

    if (!quizId) {
        return res.status(400).json({ message: 'quizId est requis.' });
    }

    try {
        const results = await Result.getQuizParticipantsTable(quizId);
        return res.status(200).json(results);
    } catch (error) {
        console.error('Erreur dans le controller getQuizParticipantsTable:', error);
        return res.status(500).json({ message: 'Erreur serveur lors de la récupération des scores.' });
    }
};

 const getAverageQuizGrade = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const averageGrade = await Result.getAverageQuizGrade(quiz_id);
        res.json({ quiz_id, average_grade: averageGrade });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 const getQuizSuccessRate = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const successRate = await Result.getQuizSuccessRate(quiz_id);
        res.json({ quiz_id, success_rate: `${successRate}%` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 const questionChoicePercentage = async (req ,res) => {
    try {
        const {question_id} = req.body ;
        let answers = await Answer.getAnswersByQuestionId(question_id);
        let result = [];
        for (let answer of answers) {
            let percentage = await Result.choicePercentage(question_id, answer.id);
            result.push({ answer_id: answer.id , answer_text: answer.answer_text, percentage });
        }
        res.status(200).json({message:"successful fetching of the question percentage", question_id, answersPercentages: result });
    } catch (error) {
        res.status(500).json({ message:'error finding the choices percentage'});
    }
};
export const getQuestionsWithAnswers = async (req, res) => {
    const { quizId } = req.params;

    try {
        const quizDetails = await Result.getQuestionsWithAnswers(quizId);
        res.status(200).json(quizDetails);
    } catch (error) {
        console.error('Erreur lors de la récupération des questions et réponses du quiz:', error);
        res.status(500).json({ message: 'Échec de la récupération des détails du quiz' });
    }
};
export const saveStudentResponse = async (req, res) => {
    const { studentId, quizId, questionId, answerId } = req.body;

    // Vérification des champs requis
    if (!studentId || !quizId || !questionId || !answerId) {
        return res.status(400).json({ message: 'Tous les champs sont requis : studentId, quizId, questionId, answerId.' });
    }

    try {
        const result = await StudentResponseModel.saveStudentResponse(studentId, quizId, questionId, answerId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Erreur en enregistrant la réponse de l\'étudiant:', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement de la réponse.' });
    }
};
function groupQuizCorrectionData(rows) {
    const grouped = {};
  
    // Regroupement des réponses par question
    for (const row of rows) {
      const {
        question_id,
        question_text,
        answer_id,
        answer_text,
        is_correct,
        student_answer_id
      } = row;
  
      if (!grouped[question_id]) {
        grouped[question_id] = {
          question_id,
          question_text,
          student_answer_id,
          answers: []
        };
      }
  
      grouped[question_id].answers.push({
        answer_id,
        answer_text,
        is_correct
      });
    }
  
    return Object.values(grouped); // retourne un tableau des questions regroupées
  }
  

  export const getQuizCorrection = async (req, res) => {
    try {
      const { quizId, studentId } = req.params;
  
      // Récupérer les réponses du quiz pour l'étudiant
      const rows = await Result.getQuizCorrection(quizId, studentId);
  
      // Regrouper les données par question
      const grouped = groupQuizCorrectionData(rows);
  
      // Retourner les données formatées au frontend
      res.json(grouped);
    } catch (error) {
      console.error('Error in getQuizCorrection:', error);
      res.status(500).json({ error: error.message });
    }
  };
export const questionSuccessRate = async (req,res) => {
    try {
        const {quiz_id} = req.body ;
        let questions = await Question.getQuizQuestions(quiz_id);
        if(questions.length == 0){
            return res.status(401).json({message:"no question for thid quiz ."});
        }
        let questionNpercentage = [];
        for(const question of questions){
            let answerCorrect = await Answer.getCorrectAnswerByQuestionId(question.id);
            let percentage = await Result.choicePercentage(question.id,answerCorrect.id);
            questionNpercentage.push({question,percentage});
        }
        return res.status(200).json({message:"successfully fetching the percentage of each question.",questionNpercentage});
    } catch (error) {
        res.status(500).json({ message:'error finding the choices percentage'});
    }
};
export default {
    getQuizAttendance,
    getAverageQuizGrade,
    getQuizSuccessRate,
    questionChoicePercentage ,
    questionSuccessRate,
    calculateScore,
    getQuizParticipantsTable,
    getStudentModules,
    getStudentCompletedQuizzes,
    getStudentQuizzes,
    getCompletedQuizzesForStudentInModule,
    getQuestionsWithAnswers,
    getQuizCorrection,
    getStudentMissedQuizzes,
    saveStudentResponse

    
};
