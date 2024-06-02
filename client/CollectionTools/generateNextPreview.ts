import CollectionTools from "./index";
import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import KnownPrompts from "client/KnownPrompts/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import PreviewSave from "client/PreviewSave/index";
import applyStyle from "client/applyStyle";
import { log } from "client/utils/index";

async function generateNextPreview() {
    const {state} = PromptsBrowser;
    const {data} = Database;
    const {collectionToolsId} = state;
    const {generateQueue} = CollectionTools;
    const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
    const generateButton = PromptsBrowser.DOMCache.containers[state.currentContainer].generateButton;
    if(!textArea || !generateButton) return;

    const nextItem = generateQueue.shift();
    if(!nextItem) {
        log("Finished generating prompt previews.");

        state.selectedPrompt = undefined;
        state.filesIteration++;
        Database.updateMixedList();
        
        PreviewSave.update();
        KnownPrompts.update();
        CurrentPrompts.update(true);
        CollectionTools.update(true);
        return;
    }

    const message = `Generating preview for "${nextItem.id}". ${generateQueue.length} items in queue left. `;
    log(message);
    CollectionTools.updateAutogenInfo(message);

    state.selectedPrompt = nextItem.id;
    state.savePreviewCollection = collectionToolsId;

    if(nextItem.autogen && nextItem.autogen.collection && nextItem.autogen.style) {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        const targetCollection = data.styles[nextItem.autogen.collection];
        if(targetCollection) {
            const targetStyle = targetCollection.find(item => item.name === nextItem.autogen.style);
            if(targetStyle) {
                applyStyle(targetStyle, true, true);
                await delay(600); //need a pause due to a hacky nature of changing APP state

                textArea.value = `((${nextItem.id})), ${textArea.value}`;
            }
        }

    } else if(nextItem.addPrompts) {
        textArea.value = `((${nextItem.id})), ${nextItem.addPrompts}`;

    } else textArea.value = nextItem.id;

    textArea.dispatchEvent(new Event('focus'));
    textArea.dispatchEvent(new Event('input'));
    textArea.dispatchEvent(new KeyboardEvent('keyup'));
    textArea.dispatchEvent(new KeyboardEvent('keypress'));
    textArea.dispatchEvent(new Event('blur'));

    generateButton.dispatchEvent(new Event('click'));

    clearTimeout(CollectionTools.generateNextTimer);
    CollectionTools.generateNextTimer = setTimeout(CollectionTools.checkProgressState, 100);
}

export default generateNextPreview;
