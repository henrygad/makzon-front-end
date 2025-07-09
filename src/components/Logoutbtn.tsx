import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux";
import { fetchProfile } from "../redux/slices/userProfileSlices";
import userProps from "../types/user.type";
import Displayscreenloading from "../loaders/Displayscreenloading";
import Dialog from "./Dialog";
import { Button } from "./Button";
import useDialog from "../hooks/useDialog";

const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Logoutbtn = () => {
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const { data: User } = useAppSelector((state) => state.userProfileSlices.userProfile);

  const { handleDialog, dialog } = useDialog();
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
      className="font-text text-sm text-white px-3 py-1.5 bg-red-700 active:bg-opacity-50 shadow-sm border rounded-md"
      onClick={handleDialog}
    >
      Logout
    </button>
    <Dialog
      dialog={dialog}
      handleDialog={handleDialog}
      className=""
      children={<span className="flex flex-col gap-6 shadow-sm p-8">
        <span className="inline-block">
          <p className="text-xl font-bold text-red-700 font-text">
            Do you want to sign out?
          </p>
        </span>        
        <span className="flex justify-around items-start gap-4">
          <span className="inline-block">
            <Button
              fieldName={"Sign out"}             
              onClick={handleLogOut}
              className="text-red-700 font-bold"
            />
          </span>
          <span className="inline-block">
            <Button
              fieldName={"Cancel"}
              disabled={loading}
              onClick={handleDialog}
              className="text-blue-700 font-bold"
            />
          </span>
        </span>
      </span>}
    />
    <Displayscreenloading loading={loading} />
  </>;
};

export default Logoutbtn;
