import { useState } from "react";
import userProps from "../types/user.type";
import Displayuserinfor from "../components/Displayuserinfor";
import useHideEmail from "../hooks/useHideEmail";
import axios from "axios";
import errorProps from "../types/error.type";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
  user: userProps | null;
  setUser: React.Dispatch<React.SetStateAction<userProps | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeTab: (tab: string, title: string) => void;
};

const Verifyuser = ({ user, loading, setLoading, handleChangeTab }: Props) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const hideEmail = useHideEmail();

  const handleVerifyUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    if (!otp) {
      setError("Please provide an otp to continue");
    }

    try {
      setLoading(true);

      const url =
        apiEndPont + `/auth/password/forget?email=${user?.email}&otp=${otp}`;
      const res = await axios(url, {
        baseURL: apiEndPont,
        withCredentials: true,
      });
      await res.data;
      
      handleChangeTab("#resetpassword", "Reset Password");
    } catch (error) {
      const getError = error as errorProps;
      const errorMsg: string = getError.response.data.message;
      setError(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-1 flex justify-center items-center pt-10 px-5 space-y-16">
      <form className="space-y-6" onSubmit={handleVerifyUser}>
        <span className="flex justify-center ">
          <Displayuserinfor user={user} short={true} />
        </span>
        {/* otp input*/}
        <label htmlFor="otp" className="flex flex-col gap-1">
          <span className="w-full flex justify-center">
            <p className="font-text text-wrap text-sm text-center max-w-[320px]">
              A One Time Password (OTP) has been sent to your email box {hideEmail(user?.email || "")},
              to verify your account.
            </p>
          </span>
          <input
            id="otp"
            type="text"
            name="otp"
            placeholder="Enter OTP"
            className={`font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px]  outline-none border rounded-lg px-3 py-2
              ${error ? "border-red-600 outline-red-600" : ""}              
            `}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error ? (
            <p className="font-text text-sm text-wrap text-center text-red-600">
              {error}
            </p>
          ) : null}
        </label>
        {/* verify user btn */}
        <span className="block">
          <button
            disabled={loading}
            className={`font-text font-bold text-base text-white w-full bg-[#3A5B22] py-1 rounded-lg
                ${
                  !loading && otp
                    ? "cursor-pointer active:text-green-200"
                    : "cursor-default opacity-30"
                }
            `}
          >
            Verify user
          </button>
        </span>
      </form>
    </section>
  );
};

export default Verifyuser;
