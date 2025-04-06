import { useRef, useState } from "react";
import { getSelectionProps, mediaProps } from "../../type";
import blockCmd from "../../commands/block.cmd";
import { RiFolderVideoLine } from "react-icons/ri";
import Model from "../../components/Model";
import Fileinput from "../../components/Fileinput";
import { Button } from "../../components/Button";
import Displayvideo from "../../components/Displayvideo";
import { IoMdImages } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Video = ({
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
    const [url, setUrl] = useState<string | ArrayBuffer>("");
    const [link, setLink] = useState("");
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);

    const handleInsertVideo = (url: string, style: string[]) => {
        if (!url) return;
        blockCmd("video", grapSelectionRef.current, { value: url, style });
        handleGlobalChangesOnInputArea();
        navigate(-1);
    };

    return <div id='add-video'>
        <button
            className='block cursor-pointer'
            onClick={() => {
                navigate("#insert-video");
                grapSelectionRef.current = getNodesWithinTextEditor();
            }}>
            <RiFolderVideoLine size={22} />
        </button>
        <Model
            id="insert-video"            
            children={
                <div className="relative font-text space-y-8 px-8 pb-8 rounded shadow-sm bg-white">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-3 right-3 text-red-800 font-bold text-sm cursor-pointer"
                    >
                        X
                    </button>
                    <div className="flex justify-center font-semibold">
                        <h2 className="text-2xl font-text">Add Video</h2>
                    </div>
                    <div className="w-full space-y-3">
                        {/* choose video */}
                        <input
                            type="text"
                            id="insert-video-url"
                            placeholder="Video url..."
                            className="text-sm w-full p-2 border rounded"
                            value={link}
                            onChange={(e) => {
                                setLink(e.target.value);
                                setUrl(e.target.value);
                            }}
                        />
                        <div className="flex flex-wrap items-center justify-start gap-6">
                            <Fileinput
                                id="choose-video"
                                accept="video/*"
                                type="video"
                                fieldName="Device"
                                className=""
                                handleGetFile={async (e) => {
                                    const url = await handleLocalFile(e);
                                    console.log(url);
                                    setUrl(url);
                                }}
                            />
                            <span className="text-sm text-center">
                                <button
                                    className="block text-white bg-orange-500 p-3 rounded-full shadow-sm cursor-pointer"
                                    onClick={() => navigate("#video-galary")}>
                                    <IoMdImages size={25} className="text-white" />
                                </button>
                                Galary
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        {/* add video style */}
                        <label
                            htmlFor="width"
                            className="flex items-center gap-2 text-base"
                        >
                            W
                            <input
                                type="number"
                                id="width"
                                className="text-sm w-[60px] p-1 border"
                                value={width}
                                onChange={(e) => setWidth(e.target.value as unknown as number)}
                            />
                        </label>
                        <label
                            htmlFor="height"
                            className="flex items-center gap-2 text-base"
                        >
                            H
                            <input
                                type="number"
                                id="height"
                                className="text-sm w-[60px] p-1 border"
                                value={height}
                                onChange={(e) => setHeight(e.target.value as unknown as number)}
                            />
                        </label>
                    </div>
                    <div className="w-full h-full">
                        {/* display video */}
                        <Displayvideo
                            url={url as string}
                            setUrl={setUrl as React.Dispatch<React.SetStateAction<string>>}
                            placeHolder={""}
                            useCancle={true}
                            className="min-w-[280px] h-[240px] rounded-md border"
                        />
                    </div>
                    <div className="w-full">
                        <Button
                            fieldName={"Add image"}
                            className="w-full bg-green-500 rounded-md text-white"
                            onClick={() => {
                                const style = `inline,w-[${width + "px"}],h-[${height + "px"}]`.split(",");                                
                                const videoUrl = url;
                                handleInsertVideo(videoUrl as string, style);
                            }}
                        />
                    </div>
                </div>
            }
        />
        <Model
            id="video-galary"            
            children={
                <div className="relative font-text shadow-sm bg-white">
                    <div
                        className="flex justify-center items-center gap-2 border-b shadow-sm p-2">
                        {/* header */}
                        <h2 className="text-2xl">Video galary</h2>
                        <span>
                            ({galary && galary.length})
                        </span>
                    </div>
                    <div
                        className="flex flex-wrap justify-center gap-2 p-6 h-auto w-auto min-w-full max-w-full max-h-[480px] md:max-h-[768px] overflow-auto">
                        {galary &&
                            galary.length ?
                            galary
                                .map((video, index) =>
                                    <Displayvideo
                                        useCancle={true}
                                        key={video.url + index}
                                        url={video.url}
                                        placeHolder={""}
                                        className="w-[200px] h-full cursor-pointer rounded-md"
                                        selected={video.url === select ? true : false}
                                        removeSelection={() => setSelect("")}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelect(video.url);
                                        }}
                                    />
                                ) :
                            <span>No video</span>
                        }
                    </div>
                    <div
                        className="flex justify-between items-center gap-2 border-t shadow-sm px-4 py-2">
                        {/* footer */}
                        <Button
                            id="go-back-galary-dialog"
                            fieldName={"Go back"}
                            className="bg-red-600 text-white text-sm rounded-md font-text"
                            onClick={() => navigate(-1)}
                        />
                        <Button
                            id="go-back-galary-dialog"
                            fieldName={<>Add {select ? (1) : null}</>}
                            className={`bg-green-600 text-white text-sm rounded-md font-text ${select.trim() ? "cursor-pointer" : ""}`}
                            onClick={() => {
                                setUrl(select);
                                setSelect("");
                                navigate(-1);
                            }}
                            disabled={!select.trim()}
                        />

                    </div>
                </div>
            }
        />
    </div>;
};

export default Video;
