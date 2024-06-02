import Prompt from "clientTypes/prompt";
import { DEFAULT_PROMPT_WEIGHT, PROMPT_WEIGHT_FACTOR } from "client/const";

/**
 * Converts prompt string to prompt object (including meta data like weight and external network).
 * @param {*} promptItem 
 */
function promptStringToObject({prompt, nestedWeight = 0, supportExtendedSyntax = true}: {
    prompt: string;
    nestedWeight?: number;
    supportExtendedSyntax?: boolean;
}): Prompt {
    const KEEP_SYNTAX_SYMBOLS = ["{", "}", "|"];

    if(supportExtendedSyntax && KEEP_SYNTAX_SYMBOLS.includes(prompt.trim())) return {id: prompt, isSyntax: true};
    else prompt = prompt.trim();

    //prompt weight
    let weight = DEFAULT_PROMPT_WEIGHT;

    //prompt is a marker for usage of LORA/Hypernetwork
    let isExternalNetwork = false;

    let currChar = "";
    let isEscape = false;
    let i = 0;

    //entering weight
    while(i < prompt.length) {
        if(isEscape) {isEscape = false; i++; continue}

        currChar = prompt.charAt(i);
        if(currChar === "\\") {isEscape = true; i++; continue}
        if(currChar !== "(") break;

        nestedWeight += 1;
        i++;
    }

    //getting prompt weight
    weight = Number( Math.pow(PROMPT_WEIGHT_FACTOR, nestedWeight).toFixed(2) );

    //outing weight
    i = prompt.length - 1;

    while(i < prompt.length) {
        if(isEscape) {isEscape = false; i--; continue}

        currChar = prompt.charAt(i);
        if(prompt.charAt(i - 1) === "\\") {isEscape = true; i--; continue}
        if(currChar !== ")") break;

        nestedWeight -= 1;
        i--;
    }

    //getting new prompt name without weight syntax characters
    i = 0;
    isEscape = false;
    let newPromptItem = "";
    while(i < prompt.length) {
        currChar = prompt.charAt(i);

        if(currChar === "\\") {
            isEscape = true;
            newPromptItem += currChar;
            i++;
            continue;
        }

        if( (currChar !== "(" && currChar !== ")") || isEscape) newPromptItem += currChar;
        if(isEscape) isEscape = false;

        i++;
    }

    prompt = newPromptItem;

    //detecting external network prompt
    if( prompt.startsWith("<") && prompt.endsWith(">") ) {
        isExternalNetwork = true;
        prompt = prompt.substring(1);
        prompt = prompt.substring(0, prompt.length - 1);
    }

    //detecting weight marker
    if(prompt.includes(":")) {
        const promptArr = prompt.split(":");
        const weightDataItem = Number(promptArr.pop());

        if(!Number.isNaN(weightDataItem)) {
            const base = promptArr.join(":").trim();
            prompt = base;
            weight = weightDataItem;
        }
    }

    const promptObject: Prompt = {id: prompt, weight, isExternalNetwork, nestedWeight};

    return promptObject;
}

export default promptStringToObject;
