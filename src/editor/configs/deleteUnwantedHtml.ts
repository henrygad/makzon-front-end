import { resetSelection } from "../commands/cmd.utils";
import getSelection from "../utils/getSelection";

const wantedHtmlTag: string[] = ["span", "ul", "ol", "li", "a", "code", "video", "img", "br"];

const deleteUnwantedHtml = () => {    
    const selections = getSelection(); // get the selected node properties
    const { selection, range, node } = selections;
    
    if (node && node.parentElement) {        
        if (!wantedHtmlTag.includes(node.nodeName.toLowerCase())) {
            const span_ele = document.createElement("span");  
            span_ele.innerHTML = node.textContent || "<br>";            
            node.parentElement.replaceChild(span_ele, node);
            resetSelection(span_ele, selection, range);
        }
    }
};

export default deleteUnwantedHtml;
