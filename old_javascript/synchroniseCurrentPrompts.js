
if(!window.PromptsBrowser) window.PromptsBrowser = {};

/**
 * Synchronises text content of the textarea with the array of active prompts used by the extension.
 */
PromptsBrowser.synchroniseCurrentPrompts = (noTextAreaUpdate = true, normalize = false) => {
    const {normalizePrompt} = window.PromptsBrowser;
    const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
    const {state} = PromptsBrowser;
    const {supportExtendedSyntax = true} = state.config;
    const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
    const KEEP_SYNTAX_SYMBOLS = ["{", "}", "|"];
    const DELIMITER_CHAR = ",";
    const SPACE_CHAR = " ";
    if(!textArea) return;
    let activePrompts = PromptsBrowser.getCurrentPrompts();
    let value = textArea.value;

    //trying to fix LORAs/Hypernetworks added without a preceding comma
    value = value.replace(/([^,])\ </g, "$1,\ <");

    const newPBE_currentPrompts = [];
    let prompts = [];

    if(supportExtendedSyntax) {
        prompts = value.split(/([,{}|])/g);
        prompts = prompts.filter(strItem => strItem);
    
        prompts = prompts.map((strItem, i, arr) => {
            if(typeof strItem !== "string") return strItem;
    
            let trimStr = strItem.trim();
            if(KEEP_SYNTAX_SYMBOLS.includes(trimStr)) {
                const prevItem = i > 0 ? arr[i-1] : "";
                const nextItem = arr[i+1];
    
                if(prevItem && prevItem[prevItem.length-1] === SPACE_CHAR) strItem = SPACE_CHAR + strItem;
                if(nextItem && nextItem[0] === SPACE_CHAR) strItem += SPACE_CHAR;
            }
            
            return strItem;
        });
    
        prompts = prompts.filter(strItem => strItem && strItem.trim());

    } else {
        prompts = value.split(",");
        prompts = prompts.filter(strItem => strItem && strItem.trim());
        
    }

    let currNestedWeight = 0;
    let index = 0;

    for(let i = 0; i < prompts.length; i++) {
        let promptItem = prompts[i];
        if(!promptItem || promptItem === ",") continue;

        const {id, weight, isExternalNetwork, isSyntax = false, nestedWeight} = window.PromptsBrowser.promptStringToObject(promptItem, currNestedWeight);

        currNestedWeight = nestedWeight;
        promptItem = id;

        if(normalize && !isExternalNetwork && !isSyntax) promptItem = normalizePrompt(promptItem);

        let targetItem = !isSyntax ? activePrompts.find(item => item.id === promptItem) : undefined;
        
        if(targetItem) {
            if(targetItem.weight !== weight) targetItem.weight = weight;
            
        } else {
            targetItem = {
                id: promptItem,
                index,
                weight: weight !== undefined ? weight : DEFAULT_PROMPT_WEIGHT
            }
        }

        if(isExternalNetwork) targetItem.isExternalNetwork = true;

        /**
         * If it is a syntax token - also checking if it needs delimiters on its sides in string.
         */
        if(isSyntax) {
            const prevItem = i > 0 ? prompts[i-1] : "";
            const nextItem = prompts[i+1];

            targetItem.isSyntax = true;
            targetItem.delimiter = "none";

            if(prevItem === DELIMITER_CHAR && nextItem === DELIMITER_CHAR) targetItem.delimiter = "both";
            else if(prevItem === DELIMITER_CHAR) targetItem.delimiter = "prev";
            else if(nextItem === DELIMITER_CHAR) targetItem.delimiter = "next";
        }

        newPBE_currentPrompts.push(targetItem);
        index++;
    }

    activePrompts = newPBE_currentPrompts;

    PromptsBrowser.setCurrentPrompts(activePrompts);
    PromptsBrowser.currentPrompts.update(noTextAreaUpdate);
}
