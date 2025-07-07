
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import signUpValid from "../validators/signUpValid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import registrationProps from "../types/registration.type";
import loginProps from "../types/login.type";
import { useAppDispatch, useAppSelector } from "../redux";
import { fetchProfile } from "../redux/slices/userProfileSlices";
import Cookies from "js-cookie";
import errorProps from "../types/error.type";
import Displayscreenloading from "../loaders/Displayscreenloading";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;


const Signupuser = () => {
    const navigate = useNavigate();
    const { data: User } = useAppSelector(
        (state) => state.userProfileSlices.userProfile
    );
    const appDispatch = useAppDispatch();

    const [toggleHidePassword, setToggleHidePassword] = useState<string[]>([
        "password",
        "comfirmPassword",
    ]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        setError,
        formState: { errors },
    } = useForm<registrationProps>({ resolver: yupResolver(signUpValid) });

    const getInputValues = watch();

    const handleRegistration = async (data: registrationProps) => {

        try {
            setLoading(true);

            /* register user */
            const url = apiEndPont + "/auth/register";
            const res = await axios.post(url, data, {
                baseURL: apiEndPont,
                withCredentials: true,
            });
            const registerData = await res.data;

            if (registerData) {
                /* Log in user */
                const url = apiEndPont + "/auth/login";
                const loginInfo: loginProps = {
                    identity: data.userName,
                    password: data.password,
                };
                const res = await axios.post(url, loginInfo, {
                    baseURL: apiEndPont,
                    withCredentials: true,
                });

                const loginData = (await res.data) as {
                    userName: string;
                    email: string;
                };

                if (loginData) {
                    // update user profile
                    appDispatch(
                        fetchProfile({
                            data: {
                                ...User,
                                userName: loginData.userName,
                                email: loginData.email,
                                login: true,
                            },
                            loading: false,
                            error: "",
                        })
                    );

                    // set cookie
                    Cookies.set(
                        "makzonFrtendSession",
                        JSON.stringify({
                            userName: loginData.userName,
                            email: loginData.email,
                            login: true,
                            sessionId: User.sessionId,
                        }),
                        {
                            expires: 1, // Cookie expires in 1 days
                            secure: true, // Ensures the cookie is only sent over HTTPS
                            sameSite: "Strict", // Prevents cross-site request forgery (adjust as needed)
                        }
                    );

                    // navigate to user verification page
                    navigate("/verify/email");
                }
            }
        } catch (error) {
            const getError = error as errorProps;
            const errorMsg: string = getError.response.data.message;

            setValue("password", "");
            setValue("comfirmPassword", "");

            if (errorMsg.toLowerCase().includes("username")) {
                setError("userName", {
                    type: "manual",
                    message: errorMsg,
                });
            }

            if (errorMsg.toLowerCase().includes("email")) {
                setError("email", {
                    type: "manual",
                    message: errorMsg,
                });
            }
            if (errorMsg.toLowerCase().includes("password")) {
                setError("password", {
                    type: "manual",
                    message: errorMsg,
                });
            }
            if (errorMsg.toLowerCase().includes("match")) {
                setError("comfirmPassword", {
                    type: "manual",
                    message: errorMsg,
                });
            }

            console.error(error);
        } finally {
            setToggleHidePassword([]);
            setLoading(false);
        }
    };

    return <>
        {/* sign up local form */}
        <section className="flex-1 flex justify-center items-center pt-10 px-5 " >
            <form
                id="signup-form"
                className="space-y-6"
                onSubmit={handleSubmit(handleRegistration)}
            >
                {/* client name */}
                <label
                    htmlFor="username"
                    className="flex flex-col gap-1"
                >
                    <h3 className="font-text text-base font-medium">
                        Username
                    </h3>
                    <input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        autoComplete="true"
                        className={`font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px]  outline-none border rounded-lg px-3 py-2
                             ${errors.userName ? "border-red-600 outline-red-600" : ""}
                        `}
                        {...register("userName")}
                    />
                    {errors.userName && (
                        <p className="text-xs text-red-600">
                            {" "}
                            {errors.userName.message?.toString()}{" "}
                        </p>
                    )}
                </label>
                {/* client email address */}
                <label
                    htmlFor="email"
                    className="flex flex-col gap-1"
                >
                    <h3 className="font-text text-base font-medium">
                        Email
                    </h3>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="true"
                        className={`font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px]  outline-none border rounded-lg px-3 py-2
                            ${errors.email ? "border-red-600 outline-red-600" : ""}
                        `}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-600">
                            {" "}
                            {errors.email.message?.toString()}{" "}
                        </p>
                    )}
                </label>
                {/* client password */}
                <label
                    htmlFor="password"
                    className="flex flex-col gap-1"
                >
                    <h3 className="font-text text-base font-medium">Password</h3>
                    <span className="flex-1 relative">
                        <input
                            id="password"
                            type={
                                toggleHidePassword.includes("password") ? "password" : "text"
                            }
                            placeholder="Enter your password"
                            autoComplete="true"
                            className={`w-full font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px] outline-none border rounded-lg px-3 py-2
                                ${errors.password ? "border-red-600 outline-red-600" : ""}
                            `}
                            {...register("password")}
                        />
                        <span
                            onClick={() =>
                                setToggleHidePassword((pre) =>
                                    pre.includes("password")
                                        ? pre.filter((item) => item !== "password")
                                        : [...pre, "password"]
                                )
                            }
                            className=" absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                        >
                            {toggleHidePassword.includes("password") ? (
                                <FaRegEye size={16} />
                            ) : (
                                <FaRegEyeSlash size={18} />
                            )}
                        </span>
                    </span>
                    <span className="flex justify-end">
                        <p
                            id="password-helper-text"
                            className="font-serif text-xs text-end p-1 max-w-[320px]"
                        >
                            Password must be at least 8 characters and include an uppercase
                            letter, a lowercase letter, a number, and a special
                            character.(e.g., @$!%*?&#^).
                        </p>
                    </span>
                    {errors.password && (
                        <p className="text-xs text-red-600">
                            {" "}
                            {errors.password.message?.toString()}{" "}
                        </p>
                    )}
                </label>
                {/* Comfirm client password */}
                <label
                    htmlFor="comfirm-password"
                    className="flex flex-col gap-1"
                >
                    <h3 className="font-text text-base font-medium">
                        Comfirm password
                    </h3>
                    <span className="flex-1 relative">
                        <input
                            id="comfirm-password"
                            type={
                                toggleHidePassword.includes("comfirmPassword")
                                    ? "password"
                                    : "text"
                            }
                            placeholder="Comfirm password"
                            autoComplete="true"
                            className={`w-full font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px] outline-none border rounded-lg px-3 py-2
                                ${errors.comfirmPassword ? "border-red-600 outline-red-600" : ""}
                            `}
                            {...register("comfirmPassword")}
                        />
                        <span
                            onClick={() =>
                                setToggleHidePassword((pre) =>
                                    pre.includes("comfirmPassword")
                                        ? pre.filter((item) => item !== "comfirmPassword")
                                        : [...pre, "comfirmPassword"]
                                )
                            }
                            className=" absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                        >
                            {toggleHidePassword.includes("comfirmPassword") ? (
                                <FaRegEye size={16} />
                            ) : (
                                <FaRegEyeSlash size={18} />
                            )}
                        </span>
                    </span>
                    {errors.comfirmPassword && (
                        <p className="text-xs text-red-600">
                            {" "}
                            {errors.comfirmPassword.message?.toString()}{" "}
                        </p>
                    )}
                </label>
                {/* sign up btn */}
                <span className="block">
                    <button
                        disabled={loading || !getInputValues.comfirmPassword || !getInputValues.password || !getInputValues.email || !getInputValues.userName}
                        className={`font-text font-bold text-base text-white w-full bg-[#3A5B22] py-1 rounded-lg
                                    ${!loading &&
                                getInputValues.comfirmPassword &&
                                getInputValues.password &&
                                getInputValues.email &&
                                getInputValues.userName
                                ? "cursor-pointer  active:text-green-200"
                                : "cursor-default opacity-30"
                            }`
                        }
                    >
                        Sign up
                    </button>
                </span>
            </form>
            <Displayscreenloading loading={loading} />
        </section>
    </>;
};

export default Signupuser;