import { useState } from "react";
import Logo from "../components/Logo";
import userProps from "../types/user.type";
import Tab from "../components/Tab";
import Finduser from "../sections/Finduser";
import Displayscreenloading from "../components/loaders/Displayscreenloading";
import Verifyuser from "../sections/Verifyuser";
import { useNavigate } from "react-router-dom";
import Resetpassword from "../sections/Resetpassword";


const Forgetpassword = () => {
    const [title, setTitle] = useState("Find User");
    const [user, setUser] = useState<userProps | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangeTab = (tab: string, title: string) => { 
        setTitle(title);
        navigate(tab);
    };

    return <>
        <header className="flex flex-col justify-between items-center py-10 gap-4">
            <Logo withText={true} className="h-6 w-6" />
            <h2 className="font-text text-2xl font-medium">
               {title}
            </h2>
        </header>
        <main className="container">
            <Tab
                className="w-full"
                allowToOtherTabs={user? true: false}
                arrOfTab={[
                    {
                        id: "finduser",
                        tab: <Finduser
                            user={user}
                            setUser={setUser}
                            loading={loading}
                            setLoading={setLoading}                            
                            handleChangeTab={handleChangeTab}
                        />
                    },
                    {
                        id: "verifyuser",
                        tab: <Verifyuser
                            user={user}
                            setUser={setUser}
                            loading={loading}
                            setLoading={setLoading}
                            handleChangeTab={handleChangeTab}
                        />
                    },
                    {
                        id: "resetpassword",
                        tab: <Resetpassword
                            user={user}
                            setUser={setUser}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    }
                ]}
            />
            <Displayscreenloading loading={loading} />
        </main>
    </>;
};

export default Forgetpassword;
