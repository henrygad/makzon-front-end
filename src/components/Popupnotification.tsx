import { useEffect, useState } from "react";
import notificationProps from "../types/notification.type";
import { Single } from "./Displaynotification";

type props = {
    notificationUpdate: notificationProps | null  
    setNotificationUpdate: React.Dispatch<React.SetStateAction<notificationProps | null>>    
}

const Popupnotification = ({ notificationUpdate, setNotificationUpdate }: props) => {
    const [animate, setAnimate] = useState(false);    

    useEffect(() => {
        if (notificationUpdate) { 
            // display notification popup
            setAnimate(true);
            const clear = setTimeout(() => {
                // close notificatio popup
                setAnimate(false);  
                setNotificationUpdate(null);
                clearTimeout(clear);
            }, 4000);
        }
    }, [notificationUpdate]);


    return (
        <>
            {notificationUpdate ?
                <span
                    className="container block fixed top-1 right-0 left-0 w-full z-50"
                >
                    <span
                        className={`relative block w-full transition-transform ${animate ? "translate-y-0" : "-translate-y-10"} shadow-md shadow-blue-50`}>
                        <button
                            className="block absolute top-2 right-3 text-base font-text text-slate-800"
                            onClick={(e) => {
                                e.stopPropagation();
                                setAnimate(false);
                                setNotificationUpdate(null);
                            }}
                        >
                            x
                        </button>
                        <Single
                            notification={notificationUpdate}
                            useDelete={false}
                        />
                    </span>
                </span> :
                null
            }
        </>
    );
};

export default Popupnotification;
