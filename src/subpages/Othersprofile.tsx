import { useEffect, useState } from "react";
import userProps from "../types/user.type";
import postProps from "../types/post.type";
import { useNavigate } from "react-router-dom";
import Displayuserinfor from "../components/Displayuserinfor";
import Follow from "../components/Follow";
import Dropmenu from "../components/Dropmenu";
import Tab from "../components/Tab";
import Followers from "../sections/Followers";
import Followings from "../sections/Followings";
import Copytoclipboard from "../components/Copytoclipboard";
import axios from "axios";
import Displaymultipleposts from "../sections/Displaymultipleposts";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Othersprofile = ({ userName }: { userName: string | undefined }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<userProps | null>(null);

    const [blogposts, setBlogposts] = useState<postProps[] | null>(null);

    const userMenuOptions = [
        {
            name: "Report profile",
            icon: <span>R</span>,
            func: () => console.log("profile has be reported"),
        },
        {
            name: "Block profile",
            icon: <span>B</span>,
            func: () => console.log("profile has be block"),
        },
    ];

    useEffect(() => {
        if (!userName) return;
        const url = apiEndPont + "/user/" + userName;
        axios(url, {
            baseURL: apiEndPont,
            withCredentials: true,
        })
            .then(res => res.data)
            .then(data => {
                const userData: userProps = data.data;
                setUser(userData);
                const params = new URLSearchParams({
                    status: "published",
                    author: userName,
                    updatedAt: "-1",
                });
                const url = apiEndPont + "/post?" + params.toString();
                axios(url, {
                    baseURL: apiEndPont,
                    withCredentials: true,
                })
                    .then(async (res) => {
                        const blogpost: postProps[] = await res.data.data;
                        setBlogposts(blogpost);
                    });
            })
            .catch((error) => console.log(error));
    }, [userName]);


    return (
        <div className="overflow-hidden">
            <Tab
                arrOfTab={[
                    {
                        id: "blogposts",
                        tab: <>
                            <section className=" mb-6">
                                <div className="flex justify-between items-start">
                                    {/* disply user infor*/}
                                    <Displayuserinfor
                                        short={false}
                                        user={user}
                                        onClick={() =>
                                            navigate(`?url=${apiEndPont + "/media/" + user?.avatar}&type=image#single-image`)
                                        }
                                    />
                                    <div className="flex gap-1">
                                        {/* follow btn */}
                                        <Follow friend={user ? user.userName : ""} />
                                        {/* profile menu */}
                                        <Dropmenu
                                            horizotal={true}
                                            children={
                                                <ul className="min-w-[140px] text-sm font-text p-4 space-y-3 rounded-md border bg-white">
                                                    <li className="flex gap-2 items-center cursor-pointer">
                                                        <Copytoclipboard body={"/profile/" + user?.userName} />
                                                        <span>Copy</span>
                                                    </li>
                                                    {userMenuOptions.map((option) => (
                                                        <li
                                                            key={option.name}
                                                            className="flex gap-2 items-center cursor-pointer"
                                                            onClick={(e) => {
                                                                option.func();
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            {option.icon}
                                                            <span>{option.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            }
                                        />
                                    </div>
                                </div>
                                {/* navigate to user followers and following  */}
                                <div className={`flex justify-end items-center gap-3 ${!blogposts ? "animate-pulse" : ""}`}>
                                    {user ?
                                        <>
                                            <button
                                                className="font-text font-medium text-xs sm:text-sm"
                                                onClick={() => navigate("#followes")}
                                            >
                                                <span className="block">Followers</span>
                                                <span className="block text-center">
                                                    {(user?.followers || []).length || 0}
                                                </span>
                                            </button>
                                            <button
                                                className="font-text font-medium text-xs sm:text-sm"
                                                onClick={() => navigate("#following")}
                                            >
                                                <span className="block">Following</span>
                                                <span className="block text-center">
                                                    {(user?.followings || []).length || 0}
                                                </span>
                                            </button>
                                        </> :
                                        <>
                                            <div className="w-[50px] h-2.5 bg-slate-300 rounded"></div>
                                            <div className="w-[50px] h-2.5 bg-slate-300 rounded"></div>

                                        </>
                                    }
                                </div>
                            </section>
                            <Displaymultipleposts
                                title={`Published ${blogposts?.filter(post => post.status.toLowerCase() == "published").length || 0} articles`}
                                posts={blogposts?.filter(post => post.status.toLowerCase() == "published") || null}
                                updatepost={({ blogpost, type }) => {
                                    if (type === "EDIT") {
                                        setBlogposts(pre => pre ? pre.map(post => post._id === blogpost._id ? { ...post, ...blogpost } : post) : pre);
                                    } else if (type === "DELETE") {
                                        setBlogposts((pre) => pre ?pre.filter((blogpost) => blogpost._id !== blogpost._id) :pre);
                                    }
                                }}
                            />
                        </>
                    },
                    {
                        id: "followes",
                        tab: <Followers followers={user?.followers || []} />,
                    },
                    {
                        id: "following",
                        tab: <Followings following={user?.followings || []} />,
                    },
                ]}
            />
        </div>
    );
};

export default Othersprofile;
