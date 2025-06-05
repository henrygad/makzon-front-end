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
import Displayscreenloading from "../loaders/Displayscreenloading";
import Saveblogpost from "./Saveblogpost";
import useDateFormat from "../hooks/useDateFormat";
import useAutoNavigate from "../hooks/useAutoNavigate";
import { GrView } from "react-icons/gr";
import { TbMessageReport } from "react-icons/tb";
import {
    MdBlockFlipped,
    MdOutlineDelete,
    MdOutlineUnpublished,
    MdPublishedWithChanges,
} from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
    displayType: string;
    blogpost: postProps;
    updateBlogpost: ({
        type,
        blogpost,
    }:
        | { type: "EDIT"; blogpost: postProps }
        | { type: "DELETE"; blogpost: { _id: string } }) => void;
    autoViewComment?: {
        blogpostParentComment: string | null;
        targetComment: string;
    };
    autoViewLike?: {
        comment?: {
            blogpostParentComment: string | null;
            targetComment: string;
        };
        targetLike: string;
    };
};

const Displayblogpost = ({
    displayType,
    blogpost,
    updateBlogpost,
    autoViewComment,
    autoViewLike,
}: Props) => {
    const navigate = useNavigate();
    const { data: User } = useAppSelector(
        (state) => state.userProfileSlices.userProfile
    );


    // fetch author details
    const url = apiEndPont + "/user/" + blogpost.author;
    const { data: authorInfor } = useQuery<userProps>({
        queryKey: ["author", blogpost.author],
        queryFn: () => axios.get(url, { withCredentials: true, baseURL: apiEndPont }).then(res => res.data.data),
        //keepPreviousData: true,
        enabled: !!blogpost.author, // Prevent fetch if undefined
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    
    const [comments, setComments] = useState<commentProps[] | null>(null);
    const blogpostRef = useRef<HTMLDivElement | null>(null);
    const tabRef = useRef<HTMLDivElement | null>(null);

    const sanitize = useSanitize();
    const dateFormat = useDateFormat();
    const autoNavigate = useAutoNavigate();

    const [loading, setLoading] = useState(false);


    const publicBlogpostMenus = [
        {
            name: "View post",
            icon: <GrView size={18} />,
            func: () => {
                handleToView(blogpost);
            },
        },
        {
            name: "Report",
            icon: <TbMessageReport size={18} />,
            func: () => console.log("Report"),
        },
        {
            name: "Block",
            icon: <MdBlockFlipped size={18} />,
            func: () => console.log("Block"),
        },
    ];

    const privateBlogpostMenu = [
        {
            name: "Edit",
            icon: <FiEdit size={18} />,
            func: () => {
                handleToEdit(blogpost);
            },
        },
        {
            name: blogpost.status === "published" ? "Unpublish" : "publish",
            icon:
                blogpost.status === "published" ? (
                    <MdOutlineUnpublished size={18} />
                ) : (
                    <MdPublishedWithChanges size={18} />
                ),
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
            icon: <MdOutlineDelete size={18} />,
            func: () => handleDelete(blogpost._id || ""),
        },
    ];

    const handleToView = (blogpost: postProps, hashId: string | null = null) => {
        if (displayType.trim().toLowerCase() === "_html") return;
        const url =
            "/post/" +
            blogpost.author +
            "/" +
            blogpost.slug +
            (hashId ? "/#" + hashId : "");
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
                withCredentials: true,
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
                withCredentials: true,
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
                withCredentials: true,
            });
            updateBlogpost({ blogpost: { _id }, type: "DELETE" });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!blogpost._id) return;
        const url =
            apiEndPont +
            "/comment?postId=" +
            blogpost._id +
            "&replyId=null&skip=0&limit=20";
        axios(url, {
            baseURL: apiEndPont,
            withCredentials: true,
        })
            .then(async (res) => {
                const parentComments: commentProps[] = await res.data.data;
                setComments(parentComments);

                // fetch children comment
                parentComments.forEach((comment) => {
                    const url =
                        apiEndPont + "/comment?replyId=" + comment._id + "&skip=0&limit=20";
                    axios(url, {
                        baseURL: apiEndPont,
                        withCredentials: true,
                    })
                        .then(async (res) => {
                            const childComment = await res.data.data;
                            setComments((parentCom) =>
                                parentCom
                                    ? parentCom.map((com) => ({ ...com, children: childComment }))
                                    : parentCom
                            );
                        })
                        .catch((err) => console.error(err));
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }, [blogpost._id]);

    useEffect(() => {
        // Auto navigate to comment or like tab if hashId is present in the URL
        const hashId = location.hash.trim().slice(1);
        const tabId = ["blogpost-comments", "blogpost-likes"];
        if (hashId && tabId.includes(hashId) && blogpost && tabRef.current) {
            const clear = setTimeout(() => {
                autoNavigate(tabRef.current!);
                clearTimeout(clear);
            }, 100);
        }
    }, [location.hash, blogpost, tabRef.current]);

    return (
        <>
            <div ref={blogpostRef} className="space-y-1 p-2 rounded-md">
                {/* author info and side menu */}
                <span className="flex items-start justify-between gap-6">
                    <Displayuserinfor
                        short={true}
                        user={authorInfor}
                        onClick={() => navigate("/profile/" + authorInfor?.userName)}
                    />
                    <Dropmenu
                        children={
                            <ul className="min-w-[140px] text-sm  text-slate-700 font-text pl-5 pr-8 py-5 space-y-6 rounded-md border bg-white ">
                                {(blogpost.author && blogpost.author.trim() === User.userName
                                    ? [...privateBlogpostMenu, ...publicBlogpostMenus]
                                    : publicBlogpostMenus
                                ).map((menu) =>
                                    displayType === "_HTML" &&
                                        menu.name === "View post" ? null : (
                                        <li
                                            key={menu.name}
                                            className="flex gap-2 cursor-pointer"
                                            onClick={(e) => {
                                                menu.func();
                                                e.stopPropagation();
                                            }}
                                        >
                                            {menu.icon}{" "}
                                            <span className="text-nowrap whitespace-pre">
                                                {menu.name}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        }
                    />
                </span>
                <article className="font-text text-base">
                    {/* post date */}
                    <span className="block font-text text-xs text-slate-900 font-medium pl-2 py-1">
                        <span className="block">
                            Posted {dateFormat(blogpost.createdAt!)}
                        </span>
                    </span>
                    {/* list catigories */}
                    <span className="block text-sm font-text font-medium text-slate-500 pb-4">
                        <ul className="flex flex-wrap items-center gap-x-1 ">
                            {blogpost.catigories && blogpost.catigories.length
                                ? blogpost.catigories.map((catigory, index) =>
                                    catigory.trim() ? (
                                        <li key={index} className="flex items-center ">
                                            {index > 0 ? (
                                                <span className="font-extralight text-slate-900">
                                                    /
                                                </span>
                                            ) : null}{" "}
                                            {catigory}
                                        </li>
                                    ) : null
                                )
                                : null}
                        </ul>
                    </span>
                    {/* post article */}
                    <>
                        {displayType.toLowerCase() === "_html" ? (
                            <span
                                dangerouslySetInnerHTML={sanitize(blogpost._html.body || "")}
                            ></span>
                        ) : (
                            <span
                                className="break-words hyphens-auto line-clamp-3 cursor-pointer"
                                onClick={() => handleToView(blogpost)}
                            >
                                {blogpost.body}
                            </span>
                        )}
                    </>
                    {/* display post image */}
                    <>
                        {blogpost.image ? (
                            <Displayimage
                                url={apiEndPont + "/media/" + blogpost.image}
                                alt={blogpost.title}
                                useCancle={false}
                                parentClassName="w-full h-full mt-2"
                                className="w-full h-36 object-cover rounded cursor-pointer"
                                placeHolder={
                                    <img
                                        src={imgplaceholder}
                                        className="absolute top-0 bottom-0 right-0 left-0 object-cover w-full h-36"
                                        onClick={() => {
                                            if (displayType === "TEXT") {
                                                handleToView(blogpost);
                                            } else {
                                                navigate(
                                                    `?url=${blogpost.image}&type=image#single-image`
                                                );
                                            }
                                        }}
                                    />
                                }
                                onClick={() => {
                                    if (displayType === "TEXT") {
                                        handleToView(blogpost);
                                    } else {
                                        navigate(
                                            `?url=${apiEndPont + "/media/" + blogpost.image
                                            }&type=image#single-image`
                                        );
                                    }
                                }}
                            />
                        ) : null}
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
                        <span onClick={() => handleToView(blogpost, "blogpost-comments")}>
                            {comments && comments.length}
                        </span>
                    </button>
                    {/* like btn */}
                    <button
                        id="blogpost-like-btn"
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Likeblogpost blogpost={blogpost} updateBlogpost={updateBlogpost} />
                        <span onClick={() => handleToView(blogpost, "blogpost-likes")}>
                            {(blogpost?.likes && blogpost.likes.length) || 0}
                        </span>
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
                        <span>{(blogpost?.shares && blogpost.shares.length) || 0}</span>
                    </button>
                    {/* Save */}
                    <button
                        id="blogpost-save-btn"
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Saveblogpost User={User} blogpost={blogpost} />
                    </button>
                    {/* view btn */}
                    <span id="blogpost-view-btn" className="flex items-center gap-2">
                        <Viewblogpost
                            blogpostRef={blogpostRef}
                            displayType={displayType}
                            blogpost={blogpost}
                            updateBlogpost={updateBlogpost}
                        />
                        <span>{(blogpost?.views && blogpost.views.length) || 0}</span>
                    </span>
                </span>
            </div>
            {/* Only display on single post page */}
            <>
                {displayType.toLowerCase() === "_html" ? (
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
                            ref={tabRef}
                            className="w-full px-2"
                            arrOfTab={[
                                {
                                    id: "blogpost-comments",
                                    tab: (
                                        <Blogpostcomments
                                            blogpost={blogpost}
                                            comments={comments}
                                            setComments={setComments}
                                            autoViewComment={autoViewComment}
                                            autoViewLike={autoViewLike}
                                        />
                                    ),
                                },
                                {
                                    id: "blogpost-likes",
                                    tab: (
                                        <Blogpostlikes
                                            likes={blogpost.likes || []}
                                            autoViewLike={autoViewLike}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </>
                ) : null}
            </>
            <Displayscreenloading loading={loading} />
        </>
    );
};

export default Displayblogpost;
