import { ReactElement } from "react";

type Props = {
    id?: string,
    fieldName: string | ReactElement,
    className: string,
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    disabled?: boolean
};


const Button = ({ id, fieldName, className, onClick = ()=> null, disabled }: Props) => {        

    return <button
        id={id || ""}
        className={`font-text text-sm px-3 cursor-pointer ${className}`}
        onClick={onClick}
        disabled={disabled}
    >
        {fieldName}
    </button>;
};

export {
    Button

};