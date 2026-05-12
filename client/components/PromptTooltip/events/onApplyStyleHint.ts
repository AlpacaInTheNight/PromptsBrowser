import ActivePrompts from 'client/managers/ActivePrompts'
import {setHints} from '../store'
import state from '../state'
import Database from 'client/Database'
import appStore from 'client/store'
import DOMCache from 'client/DOMCache'
import getContainer from '../getContainer'
import syncCurrentPrompts from 'client/synchroniseCurrentPrompts'


export default function onApplyStyleHint(start: number, end: number, style: string, collection: string) {
    const {currentContainer} = appStore.getState();
    if(!currentContainer) return false;

    const {data} = Database;
    const {styles} = data;

    const targetContainer = DOMCache.containers[currentContainer];
    if(!targetContainer) return false;
    const textArea = targetContainer.textArea;
    if(!textArea) return;

    const autoCompleteBox = getContainer();
    if(!autoCompleteBox) return;

    if(!textArea || !autoCompleteBox) return;
    if(!style || !collection) return;

    const targetCollection = styles[collection];
    if(!targetCollection) return;

    const targetStyle = targetCollection.find(item => item.name === style);
    if(!targetStyle) return;

    autoCompleteBox.style.display = "none";
    let newValue = "";

    const prefix = textArea.value.substring(0, start);
    const postfix = textArea.value.substring(end);

    newValue += prefix;
    newValue += postfix;

    textArea.value = newValue;

    state.selected = 0;
    syncCurrentPrompts(false);
    setHints([]);

    ActivePrompts.applyStyle(targetStyle, true, false);
}
