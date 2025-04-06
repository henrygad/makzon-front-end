import { ReactElement, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

type Props = {
    url: string,
    setUrl?: React.Dispatch<React.SetStateAction<string>>
    alt?: string
    placeHolder?: string | ReactElement
    loadingPlaceHolder?: string | ReactElement
    className: string,
    parentClassName?: string,
    selected?: boolean
    removeSelection?: () => void
    useCancle: boolean,
    onCancle?: ()=> void
    onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void

};

const Displayimage = ({
    url,
    setUrl = () => undefined,
    alt,  
    placeHolder = "",
    loadingPlaceHolder = "",
    className,
    parentClassName,
    useCancle,
    onCancle = ()=> undefined,
    selected,
    removeSelection = () => undefined,
    onClick = () => undefined }: Props) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const DisplayLoading = () => {
        if (loadingPlaceHolder) {
            return loadingPlaceHolder;
        }
        return <span
            className="absolute top-0 bottom-0 right-0 left-0 border border-slate-200 bg-slate-200 animate-pulse rounded-md"></span>;
    };

    const Displayplaceholder = () => {
        if (placeHolder) {
            return placeHolder;
        }
        return <span
            className="absolute top-0 bottom-0 right-0 left-0 border border-slate-200 bg-slate-200 rounded-md"></span>;
    };

    return <span
        className={`${parentClassName} inline-block relative`}
    >
        <>
            {useCancle ? <span
                onClick=    {() => {
                    setUrl("");
                    onCancle();
                }}
                className={`${error || loading || !url.trim() ? "opacity-0" : ""} 
                absolute top-1 right-1 font-semibold text-sm cursor-pointer`}>
                <MdDeleteOutline size={12} />
            </span> :
                null
            }
            {selected ?
                <span
                    className={`${error || loading || !url.trim() ? "opacity-0" : ""} block absolute top-0 bottom-0 right-0 left-0 bg-blue-400 opacity-45 cursor-pointer`}
                    onClick={removeSelection}></span> :
                null}
            {/* image */}
            <img
                src={url}
                alt={alt}
                className={`${error || loading || !url.trim() ? "opacity-0" : ""} ${className}`}
                onLoadStart={() => {
                    setError(false);
                    setLoading(true);
                }}
                onLoad={() => {
                    setError(false);
                    setLoading(false);
                }}
                onError={() => {
                    setError(true);
                    setLoading(false);
                }}
                onClick={onClick}
            />
        </>
        {/* image loader placeholder*/}
        {loading ? <DisplayLoading /> : null}
        {/* error placeholder */}
        {error || !url.trim() ? <Displayplaceholder /> : null}
               
    </span>;
};

export default Displayimage;
