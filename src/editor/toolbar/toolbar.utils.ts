import { RefObject } from "react";
import displayPlaceholder from "../configs/dsplayPlaceholder";
import addInitialSpans from "../configs/addInitialSpans";
import { historyProps } from "../type";
import focusCaretOnInput from "../utils/focusCaretOnInput";


class History implements historyProps {
    constructor() {
        this.history = [];
        this.historyIndex = 0;
    }
    history: string[];
    historyIndex: number;
    addHistory = (action: string) => {
        this.history.push(action);
        this.historyIndex = this.history.length - 1;
    };
    displayHistory = (direction: string, inputRef: RefObject<HTMLDivElement | null>) => {
        if (!inputRef || !inputRef.current) return;

        if (direction === "undo") {
            if (this.historyIndex <= 0) return;
            this.historyIndex = this.historyIndex - 1;
            inputRef.current.innerHTML = this.history[this.historyIndex];
        } else {
            if (this.historyIndex >= this.history.length - 1) return;
            this.historyIndex = this.historyIndex + 1;
            inputRef.current.innerHTML = this.history[this.historyIndex];
        }
        displayPlaceholder(inputRef);
        focusCaretOnInput(inputRef);
    };
}

export const { displayHistory, addHistory } = new History();

export const deleteAll = (inputRef: RefObject<HTMLDivElement | null>) => {
    if (inputRef && inputRef.current) {
        const firstSpan_ele = inputRef.current.firstElementChild;
        if (firstSpan_ele) {
            inputRef.current.innerHTML = "";
            addInitialSpans(inputRef);
            displayPlaceholder(inputRef);
            addHistory(inputRef.current.innerHTML); // add history
        }
    }
};
