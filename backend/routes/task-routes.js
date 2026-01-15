import express from "express";
import { createTask, getTasks, getTaskById, updateTask,deleteTask, getTaskStatusCount } from "../controllers/task-controller.js";
const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/status-count", getTaskStatusCount);

export default router;
