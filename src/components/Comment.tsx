import { FaRegComments } from "react-icons/fa";
import postProps from "../types/post.type";
import { useEffect, useRef, useState } from "react";
import commentProps from "../types/comment.type";
import useDialog from "../hooks/useDialog";
import useSendNotification from "../hooks/useSendNotification";
import useTrimWords from "../hooks/useTrimWords";
import axios from "axios";
import Displayscreenloading from "./loaders/Displayscreenloading";
import { useAppSelector } from "../redux";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
    blogpost: postProps,
    replyId: string | null
    parentComment: commentProps | null
    replying: string[]
    setComments: React.Dispatch<React.SetStateAction<commentProps[] | null>>
    callBack?: (comment: commentProps) => void;
};

const Comment = ({ blogpost, replyId = null, parentComment, replying, setComments, callBack = () => null }: Props) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const [loading, setLoading] = useState(false);
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

    const addComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let newComment: commentProps | null = null;
        try {
            const data: commentProps = {
                _id: "",
                author: User.userName,
                postId: blogpost._id!,
                replyId,
                body: { _html: "", text: commentBody },
                url_leading_to_comment_parent: handleCommentUrl(),
                replyingTo: replying,
                likes: []
            };
            const url = apiEndPont + "/comment";
            const res = await axios.post(url, data, {
                baseURL: apiEndPont,
                withCredentials: true
            });
            newComment = await res.data.data as commentProps;

            setComments(pre => {
                if (!pre) return pre;

                if (newComment &&
                    newComment.replyId === null) {
                    /* it a parent comment */
                    return [newComment, ...pre];
                } else {
                    /* it a child comment */
                    return pre.map(parentComment => {
                        if (newComment &&
                            newComment.replyId === parentComment._id) {
                            return { ...parentComment, children: [newComment, ...(parentComment.children || [])] };
                        } else {
                            /* call a recursive function if need */
                            return parentComment;
                        }
                    });
                }
            });
            setCommentBody("");
            callBack(newComment);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            handleDialog();
        }

        if (!newComment) return;
        /* Send notification call when a friend comment on a user post or comment */
        if (replyId && parentComment) {
            sendNotification({
                type: "commented",
                from: newComment.author,
                targetTitle: trim(parentComment.body.text, 20),
                options: {
                    type: "reply-comment",
                    parentCommentId: replyId,
                    targetCommentId: newComment._id
                },
                to: parentComment.author,
                message: `replyed to your comment, ${trim(parentComment.body.text, 20)}`,
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
                to: blogpost.author!,
                message: `commented on, ${blogpost.title}`,
                checked: false,
                url: blogpost.author + "/" + blogpost.slug + "/#blogpost-comments",
            });
        }

    };

    const handleAutoResizeTextareOnkeydown = () => {
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
        window.addEventListener("keydown", handleAutoResizeTextareOnkeydown);
    }, []);

    return (<>
        <FaRegComments
            size={!replyId ? 22 : 18}
            onClick={handleDialog}
        />
        {dialog ?
            <div
                className="container fixed top-0 bottom-2 right-0 left-0 flex items-end z-50"
            >
                <form
                    className="relative flex-1 px-4 pt-4 pb-6 bg-white border rounded-2xl shadow-2xl"
                >
                    <span className="flex relative mb-6">
                        <span
                            className="absolute top-0 right-0 text-base text-slate-500 font-text cursor-pointer"
                            onClick={handleDialog}
                        >
                            x
                        </span>
                        <span className="block font-sec text-slate-600 text-xl font-semibold text-start">
                            {replyId ? "Reply" : "Comment"}
                        </span>
                    </span>
                    <>
                        {replyId ?
                            <span className="flex gap-2 items-center bg-white mb-2">
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
                    </>
                    <span className="flex gap-4 items-center">
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
                        <input
                            type="button"
                            value={"Send"}
                            className="text-base font-text text-white bg-green-800 py-1.5 px-3 rounded-full shadow-sm shadow-green-100 cursor-pointer"
                            onClick={addComment}
                        />
                    </span>
                </form>
            </div> :
            null
        }
        <Displayscreenloading loading={loading} />
    </>
    );
};

export default Comment;

