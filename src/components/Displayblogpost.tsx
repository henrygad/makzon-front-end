import { useEffect, useRef, useState } from "react";
import postProps from "../types/post.type";
import Displayuserinfor from "./Displayuserinfor";
import Dropmenu from "./Dropmenu";
import userProps from "../types/user.type";
import useSanitize from "../hooks/useSanitize";
import Displayimage from "./Displayimage";
import imgplaceholder from "../assert/imageplaceholder.svg";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import commentProps from "../types/comment.type";
import Likeblogpost from "./Likeblogpost";
import { Button } from "./Button";
import Tab from "./Tab";
import Blogpostcomments from "../sections/Blogpostcomments";
import Blogpostlikes from "../sections/Blogpostlikes";
import Shareblogpost from "./Shareblogpost";
import Viewblogpost from "./Viewblogpost";
import { useAppDispatch, useAppSelector } from "../redux";
import { editProfile } from "../redux/slices/userProfileSlices";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
    displayType: string;
    blogpost: postProps;
    updateBlogpost: ({ type, blogpost }: { type: "EDIT", blogpost: postProps } | { type: "DELETE", blogpost: { _id: string } }) => void;
    autoViewComment?: {
        blogpostParentComment: string | null,
        targetComment: string,
    }
    autoViewLike?: {
        comment?: {
            blogpostParentComment: string | null,
            targetComment: string,
        }
        targetLike: string
    }
};

