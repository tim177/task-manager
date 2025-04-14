import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

const LoginPage = lazy(() => import("../pages/login"));
const RegisterPage = lazy(() => import("../pages/register"));
const DashboardPage = lazy(() => import("../pages/dashboard"));

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

export const loginRoute = createRoute({
  path: "/login",
  getParentRoute: () => rootRoute,
  component: () => <LoginPage />,
});

export const registerRoute = createRoute({
  path: "/register",
  getParentRoute: () => rootRoute,
  component: () => <RegisterPage />,
});

export const dashboardRoute = createRoute({
  path: "/dashboard",
  getParentRoute: () => rootRoute,
  component: () => <DashboardPage />,
});

export const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  dashboardRoute,
]);
