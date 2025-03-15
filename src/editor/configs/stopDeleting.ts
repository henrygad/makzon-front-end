import getSelection from "../utils/getSelection";

const stopDeleting = (
    e: React.KeyboardEvent,
    inputRef: React.RefObject<HTMLDivElement | null>
) => {
    const { node } = getSelection();

    if (inputRef && inputRef.current) {
        const children = Array.from(inputRef.current.children);
        const firstChild = children[0];
        if (
            (e.key === "Backspace" || e.key === "Delete")
        ) {

            if (
                node &&
                firstChild.contains(node) &&
                firstChild.innerHTML.replace("<br>", "") === ""
            ) {                     
                e.preventDefault();               
            }

            if (node &&
                firstChild.contains(node) &&
                firstChild.innerHTML.replace("<br>", "") !== ""
            ) {
                const firstChildChildren = Array.from(firstChild.children);

                for (const child of firstChildChildren) {
                    const isEmpty = child.innerHTML.replace("<br>", "") === "";                    
                    if (
                        isEmpty &&
                        firstChildChildren.length === 1
                    ) {                        
                        e.preventDefault();
                    }
                }
            }

        }

    }

};

export default stopDeleting;


/* 

 const { node} =  getSelection();

    if (inputRef && inputRef.current) {
        const children = Array.from(inputRef.current.children);
        const firstChild = children[0];        
        if (
            (e.key === "Backspace" || e.key === "Delete")
        ) {
            
            if (
                node &&
                firstChild.contains(node) &&
                firstChild.innerHTML.replace("<br>", "") === ""
            ) {                
                e.preventDefault();              
            }

            if (node &&
                firstChild.contains(node) &&
                firstChild.innerHTML.replace("<br>", "") !== ""
            ) {
                const firstChildChildren = Array.from(firstChild.children);
                for (const child of firstChildChildren) {
                    const isEmpty = child.innerHTML.replace("<br>", "") === "";
                    if (
                        isEmpty &&
                        firstChildChildren.length === 1 &&
                        child instanceof HTMLSpanElement
                    ) {                        
                        e.preventDefault();
                    }
                }
            }

        }

    }


*/
