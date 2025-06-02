import { useNavigate } from "react-router-dom";
import mediaProps from "../types/media.type";
import Displayimage from "./Displayimage";
import Displayvideo from "./Displayvideo";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Displaymedia = ({
    media,
    useSelect,
    selectMedia,
    setSelectMedia,
    handleDelete = () => null,
}: {
    media: mediaProps;
    useSelect: boolean;
    selectMedia: mediaProps[];
    setSelectMedia: React.Dispatch<React.SetStateAction<mediaProps[]>>
    handleDelete?: (_id: string) => void;
}) => {
    const navigate = useNavigate();

    if (media.mimetype.includes("image")) {
        return (
            <Displayimage
                url={apiEndPont + "/media/" + media.filename}
                className={`w-[100px] h-[100px] object-contain border ${useSelect ? "border-blue-100 p-1" : ""} rounded-md cursor-pointer`}
                selected={selectMedia.find(md => md.filename === media.filename) ? true : false}
                useCancle={!useSelect}
                removeSelection={() => setSelectMedia(pre => pre.filter(md => md.filename !== media.filename))}
                onClick={() => {
                    if (useSelect) {
                        setSelectMedia(pre => ([...pre, media]));
                    } else {
                        navigate(`?url=${apiEndPont + "/media/" + media.fieldname}&type=image#single-image`);
                    }
                }}
                onCancle={() => handleDelete(media._id)}
            />
        );
    }
    
    if (media.mimetype.includes("video")) {
        return (
            <Displayvideo
                url={apiEndPont + "/media/" + media.filename}
                className={`w-[100px] h-[100px] object-contain border ${useSelect ? "border-blue-100 p-1" : ""} rounded-md cursor-pointer`} useCancle={!useSelect}
                selected={selectMedia.find(md => md.filename === media.filename) ? true : false}
                removeSelection={() => setSelectMedia(pre => pre.filter(md => md.filename !== media.filename))}
                onClick={() => {
                    if (useSelect) {
                        setSelectMedia(pre => ([...pre, media]));
                    } else {
                        navigate(`?url=${apiEndPont + "/media/" + media.fieldname}&type=video#single-image`);
                    }
                }}
                onCancle={() => handleDelete(media._id)}
            />
        );
    }
};

export default Displaymedia;
