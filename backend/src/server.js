import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import notesRouter from "./router/notesRouter.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimit.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes/", notesRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
  });
});
