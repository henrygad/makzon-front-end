import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import logInValid from "../validators/logInValid";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import errorProps from "../types/error.type";
import { fetchProfile } from "../redux/slices/userProfileSlices";
import { useAppDispatch, useAppSelector } from "../redux";
import Cookies from "js-cookie";
import loginProps from "../types/login.type";
import Displayscreenloading from "../loaders/Displayscreenloading";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;


const Loginuser = () => {
    const { data: User } = useAppSelector((state) => state.userProfileSlices.userProfile);
    const appDispatch = useAppDispatch();
    const [toggleHidePassword, setToggleHidePassword] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors },
    } = useForm<loginProps>({ resolver: yupResolver(logInValid) });
    const getInputValues = watch();

    const handleLoginForm = async (data: loginProps) => {
        if (loading) return;

        try {
            setLoading(true);

            const url = apiEndPont + "/auth/login";
            const res = await axios.post(
                url,
                data,
                { baseURL: apiEndPont, withCredentials: true }
            );
            const loginData = await res.data as { userName: string, email: string, };

            if (loginData) {
                // update user profile
                appDispatch(fetchProfile({
                    data: { ...User, userName: loginData.userName, email: loginData.email, login: true },
                    loading: false,
                    error: "",
                }));

                // set cookie
                Cookies.set("makzonFrtendSession",
                    JSON.stringify({ userName: loginData.userName, email: loginData.email, login: true, sessionId: User.sessionId }), {
                    expires: 1, // Cookie expires in 1 days
                    secure: true, // Ensures the cookie is only sent over HTTPS
                    sameSite: "Strict", // Prevents cross-site request forgery (adjust as needed)
                });

                navigate("/profile/" + loginData.userName);
            }

        } catch (error) {
            const getError = error as errorProps;
            const errorMsg: string = getError.response.data.message;

            setValue("password", "");

            if (errorMsg.toLowerCase().includes("password")) {                
                setError("password", {
                    type: "manual",
                    message: "Incorrect password"
                });
            } else {
                setError("identity", {
                    type: "manual",
                    message: "There is no account with this user name",
                });
            }


           

            console.error(error);
        } finally {
            setValue("identity", "");
            setValue("password", "");
            setToggleHidePassword(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state) {
            const { identity } = location.state as { identity: string };            
            setValue("identity", identity);
        }
     }, [location.state]);

    return <section className="flex-1 flex justify-center items-center pt-10 px-5 space-y-16">
        {/* login up local form */}
        <form
            id="login-form"
            onSubmit={handleSubmit(handleLoginForm)}
            className="space-y-6"
        >

            {/* client login identity*/}
            <label htmlFor="username" className="flex flex-col gap-1">
                <h3 className="font-text text-base font-medium">
                    Username / Email
                </h3>
                <input
                    id="username"
                    type="text"
                    placeholder="Enter user name or email"
                    autoComplete="true"
                    className={`font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px]  outline-none border rounded-lg px-3 py-2
                     ${errors.identity ? "border-red-600 outline-red-600" : ""}
                    `}
                    {...register("identity")}
                />
                {errors.identity && (
                    <p className="text-xs text-red-600">
                        {" "}
                        {errors.identity.message?.toString()}{" "}
                    </p>
                )}
            </label>
            {/* client password */}
            <label htmlFor="password" className="flex flex-col gap-1">
                <h3 className="font-text text-base font-medium">
                    Password
                </h3>
                <span className="flex-1 relative">
                    <input
                        id="password"
                        type={!toggleHidePassword ? "password" : "text"}
                        placeholder="Enter your password"
                        autoComplete="false"
                        className={`font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px]  outline-none border rounded-lg px-3 py-2
                        ${errors.password ? "border-red-600 outline-red-600" : ""}
                    `}
                        {...register("password")}
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
                {errors.password && (
                    <p className="text-xs text-red-600">
                        {" "}
                        {errors.password.message?.toString()}{" "}
                    </p>
                )}
            </label>
            {/* sign up btn */}
            <span className="block space-y-2">
                <button
                    disabled={
                        loading ||
                        !getInputValues.password ||
                        !getInputValues.identity
                    }
                    className={`font-text font-bold text-base text-white w-full bg-[#3A5B22] py-1 rounded-lg
                         ${!loading &&
                            getInputValues.password &&
                            getInputValues.identity ?
                            "cursor-pointer active:text-green-200"
                            : "cursor-default opacity-30"
                        }
                    `}
                >
                    Log in
                </button>
                <label htmlFor="forget-password" className="flex justify-center">
                    <input
                        id="forget-password"
                        type="button"
                        value="Forget password"
                        className="font-text text-xs text-red-500 cursor-pointer"
                        onClick={() => navigate("/forgetpassword")}
                    />
                </label>
            </span>
        </form>
        <Displayscreenloading loading={loading} />
    </section>;
};


export default Loginuser;
