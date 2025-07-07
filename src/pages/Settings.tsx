import { useNavigate } from "react-router-dom";
import Logoutbtn from "../components/Logoutbtn";


const Settings = () => {
    const navigate = useNavigate();


    return <main className="container">
        <menu className="flex w-full h-full p-4">
            <ul className="flex-1 font-text text-base text-slate-700 font-semibold space-y-8">
                <li>
                    <button
                        className="p-2 active:bg-green-500 active:text-white rounded-md cursor-pointer"
                        onClick={() => navigate("/updateprofile")}
                    >
                        Edit Profile
                    </button>
                </li>
                <li>
                    <button
                        className="p-2 active:bg-green-500 active:text-white rounded-md cursor-pointer"
                        onClick={() => navigate("/security")}
                    >
                        Security
                    </button>
                </li>
                <li>
                    <Logoutbtn />
                </li>
            </ul>
        </menu>
    </main>;
};

export default Settings;

