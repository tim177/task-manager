import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  LogOut,
  Loader2,
} from "lucide-react";
import {
  deleteTask,
  getTasks,
  logoutUser,
  Task,
  TaskResponse,
  updateTask,
} from "../lib/api";
import AddTaskModal from "../components/task/add-task";
import { useNavigate } from "@tanstack/react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on status
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data: TaskResponse = await getTasks();

      setTasks(data.tasks);
    } catch (error) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle task completion status
  const handleToggleStatus = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed: !completed });

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);

      // Update local state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-teal-600">Task Manager</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, User</span>
              <button
                onClick={handleLogout}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 flex items-center"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Task filters */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filter === "all"
                    ? "bg-teal-100 text-teal-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filter === "active"
                    ? "bg-teal-100 text-teal-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filter === "completed"
                    ? "bg-teal-100 text-teal-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Completed
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Task list */}
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {filter === "all"
                ? "No tasks found. Add a new task to get started!"
                : filter === "active"
                ? "No active tasks found."
                : "No completed tasks found."}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <li key={task._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handleToggleStatus(task._id, task.completed)
                        }
                        className={`flex-shrink-0 ${
                          task.completed
                            ? "text-teal-500"
                            : "text-gray-400 hover:text-gray-500"
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      <span
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-1 rounded-full text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Task summary */}
          <div className="p-4 bg-gray-50 text-sm text-gray-500">
            {tasks.filter((t) => !t.completed).length} tasks remaining
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskAdded={fetchTasks}
      />
    </div>
  );
}
