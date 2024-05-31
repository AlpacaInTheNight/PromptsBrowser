import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import ActivePrompts from "./index";

function reindexPromptGroups(branch?: PromptEntity[], parentGroup?: number) {
    let isRoot = false;
    if(!branch) {
        branch = ActivePrompts.getCurrentPrompts();
        isRoot = true;
    }

    for(const branchItem of branch) {
        if("groupId" in branchItem) reindexPromptGroups(branchItem.prompts, branchItem.groupId);
        
        if(isRoot) delete branchItem.parentGroup;
        else if(branchItem.parentGroup !== parentGroup) branchItem.parentGroup = parentGroup;
    }
}

export default reindexPromptGroups;
