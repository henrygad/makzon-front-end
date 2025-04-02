import Tab from "../components/Tab";
import Addpost from "../sections/Addpost";
import { Button } from "../components/Button";
import postProps from "../types/post.type";
import { useLocation, useNavigate } from "react-router-dom";
import Drafts from "../sections/Drafts";
import Unpublishs from "../sections/Unpublishs";
import { useEffect, useState } from "react";
import Media from "../sections/Media";

const Createblogpost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [getBlogpost, setGetBlogpost] = useState<postProps | null >(null);

    useEffect(() => { 
        if (state?.blogpost) {
            setGetBlogpost(state.blogpost);
        }
    }, [state?.blogpost]);

    return<main
            className="container space-y-8"
        >
            <menu
                id="post-page-menu-wrapper"
                className="py-2 overflow-x-auto overflow-y-hidden"
            >
                <ul className="flex items-center justify-between gap-6 list-none no-underline">
                    <li>
                        <Button
                            fieldName={"Post"}
                            className="rounded-full text-sm whitespace-pre"
                            onClick={() => navigate("#add-post")}
                        />
                    </li>
                    <li>
                        <Button
                            fieldName={"Media"}
                            className="rounded-full text-sm whitespace-pre"
                            onClick={() => navigate("#media")}
                        />
                    </li>
                    <li>
                        <Button
                            fieldName={"Unpublish posts"}
                            className="rounded-full text-sm whitespace-pre"
                            onClick={() => navigate("#unpublish-posts")}
                        />
                    </li>
                    <li>
                        <Button
                            fieldName={"Drafts"}
                            className="rounded-full text-sm whitespace-pre"
                            onClick={() => navigate("#draft")}
                        />
                    </li>
                </ul>
            </menu>
            <Tab
                className=""
                arrOfTab={[
                    {
                        id: "add-post",
                        tab: <Addpost
                            oldBlogpost={getBlogpost}
                        />
                    },
                    {
                        id: "media",
                        tab: <Media />
                    },
                    {
                        id: "unpublish-posts",
                        tab: <Unpublishs />

                    },
                    {
                        id: "draft",
                        tab: <Drafts/>

                    }
                ]}
            />
        </main>;
};

export default Createblogpost;