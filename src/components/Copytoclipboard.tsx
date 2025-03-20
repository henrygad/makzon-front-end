import { useState } from "react";
import { BsCopy } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";


const Copytoclipboard = ({body }:{body: string}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (body: string) => {        
        navigator
            .clipboard
            .writeText(body)
            .then(() => {
                setCopied(true);

                const clear = setTimeout(() => {
                    setCopied(false);
                    clearTimeout(clear);
                }, 1000);
            })
            .catch(() => setCopied(false));
    };

    return copied ?
        <FaCheck
            color="green" size={18}           
        /> :
        <BsCopy
            size={18}
            onClick={() => handleCopy(body)}
        />;
};

export default Copytoclipboard;
