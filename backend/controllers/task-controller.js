import Task from "../model/Task.js";
import mongoose from "mongoose";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { description, startDate, endDate, priority, remark,userId } = req.body;

    if (!description || !startDate || !endDate || !priority || !userId) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

   const createdBy = mongoose.Types.ObjectId(userId);

    const task = new Task({
      description,
      startDate,
      endDate,
      priority,
      remark,
      createdBy,
    });

    await task.save();

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("createdBy", "name email");
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("createdBy", "name email");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
