"use client";

import type React from "react";

import { useState } from "react";
import { Mail } from "lucide-react";
import { z } from "zod";
import { loginUser } from "../lib/api";
import AuthLayout from "../layouts/AuthLayout";
import FormInput from "../components/auth/form-input";
import PasswordInput from "../components/auth/password-input";
import SubmitButton from "../components/auth/submit-button";
import { Link, useNavigate } from "@tanstack/react-router";
import SocialButtons from "../components/auth/social-buttons";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear API error when user makes changes
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
      loginSchema.parse(formData);
      setErrors({});

      // Call login API
      try {
        await loginUser(formData.email, formData.password);

        // Redirect to dashboard on successful login
        navigate({ to: "/dashboard" });
      } catch (error) {
        setApiError(
          error instanceof Error
            ? error.message
            : "Login failed. Please try again."
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
    <AuthLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-6">
          Sign in to your account to continue
        </p>

        {apiError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email}
            required
          />

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-teal-600 hover:text-teal-500"
            >
              Forgot password?
            </a>
          </div>

          <SubmitButton text="Sign in" isLoading={isSubmitting} />
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <SocialButtons />

        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
