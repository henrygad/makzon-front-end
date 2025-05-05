import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import resetpasswordProps from "../types/resetpassword.types";
import resetPassWordValid from "../validators/resetPassWordValid";
import userProps from "../types/user.type";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import errorProps from "../types/error.type";
import { useNavigate } from "react-router-dom";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
  user: userProps | null;
  setUser: React.Dispatch<React.SetStateAction<userProps | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};


const Resetpassword = ({
  user,
  setUser,
  loading,
  setLoading,
}: Props) => {

  const navigate = useNavigate();

  const [toggleHidePassword, setToggleHidePassword] = useState<string[]>([
    "password",
    "comfirmPassword",
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<resetpasswordProps>({ resolver: yupResolver(resetPassWordValid) });

  const getInputValues = watch();

  const handleResetPassword = async (body: resetpasswordProps) => {
    if (loading) return;

    try {
      setLoading(true);

      const url =
        apiEndPont + "/auth/password/reset";
      const res = await axios.post(url, { email: user?.email, newPassword: body.password }, {
        baseURL: apiEndPont,
        withCredentials: true,
      });
      await res.data;
      setUser(null);
      navigate("/login", { state: { identity: user?.userName } });

    } catch (error) {
      const getError = error as errorProps;
      const errorMsg: string = getError.response.data.message;
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
      setValue("password", "");
      setValue("comfirmPassword", "");
      setLoading(false);
    }

  };

  return (
    <section
      className="flex-1 flex justify-center items-center pt-10 px-5 "
    >
      <form
        id="signup-form"
        className="space-y-6"
        onSubmit={handleSubmit(handleResetPassword)}
      >
        {/* client password */}
        <label htmlFor="password" className="flex flex-col gap-1">
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
                                ${errors.password
                  ? "border-red-600 outline-red-600"
                  : ""
                }
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
        <label htmlFor="comfirm-password" className="flex flex-col gap-1">
          <h3 className="font-text text-base font-medium">Comfirm password</h3>
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
                                ${errors.comfirmPassword
                  ? "border-red-600 outline-red-600"
                  : ""
                }
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
            disabled={
              loading ||
              !getInputValues.comfirmPassword ||
              !getInputValues.password
            }
            className={`font-text font-bold text-base text-white w-full bg-[#3A5B22] py-1 rounded-lg
                                    ${!loading &&
                getInputValues.comfirmPassword &&
                getInputValues.password
                ? "cursor-pointer  active:text-green-200"
                : "cursor-default opacity-30"
              }`}
          >
            Sign up
          </button>
        </span>
      </form>
    </section>
  );
};

export default Resetpassword;
