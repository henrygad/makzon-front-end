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
                <div className="font-text px-8 rounded shadow-sm bg-white">
                    <header className="relative my-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute top-3 right-3 text-red-800 font-bold text-sm cursor-pointer"
                        >
                            X
                        </button>
                        <div className="flex justify-center font-semibold">
                            <h2 className="text-2xl font-text">Add Video</h2>
                        </div>
                    </header>
                    <main className="space-y-6">
                        {/* add video */}
                        <div className="w-full space-y-3">
                            {/* by tying video link */}
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
                            {/* more options to add video */}
                            <span className="flex flex-wrap items-center justify-start gap-6">
                                {/* from local decive */}
                                <Fileinput
                                    id="choose-video-from-decive"
                                    accept="video/*"
                                    type="video"
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
                                {/* from avaliable images */}
                                <span className="text-sm text-center">
                                    <button
                                        className="block text-white bg-orange-500 p-3 rounded-full shadow-sm cursor-pointer"
                                        onClick={async () => {
                                            try {
                                                const videoUrlFromGalary = await handleGalaryFile();
                                                setUrl(videoUrlFromGalary);
                                                setBlob(videoUrlFromGalary);
                                                setLink("");
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        }}
                                    >
                                        <IoMdImages size={25} className="text-white" />
                                    </button>
                                    Galary
                                </span>
                            </span>
                        </div>
                        {/* add video style */}
                        <div className="flex flex-wrap gap-6">
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
                        {/* display video */}
                        <div className="w-full h-full">
                            <Displayvideo
                                url={url as string}
                                setUrl={setUrl as React.Dispatch<React.SetStateAction<string>>}
                                placeHolder={""}
                                useCancle={true}
                                className="min-w-[280px] h-[240px] rounded-md border"
                            />
                        </div>
                    </main>
                    <footer className="my-6">
                        <Button
                            fieldName={"Add image"}
                            className="w-full bg-green-500 rounded-md text-white"
                            onClick={async() => {
                                try {
                                    const getUrl = await onFileAdd(blob);
                                    if (!getUrl.trim()) throw new Error("Image fail to upload");
                                    const style = `inline,w-[${width + "px"}],h-[${height + "px"}]`.split(",");                                    
                                    handleInsertVideo(getUrl, style);
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
    </div>;
};

export default Video;
