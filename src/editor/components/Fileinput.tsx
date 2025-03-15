import { RiImageAddLine, RiVideoAddLine } from "react-icons/ri";

type Props = {
    id: string
    accept: string
    type: string,
    fieldName: string,
    className: string
    handleGetFile: (files: FileList | null) => void;
}

const Fileinput = ({ id, accept, type, fieldName,  className, handleGetFile }: Props) => {
    const FileDisplayIcon = ({ type }: { type: string }) => {
        if (type === "video") {
            return <RiVideoAddLine size={25} className="text-white cursor-pointer"/>;
        } else {
            return <RiImageAddLine size={25} className="text-white cursor-pointer" />;            
        }
    };
    
    return <label htmlFor={id} className="text-sm font-text text-center">        
        <span
            className="block relative  bg-green-500 p-3 rounded-full shadow-sm overflow-hidden">
            <FileDisplayIcon type={type} />
            <input
                id={id}
                type="file"
                accept={accept}
                placeholder="hi"
                className={`${className} absolute top-0 bottom-0 opacity-0 cursor-pointer `}
                onChange={(e) => handleGetFile(e.target.files)}
            />
        </span>
        {fieldName}
    </label>; 
};

export default Fileinput;
