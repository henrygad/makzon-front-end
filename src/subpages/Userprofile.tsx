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
import { addToDisplaySingleMedia, displayMediaOptions } from "../redux/slices/userMediaSlices";
import Copytoclipboard from "../components/Copytoclipboard";

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
        <div className="flex">
            {/* disply user infor*/}
            <Displayuserinfor
                short={false}
                user={User}
                onClick={handleDialog}
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
                                appDispatch(addToDisplaySingleMedia({ url: User.avatar, _id: "", type: "image", mime: "png" }));
                                appDispatch(displayMediaOptions({
                                    negativeNavigate: "#",
                                }));
                                navigate("#single-image");   
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
            <div className="flex flex-col items-end justify-between gap-8 py-2">
                <div className="flex items-start">
                    {/* profile menu */}
                    <Dropmenu
                        horizotal={true}
                        children={
                            <ul className="min-w-[140px] text-sm font-text p-4 space-y-3 rounded-md border bg-white "> 
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
                                            { option.icon}
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
                            {(User.followers || []).length || 0}
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
                            {(User.followings || []).length || 0}
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
                        loading={loading}
                        blogposts={Blogposts}
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
    </div>;
};

export default Userprofile;
