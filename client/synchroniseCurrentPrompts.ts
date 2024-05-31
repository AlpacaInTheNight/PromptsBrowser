import Database from "client/Database/index";
import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";
import { normalizePrompt, promptStringToObject} from "client/utils/index";
import { parseGroups, PromptStringEntity, PromptStringGroup } from 'client/utils/parseGroups';
import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";

function createPromptObjects({value, activePrompts, groupId, nestingLevel = 0, normalize = false}: {
    value: string;
    activePrompts: PromptEntity[];
    normalize?: boolean;
    groupId: number | false;
    nestingLevel: number;
}) {
    const {state} = PromptsBrowser;
    const {data} = Database;
    const {supportExtendedSyntax = true} = state.config;
    const KEEP_SYNTAX_SYMBOLS = ["{", "}", "|"];
    const DELIMITER_CHAR = ",";
    const SPACE_CHAR = " ";
    let prompts: string[] = [];

    if(supportExtendedSyntax) {
        prompts = value.split(/([,{}|])/g);
        prompts = prompts.filter(strItem => strItem);
    
        prompts = prompts.map((strItem, i, arr) => {
            if(typeof strItem !== "string") return strItem;
    
            let trimStr = strItem.trim();
            if(KEEP_SYNTAX_SYMBOLS.includes(trimStr)) {
                const prevItem = i > 0 ? arr[i - 1] : "";
                const nextItem = arr[i + 1];
    
                if(prevItem && prevItem[prevItem.length - 1] === SPACE_CHAR) strItem = SPACE_CHAR + strItem;
                if(nextItem && nextItem[0] === SPACE_CHAR) strItem += SPACE_CHAR;
            }
            
            return strItem;
        });
    
        prompts = prompts.filter(strItem => strItem && strItem.trim());

    } else {
        prompts = value.split(",");
        prompts = prompts.filter(strItem => strItem && strItem.trim());
        
    }

    for(let i = 0; i < prompts.length; i++) {
        let promptItem = prompts[i];
        if(!promptItem) continue;

        if(!promptItem || promptItem === ",") continue;

        const {id, weight, isExternalNetwork, isSyntax = false, nestedWeight} = promptStringToObject({prompt: promptItem, nestedWeight: 0});
        if(!id) continue;

        promptItem = id;

        if(normalize && !isExternalNetwork && !isSyntax) promptItem = normalizePrompt({prompt: promptItem, state, data});

        const targetItem: Prompt = {
            id: promptItem,
            parentGroup: groupId,
            weight: weight !== undefined ? weight : DEFAULT_PROMPT_WEIGHT
        }

        if(isExternalNetwork) targetItem.isExternalNetwork = true;

        /**
         * If it is a syntax token - also checking if it needs delimiters on its sides in a string.
         */
        if(isSyntax) {
            const prevItem = i > 0 ? prompts[i - 1] : "";
            const nextItem = prompts[i + 1];

            targetItem.isSyntax = true;
            targetItem.delimiter = "none";

            if(prevItem === DELIMITER_CHAR && nextItem === DELIMITER_CHAR) targetItem.delimiter = "both";
            else if(prevItem === DELIMITER_CHAR) targetItem.delimiter = "prev";
            else if(nextItem === DELIMITER_CHAR) targetItem.delimiter = "next";
        }

        activePrompts.push(targetItem);
    }
}

function processGroup({entityArray, activePrompts, normalize = false, nestingLevel = 0, groupId = false}:{
    entityArray: PromptStringEntity[];
    activePrompts: PromptEntity[];
    normalize: boolean;
    nestingLevel?: number;
    groupId?: number | false;
}) {
    for(const entity of entityArray) {
        if(typeof entity === "string") {
            createPromptObjects({
                value: entity,
                normalize,
                activePrompts,
                nestingLevel,
                groupId,
            });

        } else if("id" in entity) {
            const {id, weight, body} = entity;

            const newGroup: PromptGroup = {
                groupId: id,
                weight: weight,
                prompts: [],
            }

            activePrompts.push(newGroup);
            processGroup({
                entityArray: body,
                activePrompts: newGroup.prompts,
                normalize,
                nestingLevel: nestingLevel + 1,
                groupId: id,
            });

            if(ActivePrompts.foldedGroups.length) {
                const keyForGroup = ActivePrompts.makeGroupKey(newGroup);
                if(keyForGroup && ActivePrompts.foldedGroups.includes(keyForGroup)) {
                    newGroup.folded = true;
                }
            }
        }
    }
}

