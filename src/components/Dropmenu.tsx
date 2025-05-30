import { ReactElement, useEffect, useRef, useState } from "react";
import useClickOutSide from "../hooks/useClickOutSide";
import { useNavigate } from "react-router-dom";

type Props = {
    horizotal?: boolean
    children: ReactElement
};


const Dropmenu = ({ horizotal = false, children }: Props) => {
    const navigate = useNavigate();
    const menuContainerRef = useRef<HTMLDivElement>(null);
    const [dropMenu, setDropMenu] = useState(false);
    const [dropDown, setDropDown] = useState(true);
    const dropMenuRef = useRef<HTMLDivElement>(null);

    useClickOutSide(menuContainerRef, () => {
        setDropMenu(false);
    });

    const handleDropMenu = () => {
        if (!dropMenu &&
            menuContainerRef.current &&
            dropMenuRef.current) {
            const windowHeight = window.innerHeight;
            const rect = menuContainerRef.current.getBoundingClientRect();
            const elementHeight = dropMenuRef.current.clientHeight;
            setDropDown((windowHeight - rect.bottom) >= elementHeight + 50);
        }

        const clear = setTimeout(() => {
            setDropMenu(!dropMenu);
            navigate("#");
            clearTimeout(clear);
        }, 1);
    };

    const handlePopState = () => {
        if (dropMenu) {
            setDropMenu(false);
        }
    };

    useEffect(() => {
        if (dropMenu) {
            document.body.classList.add("overflow-y-hidden");
        } else {
            document.body.classList.remove("overflow-y-hidden");
        }

        window.addEventListener("popstate", handlePopState);
        return () => {
            document.body.classList.remove("overflow-y-hidden");
            window.removeEventListener("popstate", handlePopState);
        };
    }, [dropMenu]);

    return <div
        ref={menuContainerRef}
        className="relative">
        <button
            className={`flex items-start gap-0.5 font-bold text-base transition-colors delay-200 bg-inherit active:bg-slate-200 rounded-full                                  
                 ${horizotal ? "rotate-90" : ""}
                  p-2.5 cursor-pointer
                  `}
            onClick={handleDropMenu}
        >
            <span className="h-1 w-1 rounded-full bg-slate-500"></span>
            <span className="h-1 w-1 rounded-full bg-slate-500"></span>
            <span className="h-1 w-1 rounded-full bg-slate-500"></span>
        </button>
        <div
            ref={dropMenuRef}
            className={`transition-all duration-200 absolute right-10
                ${dropDown ?
                    dropMenu ? "top-0 opacity-100 z-10" : " -top-10 opacity-0 -z-10" :
                    dropMenu ? "bottom-0  opacity-100 z-10" : "-bottom-10 opacity-0 -z-10"
                } rounded-md shadow-md`}
        >
            {children}
        </div>
    </div>;
};

export default Dropmenu;
