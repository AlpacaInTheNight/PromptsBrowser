import Prompt from "clientTypes/prompt";
import State from "clientTypes/state";
import Data from "clientTypes/data";
import Database from "client/Database/index";
import PromptsBrowser from "client/index";
import { DEFAULT_PROMPT_WEIGHT, PROMPT_WEIGHT_FACTOR } from "client/const";

const regex = {
    REGX_SINGLE_UNDERSCORE: /(?<!_)_(?!_)/g,
}

function replaceAllRegex(str: string, oldStr: string | RegExp, newStr: string): string {
    if(!str || !oldStr) return str;

    return str.replace(new RegExp(oldStr, 'g'), newStr);
};

/**
 * Make sure to update server-side makeFileNameSafe method as well
 */
function makeFileNameSafe(fileName: string) {
    if(!fileName) return;
    const {REGX_SINGLE_UNDERSCORE} = regex;

    fileName = replaceAllRegex(fileName, REGX_SINGLE_UNDERSCORE, " ");

    //unix/win
    fileName = replaceAllRegex(fileName, "/", "_fsl_");

    //win
    fileName = replaceAllRegex(fileName, ":", "_col_");
    fileName = replaceAllRegex(fileName, "\\\\", "_bsl_");
    fileName = replaceAllRegex(fileName, "<", "_lt_");
    fileName = replaceAllRegex(fileName, ">", "_gt_");
    fileName = replaceAllRegex(fileName, "\"", "_dq_");
    fileName = replaceAllRegex(fileName, "\\|", "_pip_");
    fileName = replaceAllRegex(fileName, "\\?", "_qm_");
    fileName = replaceAllRegex(fileName, "\\*", "_ast_");

    fileName = fileName.trim();

    return fileName;
}

/**
 * Modifies prompt input so that prompts conform to the same style.
 * @param {*} prompt 
 * @returns 
 */
function normalizePrompt({prompt, state, data}: {
    prompt: string;
    state: State;
    data: Data;
}) {
    const {unitedList} = data;
    const {config} = state;
    const {REGX_SINGLE_UNDERSCORE} = regex;

    if(!prompt) return prompt;

    prompt = prompt.trim();
    if(!prompt) return prompt;

    //do not modify saved prompts
    if(unitedList[prompt]) return prompt;

    //Skip external networks prompts.
    if(prompt.startsWith("<") && prompt.endsWith(">")) return prompt;

    if(config.toLowerCase) prompt = prompt.toLowerCase();
    
    if(config.spaceMode === "space") prompt = prompt.replaceAll(REGX_SINGLE_UNDERSCORE, " ");
    else if(config.spaceMode === "underscore") prompt = prompt.replaceAll(" ", "_");

    return prompt;
}

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

function stringToPromptsArray(str: string, supportExtendedSyntax: boolean) {
    if(!str) return false;
    const promptsArray = [];

    const arr = str.split(",");
    for(let prompt of arr) {
        prompt = prompt.trim();
        if(!prompt) continue;

        const newPrompt = promptStringToObject({prompt, supportExtendedSyntax});
        promptsArray.push(newPrompt);
    }

    return promptsArray;
}

function addStrToActive(str: string, atStart = false, supportExtendedSyntax: boolean = false) {
    const arr = stringToPromptsArray(str, supportExtendedSyntax);
    if(!arr || !arr.length) return;
    const activePrompts = PromptsBrowser.getCurrentPrompts();

    for(let prompt of arr) {
        if(activePrompts.some(item => item.id === prompt.id)) continue;
        
        atStart ? activePrompts.unshift(prompt) : activePrompts.push(prompt);
    }
}

function log(message: string) {
    console.log(message);
}

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isInSameCollection(promptA: string, promptB: string): any {
    let targetCollection = undefined;
    
    for(const id in Database.data.original) {
        const collection = Database.data.original[id];
        const containsA = collection.some(item => item.id === promptA);
        const containsB = collection.some(item => item.id === promptB);
        if(containsA && containsB) {
            targetCollection = id;
            break;
        }
    }
    
    return targetCollection
}

export {
    replaceAllRegex,
    makeFileNameSafe,
    normalizePrompt,
    promptStringToObject,
    stringToPromptsArray,
    addStrToActive,
    randomIntFromInterval,
    isInSameCollection,
    log,
}
