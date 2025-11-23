import { promptStringToObject } from 'client/utils'
import ActivePrompts from 'client/managers/ActivePrompts'


export default function filterNewPromptsOnly(str: string) {
    if(!str) return "";

    const newStrPromptsArr = [];
    const uniquePrompts = ActivePrompts.getUnique();
    const newArr = str.split(",");

    for(let prompt of newArr) {
        const newPrompt = promptStringToObject({prompt});
        if(uniquePrompts.some(item => item.id === newPrompt.id)) continue;
        
        newStrPromptsArr.push(prompt);
    }

    return newStrPromptsArr.join(", ");
}
