import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";

const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data: User } = useAppSelector(
        (state) => state.userProfileSlices.userProfile
    );

    const dontShowOnRoutes = ["/verify/user", "/login", "/signup"];

    return <>
        {
            !dontShowOnRoutes.includes(location.pathname.trim()) ?
                <>
                    {User.login ?
                        <footer className="mt-20">
                            <nav className="container fixed bottom-0 right-0 left-0 bg-white py-2 border-t">
                                {/* login bottom navigation */}
                                <ul className="flex items-center justify-between gap-6">
                                    <li>
                                        <button onClick={() => navigate("/timeline")}>
                                            Timeline
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => navigate("/")}>
                                            Search
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => navigate("/createblogpost")}>
                                            Add
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => navigate("/saves")}>
                                            Saves
                                        </button>
                                    </li>

                                    <li>
                                        <button onClick={() => navigate("/profile/" + User.userName)}>
                                            Profile
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </footer> :
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
                    }
                </> :
                null
        }
    </>;
};

export default Footer;