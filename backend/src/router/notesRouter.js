import express from "express";
import {
  deleteNote,
  getAll,
  getById,
  updateNote,
  uploadNote,
} from "../controller/notes.Controller.js";

const router = express.Router();

router.get("/", getAll);

router.post("/", uploadNote);

router.get("/:id", getById);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router;
