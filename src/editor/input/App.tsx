import stopDeleting from "../configs/stopDeleting";
import { inputProps } from "../type";
import inputSpecialCharacters from "../configs/inputSpecialCharacters";
import cleanAndConvertInputs from "../utils/cleanAndConvertInputs";
import deleteUnwantedHtml from "../configs/deleteUnwantedHtml";

const Input = ({
    placeholderValue = "Start writing...",
    inputClassName,
    inputRef,
    addValue = { createNew: true, data: "" },
    handleGlobalChangesOnInputArea,
    onFocus = () => null
}: inputProps) => {

    const handleOnInput = () => {
        deleteUnwantedHtml();
        handleGlobalChangesOnInputArea(); // func that listen for global changes on the inputs             
    };

    const handleOnKeyUp = (e: React.KeyboardEvent) => {
        stopDeleting(e, inputRef); // func to stop deleting inputs if nothing left to clear               
    };

    const handleOnkeyDown = (e: React.KeyboardEvent) => {
        inputSpecialCharacters(e, handleGlobalChangesOnInputArea); // func that handle special characters (@, #) when inputed
        stopDeleting(e, inputRef); // func to stop deleting inputs if nothing left to clear               
    };

    
    return <div className={inputClassName}>
        <span className="place-holder text-base first-letter:capitalize opacity-45 absolute">
            {placeholderValue}
        </span>
        <div
            contentEditable
            ref={inputRef}
            onInput={handleOnInput}
            onKeyUp={handleOnKeyUp}
            onKeyDown={handleOnkeyDown}
            className="h-full w-full min-w-full min-h-full max-w-full max-h-full outline-0"
            dangerouslySetInnerHTML={{
                __html:
                    addValue.createNew ?
                        "<span class='block new'><br></span>" :
                        `<span class='block old'>${cleanAndConvertInputs(addValue.data).innerHTML}</span>`
            }}
            onFocus={()=> onFocus()}
        >
        </div>
    </div>;
};

export default Input;
