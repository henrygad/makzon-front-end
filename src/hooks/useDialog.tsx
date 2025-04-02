import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const useDialog = () => {
    const navigate = useNavigate();
    const [dialog, setDialog] = useState(false);

    const handleDialog = () => {
        if (!dialog) {
            setDialog(true);
            navigate("#");
        } else {
            setDialog(false);
            navigate(-1);
        }
    };

    const handlePopState = () => {
        if (dialog) {
            setDialog(false);
        }
    };

    useEffect(() => {
        if (dialog) {
            document.body.classList.add("overflow-y-hidden");
        } else {
            document.body.classList.remove("overflow-y-hidden");
        }

        window.addEventListener("popstate", handlePopState);
        return () => {
            document.body.classList.remove("overflow-y-hidden");
            window.removeEventListener("popstate", handlePopState);
        };
    }, [dialog]);

    return { dialog, handleDialog };
};

export default useDialog;