import Database from "client/Database/index";
import ActivePrompts from "client/managers/ActivePrompts";
import DOMCache from "client/DOMCache";
import { log } from "client/utils/index";
import {setPreviewCollection} from "client/components/PreviewSave/store";
import appStore, {setSelectedPrompt, updateFilesIteration} from "client/store";
import {setAutogenStatus} from "../../store";
import checkProgressState from "./checkProgressState";
import StaticStore from "./StaticStore";


export default async function generateNextPreview() {
    const {data} = Database;
    const {filterCollection, currentContainer} = appStore.getState();
    const textArea = DOMCache.containers[currentContainer].textArea;
    const generateButton = DOMCache.containers[currentContainer].generateButton;

    if(!textArea || !generateButton) return;

    const nextItem = StaticStore.generateQueue.shift();
    if(!nextItem) {
        log("Finished generating prompt previews.");

        setSelectedPrompt(undefined);
        updateFilesIteration();
        Database.updateMixedList();

        return;
    }

    const message = `Generating preview for "${nextItem.id}". ${StaticStore.generateQueue.length} items in queue left. `;
    log(message);
    setAutogenStatus(message);

    setSelectedPrompt(nextItem.id);
    setPreviewCollection(filterCollection);

    if(nextItem.autogen && nextItem.autogen.collection && nextItem.autogen.style) {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        const targetCollection = data.styles[nextItem.autogen.collection];
        if(targetCollection) {
            const targetStyle = targetCollection.find(item => item.name === nextItem.autogen.style);
            if(targetStyle) {
                ActivePrompts.applyStyle(targetStyle, true, true);
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

    clearTimeout(StaticStore.generateNextTimer);
    StaticStore.generateNextTimer = setTimeout(checkProgressState, 100);
}
