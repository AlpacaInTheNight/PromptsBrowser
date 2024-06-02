import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import ActivePrompts from "./index";

function unGroupInBranch({groupId, currentGroupId = false, branch, terminator = 0}: {
    groupId: number | false;
    currentGroupId?: number | false;
    branch?: PromptEntity[];
    terminator?: number;
}): boolean {
    if(terminator > 100) return false;
    if(!branch) branch = ActivePrompts.getCurrentPrompts();

    for(let index = 0; index < branch.length; index++) {
        const branchItem = branch[index];

        if("groupId" in branchItem) {
            if(branchItem.groupId === groupId) {
                const {prompts = []} = branchItem;
                branch.splice(index, 1, ...prompts);

                return true;
            }

            const result = unGroupInBranch({
                groupId,
                currentGroupId: branchItem.groupId,
                branch: (branchItem as PromptGroup).prompts,
                terminator: terminator + 1
            });

            if(result) return result;
        }
    }

    return false;
}

export default unGroupInBranch;
