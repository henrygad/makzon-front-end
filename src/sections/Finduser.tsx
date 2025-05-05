import { useState } from "react";
import userProps from "../types/user.type";
import errorProps from "../types/error.type";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
  user: userProps | null;
  setUser: React.Dispatch<React.SetStateAction<userProps | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeTab: (tab: string, title: string) => void
};

const Finduser = ({ setUser, loading, setLoading , handleChangeTab}: Props) => {
  const [identity, setIdentity] = useState("");
  const [error, setError] = useState("");

  const handleFindUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (!identity) {
      setError("Please provide a valid identity");
    }

    try {
      setLoading(true);
      
      const url = apiEndPont + "/auth/password/forget";
      const res = await axios.post(url, {identity}, {
        baseURL: apiEndPont,
        withCredentials: true,
      });
      const data: userProps = await res.data.data;
      
      setUser(data);
      handleChangeTab("#verifyuser", "Verify User");      

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
      <form className="space-y-6" onSubmit={handleFindUser}>
        {/* client username */}
        <label htmlFor="identity" className="flex flex-col gap-1">
          <h3 className="font-text text-base font-medium">Username</h3>
          <input
            id="identity"
            type="text"
            name="identity"
            placeholder="Enter your username or email"
            autoComplete="true"
            className={`font-text text-sm text-slate-600 font-medium min-w-[280px] sm:min-w-[320px] md:min-w-[420px]  outline-none border rounded-lg px-3 py-2
              ${error ? "border-red-600 outline-red-600" : ""}              
            `}
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
          />
          {error ? (
            <p className="font-text text-sm text-wrap text-center text-red-600">
              {error}
            </p>
          ) : null}
        </label>
        {/* search user btn */}
        <span className="block">
          <button
            disabled={loading}
            className={`font-text font-bold text-base text-white w-full bg-[#3A5B22] py-1 rounded-lg
                ${
                  !loading && identity
                    ? "cursor-pointer active:text-green-200"
                    : "cursor-default opacity-30"
                }
            `}
          >
            Find user
          </button>          
        </span>
      </form>
    </section>
  );
};

export default Finduser;
