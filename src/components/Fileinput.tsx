import { RiImageAddLine, RiVideoAddLine } from "react-icons/ri";

type Props = {
    id: string
    accept: string
    type: string,
    fieldName: string,
    className?: string
    onClick?: () => void
    handleGetFile: (files: FileList | null) => void;
}

const Fileinput = ({ id, accept, type, fieldName, className = "", handleGetFile, onClick = () => null }: Props) => {

    const FileDisplayIcon = () => {
        if (fieldName) {
            return <button className="font-text text-nowrap whitespace-pre text-sm cursor-pointer">{fieldName}</button>;
        } else {
            if (type === "video") {
                return <RiVideoAddLine size={25} className="text-white cursor-pointer" />;
            } else {
                return <RiImageAddLine size={25} className="text-white cursor-pointer" />;
            }
        }
    };

    return <label
        htmlFor={id}
        className="relative overflow-hidden"
    >
        <FileDisplayIcon />
        <input
            id={id}
            type="file"
            accept={accept}
            className={`${className} min-w-0 absolute right-0 opacity-0 cursor-pointer`}
            onClick={onClick}
            onChange={(e) => handleGetFile(e.target.files)}
        />

    </label>;
};

export default Fileinput;
