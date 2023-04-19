import express from "express";
import { Quiz } from "../models/QuizModel.js";

const quizRouter = express.Router();

quizRouter.post("/", async (req, res) => {
  const quizz = req.body;
  try {
    const newQuizz = new Quiz(quizz);
    await newQuizz.save();
    res.json({ message: "Created a Quizz" });
  } catch (error) {
    res.json({ error: "Facing Problem during Post. Try after some time..." });
  }
});
quizRouter.get("/active", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ status: "active" });
    if (!quiz) {
      return res.status(404).send({ message: "No active quiz found" });
    } else {
      res.send(quiz);
    }
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
});
quizRouter.get("/:id/result", async (req, res) => {
  const quizId = req.params.id;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).send({ message: "Quiz not found" });
    }
    if (quiz.status !== "finished") {
      return res.status(400).send({ message: "Quiz is not finished yet" });
    }
    const dateStr = quiz.endDate;
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffInMinutes <= 5) {
      return res
        .status(400)
        .send({ message: "Need to wait for ", diffInMinutes });
    }
    res.send({ result: quiz.options[quiz.rightAnswer] });
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
});
quizRouter.get("/all", async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.send(quizzes);
  } catch (err) {
    res.status(500).send({ error: "Failed to retrieve quizzes" });
  }
});
export default quizRouter;
