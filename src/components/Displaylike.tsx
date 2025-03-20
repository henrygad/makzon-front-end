import { useEffect, useState } from "react";
import Displayuserinfor from "./Displayuserinfor";
import userProps from "../types/user.type";


const Displaylike = ({ userName }: { userName: string }) => {
    const [user, setUser] = useState<userProps | null>(null);

    const fetchUserData = (userName: string) => {
        setUser({userName} as userProps);
    };
    

    useEffect(() => {
        if (userName) {
            fetchUserData(userName);                    
        }
    }, [userName]);

    return <>
        {user ?
            <Displayuserinfor
                short={true}
                user={user}
            /> :
            <span>loading</span>
        }
    </>;
};

export default Displaylike;
