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
import { editProfile, fetchProfile } from "./redux/slices/userProfileSlices";
import {
  fetchBlogposts,
  fetchDrafts,
  fetchSavedBlogposts,
} from "./redux/slices/userBlogpostSlices";
import mediaProps from "./types/media.type";
import { fetchMedia } from "./redux/slices/userMediaSlices";
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
import Displayscreenloading from "./loaders/Displayscreenloading";
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
  const [trendingPosts, setTrendingPosts] = useState<postProps[] | null>(null);

  const [postFeeds, setPostFeeds] = useState<postProps[] | null>(null);
  const [getNewPostFeeds, setGetNewPostFeeds] = useState<postProps[] | null>(null);

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
        const client = data as { sessionId: string };
        appDispatch(
          fetchProfile({
            data: { ...User, sessionId: client.sessionId },
            loading: true,
            error: "",
          })
        );

        // fetch user search history
        axios(apiEndPont + "/search/history")
          .then((res) => res.data)
          .then((data) => {
            const getSearchHistories = data.data as { _id: string, search: string }[];
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
        setTrendingPosts(trendingBlogpost);
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
      .then(res => res.data)
      .then(data => {
        const user = { ...User, ...(data.data as userProps), login: true };
        appDispatch(
          fetchProfile({
            data: user,
            loading: false,
            error: "",
          })
        );

        // check if local cookies exist        
        // if not exist then create new local cookies if User.login if still false
        const localCookiesExist = Cookies.get("makzonFrtendSession");
        if (!localCookiesExist) {
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
          .then(res => res.data)
          .then(data => {
            const userNotifications = data.data as notificationProps[];
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
          .then((res) => res.data)
          .then(data => {
            const userBlogposts = data.data as postProps[];
            appDispatch(
              fetchBlogposts({
                data: userBlogposts,
                loading: false,
                error: "",
              })
            );
          })
          .catch((error) => console.error(error));

        // fetch user timeline posts or feeds        
        axios(apiEndPont + "/post/user/get/timeline", {
          baseURL: apiEndPont,
          withCredentials: true,
        })
          .then((res) => res.data)
          .then(data => {
            const feeds = data.data as postProps[];
            setPostFeeds(feeds);
          })
          .catch((error) => console.error(error));

        // fetch user draft posts
        axios(apiEndPont + "/draft", {
          baseURL: apiEndPont,
          withCredentials: true,
        })
          .then(res => res.data)
          .then(data => {
            const userDrafts = data.data as postProps[];
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
            .then((res) => res.data)
            .then(data => {
              const userSavedBlogposts = data.data as postProps[];
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
          .then((res) => res.data)
          .then(data => {
            const userMedia = data.data as mediaProps[];
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
        const errorMsg: string = getError.response?.data?.message || "";
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

    if (User.login) {

      // Followers live update
      const followersEventSource = new EventSource(
        apiEndPont + "/user/followers/stream",
        {
          withCredentials: true,
        }
      );
      followersEventSource.onmessage = (event) => {
        const data = JSON.parse(event.data) as { eventType: string, followers: string[] };
        const { followers } = data;           
        const user = { ...User, followers } as userProps;
        appDispatch(editProfile(user));       
      };
      followersEventSource.onerror = (error) => {
        console.error(error);
        followersEventSource.close();
      };


      // Notification live update 
      const notificationEventSource = new EventSource(
        apiEndPont + "/notification/stream",
        {
          withCredentials: true,
        }
      );
      notificationEventSource.onmessage = (event) => {
        const data = JSON.parse(event.data) as { eventType: string, notification: notificationProps };
        const { eventType, notification: newNotification } = data;
        if (eventType.toLowerCase() === "insert") {
          setNotificationUpdate(newNotification);
          appDispatch(addNotifications(newNotification));
        }
      };
      notificationEventSource.onerror = (error) => {
        console.error(error);
        notificationEventSource.close();
      };

      // Post feeds live update
      const postFeedsEventSource = new EventSource(
        apiEndPont + "/post/user/get/timeline/stream",
        {
          withCredentials: true,
        }
      );
      postFeedsEventSource.onmessage = (event) => {
        const data = JSON.parse(event.data) as { eventType: string, post: postProps };
        const { eventType, post: newPostFeeds } = data;


        if (eventType.toLowerCase() === "delete") {
          setPostFeeds(pre => pre ? pre.filter(post => post._id !== newPostFeeds._id) : pre);
        }
        if (eventType.toLowerCase() === "insert") {
          if (newPostFeeds.author === User.userName) {
            setPostFeeds(pre => pre ? [newPostFeeds, ...pre] : [newPostFeeds]);
          } else {
            setGetNewPostFeeds(pre => pre ? [newPostFeeds, ...pre] : [newPostFeeds]);
          }
        }
        if (eventType.toLowerCase() === "update") {
          setPostFeeds(pre => pre ?
            pre.map(post => post._id === newPostFeeds._id ? { ...post, ...newPostFeeds } : post) :
            pre);
        }


      };
      postFeedsEventSource.onerror = (error) => {
        console.error(error);
        postFeedsEventSource.close();
      };
    }

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
                trendingPosts={trendingPosts}
                setTrendingPosts={setTrendingPosts}
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
          <Route path="/post/:author/:slug" element={<Blogpost />} />
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
            element={User.login ?
              <Feed
                postFeeds={postFeeds}
                setPostFeeds={setPostFeeds}
                newPostFeeds={getNewPostFeeds}
                setNewPostFeeds={setGetNewPostFeeds}
              /> :
              <Navigate to="/login" />
            }
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
            path="updateprofile"
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
            path="/security"
            element={User.login ? <Security /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>
      <Footer />
      <Displaysinglemedialmodel />
    </>
  );
};

export default App;
