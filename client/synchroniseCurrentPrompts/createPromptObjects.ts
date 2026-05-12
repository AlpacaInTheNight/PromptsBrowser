import Database from "client/Database/index";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";
import { normalizePrompt, promptStringToObject} from "client/utils/index";
import Prompt, { PromptEntity } from "clientTypes/prompt";
import ConfigManager from 'client/managers/Config'


export default function createPromptObjects({value, activePrompts, groupId, nestingLevel = 0, normalize = false}: {
    value: string;
    activePrompts: PromptEntity[];
    normalize?: boolean;
    groupId: number | false;
    nestingLevel: number;
}) {
    const {data} = Database;
    const {supportExtendedSyntax = true} = ConfigManager.getConfig();
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

        if(normalize && !isExternalNetwork && !isSyntax) promptItem = normalizePrompt({prompt: promptItem, data});

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
