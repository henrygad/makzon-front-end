import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";
import { GrHomeOption } from "react-icons/gr";
import { LuSearch } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import Displayimage from "../components/Displayimage";
import avatarPlaceholder from "../assets/avaterplaceholder.svg";
import { GoBookmark } from "react-icons/go";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data: User } = useAppSelector(
        (state) => state.userProfileSlices.userProfile
    );

    const showPageHeaders: Record<string, string> = {
        profile: "Profile",
        feeds: "Feeds",
        saves: "Saves",
        "": "Tending",
      };

    return <footer className="mt-20">
        {/* login bottom navigation */}
        {
            User.login ?
                <nav className="container fixed bottom-0 right-0 left-0 bg-white z-10">
                    {
                        showPageHeaders[location.pathname.split("/")[1]] ?
                            <ul className="flex justify-between items-center py-1">
                                <li>
                                    <button
                                        className="flex flex-col justify-center items-center gap-1"
                                        onClick={() => navigate("/feeds")}
                                    >
                                        <GrHomeOption
                                            size={22}
                                            className={`transition-colors duration-500 
                                                        ${location.pathname ===
                                                    "/feeds"
                                                    ? "text-green-500"
                                                    : " bg-inherit"
                                                }
                                                    `}
                                        />
                                        <span
                                            className={`
                                                    transition-colors duration-500 text-xs font-sec
                                                    ${location.pathname ===
                                                    "/feeds"
                                                    ? "text-green-500"
                                                    : " bg-inherit"
                                                }`}
                                        >
                                            Feeds
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="flex flex-col justify-center items-center gap-1"
                                        onClick={() => navigate("/")}
                                    >
                                        <LuSearch
                                            size={23}
                                            className={`transition-colors duration-500 
                                                        ${location.pathname ===
                                                    "/"
                                                    ? "text-green-500"
                                                    : " bg-inherit"
                                                }
                                                    `}
                                        />
                                        <span
                                            className={`
                                                    transition-colors duration-500 text-xs font-sec
                                                    ${location.pathname === "/"
                                                    ? "text-green-500"
                                                    : " bg-inherit"
                                                }`}
                                        >
                                            Trending
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="block p-2 bg-slate-100 rounded-full"
                                        onClick={() => navigate("/createblogpost")}>
                                        <IoMdAdd size={23} />
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="flex flex-col justify-center items-center gap-1"
                                        onClick={() => navigate("/saves")}
                                    >
                                        <GoBookmark
                                            size={24}
                                            className={`transition-colors duration-500
                                                        ${location.pathname ===
                                                    "/saves"
                                                    ? "text-green-500"
                                                    : " bg-inherit"
                                                }
                                                    `} />
                                        <span
                                            className={`
                                                    transition-colors duration-500 text-xs font-sec
                                                    ${location.pathname ===
                                                    "/saves"
                                                    ? "text-green-500"
                                                    : " bg-inherit"
                                                }`}>
                                            Saves
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="flex flex-col justify-center items-center gap-1"
                                        onClick={() => navigate("/profile/" + User.userName)}
                                    >
                                        <Displayimage
                                            useCancle={false}
                                            url={User.avatar ? apiEndPont + "/media/" + User.avatar : ""}
                                            className={`w-8 h-8 object-cover rounded-full transition duration-500 border-2
                                                        ${location.pathname === "/profile/" + User.userName ? "border-green-400" : ""}
                                                    `}
                                            placeHolder={
                                                <img
                                                    className={`absolute top-0 bottom-0 right-0 left-0 w-8 h-8 object-cover rounded-full transition duration-500 border-2 
                                                                ${location.pathname === "/profile/" + User.userName ? "border-green-400" : ""}
                                                            `}
                                                    src={avatarPlaceholder}
                                                />
                                            }
                                            loadingPlaceHolder={
                                                <span
                                                    className="absolute top-0 bottom-0 right-0 left-0 w-8 h-8 object-cover rounded-full border-slate-200 bg-slate-200 animate-pulse">
                                                </span>
                                            }
                                        />
                                        <span
                                            className={`
                                                    transition-colors duration-500 text-xs font-sec
                                                    ${location.pathname ===
                                                    "/profile/" + User.userName
                                                    ? "text-green-500"
                                                    : " bg-inherit"
                                                }`}>
                                            You
                                        </span>
                                    </button>
                                </li>
                            </ul> :
                            null
                   }
                </nav> :
                <nav>
                    <ul className="flex justify-center items-center gap-3 text-sm font-sec text-green-600 p-2">
                        <li>
                            <button>
                                <Link to={"/privicy"}>Privicy</Link>
                            </button>
                        </li>
                        <li className="text-slate-500 text-base">|</li>
                        <li>
                            <button>
                                <Link to={"/Cookies"}>Cookies</Link>
                            </button>
                        </li>
                    </ul>
                </nav>
        }
    </footer>;
};

export default Footer;
