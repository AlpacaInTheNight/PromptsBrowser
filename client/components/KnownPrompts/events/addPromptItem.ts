import Prompt from 'clientTypes/prompt'
import { DEFAULT_PROMPT_WEIGHT } from 'client/const'
import ActivePrompts from 'client/managers/ActivePrompts'


export default function addPromptItem(targetItem: Prompt) {
    if(!targetItem) return;
    const activePrompts = ActivePrompts.getCurrentPrompts();
    const {id, addAtStart, addAfter, addStart, addEnd} = targetItem;

    const newPrompt: Prompt = {id, weight: DEFAULT_PROMPT_WEIGHT, isExternalNetwork: targetItem.isExternalNetwork};

    if(addStart) ActivePrompts.addStrToActive(addStart, true);

    if(addAfter) {
        if(addAtStart) {
            ActivePrompts.addStrToActive(addAfter, true);
            activePrompts.unshift(newPrompt);

        } else {
            activePrompts.push(newPrompt);
            ActivePrompts.addStrToActive(addAfter, false);
        }

    } else {
        if(addAtStart) activePrompts.unshift(newPrompt);
        else activePrompts.push(newPrompt);
    }

    if(addEnd) ActivePrompts.addStrToActive(addEnd, false);
}
