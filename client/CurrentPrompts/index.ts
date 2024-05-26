import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import showPromptItem from "client/showPromptItem";
import Prompt from "clientTypes/prompt";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";
import CurrentPromptsEvent from "./event";

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
        const activePrompts = PromptsBrowser.getCurrentPrompts();
    
        const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
        const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
    
        if(!wrapper || !textArea) return;
        wrapper.innerHTML = "";
        const prompts: {text: string; src: Prompt; }[] = [];
    
        for(let index = 0; index < activePrompts.length; index++) {
            const promptItem = activePrompts[index];
            const id = promptItem.id;
    
            if(promptItem.isExternalNetwork) {
                prompts.push({text: `<${id}:${promptItem.weight}>`, src: promptItem});
    
            } else {
                if(promptItem.weight !== undefined && promptItem.weight !== DEFAULT_PROMPT_WEIGHT) {
                    prompts.push({text: `(${id}: ${promptItem.weight})`, src: promptItem});
                } else prompts.push({text: id, src: promptItem});
            }
    
            const promptElement = showPromptItem({prompt: promptItem, options: {index}});
    
            if(promptItem.isSyntax) {
                promptElement.dataset.issyntax = "true";
            } else if(state.selectedPrompt === id) promptElement.classList.add("PBE_selectedCurrentElement");
    
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
        
        if(noTextAreaUpdate) return;
    
        let newTextValue = "";
        for(let i = 0; i < prompts.length; i++) {
            const {text, src} = prompts[i];
            const nextPromptSrc = prompts[i+1] ? prompts[i+1].src : undefined;
            newTextValue += text;
    
            let addDelimiter = true;
    
            if(!nextPromptSrc) addDelimiter = false;
            else if(src.delimiter) {
                if(src.delimiter === "prev" || src.delimiter === "none") addDelimiter = false;
    
            } else if(nextPromptSrc.delimiter) {
                if(nextPromptSrc.delimiter === "next" || nextPromptSrc.delimiter === "none") addDelimiter = false;
    
            }
    
            if(addDelimiter) newTextValue += ", ";
        }
    
        textArea.value = newTextValue;
    
        //Just to be sure every api listening to changes in textarea done their job
        textArea.dispatchEvent(new Event('focus'));
        textArea.dispatchEvent(new Event('input'));
        textArea.dispatchEvent(new KeyboardEvent('keyup'));
        textArea.dispatchEvent(new KeyboardEvent('keypress'));
        textArea.dispatchEvent(new Event('blur'));
    }

}

export default CurrentPrompts;
