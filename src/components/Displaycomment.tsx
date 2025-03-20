import { useEffect, useState } from "react";
import commentProps from "../types/comment.type";
import postProps from "../types/post.type";
import Displayuserinfor from "./Displayuserinfor";
import userProps from "../types/user.type";
import Comment from "./Comment";
import Like from "./Likecomment";
import { MdDeleteOutline } from "react-icons/md";
import { useAppSelector } from "../redux";
import Displaylike from "./Displaylike";

type Props = {
    blogpost: postProps;
    replyId: string | null;
    comment: commentProps;
    setComments: React.Dispatch<React.SetStateAction<commentProps[]>>;
};

interface commentuiProps extends Props {
    isParentComment: boolean;
    toggleChildTab: string;
    setToggleChildTab: React.Dispatch<React.SetStateAction<string>>;
}

const Commentui = ({
    blogpost,
    replyId = null,
    comment,
    setComments,
    toggleChildTab,
    setToggleChildTab,
    isParentComment,
}: commentuiProps) => {
    const { data: User } = useAppSelector(
        (state) => state.userProfileSlices.userProfile
    );
    const [likes, setLikes] = useState<string[]>([]);
    const [viewReplyLikes, setViewReplyLikes] = useState(false);

    const [authorData, setAuthorData] = useState<userProps | null>(null);

    const handleFetchAuthorData = (userName: string) => {
        const data = { userName } as userProps;
        setAuthorData(data);
    };

    const handleDeleteComment = (deletedComment: commentProps) => {
        const Comments = JSON.parse(
            localStorage.getItem("comments") || "[]"
        ) as commentProps[];
        localStorage.setItem(
            "comments",
            JSON.stringify(
                Comments.filter((comment) => comment._id !== deletedComment._id)
            )
        );
        setComments((pre) => {
            if (deletedComment.replyId === null) {
                /* it a parent comment */
                return pre.filter((comment) => comment._id !== deletedComment._id);
            } else if (deletedComment.replyId !== null) {
                /* it a child comment */
                return pre.map((parentComment) => {
                    if (parentComment._id === deletedComment.replyId) {
                        return {
                            ...parentComment,
                            children: (parentComment.children || []).filter(
                                (childComment) => childComment._id !== deletedComment._id
                            ),
                        };
                    } else {
                        /* call a recursive function if need */
                        return parentComment;
                    }
                });
            } else {
                return pre;
            }
        });
    };

    useEffect(() => {
        if (comment.author) {
            handleFetchAuthorData(comment.author);
        }
    }, [comment.author]);

    return (
        <div className="p-1">
            {authorData ? (
                <Displayuserinfor short={true} user={authorData} onClick={() => { }} />
            ) : (
                <span>loading...</span>
            )}
            <span className="font-text text-base break-words hyphens-auto">
                {comment.body.text}
            </span>
            <span className="flex items-center gap-6 p-2">
                {/* comment stat */}
                <button
                    id="reply-comment-btn"
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Comment
                        blogpost={blogpost}
                        parentComment={comment}
                        replyId={replyId}
                        replying={[...comment.replingTo, comment.author]}
                        setComments={setComments}
                        callBack={() => setToggleChildTab("comments")}
                    />
                    {isParentComment ? (
                        <span onClick={() => setToggleChildTab("comments")}>
                            {(comment.children && comment.children.length) || 0}
                        </span>
                    ) : null}
                </button>
                <button
                    id="like-btn"
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Like comment={comment} setCommentLikes={setLikes} />
                    <span
                        onClick={() => {
                            if (isParentComment) {
                                setToggleChildTab("likes");
                            } else {
                                setViewReplyLikes(true);
                            }
                        }}
                    >
                        {(likes && likes.length) || 0}
                    </span>
                </button>
                {comment.author === User.userName ||
                    blogpost.author === User.userName ? (
                    <button
                        id="delete-comment-btn"
                        className="cursor-pointer"
                        onClick={() => handleDeleteComment(comment)}
                    >
                        <MdDeleteOutline size={16} />
                    </button>
                ) : null}
            </span>
            {(likes && likes.length && toggleChildTab === "likes") ||
                viewReplyLikes ? (
                <div className="pl-4">
                    <div className="border-l-2 p-3 shadow-inner">
                        <span className="block text-base text-slate-800 font-text font-semibold mb-3">
                            Likes
                        </span>
                        {/* display list of users that like comment */}
                        {likes && likes.length ? (
                            likes.map((like) => <Displaylike key={like} userName={like} />)
                        ) : (
                            <span className="text-sm text-slate-600 font-text">
                                Be the first to like this post
                            </span>
                        )}
                    </div>
                    <span className="flex justify-center items-center mt-4">
                        <button
                            className="text-sm text-slate-500 font-text cursor-pointer"
                            onClick={() => {
                                if (isParentComment) {
                                    setToggleChildTab("");
                                } else {
                                    setViewReplyLikes(false);
                                }
                            }}
                        >
                            Close likes
                        </button>
                    </span>
                </div>
            ) : null}
        </div>
    );
};

const Displaycomment = ({
    blogpost,
    replyId = null,
    comment,
    setComments,
}: Props) => {
    const [toggleChildTab, setToggleChildTab] = useState("");

    return (
        <>
            {comment.children && comment.children.length ? (
                <div id="comment-with-children">
                    <Commentui
                        blogpost={blogpost}
                        replyId={replyId}
                        comment={comment}
                        setComments={setComments}
                        toggleChildTab={toggleChildTab}
                        setToggleChildTab={setToggleChildTab}
                        isParentComment={true}
                    />
                    {!toggleChildTab ? (
                        <span className="flex justify-center items-center">
                            <button
                                className="text-sm text-slate-500 font-text cursor-pointer"
                                onClick={() => setToggleChildTab("comments")}
                            >
                                {comment.children.length > 1
                                    ? `View ${comment.children.length} replies`
                                    : "View  1 reply"}
                            </button>
                        </span>
                    ) : null}
                    {toggleChildTab === "comments" ? (
                        <div className="pl-4">
                            <div className="border-l-2 p-3  shadow-inner">
                                {/* display replies */}
                                <span className="block text-base text-slate-800 font-text font-semibold mb-3">
                                    Replies
                                </span>
                                {comment.children.map((chiidComment) => (
                                    <Commentui
                                        key={chiidComment._id}
                                        blogpost={blogpost}
                                        replyId={replyId}
                                        comment={chiidComment}
                                        setComments={setComments}
                                        toggleChildTab={toggleChildTab}
                                        setToggleChildTab={setToggleChildTab}
                                        isParentComment={false}
                                    />
                                ))}
                            </div>
                            {toggleChildTab ? (
                                <span className="flex justify-center items-center mt-4">
                                    <button
                                        className="text-sm text-slate-500 font-text cursor-pointer"
                                        onClick={() => setToggleChildTab("")}
                                    >
                                        Close replies
                                    </button>
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            ) : (
                <Commentui
                    blogpost={blogpost}
                    replyId={replyId}
                    comment={comment}
                    setComments={setComments}
                    toggleChildTab={toggleChildTab}
                    setToggleChildTab={setToggleChildTab}
                    isParentComment={true}
                />
            )}
        </>
    );
};

export default Displaycomment;
