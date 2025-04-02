import { useEffect} from "react";
import postProps from "../types/post.type";
import { useAppSelector } from "../redux";
import { IoStatsChart } from "react-icons/io5";
import useSendNotification from "../hooks/useSendNotification";

type Props = {
    displayType: string,
    blogpostRef: React.MutableRefObject<HTMLElement | null>
    blogpost: postProps,
    updateBlogpost: ({ type, blogpost }: { type: "EDIT", blogpost: postProps } | { type: "DELETE", blogpost: { _id: string } }) => void;
};

const Viewblogpost = ({ displayType, blogpostRef, blogpost, updateBlogpost }: Props) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);

    const sendNotification = useSendNotification();

    const viewBlogpost = async (_id: string, sessionId: string) => {
        if (blogpost.views?.includes(sessionId)) {
            return;
        } else {
            const updatedBlogpost = {
                ...blogpost,
                views: [sessionId, ...(blogpost.views || [])]
            };
            const Blogposts: postProps[] = JSON.parse(localStorage.getItem("blogposts") || "[]");
            localStorage.setItem("blogposts", JSON.stringify(Blogposts.map(
                (blogpost: postProps) => blogpost._id === _id ? { ...updatedBlogpost } : blogpost
            )));
            updateBlogpost({ blogpost: updatedBlogpost, type: "EDIT" });

            if (updatedBlogpost.views.length === 101) {
                sendNotification({
                    type: "viewed",
                    from: "Makzon",
                    to: blogpost.author || "",
                    message: `${updatedBlogpost.views.length}+ have viewed your blogpost, ${blogpost.title || ""}`,
                    checked: false,
                    url: blogpost.author + "/" + blogpost.slug + "#blogpost-views",
                });                
            }
        }

    };

    const handleOnMouseHover = (e: MouseEvent | TouchEvent, _id: string, sessionId: string) => {
        if (blogpostRef.current &&
            blogpostRef.current.contains(e.target as Node)
        ) {
            const clear = setTimeout(() => {
                viewBlogpost(_id, sessionId);
                clearTimeout(clear);
            }, 1000);
        }
    };

    const handleMount = (_id: string, sessionId: string) => {
        const clear = setTimeout(() => {
            viewBlogpost(_id, sessionId);
            clearTimeout(clear);
        }, 1000);
     };

    useEffect(() => {
        if (blogpostRef.current && 
            blogpost._id &&
            (User.sessionId || User.userName)
        ) {

            if (displayType.trim().toLowerCase() === "_html") {
                handleMount(blogpost._id, User.sessionId || User.userName);                
            }

            blogpostRef.current.addEventListener("mouseenter", (e) => handleOnMouseHover(e, blogpost._id || "", User.sessionId || User.userName));
            blogpostRef.current.addEventListener("mouseleave", (e) => handleOnMouseHover(e, blogpost._id || "", User.sessionId || User.userName));
            blogpostRef.current.addEventListener("touchmove", (e) => handleOnMouseHover(e, blogpost._id || "", User.sessionId || User.userName));
        }       
    }, [blogpostRef, blogpost._id, User.sessionId, User.userName, displayType]);


    return <IoStatsChart size={16} />;
};

export default Viewblogpost;
