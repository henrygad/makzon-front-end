
export const resetSelection = (
    ele: HTMLElement | Text,
    selection: Selection | null,
    range: Range | undefined,
    caretEnd: string = "after",
) => {
    if (selection && range) {
        if (caretEnd === "after") {
            range.setEndAfter(ele);
        } else {
            range.setEndBefore(ele);
        }
        selection.removeAllRanges();
        selection.addRange(range);
        selection.collapseToEnd();
    }
};

export const insertNodeToRange = (
    ele: HTMLElement | Text,
    selection: Selection | null,
    range: Range | undefined,
    caretEnd: string = "after",
) => {
    if (range && selection) {
        range.insertNode(ele);
        resetSelection(ele, selection, range, caretEnd);
    }
};

export const getMultipleSelectedNodes = (range: Range | undefined) => {
    const nodes: Node[] = [];

    if (range && !range.collapsed) {
        // selected element must contain text
        const startNode = range.startContainer; // get the first node in the selection
        const endNode = range.endContainer; // get the last node in the selection
        const commonAncestor = range.commonAncestorContainer; // get the commonAncesstor of all selected node

        const walker = document.createTreeWalker(
            // fetch all text nodes within the selection
            commonAncestor,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function () {
                    return NodeFilter.FILTER_ACCEPT;
                },
            }
        );

        let currentNode: Node | null = walker.currentNode;

        while (currentNode) {
            // while currentNode has nodes push all the selected nodes or texts to the array of nodes
            if (
                (currentNode === startNode ||
                    currentNode === endNode ||
                    (walker.currentNode.nodeValue &&
                        walker.currentNode.nodeValue.trim())) &&
                range.intersectsNode(currentNode)
            ) {
                nodes.push(currentNode);
            }
            currentNode = walker.nextNode();
        }

        return nodes;
    }

    return nodes;
};

export const createEle = (command: string, value: string, style: string[]) => {
    if (command === "anchor") {
        // create a link       
        const anchor_ele = document.createElement("a");
        anchor_ele.href = value;
        anchor_ele.classList.add(...style);
        return anchor_ele;
    } else if (command === "list") {
        // create a list
        const li_ele = document.createElement("li");
        return li_ele;
    } else if (command === "image") {
        const img = document.createElement("img");
        img.classList.add(...style);
        const newValue = value.split("=");
        img.src = newValue[0];
        img.alt = newValue[1];
        return img;
    } else if (command === "video") {    
        const source = document.createElement("source");
        source.src = value;
        const video = document.createElement("video");        
        video.classList.add(...style);
        video.controls = true;  
        video.appendChild(source);
        return video;
    } else if (command === "code") {        
        const span_ele = document.createElement("span");
        span_ele.classList.add(...["inline-block", "text-base", "font-normal", "no-underline", "not-italic", "lowercase", "text-left", "text-black", "bg-gray-50", "p-3", "border", "border-gray-400", "shadow-inner", "rounded-md"]);
        span_ele.innerHTML = "<code class='block bg-transparent'><br/></code>";    
        return span_ele;
    } else if (command === "embed") {
        const span_ele = document.createElement("span");
        span_ele.classList.add(...["block", ...style]);
        span_ele.innerHTML = value;
        return span_ele;
    } else {
        // create a span for the rest text format
        const span_ele = document.createElement("span");
        span_ele.classList.add(...style);
        return span_ele;
    }
};


/* 
if (range) {
                                        const node = range.startContainer;
                                        if (node.nodeType === 3) {
                                            const textNode = node as Text;
                                            const text = textNode.nodeValue;
                                            const start = range.startOffset;
                                            const end = range.endOffset;
                                            const textBefore = text.slice(0, start);
                                            const textAfter = text.slice(end);
                                            const newText = textBefore + e.target.value + textAfter;
                                            textNode.nodeValue = newText;
                                        }
                                    }

*/