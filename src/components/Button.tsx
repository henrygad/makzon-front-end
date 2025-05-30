import { ReactElement } from "react";

type Props = {
    id?: string,
    fieldName: string | ReactElement,
    className: string,
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    disabled?: boolean
};


const Button = ({ id, fieldName, className, onClick = ()=> null, disabled }: Props) => {    

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {            
        onClick(e);
    };

    return <button
        id={id || ""}
        className={`font-text text-sm px-3 ${className}`}
        onClick={handleClick}
        disabled={disabled}
    >
        {fieldName}
    </button>;
};

export {
    Button

};