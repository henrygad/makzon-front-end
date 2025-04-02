import { useEffect, useState } from "react";
import Displayuserinfor from "./Displayuserinfor";
import userProps from "../types/user.type";
import { Link } from "react-router-dom";


const Displaylike = ({ userName, autoViewLike }: {
    userName: string;
    autoViewLike?: {
        comment?: {
            blogpostParentComment: string | null,
            targetComment: string | null,
        },
        targetLike: string
    }
}) => {
    const [user, setUser] = useState<userProps | null>(null);

    const fetchUserData = (userName: string) => {
        setUser({ userName } as userProps);
    };

    useEffect(() => {
        if (userName) {
            fetchUserData(userName);
        }
    }, [userName]);

    return <>
        {user ?
            <Link
                to={`/profile/${userName}`}
                className={`block  ${autoViewLike?.targetLike === user.userName ? "bg-yellow-100" : ""}`}>
                <Displayuserinfor
                    short={true}
                    user={user}
                />
            </Link> :
            <span>loading</span>
        }
    </>;
};

export default Displaylike;
