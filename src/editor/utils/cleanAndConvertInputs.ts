
const wantedHtmlTag: string[] = ["span", "ul", "ol", "li", "a", "video", "img"];

const cleanAndConvertInputs = (node: string) => {
    const wrapper_ele = document.createElement("span");
    wrapper_ele.classList.add("block");
    wrapper_ele.innerHTML = node;

    const clean = (node: HTMLElement) => {        
        if (!wantedHtmlTag.includes(node.tagName.toLowerCase())) {
            const span_ele = document.createElement("span");          
            span_ele.innerHTML = node?.innerHTML || "<br>";
            node.replaceWith(span_ele);
        }       

        const children = Array.from(node.children);
        if (children.length) {
            children.forEach(child => {
                clean(child as HTMLElement);
            });
        }
    };

    clean(wrapper_ele);

    return wrapper_ele;
};

export default cleanAndConvertInputs;
