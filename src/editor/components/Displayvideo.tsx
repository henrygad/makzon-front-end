import { ReactElement, useState } from "react";

type Props = {
    url: string,
    setUrl?: React.Dispatch<React.SetStateAction<string>>
    placeHolder?: string | ReactElement
    className: string,
    selected?: boolean
    removeSelection?: () => void
    useCancle?: boolean,
    onCancle?: ()=>void,
    onClick?: (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => void

};


const Displayvideo = ({
    url,
    setUrl = () => null,
    placeHolder,
    className,
    selected,
    removeSelection = () => null,
    useCancle,
    onCancle = ()=> {},
    onClick = () => null
}: Props) => {
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

    return <span className="inline-block relative h-auto w-auto">
        <span
            className={`inline-block relative ${(error || loading || !url.trim()) ? "opacity-0" : ""}`}
        >
            {useCancle ?
                <span
                    className="absolute top-1 right-2 font-semibold text-sm text-white cursor-pointer z-10"
                    onClick={() => {
                        setUrl("");
                        onCancle();
                        
                    }}
                >
                    x
                </span> :
                null
            }
            {selected ?
                <span
                    className="block absolute top-0 bottom-0 right-0 left-0 bg-blue-400 opacity-45 cursor-pointer"
                    onClick={removeSelection}></span> :
                null
            }
            {/* display video */}
            <video
                src={url}
                controls
                className={className}
                onLoadStart={() => {
                    setError(false);
                    setLoading(true);
                }}                 
                onLoadedData={() => {
                    setError(false);
                    setLoading(false);
                }}                
                
                onError={() => {
                    setError(true);
                    setLoading(false);
                }}
                onClick={onClick}
            >
            </video>
        </span>
        {/* image loader placeholder*/}
        {loading ? <DisplayLoading /> : null}
        {/* error placeholder */}
        {(error || !url.trim()) ? <Displayplaceholder /> : null}
    </span>;
};

export default Displayvideo;
