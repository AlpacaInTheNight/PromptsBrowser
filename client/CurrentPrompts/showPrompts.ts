import PromptsBrowser from "client/index";
import showPromptItem from "client/showPromptItem";
import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import CurrentPromptsEvent from "./event";
import PromptsSimpleFilter from "client/PromptsFilter/simple";
import { FilterSimple } from "clientTypes/filter";
import { makeDiv } from "client/dom";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";
import ActivePrompts from "client/ActivePrompts/index";

function sortPrompts(prompts: PromptEntity[], sorting: string) {

    //store original index
    for(let index = 0; index < prompts.length; index++) {
        const promptItem = prompts[index];
        if("id" in promptItem) promptItem.index = index;
    }

    switch(sorting) {

        case "alph":
            //sorting prompts alphabetically
            prompts.sort( (A, B) => {
                if("groupId" in A && "groupId" in B) return 0;
                if("id" in A && "groupId" in B) return -1;
                if("id" in B && "groupId" in A) return 1;

                if("id" in A && "id" in B) {
                    if(A.id.toLowerCase() < B.id.toLowerCase()) return -1;
                    if(A.id.toLowerCase() > B.id.toLowerCase()) return 1;
                }

                return 0;
            });
            break;

        case "alphReversed":
            //sorting prompts alphabetically in reverse orderd
            prompts.sort( (A, B) => {
                if("groupId" in A && "groupId" in B) return 0;
                if("id" in A && "groupId" in B) return -1;
                if("id" in B && "groupId" in A) return 1;

                if("id" in A && "id" in B) {
                    if(A.id.toLowerCase() < B.id.toLowerCase()) return 1;
                    if(A.id.toLowerCase() > B.id.toLowerCase()) return -1;
                }

                return 0;
            });
            break;

        case "weight":
            //sorting prompts based on their weight
            prompts.sort( (A, B) => {
                if("id" in A && "groupId" in B) return -1;
                if("id" in B && "groupId" in A) return 1;

                if(A.weight < B.weight) return 1;
                if(A.weight > B.weight) return -1;

                return 0;
            });
    }
}

function showPrompts(props: {
    prompts: PromptEntity[];
    wrapper: HTMLElement;
    allowMove?: boolean;
    focusOn?: {index: number; groupId: number | false; };

    filterSimple?: FilterSimple;

    onClick?: (e: MouseEvent) => void;
    onDblClick?: (e: MouseEvent) => void;
    onWheel?: (e: WheelEvent) => void;
}) {
    const {prompts = [], focusOn, filterSimple, wrapper, allowMove = false, onClick, onDblClick, onWheel} = props;
    const {state} = PromptsBrowser;
    const {checkFilter} = PromptsSimpleFilter;
    const {cardHeight = 100} = state.config;

    if(filterSimple?.sorting) sortPrompts(prompts, filterSimple.sorting);

    for(let index = 0; index < prompts.length; index++) {
        const promptItem = prompts[index];
        const useIndex = promptItem.index !== undefined ? promptItem.index : index;

        if("groupId" in promptItem) {
            const groupContainer = makeDiv({className: promptItem.folded ? "PBE_promptsGroup PBE_promptsGroupFolded" : "PBE_promptsGroup"});

            const groupHead = makeDiv({className: "PBE_groupHead"});
            groupHead.style.height = cardHeight + "px";
            groupHead.dataset.id = promptItem.groupId + "";
            groupHead.dataset.index = useIndex + "";
            groupHead.dataset.group = promptItem.parentGroup + "";
            groupHead.dataset.isgroup = "true";
            groupHead.addEventListener("click", CurrentPromptsEvent.onGroupHeadClick);
            groupHead.addEventListener("wheel", CurrentPromptsEvent.onGroupHeadWheel);

            if(promptItem.folded) groupHead.innerText += ActivePrompts.makeGroupKey(promptItem);

            if(promptItem.weight && promptItem.weight !== DEFAULT_PROMPT_WEIGHT) {
                const groupWeight = makeDiv({className: "PBE_groupHeadWeight", content: promptItem.weight + ""});
                groupHead.appendChild(groupWeight);
            }

            if(allowMove) {
                groupHead.draggable = true;
                groupHead.addEventListener("dragstart", CurrentPromptsEvent.onDragStart);
                groupHead.addEventListener("dragover", CurrentPromptsEvent.onDragOver);
                groupHead.addEventListener("dragenter", CurrentPromptsEvent.onDragEnter);
                groupHead.addEventListener("dragleave", CurrentPromptsEvent.onDragLeave);
                groupHead.addEventListener("drop", CurrentPromptsEvent.onDrop);
            }

            groupContainer.appendChild(groupHead);
            wrapper.appendChild(groupContainer);
            
            if(!promptItem.folded) showPrompts({...props, prompts: promptItem.prompts, wrapper: groupContainer})
            continue;
        }

        //check filters
        if(filterSimple && !checkFilter(promptItem.id, filterSimple)) continue;

        const {id, parentGroup = false} = promptItem;
        let isShadowed: boolean = false;
        if(focusOn) {
            isShadowed = true;
            if(useIndex === focusOn.index && parentGroup === focusOn.groupId) isShadowed = false;
        }

        const promptElement = showPromptItem({prompt: promptItem, options: {index: useIndex, parentGroup, isShadowed}});

        if(promptItem.isSyntax) promptElement.dataset.issyntax = "true";
        else if(state.selectedPrompt === id) promptElement.classList.add("PBE_selectedCurrentElement");

        if(allowMove) {
            promptElement.addEventListener("dragstart", CurrentPromptsEvent.onDragStart);
            promptElement.addEventListener("dragover", CurrentPromptsEvent.onDragOver);
            promptElement.addEventListener("dragenter", CurrentPromptsEvent.onDragEnter);
            promptElement.addEventListener("dragleave", CurrentPromptsEvent.onDragLeave);
            promptElement.addEventListener("drop", CurrentPromptsEvent.onDrop);
        }

        if(onClick) promptElement.addEventListener("click", onClick);

        if(!promptItem.isSyntax) {
            if(onDblClick) promptElement.addEventListener("dblclick", onDblClick);
            if(onWheel) promptElement.addEventListener("wheel", onWheel);
        }

        wrapper.appendChild(promptElement);
    }

}

export default showPrompts;
