import { Link } from "react-router-dom";
import SignUpform from "../sections/SignUpform";
import Logo from "../components/Logo";

const Signup = () => {
  return (
    <>
      <header className="container py-10">
        <div className="flex justify-center items-center mb-2">
          <Logo
            withText={true}
            className="h-10 w-10"
          />
        </div>        
      </header>
      <main className="container">
        <SignUpform />      
      </main>
      <footer className="container flex justify-center">
        <div className="flex justify-center items-center gap-3 text-sm font-sec text-green-600 p-2">
          <button>
            <Link to={"/privicy"}>
              Privicy
            </Link>
          </button>
          <span className="text-slate-800 text-base">|</span>
          <button>
            <Link to={"/Cookies"}>
              Cookies
            </Link>
          </button>
        </div>
      </footer>
    </>
  );
};

export default Signup;

//how do i install autoprofix fot style module in my nextjs project
