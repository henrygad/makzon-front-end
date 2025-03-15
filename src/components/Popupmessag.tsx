import { ReactElement, useEffect, } from "react";

type Props = {
    children: string | ReactElement,
    className: string,
    popUp: boolean,
    setPopUp: React.Dispatch<React.SetStateAction<boolean>>
};

const Popupmessage = ({
    children,
    className,
    popUp,
    setPopUp
}: Props) => { 

    useEffect(() => { 
        if (popUp) {           
            const clear = setTimeout(() => {
                setPopUp(false);               
                clearTimeout(clear);
            }, 3000);
        }
    }, [popUp]);


    return <span className={`transition-transform duration-200  ${
        popUp ?
        "top-1/2 -translate-y-1/2 bg-opacity-100"  :
        "bg-opacity-0"
        } block fixed right-1/2 text-sm font-text text-white bg-stone-600 bg-opacity-70 rounded p-2 z-50
      ${className}`}>
        { children }
        </span>;
};

export default Popupmessage;