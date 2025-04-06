import { useEffect, useRef, useState } from "react";
import { GoLink, GoUnlink } from "react-icons/go";
import { anchorLinkProps, getSelectionProps } from "../../type";
import inlineCmd from "../../commands/inline.cmd";
import Model from "../../components/Model";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Anchorlink = ({
    getNodesWithinTextEditor,
    handleGlobalChangesOnInputArea,
    targetNode,
}: anchorLinkProps) => {
    const navigate = useNavigate();
    const [link, setLink] = useState("");
    const inputLinkRef = useRef<HTMLInputElement | null>(null);
    const grapSelectionRef = useRef<getSelectionProps>({
        selection: null,
        range: undefined,
        node: undefined,
        textNode: undefined,
    });
    const [isHighlight, setIsHighlight] = useState(false);

    const handleStayHighlidted = (highlight: boolean) => {
        const { textNode } = grapSelectionRef.current;
        if (textNode && textNode.parentElement) {
            if (highlight) {
                textNode.parentElement.classList.remove("block");
                textNode.parentElement.classList.add(...["inline", "text-white", "bg-blue-800", "py-0.5"]);
            } else {
                textNode.parentElement.classList.remove(...["inline", "text-white", "bg-blue-800", "py-0.5"]);
                textNode.parentElement.classList.add("block");
            }
        }
    };

    const handleAnchorLink = (command: string, value: string, style: string[]) => {
        if (command === "anchor") {
            if (!value) return;
            inlineCmd(command, grapSelectionRef.current, { value, style });
            handleGlobalChangesOnInputArea();
        } else {
            inlineCmd(command, getNodesWithinTextEditor(), { value, style });
            handleGlobalChangesOnInputArea();
        }
    };

    const handleCreateLinkForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleAnchorLink("anchor", link, ["text-blue-900", "underline"]);
        handleStayHighlidted(false);
        setLink("");
        setIsHighlight(false);
        navigate(-1);
    };

    useEffect(() => {
        document.addEventListener("click", () => handleStayHighlidted(isHighlight));
        return () => {
            document.removeEventListener("click", () => handleStayHighlidted(isHighlight));
        };
    }, [isHighlight]);

    return <div id="anchor">
        {targetNode &&
            targetNode.parentElement &&
            targetNode.parentElement.tagName.toLowerCase() === "a" &&
            !targetNode.parentElement.className.includes("special-character") ?
            <>
                <button id='unlink' className='' onClick={() => handleAnchorLink("unanchor", "", [])}>
                    <GoUnlink size={16} />
                </button>
            </> :
            <>
                <button
                    className='block cursor-pointer'
                    onClick={() => {
                        navigate("#create-link");
                        setIsHighlight(true);
                        grapSelectionRef.current = getNodesWithinTextEditor();
                    }}>
                    <GoLink size={16} />
                </button>
                <Model
                    id="create-link"
                    children={
                        <form
                            onSubmit={handleCreateLinkForm}
                            className="relative space-y-3 p-6 rounded shadow-sm bg-white z-0"
                        >
                            <span
                                onClick={() => navigate(-1)}
                                className="absolute top-3 right-3 text-red-800 font-bold text-sm cursor-pointer"
                            >
                                X
                            </span>
                            <label
                                htmlFor="link"
                                className="space-y-1 text-base font-text"
                            >
                                <p >Add link</p>
                                <input
                                    id="link"
                                    ref={inputLinkRef}
                                    type="text" placeholder="www.yourlink.com"
                                    autoFocus={true}
                                    className="border border-gray-600 px-2  py-1 rounded-md bg-transparent"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </label>
                            <div className="flex justify-center w-full h-full">
                                <Button
                                    id="create-link"
                                    fieldName="Create"
                                    className="w-full bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 "
                                />

                            </div>
                        </form>
                    }
                />
            </>
        }
    </div>;
};

export default Anchorlink;
