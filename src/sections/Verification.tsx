import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";
import errorProps from "../types/error.type";
import useFilterQuery from "../hooks/useFilterQuery";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Verification = () => {
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

  const handleHideEmail = (email: string) => {
    // Function to hide user email
    const [username, domain] = email.split("@");
    return `${username.slice(0, 3)}***@${domain}`;
  };

  const handleStartTiming = () => {
    setTiming(30);
    intervalRef.current = setInterval(() => {
      setTiming((pre) => (pre ? pre - 1 : 30));
    }, 1000) as unknown as number;
  };

  const resendOTP = async () => {
    if (loading || !User.email || OTP || timing) return;
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
    if (loading || !OTP || !User.email) return;

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
    <section>
      <form
        id="email-verification-form"
        action=""
        onSubmit={handleFormVerification}
        className="flex flex-col gap-4 font-text p-4 rounded transition-shadow hover:shadow-gray-700 hover:shadow-2xl bg-white"
      >
        {/* title */}
        <span className="flex justify-center">
          <h2 className="font-prim text-4xl">Verify account</h2>
        </span>
        {/* email input */}
        <label htmlFor="email" className="w-full flex flex-col gap-2">
          <span className="text-base">
            Email <span className="text-red-500">*</span>
          </span>
          <input
            autoComplete="true"
            id="email"
            type="email"
            placeholder="email"
            value={handleHideEmail(User.email)}
            onChange={(e) => (e.target.value = handleHideEmail(User.email))}
            className="flex-1 text-sm p-2 rounded-md bg-inherit border border-green-500"
          />
          <span className="block">
            {timing === 0 ? (
              <p className="text-xs font-semibold text-blue-700">
                Your OTP has been sent to {handleHideEmail(User.email)}
              </p>
            ) : null}
          </span>
        </label>
        {/* opt input */}
        <label htmlFor="opt" className="w-full flex flex-col gap-2">
          <span className="text-base">
            OTP <span className="text-red-500">*</span>
          </span>
          <div className="flex-1 flex items-center gap-4">
            <input
              autoComplete="true"
              id="opt"
              type="text"
              placeholder="otp"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full text-sm p-2 rounded-md bg-inherit border border-green-500"
            />
            <input
              id="send-opt"
              type="button"
              value={timing ? `Resend OTP in ${timing}s` : "Resend OTP"}
              className="font-text font-semibold text-xs text-white px-2 py-1.5 bg-green-500 border rounded-md shadow-md cursor-pointer"
              onClick={resendOTP}
            />
          </div>
          {error ? <p className="text-xs text-red-600"> {error} </p> : null}
        </label>
        <span className="block"></span>
        {/* button */}
        <span className="w-full flex">
          <button
            className={`flex-1 text-base text-white p-2 border border-green-500 bg-green-500 active:text-green-200 rounded-lg 
              ${
                loading || !User.email || !OTP ? "opacity-30" : "cursor-pointer"
              } `}
          >
            {!loading ? "Verify account" : "Process..."}
          </button>
        </span>
      </form>
    </section>
  );
};

export default Verification;
