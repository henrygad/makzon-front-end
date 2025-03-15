import { getSelectionProps } from "../type";

const getSelection = (): getSelectionProps => {
    /* get selected element */
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer;       

        if (node.nodeType === Node.TEXT_NODE) {
            return {
                selection,
                range,
                node: node.parentNode,
                textNode: node,
            };

        } else {
            return {
                selection,
                range,
                node,
                textNode: undefined,
            };
        }

    } else {
        return {
            selection,
            range: undefined,
            node: undefined,
            textNode: undefined,
        };
    }
};

export default getSelection;