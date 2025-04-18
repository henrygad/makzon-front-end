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
import {
    addBlogpost,
    addDraft,
    deleteDraft,
    editBlogpost,
    editDraft,
} from "../redux/slices/userBlogpostSlices";
import mediaProps from "../types/media.type";
import { addMedia } from "../redux/slices/userMediaSlices";
import axios from "axios";
import Displayscreenloading from "../components/Displayscreenloading";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
    existingPost: postProps | null;
};

const Addpost = ({ existingPost }: Props) => {
    const navigate = useNavigate();
    const { selectedMedia } = useAppSelector(
        (state) => state.userMediaSlices.media
    );
    const appDispatch = useAppDispatch();

    const { getLocalFiles, loading: loadingUploadedLocalFile } = useGetLocalFiles();

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [displayImage, setDisplayImage] = useState("");
    const [imageBlob, setImageBlob] = useState<Blob | undefined>(undefined);
    const [article, setArticle] = useState({
        _html: "",
        text: "",
    });
    const [imageCaption, setImageCaption] = useState("");
    const catigoryInputRef = useRef<HTMLInputElement>(null);
    const [catigories, setCatigories] = useState<{ _id: string; cat: string }[]>([
        { _id: Date.now().toString(), cat: "" },
    ]);
    const [slug, setSlug] = useState("");
    const [loadingUploadedPost, setLoadingUploadedPost] = useState(false);

    const [loadingUploadedFileBlob, setLoadingUploadedFileBlob] = useState(false);
    const fileFromGalaryRef = useRef<string | undefined | null>(undefined);
    const holdSelectedMediaRef = useRef<string | undefined>(undefined);
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [slugPatter, setSlugPatter] = useState("-");
    const [isEmpty, setIsEmpty] = useState(true);
    const [popUpMsg, setPopUpMsg] = useState("");
    const [popUp, setPopUp] = useState(false);

    const handleFilterSlug = (slug: string, slugPatter: string) => {
        const filterSlug = slug
            .replace("/", slugPatter)
            .split(" ")
            .join(slugPatter);
        return filterSlug;
    };

    const handleLocalFile = async (files: FileList) => {
        const data = await getLocalFiles(files);
        if (data[0]) {
            return data[0].url;
        }
        return "";
    };

    const handleGalaryFile = () => {
        return new Promise<string>((res) => {
            navigate("#display-image-galary");
            fileFromGalaryRef.current = null;
            const check = () => {
                if (fileFromGalaryRef.current) {
                    res(fileFromGalaryRef.current);
                    fileFromGalaryRef.current = undefined;
                } else {
                    const clear = setTimeout(() => {
                        check();
                        clearTimeout(clear);
                    }, 100);
                }
            };
            check();
        });
    };

    const uploadFile = async (value: Blob | string) => {
        if (typeof value === "object") {
            setLoadingUploadedFileBlob(true);
            try {
                const formData = new FormData();
                formData.append("media", value);

                const url = apiEndPont + "/media";
                const res = await axios.post(url, formData, {
                    baseURL: apiEndPont,
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const file: mediaProps = await res.data.data;
                appDispatch(addMedia(file));

                return apiEndPont + "/media/" + file.filename;
            } catch (error) {
                console.error(error);
                return "";
            } finally {
                setLoadingUploadedFileBlob(false);
            }
        } else if (typeof value === "string") {
            return value;
        }
        return "";
    };

    const publish = async (blogpost: postProps, imageBlob: Blob | undefined, isUpdate: boolean) => {
        setLoadingUploadedPost(true);

        // Create new form data
        const formData = new FormData();

        // Attach data for formdata
        if (imageBlob) formData.append("post", imageBlob);
        for (const key in blogpost) {
            const value = blogpost[key as keyof postProps];
            if (value !== undefined) formData.append(key, JSON.stringify(value));
        }

        // api for publishing post
        const url = apiEndPont + "/post";

        if (!isUpdate) { // To add new blogpost        
            try {
                const res = await axios.post(url, formData, {
                    baseURL: apiEndPont,
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const getNewBlogpost: postProps = await res.data.data;
                appDispatch(addBlogpost(getNewBlogpost));

            } catch (error) {
                console.error(error);
            } finally {
                setLoadingUploadedPost(false);
            }

        } else { // To edit  old blogpost
            try {
                const res = await axios.patch(url + "/" + blogpost._id, formData, {
                    baseURL: apiEndPont,
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const getUpdatedBlogpost: postProps = await res.data.data;
                appDispatch(editBlogpost(getUpdatedBlogpost));
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingUploadedPost(false);
            }
        }

        if (existingPost && existingPost.status.toLowerCase() === "drafted") {
            setLoadingUploadedPost(true);
            try {
                // If existingPost was previously drafted then delete draft post
                const url = apiEndPont + "/draft/" + existingPost._id;
                await axios.delete(url, {
                    baseURL: apiEndPont,
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                appDispatch(deleteDraft({ _id: existingPost._id || "" }));
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingUploadedPost(false);
            }
        }
    };

    const draft = async (blogpost: postProps, imageBlob: Blob | undefined, isUpdate: boolean) => {
        setLoadingUploadedPost(true);

        // Create new form data  
        const formData = new FormData();

        // Attach data for formdata
        if (imageBlob) formData.append("post", imageBlob);
        for (const key in blogpost) {
            const value = blogpost[key as keyof postProps];
            if (value !== undefined) formData.append(key, JSON.stringify(value));
        }

        // api for drafting post
        const url = apiEndPont + "/draft";

        if (!isUpdate) { // To add new draft blogpost
            try {
                const res = await axios.post(url, formData, {
                    baseURL: apiEndPont,
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const getNewDraft: postProps = await res.data.data;
                appDispatch(addDraft(getNewDraft));
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingUploadedPost(false);
            }
        } else {
            try { // To edit old drafted blogpost
                const res = await axios.patch(url + "/" + blogpost._id, formData, {
                    baseURL: apiEndPont,
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const getUpdatedDraft: postProps = await res.data.data;
                appDispatch(editDraft(getUpdatedDraft));
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingUploadedPost(false);
            }
        }

    };

    const handlePublishBtn = async () => {
        if ((!slug.trim() && !title.trim()) || isEmpty) return;

        if (existingPost) { // if there is an existing post
            if (existingPost.status.toLowerCase() === "published") { // And it already published then edit and publish post 
                const editBlogpost: postProps = {
                    ...existingPost,
                    image,
                    title,
                    body: article.text,
                    _html: { title, body: article._html },
                    catigories: catigories.map((catigory) => catigory.cat),
                };
                await publish(editBlogpost, imageBlob, true);

            } else if (existingPost.status.toLowerCase() === "unpublished") {// or if it unpublished, edit and published post
                const editBlogpost: postProps = {
                    ...existingPost,
                    image,
                    title,
                    body: article.text,
                    _html: { title, body: article._html },
                    catigories: catigories.map((catigory) => catigory.cat),
                    status: "published"
                };
                await publish(editBlogpost, imageBlob, true);

            } else if (existingPost.status.toLowerCase() === "drafted") { //  Or if it is a drafted post
                if (existingPost.publishedId) { // Then edit and published drafted post data                    
                    const editBlogpost: postProps = {
                        ...existingPost,
                        _id: existingPost.publishedId,
                        publishedId: undefined,
                        image,
                        title,
                        body: article.text,
                        _html: { title, body: article._html },
                        catigories: catigories.map((catigory) => catigory.cat),
                        status: "published",
                    };
                    await publish(editBlogpost, imageBlob, true);
                } else { // Or create new publish post from drafted post
                    const createBlogpost = {
                        title,
                        image,
                        body: article.text,
                        _html: { title, body: article._html },
                        catigories: catigories.map((catigory) => catigory.cat),
                        slug: handleFilterSlug(slug || title, slugPatter).trim(),
                        status: "published",
                        likes: [],
                        shares: [],
                        views: [],
                    };
                    await publish(createBlogpost, imageBlob, false);
                }
            }
        } else {// Create new publish post data            
            const createBlogpost = {
                title,
                image,
                body: article.text,
                _html: { title, body: article._html },
                catigories: catigories.map((catigory) => catigory.cat),
                slug: handleFilterSlug(slug || title, slugPatter).trim(),
                status: "published",
                likes: [],
                shares: [],
                views: [],
            };
            await publish(createBlogpost, imageBlob, false);
        }

        setPopUpMsg("Blogpost has been published");
        setPopUp(true);

        setTitle("");
        setImageBlob(undefined);
        setImage("");
        setDisplayImage("");
        setImageCaption("");
        setArticle({
            _html: "",
            text: "",
        });
        setCatigories([{ _id: Date.now().toString(), cat: "" }]);
        setSlug("");
        setIsEmpty(true);
        // Clear  texteditor input
        deleteAll(editorRef);
    };

    const handleDraftBtn = async () => {
        if (isEmpty) return;

        if (existingPost &&
            existingPost.status.toLowerCase() === "drafted"
        ) {
            // Edit old draft blogpost
            const editDraft: postProps = {
                ...existingPost,
                image,
                title,
                body: article.text,
                _html: { title, body: article._html },
                catigories: catigories.map((catigory) => catigory.cat),
                slug: handleFilterSlug(slug || title, slugPatter).trim(),
            };
            await draft(editDraft, imageBlob, true);
        } else {
            // Create new draft blogpost
            const createDraft: postProps = {
                publishedId: existingPost?._id, // Copy existing post id for drafting post                                
                title,
                image,
                body: article.text,
                _html: { title, body: article._html },
                catigories: catigories.map((catigory) => catigory.cat),
                slug: handleFilterSlug(slug || title, slugPatter).trim(),
                status: "drafted",
            };
            await draft(createDraft, imageBlob, false);
        }

        setPopUpMsg("Blogpost had been draft");
        setPopUp(true);

        setTitle("");
        setImageBlob(undefined);
        setDisplayImage("");
        setImage("");
        setImageCaption("");
        setArticle({
            _html: "",
            text: "",
        });
        setCatigories([{ _id: Date.now().toString(), cat: "" }]);
        setSlug("");
        setIsEmpty(true);
        // Clear  texteditor input
        deleteAll(editorRef);
    };

    useEffect(() => {
        if (selectedMedia && selectedMedia[0]) {
            holdSelectedMediaRef.current = selectedMedia[0].filename;
        } else {
            if (holdSelectedMediaRef.current) {
                if (fileFromGalaryRef.current === null) {
                    fileFromGalaryRef.current = apiEndPont + "/media/" + holdSelectedMediaRef.current;
                } else {
                    setImage(holdSelectedMediaRef.current);
                    setDisplayImage(apiEndPont + "/media/" + holdSelectedMediaRef.current);
                    setImageBlob(undefined);
                }
                holdSelectedMediaRef.current = undefined;
            }
        }
    }, [selectedMedia]);

    useEffect(() => {
        if (existingPost) {
            setTitle(existingPost.title || "");
            setImage(existingPost.image);
            if (existingPost.image)setDisplayImage(apiEndPont + "/media/" + existingPost.image);
            setArticle({
                _html: existingPost._html.body,
                text: existingPost.body,
            });
            setCatigories(
                existingPost.catigories.length
                    ? existingPost.catigories.map((catigory) => ({
                        _id: (Date.now() + Math.floor(Math.random() * 1000)).toString(),
                        cat: catigory,
                    }))
                    : [{ _id: Date.now().toString(), cat: "" }]
            );
            setSlug(existingPost.slug || "");
        }
    }, [existingPost]);

    return (
        <section>
            <div className="space-y-10">
                {/* blogpost rich text editor */}
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
                        createNew: existingPost ? false : true,
                        data: (existingPost && existingPost._html.body) || "",
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
                    handleLocalFile={handleLocalFile}
                    handleGalaryFile={handleGalaryFile}
                    onFileAdd={uploadFile}
                />
                {/* blogpost catigories */}
                <span className="block space-y-1 font-text">
                    <span>Catigories</span>
                    {catigories.map((catigory, index) => (
                        <label
                            htmlFor={catigory._id}
                            key={index}
                            className="flex items-center gap-4"
                        >
                            <input
                                ref={catigoryInputRef}
                                id={catigory._id}
                                type="text"
                                className="text-sm w-full border-2 p-1 rounded-md outline-blue-700 mt-2"
                                placeholder="Add catigory..."
                                value={catigories[index].cat}
                                onChange={(e) => {
                                    if (isEmpty) {
                                        setIsEmpty(false);
                                    }
                                    setCatigories((pre) =>
                                        pre[index]
                                            ? pre.map((mapCatigory) =>
                                                mapCatigory._id === catigory._id
                                                    ? { ...mapCatigory, cat: e.target.value }
                                                    : mapCatigory
                                            )
                                            : pre
                                    );
                                }}
                            />
                            <button
                                id="add-catigory"
                                className="cursor-pointer"
                                onClick={() => {
                                    setCatigories((pre) =>
                                        pre
                                            ? [...pre, { _id: Date.now().toString(), cat: "" }]
                                            : pre
                                    );
                                    const clear = setTimeout(() => {
                                        if (catigoryInputRef.current)
                                            catigoryInputRef.current.focus();
                                        clearTimeout(clear);
                                    }, 100);
                                }}
                            >
                                <FaPlus size={10} />
                            </button>
                            {index > 0 ? (
                                <button
                                    id="delete-catigory"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setCatigories((pre) => [
                                            ...pre.filter(
                                                (filCatigory) => filCatigory._id != catigory._id
                                            ),
                                        ]);
                                    }}
                                >
                                    <FaMinus size={10} />
                                </button>
                            ) : null}
                        </label>
                    ))}
                </span>
                {/* blogpost slug */}
                <label
                    htmlFor="blog-post-slug"
                    className="block w-full space-y-1 font-text"
                >
                    <span className="block">Slug</span>
                    <input
                        id="blog-post-slug"
                        type="text"
                        className="block text-sm w-full p-1 border-2 rounded-md outline-blue-700"
                        placeholder="Add slug..."
                        value={handleFilterSlug(slug || title, slugPatter)}
                        onChange={(e) => {
                            if (existingPost &&
                                (existingPost.publishedId ||
                                    existingPost.status.toLowerCase() === "published" ||
                                    existingPost.status.toLowerCase() === "unpublished")) return;

                            if (isEmpty) {
                                setIsEmpty(false);
                            }
                            setSlug(e.target.value.toLowerCase());
                        }}
                    />
                </label>
                {/* blogpost permalink */}
                <span className="flex items-center justify-start gap-1  text-sm font-text">
                    <span className="font-semibold">Permalink patter:</span>
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
                {/*blogpost display image  */}
                <div className="space-y-1 w-full font-text">
                    <span className="block">Post image</span>
                    <Displayimage
                        url={displayImage}
                        alt={imageCaption}
                        useCancle={true}
                        onCancle={() => {
                            setImage("");
                            setDisplayImage("");
                        }}
                        placeHolder={
                            <span
                                onClick={() => navigate("#insert-display-image")}
                                className="absolute top-0 bottom-0 right-0 left-0 h-[140px] w-[140px] border border-slate-200 bg-slate-200 rounded-md cursor-pointer"
                            ></span>
                        }
                        className="h-[140px] w-[140px] object-contain rounded cursor-pointer border"
                        onClick={() => navigate("#insert-display-image")}
                    />
                    <span className="block">
                        <input
                            type="text"
                            placeholder="Image caption..."
                            className="blcok text-sm w-[145px] px-2 py-1 border rounded-md"
                            value={imageCaption}
                            onChange={(e) => setImageCaption(e.target.value)}
                        />
                    </span>
                </div>
                {/* blogpost btn */}
                <div className="relative flex flex-col justify-center items-center gap-1">
                    {/* publish btn */}
                    <Button
                        fieldName={"Publish"}
                        className={`min-w-[200px] py-2 font-bold text-white font-text rounded-full transition-colors bg-green-600 shadow-green-400 
                        ${(!slug.trim() && !title.trim()) || isEmpty
                                ? "bg-opacity-25"
                                : "active:bg-green-500"
                            }`}
                        disabled={(!slug.trim() && !title.trim()) || isEmpty}
                        onClick={handlePublishBtn}
                    />
                    <span className="text-sm">Or:</span>
                    {/* draf bnt */}
                    <Button
                        fieldName={"Draft"}
                        className={`min-w-[200px] py-2 font-bold text-white font-text rounded-full transition-colors bg-yellow-600 shadow-yellow-400 
                        ${isEmpty ? "bg-opacity-25" : "active:bg-yellow-500"}`}
                        disabled={isEmpty}
                        onClick={handleDraftBtn}
                    />
                    <Popupmessage
                        className="max-w-40 text-start"
                        popUp={popUp}
                        setPopUp={setPopUp}
                        children={popUpMsg}
                    />
                </div>
            </div>
            {/* Screen loading */}
            <Displayscreenloading
                loading={loadingUploadedLocalFile || loadingUploadedFileBlob || loadingUploadedPost}
            />
            <Model
                id="insert-display-image"
                children={
                    <div className="relative font-text p-6 space-y-6 rounded shadow-sm bg-white">
                        <header className="flex justify-center items-center gap-6">
                            <h2 className="text-xl font-text font-semibold">
                                Add Display Image
                            </h2>
                            <button
                                onClick={() => {
                                    navigate(-1);
                                }}
                                className="text-red-800 font-bold text-sm cursor-pointer"
                            >
                                X
                            </button>
                        </header>
                        <main className="flex flex-wrap items-center justify-between gap-6 m">
                            <span>
                                <button
                                    className="cursor-pointer"
                                    onClick={() =>
                                        navigate(
                                            `?url=${image ? apiEndPont + "/media/" + image : ""
                                            }&type=image#single-image`
                                        )
                                    }
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
                                    if (e) {
                                        setImageBlob(e[0]);
                                        const data = await getLocalFiles(e);
                                        if (data[0]) {
                                            const url = data[0].url;
                                            setDisplayImage(url);
                                            navigate("#add-post");
                                            if (isEmpty) {
                                                setIsEmpty(false);
                                            }
                                        }
                                    }
                                }}
                            />
                            <span className="text-sm text-center">
                                <button
                                    className="block text-white bg-orange-500 p-3 rounded-full shadow-sm cursor-pointer"
                                    onClick={() => {
                                        navigate("#display-image-galary");
                                    }}
                                >
                                    <IoMdImages size={25} className="text-white" />
                                </button>
                                Galary
                            </span>
                        </main>
                    </div>
                }
            />
        </section>
    );
};

export default Addpost;

