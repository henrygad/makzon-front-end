import { Link } from "react-router-dom";
import Loginform from "../sections/LogInform";
import Logo from "../components/Logo";

const Login = () => {

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
                <Loginform />
            </main>
            <footer className="w-full flex justify-center">
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

export default Login;
