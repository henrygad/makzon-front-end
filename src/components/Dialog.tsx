import { ReactElement, useRef } from "react";
import useClickOutSide from "../hooks/useClickOutSide";


const Dialog = ({ dialog, handleDialog= ()=> null, className, children }:
    { dialog: boolean, handleDialog?: () => void, className: string, children: ReactElement }) => {

    const dialogRef = useRef<HTMLSpanElement | null>(null);

    useClickOutSide(dialogRef, handleDialog);

    return dialog ?
        <span
            className="fixed top-0 bottom-0 right-0 left-0 flex bg-blue-300/10 z-50"
        >
            <span
                className="container flex-1 flex justify-center items-center">
                <span
                    className={`block shadow-md ${className}`}
                    ref={dialogRef}
                >
                    {children}
                </span>
            </span>
        </span> :
        null;

};

export default Dialog;