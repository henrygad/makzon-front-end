import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux";
import { fetchProfile } from "../redux/slices/userProfileSlices";
import userProps from "../types/user.type";
import Dialog from "./Dialog";
import useDialog from "../hooks/useDialog";
import errorProps from "../types/error.type";
import Displayscreenloading from "../loaders/Displayscreenloading";
import { Button } from "./Button";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;


const Deleteaccountbtn = () => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    const { handleDialog, dialog } = useDialog();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [password, setPassword] = useState("");
    const [toggleHidePassword, setToggleHidePassword] = useState(false);

    const handDeleteaccount = async (password: string) => {        
        setLoading(true);
        try {
            const url = apiEndPont + "/user/?password=" + password;
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
            const getError = error as errorProps;
            const errorMsg: string = getError.response.data.message;
            console.error(error);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };


    return <>
        <button
            className="font-text text-sm text-white px-3 py-1.5 bg-red-700 active:bg-opacity-50 shadow-sm border rounded-md"
            onClick={handleDialog}
        >
            Delete account
        </button>

        <Dialog
            dialog={dialog}
            handleDialog={handleDialog}
            className=""
            children={<span className="flex flex-col gap-8 p-8 shadow-sm">
                <span className="inline-block">
                    <p className="text-xl font-bold text-red-700 font-text">
                        Do you want to delete your account?
                    </p>
                </span>
                <span className="inline-block">
                    <span className="flex flex-col gap-3">
                        <h3 className="font-text text-base font-medium text-slate-500">
                            Comfirm password to continue
                        </h3>
                        <span className="flex-1 relative">
                            <input
                                id="password"
                                type={!toggleHidePassword ? "password" : "text"}
                                placeholder="Enter your password"
                                autoComplete="false"
                                className={`font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px]  outline-none border rounded-lg px-3 py-2 ${error ? "border-red-600 outline-red-600" : ""}`}                               
                                onChange={(e)=> setPassword(e.target.value)}
                            />
                            <span
                                onClick={() => setToggleHidePassword(!toggleHidePassword)}
                                className=" absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                            >
                                {!toggleHidePassword ? (
                                    <FaRegEye size={16} />
                                ) : (
                                    <FaRegEyeSlash size={18} />
                                )}
                            </span>
                        </span>
                        {error && (
                            <p className="text-xs text-red-600">
                                {error}
                            </p>
                        )}
                    </span>
                </span>
                <span className="flex justify-around items-center gap-4">
                    <span className="inline-block">
                        <Button
                            fieldName={"Continue to Delete"}
                            disabled={loading || !password.trim()}
                            onClick={() => handDeleteaccount(password)}
                            className={` text-red-700 font-bold ${loading || !password.trim() ? "opacity-30":""}`}
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

export default Deleteaccountbtn;

