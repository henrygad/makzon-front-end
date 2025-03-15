import { useState } from "react";
import { useNavigate } from "react-router-dom";


type Props = {
    dialog: boolean,
    setDialog: (dialog: boolean, nav?: boolean) => void
};

const useHandleDialog = (id: string): Props => {
    const [dialog, setDialog] = useState(false);
    const navigate = useNavigate();

    return {
        dialog, setDialog: (dialog: boolean, nav: boolean = true) => {
            if (dialog) {
                setDialog(dialog);
                document.body.classList.add("overflow-hidden");                
                if (nav) navigate("#" + id);
            } else {
                setDialog(dialog);
                document.body.classList.remove("overflow-hidden");
                if (nav) navigate(-1);
            }
        }
    };
};

export default useHandleDialog;
