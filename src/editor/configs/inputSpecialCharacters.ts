import { insertNodeToRange, resetSelection } from "../commands/cmd.utils";
import getSelection from "../utils/getSelection";

/* func that handle when a special characters (@, #) is inputed */
const inputSpecialCharacters = (
    e: React.KeyboardEvent,
    handleGlobalChangesOnInputArea: () => void,
) => {
    const { selection, range, textNode } = getSelection();

    if (textNode &&
        textNode.parentElement &&
        textNode.parentElement.className.includes("special-character")) {
        /* when inside a special-character and space or enter key is press */

        const ele = textNode.parentElement;
        if ((e.key === " " || e.key.toLowerCase() === "enter") &&
            ele instanceof HTMLAnchorElement) {
            // go out of special character ele
            ele.href = " ";
            const clear = setTimeout(() => {
                const span_ele = document.createElement("span");
                span_ele.innerHTML = ele.innerHTML;
                span_ele.className = ele.className;
                ele.replaceWith(span_ele);
                clearTimeout(clear);
            }, 1);

            return;
        }

        if (ele instanceof HTMLSpanElement) {
            // enter special character ele
            const a_ele = document.createElement("a");
            a_ele.innerHTML = ele.innerHTML;
            a_ele.className = ele.className;
            ele.replaceWith(a_ele);
            resetSelection(a_ele, selection, range);
        }

    } else {
        /* insert special character format*/
        const a_ele = document.createElement("a");
        a_ele.classList.add(...["special-character", "relative", "inline-block"]);

        if ((e.shiftKey && e.key === "@") ||
            e.key === "@") {
            e.preventDefault();
            a_ele.classList.add("font-bold");
            a_ele.innerHTML = e.key;
            insertNodeToRange(a_ele, selection, range);
            handleGlobalChangesOnInputArea();
        } else if ((e.shiftKey && e.key === "#") ||
            e.key === "#") {
            e.preventDefault();
            a_ele.classList.add("text-blue-400");
            a_ele.innerHTML = e.key;
            insertNodeToRange(a_ele, selection, range);
            handleGlobalChangesOnInputArea();
        }
    }
};


export default inputSpecialCharacters;
