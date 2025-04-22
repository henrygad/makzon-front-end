import { useNavigate } from "react-router-dom";
import Displayuserinfor from "../components/Displayuserinfor";
import Dropmenu from "../components/Dropmenu";
import { useAppDispatch, useAppSelector } from "../redux";
import userProps from "../types/user.type";
import { deleteBlogpost, editBlogpost } from "../redux/slices/userBlogpostSlices";
import Tab from "../components/Tab";
import Profileblogposts from "../sections/Profileblogposts";
import Followers from "../sections/Followers";
import Followings from "../sections/Followings";
import Dialog from "../components/Dialog";
import useDialog from "../hooks/useDialog";
import Copytoclipboard from "../components/Copytoclipboard";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Userprofile = ({ User }: { User: userProps }) => {
    const { data: Blogposts, loading } = useAppSelector(state => state.userBlogpostSlices.blogposts);
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();
    const { dialog, handleDialog } = useDialog();

    const userMenuOptions = [
        {
            name: "Edit profile",
            icon: <span>E</span>,
            func: () => navigate("/profile/update"),
        },
        {
            name: "Settings",
            icon: <span>S</span>,
            func: () => console.log("settings pages, coming soon"),
        },
    ];

    return <div className="overflow-hidden">
        <section className="flex justify-between items-start">
            {/* disply user infor*/}
            <Displayuserinfor
                short={false}
                user={User}
                onClick={handleDialog}
            />
            <div className="flex flex-col justify-between items-end min-h-[320px] pt-2.5">
                {/* profile menu */}
                <Dropmenu
                    horizotal={true}
                    children={
                        <ul className="min-w-[140px] text-sm font-text p-4 space-y-3 rounded-md border bg-white">
                            <li className="flex gap-2 items-center cursor-pointer">
                                <Copytoclipboard body={"/profile/" + User.userName} />
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
                    {/* navigate to user followers and following  */}
                <div className="flex flex-wrap justify-between gap-3 items-end">
                    <button
                        className="font-text font-medium text-xs sm:text-sm"
                        onClick={() => navigate("#followes")}
                    >
                        <span className="block">
                            Followers
                        </span>
                        <span className="block text-center">
                            {(User.followers || []).length || 0}
                        </span>
                    </button>
                    <button
                        className="font-text font-medium text-xs sm:text-sm"
                        onClick={() => navigate("#following")}
                    >
                        <span className="block">
                            Following
                        </span>
                        <span className="block text-center">
                            {(User.followings || []).length || 0}
                        </span>
                    </button>
                </div>
            </div>
        </section>
        <Tab
            className=""
            arrOfTab={[
                {
                    id: "blogposts",
                    tab: <Profileblogposts
                        loading={loading}
                        blogposts={Blogposts.filter(post => post.status.toLowerCase() == "published")}
                        updateBlogpost={
                            ({ blogpost, type }) => {
                                if (type === "EDIT") {
                                    appDispatch(editBlogpost(blogpost));
                                } else if (type === "DELETE") {
                                    appDispatch(deleteBlogpost({ _id: blogpost._id }));
                                }
                            }
                        }
                    />
                },
                {
                    id: "followes",
                    tab: <Followers followers={(User.followers || [])} />
                },
                {
                    id: "following",
                    tab: <Followings following={(User.followings || [])} />
                },
            ]}
        />
        <Dialog
            dialog={dialog}
            handleDialog={handleDialog}
            className="flex gap-8 border rounded-lg px-12 py-10 bg-white"
            children={<>
                <button
                    className="text-sm font-text text-slate-600 cursor-pointer"
                    onClick={() => {
                        handleDialog();
                        const clear = setTimeout(() => {
                            navigate(`?url=${apiEndPont + "/media/" + User.avatar}&type=image#single-image`);
                            clearTimeout(clear);
                        }, 100);
                    }}
                >
                    View Picture
                </button>
                <button
                    className="text-sm font-text text-slate-600 cursor-pointer"
                    onClick={() => navigate("/profile/update")}
                >
                    Edit Profile
                </button>
            </>}

        />
    </div>;
};

export default Userprofile;