const Displayblogpost = ({
    displayType,
    blogpost,
    updateBlogpost,
    autoViewComment,
    autoViewLike
}: Props) => {
    const navigate = useNavigate();
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const appDispatch = useAppDispatch();

    const [authorInfor, setAuthorInfor] = useState<userProps | null>(null);
    const [comments, setComments] = useState<commentProps[]>([]);
    const blogpostRef = useRef<HTMLDivElement | null>(null);
    const sanitize = useSanitize();

    const publicBlogpostMenus = [
        {
            name: "View post",
            icon: <span>V</span>,
            func: () => {
                handleToView(blogpost);
            },
        },
        {
            name: "Save post",
            icon: <span>S</span>,
            func: () => handleSave(blogpost._id || ""),
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
            func: () => {
                handleToEdit(blogpost);
            },
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
            icon: <span>D</span>,
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

    const handleFetchBlogpostComments = (_id: string) => {
        const Comments: commentProps[] = JSON.parse(localStorage.getItem("comments") || "[]");
        const blogpostComments = Comments.filter(comment => comment.postId === _id);
        setComments(blogpostComments.map(parentComment => {
            const children = Comments.filter(comment => comment.replyId === parentComment._id);
            return { ...parentComment, children };
        }));
    };

    const handleSave = (_id: string) => {
        if ((User.saves || []).includes(_id)) {
            return;
        } else {
            const updatedUser: userProps = {
                ...User,
                saves: [_id, ...(User.saves || []),]
            };
            localStorage.setItem("user", JSON.stringify({ ...updatedUser }));
            appDispatch(editProfile(updatedUser));
        }
    };

    const handleToView = (blogpost: postProps, hashId: string | null = null) => {
        if (displayType.trim().toLowerCase() === "_html") return;
        const url = "/" + blogpost.author + "/" + blogpost.slug + (hashId ? "/#" + hashId : "");
        navigate(url);
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
        updateBlogpost({ blogpost: publishBlogpost, type: "EDIT" });
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
        updateBlogpost({ blogpost: unpublishBlogpost, type: "EDIT" });
    };

    const handleDelete = (_id: string) => {
        const Blogposts: postProps[] = JSON.parse(localStorage.getItem("blogposts") || "[]");
        localStorage.setItem("blogposts", JSON.stringify(Blogposts.filter(blogpost => blogpost._id !== _id)));
        updateBlogpost({ blogpost: { _id }, type: "DELETE" });
    };

    useEffect(() => {
        if (blogpost._id) {
            handleFetchAutoInfor(blogpost.author || "");
            handleFetchBlogpostComments(blogpost._id);
        }
    }, [blogpost._id]);

    if (!authorInfor) {
        return <div>loaidng...</div>;
    }

    return <>
        <div
            ref={blogpostRef}
            className={`space - y - 4 p-2 ${displayType === "TEXT" ? "border" : ""} rounded-md`}
        >
            <span className="flex items-start justify-between gap-6">
                {/* author info */}
                <Displayuserinfor
                    short={true}
                    user={authorInfor}
                    onClick={() => navigate("/profile/" + authorInfor.userName)}
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
                                        displayType === "_HTML" &&
                                            menu.name === "View post" ?
                                            null :
                                            <li
                                                key={menu.name}
                                                className="flex gap-1 cursor-pointer"
                                                onClick={(e) => {
                                                    menu.func();
                                                    e.stopPropagation();
                                                }}>
                                                {menu.icon} <span>{menu.name}</span>
                                            </li>)
                            }
                        </ul>
                    }
                />
            </span>
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
                <>
                    {displayType === "_HTML" ? <span dangerouslySetInnerHTML={sanitize(blogpost._html.body || "")}></span>: 
                        <span
                            className="indent-2 break-words hyphens-auto line-clamp-3 cursor-pointer"
                            onClick={() => handleToView(blogpost)}
                        >
                            {blogpost.body}
                        </span>
                    }
                </>
                <>
                    {
                        blogpost.image.trim() ? (
                            <Displayimage
                                url={apiEndPont + "/media/" + blogpost.image}
                                alt={blogpost.title}
                                useCancle={false}
                                parentClassName="w-full h-full"
                                className="w-full h-20 object-cover  cursor-pointer"
                                placeHolder={
                                    <img
                                        src={imgplaceholder}
                                        className="absolute top-0 bottom-0 right-0 left-0 object-cover w-full h-20"
                                        onClick={() => {
                                            if (displayType === "TEXT") {
                                                handleToView(blogpost);
                                            } else {
                                                navigate(`?url=${blogpost.image}&type=image#single-image`);
                                            }
                                        }}
                                    />
                                }
                                onClick={() => {
                                    if (displayType === "TEXT") {
                                        handleToView(blogpost);
                                    } else {
                                        navigate(`?url=${blogpost.image}&type=image#single-image`);
                                    }
                                }}
                            />
                        ) :
                            null
                    }
                </>
                <span className="space flex justify-center my-2">
                    <span className="border-2 min-w-10 max-w-10 rounded-md"></span>
                </span>
            </article>
            <span className="flex justify-around gap-4">
                {/* post stat */}
                <button
                    id="blogpost-comment-btn"
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Comment
                        blogpost={blogpost}
                        replyId={null}
                        parentComment={null}
                        replying={[]}
                        setComments={setComments}
                    />
                    <span
                        onClick={() => handleToView(blogpost, "blogpost-comments")}
                    >
                        {comments && comments.length}
                    </span>
                </button>
                <button
                    id="blogpost-like-btn"
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Likeblogpost
                        blogpost={blogpost}
                        updateBlogpost={updateBlogpost}
                    />
                    <span
                        onClick={() => handleToView(blogpost, "blogpost-likes")}
                    >
                        {blogpost?.likes && blogpost.likes.length || 0}
                    </span>
                </button>
                <button
                    id="blogpost-share-btn"
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Shareblogpost
                        blogpost={blogpost}
                        updateBlogpost={updateBlogpost}
                    />
                    <span>
                        {blogpost?.shares && blogpost.shares.length || 0}
                    </span>
                </button>
                <span
                    id="blogpost-view-btn"
                    className="flex items-center gap-2"
                >
                    <Viewblogpost
                        blogpostRef={blogpostRef}
                        displayType={displayType}
                        blogpost={blogpost}
                        updateBlogpost={updateBlogpost}
                    />
                    <span>
                        {blogpost?.views && blogpost.views.length || 0}
                    </span>
                </span>
            </span>
        </div>


        {
            displayType.trim().toLowerCase() === "_html" ?
                <>
                    <menu className="border-t border-b">
                        <ul className="flex items-center gap-6 p-2">
                            <li>
                                <Button
                                    fieldName={"Comments"}
                                    className=""
                                    onClick={() => navigate("#blogpost-comments")}
                                />
                            </li>
                            <li>
                                <Button
                                    fieldName={"Likes"}
                                    className=""
                                    onClick={() => navigate("#blogpost-likes")}
                                />
                            </li>
                        </ul>
                    </menu>
                    <Tab
                        className="px-2"
                        arrOfTab={[
                            {
                                id: "blogpost-comments",
                                tab: <Blogpostcomments
                                    blogpost={blogpost}
                                    comments={comments}
                                    setComments={setComments}
                                    autoViewComment={autoViewComment}
                                    autoViewLike={autoViewLike}
                                />
                            },
                            {
                                id: "blogpost-likes",
                                tab: <Blogpostlikes
                                    likes={blogpost.likes || []}
                                    autoViewLike={autoViewLike}
                                />
                            },
                        ]}
                    />
                </> :
                null
        }
    </>;
};

export default Displayblogpost;
