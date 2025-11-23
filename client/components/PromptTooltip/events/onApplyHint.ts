import {setHints, setSelected} from '../store'
import Database from 'client/Database'
import appStore from 'client/store'
import DOMCache from 'client/DOMCache'
import getContainer from '../getContainer'
import filterNewPromptsOnly from './filterNewPromptsOnly'
import syncCurrentPrompts from 'client/synchroniseCurrentPrompts'


export default function onApplyHint(start: number, end: number, newPrompt: string) {
    const {currentContainer} = appStore.getState();
    if(!currentContainer) return false;

    const {data} = Database;
    const {united} = data;

    const targetContainer = DOMCache.containers[currentContainer];
    if(!targetContainer) return false;
    const textArea = targetContainer.textArea;
    if(!textArea) return;

    const autoCompleteBox = getContainer();
    if(!autoCompleteBox) return;
 
    if(!textArea || !autoCompleteBox) return;
    const targetItem = united.find(item => item.id === newPrompt);
    autoCompleteBox.style.display = "none";
    let newValue = "";

    const addAfter = targetItem && targetItem.addAfter ? filterNewPromptsOnly(targetItem.addAfter) : "";
    const addStart = targetItem && targetItem.addStart ? filterNewPromptsOnly(targetItem.addStart) : "";
    const addEnd = targetItem && targetItem.addEnd ? filterNewPromptsOnly(targetItem.addEnd) : "";

    if(targetItem && targetItem.addAtStart) {
        const oldValue = textArea.value.substring(0, start) + textArea.value.substring(end);
        if(targetItem.isExternalNetwork) newPrompt = `<${newPrompt}>`;
        if(addAfter) newPrompt += ", " + addAfter + ", ";

        newValue += newPrompt;

        if(addStart) newValue += addStart + ", ";
        newValue += oldValue;

        if(addEnd) newValue += addEnd;

    } else {
        const prefix = textArea.value.substring(0, start);
        const postfix = textArea.value.substring(end);

        if(addStart) newValue += addStart + ", ";
        
        if(prefix) newValue += prefix + " ";
    
        if(targetItem) {
            if(targetItem.isExternalNetwork) newPrompt = `<${newPrompt}>`;
            if(addAfter) newPrompt += ", " + addAfter;
    
            newValue += newPrompt;
    
        } else newValue += newPrompt;
    
        if(postfix) newValue += postfix;
        else newValue += ", ";

        if(addEnd) newValue += addEnd;
    }

    textArea.value = newValue;

    setSelected(0);
    syncCurrentPrompts(false);

    setHints([]);
}
