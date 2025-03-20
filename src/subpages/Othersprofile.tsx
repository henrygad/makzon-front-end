import { useEffect, useState } from "react";
import userProps from "../types/user.type";
import postProps from "../types/post.type";
import { useNavigate } from "react-router-dom";
import Displayuserinfor from "../components/Displayuserinfor";
import Follow from "../components/Follow";
import Dropmenu from "../components/Dropmenu";
import { useAppDispatch } from "../redux";
import { addToDisplaySingleMedia, displayMediaOptions } from "../redux/slices/userMediaSlices";
import Tab from "../components/Tab";
import Profileblogposts from "../sections/Profileblogposts";
import Followers from "../sections/Followers";
import Followings from "../sections/Followings";
import Copytoclipboard from "../components/Copytoclipboard";

const Othersprofile = ({ userName }: { userName: string | undefined }) => {
    const navigate = useNavigate();
    const appDispatch = useAppDispatch();
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

    const handleFetchUserData = (userName: string) => {
        setLoadingBlogpost(false);
        setUser({
            userName,
            name: { familyName: "", givenName: "" },
            dateOfBirth: "",
            displayDateOfBirth: false,
            displayEmail: "",
            displayPhoneNumber: "",
            website: "",
            profession: "",
            country: "",
            sex: "",
            bio: "",
            login: true,
        } as userProps);
        setBlogposts([]);
    };

    useEffect(() => {
        if (userName) {
            handleFetchUserData(userName);
        }
    }, [userName]);

    if (!user) {
        return <div>
            <span>User not found</span>
        </div>;
    }

    return <div className="overflow-hidden">
        <div className="flex">
            {/* disply user infor*/}
            <Displayuserinfor
                short={false}
                user={user}
                onClick={() => {
                    appDispatch(addToDisplaySingleMedia({ url: user.avatar, _id: "", type: "image", mime: "png" }));
                    appDispatch(displayMediaOptions({
                        negativeNavigate: "#",
                    }));
                    navigate("#single-image");
                }}
            />
            <div className="flex flex-col items-end justify-between gap-8 py-2">
                <div className="flex items-start gap-4">
                    {/* follow btn */}
                    <Follow friend={user.userName} />
                    {/* profile menu */}
                    <Dropmenu
                        horizotal={true}
                        children={
                            <ul className="min-w-[140px] text-sm font-text p-4 space-y-3 rounded-md border bg-white ">
                                <li className="flex gap-2 items-center cursor-pointer">
                                    <Copytoclipboard body={"/profile/" + user.userName} />
                                    <span>Copy</span>
                                </li>
                                {
                                    userMenuOptions.map(option =>
                                        <li
                                            key={option.name}
                                            className="flex gap-2 items-center cursor-pointer"
                                            onClick={(e) => {
                                                option.func();
                                                e.stopPropagation();
                                            }}
                                        >
                                            {option.icon}
                                            <span>
                                                {option.name}
                                            </span>
                                        </li>
                                    )
                                }
                            </ul>
                        }
                    />
                </div>
                <div className="flex justify-between gap-2 sm:gap-4 items-end">
                    {/* navigate to user followers and following  */}
                    <button
                        className="text-sm sm:text-base font-sec text-slate-800"
                        onClick={() => navigate("#followes")}
                    >
                        <span className="block">
                            Followers
                        </span>
                        <span className="block text-center">
                            {(user.followers || []).length || 0}
                        </span>
                    </button>
                    <button
                        className="text-sm sm:text-base font-sec text-slate-800"
                        onClick={() => navigate("#following")}
                    >
                        <span className="block">
                            Following
                        </span>
                        <span className="block text-center">
                            {(user.followings || []).length || 0}
                        </span>
                    </button>
                </div>
            </div>
        </div>        
        <Tab
            className=""
            arrOfTab={[
                {
                    id: "blogposts",
                    tab: <Profileblogposts
                        loading={loadingBlogpost}
                        blogposts={blogposts}
                        updateBlogpost={({ blogpost: updateBlogpost, type }) => {
                            if (type === "EDIT") {
                                setBlogposts(pre => pre.map(blogpost =>
                                    blogpost._id === updateBlogpost._id ?
                                        { ...blogpost, ...updateBlogpost } :
                                        blogpost
                                ));
                            } else if (type === "DELETE") {
                                setBlogposts(pre => pre.filter(blogpost =>
                                    blogpost._id !== updateBlogpost._id
                                ));
                            }
                        }}
                    />
                },
                {
                    id: "followes",
                    tab: <Followers followers={(user.followers || [])} />
                },
                {
                    id: "following",
                    tab: <Followings following={(user.followings || [])} />
                },
            ]}
        />
    </div>;
};

export default Othersprofile;
