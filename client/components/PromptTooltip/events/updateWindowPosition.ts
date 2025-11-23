import appStore from 'client/store'
import DOMCache from 'client/DOMCache'
import getContainer from 'client/components/PromptTooltip/getContainer'


/**
 * Function from getCaretPos.js.
 * https://github.com/component/textarea-caret-position
 */
declare const getCaretCoordinates: (textArea: HTMLTextAreaElement, caret: number) => {left: number};

export default function updateWindowPosition() {
    const {currentContainer} = appStore.getState();
    const {textArea} = DOMCache.containers[currentContainer];
    if(!textArea) return;
    const tooltipWindow = getContainer();
    if(!tooltipWindow) return;
    
    const caret = textArea.selectionStart;
    const textAreaPosition = textArea.getBoundingClientRect();
    const caretePos = getCaretCoordinates(textArea, caret);
    tooltipWindow.style.bottom = textAreaPosition.height + "px";
    tooltipWindow.style.left = caretePos.left + 10 + "px";
}
