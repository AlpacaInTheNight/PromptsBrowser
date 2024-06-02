import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Database from "client/Database/index";
import CurrentPromptsEvent from "./event";
import { synchroniseListToTextarea } from "client/synchroniseCurrentPrompts";
import showPrompts from "./showPrompts";

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
    
    public static update = (noTextAreaUpdate = false) => {
        const {state} = PromptsBrowser;
        const activePrompts = ActivePrompts.getCurrentPrompts();
    
        const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
        const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
    
        if(!wrapper || !textArea) return;
        wrapper.innerHTML = "";

        showPrompts({
            prompts: activePrompts,
            wrapper,
            allowMove: true,
            onClick: CurrentPromptsEvent.onPromptSelected,
            onDblClick: CurrentPromptsEvent.onDblClick,
            onWheel: CurrentPromptsEvent.scrollWeight,
        });

        if(noTextAreaUpdate) return;

        synchroniseListToTextarea(activePrompts);
    }

}

export default CurrentPrompts;
