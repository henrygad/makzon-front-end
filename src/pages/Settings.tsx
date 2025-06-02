import { useNavigate } from "react-router-dom";
import Logoutbtn from "../components/Logoutbtn";


const Settings = () => {
    const navigate = useNavigate();


    return <main className="container">
        <div>
            <menu>
                <ul className=" font-text text-base text-slate-700 font-semibold space-y-2">
                    <li>
                        <button
                            className="cursor-pointer"
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
        </div>
    </main>;
};

export default Settings;

