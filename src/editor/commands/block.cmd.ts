import { getSelectionProps } from "../type";
import { getMultipleSelectedNodes, insertNodeToRange, resetSelection, createEle } from "./cmd.utils";

const blockCmd = (
    command: string,
    getSelection: getSelectionProps,
    options: { value: string; style: string[] }
) => {
    const { selection, range, node, } = getSelection;   

    if (command === "align") {
        const nodes = getMultipleSelectedNodes(range); // get multiple line texts selected
        if (nodes.length) {
            /* when text(s) is selection */
            nodes.forEach((node) => {
                if (node) {
                    const newRange = document.createRange(); // create a new range object
                    newRange.selectNodeContents(node); // add node to the new object range

                    const span_ele = createEle(command, options.value, options.style);
                    newRange.surroundContents(span_ele);
                    resetSelection(span_ele, selection, range);
                }
            });
        } else {
            /* when no text is selected */
            if (node) {
                const span_ele = createEle(command, options.value, options.style);
                span_ele.innerHTML = "<br>";
                node.appendChild(span_ele);
                resetSelection(span_ele, selection, range);
            }
        }
    } else if (command === "image") {
        if (node) {
            const img_ele = createEle(command, options.value, options.style);
            insertNodeToRange(img_ele, selection, range);
        }
    } else if (command === "video") {
        if (node) {
            const vd_ele = createEle(command, options.value, options.style);
            insertNodeToRange(vd_ele, selection, range);
        }
    } else if (command === "code") {
        const cd_ele = createEle(command, options.value, options.style);
        insertNodeToRange(cd_ele, selection, range, "before");
    } else if (command === "embed") {        
        const embed_ele = createEle(command, options.value, options.style);
        insertNodeToRange(embed_ele, selection, range);
    }
};

export default blockCmd;
