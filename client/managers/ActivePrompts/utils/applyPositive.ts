import ActivePrompts from 'client/managers/ActivePrompts'
import { AddStyleType } from 'clientTypes/style'
import { PromptEntity } from 'clientTypes/prompt'
import addBranch from './addBranch';


export default function applyPositive(positive: PromptEntity[], isAfter: boolean, addType: AddStyleType = AddStyleType.UniqueRoot) {
    if(!positive || !positive.length) return false;

    const uniqueUsedPrompts = ActivePrompts.getUniqueIds();
    const activePrompts = ActivePrompts.getCurrentPrompts();

    if(addType === AddStyleType.UniqueRoot || addType === AddStyleType.All) {
        if(isAfter) {
            for(const prompt of positive) {
                if("groupId" in prompt) {
                    activePrompts.push({...prompt});
                    continue;
                }

                const {id, isSyntax} = prompt;
                if(addType === AddStyleType.UniqueRoot && !isSyntax && uniqueUsedPrompts.includes(id) ) continue;
        
                activePrompts.push({...prompt});
            }

        } else {
            for(let i = positive.length - 1; i >= 0; i--) {
                const prompt = positive[i];

                if("groupId" in prompt) {
                    activePrompts.unshift({...prompt});
                    continue;
                }
                
                const {id, isSyntax} = prompt;
                if(addType === AddStyleType.UniqueRoot && !isSyntax && uniqueUsedPrompts.includes(id) ) continue;

                activePrompts.unshift({...prompt});
            }

        }
    } else if(addType === AddStyleType.UniqueOnly) {
        addBranch(true, positive, activePrompts, isAfter, uniqueUsedPrompts);
    }
}
