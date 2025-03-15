import inlineCmd from "../../commands/inline.cmd";
import { actionsProps} from "../../type";
import { FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify } from "react-icons/fi";


const Alignment = ({
    handleGlobalChangesOnInputArea,
    getNodesWithinTextEditor }: actionsProps) => {

    const hanldeAlignment = (style: string[]) => {
        inlineCmd("align", getNodesWithinTextEditor(), { value: "", style });        
        handleGlobalChangesOnInputArea();
    };

    return <div
        id='tool-bar-alignment'
        className='flex items-center gap-4'>
        <button className="cursor-pointer" onClick={() => hanldeAlignment(["block", "text-left"])}>
            <FiAlignLeft size={20} />
        </button>
        <button className="cursor-pointer" onClick={() => hanldeAlignment(["block", "text-center"])}>
            <FiAlignCenter size={20} />
        </button>
        <button className="cursor-pointer" onClick={() => hanldeAlignment(["block", "text-right"])}>
            <FiAlignRight size={20} />
        </button>
        <button className="cursor-pointer" onClick={() => hanldeAlignment(["flex", "flex-start"])}>
            <FiAlignJustify size={20} />
        </button>
    </div>;
};

export default Alignment;
