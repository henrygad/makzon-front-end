import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import {
  fetchMdia,
} from "./redux/slices/userMediaSlices";
import Displaymultiplemedismodel from "./sections/Displaymultiplemedismodel";
import Displaysinglemedialmodel from "./sections/Displaysinglemedialmodel";
const Treading = lazy(() => import("./pages/Treading"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Profile = lazy(() => import("./pages/Profile"));
const Createblogpost = lazy(() => import("./pages/Createblogpost"));
const Blogpost = lazy(() => import("./pages/Blogpost"));
const Updateprofile = lazy(() => import("./pages/Updateprofile"));
const Page404 = lazy(() => import("./pages/Page404"));

const App = () => {
  const navigate = useNavigate();
  const { data: User } = useAppSelector(
    (state) => state.userProfileSlices.userProfile
  );
  const appDispatch = useAppDispatch();

  const handleFetchUserDatas = () => {
    const userProfileData: userProps = JSON.parse(
      localStorage.getItem("user") ||
        JSON.stringify({
          userName: "@henry_dev",
          name: { familyName: "", givenName: "" },
          dateOfBirth: "",
          displayDateOfBirth: false,
          displayEmail: "",
          displayPhoneNumber: "",
          website: "",
          profession: [""],
          country: "",
          sex: "",
          bio: "",
          login: true,
        })
    );

    appDispatch(
      fetchProfile({
        data: userProfileData,
        loading: false,
        error: "",
      })
    );

    if (userProfileData) {
      /* fetching blogposts */
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

      /* fetching draft posts */
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

      /* fetching saves post */
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

      /* fetching media */
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
    }
  };

  useEffect(() => {
    handleFetchUserDatas();
  }, []);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route path="/" element={<Treading />} />
          <Route path="/:author/:slug" element={<Blogpost />} />
          <Route
            path="/register"
            element={
              !User.login ? (
                <Signup />
              ) : (
                <Navigate to={`/profile/${User.userName}`} />
              )
            }
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
        </Routes>
      </Suspense>
      {User.login ? (
        <>
          <div className="mt-20"></div>
          <nav className="container fixed bottom-0 right-0 left-0 bg-white py-2 border-t">
            {/* login bottom navigation */}
            <ul className="flex items-center justify-between gap-6">
              <li>
                <button onClick={() => navigate("/timeline")}>Timeline</button>
              </li>
              <li>
                <button onClick={() => navigate("/")}>Treading</button>
              </li>
              <li>
                <button onClick={() => navigate("/createblogpost")}>
                  Post
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/profile/" + User.userName)}>
                  Profile
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <nav>{/* logout bottom navigation */}</nav>
      )}  
      <Displaymultiplemedismodel />
      <Displaysinglemedialmodel />
    </div>
  );
};

export default App;
