import express from "express";
import AnswerController from "../controllers/answerController.js";

const router = express.Router();

router.post("/", AnswerController.createAnswer);
router.get("/:id", AnswerController.getAnswerById);
router.get("/question/:question_id", AnswerController.getAnswersByQuestionId);
router.put("/:id/text", AnswerController.updateAnswerText);
router.put("/:id/correctness", AnswerController.updateAnswerCorrectness);
router.delete("/:id", AnswerController.deleteAnswer);
router.post('/submit', AnswerController.submitAnswer); 

export default router;
