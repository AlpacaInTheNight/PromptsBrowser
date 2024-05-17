import CurrentPrompts from "./index";
import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import PreviewSave from "client/PreviewSave/index";
import PromptEdit from "client/PromptEdit/index";
import PromptScribe from "client/PromptScribe/index";
import PromptTools from "client/PromptTools/index";
import synchroniseCurrentPrompts from "client/synchroniseCurrentPrompts";

class CurrentPromptsEvent {

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
}

export default CurrentPromptsEvent;
