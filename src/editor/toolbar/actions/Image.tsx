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
    galary = [],
}: mediaProps) => {
    const navigate = useNavigate();
    const [select, setSelect] = useState("");
    const grapSelectionRef = useRef<getSelectionProps>({
        selection: null,
        range: undefined,
        node: undefined,
        textNode: undefined,
    });
    const [url, setUrl] = useState("");
    const [link, setLink] = useState("");
    const [alt, setAlt] = useState("");
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [position, setPosition] = useState("contain");    

    const handleInserImage = (url: string, style: string[]) => {
        if (!url) return;
        blockCmd("image", grapSelectionRef.current, { value: url, style });
        handleGlobalChangesOnInputArea();
        navigate("");
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
                    <div className="relative font-text space-y-8 px-8 pb-8 rounded shadow-sm bg-white">
                        <button
                            onClick={() => navigate("")}
                            className="absolute top-3 right-3 text-red-800 font-bold text-sm cursor-pointer"
                        >
                            X
                        </button>
                        <div className="flex justify-center font-semibold">
                            <h2 className="text-2xl font-text">Add Image</h2>
                        </div>
                        <div className="w-full space-y-3">
                            {/* choose image */}
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
                            <div className="flex flex-wrap items-center justify-start gap-6">
                                <Fileinput
                                    id="choose-image"
                                    accept="image/png, image/gif, image/jpeg"
                                    type="image"
                                    fieldName="Device"
                                    className=""
                                    handleGetFile={async (e) => {                                        
                                        const url = await handleLocalFile(e);
                                        setUrl(url as string);
                                    }}
                                />
                                <span className="text-sm text-center">
                                    <button
                                        className="block text-white bg-orange-500 p-3 rounded-full shadow-sm cursor-pointer"
                                        onClick={() => navigate("#image-galary")}>
                                        <IoMdImages size={25} className="text-white" />
                                    </button>
                                    Galary
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* add image info */}
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
                        <div>
                            {/* display image */}
                            <Displayimage
                                url={url as string}
                                setUrl={setUrl as React.Dispatch<React.SetStateAction<string>>}
                                placeHolder = {<span className="absolute top-0 bottom-0 right-0 left-0 h-[120px] w-[120px] border border-slate-200 bg-slate-200 rounded-md"></span>}
                                className={`w-[120px] h-[120px] ${position} border rounded-md`}
                                useCancle={true}
                                caption={alt}                                                                
                            />
                        </div>
                        <div className="w-full">
                            <Button
                                fieldName={"Add image"}
                                className="w-full bg-green-500 rounded-md text-white"
                                onClick={() => {
                                    const style = `inline,w-[${width + "px"}],h-[${height + "px"}],${position}`.split(",");
                                    const imageUrl = url + "=" + alt;
                                    handleInserImage(imageUrl, style);
                                }}
                            />
                        </div>
                    </div>
                }
            />
            <Model
                id="image-galary"       
                children={
                    <div className="relative font-text shadow-sm bg-white">
                        <div
                            className="flex justify-center items-center gap-2 border-b shadow-sm p-2">
                            {/* header */}
                            <h2 className="text-2xl">Image galary</h2>
                            <span>
                                ({galary && galary.length})
                            </span>
                        </div>
                        <div
                            className="flex flex-wrap justify-center gap-2 p-6 h-auto w-auto min-w-full max-w-full max-h-[480px] md:max-h-[768px] overflow-auto">
                            {galary &&
                                galary.length ?
                                galary.map((image, index) =>
                                    <Displayimage
                                        key={image.url + index}
                                        url={image.url}
                                        useCancle={false}
                                        className="w-[120px] h-[120px] object-contain border rounded-md cursor-pointer"
                                        selected={image.url === select ? true : false}
                                        removeSelection={() => setSelect("")}
                                        onClick={() => setSelect(image.url)}
                                    />
                                ) :
                                <span>No Image</span>
                            }
                        </div>
                        <div
                            className="flex justify-between items-center gap-2 border-t shadow-sm px-4 py-2">
                            {/* footer */}
                            <Button
                                id="go-back-galary-dialog"
                                fieldName={"Go back"}
                                className="bg-red-600 text-white text-sm rounded-md font-text"
                                onClick={() => navigate("#insert-image")}
                            />
                            <Button
                                id="go-back-galary-dialog"
                                fieldName={<>Add {select ? (1) : null}</>}
                                className={`bg-green-600 text-white text-sm rounded-md font-text ${select.trim() ? "cursor-pointer" : ""}`}
                                onClick={() => {
                                    setUrl(select);
                                    setSelect("");
                                    navigate("#insert-image");
                                }}
                                disabled={!select.trim()}
                            />

                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default Image;
