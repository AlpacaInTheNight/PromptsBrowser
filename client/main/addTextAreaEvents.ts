import syncCurrentPrompts from 'client/synchroniseCurrentPrompts'
import { setIsActive } from 'client/components/PromptTooltip/store';


/**
 * Adds listeners to the main prompt container.
 * @param textArea - HTML text area prompt container
 * @returns 
 */
export default function addTextAreaEvents(textArea?: HTMLTextAreaElement) {
    if(!textArea || textArea.dataset.pbelistenerready) return false;

    textArea.dataset.pbelistenerready = "true";

    textArea.removeEventListener("input", () => syncCurrentPrompts(true, false)); //TODO: does this line really needed?
    textArea.addEventListener("input", () => syncCurrentPrompts(true, false));

    textArea.addEventListener("focus", () => setIsActive(true));
    textArea.addEventListener("blur", () => setIsActive(false));

    return true;
}
