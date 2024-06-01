import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import PromptsBrowser from "client/index";
import { clone, log } from "client/utils/index";

import reindexPromptGroups from "./reindexPromptGroups";
import getPromptByIndexInBranch from "./getPromptByIndexInBranch";
import insertPromptInBranch from "./insertPromptInBranch";
import removePromptInBranch from "./removePromptInBranch";
import convertToGroup from "./convertToGroup";

class ActivePrompts {

    public static foldedGroups: string[] = [];

    public static getCurrentPrompts = () => {
        const {state} = PromptsBrowser;

        if(!state.currentPromptsList[state.currentContainer]) {
            state.currentPromptsList[state.currentContainer] = [];
        }
    
        return state.currentPromptsList[state.currentContainer];
    }

    public static setCurrentPrompts = (currentPrompts: PromptEntity[] = []) => {
        const {state} = PromptsBrowser;
        const {currentPromptsList, currentContainer} = state;
    
        currentPromptsList[currentContainer] = currentPrompts;
    }

    private static getUniqueIdsInBranch(uniqueArray: string[], branch?: PromptEntity[]) {
        let isRoot = false;
        if(!branch) {
            branch = ActivePrompts.getCurrentPrompts();
            isRoot = true;
        }

        for(const branchItem of branch) {
            if("groupId" in branchItem) ActivePrompts.getUniqueIdsInBranch(uniqueArray, branchItem.prompts);
            else if(!branchItem.isSyntax) {
                if(!uniqueArray.includes(branchItem.id)) uniqueArray.push(branchItem.id);
            }
        }
    }

    public static getUniqueIds(branch?: PromptEntity[]) {
        const uniqueArray: string[] = [];
        ActivePrompts.getUniqueIdsInBranch(uniqueArray, branch);

        return uniqueArray;
    }

    private static getUniqueInBranch(uniqueArray: Prompt[], branch?: PromptEntity[]) {
        let isRoot = false;
        if(!branch) {
            branch = ActivePrompts.getCurrentPrompts();
            isRoot = true;
        }

        for(const branchItem of branch) {
            if("groupId" in branchItem) ActivePrompts.getUniqueInBranch(uniqueArray, branchItem.prompts);
            else if(!branchItem.isSyntax) {
                if(!uniqueArray.some(item => item.id === branchItem.id)) uniqueArray.push(branchItem);
            }
        }
    }

    public static getUnique(): Prompt[] {
        const uniqueArray: Prompt[] = [];

        ActivePrompts.getUniqueInBranch(uniqueArray);

        return uniqueArray;
    }

    public static getPromptByIndex(index: number, groupId: number | false) {
        return getPromptByIndexInBranch({index, groupId});
    }

    public static getPromptById({id, groupId = false, currentGroupId = false, branch, terminator = 0}: {
        id: string;
        groupId?: number | false;
        currentGroupId?: number | false;
        branch?: PromptEntity[];
        terminator?: number;
    }): Prompt | false {
        if(terminator > 100) return false;
        if(!branch) branch = ActivePrompts.getCurrentPrompts();

        for(const branchItem of branch) {
            if("id" in branchItem && branchItem.id === id && groupId === currentGroupId) return branchItem;

            if(groupId !== false && "groupId" in branchItem) {
                const {prompts} = branchItem as PromptGroup;

                const result = ActivePrompts.getPromptById({
                    id,
                    branch: prompts,
                    terminator: terminator + 1
                });
                if(result && result.id === id) return result;
            }
        }

        return false;
    }

    public static removePrompt(index: number, groupId?: number | false) {
        removePromptInBranch({index, groupId});
        reindexPromptGroups();
    }

    public static insertPrompt(prompt: PromptEntity, index: number, groupId: number | false = false): boolean {
        const result = insertPromptInBranch({prompt, index, groupId});
        if(result) reindexPromptGroups();

        return result;
    }

    public static replacePrompt(prompt: PromptEntity, index: number, groupId: number | false = false) {
        insertPromptInBranch({prompt, index, groupId, isReplace: true});
        //reindexPromptGroups();
    }

    public static movePrompt({from, to}: {
        from: {index: number; groupId: number | false};
        to: {index: number; groupId: number | false};
    }): boolean {
        const origin = clone(ActivePrompts.getCurrentPrompts());
        const fromElement = removePromptInBranch({...from});
        if(!fromElement || !fromElement[0]) return false;

        const result = ActivePrompts.insertPrompt(fromElement[0], to.index, to.groupId);
        if(!result) ActivePrompts.setCurrentPrompts(origin);

        return result;
    }

    public static groupPrompts({from, to}: {
        from: {index: number; groupId: number | false};
        to: {index: number; groupId: number | false};
    }) {
        const origin = clone(ActivePrompts.getCurrentPrompts());

        const result = convertToGroup({...to});
        if(!result) return false;

        const fromElement = removePromptInBranch({...from});
        if(!fromElement || !fromElement[0]) {
            ActivePrompts.setCurrentPrompts(origin);
            return false;
        }

        result.prompts.push(fromElement[0]);
        reindexPromptGroups();

        return true;
    }

    public static getGroupById(id: number, branch?: PromptEntity[]): false | PromptGroup {
        if(!branch) branch = ActivePrompts.getCurrentPrompts();

        for(const branchItem of branch) {
            if("groupId" in branchItem) {
                if(branchItem.groupId === id) return branchItem;

                const result = ActivePrompts.getGroupById(id, branchItem.prompts);
                if(result) return result;
            }
        }

        return false;
    }

    public static makeGroupKey(group: number | PromptGroup) {
        if(typeof group === "number") group = ActivePrompts.getGroupById(group) as PromptGroup;
        if(!group || !group.prompts) return false;

        const uniquePrompts = ActivePrompts.getUniqueIds(group.prompts);
        const key = uniquePrompts.join(" ");

        return key;
    }

    private static updateFoldedKeys(branch?: PromptEntity[]) {
        if(!branch) {
            ActivePrompts.foldedGroups = [];
            branch = ActivePrompts.getCurrentPrompts();
        }

        for(const branchItem of branch) {
            if("groupId" in branchItem) {
                if(branchItem.folded) {
                    const key = ActivePrompts.makeGroupKey(branchItem);
                    if(key) ActivePrompts.foldedGroups.push(key);
                }

                if(branchItem?.prompts.length) ActivePrompts.updateFoldedKeys(branchItem.prompts);
            }
        }
    }

    public static toggleGroupFold(groupId: number) {
        const targetGroup = ActivePrompts.getGroupById(groupId);
        if(!targetGroup) return false;
        
        targetGroup.folded = targetGroup.folded ? false : true;
        ActivePrompts.updateFoldedKeys();

        return true;
    }
}

export default ActivePrompts;
