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

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};


export const getTaskStatusCount = async (req, res) => {
  try {
    const result = await Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    const response = { Low: 0, Medium: 0, High: 0 };

    result.forEach(item => {
      switch (item._id) {
        case "Low":
          response.Low = item.count;
          break;
        case "Medium":
          response.Medium = item.count;
          break;
        case "High":
          response.High = item.count;
          break;
      }
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch task counts" });
  }
};

export const getRecentTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      priority: "Low"
    }).populate("createdBy", "name email");

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};