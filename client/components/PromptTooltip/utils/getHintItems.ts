import appStore from 'client/store'
import getPossiblePrompts from '../getPossiblePrompts'
import getPossibleStyles from '../getPossibleStyles'
import ConfigManager from 'client/managers/Config'
import DOMCache from 'client/DOMCache'
import {PromptHintItem} from '../types'
import { MAX_HINTS } from '../const';


export default function getHintItems({word = ""}: {
    word: string;
}): PromptHintItem[] {
    const hints: PromptHintItem[] = [];
    if(!word) return hints;

    const {currentContainer} = appStore.getState();
    if(!currentContainer || !DOMCache.containers[currentContainer]) return hints;
    const textArea = DOMCache.containers[currentContainer].textArea;
    if(!textArea) return hints;

    const {autocomplitePromptMode = "prompts"} = ConfigManager.getConfig();
    let currHints = 0;
    if(autocomplitePromptMode === "off") return hints;

    const showPrompts = autocomplitePromptMode === "prompts" || autocomplitePromptMode === "all";
    const showStyles = autocomplitePromptMode === "styles" || autocomplitePromptMode === "all";

    const possiblePrompts = showPrompts ? getPossiblePrompts(word) : [];
    const possibleStyles = showStyles ? getPossibleStyles(word) : [];

    if(showPrompts) for(const item of possiblePrompts) {
        if(currHints >= MAX_HINTS) break;

        hints.push({
            name: item,
            index: currHints,
        });

        currHints++;
    }

    if(showStyles) for(const item of possibleStyles) {
        if(currHints >= MAX_HINTS) break;

        hints.push({
            name: item.name,
            index: currHints,
            isStyle: true,
            collection: item.collection,
        });

        currHints++;
    }

    return hints;
}
