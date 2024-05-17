import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import PreviewSave from "client/PreviewSave/index";
import PromptEdit from "client/PromptEdit/index";
import PromptScribe from "client/PromptScribe/index";
import PromptTools from "client/PromptTools/index";
import synchroniseCurrentPrompts from "client/synchroniseCurrentPrompts";
import showPromptItem from "client/showPromptItem";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";

class CurrentPrompts {

    public static init = (wrapper: HTMLElement, containerId: string) => {
        const currentPrompts = document.createElement("div");
        currentPrompts.className = "PBE_currentPrompts";
    
        PromptsBrowser.DOMCache.containers[containerId].currentPrompts = currentPrompts;
        wrapper.appendChild(currentPrompts);
    }
    
    public static onDragStart = (e: DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
        const index = target.dataset.index;
    
        state.dragCurrentIndex = index;
        e.dataTransfer.setData("text", index);
    }
    
    public static onDragOver = (e: DragEvent) => {
        e.preventDefault();
    }
    
    public static onDragLeave = (e: DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove("PBE_swap");
    }
    
    public static onDragEnter = (e: DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
    
        e.preventDefault();
        const dragIndex = Number(target.dataset.index);
        const dropIndex = Number(state.dragCurrentIndex);
    
        if(Number.isNaN(dragIndex) || Number.isNaN(dropIndex)) return;
        if(dragIndex === undefined || dropIndex === undefined) return;
        if(dragIndex === dropIndex) return;
        
        target.classList.add("PBE_swap");
    }
    
    public static onDrop = (e: DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
        const activePrompts = PromptsBrowser.getCurrentPrompts();
    
        const dragIndex = Number(target.dataset.index);
        const dropIndex = Number(state.dragCurrentIndex);
        target.classList.remove("PBE_swap");
    
        state.dragCurrentIndex = undefined;
        e.preventDefault();
        e.stopPropagation();
    
        const element = activePrompts.splice(dropIndex, 1)[0];
        activePrompts.splice(dragIndex, 0, element);
    
        CurrentPrompts.update();
    }
    
    public static onDblClick = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
    
        const currentId = target.dataset.prompt;
        if(!currentId) return;
    
        state.promptToolsId = currentId;
        PromptTools.update();
    }
    
    public static initButton = (positiveWrapper: HTMLElement) => {
        const {readonly} = Database.meta;
        const normalizeButton = document.createElement("button");
    
        normalizeButton.className = "PBE_actionButton PBE_normalizeButton";
        normalizeButton.innerText = "Normalize";
    
        if(readonly) normalizeButton.className = "PBE_actionButton PBE_normalizeButton_readonly";
    
        normalizeButton.addEventListener("click", CurrentPrompts.onNormalizePrompts);
    
        positiveWrapper.appendChild(normalizeButton);
    }
    
    public static onPromptSelected = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {readonly} = Database.meta;
        const {united} = Database.data;
        const {state} = PromptsBrowser;
        const currentId = target.dataset.prompt;
        let index: string | number = target.dataset.index;
        const isSyntax = target.dataset.issyntax ? true : false;
        const activePrompts = PromptsBrowser.getCurrentPrompts();
        const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
        if(!wrapper || !currentId) return;
    
        if(index !== undefined) index = Number(index);
    
        if(isSyntax && index !== undefined && (e.ctrlKey || e.metaKey)) {
            activePrompts.splice(index as number, 1)
            PromptsBrowser.setCurrentPrompts(activePrompts);
            CurrentPrompts.update();
    
            return;
        }
    
        const targetPrompt = united.find(item => item.id.toLowerCase() === currentId.toLowerCase());
    
        if(targetPrompt && targetPrompt.collections && targetPrompt.collections[0]) {
            if(!state.savePreviewCollection || !targetPrompt.collections.includes(state.savePreviewCollection)) {
                state.savePreviewCollection = targetPrompt.collections[0];
                PreviewSave.update();
            }
        }
    
        if(e.ctrlKey || e.metaKey) {
            PromptsBrowser.setCurrentPrompts(activePrompts.filter(item => item.id !== currentId));
            CurrentPrompts.update();
    
            return;
        }
    
        if(!readonly && e.shiftKey) {
            if(targetPrompt) {
                state.editingPrompt = currentId;
                PromptEdit.update();
    
            } else {
                PromptScribe.onOpenScriber();
                
            }
    
            return;
        }
    
        const selectedElements = wrapper.querySelectorAll(".PBE_selectedCurrentElement");
        for(let i = 0; i < selectedElements.length; ++i) {
            selectedElements[i].classList.remove("PBE_selectedCurrentElement");
        }
    
        if(state.selectedPrompt !== currentId) {
            target.classList.add("PBE_selectedCurrentElement");
            state.selectedPrompt = currentId;
    
        } else {
            state.selectedPrompt = undefined;
            
        }
        
        PreviewSave.update();
    }
    
    /**
     * Handles the mouse wheel event and changes the weight of the prompt
     */
    public static scrollWeight = (e: WheelEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
        const {belowOneWeight = 0.05, aboveOneWeight = 0.01} = state.config;
        if(!e.shiftKey) return;
        const currentId = target.dataset.prompt;
        const activePrompts = PromptsBrowser.getCurrentPrompts();
        const targetItem = activePrompts.find(item => item.id === currentId);
        if(!currentId || !targetItem) return;
        if(targetItem.isSyntax) return;
    
        e.preventDefault();
        e.stopPropagation();
    
        if(!targetItem.weight) targetItem.weight = 0;
    
        if(e.deltaY < 0) { //rising weight
    
            if(targetItem.weight < 1 && (targetItem.weight + belowOneWeight) > 1 ) {
                targetItem.weight = 1;
    
            } else {
                if(targetItem.weight >= 1) targetItem.weight += aboveOneWeight;
                else targetItem.weight += belowOneWeight;
    
            }
            
        } else { //lowering weight
    
            if(targetItem.weight > 1 && (targetItem.weight - aboveOneWeight) < 1 ) {
                targetItem.weight = 1;
    
            } else {
                if(targetItem.weight <= 1) targetItem.weight -= belowOneWeight;
                else targetItem.weight -= aboveOneWeight;
    
            }
    
        }
    
        if(targetItem.weight < 0) targetItem.weight = 0;
        targetItem.weight = Number(targetItem.weight.toFixed(2));
        CurrentPrompts.update();
    }
    
    public static onNormalizePrompts = () => {
        synchroniseCurrentPrompts(true, true);
        CurrentPrompts.update();
    }
    
    public static update = (noTextAreaUpdate = false) => {
        const {state} = PromptsBrowser;
        const activePrompts = PromptsBrowser.getCurrentPrompts();
    
        const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
        const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
    
        if(!wrapper || !textArea) return;
        wrapper.innerHTML = "";
        const prompts = [];
    
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
    
            promptElement.addEventListener("dragstart", CurrentPrompts.onDragStart);
            promptElement.addEventListener("dragover", CurrentPrompts.onDragOver);
            promptElement.addEventListener("dragenter", CurrentPrompts.onDragEnter);
            promptElement.addEventListener("dragleave", CurrentPrompts.onDragLeave);
            promptElement.addEventListener("drop", CurrentPrompts.onDrop);
            promptElement.addEventListener("click", CurrentPrompts.onPromptSelected);
            
            if(!promptItem.isSyntax) {
                promptElement.addEventListener("dblclick", CurrentPrompts.onDblClick);
                promptElement.addEventListener("wheel", CurrentPrompts.scrollWeight);
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
