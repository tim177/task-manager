const express = require("express");
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const protect = require("../middlewares");

const router = express.Router();

router.post("/task", protect, addTask);
router.get("/tasks", protect, getTasks);
router.put("/task/:id", protect, updateTask);
router.delete("/task/:id", protect, deleteTask);

module.exports = router;
