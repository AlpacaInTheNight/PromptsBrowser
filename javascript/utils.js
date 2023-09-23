
if(!window.PromptsBrowser) window.PromptsBrowser = {};

window.PromptsBrowser.replaceAllRegex = function(str, oldStr, newStr) {
    if(!str || !oldStr) return str;

    return str.replace(new RegExp(oldStr, 'g'), newStr);
};

/**
 * Make sure to update server-side makeFileNameSafe method as well
 */
window.PromptsBrowser.makeFileNameSafe = function(fileName) {
    if(!fileName) return;
    const {replaceAllRegex} = window.PromptsBrowser;

    fileName = replaceAllRegex(fileName, "_", " ");

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
window.PromptsBrowser.normalizePrompt = function(prompt) {
    const {state} = PromptsBrowser;
    const {config} = state;

    if(!prompt) return prompt;

    prompt = prompt.trim();
    if(!prompt) return prompt;

    //Skip external networks prompts.
    if(prompt.startsWith("<") && prompt.endsWith(">")) return prompt;

    if(config.toLowerCase) prompt = prompt.toLowerCase();
    
    if(config.spaceMode === "space") prompt = prompt.replaceAll("_", " ");
    else if(config.spaceMode === "underscore") prompt = prompt.replaceAll(" ", "_");

    return prompt;
}

/**
 * Converts prompt string to prompt object (including meta data like weight and external network).
 * @param {*} promptItem 
 */
window.PromptsBrowser.promptStringToObject = function(promptItem, nestedWeight = 0) {
    const {state} = PromptsBrowser;
    const {supportExtendedSyntax = true} = state.config;
    const KEEP_SYNTAX_SYMBOLS = ["{", "}", "|"];
    const {DEFAULT_PROMPT_WEIGHT, PROMPT_WEIGHT_FACTOR} = PromptsBrowser.params;

    if(supportExtendedSyntax && KEEP_SYNTAX_SYMBOLS.includes(promptItem.trim())) return {id: promptItem, isSyntax: true};
    else promptItem = promptItem.trim();

    //prompt weight
    let weight = DEFAULT_PROMPT_WEIGHT;

    //prompt is a marker for usage of LORA/Hypernetwork
    let isExternalNetwork = false;

    let currChar = "";
    let isEscape = false;
    let i = 0;

    //entering weight
    while(i < promptItem.length) {
        if(isEscape) {isEscape = false; i++; continue}

        currChar = promptItem.charAt(i);
        if(currChar === "\\") {isEscape = true; i++; continue}
        if(currChar !== "(") break;

        nestedWeight += 1;
        i++;
    }

    //getting prompt weight
    weight = Number( Math.pow(PROMPT_WEIGHT_FACTOR, nestedWeight).toFixed(2) );

    //outing weight
    i = promptItem.length - 1;

    while(i < promptItem.length) {
        if(isEscape) {isEscape = false; i--; continue}

        currChar = promptItem.charAt(i);
        if(promptItem.charAt(i - 1) === "\\") {isEscape = true; i--; continue}
        if(currChar !== ")") break;

        nestedWeight -= 1;
        i--;
    }

    //getting new prompt name without weight syntax characters
    i = 0;
    isEscape = false;
    let newPromptItem = "";
    while(i < promptItem.length) {
        currChar = promptItem.charAt(i);

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

    promptItem = newPromptItem;

    //detecting external network prompt
    if( promptItem.startsWith("<") && promptItem.endsWith(">") ) {
        isExternalNetwork = true;
        promptItem = promptItem.substring(1);
        promptItem = promptItem.substring(0, promptItem.length - 1);
    }

    //detecting weight marker
    if(promptItem.includes(":")) {
        const promptArr = promptItem.split(":");
        const weightDataItem = Number(promptArr.pop());

        if(!Number.isNaN(weightDataItem)) {
            const base = promptArr.join(":").trim();
            promptItem = base;
            weight = weightDataItem;
        }
    }

    promptObject = {id: promptItem, weight, isExternalNetwork, nestedWeight};

    return promptObject;
}

window.PromptsBrowser.stringToPromptsArray = function(str) {
    if(!str) return false;
    const promptsArray = [];

    const arr = str.split(",");
    for(let promptItem of arr) {
        promptItem = promptItem.trim();
        if(!promptItem) continue;

        const newPrompt = window.PromptsBrowser.promptStringToObject(promptItem);
        promptsArray.push(newPrompt);
    }

    return promptsArray;
}

window.PromptsBrowser.addStrToActive = function(str, atStart = false) {
    const arr = window.PromptsBrowser.stringToPromptsArray(str);
    if(!arr || !arr.length) return;
    const activePrompts = PromptsBrowser.getCurrentPrompts();

    for(let prompt of arr) {
        if(activePrompts.some(item => item.id === prompt.id)) continue;
        
        atStart ? activePrompts.unshift(prompt) : activePrompts.push(prompt);
    }
}
