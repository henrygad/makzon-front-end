import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";
import errorProps from "../types/error.type";
import useFilterQuery from "../hooks/useFilterQuery";
import Displayscreenloading from "../components/Displayscreenloading";
import useHideEmail from "../hooks/useHideEmail";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Verifyemail = () => {
  const location = useLocation();
  const query = useFilterQuery();
  const { data: User } = useAppSelector(
    (state) => state.userProfileSlices.userProfile
  );
  const [timing, setTiming] = useState<number | null>(null);
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);
  const navigate = useNavigate();

  const hideEmail = useHideEmail();

  const handleStartTiming = () => {
    setTiming(30);
    intervalRef.current = setInterval(() => {
      setTiming((pre) => (pre ? pre - 1 : 30));
    }, 1000) as unknown as number;
  };

  const resendOTP = async () => {
    if (loading || timing) return;
    setOTP("");
    setError("");
    try {
      handleStartTiming();

      const url = apiEndPont + "/auth/opt";
      const res = await axios(url, {
        baseURL: apiEndPont,
        withCredentials: true,
      });
      console.log(res);
    } catch (error) {
      const getError = error as errorProps;
      const errorMsg: string = getError.response.data.message;
      setError(errorMsg);
      console.error(error);
    }
  };

  const verifyUserAccount = async ({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }) => {
    if (loading || !otp || !email) return;

    try {
      setLoading(true);
      const url = apiEndPont + `/auth/verify?email=${email}&otp=${otp}`;
      const res = await axios(url, {
        baseURL: apiEndPont,
        withCredentials: true,
      });
      const verificationData = await res.data;
      if (verificationData) {
        navigate("/profile/" + User.userName);
      }
    } catch (error) {
      const getError = error as errorProps;
      const errorMsg: string = getError.response.data.message;
      setError(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verifyUserAccount({ email: User.email, otp: OTP });
  };

  useEffect(() => {
    if (timing === 0) {
      setTiming(null);
      clearInterval(intervalRef.current);
    }
  }, [timing]);

  useEffect(() => {
    if (location.search) {
      const getQueries = query<{ email: string; otp: string }>(location.search);
      if (getQueries) {
        setOTP(getQueries.otp);
        verifyUserAccount(getQueries);
      }
    }
  }, [location.search]);

  return (
    <section className="flex-1 flex justify-center items-center pt-10 px-5 space-y-16">
      <form
        id="verification-form"
        onSubmit={handleFormVerification}
        className="space-y-6"
      >
        {/* resend otp request btn*/}
        <label htmlFor="send-otp" className="flex flex-col gap-4">
          <span className="w-full flex justify-center">
            <p className="font-text text-wrap text-sm text-center max-w-[320px]">
              A One Time Password (OTP) has been sent to your email box
              {hideEmail(User.email)}, to verify your email.
              If you didn't recieve it, you can request for a new OTP
            </p>
         </span>
          <input
            id="send-opt"
            type="button"
            value={timing ? `Resend OTP in ${timing}s` : "Resend OTP"}
            className={`font-text font-bold text-base text-[#6d9253] w-full  border border-[#49712d] py-1 rounded-lg outline-none 
              ${!timing ? "cursor-pointer": ""}
                    `}
            onClick={resendOTP}
          />
          {timing === 0 ?
            <p className="text-xs font-semibold text-blue-700">
              OTP has been sent to {hideEmail(User.email)}
            </p> :
            null
          }
        </label>
        {/* otp input */}
        <label htmlFor="otp-code" className="flex flex-col gap-1">
          <h3 className="font-text text-base font-medium">
            OTP
          </h3>
          <input
            id="otp-code"
            name="otp-code"
            type="text"
            placeholder="Enter your OPT"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
            className={`font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px]  outline-none border rounded-lg px-3 py-2
                    ${error ? "border-red-600 outline-red-600" : ""}
               `}
          />          
          {error ? <p className="text-xs text-red-600"> {error} </p> : null}
        </label>

        {/* verify email btn */}
        <span className="block space-y-2">
          <button
            disabled={loading || !User.email || !OTP}
            className={`font-text font-bold text-base text-white w-full bg-[#3A5B22] py-1 rounded-lg ${loading || !User.email || !OTP ? "opacity-30" : "cursor-pointer"}`}
          >
            Log in
          </button>
        </span>
      </form>
      <Displayscreenloading loading={loading} />

    </section>
  );
};

export default Verifyemail;
