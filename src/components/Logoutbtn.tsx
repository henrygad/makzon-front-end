import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux";
import { fetchProfile } from "../redux/slices/userProfileSlices";
import userProps from "../types/user.type";
import Displayscreenloading from "../loaders/Displayscreenloading";

const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Logoutbtn = () => {
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const { data: User } = useAppSelector((state) => state.userProfileSlices.userProfile);
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const url = apiEndPont+"/auth/logout";
      const res = await axios(url, {
        baseURL: apiEndPont + "/",
        withCredentials: true,
      });
      const logoutData = await res.data;      
      if (logoutData) {
        appDispatch(fetchProfile({
          data: {
            sessionId: User.sessionId,
            userName: "",
            email: "",
            login: false,
          } as userProps,
          loading: true,
          error: "",
        }));
        navigate("/login");        
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return <>
    <button
      className=" font-text text-sm text-white px-3 py-1.5 bg-red-700 active:bg-opacity-50 shadow-sm border rounded-md"
      onClick={handleLogOut}
    >
      {!loading ? "Logout" : "loading"}
    </button>
    <Displayscreenloading loading={loading} />
  </>;
};

export default Logoutbtn;
