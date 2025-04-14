const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A task must be associated to a user"],
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please provide the description about the task"],
    },
    completed: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
