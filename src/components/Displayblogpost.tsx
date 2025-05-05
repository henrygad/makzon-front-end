import { useEffect, useRef, useState } from "react";
import postProps from "../types/post.type";
import Displayuserinfor from "./Displayuserinfor";
import Dropmenu from "./Dropmenu";
import userProps from "../types/user.type";
import useSanitize from "../hooks/useSanitize";
import Displayimage from "./Displayimage";
import imgplaceholder from "../assets/imageplaceholder.svg";
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
import { useAppSelector } from "../redux";
import axios from "axios";
import Displayscreenloading from "./Displayscreenloading";
import Saveblogpost from "./Saveblogpost";
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

    const [authorInfor, setAuthorInfor] = useState<userProps | null>(null);
    const [comments, setComments] = useState<commentProps[] | null>(null);
    const blogpostRef = useRef<HTMLDivElement | null>(null);
    const sanitize = useSanitize();

    const [loading, setLoading] = useState(false);

    const publicBlogpostMenus = [
        {
            name: "View post",
            icon: <span>V</span>,
            func: () => {
                handleToView(blogpost);
            },
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

    const handleToView = (blogpost: postProps, hashId: string | null = null) => {
        if (displayType.trim().toLowerCase() === "_html") return;
        const url = "/" + blogpost.author + "/" + blogpost.slug + (hashId ? "/#" + hashId : "");
        navigate(url);
    };

    const handleToEdit = (blogpost: postProps) => {
        navigate("/createblogpost", { state: { blogpost } });
    };

    const handlePublish = async (blogpost: postProps) => {
        setLoading(true);
        try {
            const url = apiEndPont + "/post/partial/" + blogpost._id;
            const data: postProps = { ...blogpost, status: "published" };
            const res = await axios.patch(url, data, {
                baseURL: apiEndPont,
                withCredentials: true
            });
            const publishBlogpost = await res.data.data;

            updateBlogpost({ blogpost: publishBlogpost, type: "EDIT" });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(true);
        }

    };

    const handleUnpublish = async (blogpost: postProps) => {
        setLoading(true);
        try {
            const url = apiEndPont + "/post/partial/" + blogpost._id;
            const data: postProps = { ...blogpost, status: "unpublished" };
            const res = await axios.patch(url, data, {
                baseURL: apiEndPont,
                withCredentials: true
            });
            const unpublishBlogpost = await res.data.data;
            updateBlogpost({ blogpost: unpublishBlogpost, type: "EDIT" });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (_id: string) => {
        setLoading(true);
        try {
            const url = apiEndPont + "/post/" + _id;
            await axios.delete(url, {
                baseURL: apiEndPont,
                withCredentials: true
            });
            updateBlogpost({ blogpost: { _id }, type: "DELETE" });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch author short details
        const url = apiEndPont + "/user/" + blogpost.author;
        axios(url, {
            withCredentials: true,
            baseURL: apiEndPont
        })
            .then(async (res) => {
                const userInfor: userProps = await res.data.data;
                setAuthorInfor(userInfor);
            })
            .catch((error) =>
                console.error(error)
            );
    }, [blogpost.author]);

    useEffect(() => {
        if (!blogpost._id) return;
        const url = apiEndPont + "/comment?postId=" + blogpost._id + "&replyId=null&skip=0&limit=20";
        axios(url, {
            baseURL: apiEndPont,
            withCredentials: true
        })
            .then(async (res) => {
                const parentComments: commentProps[] = await res.data.data;
                setComments(parentComments);

                // fetch children comment
                parentComments.forEach((comment) => {
                    const url = apiEndPont + "/comment?replyId=" + comment._id + "&skip=0&limit=20";
                    axios(url, {
                        baseURL: apiEndPont,
                        withCredentials: true
                    })
                        .then(async (res) => {
                            const childComment = await res.data.data;
                            setComments(parentCom => parentCom ?
                                parentCom.map((com) => ({ ...com, children: childComment })) :
                                parentCom
                            );
                        })
                        .catch((err) =>
                            console.error(err)
                        );
                });
            })
            .catch(err => {
                console.error(err);
            });
    }, [blogpost._id]);

    return <>
        <div
            ref={blogpostRef}
            className="space-y-4 p-2 rounded-md"
        >
            {/* author info and side menu */}
            <span className="flex items-start justify-between gap-6">
                <Displayuserinfor
                    short={true}
                    user={authorInfor}
                    onClick={() => navigate("/profile/" + authorInfor?.userName)}
                />
                <Dropmenu
                    children={
                        <ul className="min-w-[140px] text-sm font-text p-4 space-y-3 rounded-md border bg-white ">
                            {
                                (blogpost.author &&
                                    blogpost.author.trim() === User.userName ?
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
            <article className="font-text text-base space-y-2">
                {/* post date */}
                <span className="flex gap-4 text-sm text-stone-700 font-sec">
                    <span>Post: 02 01 25; 11:00am</span>
                    <span>Updated: 03 01 25; 1:00pm</span>
                </span>
                {/* list catigoris */}
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
                {/* post article */}
                <>
                    {displayType.toLowerCase() === "_html" ?
                        <span dangerouslySetInnerHTML={sanitize(blogpost._html.body || "")}></span> :
                        <span
                            className="indent-2 break-words hyphens-auto line-clamp-3 cursor-pointer"
                            onClick={() => handleToView(blogpost)}
                        >
                            {blogpost.body}
                        </span>
                    }
                </>
                {/* display post image */}
                <>
                    {
                        blogpost.image ? (
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
            </article>
            {/* post stat */}
            <span className="flex justify-around gap-4">
                {/* comment btn */}
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
                {/* like btn */}
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
                {/* Save */}
                <button>
                    <Saveblogpost User={User} blogpost={blogpost} />
                </button>
                {/* share btn */}
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
                {/* view btn */}
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
        {/* Only display on single post page */}
        <>
            {
                displayType.toLowerCase() === "_html" ?
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
        </>
        <Displayscreenloading loading={loading} />
    </>;
};

export default Displayblogpost;
