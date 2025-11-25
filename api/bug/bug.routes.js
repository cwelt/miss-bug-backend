import express from "express";
import { bugService } from "./bug.service.js";
import {
  getBugs,
  getBug,
  createBug,
  updateBug,
  removeBug,
} from "./bug.controller.js";

const router = express.Router();

//* ------------------- Bugs Crud -------------------
router.get("/", getBugs);
router.get("/:bugId", getBug);
router.delete("/:bugId", removeBug);
router.post("/", createBug);
router.put("/:bugId", updateBug);

export const bugRoutes = router;
