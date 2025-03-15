import { RefObject } from "react";
import displayPlaceholder from "../configs/dsplayPlaceholder";

const focusCaretOnInput = (inputRef: RefObject<HTMLDivElement | null>) => {
  const selection = window.getSelection();
  if (selection && inputRef && inputRef.current) {
    const range = document.createRange();
    range.setStart(inputRef.current, inputRef.current.childNodes.length);
    selection.removeAllRanges();
    selection.addRange(range);
    selection.collapseToEnd();
  }
  displayPlaceholder(inputRef);
};

export default focusCaretOnInput;
