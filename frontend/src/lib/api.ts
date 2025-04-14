// Task type definition
export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
}

export interface TaskResponse {
  tasks: Task[];
  status: string;
  message: string;
}

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
}

// API base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://task-manager-backend-2w1s.onrender.com/api" // Replace with your actual production API URL
    : "http://localhost:5000/api"; // Default to localhost for development

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add auth token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// Auth API functions
export async function loginUser(email: string, password: string) {
  const response = await apiRequest<{ user: User; token: string }>(
    "/user/login",
    "POST",
    {
      email,
      password,
    }
  );

  // Store auth token
  localStorage.setItem("authToken", response.token);

  return response.user;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const response = await apiRequest<{ user: User; token: string }>(
    "/user/register",
    "POST",
    {
      name,
      email,
      password,
    }
  );

  // Store auth token
  localStorage.setItem("authToken", response.token);

  return response.user;
}

export async function logoutUser() {
  localStorage.removeItem("authToken");
}

// Task API functions
export async function getTasks(): Promise<TaskResponse> {
  return apiRequest<TaskResponse>("/task/tasks");
}

export async function createTask(
  title: string,
  completed = false
): Promise<Task> {
  return apiRequest<Task>("/task/task", "POST", {
    title,
    completed,
  });
}

export async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<Task> {
  return apiRequest<Task>(`/task/task/${id}`, "PUT", updates);
}

export async function deleteTask(id: string): Promise<void> {
  return apiRequest<void>(`/task/task/${id}`, "DELETE");
}
