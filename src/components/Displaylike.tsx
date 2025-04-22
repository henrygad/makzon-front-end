import { useEffect, useState } from "react";
import Displayuserinfor from "./Displayuserinfor";
import userProps from "../types/user.type";
import { Link } from "react-router-dom";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type props = {
    userName: string;
    autoViewLike?: {
        comment?: {
            blogpostParentComment: string | null,
            targetComment: string | null,
        },
        targetLike: string
    }
};

const Displaylike = ({ userName, autoViewLike }: props) => {
    const [user, setUser] = useState<userProps | null>(null);    

    useEffect(() => {
        if (!userName) return;
        const url = apiEndPont + "/user/" + userName;
        axios(url)
            .then(async (res) => {
                const user: userProps = await res.data.data;
                setUser(user);
            })
            .catch((error) => {
                console.log(error);
            });
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
