"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { createTask } from "../../lib/api";
import Modal from "../ui/modal";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

// Task form validation schema
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  completed: z.boolean().default(false),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function AddTaskModal({
  isOpen,
  onClose,
  onTaskAdded,
}: AddTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormValues>({
    title: "",
    completed: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear API error
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    try {
      // Validate form with Zod
      taskSchema.parse(formData);
      setErrors({});

      // Call API to create task
      try {
        await createTask(formData.title, formData.completed);

        // Reset form and close modal
        setFormData({ title: "", completed: false });
        onTaskAdded();
        onClose();
      } catch (error) {
        setApiError(
          error instanceof Error
            ? error.message
            : "Failed to create task. Please try again."
        );
      }
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      {apiError && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 block"
          >
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
            placeholder="Enter task title"
            required
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="completed"
            name="completed"
            type="checkbox"
            checked={formData.completed}
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label
            htmlFor="completed"
            className="ml-2 block text-sm text-gray-700"
          >
            Mark as completed
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
