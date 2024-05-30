import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Database from "client/Database/index";
import showPromptItem from "client/showPromptItem";
import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";
import CurrentPromptsEvent from "./event";
import { synchroniseListToTextarea } from "client/synchroniseCurrentPrompts";
import { makeElement, makeDiv, makeSelect } from "client/dom";

class CurrentPrompts {

    public static init = (wrapper: HTMLElement, containerId: string) => {
        const currentPrompts = document.createElement("div");
        currentPrompts.className = "PBE_currentPrompts";
    
        PromptsBrowser.DOMCache.containers[containerId].currentPrompts = currentPrompts;
        wrapper.appendChild(currentPrompts);
    }
    
    public static initButton = (positiveWrapper: HTMLElement) => {
        const {readonly} = Database.meta;
        const normalizeButton = document.createElement("button");
    
        normalizeButton.className = "PBE_actionButton PBE_normalizeButton";
        normalizeButton.innerText = "Normalize";
    
        if(readonly) normalizeButton.className = "PBE_actionButton PBE_normalizeButton_readonly";
    
        normalizeButton.addEventListener("click", CurrentPromptsEvent.onNormalizePrompts);
    
        positiveWrapper.appendChild(normalizeButton);
    }

    private static showPromptsGroup(promptsGroup: PromptEntity[] = [], wrapper: HTMLElement) {
        const {state} = PromptsBrowser;
        const {cardHeight = 100} = state.config;

        for(let index = 0; index < promptsGroup.length; index++) {
            const promptItem = promptsGroup[index];

            if("groupId" in promptItem) {
                const groupContainer = makeDiv({className: "PBE_promptsGroup"});
                const groupHead = makeDiv({className: "PBE_groupHead"});
                groupHead.style.height = cardHeight + "px";
                groupContainer.appendChild(groupHead);
                wrapper.appendChild(groupContainer);
                if(promptItem.weight) groupHead.innerText = promptItem.weight + "";

                CurrentPrompts.showPromptsGroup(promptItem.prompts, groupContainer);
                continue;
            }

            const {id, parentGroup = false} = promptItem;
    
            const promptElement = showPromptItem({prompt: promptItem, options: {index, parentGroup}});
    
            if(promptItem.isSyntax) promptElement.dataset.issyntax = "true";
            else if(state.selectedPrompt === id) promptElement.classList.add("PBE_selectedCurrentElement");
    
            promptElement.addEventListener("dragstart", CurrentPromptsEvent.onDragStart);
            promptElement.addEventListener("dragover", CurrentPromptsEvent.onDragOver);
            promptElement.addEventListener("dragenter", CurrentPromptsEvent.onDragEnter);
            promptElement.addEventListener("dragleave", CurrentPromptsEvent.onDragLeave);
            promptElement.addEventListener("drop", CurrentPromptsEvent.onDrop);
            promptElement.addEventListener("click", CurrentPromptsEvent.onPromptSelected);
            
            if(!promptItem.isSyntax) {
                promptElement.addEventListener("dblclick", CurrentPromptsEvent.onDblClick);
                promptElement.addEventListener("wheel", CurrentPromptsEvent.scrollWeight);
            }
    
            wrapper.appendChild(promptElement);
        }

    }
    
    public static update = (noTextAreaUpdate = false) => {
        const {state} = PromptsBrowser;
        const activePrompts = ActivePrompts.getCurrentPrompts();
    
        const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
        const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
    
        if(!wrapper || !textArea) return;
        wrapper.innerHTML = "";

        CurrentPrompts.showPromptsGroup(activePrompts, wrapper);
        if(noTextAreaUpdate) return;

        synchroniseListToTextarea(activePrompts);
    }

}

export default CurrentPrompts;
