
const displayPlaceholder = (
    inputRef: React.RefObject<HTMLDivElement | null>) => {
    /* display input place holder when no inner html or text is avialable*/
    if (inputRef && inputRef.current) {
        const children = inputRef.current.children;
        for (const child of children) {                
            const isNotEmpty = child.innerHTML.replace("<br>", "").trim() !== "";
            const placeHolder_ele = inputRef.current.previousElementSibling;
            if (isNotEmpty) {
                if (placeHolder_ele && placeHolder_ele.className.includes("place-holder")) {
                    placeHolder_ele.classList.remove("block");
                    placeHolder_ele.classList.add("hidden");
                }
                return;
            }
            if (placeHolder_ele && placeHolder_ele.className.includes("place-holder")) {
                placeHolder_ele.classList.remove("hidden");
                placeHolder_ele.classList.add("block");
            }
        }
    }
};
export default displayPlaceholder;