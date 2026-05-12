import { DEFAULT_PROMPT_WEIGHT } from "client/const";
import Prompt, { PromptEntity } from "clientTypes/prompt";


export default function syncListToTextareaBranch(activePrompts: PromptEntity[], prompts: {text: string; src: Prompt; }[] = []) {
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
            if(weight !== undefined && weight !== DEFAULT_PROMPT_WEIGHT)
                prompts.push({text: `<${id}:${weight}>`, src: entity});
            else
                prompts.push({text: `<${id}>`, src: entity});

        } else {
            if(weight !== undefined && weight !== DEFAULT_PROMPT_WEIGHT)
                prompts.push({text: `(${id}: ${weight})`, src: entity});
            else
                prompts.push({text: id, src: entity});
        }
    }
}
