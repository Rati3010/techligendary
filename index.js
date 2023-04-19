import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connection } from "./config/db.js";
import { Quiz } from "./models/QuizModel.js";
import quizRouter from "./router/quizzRouter.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

function updateQuizStatus() {
  Quiz.find({})
    .then((quizzes) => {
      quizzes.forEach(async (quiz) => {
        var now = new Date();
        if (now < quiz.startDate) {
          quiz.status = "inactive";
        } else if (now >= quiz.startDate && now <= quiz.endDate) {
          quiz.status = "active";
        } else {
          quiz.status = "finished";
        }
        await quiz.save();
      });
    })
    .catch((err) => {
      throw err;
    });
}

app.use((req, res, next) => {
  updateQuizStatus();
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to Live Quizz");
});

app.use("/quizzes",quizRouter)

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB port:-", process.env.port);
  } catch (error) {
    console.log(error);
  }
});
