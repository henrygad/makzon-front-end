import { useParams } from "react-router-dom";
import Headernav from "../sections/Headernav";
import Footernav from "../sections/Footernav";
import postProps from "../types/post.type";
import Displayblogpost from "../components/Displayblogpost";
import { useEffect, useState } from "react";

const Blogpost = () => {
    const { author, slug } = useParams();

    const [blogpost, setBlogpost] = useState<postProps | null>(null);

    const handleFetchBlogpost = (author: string, slug: string) => {
        const Blogposts = JSON.parse(localStorage.getItem("blogposts") || "[]") as postProps[];
        const getBlogpost = Blogposts.find(blogpost =>
            blogpost.author?.trim() === author.trim() &&
            blogpost.slug?.trim() === slug.trim()) as postProps;
        if (getBlogpost) {
            setBlogpost(getBlogpost);
        } else {
            setBlogpost(null);
        }
    };

    useEffect(() => {
        if (author?.trim() && slug?.trim()) {
            handleFetchBlogpost(author, slug);
        }
    }, [author, slug]);

    return (
        <>
            <Headernav />
            <main className="container">
                <div className="space-y-8">
                    {blogpost ? (
                        blogpost.status.toLowerCase() === "published" ? (
                            <Displayblogpost
                                displayType="_HTML"
                                blogpost={blogpost}
                                updateBlogpost={({ blogpost, type }) => {
                                    if (type === "EDIT") {
                                        setBlogpost(pre => ({ ...pre, ...blogpost }));
                                    } else if (type === "DELETE") {
                                        setBlogpost(null);
                                    }
                                }}
                            />
                        ) : (
                            <span>This blogpost has been unpublish</span>
                        )
                    ) : (
                        <div>loading...</div>
                    )}
                </div>
            </main>
            <Footernav />
        </>
    );
};

export default Blogpost;
