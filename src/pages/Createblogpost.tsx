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
    const [getExistingPost, setgetExistingPost] = useState<postProps | null>(null);

    useEffect(() => {
        if (state?.blogpost) {
            setgetExistingPost(state.blogpost);
        }
    }, [state?.blogpost]);

    return <main className="container">
        <menu className="overflow-x-auto scroll-smooth snap-x snap-mandatory py-2">
            <ul className="flex w-max items-center gap-6 sm:gap-10 list-none no-underline">
                <li>
                    <Button
                        fieldName={"Add Post"}
                        className={`whitespace-pre transition-all border-b-2 rounded-full ${location.hash === "#add-post" ||
                            location.hash === "" ? "border-green-800" : ""}`}
                        onClick={() => navigate("#add-post")}
                    />
                </li>
                <li>
                    <Button
                        fieldName={"Your Media"}
                        className={`whitespace-pre transition-all border-b-2 rounded-full ${location.hash === "#media" ? "border-green-800" : ""}`}
                        onClick={() => navigate("#media")}
                    />
                </li>
                <li>
                    <Button
                        fieldName={"Unpublishs"}
                        className={`whitespace-pre transition-all border-b-2 rounded-full ${location.hash === "#unpublish-posts" ? "border-green-800" : ""}`}
                        onClick={() => navigate("#unpublish-posts")}
                    />
                </li>
                <li>
                    <Button
                        fieldName={"Drafts"}
                        className={`whitespace-pre transition-all border-b-2 rounded-full ${location.hash === "#drafts" ? "border-green-800" : ""}`}
                        onClick={() => navigate("#drafts")}
                    />
                </li>
            </ul>
        </menu>
        <Tab
            className="mt-2 pb-12"
            arrOfTab={[
                {
                    id: "add-post",
                    tab: <Addpost
                        existingPost={getExistingPost}
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
                    id: "drafts",
                    tab: <Drafts />

                }
            ]}
        />
    </main>;
};

export default Createblogpost;