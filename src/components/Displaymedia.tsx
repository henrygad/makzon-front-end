import { useNavigate } from "react-router-dom";
import mediaProps from "../types/file.type";
import { useAppDispatch } from "../redux";
import Displayimage from "./Displayimage";
import { addToDisplaySingleMedia, addToMediaSelections, displayMediaOptions, removeFromMediaSelections } from "../redux/slices/userMediaSlices";
import Displayvideo from "./Displayvideo";

const Displaymedia = ({ media, isSelect, handleDelete, mediaSelections }:
    { media: mediaProps, isSelect: boolean, mediaSelections: mediaProps[] | undefined, handleDelete: (_id: string) => void }) => {

    const navigate = useNavigate();
    const appDispatch = useAppDispatch();

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
    } else if (
        media.type &&
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

export default Displaymedia;
