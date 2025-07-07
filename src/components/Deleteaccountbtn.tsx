import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux";
import { fetchProfile } from "../redux/slices/userProfileSlices";
import userProps from "../types/user.type";
import Dialog from "./Dialog";
import useDialog from "../hooks/useDialog";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;


const Deleteaccountbtn = () => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();
    const {handleDialog, dialog } = useDialog();
    const [loading, setLoading] = useState(false);


    const handDeleteaccount = async (password: string) => {
        if (loading) return;

        try {
            setLoading(true);

            const url = apiEndPont + "/user/?password="+password;
            const res = await axios.delete(url, { baseURL: apiEndPont + "/", withCredentials: true, });            
            const deleteData = await res.data;
            if (deleteData) {
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
            onClick={{}}
        >
            Delete account
        </button>

        <Dialog
            dialog={dialog}
            handleDialog={handleDialog}
            className=""
            children={<>
            </>}
        />
    </>;
};

export default Deleteaccountbtn;

