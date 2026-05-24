import Prompt, { PromptEntity } from "clientTypes/prompt";
import DOMCache from 'client/DOMCache'
import appStore from 'client/store'
import syncListToTextareaBranch from "./syncListToTextareaBranch";


/**
 * Synchronizes the lists of prompts as an array of objects for internal expansion operations
 * and prompts located in the webpage Textarea element.
 */
export default function synchroniseListToTextarea(activePrompts: PromptEntity[]) {
    const {currentContainer} = appStore.getState();
    const textArea = DOMCache.containers[currentContainer].textArea;
    if(!textArea) return;
    const prompts: {text: string; src: Prompt; }[] = [];

    textArea.value = "";

    syncListToTextareaBranch(activePrompts, prompts);

    let addTextValue = "";
    for(let i = 0; i < prompts.length; i++) {
        const {text, src} = prompts[i];
        const nextPromptSrc = prompts[i+1] ? prompts[i+1].src : undefined;
        addTextValue += text;

        let addDelimiter = true;

        if(!nextPromptSrc) addDelimiter = false;
        else if(src.delimiter) {
            if(src.delimiter === "prev" || src.delimiter === "none") addDelimiter = false;

        } else if(nextPromptSrc.delimiter) {
            if(nextPromptSrc.delimiter === "next" || nextPromptSrc.delimiter === "none") addDelimiter = false;

        }

        if(nextPromptSrc && text === ")" && nextPromptSrc.id === ")") addDelimiter = false;

        if(addDelimiter) addTextValue += ", ";
    }

    textArea.value = addTextValue;

    //Just to be sure every api listening to changes in textarea done their job
    textArea.dispatchEvent(new Event('focus'));
    textArea.dispatchEvent(new Event('input'));
    textArea.dispatchEvent(new KeyboardEvent('keyup'));
    textArea.dispatchEvent(new KeyboardEvent('keypress'));
    textArea.dispatchEvent(new Event('blur'));
}
