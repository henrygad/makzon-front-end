import { useState } from "react";
import postProps from "../types/post.type";
import { SlLike } from "react-icons/sl";
import { useAppSelector } from "../redux";
import useSendNotification from "../hooks/useSendNotification";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;


type Props = {
    blogpost: postProps,
    updateBlogpost: ({ type, blogpost }: { type: "EDIT", blogpost: postProps } | { type: "DELETE", blogpost: { _id: string } }) => void;
}

const Likeblogpost = ({ blogpost, updateBlogpost }: Props) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const [animateLikeBtn, setAnimateLikeBtn] = useState(false);

    const sendNotification = useSendNotification();

    const like = async(_id: string, userName: string) => {
        try {
            const url = apiEndPont + "/post/partial/" + _id;            
            const data: postProps = {
                ...blogpost,
                likes: [userName, ...(blogpost.likes || [])]
            };
            
            const res = await axios.patch(url, data, {
                baseURL: apiEndPont,
                withCredentials: true
            });
            const likedBlogpost: postProps = await res.data.data;
            updateBlogpost({ blogpost: likedBlogpost, type: "EDIT" });            
        } catch (error) {
            console.error(error);
        }
        
        // when use commented or reply to a comment send notification
        sendNotification({
            type: "liked",
            from: userName,
            targetTitle: blogpost.title,
            options: {
                type: "blogpost-like",                           
            },
            to: blogpost.author || "",
            message: `liked your blogpost, ${blogpost.title}`,
            checked: false,
            url: blogpost.author + "/" + blogpost.slug + "#blogpost-likes",
        });
    };

    const unLike = async (_id: string, userName: string) => {       

        try {
            const url = apiEndPont + "/post/partial/" + _id;
            const data = {
                ...blogpost,
                likes: (blogpost.likes || []).filter(like => like !== userName)
            };
            const res = await axios.patch(url, data, {
                baseURL: apiEndPont,
                withCredentials: true
            });
            const unLikedBlogpost: postProps = await res.data.data;
            updateBlogpost({ blogpost: unLikedBlogpost, type: "EDIT" });            
        } catch (error) {
            console.error(error);
        }
       
    };

    const handleBlogpostLiking = (_id: string, userName: string) => {
        if (blogpost.likes &&
            blogpost.likes.includes(User.userName)) {
            unLike(_id, userName);
        } else {
            like(_id, userName);
        }
        setAnimateLikeBtn(true);

        setTimeout(() => {
            setAnimateLikeBtn(false);
        }, 100);
    };

    return (
        <SlLike
            size={20}
            className={`
                   relative transition-all
                   ${animateLikeBtn ? "-translate-y-1" : "translate-y-0"} 
                   ${blogpost.likes && blogpost.likes.includes(User.userName) ? "text-pink-600" : ""} 
                `}
            onClick={() => handleBlogpostLiking(blogpost._id || "", User.userName)}
        />
    );
};

export default Likeblogpost;

