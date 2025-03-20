import { useEffect, useState } from "react";
import postProps from "../types/post.type";
import { SlLike } from "react-icons/sl";
import { useAppSelector } from "../redux";


type Props = {
    blogpost: postProps,
    updateBlogpost: ({ type, blogpost }: { type: "EDIT", blogpost: postProps } | { type: "DELETE", blogpost: { _id: string } }) => void;
}

const Likeblogpost = ({ blogpost, updateBlogpost }: Props) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const [isLiked, setIsLiked] = useState<boolean>((blogpost.likes || []).includes(User.userName));
    const [animateLikeBtn, setAnimateLikeBtn] = useState(false);

    const like = (_id: string, userName: string) => {
        const updatedBlogpost = {
            ...blogpost,
            likes: [userName, ...(blogpost.likes || [])]
        };
        const Blogposts: postProps[] = JSON.parse(localStorage.getItem("blogposts") || "[]");
        localStorage.setItem("blogposts", JSON.stringify(Blogposts.map(
            (blogpost: postProps) => blogpost._id === _id ? { ...updatedBlogpost } : blogpost
        )));
        updateBlogpost({blogpost: updatedBlogpost,  type: "EDIT"});
        setIsLiked(true);
    };

    const unLike = (_id: string, userName: string) => {
        const updatedBlogpost = {
            ...blogpost,
            likes: (blogpost.likes || []).filter(like => like !== userName)
        };

        const Blogposts: postProps[] = JSON.parse(localStorage.getItem("blogposts") || "[]");
        localStorage.setItem("blogposts", JSON.stringify(Blogposts.map(
            (blogpost: postProps) => blogpost._id === _id ? { ...updatedBlogpost } : blogpost
        )));
        updateBlogpost({ blogpost: updatedBlogpost, type: "EDIT" });
        setIsLiked(false);
    };

    const handleBlogpostLiking = (_id: string, userName: string) => {
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
        if (blogpost?.likes &&
            blogpost.likes.length
        ) {
            setIsLiked(blogpost.likes.includes(User.userName));
        }
    }, [blogpost?.likes, User]);

    return (
        <SlLike
            size={20}
            className={`
                   relative transition-all
                   ${animateLikeBtn ? "-translate-y-1" : "translate-y-0"} 
                   ${isLiked ? "text-pink-600" : ""} 
                `}
            onClick={() => handleBlogpostLiking(blogpost._id || "", User.userName)}
        />
    );
};

export default Likeblogpost;

