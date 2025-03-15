import { ReactElement, useEffect, useState } from "react";
import { useLocation} from "react-router-dom";

type Props = {
    arrOfTab: {
        id: string,
        tab: ReactElement,
    }[]
    className: string    
}


const Eachtab = ({ tab }: { tab: ReactElement }) => {
    return tab;
};

const Tab = ({ className, arrOfTab }: Props) => {
    const [currentTab, setCurrentTab] = useState(arrOfTab[0].id);
    const location = useLocation();

    const handleDisplayTab = (hashId: string) => {
        if (arrOfTab.map(tab => tab.id.trim().toLowerCase())
            .includes(hashId.trim().toLowerCase())) {
                setCurrentTab(hashId);            
        }else {
            setCurrentTab(pre => pre ? pre : arrOfTab[0].id);            
        }
    };

    const handlePopState = () => {
        const hashId = location.hash.trim().slice(1);
        handleDisplayTab(hashId);
    };

    useEffect(() => {
        const hashId = location.hash.trim().slice(1);
        handleDisplayTab(hashId);
    }, [location.hash]);

    useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return <div className={className}>
        {
            arrOfTab &&
                arrOfTab.length ?
                arrOfTab.map(tab =>
                    <div
                        key={tab.id}
                        id={tab.id}
                        className={tab.id.trim().toLowerCase() === currentTab.trim().toLowerCase() ?
                            "block" :
                            "hidden"}>
                        <Eachtab
                            tab={tab.tab}
                        />
                    </div>
                ) :
                null
        }
    </div>;
};

export default Tab;
