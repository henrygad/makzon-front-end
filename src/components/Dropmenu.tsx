import { ReactElement, useEffect, useRef, useState } from "react";
import useClickOutSide from "../editor/utils/useClickOutSide";

type Props = {
    children: ReactElement
};


const Dropmenu = ({ children }: Props) => {
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
            setDropDown((windowHeight - rect.bottom) >= elementHeight + 1);
        }


        const clear = setTimeout(() => {
            setDropMenu(!dropMenu);     
            clearTimeout(clear);
        }, 1);
    };


    useEffect(() => {
        if (dropMenu) {
            document.body.classList.add("overflow-y-hidden");
        } else {
            document.body.classList.remove("overflow-y-hidden");
        }
    }, [dropMenu]);

    return <div
        ref={menuContainerRef}
        className="relative">
        <button
            className="flex items-start gap-0.5 font-bold text-base mt-1 cursor-pointer"
            onClick={handleDropMenu}
        >
            <span className="h-1 w-1 rounded-full bg-gray-500"></span>
            <span className="h-1 w-1 rounded-full bg-gray-500"></span>
            <span className="h-1 w-1 rounded-full bg-gray-500"></span>
        </button>
        <div
            ref={dropMenuRef}
            className={` transition-all duration-200 absolute right-6
                ${dropDown ?
                dropMenu ? "top-0 opacity-100 z-10" : " -top-10 opacity-0 -z-10" :
                dropMenu ? "bottom-0  opacity-100 z-10" : "-bottom-10 opacity-0 -z-10"
                } shadow shadow-gray-100`}
        >
            {children}
        </div>
    </div>;
};

export default Dropmenu;
