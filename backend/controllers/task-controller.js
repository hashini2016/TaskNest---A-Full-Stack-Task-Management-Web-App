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
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    // Default response
    const response = {
      todo: 0,
      development: 0,
      done: 0
    };

    result.forEach(item => {
      switch (item._id) {
        case "TO DO":
          response.todo = item.count;
          break;
        case "Development":
          response.development = item.count;
          break;
        case "Done":
          response.done = item.count;
          break;
        default:
          break;
      }
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch priority count" });
  }
};

