import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStatusCount,
  getRecentTasks
} from "../controllers/task-controller.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);

router.get("/statusCount", getTaskStatusCount);
router.get("/recentTask", getRecentTasks);

router.get("/:id", getTaskById);

router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;