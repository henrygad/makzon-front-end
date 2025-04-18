import { SlLike } from "react-icons/sl";
import commentProps from "../types/comment.type";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux";
import useSendNotification from "../hooks/useSendNotification";
import postProps from "../types/post.type";
import useTrimWords from "../hooks/useTrimWords";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

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

    const like = async (comment: commentProps, userName: string) => {
        try {
            const url = apiEndPont + "/comment/" + comment._id;
            const data: commentProps = { ...comment, likes: [userName, ...(comment.likes || [])] };
            await axios.patch(url, data, {
                withCredentials: true,
                baseURL: apiEndPont
            });
            setCommentLikes(pre => ([userName, ...pre]));
            setIsLiked(true);
        } catch (error) {
            console.error(error);            
        }

        let options: unknown;
        let targetTitle: string;

        // when use like comment send notification
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

    const unLike =async (comment: commentProps, userName: string) => {
        try {
            const url = apiEndPont + "/comment/" + comment._id;
            const data: commentProps = { ...comment, likes: (comment.likes || []).filter(like => like !== userName) };
            await axios.patch(url, data, {
                withCredentials: true,
                baseURL: apiEndPont
            });
            setCommentLikes(pre => pre.filter(like => like !== userName));
            setIsLiked(false);
        } catch (error) {
            console.error(error);
        }
              
    };

    const handleCommentLiking = (comment: commentProps, userName: string) => {
        if (isLiked) {
            unLike(comment, userName);
        } else {
            like(comment, userName);
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
            onClick={() => handleCommentLiking(comment || "", User.userName)}
        />
    );
};

export default Likecomment;
