import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import logInValid from "../validators/logInValid";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import errorProps from "../types/error.type";
import { fetchProfile } from "../redux/slices/userProfileSlices";
import { useAppDispatch, useAppSelector } from "../redux";
import Cookies from "js-cookie";


const Loginform = () => {
  const {data: User} = useAppSelector((state) => state.userProfileSlices.userProfile);
  const appDispatch = useAppDispatch();
  const [toggleHidePassword, setToggleHidePassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(logInValid) });

  const handleLoginForm = async (data: { identity: string, password: string }) => {
    if (loading) return;

    try {
      setLoading(true);

      const url = "https://localhost:3000/api/auth/login";
      const res = await axios.post(url, data,
        {
          baseURL: "https://localhost:3000/api/auth/login",
          withCredentials: true,
        }
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

      if (errorMsg.toLowerCase().includes("identity")) {
        setError("identity", {
          type: "manual",
          message: "",
        });
      }

      setError("password", {
        type: "manual",
        message: errorMsg.toLowerCase().includes("password") ? "Incorrect password" : "There is no account with this user name",
      });

      console.error(error);
    } finally {
      setToggleHidePassword(false);
      setLoading(false);
    }
  };

  return (
    <section>
      <form
        id="login-form"
        action=""
        onSubmit={handleSubmit(handleLoginForm)}
        className="flex flex-col gap-4 font-text px-10 py-8 rounded transition-shadow hover:shadow-gray-700 hover:shadow-2xl bg-white"
      >
        {/* title */}
        <span className="flex justify-center">
          <h2 className="font-prim text-2xl">Log in</h2>
        </span>
        <label htmlFor="identity" className="w-full flex flex-col gap-2">
          <span className="text-base">User name / Email <span className="text-red-500">*</span></span>
          <input
            autoComplete="true"
            id="identity"
            type="text"
            placeholder="user name / email"
            className={`flex-1 text-sm p-2 rounded-md bg-inherit border border-green-500 ${errors.identity ? "border-red-600 outline-red-600" : ""
              }`}
            {...register("identity")}
          />
          {errors.identity && (
            <p className="text-xs text-red-600">
              {" "}
              {errors.identity.message?.toString()}{" "}
            </p>
          )}
        </label>
        <label htmlFor="password" className="w-full flex flex-col gap-2">
          <span className="text-base">Password <span className="text-red-500">*</span></span>
          <span className="flex-1 relative">
            <input
              autoComplete="true"
              id="password"
              type={!toggleHidePassword ? "password" : "text"}
              placeholder="password"
              className={`text-sm w-full p-2 rounded-md bg-inherit border border-green-500 ${errors.password ? "border-red-600 outline-red-600" : ""
                }`}
              {...register("password")}
            />
            <span
              onClick={() => setToggleHidePassword(!toggleHidePassword)}
              className=" absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
            >
              {!toggleHidePassword ? (
                <FaRegEyeSlash size={18} />
              ) : (
                <FaRegEye size={16} />
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
        <span className="block"></span>
        {/*login button */}
        <span className="flex justify-center items-center">
          <button
            className="flex-1 text-base text-white p-2 border border-green-500 bg-green-500 active:text-green-200 rounded-lg cursor-pointer"
          >
            {!loading ? "Log in" : "Loading..."}
          </button>
        </span>
        {/*  forget passwoord */}
        <span className="w-full flex justify-center items-center">
          <input
            id="forget-password"
            type="button"
            value="Forget password"
            className="font-text text-xs text-green-500 cursor-pointer"
            onClick={() => navigate("/password")}
          />
        </span>
        {/* alread have an account */}
        <span className="flex justify-center gap-2 text-sm">
          <p>Don't have an account?</p>
          <button className="transition-colors duration-500 text-green-500 hover:text-stone-300 active:text-green-200 cursor-pointer">
            <Link to="/signup">Sign up</Link>
          </button>
        </span>
        {/* google login */}
        <span className="block space-y-4">
          <span className="flex justify-start items-center gap-3">
            <span className="block flex-1 border rounded-md "></span>  OR <span className="block  flex-1 border rounded-md"></span>
          </span>
          <span className="flex flex-col items-start">
            <button
              className="border border-blue-200 px-6 py-2 rounded-md"
            >
              <a href="http://" className="flex ga-4 ">
                <img src="" alt="" />
                <span>Login With Google</span>
              </a>
            </button>
          </span>
        </span>
      </form>
    </section>
  );
};

export default Loginform;
