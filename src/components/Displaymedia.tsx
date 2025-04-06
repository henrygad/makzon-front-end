import { useNavigate } from "react-router-dom";
import mediaProps from "../types/media.type";
import { useAppDispatch, useAppSelector } from "../redux";
import Displayimage from "./Displayimage";
import { addSelectedMedia, removeSelectedMedia} from "../redux/slices/userMediaSlices";
import Displayvideo from "./Displayvideo";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Displaymedia = ({
    media,
    useSelect,
    handleDelete = () => null,
}: {
    media: mediaProps;
    useSelect: boolean;    
    handleDelete?: (_id: string) => void;
}) => {
    const navigate = useNavigate();
    const {selectedMedia} = useAppSelector(state => state.userMediaSlices.media);
    const appDispatch = useAppDispatch();

    if (!media) return null;

    if (media.mimetype.includes("image")) {
        return (
            <Displayimage
                url={apiEndPont + "/media/" + media.fieldname}
                className={`w-[120px] h-[120px] object-contain border ${useSelect ? "border-blue-100 p-1" : ""} rounded-md cursor-pointer`}
                selected={selectedMedia && selectedMedia.map((md) => md.filename).includes(media.fieldname)}
                useCancle={!useSelect}
                removeSelection={() => appDispatch(removeSelectedMedia({ _id: media._id }))}
                onCancle={() => handleDelete(media._id)}
                onClick={() => {
                    if (useSelect) {
                        appDispatch(addSelectedMedia({...media}));                        
                    } else {                        
                        navigate(`?url=${apiEndPont+"/media/"+ media.fieldname}&type=image#single-image`);
                    }
                }}
            />
        );
    } else if (media.mimetype.includes("video")) {
        return (
            <Displayvideo
                url={apiEndPont + "/media/" + media.fieldname}
                className={`w-[220px] h-[200px] object-contain border ${useSelect ? "border-blue-100 p-1" : ""} rounded-md cursor-pointer`}useCancle={!useSelect}
                selected={selectedMedia && selectedMedia.map((md) => md.filename).includes(media.fieldname)}
                removeSelection={() => appDispatch(removeSelectedMedia({ _id: media._id }))}
                onCancle={() => handleDelete(media._id)}
                onClick={() => {
                    if (useSelect) {
                        appDispatch(addSelectedMedia({ ...media }));
                    } else {                        
                        navigate(`?url=${apiEndPont + "/media/" + media.fieldname}&type=video#single-image`);
                    }
                }}
            />
        );
    }
};

export default Displaymedia;
