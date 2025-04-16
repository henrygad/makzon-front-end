import { ReactElement, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

type Props = {
    url: string,   
    alt?: string
    placeHolder?: ReactElement
    loadingPlaceHolder?: ReactElement
    parentClassName?: string,
    className: string,       
    useCancle: boolean,
    onCancle?: (url: string) => void
    onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void

};

const Displayimage = ({
    url,
    alt,
    placeHolder,
    loadingPlaceHolder,
    parentClassName,
    className,
    useCancle,
    onCancle = () => undefined,   
    onClick = () => undefined }: Props) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const DisplayLoading = () => {
         if (loadingPlaceHolder) {
             return loadingPlaceHolder;
         }
        return <span className="absolute top-0 bottom-0 right-0 left-0 border border-slate-200 bg-slate-200 animate-pulse rounded-md"></span>;
    };

    const Displayplaceholder = () => {
        if (placeHolder) {
            return placeHolder;
        }
        return <span className="absolute top-0 bottom-0 right-0 left-0 border border-slate-200 bg-slate-200 rounded-md"></span>;
    };

    return <span className={`${parentClassName} inline-block relative`} >
        <>
            {/* use cancle */}
            {useCancle ?
                <span
                    onClick={() => onCancle(url)}
                    className={`${error || loading ? "opacity-0" : ""} absolute top-2 right-2 font-semibold text-sm cursor-pointer`}
                >
                    <MdDeleteOutline color="red" size={14} />
                </span> :
                null
            }         
            {/* image */}
            <img
                src={url || " "}
                alt={alt}
                className={`${error || loading ? "opacity-0" : ""} ${className} border`}                
                onError={() => {
                    setLoading(false);
                    setError(true);

                }}                           
                onLoad={() => {
                    setLoading(false);
                    setError(false);
                }}
                onClick={onClick}
            />
        </>
        {/* loader placeholder*/}
        {loading ?
            <DisplayLoading /> :
            <>
                {/* error placeholder */}
                {error ?
                    <Displayplaceholder /> :
                    null
                }
            </>
        }
    </span>;
};

export default Displayimage;