/**
 * Synchronises text content of the textarea with the array of active prompts used by the extension.
 */
function syncCurrentPrompts(noTextAreaUpdate: boolean = true, normalize: boolean = false) {
    const {state} = PromptsBrowser;
    const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
    if(!textArea) return;
    let value = textArea.value;

    //trying to fix LORAs/Hypernetworks added without a preceding comma
    value = value.replace(/([^,])\ </g, "$1,\ <");

    const newActivePrompts: PromptEntity[] = [];
    processGroup({
        entityArray: parseGroups(value),
        activePrompts: newActivePrompts,
        normalize,
    });

    ActivePrompts.setCurrentPrompts(newActivePrompts);
    CurrentPrompts.update(noTextAreaUpdate);
}

function syncListToTextareaBranch(activePrompts: PromptEntity[], prompts: {text: string; src: Prompt; }[] = []) {
    for(const entity of activePrompts) {
        if("groupId" in entity) {
            prompts.push({text: "(", src: {id: "(", isSyntax: true, delimiter: "prev"}});
            syncListToTextareaBranch(entity.prompts, prompts);

            if(entity.weight) prompts.push({text: `: ${entity.weight}`, src: {id: "", isSyntax: true, delimiter: "none"}});
            prompts.push({text: ")", src: {id: ")", isSyntax: true, delimiter: "next"}});

            continue;
        }

        const {id, weight, isExternalNetwork} = entity;

        if(isExternalNetwork) {
            prompts.push({text: `<${id}:${weight}>`, src: entity});

        } else {
            if(weight !== undefined && weight !== DEFAULT_PROMPT_WEIGHT)
                prompts.push({text: `(${id}: ${weight})`, src: entity});
            else
                prompts.push({text: id, src: entity});
        }
    }
}

function syncListToTextarea(activePrompts: PromptEntity[]) {
    const {state, DOMCache} = PromptsBrowser;
    const textArea = DOMCache.containers[state.currentContainer].textArea;
    if(!textArea) return;
    const prompts: {text: string; src: Prompt; }[] = [];

    textArea.value = "";

    syncListToTextareaBranch(activePrompts, prompts);

    let addTextValue = "";
    for(let i = 0; i < prompts.length; i++) {
        const {text, src} = prompts[i];
        const nextPromptSrc = prompts[i+1] ? prompts[i+1].src : undefined;
        addTextValue += text;

        let addDelimiter = true;

        if(!nextPromptSrc) addDelimiter = false;
        else if(src.delimiter) {
            if(src.delimiter === "prev" || src.delimiter === "none") addDelimiter = false;

        } else if(nextPromptSrc.delimiter) {
            if(nextPromptSrc.delimiter === "next" || nextPromptSrc.delimiter === "none") addDelimiter = false;

        }

        if(nextPromptSrc && text === ")" && nextPromptSrc.id === ")") addDelimiter = false;

        if(addDelimiter) addTextValue += ", ";
    }

    textArea.value = addTextValue;

    //Just to be sure every api listening to changes in textarea done their job
    textArea.dispatchEvent(new Event('focus'));
    textArea.dispatchEvent(new Event('input'));
    textArea.dispatchEvent(new KeyboardEvent('keyup'));
    textArea.dispatchEvent(new KeyboardEvent('keypress'));
    textArea.dispatchEvent(new Event('blur'));
}

export {
    syncListToTextarea as synchroniseListToTextarea,
}

export default syncCurrentPrompts;
