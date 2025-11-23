import Data from "clientTypes/data";
import promptStringToObject from "./promptStringToObject";
import parseGroups from "./parseGroups";
import DOMCache from 'client/DOMCache'
import ConfigManager from 'client/managers/Config'


const regex = {
    REGX_SINGLE_UNDERSCORE: /(?<!_)_(?!_)/g,
}

function clone<T>(obj: T): T {
    if(structuredClone) return structuredClone(obj);
    else return JSON.parse( JSON.stringify(obj) );
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
function normalizePrompt({prompt, data}: {
    prompt: string;
    data: Data;
}) {
    const {unitedList} = data;
    const config = ConfigManager.getConfig();
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

function log(message: string) {
    console.log(message);
}

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getCheckpoint(): string | false {
    const checkpointSelector = DOMCache.modelCheckpoint;
    if(!checkpointSelector) return false;
    const input = checkpointSelector.querySelector("input");
    if(!input || !input.value) return false;
    let checkpoint = input.value;

    //removing the cache marker.
    const arr = checkpoint.split(" ");
    const lastPart = arr[arr.length - 1];
    if(lastPart && lastPart[0] === "[") arr.pop();
    checkpoint = arr.join(" ");

    //remove file extension
    checkpoint = checkpoint.replace(".safetensors", "");
    
    checkpoint = checkpoint.trim();

    return checkpoint;
}



export {
    clone,
    replaceAllRegex,
    makeFileNameSafe,
    normalizePrompt,
    parseGroups,
    promptStringToObject,
    stringToPromptsArray,
    randomIntFromInterval,
    getCheckpoint,
    log,
}
