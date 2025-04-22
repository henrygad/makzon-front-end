import { lazy } from "react";

export const Trending = lazy(() => import("./Trending"));
export const Signup = lazy(() => import("./Signup"));
export const Login = lazy(() => import("./Login"));
export const Timeline = lazy(() => import("./Timeline"));
export const Profile = lazy(() => import("./Profile"));
export const Createblogpost = lazy(() => import("./Createblogpost"));
export const Blogpost = lazy(() => import("./Blogpost"));
export const Updateprofile = lazy(() => import("./Updateprofile"));
export const Settings = lazy(() => import("./Settings"));
export const Security = lazy(() => import("./Security"));
export const Verifyuser = lazy(() => import("./Verifyuser"));
export const Notification = lazy(() => import("./Notification"));
export const Page404 = lazy(() => import("./Page404"));