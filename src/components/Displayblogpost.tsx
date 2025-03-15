import { useEffect, useState } from "react";
import postProps from "../types/post.type";
import Displayuserinfor from "./Displayuserinfor";
import Dropmenu from "./Dropmenu";
import userProps from "../types/user.type";
import useSanitize from "../hooks/useSanitize";
import Displayimage from "./Displayimage";
import imgplaceholder from "../assert/imageplaceholder.svg";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux";
import { deleteBlogpost, editBlogpost } from "../redux/slices/userBlogpostSlices";

type Props = {
    displyType: string;
    blogpost: postProps;
};

const Displayblogpost = ({ displyType, blogpost }: Props) => {
    const appDispatch = useAppDispatch();
    const [authorInfor, setAuthorInfor] = useState<userProps | null>(null);
    const sanitize = useSanitize();
    const navigate = useNavigate();

    const publicBlogpostMenus = [
        {
            name: "Copy link",
            icon: <span>c</span>,
            func: () => console.log("copied"),
        },
        {
            name: "View post",
            icon: <span>V</span>,
            func: () => handleToView(blogpost),
        },
        {
            name: "Save post",
            icon: <span>S</span>,
            func: () => console.log("Save post"),
        },
        {
            name: "Report",
            icon: <span>R</span>,
            func: () => console.log("Report"),
        },
        {
            name: "Block",
            icon: <span>B</span>,
            func: () => console.log("Block"),
        },
    ];
    const privateBlogpostMenu = [
        {
            name: "Edit",
            icon: <span>E</span>,
            func: () => handleToEdit(blogpost),
        },
        {
            name: blogpost.status === "published" ? "Unpublish" : "publish",
            icon: blogpost.status === "published" ? <span>U</span> : <span>P</span>,
            func: () => {
                if (blogpost.status === "published") {
                    handleUnpublish(blogpost);
                } else {
                    handlePublish(blogpost);
                }
            },
        },
        {
            name: "Delete",
            icon: <span>U</span>,
            func: () => handleDelete(blogpost._id || ""),
        },
    ];

    const handleFetchAutoInfor = (userName: string) => {
        setAuthorInfor({
            userName,
            name: { familyName: "Orji", givenName: "Henry" },
            avatar: "",
        } as userProps);
    };

    const truncate = (words: string, numWords: number) => {
        return words.split(" ", numWords).join(" ");
    };

    const handleToView = (blogpost: postProps) => {
        navigate("/" + blogpost.author + "/" + blogpost.slug, { state: { blogpost } });
    };

    const handleToEdit = (blogpost: postProps) => {
        navigate("/createblogpost", { state: { blogpost } });
    };

    const handlePublish = (blogpost: postProps) => {
        const publishBlogpost = {
            ...blogpost,
            status: "published"
        };
        const Blogposts: postProps[] = JSON.parse(localStorage.getItem("blogposts") || "[]");
        localStorage.setItem("blogposts", JSON.stringify(Blogposts.map(
            (blogpost: postProps) => blogpost._id === publishBlogpost._id ? { ...publishBlogpost } : blogpost
        )));
        appDispatch(editBlogpost(publishBlogpost));
    };

    const handleUnpublish = (blogpost: postProps) => {
        const unpublishBlogpost = {
            ...blogpost,
            status: "unpublished"
        };
        const Blogposts: postProps[] = JSON.parse(localStorage.getItem("blogposts") || "[]");
        localStorage.setItem("blogposts", JSON.stringify(Blogposts.map(
            (blogpost: postProps) => blogpost._id === unpublishBlogpost._id ? { ...unpublishBlogpost } : blogpost
        )));
        appDispatch(editBlogpost(unpublishBlogpost));
    };

    const handleDelete = (_id: string) => {
        const Blogposts: postProps[] = JSON.parse(localStorage.getItem("blogposts") || "[]");
        localStorage.setItem("blogposts", JSON.stringify(Blogposts.filter(blogpost => blogpost._id !== _id)));
        appDispatch(deleteBlogpost({ _id }));
    };

    useEffect(() => {
        handleFetchAutoInfor(blogpost.author || "");
    }, []);

    if (!authorInfor) {
        return <div>loaidng...</div>;
    }

    return <div className={`space - y - 4 p-2 ${displyType === "TEXT" ? "border" : ""} rounded-md`}>
        <div className="flex items-start justify-between gap-6">
            {/* author info */}
            <Displayuserinfor
                short={true}
                user={authorInfor}
                onClick={()=> navigate("/profile/"+authorInfor.userName)}
            />
            <Dropmenu
                children={
                    <ul className="min-w-[140px] text-sm font-text p-4 space-y-3 rounded-md border bg-white ">
                        {
                            (blogpost.author &&
                                blogpost.author.trim() === "@henry_dev" ?
                                [...publicBlogpostMenus, ...privateBlogpostMenu]
                                : publicBlogpostMenus)
                                .map((menu) =>
                                    displyType === "_HTML" &&
                                        menu.name === "View post" ?
                                        null :
                                        <li
                                            key={menu.name}
                                            className="flex gap-1 cursor-pointer"
                                            onClick={(e) => {
                                                menu.func();
                                                document.body.classList.remove("overflow-y-hidden");
                                                e.stopPropagation();
                                            }}>
                                            {menu.icon} <span>{menu.name}</span>
                                        </li>)
                        }
                    </ul>
                }
            />
        </div>
        <article className="font-text text-base">
            <span className="flex gap-4 text-sm text-stone-700 font-sec">
                {/* post date */}
                <span>Post: 02 01 25; 11:00am</span>
                <span>Updated: 03 01 25; 1:00pm</span>
            </span>
            <ul className="flex gap-1 text-sm text-slate-800">
                {blogpost.catigories && blogpost.catigories.length
                    ? blogpost.catigories.map((catigory, index) => (
                        catigory.trim() ? <li key={index}>
                            <span className="font-semibold">.</span>
                            {catigory}
                        </li> :
                            null
                    ))
                    : null}
            </ul>
            <span className="space flex justify-center mt-2 mb-1">
                <span className="border-2 min-w-10 max-w-10 rounded-md"></span>
            </span>
            {/* post article */}
            {displyType === "_HTML" ? (
                <span
                    dangerouslySetInnerHTML={sanitize(blogpost._html.body || "")}
                ></span>
            ) : (
                <span className="block indent-2 break-words hyphens-auto">
                    {truncate(blogpost.body || "", 40)} {" "}
                    <span
                        className="text-blue-700 text-sm font-semibold cursor-pointer"
                        onClick={() => handleToView(blogpost)}
                    >
                        Continue Reading...
                    </span>
                </span>
            )}
            {displyType === "TEXT" &&
                blogpost.image.trim() ? (
                <Displayimage
                    url={blogpost.image || ""}
                    alt={blogpost.title || ""}
                    useCancle={false}
                    parentClassName="w-full h-full"
                    className="w-full h-20 object-cover  cursor-pointer"

                    placeHolder={
                        <img
                            src={imgplaceholder}
                            className="absolute top-0 bottom-0 right-0 left-0 object-cover w-full h-20"
                        />
                    }
                    onClick={() => handleToView(blogpost)}
                />
            ) : null}
            <span className="space flex justify-center my-2">
                <span className="border-2 min-w-10 max-w-10 rounded-md"></span>
            </span>
        </article>
        <div className="flex justify-around gap-4">
            {/* post stat */}
            <button>comments 20</button>
            <button>likes 30</button>
            <button>shares 50</button>
            <button>views 100</button>
        </div>
    </div>;
};

export default Displayblogpost;
