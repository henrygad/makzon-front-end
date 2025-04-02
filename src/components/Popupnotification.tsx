import { ReactElement, useEffect, useState } from "react";
import { useAppDispatch } from "../redux";
import { removepopUpNotification } from "../redux/slices/userNotificationSlices";


const Popupnotification = ({ display, children }: { display: boolean, children: ReactElement }) => {
    const [animate, setAnimate] = useState(false);
    const appDispatch = useAppDispatch();

    useEffect(() => {
        if (display) {
            setAnimate(true);
            const clear = setTimeout(() => {
                setAnimate(false);
                appDispatch(removepopUpNotification());
                clearTimeout(clear);
            }, 4000);
        }
    }, [display]);

    return (
        <>
            {display ?
                <span
                    className="container block fixed top-1 right-0 left-0 w-full z-50"
                >
                    <span
                        className={`relative block w-full transition-transform 
                            ${animate ? "translate-y-0" : "-translate-y-10"}
                             bg-white p-4 border border-blue-50 rounded-lg shadow-md shadow-blue-50`}
                        onClick={() => appDispatch(removepopUpNotification())}
                    >
                        <button
                            className="absolute top-6 right-8 text-sm font-text text-slate-800"
                            onClick={(e) => {
                                appDispatch(removepopUpNotification());
                                e.stopPropagation();
                            }}
                        >
                            x
                        </button>
                        {children}
                    </span>
                </span> :
                null
            }
        </>
    );
};

export default Popupnotification;
