import { RefObject } from "react";
import { FaUndo, FaRedo } from "react-icons/fa";

type Props = {
    inputRef: RefObject<HTMLDivElement | null>
    displayHistory: (action: string, inputRef: RefObject<HTMLDivElement | null>) => void

}

const History = ({ inputRef, displayHistory }: Props) => {

    return <div id="history" className='flex flex-wrap items-center gap-4'>
        <button className="block cursor-pointer" onClick={() =>displayHistory("undo",  inputRef)}>
            <FaUndo size={14} />
        </button>
        <button className="block cursor-pointer" onClick={() => displayHistory("redo", inputRef)}>
            <FaRedo size={14} />
        </button>
    </div>;
};

export default History;
