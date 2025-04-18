import postProps from "../types/post.type";
import Displayimage from "./Displayimage";
import imgplaceholder from "../assert/imageplaceholder.svg";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux";
import { deleteDraft } from "../redux/slices/userBlogpostSlices";
import axios from "axios";
import { useState } from "react";
import Displayscreenloading from "./Displayscreenloading";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Displaydraft = ({ blogpost }: { blogpost: postProps }) => {
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const truncate = (words: string, numWords: number) => {
        return words.split(" ", numWords).join(" ");
    };

    const handleToEdit = (blogpost: postProps) => {
        navigate("#add-post", { state: { blogpost } });
    };

    const handleDeleteDraft = async (_id: string) => {
        setLoading(true);
        try {
            const url = apiEndPont + "/draft/" + _id;
            await axios.delete(url, {
                withCredentials: true,
                baseURL: apiEndPont
            });                    
            appDispatch(deleteDraft({ _id }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return <>
        <article className="font-text text-base rounded-md border p-4">
            <span
                className="flex justify-between items-center">
                <span className="text-red-400">
                    Draft
                </span>
                <button
                    className="text-sm cursor-pointer"
                    onClick={() => handleDeleteDraft(blogpost._id || "")}
                >Delete</button>
            </span>
            <span className="flex gap-4 text-sm text-stone-700 font-sec mt-2">
                {/* post date */}
                <span>Post: 02 01 25; 11:00am</span>
                <span>Updated: 03 01 25; 1:00pm</span>
            </span>
            <ul className="flex gap-1 text-sm text-slate-800">
                {blogpost.catigories && blogpost.catigories.length
                    ? blogpost.catigories.map((catigory, index) => (
                        catigory.trim() ? <li key={index}>
                            <span className="font-semibold">.</span>
                            {catigory}
                        </li>
                            : null
                    ))
                    : null}
            </ul>
            {/* post article */}
            <span
                className="block mt-2"
                onClick={(e) => {
                    handleToEdit(blogpost);
                    e.stopPropagation();
                }}
            >
                <span className="block indent-2 break-words hyphens-auto">
                    {truncate(blogpost.body || "", 60)} {" "}
                    <span className="text-blue-700 text-sm font-semibold cursor-pointer">
                        Continue Writing...
                    </span>
                </span>
                {
                    blogpost.image ? (
                        <Displayimage
                            url={blogpost.image ? apiEndPont + "/media/" + blogpost.image : ""}
                            alt={blogpost.title || ""}
                            useCancle={false}
                            className="w-full object-cover h-20"
                            placeHolder={
                                <img
                                    src={imgplaceholder}
                                    className="absolute top-0 bottom-0 right-0 left-0 object-cover w-full h-20"
                                />
                            }
                        />
                    ) :
                        null
                }
            </span>
        </article>
        <Displayscreenloading loading={loading} />
    </>;
};

export default Displaydraft;
