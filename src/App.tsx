import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./pages/Loading";
import userProps from "./types/user.type";
import { useAppDispatch, useAppSelector } from "./redux";
import { fetchProfile } from "./redux/slices/userProfileSlices";
import postProps from "./types/post.type";
import {
  fetchBlogposts,
  fetchDrafts,
  fetchSavedBlogposts,
} from "./redux/slices/userBlogpostSlices";
import mediaProps from "./types/file.type";
import { fetchMdia } from "./redux/slices/userMediaSlices";
import Displaymultiplemedismodel from "./sections/Displaymultiplemedismodel";
import Displaysinglemedialmodel from "./sections/Displaysinglemedialmodel";
import { fetchNotifications } from "./redux/slices/userNotificationSlices";
import notificationProps from "./types/notification.type";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import Notification from "./pages/Notification";
import axios from "axios";
import errorProps from "./types/error.type";
import Cookies from "js-cookie";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Treading = lazy(() => import("./pages/Treading"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Profile = lazy(() => import("./pages/Profile"));
const Createblogpost = lazy(() => import("./pages/Createblogpost"));
const Blogpost = lazy(() => import("./pages/Blogpost"));
const Updateprofile = lazy(() => import("./pages/Updateprofile"));
const Settings = lazy(() => import("./pages/Settings"));
const Security = lazy(() => import("./pages/Security"));
const Verifyuser = lazy(() => import("./pages/Verifyuser"));
const Page404 = lazy(() => import("./pages/Page404"));

const App = () => {
  const { data: User } = useAppSelector(
    (state) => state.userProfileSlices.userProfile
  );
  const appDispatch = useAppDispatch();

  /* get client session */
  useEffect(() => {
    axios(apiEndPont + "/", {
      baseURL: apiEndPont + "/",
      withCredentials: true,
    })
      .then(async (res) => {
        const clientSession = (await res.data) as { sessionId: string };        
        appDispatch(
          fetchProfile({
            data: { ...User, sessionId: clientSession.sessionId },
            loading: true,
            error: "",
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });      

    document.body.style.background = "#fafafab0";
    return () => {
      document.body.style.background = "#fafafab0";
    };
  }, []);

  /* get user profile data */
  useEffect(() => {
    axios(apiEndPont + "/user", {
      baseURL: apiEndPont,
      withCredentials: true,
    })
      .then(async (res) => {
        const userData = (await res.data.data._doc) as userProps;
        
        appDispatch(
          fetchProfile({
            data: { ...User, ...userData, login: true },
            loading: false,
            error: "",
          })
        );       

        if (User.login === false) {
          // set a new cookie
          Cookies.set(
            "makzonFrtendSession",
            JSON.stringify({
              userName: userData.userName,
              email: userData.email,
              login: true,
              sessionId: User.sessionId,
            }),
            {
              expires: 1, // Cookie expires in 1 days
              secure: true, // Ensures the cookie is only sent over HTTPS
              sameSite: "Strict", // Prevents cross-site request forgery (adjust as needed)
            }
          );
        }

        //fetch user notifications
        const userNotificationsData: notificationProps[] = JSON.parse(
          localStorage.getItem("notifications") || "[]"
        );
        appDispatch(
          fetchNotifications({
            data: userNotificationsData,
            loading: false,
            error: "",
          })
        );

        //fetch user blogposts
        const userBlogpostsData: postProps[] = JSON.parse(
          localStorage.getItem("blogposts") || "[]"
        );
        appDispatch(
          fetchBlogposts({
            data: userBlogpostsData,
            loading: false,
            error: "",
          })
        );

        //fetch user draft posts
        const userDraftsData: postProps[] = JSON.parse(
          localStorage.getItem("drafts") || "[]"
        );
        appDispatch(
          fetchDrafts({
            data: userDraftsData,
            loading: false,
            error: "",
          })
        );

        //fetch user saves post
        const userSavedBlogpostsData: postProps[] = JSON.parse(
          localStorage.getItem("saves") || "[]"
        );
        appDispatch(
          fetchSavedBlogposts({
            data: userSavedBlogpostsData,
            loading: false,
            error: "",
          })
        );

        //fetch user media
        const userMediaData: mediaProps[] = JSON.parse(
          localStorage.getItem("media") || "[]"
        );
        appDispatch(
          fetchMdia({
            data: userMediaData,
            loading: false,
            error: "",
          })
        );
      })
      .catch((error) => {
        const getError = error as errorProps;
        const errorMsg: string = getError.response.data.message;
        if (errorMsg.toLowerCase().includes("unauthorized")) {
          appDispatch(
            fetchProfile({
              data: {
                sessionId: User.sessionId,
                userName: "",
                email: "",
                login: false,
              } as userProps,
              loading: true,
              error: errorMsg,
            })
          );
          Cookies.remove("makzonFrtendSession");
        }
      });

  }, [User.login]);


  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route
            path="/"
            element={
              !User.login ? (
                <Treading />
              ) : (
                <Navigate to={`/profile/${User.userName}`} />
              )
            }
          />
          <Route path="/:author/:slug" element={<Blogpost />} />
          <Route
            path="signup"
            element={!User.login ? <Signup /> : <Navigate to="/verify/user" />}
          />
          <Route
            path="/login"
            element={
              !User.login ? (
                <Login />
              ) : (
                <Navigate to={`/profile/${User.userName}`} />
              )
            }
          />
          <Route
            path="/verify/user"
            element={
              User.login && !User.userVerified ? (
                <Verifyuser />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/timeline"
            element={User.login ? <Timeline /> : <Navigate to="/login" />}
          />
          <Route
            path="/createblogpost"
            element={User.login ? <Createblogpost /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:userName"
            element={User.login ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/update"
            element={User.login ? <Updateprofile /> : <Navigate to="/login" />}
          />
          <Route
            path="/notification"
            element={User.login ? <Notification /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={User.login ? <Settings /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings/security"
            element={User.login ? <Security /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>
      <Footer />
      <Displaymultiplemedismodel />
      <Displaysinglemedialmodel />
    </>
  );
};

export default App;
