import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import ActivePrompts from "./index";

function removePromptInBranch({index, branch, terminator = 0, groupId, currentGroupId}: {
    index: number;
    branch?: PromptEntity[];
    terminator?: number;
    groupId?: number | false;
    currentGroupId?: number | false;
}): false | PromptEntity[] {
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
        return branch.splice(index as number, 1);

    } else {
        for(const branchItem of branch) {
            if("groupId" in branchItem) {
                const result = removePromptInBranch({
                    index,
                    groupId,
                    currentGroupId: branchItem.groupId,
                    branch: (branchItem as PromptGroup).prompts,
                    terminator: terminator + 1
                });

                if(result !== false) return result;
            }
        }
    }

    return false;
}

export default removePromptInBranch;
