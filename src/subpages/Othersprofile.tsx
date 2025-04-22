import { useEffect, useState } from "react";
import userProps from "../types/user.type";
import postProps from "../types/post.type";
import { useNavigate } from "react-router-dom";
import Displayuserinfor from "../components/Displayuserinfor";
import Follow from "../components/Follow";
import Dropmenu from "../components/Dropmenu";
import Tab from "../components/Tab";
import Profileblogposts from "../sections/Profileblogposts";
import Followers from "../sections/Followers";
import Followings from "../sections/Followings";
import Copytoclipboard from "../components/Copytoclipboard";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Othersprofile = ({ userName }: { userName: string | undefined }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<userProps | null>(null);

    const [loadingBlogpost, setLoadingBlogpost] = useState(false);
    const [blogposts, setBlogposts] = useState<postProps[]>([]);

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
        setLoadingBlogpost(true);

        const url = apiEndPont + "/user/" + userName;
        axios(url, {
            baseURL: apiEndPont,
            withCredentials: true,
        })
            .then(async (res) => {
                const userData: userProps = await res.data.data;
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
                    })
                    .finally(() => {
                        setLoadingBlogpost(false);
                    });
            })
            .catch((error) => console.log(error));
    }, [userName]);


    return (
        <div className="overflow-hidden">
            <section className="flex justify-between items-start">
                {/* disply user infor*/}
                <Displayuserinfor
                    short={false}
                    user={user}
                    onClick={() =>
                        navigate(`?url=${apiEndPont + "/media/" + user?.avatar}&type=image#single-image`)
                    }
                />
                <div className="flex flex-col justify-between items-end min-h-[320px] pt-2.5">
                    <div className="flex items-start gap-4">
                        {/* follow btn */}
                        <Follow friend={user?.userName || ""} />
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
                    {/* navigate to user followers and following  */}
                    <div className="flex flex-wrap justify-between gap-3 items-end">
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
                    </div>
                </div>
            </section>
            <Tab
                className="w-full"
                arrOfTab={[
                    {
                        id: "blogposts",
                        tab: (
                            <Profileblogposts
                                loading={loadingBlogpost}
                                blogposts={blogposts}
                                updateBlogpost={({ blogpost: updateBlogpost, type }) => {
                                    if (type === "EDIT") {
                                        setBlogposts((pre) =>
                                            pre.map((blogpost) =>
                                                blogpost._id === updateBlogpost._id
                                                    ? { ...blogpost, ...updateBlogpost }
                                                    : blogpost
                                            )
                                        );
                                    } else if (type === "DELETE") {
                                        setBlogposts((pre) =>
                                            pre.filter(
                                                (blogpost) => blogpost._id !== updateBlogpost._id
                                            )
                                        );
                                    }
                                }}
                            />
                        ),
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
