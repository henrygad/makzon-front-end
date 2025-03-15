import { getSelectionProps } from "../type";
import {
    getMultipleSelectedNodes,
    insertNodeToRange,
    resetSelection,
    createEle,
} from "./cmd.utils";

const inlineCmd = (
    command: string,
    getSelection: getSelectionProps,
    options: { value: string; style: string[] }
) => {
    const { selection, range, node } = getSelection;

    const nodes = getMultipleSelectedNodes(range); // get multiple lines texts selected

    let unorderlist_ele = null;
    let orderlist_ele = null;

    if (command === "unorderlist") {
        unorderlist_ele = document.createElement("ul");
        unorderlist_ele.classList.add(...["list-disc", "ml-5", ...options.style]);
    } else if (command === "orderlist") {
        orderlist_ele = document.createElement("ol");
        orderlist_ele.classList.add(...["list-decimal", "ml-5", ...options.style]);
    }

    if (nodes.length) {
        /* when text(s) is selection */
        nodes.forEach((node, index) => {
            if (command === "unorderlist" && unorderlist_ele) {
                // add an unorder list
                const li_ele = createEle("list", options.value, []);
                li_ele.appendChild(node);
                unorderlist_ele.appendChild(li_ele);

                if (index === nodes.length - 1) {
                    insertNodeToRange(unorderlist_ele, selection, range);
                }
            } else if (command === "orderlist" && orderlist_ele) {
                // add an order list
                const li_ele = createEle("list", options.value, []);
                li_ele.appendChild(node);
                orderlist_ele.appendChild(li_ele);

                if (index === nodes.length - 1) {
                    insertNodeToRange(orderlist_ele, selection, range);
                }
            } else if (command === "unanchor") {
                // replace ancho element to span but keep text
                const span_ele = createEle(command, options.value, options.style);
                span_ele.innerHTML = node.textContent || "";
                node.parentElement?.replaceWith(span_ele);

                resetSelection(span_ele, selection, range);
            } else {
                /* for the rest of linling styling */
                const span_ele = createEle(command, options.value, options.style);

                if (nodes.length <= 1) {
                    // only one node found
                    if (range) {
                        range.surroundContents(span_ele);
                        resetSelection(span_ele, selection, range);
                    }

                } else {                    
                    // more than one node is found
                    const newRange = document.createRange(); // create a new range object
                    newRange.selectNodeContents(node); // add node to the new object range
                    newRange.surroundContents(span_ele);
                    resetSelection(span_ele, selection, newRange);
                }
            }
        });
    } else {
        /* when no text is selected */
        if (command === "unorderlist" && unorderlist_ele) {
            // add an unorder list
            const li_ele = createEle("list", options.value, []);
            li_ele.innerHTML = "<br>";
            unorderlist_ele.appendChild(li_ele);

            insertNodeToRange(unorderlist_ele, selection, range, "before");
        } else if (command === "orderlist" && orderlist_ele) {
            // add an order list
            const li_ele = createEle("list", options.value, []);
            li_ele.innerHTML = "<br>";
            orderlist_ele.appendChild(li_ele);

            insertNodeToRange(orderlist_ele, selection, range, "before");
        } else if (command === "unanchor" && node ) {
            // replace ancho element to span but keep text
            const span_ele = createEle(command, options.value, options.style);
            span_ele.innerHTML = node.textContent || "";
            node.parentElement?.replaceWith(span_ele);

            resetSelection(span_ele, selection, range);
        } else if (command === "insert") {
            // add text
            const textNode = document.createTextNode(options.value);
            insertNodeToRange(textNode, selection, range);
        } else {
            // the rest linling styling
            const span_ele = createEle(command, options.value, options.style);
            span_ele.innerHTML = "<br>";
            insertNodeToRange(span_ele, selection, range, "before");
        }
    }
};

export default inlineCmd;
