import { LuShare2 } from "react-icons/lu";
import postProps from "../types/post.type";
import { useAppSelector } from "../redux";
import Copytoclipboard from "./Copytoclipboard";
import { CiFacebook } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import Dialog from "./Dialog";
import useDialog from "../hooks/useDialog";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;
const domain = import.meta.env.VITE_DOMAIN_NAME;

type Props = {
    blogpost: postProps,
    updateBlogpost: ({ type, blogpost }: { type: "EDIT", blogpost: postProps } | { type: "DELETE", blogpost: { _id: string } }) => void;
};

const Shareblogpost = ({ blogpost, updateBlogpost }: Props) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);

    const { dialog, handleDialog } = useDialog();

    const handleShareBlogpost = async (_id: string) => {
        const clear = setTimeout(() => {
            handleDialog();
        }, 500);

        const sessionId = User.sessionId || User.userName;
        if (blogpost.shares &&
            blogpost.shares.includes(sessionId)) {
            return;
        }

        try {
            const url = apiEndPont + "/post/partial/" + _id;
            const data: postProps = {
                ...blogpost,
                shares: [sessionId, ...(blogpost.shares || [])]
            };
            const res = await axios.patch(url, data, {
                baseURL: apiEndPont,
                withCredentials: true
            });
            const sharedBlogpost = await res.data.data;
            updateBlogpost({ blogpost: sharedBlogpost, type: "EDIT" });
        } catch (error) {
            console.error(error);
        }
        return () => clearTimeout(clear);
    };

    return <>
        <LuShare2
            size={18}
            onClick={handleDialog}
        />
        <Dialog
            dialog={dialog}
            handleDialog={handleDialog}
            className="relative block min-w-[220px] min-h-[100px] max-w-[480px] gap-6 p-6 pt-2 border bg-white rounded-md shadow-2xl"
            children={
                <>
                    <span
                        className="block w-full text-center text-xl text-slate-700 font-sec font-semibold mb-4">
                        Share to
                    </span>
                    <span
                        className="absolute top-2 right-6 text-sm text-slate-500 font-text cursor-pointer"
                        onClick={handleDialog}
                    >
                        x
                    </span>
                    <span
                        className="flex flex-wrap gap-6"
                    >
                        <span
                            id="copy-blogpost-link"
                            className="flex justify-center items-center rounded-full h-12 w-12 border shadow"
                            onClick={() => handleShareBlogpost(blogpost._id || "")}
                        >
                            <Copytoclipboard body={domain + "/post/" + (blogpost.url || blogpost.author + "/" + blogpost.slug)} />
                        </span>
                        <span
                            id="share-to-facebook-btn"
                            className="flex justify-center items-center rounded-full h-12 w-12 border shadow"
                            onClick={() => handleShareBlogpost(blogpost._id || "")}
                        >
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogpost.url || blogpost.author + "/" + blogpost.slug)}`} target="_blank">
                                <CiFacebook size={30} />
                            </a>
                        </span>
                        <span
                            id="share-whatsappk-btn"
                            className="flex justify-center items-center rounded-full h-12 w-12 border shadow"
                            onClick={() => handleShareBlogpost(blogpost._id || "")}
                        >
                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${blogpost.title || ""}: ${blogpost.url || blogpost.author + "/" + blogpost.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer">
                                <FaWhatsapp size={26} />
                            </a>
                        </span>
                        <span
                            id="share-to-instagram"
                            className="flex justify-center items-center rounded-full h-12 w-12 border shadow"
                            onClick={() => handleShareBlogpost(blogpost._id || "")}
                        >
                            <a href="https://www.instagram.com/" target="_blank">
                                <BsInstagram size={20} />
                            </a>
                        </span>
                        <span
                            id="share-to-X"
                            className="flex justify-center items-center rounded-full h-12 w-12 border shadow"
                            onClick={() => handleShareBlogpost(blogpost._id || "")}
                        >
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${blogpost.title || ""}&url=${blogpost.url || blogpost.author + "/" + blogpost.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer">
                                <FaXTwitter size={20} />
                            </a>
                        </span>
                    </span>
                </>
            }
        />
    </>;
};

export default Shareblogpost;
