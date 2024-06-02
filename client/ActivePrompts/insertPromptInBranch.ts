import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import ActivePrompts from "./index";

function insertPromptInBranch({prompt, isReplace = false, index, branch, terminator = 0, groupId, currentGroupId}: {
    prompt: PromptEntity;
    index: number;
    isReplace?: boolean;
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
        if(isReplace && "id" in prompt) {
            const targetPrompt = branch[index];
            if(!targetPrompt || "groupId" in targetPrompt) return false;

            targetPrompt.id = prompt.id;
            targetPrompt.isExternalNetwork = prompt.isExternalNetwork;

        } else branch.splice(index, 0, prompt);

        return true;

    } else {
        for(const branchItem of branch) {
            if("groupId" in branchItem) {
                const result = insertPromptInBranch({
                    prompt,
                    index,
                    groupId,
                    isReplace,
                    currentGroupId: branchItem.groupId,
                    branch: (branchItem as PromptGroup).prompts,
                    terminator: terminator + 1
                });

                if(result) return true;
            }
        }
    }

    return false;
}

export default insertPromptInBranch;
