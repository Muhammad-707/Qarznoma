import { lazy } from "react";

export const Home = lazy(() => import("@/pages/Home/Home"));
export const Login = lazy(() => import("@/pages/Auth/Login"));
export const SignUp = lazy(() => import("@/pages/Auth/Signup"));
export const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
export const Debts = lazy(() => import("@/pages/Debts/Debts"));
export const Folders = lazy(() => import("@/pages/Folders/Folders"));
export const Contacts = lazy(() => import("@/pages/Contacts/Contacts"));
export const Users = lazy(() => import("@/pages/Users/Users"));
export const Profile = lazy(() => import("@/pages/Profile/Profile"));