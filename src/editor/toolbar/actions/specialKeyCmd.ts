import inlineCmd from "../../commands/inline.cmd";
import { getSelectionProps } from "../../type";
import { displayHistory } from "../toolbar.utils";

const specialKeyCmd = (
    e: KeyboardEvent,
    inputRef: React.RefObject<HTMLDivElement | null>,
    getNodesWithinTextEditor: ()=> getSelectionProps
) => {
    if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
       displayHistory("undo", inputRef);
    } else if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        displayHistory("redo", inputRef);
    } else if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        inlineCmd("bold", getNodesWithinTextEditor(), { value: "", style: ["font-bold"] });
    } else if (e.ctrlKey && e.key === "i") {
        e.preventDefault();
        inlineCmd("italic", getNodesWithinTextEditor(), { value: "", style: ["italic"] });
    } else if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        inlineCmd("underline", getNodesWithinTextEditor(), { value: "", style: ["underline"] });
    }
};

export default specialKeyCmd;