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

    const handleStopScrolling = () => {
        if (dialog) {
            document.body.classList.add("overflow-y-hidden");
        } else {
            document.body.classList.remove("overflow-y-hidden");
        }
    };

    const handlePopState = () => {
        if (dialog) {
            setDialog(false);
        }
    };

    useEffect(() => {
        handleStopScrolling();

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [dialog]);

    return { dialog, handleDialog };
};

export default useDialog;