import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home, Login, SignUp, Dashboard, Debts, Folders, Contacts, Users, Profile } from "@/router/router";

import { Loading } from "@/components/shared/Loading";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import NotFound from "@/components/shared/NotFound";
import { ThemeProvider } from "@/lib/ThemeProvider";

import { ProtectedRoute, PublicRoute } from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/layout/DashboardLayout";
import Layout from "@/layout/layout"; 

export default function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />, 
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          ),
        },
      ],
    },

    {
      element: <ProtectedRoute />, 
      children: [
        {
          element: <DashboardLayout />, 
          children: [
            {
              path: "/dashboard",
              element: (
                <Suspense fallback={<Loading />}>
                  <Dashboard />
                </Suspense>
              ),
            },
            {
              path: "/debts",
              element: (
                <Suspense fallback={<Loading />}>
                  <Debts />
                </Suspense>
              ),
            },
            {
              path: "/folders",
              element: (
                <Suspense fallback={<Loading />}>
                  <Folders />
                </Suspense>
              ),
            },
            {
              path: "/contacts",
              element: (
                <Suspense fallback={<Loading />}>
                  <Contacts />
                </Suspense>
              ),
            },
            {
              path: "/users",
              element: (
                <Suspense fallback={<Loading />}>
                  <Users />
                </Suspense>
              ),
            },
            {
              path: "/profile",
              element: (
                <Suspense fallback={<Loading />}>
                  <Profile />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },


    {
      element: <PublicRoute />, 
      children: [
        {
          path: "/login",
          element: (
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "/signup",
          element: (
            <Suspense fallback={<Loading />}>
              <SignUp />
            </Suspense>
          ),
        },
      ],
    },

    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ThemeProvider>
  );
}