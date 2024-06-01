import CurrentPrompts from "./index";
import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Database from "client/Database/index";
import PreviewSave from "client/PreviewSave/index";
import PromptEdit from "client/PromptEdit/index";
import PromptScribe from "client/PromptScribe/index";
import PromptTools from "client/PromptTools/index";
import syncCurrentPrompts from "client/synchroniseCurrentPrompts";

class CurrentPromptsEvent {

    public static onDragStart = (e: DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
        let index = Number(target.dataset.index);
        let group: number | false = Number(target.dataset.group);
        if(Number.isNaN(index)) return;
        if(Number.isNaN(group)) group = false;
    
        state.dragInfo.index = index;
        state.dragInfo.groupId = group;
        e.dataTransfer.setData("text", index + "");
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
        let dragGroup: number | false = Number(target.dataset.group);
        if(Number.isNaN(dragGroup)) dragGroup = false;

        const dropIndex = state.dragInfo.index;
        const dropGroup = state.dragInfo.groupId;

        //invalid element
        if(Number.isNaN(dragIndex) || dropIndex === undefined) return;

        //is the same element
        if(dragIndex === dropIndex && dragGroup === dropGroup) return;
        
        target.classList.add("PBE_swap");
    }
    
    public static onDrop = (e: DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
    
        const dragIndex = Number(target.dataset.index);
        let dragGroup: number | false = Number(target.dataset.group);
        if(Number.isNaN(dragGroup)) dragGroup = false;

        const dropIndex = state.dragInfo.index;
        const dropGroup = state.dragInfo.groupId;
        target.classList.remove("PBE_swap");
        
        state.dragInfo = {};
        e.preventDefault();
        e.stopPropagation();

        if(e.shiftKey) {
            ActivePrompts.groupPrompts({
                from: {index: dropIndex, groupId: dropGroup},
                to: {index: dragIndex, groupId: dragGroup},
            });

        } else {
            ActivePrompts.movePrompt({
                from: {index: dropIndex, groupId: dropGroup},
                to: {index: dragIndex, groupId: dragGroup},
            });
        }
    
        CurrentPrompts.update();
    }
    
    public static onDblClick = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;

        let index: number = Number(target.dataset.index);
        let group: number | false = Number(target.dataset.group);
        if(Number.isNaN(index)) return;
        if(Number.isNaN(group)) group = false;

        state.promptTools.index = index;
        state.promptTools.groupId = group;

        PromptTools.update();
    }

    public static onPromptSelected = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {readonly} = Database.meta;
        const {united} = Database.data;
        const {state} = PromptsBrowser;
        const currentId = target.dataset.prompt;
        let index: number = Number(target.dataset.index);
        let group: number | false = Number(target.dataset.group);
        const isSyntax = target.dataset.issyntax ? true : false;
        const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
        if(!wrapper || !currentId) return;

        //on remove element
        if(e.ctrlKey || e.metaKey) {
            if(Number.isNaN(index)) return;
            if(Number.isNaN(group)) group = false;

            ActivePrompts.removePrompt(index, group);
            CurrentPrompts.update();
    
            return;
        }

        if(isSyntax) return;
    
        const targetPrompt = united.find(item => item.id.toLowerCase() === currentId.toLowerCase());
    
        if(targetPrompt && targetPrompt.collections && targetPrompt.collections[0]) {
            if(!state.savePreviewCollection || !targetPrompt.collections.includes(state.savePreviewCollection)) {
                state.savePreviewCollection = targetPrompt.collections[0];
                PreviewSave.update();
            }
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
        let index = Number(target.dataset.index);
        let group: number | false = Number(target.dataset.group);
        if(Number.isNaN(index)) return;
        if(Number.isNaN(group)) group = false;

        if(!currentId) return;

        const targetItem = ActivePrompts.getPromptByIndex(index, group);
        if(!targetItem) return;
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
        syncCurrentPrompts(true, true);
        CurrentPrompts.update();
    }

    public static onGroupHeadClick = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const groupId = Number(target.dataset.id);
        if(Number.isNaN(groupId)) return;

        if(e.ctrlKey || e.metaKey) {
            ActivePrompts.unGroup(groupId);

        } else {
            ActivePrompts.toggleGroupFold(groupId);
        }
        
        CurrentPrompts.update();
    }

    //TODO: unite similar logic with scrollWeight method
    public static onGroupHeadWheel = (e: WheelEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
        const {belowOneWeight = 0.05, aboveOneWeight = 0.01} = state.config;
        if(!e.shiftKey) return;
        const groupId = Number(target.dataset.id);
        if(Number.isNaN(groupId)) return;

        const targetGroup = ActivePrompts.getGroupById(groupId);
        if(!targetGroup) return;

        e.preventDefault();
        e.stopPropagation();

        if(!targetGroup.weight) targetGroup.weight = 1;
    
        if(e.deltaY < 0) { //rising weight
    
            if(targetGroup.weight < 1 && (targetGroup.weight + belowOneWeight) > 1 ) {
                targetGroup.weight = 1;
    
            } else {
                if(targetGroup.weight >= 1) targetGroup.weight += aboveOneWeight;
                else targetGroup.weight += belowOneWeight;
    
            }
            
        } else { //lowering weight
    
            if(targetGroup.weight > 1 && (targetGroup.weight - aboveOneWeight) < 1 ) {
                targetGroup.weight = 1;
    
            } else {
                if(targetGroup.weight <= 1) targetGroup.weight -= belowOneWeight;
                else targetGroup.weight -= aboveOneWeight;
    
            }
    
        }
    
        if(targetGroup.weight < 0) targetGroup.weight = 0;
        targetGroup.weight = Number(targetGroup.weight.toFixed(2));

        if(targetGroup.weight === 1) targetGroup.weight = undefined;

        CurrentPrompts.update();
    }
}

export default CurrentPromptsEvent;
