import { GrOrderedList, GrUnorderedList } from "react-icons/gr";
import inlineCmd from "../../commands/inline.cmd";
import { actionsProps } from "../../type";

const Textlisting = ({
    getNodesWithinTextEditor,
    handleGlobalChangesOnInputArea
}: actionsProps) => {

    const handleTextListing = (command: string, style: string[]) => {
        inlineCmd(command, getNodesWithinTextEditor(), { value: "", style });
        handleGlobalChangesOnInputArea();
    };

    return <div
        id='text-listings'
        className='flex items-center gap-4'>
        <button
            className="block cursor-pointer"
            onClick={() => handleTextListing("unorderlist", [])}>
            <GrUnorderedList size={22} />
        </button>
        <button
            className="block cursor-pointer"
            onClick={() => handleTextListing("orderlist", [])}>
            <GrOrderedList size={22} />
        </button>
    </div>;
};

export default Textlisting;
