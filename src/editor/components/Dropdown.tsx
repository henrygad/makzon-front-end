import { ReactElement, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutSide from "../hooks/useClickOutSide";

type Props = {
    id: string
    fieldName: string | ReactElement,
    children: ReactElement
    className?: string
}

const Dropdown = ({ id,
    fieldName,
    className = "",
    children
}: Props) => {
    const [drop, setDrop] = useState(false);
    const dropRef = useRef(null);
    useClickOutSide(dropRef, () => {
        setDrop(false);
        if (drop) {
            //document.body.classList.remove("overflow-hidden");            
        }
    });

    const handleDrop = () => {
        if (!drop) {
            //document.body.classList.add("overflow-hidden");
        } else {
            //document.body.classList.remove("overflow-hidden");
        }
        setDrop(!drop);
    };

    return <div
        id={id}
        ref={dropRef}
        className="relative"

    >
        <button
            className={`${className} flex gap-1 items-center`}
            onClick={handleDrop}
        >
            {fieldName}
            <IoIosArrowDown
                className={`${drop ? "rotate-180" : ""}`}
                scale={10}
            />
        </button>
        {drop ?
            <div className="absolute top-full left-1/2 right-auto -translate-x-1/2 bg-white z-10 ">
                {children}
            </div> :
            null
        }
    </div>;
};

export default Dropdown;
