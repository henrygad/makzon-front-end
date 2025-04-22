import { useLocation, useParams } from "react-router-dom";
import postProps from "../types/post.type";
import Displayblogpost from "../components/Displayblogpost";
import { useEffect, useState } from "react";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type viewTargetNotificationProps = {
    autoViewComment?: {
        blogpostParentComment: string | null,
        targetComment: string,
    },
    autoViewLike?: {
        comment?: {
            blogpostParentComment: string | null,
            targetComment: string,
        }
        targetLike: string
    }
} | undefined

const Blogpost = () => {
    const { author, slug } = useParams();
    const location = useLocation();    

    const [viewTargetNotification, setViewTargetNotification] = useState<viewTargetNotificationProps>(undefined);
    const [blogpost, setBlogpost] = useState<postProps | null>(null);    

    useEffect(() => {
        if (!author || !slug) return;
        // Fetch a single blogpost
        axios(apiEndPont + "/post/" + author + "/" + slug, {
            withCredentials: true,
            baseURL: apiEndPont
        })
            .then(async (res) => {
                const singleBlogpost: postProps = await res.data.data;
                setBlogpost(singleBlogpost);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [author, slug]);

    useEffect(() => {
        if (location.state) {
            setViewTargetNotification(location.state as viewTargetNotificationProps);
        }
    }, [location.state]);

    return (
        <main className="container">
            <div className="space-y-8">
                {blogpost? (
                    blogpost.status.toLowerCase() === "published" ? (
                        <Displayblogpost
                            displayType="_HTML"
                            blogpost={blogpost}                            
                            updateBlogpost={({ blogpost, type }) => {
                                if (type === "EDIT") {
                                    setBlogpost((pre) => ({ ...pre, ...blogpost }));
                                } else if (type === "DELETE") {
                                    setBlogpost(null);
                                }
                            }}
                            autoViewComment={viewTargetNotification &&
                                viewTargetNotification.autoViewComment}
                            autoViewLike={viewTargetNotification && viewTargetNotification.autoViewLike}
                        />
                    ) : (
                        <span>This blogpost has been unpublish</span>
                    )
                ) : (
                    <div>loading...</div>
                )}
            </div>
        </main>
    );
};

export default Blogpost;
