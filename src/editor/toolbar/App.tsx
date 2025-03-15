import { useEffect, useState } from "react";
import getSelection from "../utils/getSelection";
import { getSelectionProps, toolbarProps } from "../type";
import Deleteall from "./actions/Deleteall";
import { deleteAll, displayHistory } from "./toolbar.utils";
import History from "./actions/History";
import Alignment from "./actions/Alignment";
import Textformat from "./actions/Textformat";
import Emojis from "./actions/Emojis";
import Textlisting from "./actions/Textlisting";
import Anchorlink from "./actions/Anchorlink";
import Writecode from "./actions/Writecode";
import Embed from "./actions/Embed";
import Image from "./actions/Image";
import Video from "./actions/Video";
import specialKeyCmd from "./actions/specialKeyCmd";
import pasteToClipBoard from "./actions/pasteToClipBoard";

const Actions = ({
    toolBarClassName,
    inputRef,
    useToolBar,
    arrOfEmojis,
    arrOfFontColors,
    arrOfBgColors,
    arrOfHeadings,
    arrOfFontSizes,
    arrOfFontFamily,
    textEditorRef,
    imageGalary,
    videoGalary,
    handleLocalFile,
    handleGlobalChangesOnInputArea,
}: toolbarProps) => {
    const [targetNode, setTargetNode] = useState<Node | ParentNode | null | undefined>(undefined);

    /* prevent selecting node outside it own texteditor and contentEditbale input*/
    const getNodesWithinTextEditor = (): getSelectionProps => {
        const selections = getSelection();
        if ((textEditorRef.current && textEditorRef.current.contains(selections.node as Node)) &&
            inputRef.current && inputRef.current.contains(selections.node as Node)) {
            return { ...selections };
        } else {
            return {
                selection: null,
                range: undefined,
                node: undefined,
                textNode: undefined,
            };
        }
    };

    const handleOnSelectionChange = () => {
        //get selected node on selection changes on document
        const { textNode } = getNodesWithinTextEditor();
        setTargetNode(textNode);
    };

    useEffect(() => {
        if (inputRef &&
            inputRef.current) {
            inputRef.current.addEventListener("keydown", (e) => specialKeyCmd(e, inputRef, getNodesWithinTextEditor));
            inputRef.current.addEventListener("paste", (e) => pasteToClipBoard(e, getNodesWithinTextEditor, handleGlobalChangesOnInputArea));
        }

        document.addEventListener("selectionchange", handleOnSelectionChange);
        return () => {
            document.removeEventListener("selectionchange", handleOnSelectionChange,);
        };
    }, []);

    return <div className={`flex flex-wrap items-center gap-4 font-text ${toolBarClassName}`}>
        <Textformat
            useToolBar={useToolBar}
            arrOfFontColors={arrOfFontColors}
            arrOfBgColors={arrOfBgColors}
            arrOfHeadings={arrOfHeadings}
            arrOfFontSizes={arrOfFontSizes}
            arrOfFontFamily={arrOfFontFamily}
            handleGlobalChangesOnInputArea={handleGlobalChangesOnInputArea}
            getNodesWithinTextEditor={getNodesWithinTextEditor}
            targetNode={targetNode}
        />
        {typeof useToolBar === "object" &&
            useToolBar.useInline.emoji ?
            <Emojis
                arrOfEmojis={arrOfEmojis}
                handleGlobalChangesOnInputArea={handleGlobalChangesOnInputArea}
                getNodesWithinTextEditor={getNodesWithinTextEditor}
            /> :
            null
        }
        {typeof useToolBar === "object" &&
            useToolBar.useInline.listing ?
            <Textlisting
                handleGlobalChangesOnInputArea={handleGlobalChangesOnInputArea}
                getNodesWithinTextEditor={getNodesWithinTextEditor}
            /> :
            null
        }
        {typeof useToolBar === "object" &&
            useToolBar.useInline.alignment ?
            <Alignment
                handleGlobalChangesOnInputArea={handleGlobalChangesOnInputArea}
                getNodesWithinTextEditor={getNodesWithinTextEditor}
            /> :
            null
        }
        {typeof useToolBar === "object" &&
            useToolBar.useInline.anchorlink ?
            <Anchorlink
                handleGlobalChangesOnInputArea={handleGlobalChangesOnInputArea}
                getNodesWithinTextEditor={getNodesWithinTextEditor}
                targetNode={targetNode}
            /> :
            null
        }
        {
            typeof useToolBar === "object" &&
                useToolBar.useBlock ?
                <>
                    <Writecode
                        handleGlobalChangesOnInputArea={handleGlobalChangesOnInputArea}
                        getNodesWithinTextEditor={getNodesWithinTextEditor}
                    />
                    <Image
                        galary={imageGalary}
                        handleLocalFile={handleLocalFile}
                        handleGlobalChangesOnInputArea={handleGlobalChangesOnInputArea}
                        getNodesWithinTextEditor={getNodesWithinTextEditor}
                    />
                    <Video
                        galary={videoGalary}
                        handleLocalFile={handleLocalFile}
                        handleGlobalChangesOnInputArea={handleGlobalChangesOnInputArea}
                        getNodesWithinTextEditor={getNodesWithinTextEditor}
                    />
                    <Embed
                        handleGlobalChangesOnInputArea={handleGlobalChangesOnInputArea}
                        getNodesWithinTextEditor={getNodesWithinTextEditor}
                    />
                </> :
                null
        }
        {
            typeof useToolBar === "object" &&
                useToolBar.useHistor ?
                <History inputRef={inputRef} displayHistory={displayHistory} /> :
                null
        }
        {
            typeof useToolBar === "object" &&
                useToolBar.useDelete ?
                <Deleteall deleteAll={() => deleteAll(inputRef)} /> :
                null
        }

    </div>;

};

export default Actions;
