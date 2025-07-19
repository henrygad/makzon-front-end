import { useNavigate } from "react-router-dom";
import Displayuserinfor from "../components/Displayuserinfor";
import userProps from "../types/user.type";
import Displayuserloading from "../loaders/Displayuserloading";

type Props = {
    title?: string
    horizontal: boolean,
    users: userProps[] | null
};

const Displaymultipleusers = ({ title, horizontal = true, users }: Props) => {
    const navigate = useNavigate();

    return <section className="space-y-8 my-4">
        {title ?
            <span className="block font-sec text-xl font-semibold">
                {title}
            </span> :
            null
        }
        {horizontal ?
            <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory">
                <div className="flex gap-4 w-max px-4">
                    {users ?
                        users.length ?
                            users.map(user =>
                                <Displayuserinfor
                                    key={user.userName}
                                    short={true}
                                    user={user}
                                    className="block min-w-[100px] snap-start shrink-0"
                                    onClick={() => navigate("/profile/" + user.userName)}
                                />
                            ) :
                            null
                        :
                        <>
                            {
                                Array(4).fill("")
                                    .map((_, index) =>
                                        <Displayuserloading
                                            key={index}
                                        />
                                    )
                            }
                        </>
                    }
                </div>
            </div> :
            <div>
                <div className="space-y-4">
                    {users ?
                        users.length ?
                            users.map(user =>
                                <Displayuserinfor
                                    key={user.userName}
                                    short={true}
                                    user={user}
                                    className="block min-w-[100px] snap-start shrink-0"
                                    onClick={() => navigate("/profile/" + user.userName)}
                                />
                            ) :
                            null
                        :
                        <>
                            {
                                Array(4).fill("")
                                    .map((_, index) =>
                                        <Displayuserloading
                                            key={index}
                                        />
                                    )
                            }
                        </>
                    }
                </div>
            </div>

        }
    </section>;
};

export default Displaymultipleusers;
