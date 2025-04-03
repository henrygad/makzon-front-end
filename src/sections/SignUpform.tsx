import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import signUpValid from "../validators/signUpValid";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import registrationProps, { loginProps } from "../types/registration.types";
import { useAppDispatch, useAppSelector } from "../redux";
import { fetchProfile } from "../redux/slices/userProfileSlices";
import Cookies from "js-cookie";
import errorProps from "../types/error.type";
import Googleloginbtn from "../components/Googleloginbtn";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const SignUpform = () => {
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
          navigate("/verify/user");
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

  return (
    <section>
      <form
        id="signup-form"
        action=""
        className="flex flex-col gap-4 font-text transition-shadow hover:shadow-gray-700 hover:shadow-2xl  p-4 bg-white rounded"
        onSubmit={handleSubmit(handleRegistration)}
      >
        {/* title */}
        <span className="flex justify-center">
          <h2 className="font-prim text-4xl">Create a new account</h2>
        </span>
        <label htmlFor="username" className="w-full flex flex-col gap-2">
          <span className="text-base">
            User name <span className="text-red-500">*</span>
          </span>
          <input
            autoComplete="true"
            id="username"
            type="text"
            placeholder="User name"
            className={`flex-1 text-sm p-2 bg-inherit border border-green-500 rounded-md ${
              errors.userName ? "border-red-600 outline-red-600" : ""
            }`}
            {...register("userName")}
          />
          {errors.userName && (
            <p className="text-xs text-red-600">
              {" "}
              {errors.userName.message?.toString()}{" "}
            </p>
          )}
        </label>
        <label htmlFor="email" className="w-full flex flex-col gap-2">
          <span className="text-base">
            Email <span className="text-red-500">*</span>
          </span>
          <input
            autoComplete="true"
            id="email"
            type="email"
            placeholder="Email"
            className={`flex-1 text-sm p-2 bg-inherit border border-green-500 rounded-md ${
              errors.email ? "border-red-600 outline-red-600" : ""
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600">
              {" "}
              {errors.email.message?.toString()}{" "}
            </p>
          )}
        </label>
        <label htmlFor="password" className="w-full flex flex-col gap-2">
          <span className="text-base">
            Password <span className="text-red-500">*</span>
          </span>
          <span className="flex-1">
            <span className="relative w-full">
              <input
                autoComplete="true"
                id="password"
                type={
                  toggleHidePassword.includes("password") ? "password" : "text"
                }
                placeholder="Password"
                className={`w-full text-sm p-2 bg-inherit border border-green-500 rounded-md ${
                  errors.password ? "border-red-600 outline-red-600" : ""
                }`}
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
          </span>
          {errors.password && (
            <p className="text-xs text-red-600">
              {" "}
              {errors.password.message?.toString()}{" "}
            </p>
          )}
        </label>
        <label
          htmlFor="comfirm-password"
          className="w-full flex flex-col gap-2"
        >
          <span className="text-base">
            Comfirm Password <span className="text-red-500">*</span>
          </span>
          <span className="flex-1 relative">
            <input
              autoComplete="true"
              id="comfirm-password"
              type={
                toggleHidePassword.includes("comfirmPassword")
                  ? "password"
                  : "text"
              }
              placeholder="Comfirm password"
              className={`w-full text-sm p-2 bg-inherit border border-green-500 rounded-md ${
                errors.comfirmPassword ? "border-red-600 outline-red-600" : ""
              }`}
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
        <span className="block"></span>
        {/* button */}
        <span className="flex justify-center items-center">
          <button
            className={`flex-1 text-base text-white p-2 border border-green-500 bg-green-500 active:text-green-200 rounded-lg
            ${
              !loading &&
              getInputValues.comfirmPassword &&
              getInputValues.password &&
              getInputValues.email &&
              getInputValues.userName
                ? "cursor-pointer"
                : "cursor-default opacity-30"
            }`}
            disabled={
              loading ||
              !getInputValues.comfirmPassword ||
              !getInputValues.password ||
              !getInputValues.email ||
              !getInputValues.userName
            }
          >
            {!loading ? "Create" : "Process..."}
          </button>
        </span>
        {/* alread have an account */}
        <span className="flex justify-center gap-2 text-sm">
          <p>Already have an account?</p>
          <button className="transition-colors duration-500 text-green-500 hover:text-stone-300 active:text-green-200 cursor-pointer">
            <Link to="/login">Log in</Link>
          </button>
        </span>
        {/* google login */}
        <span className="block space-y-4">
          <span className="flex justify-start items-center gap-3">
            <span className="block flex-1 border border-green-500 rounded-md "></span>  OR <span className="block flex-1 border border-green-500 rounded-md"></span>
          </span>
          <span className="flex flex-col justify-center gap-1">   
            <Googleloginbtn />
          </span>
        </span>
      </form>
    </section>
  );
};

export default SignUpform;
