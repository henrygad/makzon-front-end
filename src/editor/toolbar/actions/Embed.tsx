import { useRef, useState } from "react";
import { actionsProps, getSelectionProps } from "../../type";
import Dialog from "../../components/Model";
import { Button } from "../../components/Button";
import blockCmd from "../../commands/block.cmd";
import { useNavigate } from "react-router-dom";

const Embed = ({
    getNodesWithinTextEditor,
    handleGlobalChangesOnInputArea
}: actionsProps) => {
    const navigate = useNavigate();
    const [embed, setEmbed] = useState("");
    const grapSelectionRef = useRef<getSelectionProps>({
        selection: null,
        range: undefined,
        node: undefined,
        textNode: undefined,
    });

    const handleEmbedForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!embed) return;
        blockCmd("embed", grapSelectionRef.current, { value: embed, style: [] });
        handleGlobalChangesOnInputArea();
        setEmbed("");
        navigate(-1);
    };
    
    return <div id='embedCode' >
        <button className='text-base cursor-pointer' onClick={() => {
            navigate("#embed-content");
            grapSelectionRef.current = getNodesWithinTextEditor();
        }}>
            {"</>"}
        </button>
        <Dialog
            id="embed-content"
            children={
                <form
                    onSubmit={handleEmbedForm}
                    className="relative space-y-3 p-6 rounded shadow-sm bg-white z-0"
                >
                    <span
                        onClick={() => navigate(-1)}
                        className="absolute top-3 right-3 text-red-800 font-bold text-sm cursor-pointer"
                    >
                        X
                    </span>
                    <label id="embed-code" className="space-y-2">
                        Embed Code
                        <textarea
                            id='embed-code'
                            placeholder='Embed...'
                            className='text-sm w-full h-full min-w-[200xp] min-h-[300px] bg-inherit p-2 border rounded'
                            value={embed}
                            onChange={(e) => setEmbed(e.target.value)}
                        />
                    </label>
                    <div className="flex justify-center w-full h-full">
                        <Button
                            id="create-link"
                            fieldName="Insert"
                            className="w-full bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 "
                        />
                    </div>
                </form>
            }
        />
    </div>;
};

export default Embed;
