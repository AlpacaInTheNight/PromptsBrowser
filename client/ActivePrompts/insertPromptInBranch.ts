import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import ActivePrompts from "./index";

function insertPromptInBranch({prompt, index, branch, terminator, groupId, currentGroupId}: {
    prompt: PromptEntity;
    index: number;
    branch?: PromptEntity[];
    terminator?: number;
    groupId?: number | false;
    currentGroupId?: number | false;
}): boolean {
    if(terminator > 100) return false;
    let isRoot = false;
    let isTargetBranch = false;

    if(!branch) {
        branch = ActivePrompts.getCurrentPrompts();
        isRoot = true;
    }

    if(isRoot && groupId === false) isTargetBranch = true;
    else if(groupId === currentGroupId) isTargetBranch = true;

    if(isTargetBranch) {
        branch.splice(index, 0, prompt);
        return true;

    } else {
        for(const branchItem of branch) {
            if("groupId" in branchItem) {
                return insertPromptInBranch({
                    prompt,
                    index,
                    groupId,
                    currentGroupId: branchItem.groupId,
                    branch: (branchItem as PromptGroup).prompts,
                    terminator: terminator + 1
                });
            }
        }
    }

    return false;
}

export default insertPromptInBranch;
