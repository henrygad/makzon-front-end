import { useEffect, useRef, useState } from "react";
import useGetLocalFiles from "../hooks/useGetLocalFiles";
import { FaMinus, FaPlus } from "react-icons/fa";
import Displayimage from "../components/Displayimage";
import { Button } from "../components/Button";
import postProps from "../types/post.type";
import Popupmessage from "../components/Popupmessag";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, } from "../redux";
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
import Displayscreenloading from "../loaders/Displayscreenloading";
import Makzontexteditor, { deleteAll } from "makzontexteditor";
import Displaychangemedia from "./Displaychangemedia";
import useDialog from "../hooks/useDialog";
import AIcontentgenerator from "../components/AIcontentgenerator";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
    existingPost: postProps | null;
};

const Addpost = ({ existingPost }: Props) => {
    const navigate = useNavigate();

    const appDispatch = useAppDispatch();

    const { getLocalFiles, loading: loadingUploadedLocalFile } = useGetLocalFiles();

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");    
    const [blob, setBlob] = useState<Blob | undefined>(undefined);
    const [getArticle, setGetArticle] = useState({
        _html: "",
        text: "",
    });
    const [setArticle, setSetArticle] = useState({new: true, context: ""});
    const [imageCaption, setImageCaption] = useState("");
    const catigoryInputRef = useRef<HTMLInputElement>(null);
    const [catigories, setCatigories] = useState<{ _id: string; cat: string }[]>([
        { _id: Date.now().toString(), cat: "" },
    ]);
    const [slug, setSlug] = useState("");
    const [loadingUploadedPost, setLoadingUploadedPost] = useState(false);

    const [loadingUploadedFileBlob, setLoadingUploadedFileBlob] = useState(false);
    const fileFromGalaryRef = useRef<string | undefined | null>(undefined);
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [slugPatter, setSlugPatter] = useState("-");
    const [isEmpty, setIsEmpty] = useState(true);
    const [popUpMsg, setPopUpMsg] = useState("");
    const [popUp, setPopUp] = useState(false);

    const { dialog: displayChangeMedia, handleDialog: handleDisplayChangeMedia } = useDialog();
    const { dialog: aiContentGenerator, handleDialog: handleAiContentGenerator } = useDialog();

    // ai generate content
    const [aiGenerateTopic, setAiGenerateTopic] = useState("");
    const [aiGenerateTopicLoading, setAiGenerateTopicLoading] = useState(false);

    const handleFilterSlug = (slug: string, slugPatter: string) => {
        const filterSlug = slug
            .replace("/", slugPatter)
            .split(" ")
            .join(slugPatter);
        return filterSlug;
    };

    const handleTextEditorGalaryFile = () => {
        return new Promise<string>((res) => {
            navigate("#display-image-galary");
            fileFromGalaryRef.current = null;
            const check = () => {
                if (fileFromGalaryRef.current) {
                    res(fileFromGalaryRef.current);
                    fileFromGalaryRef.current = undefined;
                } else {
                    const clear = setTimeout(() => {
                        clearTimeout(clear);
                        check();
                    }, 100);
                }
            };
            check();
        });
    };

    const uploadFile = async (value: Blob) => {
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
    };

    const publish = async (blogpost: postProps, blob: Blob | undefined, isUpdate: boolean) => {
        setLoadingUploadedPost(true);

        // Create new form data
        const formData = new FormData();

        // Attach data to formdata
        if (blob) formData.append("post", blob);
        for (const key in blogpost) {
            const value = blogpost[key as keyof postProps];
            if (value !== undefined) formData.append(key, JSON.stringify(value));
        }

        // api for publishing post
        const url = apiEndPont + "/post";

        if (!isUpdate) {
            // To add new blogpost
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

    const draft = async (blogpost: postProps, blob: Blob | undefined, isUpdate: boolean) => {
        setLoadingUploadedPost(true);

        // Create new form data  
        const formData = new FormData();

        // Attach data for formdata
        if (blob) formData.append("post", blob);
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
                    image: image.split("/")[image.split("/").length - 1],
                    title,
                    body: getArticle.text,
                    _html: { title, body: getArticle._html },
                    catigories: catigories.map((catigory) => catigory.cat),
                };
                await publish(editBlogpost, blob, true);

            } else if (existingPost.status.toLowerCase() === "unpublished") {// or if it unpublished, edit and published post
                const editBlogpost: postProps = {
                    ...existingPost,
                    image: image.split("/")[image.split("/").length - 1],
                    title,
                    body: getArticle.text,
                    _html: { title, body: getArticle._html },
                    catigories: catigories.map((catigory) => catigory.cat),
                    status: "published"
                };
                await publish(editBlogpost, blob, true);

            } else if (existingPost.status.toLowerCase() === "drafted") { //  Or if it is a drafted post
                if (existingPost.publishedId) { // Then edit and published drafted post data                    
                    const editBlogpost: postProps = {
                        ...existingPost,
                        _id: existingPost.publishedId,
                        publishedId: undefined,
                        image: image.split("/")[image.split("/").length - 1],
                        title,
                        body: getArticle.text,
                        _html: { title, body: getArticle._html },
                        catigories: catigories.map((catigory) => catigory.cat),
                        status: "published",
                    };
                    await publish(editBlogpost, blob, true);
                } else { // Or create new publish post from drafted post
                    const createBlogpost = {
                        title,
                        image: image.split("/")[image.split("/").length - 1],
                        body: getArticle.text,
                        _html: { title, body: getArticle._html },
                        catigories: catigories.map((catigory) => catigory.cat),
                        slug: handleFilterSlug(slug || title, slugPatter).trim(),
                        status: "published",
                        likes: [],
                        shares: [],
                        views: [],
                    };
                    await publish(createBlogpost, blob, false);
                }
            }
        } else {
            // Create new publish post data
            const createBlogpost = {
                title,
                image: image.split("/")[image.split("/").length - 1],
                body: getArticle.text,
                _html: { title, body: getArticle._html },
                catigories: catigories.map((catigory) => catigory.cat),
                slug: handleFilterSlug(slug || title, slugPatter).trim(),
                status: "published",
                likes: [],
                shares: [],
                views: [],
            };
            await publish(createBlogpost, blob, false);
        }

        setPopUpMsg("Blogpost has been published");
        setPopUp(true);

        setTitle("");
        setBlob(undefined);
        setImage("");        
        setImageCaption("");
        setGetArticle({
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
                image: image.split("/")[image.split("/").length - 1],
                title,
                body: getArticle.text,
                _html: { title, body: getArticle._html },
                catigories: catigories.map((catigory) => catigory.cat),
                slug: handleFilterSlug(slug || title, slugPatter).trim(),
            };
            await draft(editDraft, blob, true);
        } else {
            // Create new draft blogpost
            const createDraft: postProps = {
                publishedId: existingPost?._id, // Copy existing post id for drafting post                                
                title,
                image: image.split("/")[image.split("/").length - 1],
                body: getArticle.text,
                _html: { title, body: getArticle._html },
                catigories: catigories.map((catigory) => catigory.cat),
                slug: handleFilterSlug(slug || title, slugPatter).trim(),
                status: "drafted",
            };
            await draft(createDraft, blob, false);
        }

        setPopUpMsg("Blogpost had been draft");
        setPopUp(true);

        setTitle("");
        setBlob(undefined);        
        setImage("");
        setImageCaption("");
        setGetArticle({
            _html: "",
            text: "",
        });
        setCatigories([{ _id: Date.now().toString(), cat: "" }]);
        setSlug("");
        setIsEmpty(true);
        // Clear  texteditor input
        deleteAll(editorRef);
    };

    const handleGenerateContentFromAI = async (topic: string) => {
        setAiGenerateTopicLoading(true);
        try {

            const url = apiEndPont + "/generateaicontent";
            const data = { topic };
            
            const res = await axios.post(url, data, {
                baseURL: apiEndPont,
                withCredentials: true,
            });
            const context = await res.data.content as string ;
            setSetArticle({ new: false, context});            
        } catch (err) {
            console.log("Something went wrong.", err);
        } finally {
            setAiGenerateTopicLoading(false);
        }
      };

    useEffect(() => {
        if (existingPost) {
            setTitle(existingPost.title || "");
            setImage(existingPost.image? apiEndPont + "/media/" + existingPost.image: "");
            setSetArticle({ new: false, context: existingPost?._html.body });
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

    return <>
        <section className="space-y-8">
            {/* draft button */}
            <div className="flex justify-between gap-4 items-center px-4">
                <AIcontentgenerator
                    topic={aiGenerateTopic}
                    setTopic={setAiGenerateTopic}
                    loading={aiGenerateTopicLoading}
                    dialog={aiContentGenerator}
                    handleDialog={handleAiContentGenerator}
                    handleGenerate={handleGenerateContentFromAI}
                />
                <Button
                    fieldName={"Draft"}
                    className={`py-1 px-4 font-text text-sm font-semibold text-slate-800 rounded-full transition-colors border-2 shadow shadow-slate-100 
                        ${isEmpty ? "opacity-25" : ""}`}
                    disabled={isEmpty}
                    onClick={handleDraftBtn}
                />
            </div>
            {/* rich text editor */}
            <Makzontexteditor
                inputRef={editorRef}
                wrapperClassName="h-full w-full"
                toolBarClassName="w-full border p-4 sticky top-0 z-10 bg-white"
                inputClassName="w-full min-h-[480px] max-h-[480px] p-4 border overflow-y-auto"
                placeholder="Start writing..."
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
                setContext={setArticle}               
                getValue={(value) => {
                    setIsEmpty(false);
                    setGetArticle(value);

                    const title = value.text.split(" ", 10);
                    if (title.length > 10) {
                        return;
                    }
                    setTitle(title.join(" "));
                }}
                handleLocalFile={async (files: FileList) => {
                    const data = await getLocalFiles(files);
                    if (data[0]) {
                        return data[0].url;
                    }
                    return "";
                }}
                handleGalary={handleTextEditorGalaryFile}
                onAddFile={async (blob, string) => {
                    if (blob) return await uploadFile(blob);
                    else return string;
                }}
            />
            {/* catigories */}
            <div className="space-y-1 font-text">
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
                            placeholder="Add"
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
            </div>
            {/* slug */}
            <label
                htmlFor="blog-post-slug"
                className="block w-full space-y-1 font-text"
            >
                <span className="block">Slug</span>
                <input
                    id="blog-post-slug"
                    type="text"
                    className="block text-sm w-full p-1 border-2 rounded-md outline-blue-700"
                    placeholder="Your post slug"
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
            {/* permalink */}
            <div className="flex items-center justify-start gap-1  text-sm font-text">
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
            </div>
            {/*display image  */}
            <div className="space-y-1 w-full font-text">
                <span className="block">Display Image</span>
                <Displayimage
                    url={image}
                    alt={imageCaption}
                    useCancle={true}
                    onCancle={() => {
                        setImage("");                        
                    }}
                    placeHolder={
                        <span
                            onClick={handleDisplayChangeMedia}
                            className="absolute top-0 bottom-0 right-0 left-0 h-[140px] w-[140px] border border-slate-200 bg-slate-200 rounded-md cursor-pointer"
                        ></span>
                    }
                    className="h-[140px] w-[140px] object-contain rounded cursor-pointer border"
                    onClick={handleDisplayChangeMedia}
                />
                <span className="block">
                    <input
                        type="text"
                        placeholder="Image caption..."
                        className="blcok text-xs w-[145px] px-2 py-1 border rounded-md"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                    />
                </span>
            </div>
            {/* publish button */}
            <div className="container fixed bottom-0 left-0 right-0 py-2 bg-white z-[8]">
                <div className="flex justify-center items-center">
                    {
                        (slug.trim() && title.trim()) || !isEmpty ?
                            <Button
                                fieldName={"Publish"}
                                className="font-text text-sm text-white font-semibold py-1.5 min-w-[180px] rounded-full transition-colors border-2 bg-green-600 shadow"
                                onClick={handlePublishBtn}
                            /> :
                            null
                    }

                </div>
            </div>
            {/* pop up message */}
            <div className="relative">
                <Popupmessage
                    className="max-w-40 text-start"
                    popUp={popUp}
                    setPopUp={setPopUp}
                    children={popUpMsg}
                />
            </div>
        </section>

        {/* loading screen */}
        <section>
            {/* Screen loading */}
            <Displayscreenloading
                loading={loadingUploadedLocalFile ||
                    loadingUploadedFileBlob ||
                    loadingUploadedPost ||
                    aiGenerateTopicLoading}
            />
        </section>

        {/* Display change media dialog */}
        <Displaychangemedia
            title="Select image from"
            dialog={displayChangeMedia}
            handleDialog={handleDisplayChangeMedia}
            viewMediaUrl={image}
            setGetMediaFromDevice={({ blob, tempUrl }) => {
                setBlob(blob);
                setImage(tempUrl);
                setIsEmpty(false);
            }}
            setGetMediaFromGalary={(urls) => { 
                if (fileFromGalaryRef.current === null) {                                
                    fileFromGalaryRef.current = apiEndPont + "/media/" + urls[0];
                } else {
                    setImage(apiEndPont + "/media/" + urls[0]);
                    setIsEmpty(false);                    
                }
            }}
            onCancelGetMediaFromGalary={() => {
                fileFromGalaryRef.current = undefined;
            }}
        />
    </>;
};

export default Addpost;

