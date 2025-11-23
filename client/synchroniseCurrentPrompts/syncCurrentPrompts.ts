import ActivePrompts from "client/managers/ActivePrompts/index";
import { updateCurrentIteration } from "client/store";
import { parseGroups } from 'client/utils/parseGroups';
import { PromptEntity } from "clientTypes/prompt";
import DOMCache from 'client/DOMCache'
import appStore from 'client/store'
import processGroup from "./processGroup";


/**
 * Synchronises text content of the textarea with the array of active prompts used by the extension.
 * TODO: remove noTextAreaUpdate as it is relict from previous implementation.
 */
export default function syncCurrentPrompts(noTextAreaUpdate: boolean = true, normalize: boolean = false) {
    const {currentContainer} = appStore.getState();
    const textArea = DOMCache.containers[currentContainer].textArea;
    if(!textArea) return;
    let value = textArea.value;

    //trying to fix LORAs/Hypernetworks added without a preceding comma
    value = value.replace(/([^,])\ </g, "$1,\ <");

    const newActivePrompts: PromptEntity[] = [];
    processGroup({
        entityArray: parseGroups(value),
        activePrompts: newActivePrompts,
        normalize,
    });

    ActivePrompts.setCurrentPrompts(newActivePrompts);

    updateCurrentIteration();
}
