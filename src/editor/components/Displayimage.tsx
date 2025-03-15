import { ReactElement, useState } from "react";

type Props = {
    url: string,
    setUrl?: React.Dispatch<React.SetStateAction<string>>    
    caption?: string,
    placeHolder?: string | ReactElement
    className: string,
    selected?: boolean
    removeSelection?: () => void
    useCancle: boolean,
    onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
};

const Displayimage = ({
    url,
    setUrl = () => undefined,    
    caption = "",    
    placeHolder = "",
    className,
    useCancle,
    selected,
    removeSelection = () => undefined,
    onClick = () => undefined }: Props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const DisplayLoading = () => {
        return <span
            className="absolute top-0 bottom-0 right-0 left-0 border border-slate-200 bg-slate-200 animate-pulse rounded-md"></span>;
    };

    const Displayplaceholder = () => {
        if (placeHolder) {
            return placeHolder;
        }
        return <span className="absolute top-0 bottom-0 right-0 left-0 border border-slate-200 bg-slate-200 rounded-md"></span>;
    };

    return <span className="flex flex-col justify-start items-start relative h-auto w-auto">
        <span
            className={`block relative ${error || loading || !url.trim() ? "opacity-0" : ""}`}
        >
            {useCancle ? <span
                onClick={() => setUrl("")}
                className="absolute top-1 right-2 font-semibold text-sm cursor-pointer">
                x
            </span> :
                null
            }
            {selected ?
                <span
                    className="block absolute top-0 bottom-0 right-0 left-0 bg-blue-400 opacity-45 cursor-pointer"
                    onClick={removeSelection}></span> :
                null}
            {/* image */}
            <img
                src={url}
                alt={caption}
                className={`${className}`}
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
        </span>
        {/* image loader placeholder*/}
        {loading ? <DisplayLoading /> : null}
        {/* error placeholder */}
        {error || !url.trim() ? <Displayplaceholder /> : null}        
    </span>;
};

export default Displayimage;
// www.example.com/images/1