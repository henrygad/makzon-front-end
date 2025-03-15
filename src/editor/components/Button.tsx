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
        className={`${className} px-3 py-1 shadow border`}
        onClick={handleClick}
        disabled={disabled}
    >
        {fieldName}
    </button>;
};

export {
    Button

};