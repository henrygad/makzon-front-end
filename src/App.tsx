import { Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Blogpost,
  Createblogpost,
  Login,
  Notification,
  Page404,
  Profile,
  Security,
  Settings,
  Signup,
  Feed,
  Trending,
  Updateprofile,
  Verifyuser,
  Forgetpassword,
  Searchresult,
  Saves,
} from "./pages";
import userProps from "./types/user.type";
import postProps from "./types/post.type";
import { useAppDispatch, useAppSelector } from "./redux";
import { fetchProfile } from "./redux/slices/userProfileSlices";
import {
  fetchBlogposts,
  fetchDrafts,
  fetchSavedBlogposts,
} from "./redux/slices/userBlogpostSlices";
import mediaProps from "./types/media.type";
import { fetchMedia } from "./redux/slices/userMediaSlices";
import Displaymultiplemedismodel from "./sections/Displaymultiplemedismodel";
import Displaysinglemedialmodel from "./sections/Displaysinglemedialmodel";
import {
  addNotifications,
  fetchNotifications,
} from "./redux/slices/userNotificationSlices";
import notificationProps from "./types/notification.type";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import errorProps from "./types/error.type";
import Cookies from "js-cookie";
import axios from "axios";
import Displayscreenloading from "./components/loaders/Displayscreenloading";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const App = () => {
  const { data: User } = useAppSelector(
    (state) => state.userProfileSlices.userProfile
  );
  const appDispatch = useAppDispatch();

  const [searchHistories, setSearchHistories] = useState<{ _id: string, search: string }[] | null>(null);
  const [postSearchResults, setpostSearchResults] = useState<postProps[] | null>(null);
  const [userSearchResults, setuUserSearchResults] = useState<userProps[] | null>(null);
  const [searchError, setSearchError] = useState("");
  
  const [newUsers, setNewUsers] = useState<userProps[] | null>(null);
  const [trendingBlogposts, setTrendingBlogposts] = useState<postProps[] | null>(null);

  const [notificationUpdate, setNotificationUpdate] =
    useState<notificationProps | null>(null);


  useEffect(() => {

    // fetch user session
    axios(apiEndPont + "/", {
      baseURL: apiEndPont + "/",
      withCredentials: true,
    })
      .then((res) => res.data)
      .then((data) => {
        const clientSession = data as { sessionId: string };
        appDispatch(
          fetchProfile({
            data: { ...User, sessionId: clientSession.sessionId },
            loading: true,
            error: "",
          })
        );

        // fetch user search history
        axios(apiEndPont + "/search/history")
          .then((res) => res.data)
          .then((data) => {
            console.log(data, "search history");
            const getSearchHistories = data.data as { _id: string, search: string }[];
            console.log(getSearchHistories, "fetch search history");
            setSearchHistories(getSearchHistories);
          })
          .catch((error) => console.error(error));
      })
      .catch((err) => {
        console.error(err);
      });

    // fetch new users for the trending page
    axios(apiEndPont + "/user/all", {
      baseURL: apiEndPont,
      withCredentials: true,
    })
      .then(async (res) => {
        const userMedia: userProps[] = await res.data.data;
        setNewUsers(userMedia);
      })
      .catch((error) => console.error(error));

    // fetch Trending blogpost
    axios(apiEndPont + "/post/trending", {
      baseURL: apiEndPont + "/",
      withCredentials: true,
    })
      .then(async (res) => {
        const trendingBlogpost: postProps[] = await res.data.data;
        setTrendingBlogposts(trendingBlogpost);
      })
      .catch((err) => {
        console.error(err);
      });

  }, []);


  useEffect(() => {

    // get user profile data
    axios(apiEndPont + "/user", {
      baseURL: apiEndPont,
      withCredentials: true,
    })
      .then(async (res) => {
        const data = (await res.data.data) as userProps;
        const user = { ...User, ...data, login: true };

        appDispatch(
          fetchProfile({
            data: user,
            loading: false,
            error: "",
          })
        );

        // Set local cookies if User.login if still false
        if (user.login === false) {
          // set a new cookie
          Cookies.set(
            "makzonFrtendSession",
            JSON.stringify({
              userName: user.userName,
              email: user.email,
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

        // fetch user notifications
        axios(apiEndPont + "/notification", {
          baseURL: apiEndPont,
          withCredentials: true,
        })
          .then(async (res) => {
            const userNotifications: notificationProps[] = await res.data.data;
            appDispatch(
              fetchNotifications({
                data: userNotifications,
                loading: false,
                error: "",
              })
            );
          })
          .catch((error) => console.error(error));

        // fetch user blogposts
        axios(apiEndPont + "/post/user?skip=0&limit=20", {
          baseURL: apiEndPont,
          withCredentials: true,
        })
          .then(async (res) => {
            const userBlogposts: postProps[] = await res.data.data;
            appDispatch(
              fetchBlogposts({
                data: userBlogposts,
                loading: false,
                error: "",
              })
            );
          })
          .catch((error) => console.error(error));

        // fetch user draft posts
        axios(apiEndPont + "/draft", {
          baseURL: apiEndPont,
          withCredentials: true,
        })
          .then(async (res) => {
            const userDrafts: postProps[] = await res.data.data;
            appDispatch(
              fetchDrafts({
                data: userDrafts,
                loading: false,
                error: "",
              })
            );
          })
          .catch((error) => console.error(error));

        // fetch user saves post
        if (user.saves?.length) {
          axios(apiEndPont + "/post/saves", {
            baseURL: apiEndPont,
            withCredentials: true,
          })
            .then(async (res) => {
              const userSavedBlogposts: postProps[] = await res.data.data;
              appDispatch(
                fetchSavedBlogposts({
                  data: userSavedBlogposts,
                  loading: false,
                  error: "",
                })
              );
            })
            .catch((error) => console.error(error));
        }

        // fetch user media
        axios(apiEndPont + "/media", {
          baseURL: apiEndPont,
          withCredentials: true,
        })
          .then(async (res) => {
            const userMedia: mediaProps[] = await res.data.data;
            appDispatch(
              fetchMedia({
                data: userMedia,
                loading: false,
                error: "",
              })
            );
          })
          .catch((error) => console.error(error));
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


    // fetch live update for trending posts page
    if (!User.login) return;

    // Stream live notification;
    const notificationEventSource = new EventSource(
      apiEndPont + "/notification/stream",
      {
        withCredentials: true,
      }
    );
    notificationEventSource.onmessage = (event) => {
      const notificationUpdate: notificationProps = JSON.parse(
        event.data.notification
      );
      setNotificationUpdate(notificationUpdate);
      appDispatch(addNotifications(notificationUpdate));
    };
    notificationEventSource.onerror = (error) => {
      console.error(error);
      notificationEventSource.close();
    };

  }, [User.login]);

  return (
    <>
      <Header
        notificationUpdate={notificationUpdate}
        setNotificationUpdate={setNotificationUpdate}
      />
      <Suspense fallback={<Displayscreenloading loading={true} />}>
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route
            path="/"
            element={
              <Trending
                newUsers={newUsers}
                trendingPosts={trendingBlogposts}
                setTrendingPosts={setTrendingBlogposts}
                searchHistories={searchHistories}
                setSearchHistories={setSearchHistories}
                setpostSearchResults={setpostSearchResults}
                setuUserSearchResults={setuUserSearchResults}
                postSearchResults={postSearchResults}
                userSearchResults={userSearchResults}
                searchError={searchError}
                setSearchError={setSearchError}
              />
            }
          />
          <Route
            path="/search"
            element={<Searchresult
              searchHistories={searchHistories}
              setSearchHistories={setSearchHistories}
              setpostSearchResults={setpostSearchResults}
              setuUserSearchResults={setuUserSearchResults}
              postSearchResults={postSearchResults}
              userSearchResults={userSearchResults}
              searchError={searchError}
              setSearchError={setSearchError}
            />}
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
            path="/forgetpassword"
            element={
              !User.login ? (
                <Forgetpassword />
              ) : (
                <Navigate to={`/profile/${User.userName}`} />
              )
            }
          />
          <Route
            path="/verify/email"
            element={
              User.login && !User.userVerified ? (
                <Verifyuser />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/feeds"
            element={User.login ? <Feed /> : <Navigate to="/login" />}
          />
          <Route
            path="/saves"
            element={User.login ? <Saves /> : <Navigate to="/login" />}
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
