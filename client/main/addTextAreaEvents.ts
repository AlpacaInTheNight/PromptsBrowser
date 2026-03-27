import syncCurrentPrompts from 'client/synchroniseCurrentPrompts'
import tooltipStore, { setIsActive } from 'client/components/PromptTooltip/store';


let inputUpdateTimeout = 0;
const UPDATE_TICK = 500;

/**
 * Adds listeners to the main prompt container.
 * @param textArea - HTML text area prompt container
 * @returns 
 */
export default function addTextAreaEvents(textArea?: HTMLTextAreaElement) {
    if(!textArea || textArea.dataset.pbelistenerready) return false;

    textArea.dataset.pbelistenerready = "true";

    textArea.removeEventListener("input", () => syncCurrentPrompts(true, false)); //TODO: does this line really needed?
    textArea.addEventListener("input", () => {

        clearTimeout(inputUpdateTimeout);
        inputUpdateTimeout = setTimeout(() => {
            const {isActive} = tooltipStore.getState();
            if(!isActive) setIsActive(true);

            syncCurrentPrompts(true, false);
        }, UPDATE_TICK);
        
    });

    textArea.addEventListener("focus", () => setIsActive(true));
    textArea.addEventListener("blur", () => setTimeout(() => setIsActive(false), 200));

    return true;
}
