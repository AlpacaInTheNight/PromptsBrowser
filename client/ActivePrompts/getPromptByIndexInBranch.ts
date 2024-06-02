import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import ActivePrompts from "./index";

function getPromptByIndexInBranch({index, branch, terminator = 0, groupId = false, currentGroupId = false}: {
    index: number;
    branch?: PromptEntity[];
    terminator?: number;
    groupId?: number | false;
    currentGroupId?: number | false;
}): false | Prompt {
    if(terminator > 100) return false;
    if(!branch) branch = ActivePrompts.getCurrentPrompts();

    if(groupId === currentGroupId) {
        const target = branch[index];
        if(target && "id" in target) return target;
        else return false;
    }

    for(const branchItem of branch) {

        if(groupId !== false && "groupId" in branchItem) {
            const {prompts} = branchItem as PromptGroup;

            const result = getPromptByIndexInBranch({
                index,
                branch: prompts,
                terminator: terminator + 1,
                groupId,
                currentGroupId: branchItem.groupId,
            });

            if(result) return result;
        }
    }

    return false;
}

export default getPromptByIndexInBranch;
