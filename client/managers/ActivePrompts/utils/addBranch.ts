import { PromptEntity } from "clientTypes/prompt";


export function addItem(isRoot: boolean, branchItem: PromptEntity, activePrompts: PromptEntity[], isAfter: boolean, unique: string[]) {
    if("groupId" in branchItem) {
        const {prompts} = branchItem;

        branchItem.prompts = [];
        addBranch(false, prompts, branchItem.prompts, isAfter, unique);

        if(isRoot && !isAfter) activePrompts.unshift(branchItem);
        else activePrompts.push(branchItem);

    } else {
        const {id, isSyntax} = branchItem;
        if(!isSyntax && unique.includes(id) ) return;

        if(isRoot && !isAfter) activePrompts.unshift({...branchItem});
        else activePrompts.push({...branchItem});
    }
}

export default function addBranch(isRoot: boolean, branch: PromptEntity[], activePrompts: PromptEntity[], isAfter: boolean, unique: string[]) {
    if(isRoot && !isAfter) {
        for(let i = branch.length - 1; i >= 0; i--) {
            const branchItem = branch[i];
            addItem(isRoot, branchItem, activePrompts, isAfter, unique);
        }

    } else {
        for(const branchItem of branch) {
            addItem(isRoot, branchItem, activePrompts, isAfter, unique);
        }
    }
}
