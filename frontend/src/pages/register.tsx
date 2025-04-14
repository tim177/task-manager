"use client";

import type React from "react";

import { useState } from "react";
import { Mail, User } from "lucide-react";
import { z } from "zod";
import { registerUser } from "../lib/api";
import AuthLayout from "../layouts/AuthLayout";
import FormInput from "../components/auth/form-input";
import PasswordInput from "../components/auth/password-input";
import SubmitButton from "../components/auth/submit-button";
import { Link, useNavigate } from "@tanstack/react-router";
import SocialButtons from "../components/auth/social-buttons";

// Form validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: true,
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
    setErrors({});

    // Validate form with Zod
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path?.[0];
        if (field && typeof field === "string") {
          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Proceed with API call if validation passed
    try {
      await registerUser(formData.name, formData.email, formData.password);

      navigate({ to: "/dashboard" });
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 mb-6">
          Sign up to get started with our platform
        </p>

        {apiError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormInput
            id="name"
            name="name"
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            icon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.name}
            required
          />

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

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <div className="space-y-1">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className={`h-4 w-4 ${
                    errors.acceptTerms
                      ? "border-red-500 text-red-600"
                      : "border-gray-300 text-teal-600"
                  } focus:ring-teal-500 rounded`}
                  required
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="acceptTerms" className="text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-teal-600 hover:text-teal-500"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-teal-600 hover:text-teal-500"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500 mt-1">{errors.acceptTerms}</p>
            )}
          </div>

          <SubmitButton text="Create account" isLoading={isSubmitting} />
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
