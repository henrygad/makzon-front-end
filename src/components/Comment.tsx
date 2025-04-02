import { FaRegComments } from "react-icons/fa";
import postProps from "../types/post.type";
import { useEffect, useRef, useState } from "react";
import commentProps from "../types/comment.type";
import { useAppSelector } from "../redux";
import useDialog from "../hooks/useDialog";
import useSendNotification from "../hooks/useSendNotification";
import useTrimWords from "../hooks/useTrimWords";

type Props = {
    blogpost: postProps,
    replyId: string | null
    parentComment: commentProps | null
    replying: string[]
    setComments: React.Dispatch<React.SetStateAction<commentProps[]>>
    callBack?: (comment: commentProps) => void;
};

const Comment = ({ blogpost, replyId = null, parentComment, replying, setComments, callBack = () => null }: Props) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const [commentBody, setCommentBody] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const { dialog, handleDialog } = useDialog();

    const sendNotification = useSendNotification();

    const trim = useTrimWords();

    const handleCommentUrl = () => {
        if (replyId && parentComment) {
            return parentComment.url_leading_to_comment_parent.trim() + "/" + parentComment._id;
        } else {
            return "";
        }
    };

    const addComment = (e: React.FormEvent) => {
        e.preventDefault();
        const newComment: commentProps = {
            _id: Date.now().toString(),
            postId: blogpost._id || "",
            replyId,
            author: User.userName,
            body: { _html: "", text: commentBody },
            url_leading_to_comment_parent: handleCommentUrl(),
            replingTo: replying,
            likes: []
        };

        const Comments: postProps[] = JSON.parse(localStorage.getItem("comments") || "[]");
        localStorage.setItem("comments", JSON.stringify([newComment, ...Comments]));
        setComments(pre => {
            if (newComment.replyId === null) {
                /* it a parent comment */
                return [newComment, ...pre];
            } else if (newComment.replyId !== null) {
                /* it a child comment */
                return pre.map(parentComment => {
                    if (parentComment._id === newComment.replyId) {
                        return { ...parentComment, children: [newComment, ...(parentComment.children || [])] };
                    } else {
                        /* call a recursive function if need */
                        return parentComment;
                    }
                });
            } else {
                return pre;
            }

        });
        setCommentBody("");
        handleDialog();
        callBack(newComment);

        if (replyId) {
            sendNotification({
                type: "commented",
                from: newComment.author,
                targetTitle: trim(parentComment?.body.text || "", 20),
                options: {
                    type: "reply-comment",
                    parentCommentId: replyId,
                    targetCommentId: newComment._id
                },
                to: parentComment?.author || "",
                message: `replyed to your comment, ${trim(parentComment?.body.text || "", 20)}`,
                checked: false,
                url: blogpost.author + "/" + blogpost.slug + "/#blogpost-comments",
            });
        } else {
            sendNotification({
                type: "commented",
                from: newComment.author,
                targetTitle: blogpost.title,
                options: {
                    type: "blogpost-comment",
                    parentCommentId: null,
                    targetCommentId: newComment._id
                },
                to: blogpost.author || "",
                message: `commented on, ${blogpost.title}`,
                checked: false,
                url: blogpost.author + "/" + blogpost.slug + "/#blogpost-comments",
            });
        }

    };

    const handleResizeTextArea = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = (textAreaRef.current.scrollHeight).toString() + "px";
            textAreaRef.current.style.maxHeight = "120px";
            if (parseFloat(textAreaRef.current.style.height) >= 120) {
                textAreaRef.current.style.overflowY = "auto";
            } else {
                textAreaRef.current.style.overflowY = "hidden";
            }
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleResizeTextArea);
    }, []);

    return (<>
        <FaRegComments
            size={!replyId ? 22 : 18}
            onClick={handleDialog}
        />
        {dialog ?
            <div
                className="container fixed top-0 bottom-0 right-0 left-0 flex items-end z-50"
            >
                <form
                    className="relative flex-1 flex items-end gap-4 pt-2  pb-6 px-6 bg-white border rounded-md shadow-2xl"
                >
                    <span
                        className="absolute top-2 right-6 text-sm text-slate-500 font-text cursor-pointer"
                        onClick={handleDialog}
                    >
                        x
                    </span>
                    <span className="w-full space-y-3">
                        <span className="block font-sec text-slate-600 text-base font-semibold text-start">
                            {replyId ? "Reply" : "Comment"}
                        </span>
                        {replyId ?
                            <span className="w-full flex gap-2 items-center bg-white">
                                <span className="text-sm font-text text-slate-600">Replying to</span>
                                <span className="flex flex-wrap gap-1 text-sm font-text text-slate-600 font-semibold">
                                    {
                                        replying &&
                                            replying.length ?
                                            replying.map(reply =>
                                                <span key={reply}>{reply}</span>
                                            ) :
                                            null
                                    }
                                </span>
                            </span> :
                            null
                        }
                        <textarea
                            ref={textAreaRef}
                            name="comemnt-text-area"
                            id="comemnt-text-area"
                            autoCapitalize="true"
                            autoComplete="false"
                            autoSave="false"
                            autoFocus={true}
                            placeholder="Add comment"
                            value={commentBody}
                            onChange={(e) => setCommentBody(e.target.value)}
                            className="block text-base font-text font-normal break-words hyphens-auto w-full h-[40px] px-4 py-2 border border-slate-800 rounded-2xl shadow-md resize-none overflow-y-hidden"
                        ></textarea>
                    </span>
                    <input
                        type="button"
                        value={"Send"}
                        className="text-base font-text text-white bg-green-800 py-1.5 px-4 rounded-full shadow-sm shadow-green-100 cursor-pointer"
                        onClick={addComment}
                    />
                </form>
            </div> :
            null
        }
    </>
    );
};

export default Comment;

