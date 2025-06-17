import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import googleIcon from "../assets/icons8-google 1.png";
import appleIcon from "../assets/icons8-apple-logo 1.png";
import Loginuser from "../sections/Loginuser";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Login = () => {
 

  return (
      <>
      <header className="flex flex-col justify-between items-center py-10 gap-4">       
        <Logo withText={true} className="h-6 w-6" />
        <h2 className="font-text text-2xl font-medium">Welcome Back!</h2>
      </header>
      <main className="container">
        <Loginuser />
      </main>
      <footer className="flex justify-center items-center">
        {/* login other options */}
        <div className="mt-10 mb-4">
          {/* line space divider */}
          <span className="flex justify-between items-center gap-2 font-text text-xs font-medium mb-10">
            <span className="flex-1 border rounded-lg"></span>
              Or{" "}
            <span className="flex-1 border rounded-lg"></span>
          </span>
          {/* google and apple sign up login btn */}
          <span className="flex justify-center items-center gap-4 mb-7">
            <button>
              <a
                href={apiEndPont + "/auth/google"}
                className="flex-1 flex justify-center items-center gap-2 px-1.5 py-1 border rounded-lg cursor-pointer"
              >
              <img
                src={googleIcon}
                alt="google icon"
                className="h-6 w-6 object-contain"
              />
              <span className="font-text text-[13px] font-medium text-nowrap">
                Sign in with Google
                </span>
              </a>
            </button>
            <button className="flex-1 flex justify-center items-center gap-2 p-1 border rounded-lg cursor-pointer">             
                <img
                  src={appleIcon}
                  alt="apple icon"
                  className="h-6 w-6 object-contain"
                />
                <span className="font-text text-[13px] font-medium text-nowrap">
                  Sign in with Apple
                </span>             
            </button>
          </span>
          {/* option to sign in */}
          <span className="flex justify-center items-center gap-3 font-text text-xs font-medium text-nowrap">
            Don't have an account?{" "}
            <button className="text-blue-800 cursor-pointer">
              <Link to="/signup">Sign up</Link>
            </button>
          </span>
        </div>               
      </footer>
    </>
  );
};

export default Login;
