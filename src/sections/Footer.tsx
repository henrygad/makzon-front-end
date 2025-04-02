import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";

const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data: User } = useAppSelector(
        (state) => state.userProfileSlices.userProfile
    );

    return <>
        {User.login && location.pathname !== "/verify/user"  ?
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
                            <button onClick={() => navigate("/")}>Treading</button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/createblogpost")}>
                                Post
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
            null
        }
    </>;
};

export default Footer;