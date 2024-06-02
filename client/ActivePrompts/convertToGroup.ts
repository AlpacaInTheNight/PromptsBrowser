import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import ActivePrompts from "./index";

function convertToGroup({index, groupId = false, currentGroupId = false, branch, terminator = 0}: {
    index: number;
    groupId?: number | false;
    currentGroupId?: number | false;
    branch?: PromptEntity[];
    terminator?: number;
}):PromptGroup | false {
    
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
        const targetEntity = branch[index];
        if(!targetEntity) return false;

        const newGroup: PromptGroup = {
            groupId: undefined,
            parentGroup: currentGroupId,
            weight: 0,
            prompts: [targetEntity],
        };

        branch[index] = newGroup;

        return branch[index];

    } else {
        for(const branchItem of branch) {
            if("groupId" in branchItem) {
                const result = convertToGroup({
                    index,
                    groupId,
                    currentGroupId: branchItem.groupId,
                    branch: (branchItem as PromptGroup).prompts,
                    terminator: terminator + 1
                });

                if(result) return result;
            }
        }
    }

    return false;
}

export default convertToGroup;
