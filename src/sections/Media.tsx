import { useNavigate } from "react-router-dom";
import Displayimage from "../components/Displayimage";
import Displayvideo from "../components/Displayvideo";
import { useAppDispatch, useAppSelector } from "../redux";
import { addToDisplaySingleMedia, addToMediaSelections, clearAllSelectedMedia, deleteMdia, displayMediaOptions, removeFromMediaSelections } from "../redux/slices/userMediaSlices";
import mediaProps from "../types/file.type";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";


const Media = () => {
    const navigate = useNavigate();
    const { data: Media, loading, mediaSelections } = useAppSelector(state => state.userMediaSlices.media);
    const appDispatch = useAppDispatch();

    const [isSelect, setIsSelect] = useState(false);


    const handleDelete = (_id: string) => {
        const Getmedia: mediaProps[] = JSON.parse(localStorage.getItem("media") || "[]");
        localStorage.setItem("media", JSON.stringify(Getmedia.filter(md => md._id !== _id)));
        appDispatch(deleteMdia({ _id }));
        appDispatch(clearAllSelectedMedia([]));
    };

    const handleSelectAll = () => {
        if (Media) {
            Media.map(md => {
                appDispatch(addToMediaSelections({ ...md }));
            });
        }
    };

    const handleMultipleMediaDelete = () => {
        if (mediaSelections) {
            mediaSelections.map(md => {
                handleDelete(md._id);
            });
        }
    };

    const Displaymedia = ({ media }: { media: mediaProps }) => {
        if (media.type &&
            media.type.toLowerCase() === "image"
        ) {
            return <Displayimage
                url={media.url}
                className={`w-[120px] h-[120px] object-contain border ${isSelect ? "border-blue-100 p-1" : ""} rounded-md cursor-pointer`}
                selected={mediaSelections &&
                    mediaSelections.map(md => md._id).includes(media._id)
                }
                removeSelection={() => appDispatch(removeFromMediaSelections({ ...media }))}
                useCancle={!isSelect}
                onCancle={() => handleDelete(media._id)}
                onClick={() => {
                    if (!isSelect) {
                        appDispatch(addToDisplaySingleMedia({ url: media.url, _id: media._id, type: "image", mime: "png" }));
                        appDispatch(displayMediaOptions({
                            negativeNavigate: "#media",
                        }));
                        navigate("#single-image");
                    } else {
                        appDispatch(addToMediaSelections({ ...media }));
                    }
                }}
            />;
        } else if (media.type &&
            media.type.toLowerCase() === "video") {
            return <Displayvideo
                url={media.url}
                className={`w-[220px] h-[200px] object-contain border ${isSelect ? "border-blue-100 p-1" : ""} rounded-md cursor-pointer`}
                useCancle={!isSelect}
                selected={mediaSelections &&
                    mediaSelections.map(md => md._id).includes(media._id)
                }
                removeSelection={() => appDispatch(removeFromMediaSelections({ ...media }))}
                onCancle={() => handleDelete(media._id)}
                onClick={() => {
                    if (!isSelect) {
                        appDispatch(addToDisplaySingleMedia({ url: media.url, _id: media._id, type: "vedio", mime: "vm" }));
                        appDispatch(displayMediaOptions({
                            negativeNavigate: "#media",
                        }));
                        navigate("#single-image");
                    } else {
                        appDispatch(addToMediaSelections({ ...media }));
                    }
                }}
            />;
        }
        return null;
    };

    return <div>
        <menu className="flex items-center justify-betweenbg-gray-50 border py-1 px-3 mb-3 rounded shadow-sm">
            {isSelect &&
                mediaSelections &&
                mediaSelections?.length ? <ul>
                <li>
                    <button
                        className="flex items-center gap-1"
                        onClick={() => handleMultipleMediaDelete()}
                    >
                        <MdDeleteOutline size={18} />
                        ({mediaSelections &&
                            mediaSelections.length || 0})
                    </button>
                </li>
            </ul> :
                null
            }
            <ul className="flex-1 flex justify-end gap-4">
                <li>
                    {
                        isSelect ?
                            <button
                                className="text-sm font-text font-semibold text-blue-600 "
                                onClick={() => handleSelectAll()}
                            >Select all</button> :
                            <button
                                className="text-sm font-text font-semibold text-blue-600"
                                onClick={() => setIsSelect(true)}
                            >Select</button>
                    }
                </li>
                {isSelect ?
                    <li> <button
                        className="text-base font-text font-bold text-red-700"
                        onClick={() => {
                            setIsSelect(false);
                            appDispatch(clearAllSelectedMedia([]));
                        }}
                    >
                        X
                    </button></li> :
                    null
                }
            </ul>
        </menu>
        <div className={`flex flex-wrap items-center gap-2 ${isSelect ? "p-3" : ""}`}>
            {!loading ?
                Media &&
                    Media.length ?
                    Media.map(md =>
                        <Displaymedia key={md._id} media={md} />
                    ) :
                    <div>No media yet</div> :
                <div>loading...</div>
            }
        </div>
    </div>;
};

export default Media;
