import { ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Props = {
    allowToOtherTabs?: boolean
    className: string
    arrOfTab: {
        id: string,
        tab: ReactElement,
    }[]   
}


const Eachtab = ({ tab }: { tab: ReactElement }) => {
    return tab;
};

const Tab = ({ className, arrOfTab, allowToOtherTabs = true }: Props) => {
    const [currentTab, setCurrentTab] = useState(arrOfTab[0].id);
    const location = useLocation();

    const handleDisplayTab = (hashId: string) => {
        if (!allowToOtherTabs) {
            setCurrentTab(arrOfTab[0].id);
            return;
        }

        if (arrOfTab.map(tab => tab.id.trim().toLowerCase())
            .includes(hashId.trim().toLowerCase())) {
            setCurrentTab(hashId);
        } else {
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
                    tab.id.trim().toLowerCase() === currentTab.trim().toLowerCase() ?
                        <Eachtab
                            key={tab.id}
                            tab={tab.tab}
                        /> :
                        null
                ) :
                null
        }
    </div>;
};

export default Tab;
