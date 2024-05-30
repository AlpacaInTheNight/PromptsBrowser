import State from "clientTypes/state";
import Data from "clientTypes/data";
import ActivePrompts from "client/ActivePrompts/index";
import Database from "client/Database/index";
import PromptsBrowser from "client/index";
import promptStringToObject from "./promptStringToObject";
import parseGroups from "./parseGroups";

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
    const activePrompts = ActivePrompts.getCurrentPrompts();

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
    parseGroups,
    promptStringToObject,
    stringToPromptsArray,
    addStrToActive,
    randomIntFromInterval,
    isInSameCollection,
    log,
}
