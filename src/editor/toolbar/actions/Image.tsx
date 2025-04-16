import { useRef, useState } from "react";
import { getSelectionProps, mediaProps } from "../../type";
import { RiFolderImageLine } from "react-icons/ri";
import Model from "../../components/Model";
import blockCmd from "../../commands/block.cmd";
import Fileinput from "../../components/Fileinput";
import { Button } from "../../components/Button";
import Displayimage from "../../components/Displayimage";
import { IoMdImages } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Image = ({
    getNodesWithinTextEditor,
    handleGlobalChangesOnInputArea,
    handleLocalFile = async () => "",
    handleGalaryFile = async () => "",
    onFileAdd = async () => "",
}: mediaProps) => {
    const navigate = useNavigate();
    const grapSelectionRef = useRef<getSelectionProps>({
        selection: null,
        range: undefined,
        node: undefined,
        textNode: undefined,
    });

    const [blob, setBlob] = useState<Blob | string>("");
    const [url, setUrl] = useState<string | ArrayBuffer>("");
    const [link, setLink] = useState("");
    const [alt, setAlt] = useState("");
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [position, setPosition] = useState("contain");

    const handleInserImage = (url: string, style: string[]) => {
        if (!url) return;
        blockCmd("image", grapSelectionRef.current, { value: url, style });
        handleGlobalChangesOnInputArea();
        navigate(-1);
    };

    return (
        <div id="add-image">
            <button
                className="block cursor-pointer"
                onClick={() => {
                    navigate("#insert-image");
                    grapSelectionRef.current = getNodesWithinTextEditor();
                }}
            >
                <RiFolderImageLine size={22} />
            </button>
            <Model
                id="insert-image"
                children={
                    <div className="font-text px-8 rounded shadow-sm bg-white">
                        <header className="relative my-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="absolute top-3 right-3 text-red-800 font-bold text-sm cursor-pointer"
                            >
                                X
                            </button>
                            <div className="flex justify-center font-semibold">
                                <h2 className="text-2xl font-text">Add Image</h2>
                            </div>
                        </header>
                        <main className="space-y-6">
                            {/* add image */}
                            <div className="w-full space-y-3">
                                {/* by  typing url */}
                                <input
                                    type="text"
                                    id="insert-url"
                                    placeholder="Image url..."
                                    className="text-sm w-full p-2 border rounded"
                                    value={link}
                                    onChange={(e) => {
                                        setLink(e.target.value);
                                        setUrl(e.target.value);
                                    }}
                                />
                                {/* more options to add image*/}
                                <span className="flex flex-wrap items-center justify-start gap-6">
                                    {/* from device */}
                                    <Fileinput
                                        id="choose-image-from-device"
                                        accept="image/png, image/gif, image/jpeg"
                                        type="image"
                                        fieldName="Device"
                                        className=""
                                        handleGetFile={async (e) => {
                                            try {
                                                if (!e) throw new Error("file was not choose");
                                                setBlob(e[0]);
                                                const url = await handleLocalFile(e);
                                                setUrl(url);
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        }}
                                    />
                                    {/* from avalibale images */}
                                    <span className="text-sm text-center">
                                        <button
                                            className="block text-white bg-orange-500 p-3 rounded-full shadow-sm cursor-pointer"
                                            onClick={async () => {
                                                try {
                                                    const imageUrlFromGalary = await handleGalaryFile();                                                    
                                                    setUrl(imageUrlFromGalary);
                                                    setBlob(imageUrlFromGalary);
                                                    setLink("");
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                            }}>
                                            <IoMdImages size={25} className="text-white" />
                                        </button>
                                        Galary
                                    </span>
                                </span>
                            </div>
                            {/* add image info */}
                            <div className="space-y-4">
                                <label
                                    htmlFor="alt"
                                    className="flex items-center gap-2 w-full text-base "
                                >
                                    Caption
                                    <input
                                        type="text"
                                        id="alt"
                                        className="w-full p-2 border text-sm"
                                        value={alt}
                                        placeholder="Alt..."
                                        onChange={(e) => setAlt(e.target.value)}
                                    />
                                </label>
                                <div className="flex flex-wrap gap-6">
                                    <label
                                        htmlFor="image-width"
                                        className="flex items-center gap-2 text-base"
                                    >
                                        W
                                        <input
                                            type="number"
                                            id="image-width"
                                            className="text-sm w-[60px] p-1 border"
                                            value={width}
                                            onChange={(e) => setWidth(e.target.value as unknown as number)}
                                        />
                                    </label>
                                    <label
                                        htmlFor="image-height"
                                        className="flex items-center gap-2 text-base"
                                    >
                                        H
                                        <input
                                            type="number"
                                            id="image-height"
                                            className="text-sm w-[60px] p-1 border"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value as unknown as number)}
                                        />
                                    </label>
                                    <label
                                        htmlFor="image-style"
                                        className="flex items-center gap-2 text-base"
                                    >
                                        P
                                        <select
                                            id="image-style"
                                            className=" w-[90px] p-1 text-sm border"
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                        >
                                            <option value="object-none">None</option>
                                            <option value="object-contain">Contain</option>
                                            <option value="object-cover">Cover</option>
                                            <option value="object-fill">Fill</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                            {/* display choosen image */}
                            <div>
                                <Displayimage
                                    url={url as string}                                    
                                    alt={alt}
                                    useCancle={true}
                                    onCancle={()=> setUrl("")}                                    
                                    className={`w-[120px] h-[120px] ${position} border rounded-md`}
                                />
                            </div>
                        </main>
                        {/* add image btn */}
                        <footer className="w-ful my-6">
                            <Button
                                fieldName={"Add image"}
                                className="w-full bg-green-500 rounded-md text-white"
                                onClick={async () => {
                                    try {
                                        const getUrl = await onFileAdd(blob);                                        
                                        const style = `inline,w-[${width + "px"}],h-[${height + "px"}],${position}`.split(",");
                                        const imageUrl = getUrl + "=" + alt;
                                        handleInserImage(imageUrl, style);
                                        setBlob(getUrl);
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                            />
                        </footer>
                    </div>
                }
            />
        </div>
    );
};

export default Image;
