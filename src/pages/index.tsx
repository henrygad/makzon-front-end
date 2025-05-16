import { lazy } from "react";

export const Trending = lazy(() => import("./Trending"));
export const Signup = lazy(() => import("./Signup"));
export const Login = lazy(() => import("./Login"));
export const Feed = lazy(() => import("./Feed"));
export const Profile = lazy(() => import("./Profile"));
export const Createblogpost = lazy(() => import("./Createblogpost"));
export const Blogpost = lazy(() => import("./Blogpost"));
export const Updateprofile = lazy(() => import("./Updateprofile"));
export const Settings = lazy(() => import("./Settings"));
export const Security = lazy(() => import("./Security"));
export const Verifyuser = lazy(() => import("./Verification"));
export const Notification = lazy(() => import("./Notification"));
export const Forgetpassword = lazy(() => import("./Forgetpassword"));
export const Searchresult = lazy(() => import("./Searchresult"));
export const Saves = lazy(() => import("./Saves"));
export const Page404 = lazy(() => import("./Page404"));