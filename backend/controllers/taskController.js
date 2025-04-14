const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({
      tasks,
      status: "Success",
      message: "Task Found Successfully...",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Cannot fetch the tasks" });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (!title)
      return res.status(400).json({
        status: "Failed",
        message: "Error getting title for adding tasks",
      });

    const task = await Task.create({ user: req.user.id, title, completed });
    res
      .status(200)
      .json({ status: "Success", message: "Task added successfully" });
  } catch (error) {
    res.status(500).json({
      status: "Failed adding task",
      message: "Internal Server error on adding task",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params; // Get task ID from params
    const { completed } = req.body; // Get updated data from the request body

    // 1. Validate if at least one field is provided to update
    if (completed === undefined) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide the 'completed' field to update",
      });
    }

    // 2. Find the task by ID and ensure the user is the one who created it
    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        status: "Failed",
        message: "Task not found or user is not authorized to update this task",
      });
    }

    // 3. Update task fields
    task.completed = completed; // Update completed field

    // 4. Save the updated task
    await task.save();

    // 5. Return success response
    res.status(200).json({
      status: "Success",
      message: "Task updated successfully",
      task, // Optionally, return the updated task
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message, // Add the error message for debugging purposes
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params; // Get task ID from params

    // 1. Find the task by ID and ensure the user is the one who created it
    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        status: "Failed",
        message: "Task not found or user is not authorized to delete this task",
      });
    }

    // 2. Delete the task using deleteOne instead of remove
    await Task.deleteOne({ _id: id }); // Alternative to task.remove()

    // 3. Send success response
    res.status(200).json({
      status: "Success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};
