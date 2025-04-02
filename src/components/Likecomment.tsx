import { SlLike } from "react-icons/sl";
import commentProps from "../types/comment.type";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux";
import useSendNotification from "../hooks/useSendNotification";
import postProps from "../types/post.type";
import useTrimWords from "../hooks/useTrimWords";

type Props = {
    blogpost: postProps
    comment: commentProps
    setCommentLikes: React.Dispatch<React.SetStateAction<string[]>>
};

const Likecomment = ({ blogpost, comment, setCommentLikes }: Props) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [animateLikeBtn, setAnimateLikeBtn] = useState(false);

    const sendNotification = useSendNotification();

    const trim = useTrimWords();

    const like = (_id: string, userName: string) => {
        const Comments: commentProps[] = JSON.parse(localStorage.getItem("comments") || "[]");
        localStorage.setItem("comments", JSON.stringify(Comments.map(
            (comment: commentProps) => comment._id === _id ? { ...comment, likes: [userName, ...(comment.likes || [])] } : comment
        )));
        setCommentLikes(pre => ([userName, ...pre]));
        setIsLiked(true);

        let options: unknown;
        let targetTitle: string;

        if (comment.replyId) {
            targetTitle = trim(comment?.body.text || "", 20);
            options = {
                type: "reply-comment-like",
                parentCommentId: comment.replyId,
                targetCommentId: comment._id
            };
        } else {
            targetTitle = trim(comment?.body.text || "", 20),
                options = {
                    type: "comment-like",
                    parentCommentId: null,
                    targetCommentId: comment._id
                };
        }
        sendNotification({
            type: "liked",
            from: userName,
            targetTitle,
            options,
            to: comment.author || "",
            message: `liked your comment, ${comment.body.text || ""}`,
            checked: false,
            url: blogpost.author + "/" + blogpost.slug + "/#blogpost-comments",
        });
    };

    const unLike = (_id: string, userName: string) => {
        const Comments: commentProps[] = JSON.parse(localStorage.getItem("comments") || "[]");
        localStorage.setItem("comments", JSON.stringify(Comments.map(
            (comment: commentProps) => comment._id === _id ? { ...comment, likes: (comment.likes || []).filter(like => like !== userName) } : comment
        )));
        setCommentLikes(pre => pre.filter(like => like !== userName));
        setIsLiked(false);
    };

    const handleCommentLiking = (_id: string, userName: string) => {
        if (isLiked) {
            unLike(_id, userName);
        } else {
            like(_id, userName);
        }
        setAnimateLikeBtn(true);

        setTimeout(() => {
            setAnimateLikeBtn(false);
        }, 100);
    };


    useEffect(() => {
        if (comment?.likes && comment.likes.length) {
            setCommentLikes(comment.likes);
            setIsLiked(comment.likes.includes(User.userName));
        }
    }, [comment?.likes, User]);

    return (
        <SlLike
            size={14}
            className={`
                relative transition-all
                ${animateLikeBtn ? "-translate-y-1" : "translate-y-0"} 
                ${isLiked ? "text-pink-600" : ""} 
             `}
            onClick={() => handleCommentLiking(comment._id || "", User.userName)}
        />
    );
};

export default Likecomment;
