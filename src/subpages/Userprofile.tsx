import { useNavigate } from "react-router-dom";
import Displayuserinfor from "../components/Displayuserinfor";
import Dropmenu from "../components/Dropmenu";
import { useAppDispatch, useAppSelector } from "../redux";
import userProps from "../types/user.type";
import { deleteBlogpost, editBlogpost } from "../redux/slices/userBlogpostSlices";
import Tab from "../components/Tab";
import Followers from "../sections/Followers";
import Followings from "../sections/Followings";
import Dialog from "../components/Dialog";
import useDialog from "../hooks/useDialog";
import Copytoclipboard from "../components/Copytoclipboard";
import Displaymultipleposts from "../sections/Displaymultipleposts";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Userprofile = ({ User, loading: loadingUserData }: { User: userProps, loading: boolean }) => {
    const { data: Blogposts, loading: loadingBlogposts } = useAppSelector(state => state.userBlogpostSlices.blogposts);
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
        <Tab
            arrOfTab={[
                {
                    id: "profile",
                    tab: <>
                        <section className="mb-6">
                            <div className="flex justify-between items-start gap-4">
                                {/* disply user infor*/}
                                <Displayuserinfor
                                    short={false}
                                    user={User}
                                    onClick={handleDialog}
                                    loading={loadingUserData}
                                />
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
                            </div>

                            {/* navigate to user followers and following  */}
                            <div className={`flex justify-end items-center gap-3 ${!loadingUserData ? "animate-pulse" : ""}`}>
                                {!loadingUserData ?
                                    <>
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
                                    </> :
                                    <>
                                        <div className="w-[50px] h-2.5 bg-slate-300 rounded"></div>
                                        <div className="w-[50px] h-2.5 bg-slate-300 rounded"></div>

                                    </>
                                }
                            </div>
                        </section>
                        <Displaymultipleposts
                            title={`Published ${Blogposts.filter(post => post.status.toLowerCase() == "published").length || 0} articles`}
                            posts={Blogposts.filter(post => post.status.toLowerCase() == "published")}
                            loading={loadingBlogposts}
                            updatepost={({ blogpost, type }) => {
                                if (type === "EDIT") {
                                    appDispatch(editBlogpost(blogpost));
                                } else if (type === "DELETE") {
                                    appDispatch(deleteBlogpost({ _id: blogpost._id }));
                                }
                            }}
                        />
                        {/* profile picture dialog option */}
                        <section>
                            <Dialog
                                dialog={dialog}
                                handleDialog={handleDialog}
                                className="font-text text-slate-800 font-normal"
                                children={<>
                                    <span className="flex items-center gap-3 border-b p-4">
                                        <span className="text-base whitespace-pre font-semibold">
                                            What would you like to do?
                                        </span>
                                    </span>
                                    <span className="flex text-sm font-medium text-slate-60 px-4 border-t">
                                        <span className="flex-1 flex justify-start items-center px-2 py-4">
                                            <button
                                                className="font-text text-nowrap whitespace-pre text-sm cursor-pointer"
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

                                        </span>
                                        <span className="flex-1 flex justify-end items-center border-l px-2 py-4">
                                            <button
                                                className="font-text text-nowrap whitespace-pre text-sm cursor-pointer"
                                                onClick={() => navigate("/updateprofile")}
                                            >
                                                Edit Profile
                                            </button>
                                        </span>
                                    </span>
                                </>}
                            />
                        </section>
                    </>
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
    </div>;
};

export default Userprofile;
