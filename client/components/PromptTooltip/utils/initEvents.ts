import appStore from 'client/store'
import DOMCache from 'client/DOMCache'
import onCarretPosition from '../events/onCarretPosition'
import onTextAreaKeyDown from '../events/onTextAreaKeyDown'


export default function initEvents(): boolean {
    const {currentContainer} = appStore.getState();
    if(!currentContainer || !DOMCache.containers[currentContainer]) return false;
    const textArea = DOMCache.containers[currentContainer].textArea;
    if(!textArea) return false;

    textArea.addEventListener("keydown", onTextAreaKeyDown);
    textArea.addEventListener("keyup", onCarretPosition);
    textArea.addEventListener("click", onCarretPosition);

    return true;
}
