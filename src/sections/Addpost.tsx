import { useEffect, useRef, useState } from "react";
import Texteditor from "../editor/App";
import useGetLocalFiles from "../hooks/useGetLocalFiles";
import { FaMinus, FaPlus } from "react-icons/fa";
import Displayimage from "../components/Displayimage";
import Model from "../components/Model";
import Fileinput from "../components/Fileinput";
import { IoMdImages } from "react-icons/io";
import { Button } from "../components/Button";
import postProps from "../types/post.type";
import { deleteAll } from "../editor/toolbar/toolbar.utils";
import Popupmessage from "../components/Popupmessag";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux";
import { addBlogpost, addDraft, deleteDraft, editBlogpost, editDraft } from "../redux/slices/userBlogpostSlices";
import mediaProps from "../types/file.type";
import { addMdia, addToDisplaySingleMedia, displayMediaOptions } from "../redux/slices/userMediaSlices";

type Props = {
    oldBlogpost: postProps | null
};

const Addpost = ({
    oldBlogpost,
}: Props) => {
    const navigate = useNavigate();
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const { data: Media, selectedMedia } = useAppSelector(state => state.userMediaSlices.media);
    const appDispatch = useAppDispatch();

    const { getLocalFiles } = useGetLocalFiles();

    const editorRef = useRef<HTMLDivElement | null>(null);

    const [title, setTitle] = useState("");
    const [article, setArticle] = useState({
        _html: "",
        text: ""
    });
    const [catigories, setCatigories] = useState<{ _id: string, cat: string }[]>([{ _id: Date.now().toString(), cat: "" }]);
    const catigoryInputRef = useRef<HTMLInputElement>(null);
    const [slug, setSlug] = useState("");
    const [slugPatter, setSlugPatter] = useState("-");
    const [displayImageUrl, setDisplayImageUrl] = useState("");
    const [displayImageUrlCaption, setDisplayImageUrlCaption] = useState("");

    const [isEmpty, setIsEmpty] = useState(true);
    const [popUp, setPopUp] = useState(false);
    const [popUpMsg, setPopUpMsg] = useState("");

    const addVideo = (url: string) => {
        const video: mediaProps = {
            _id: Date.now().toString(),
            url,
            mime: "vm",
            type: "video"
        };

        const Media = JSON.parse(localStorage.getItem("media") || "[]");
        localStorage.setItem("media", JSON.stringify([...Media, video]));
        appDispatch(addMdia(video));

        return url;
    };

    const addImage = (url: string) => {
        const image: mediaProps = {
            _id: Date.now().toString(),
            url,
            mime: "png",
            type: "image"
        };

        const Media = JSON.parse(localStorage.getItem("media") || "[]");
        localStorage.setItem("media", JSON.stringify([...Media, image]));
        appDispatch(addMdia(image));

        return url;
    };

    const publish = (blogpost: postProps) => {
        const addNewBlogpost = {
            _id: Date.now().toString(),
            ...blogpost,
            slug: (blogpost.slug || "").trim(),
            title: (blogpost.title || "").trim(),            
        };
        const Blogposts: postProps[] = JSON.parse(localStorage.getItem("blogposts") || "[]");
        localStorage.setItem("blogposts", JSON.stringify([...Blogposts, addNewBlogpost]));

        const getNewBlogpost: postProps = JSON.parse(localStorage.getItem("blogposts") || "[]")
            .find((blogpost: postProps) => blogpost._id === addNewBlogpost._id);
        appDispatch(addBlogpost(getNewBlogpost));
    };

    const draft = (blogpost: postProps) => {
        const addNewBlogpost = {
            ...blogpost,
            _id: blogpost._id || Date.now().toString(),
            slug: (blogpost.slug || "").trim(),
            title: (blogpost.title || "").trim(),       
        };
        const Blogposts: postProps[] = JSON.parse(localStorage.getItem("drafts") || "[]");
        localStorage.setItem("drafts", JSON.stringify([...Blogposts, addNewBlogpost]));

        const getNewBlogpost: postProps = JSON.parse(localStorage.getItem("drafts") || "[]")
            .find((blogpost: postProps) => blogpost._id === addNewBlogpost._id);
        appDispatch(addDraft(getNewBlogpost));
    };

    const edit = (isDraft: boolean = false, blogpost: postProps) => {
        if (isDraft) {
            const Drafts: postProps[] = JSON.parse(localStorage.getItem("drafts") || "[]");
            localStorage.setItem("drafts", JSON.stringify(Drafts.map(
                draft => draft._id === blogpost._id ? { ...draft, ...blogpost } : draft
            )));
            appDispatch(editDraft(blogpost));

        } else {
            const Blogposts: postProps[] = JSON.parse(localStorage.getItem("blogposts") || "[]");
            localStorage.setItem("blogposts", JSON.stringify(Blogposts.map(
                preBlogpost => preBlogpost._id === blogpost._id ? { ...preBlogpost, ...blogpost } : preBlogpost
            )));
            appDispatch(editBlogpost(blogpost));
        }
    };

    const handleFilterSlug = (slug: string, slugPatter: string) => {
        const filterSlug = slug.replace("/", slugPatter).split(" ").join(slugPatter);
        return filterSlug;
    };

    const handlePublishBlogpostBtn = () => {
        if ((!slug.trim() && !title.trim()) || isEmpty) return;

        if (
            oldBlogpost &&
            oldBlogpost._id &&
            oldBlogpost.publishedId
        ) {
            const blogpost: postProps = {
                _id: oldBlogpost._id,
                title,
                image: displayImageUrl,
                body: article.text,
                _html: { title: slug, body: article._html },
                catigories: catigories.map(catigory => catigory.cat),
                status: "published",
                updatedAt: Date(),
            };
            edit(false, blogpost);
            setPopUpMsg("Edited blogpost has been published");
            setPopUp(true);
        } else {
            const createBlogpost: postProps = {
                publishedId: " publishedId" + Date.now().toString(),
                author: User.userName,
                image: displayImageUrl,
                title,
                body: article.text,
                _html: { title: slug, body: article._html },
                slug: handleFilterSlug((slug || title), slugPatter),
                catigories: catigories.map(catigory => catigory.cat),
                status: "published",
                likes: [],
                shares: [],
                views: [],
                updatedAt: Date(),
                createdAt: Date(),
            };
            publish(createBlogpost);
            setPopUpMsg("Your Blogpost has been published");
            setPopUp(true);
        }

        if (oldBlogpost &&
            oldBlogpost._id &&
            oldBlogpost.status.trim().toLowerCase() === "draft"
        ) {
            handleDeleteDraftOnPublish(oldBlogpost._id);
        }

        setTitle("");
        setDisplayImageUrl("");
        setCatigories([{ _id: Date.now().toString(), cat: "" }]);
        setSlug("");
        setIsEmpty(true);
        deleteAll(editorRef);
    };

    const handleDraftBlogpostBtn = () => {
        if (isEmpty) return;

        if (oldBlogpost &&
            oldBlogpost.status.trim().toLowerCase() === "draft") {
            const draftBlogpost: postProps = {
                _id: oldBlogpost._id,
                title,
                image: displayImageUrl,
                body: article.text,
                _html: { title: slug, body: article._html },
                catigories: catigories.map(catigory => catigory.cat),
                status: "draft",
                updatedAt: Date(),
            };
            edit(true, draftBlogpost);
            setPopUpMsg("Blogpost had been draft");
            setPopUp(true);
        } else {
            const createDraftBlogpost: postProps = {
                _id: oldBlogpost?._id,
                author: User.userName,
                image: displayImageUrl,
                publishedId: oldBlogpost?.publishedId,
                title,
                body: article.text,
                _html: { title: slug, body: article._html },
                slug: handleFilterSlug((slug || title), slugPatter),
                catigories: catigories.map(catigory => catigory.cat),
                status: "draft",
                updatedAt: Date(),
                createdAt: Date(),
            };
            draft(createDraftBlogpost);
            setPopUpMsg("Blogpost had been draft");
            setPopUp(true);
        }

        setTitle("");
        setDisplayImageUrl("");
        setCatigories([{ _id: Date.now().toString(), cat: "" }]);
        setSlug("");
        setIsEmpty(true);
        deleteAll(editorRef);
    };

    const handleDeleteDraftOnPublish = (_id: string) => {
        const Drafts: postProps[] = JSON.parse(localStorage.getItem("drafts") || "[]");
        localStorage.setItem("drafts", JSON.stringify(Drafts.filter(draft => draft._id !== _id)));
        appDispatch(deleteDraft({ _id }));
    };

    useEffect(() => {
        if (selectedMedia &&
            selectedMedia.length) {
            setDisplayImageUrl(selectedMedia[0].url);
        }
    }, [selectedMedia]);

    useEffect(() => {
        if (oldBlogpost) {
            setTitle(oldBlogpost.title || "");
            setArticle({
                _html: oldBlogpost._html.body,
                text: oldBlogpost.body
            });
            setCatigories(
                oldBlogpost.catigories.length ?
                    oldBlogpost.catigories.map(catigory => (
                        { _id: (Date.now() + Math.floor(Math.random() * 1000)).toString(), cat: catigory }
                    )) :
                    [{ _id: Date.now().toString(), cat: "" }]
            );
            setSlug(oldBlogpost.slug || "");
            setDisplayImageUrl(oldBlogpost.image || "");
        }

    }, [oldBlogpost]);


    return <section>
        <div className="space-y-10">
            <Texteditor
                editorRef={editorRef}
                wrapperClassName="h-full w-full"
                toolBarClassName="w-full border p-4 sticky top-0 z-10 bg-white "
                inputClassName="w-full min-h-[480px] max-h-[480px] p-4 border overflow-y-auto"
                placeholderValue="Start writing..."
                useToolBar={{
                    useInline: {
                        heading: true,
                        font: true,
                        size: true,
                        bold: true,
                        italic: true,
                        underline: true,
                        textTransform: true,
                        anchorlink: true,
                        textColor: true,
                        backGroundColor: true,
                        alignment: true,
                        listing: true,
                        emoji: true,
                    },
                    useBlock: true,
                    useDelete: true,
                    useHistor: true,
                }}
                autoFocus={true}
                addValue={{
                    createNew: oldBlogpost ? false : true,
                    data: oldBlogpost && oldBlogpost._html.body || ""
                }}
                setGetValue={(value) => {
                    if (isEmpty) {
                        setIsEmpty(false);
                    }
                    setArticle(value);
                    const title = value.text.split(" ", 10);
                    if (title.length > 10) {
                        return;
                    }
                    setTitle(title.join(" "));
                }}
                imageGalary={Media.filter(image => image.type.toLowerCase() === "image")}
                videoGalary={Media.filter(image => image.type.toLowerCase() === "vidoe")}
                handleLocalFile={async (files) => {
                    try {
                        const data = await getLocalFiles(files);
                        if (data[0].type.includes("image")) {
                            const url = addImage(data[0].bufferUrl as string);
                            return url;
                        } else {
                            const url = addVideo(data[0].bufferUrl as string);
                            return url;
                        }
                    } catch (error) {
                        return "";
                    }
                }}
            />
            <div className='space-y-1 font-text'>
                <span>Catigories</span>
                {
                    catigories.map((catigory, index) =>
                        <label
                            htmlFor={catigory._id}
                            key={index}
                            className='flex items-center gap-4'
                        >
                            <input
                                ref={catigoryInputRef}
                                id={catigory._id}
                                type='text'
                                className='text-sm w-full border-2 p-1 rounded-md outline-blue-700 mt-2'
                                placeholder="Add catigory..."
                                value={catigories[index].cat}
                                onChange={(e) => {
                                    if (isEmpty) {
                                        setIsEmpty(false);
                                    }
                                    setCatigories(pre => pre[index] ? pre.map(mapCatigory =>
                                        mapCatigory._id === catigory._id ?
                                            { ...mapCatigory, cat: e.target.value } :
                                            mapCatigory
                                    ) : pre);
                                }}
                            />
                            <button
                                id='add-catigory'
                                className='cursor-pointer'
                                onClick={() => {
                                    setCatigories((pre) => pre ? [...pre, { _id: Date.now().toString(), cat: "" }] : pre);
                                    const clear = setTimeout(() => {
                                        if (catigoryInputRef.current) catigoryInputRef.current.focus();
                                        clearTimeout(clear);
                                    }, 100);
                                }}
                            >
                                <FaPlus size={10} />
                            </button>
                            {index > 0 ? <button
                                id='delete-catigory'
                                className='cursor-pointer'
                                onClick={() => {
                                    setCatigories((pre) => [...pre.filter(filCatigory => filCatigory._id != catigory._id)]);
                                }}
                            >
                                <FaMinus size={10} />
                            </button> :
                                null}
                        </label>
                    )
                }
            </div>
            <label htmlFor="blog-post-slug" className="block w-full space-y-1 font-text">
                <span className="block">Slug</span>
                <input
                    id="blog-post-slug"
                    type="text"
                    className='block text-sm w-full p-1 border-2 rounded-md outline-blue-700'
                    placeholder="Add slug..."
                    value={handleFilterSlug((slug || title), slugPatter)}
                    onChange={(e) => {
                        if (oldBlogpost && oldBlogpost.publishedId) return;
                        if (isEmpty) {
                            setIsEmpty(false);
                        }
                        setSlug(e.target.value.toLowerCase());
                    }}
                />
                <span className="flex items-center justify-start gap-1  text-sm font-text">
                    <span className="font-semibold">
                        Permalink patter:
                    </span>
                    <select
                        name="permal-link-patter"
                        id="permal-link-patter"

                        value={slugPatter}
                        onChange={(e) => setSlugPatter(e.target.value)}
                    >
                        <option value="-">Morning-blogposting-is-great</option>
                        <option value="&">Morning&blogposting&is&great</option>
                        <option value="%">Morning%blogposting%is%great</option>
                    </select>
                </span>
            </label>
            <div className="space-y-1 w-full font-text">
                <span className="block">Display image</span>
                <Displayimage
                    url={displayImageUrl}
                    setUrl={setDisplayImageUrl}
                    alt={displayImageUrlCaption}
                    useCancle={true}
                    placeHolder={<span
                        onClick={() => navigate("#insert-display-image")}
                        className="absolute top-0 bottom-0 right-0 left-0 h-[140px] w-[140px] border border-slate-200 bg-slate-200 rounded-md cursor-pointer"></span>
                    }
                    className="h-[140px] w-[140px] object-contain rounded cursor-pointer border"
                    onClick={() => navigate("#insert-display-image")}
                />
                <div>
                    <input
                        type="text"
                        placeholder="Image caption..."
                        className="blcok text-sm w-[150px] px-2 py-1 border rounded-md outline-blue-700"
                        value={displayImageUrlCaption}
                        onChange={(e) => setDisplayImageUrlCaption(e.target.value)}
                    />
                </div>
            </div>
            <div className="relative flex flex-col justify-center items-center gap-1">
                <Button
                    fieldName={"Publish"}
                    className={`min-w-[200px] py-2 font-bold text-white font-text rounded-full transition-colors bg-green-600 shadow-green-400 
                        ${(!slug.trim() && !title.trim() || isEmpty) ?
                            "bg-opacity-25" :
                            "active:bg-green-500"
                        }`}
                    disabled={(!slug.trim() && !title.trim()) || isEmpty}
                    onClick={handlePublishBlogpostBtn}
                />
                <span className="text-sm">Or:</span>
                <Button
                    fieldName={"Draft"}
                    className={`min-w-[200px] py-2 font-bold text-white font-text rounded-full transition-colors bg-yellow-600 shadow-yellow-400 
                        ${isEmpty ?
                            "bg-opacity-25" :
                            "active:bg-yellow-500"
                        }`}
                    disabled={isEmpty}
                    onClick={handleDraftBlogpostBtn}
                />
                <Popupmessage
                    className="max-w-40 text-start"
                    popUp={popUp}
                    setPopUp={setPopUp}
                    children={popUpMsg}
                />
            </div>
        </div>
        <Model
            id="insert-display-image"
            children={
                <div className="relative font-text p-6 space-y-6 rounded shadow-sm bg-white">
                    <div className="flex justify-center items-center gap-6">
                        <h2 className="text-xl font-text font-semibold">Add Display Image</h2>
                        <button
                            onClick={() => {
                                navigate("#add-post");
                            }}
                            className="text-red-800 font-bold text-sm cursor-pointer"
                        >
                            X
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-6 m">
                        <span>
                            <button
                                className="cursor-pointer"
                                onClick={() => {
                                    appDispatch(addToDisplaySingleMedia({ url: displayImageUrl, _id: "", type: "image", mime: "png" }));
                                    appDispatch(displayMediaOptions({
                                        negativeNavigate: "#insert-display-image",
                                    }));
                                    navigate("#single-image");
                                }}
                            >
                                Icon
                            </button>
                            View
                        </span>
                        <Fileinput
                            id="choose-display-blogpost-image"
                            accept="image/png, image/gif, image/jpeg"
                            type="image"
                            fieldName="Device"
                            className="cursor-pointer"
                            handleGetFile={async (e) => {
                                const data = await getLocalFiles(e);
                                if (data.length) {
                                    const url = addImage(data[0].bufferUrl as string);
                                    setDisplayImageUrl(url);
                                    navigate("#add-post");
                                    if (isEmpty) {
                                        setIsEmpty(false);
                                    }
                                }
                            }}
                        />
                        <span className="text-sm text-center">
                            <button
                                className="block text-white bg-orange-500 p-3 rounded-full shadow-sm cursor-pointer"
                                onClick={() => {
                                    appDispatch(displayMediaOptions({
                                        singleSelection: true,
                                        medieType: "image",
                                        positiveNavigate: "#add-post",
                                        negativeNavigate: "#insert-display-image",

                                    }));
                                    navigate("#display-image-galary");
                                }}>
                                <IoMdImages size={25} className="text-white" />
                            </button>
                            Galary
                        </span>
                    </div>
                </div>
            }
        />
    </section>;
};

export default Addpost;
