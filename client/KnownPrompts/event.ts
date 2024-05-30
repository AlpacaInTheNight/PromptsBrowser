import KnownPrompts from "./index";
import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Database from "client/Database/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import PromptEdit from "client/PromptEdit/index";
import Prompt from "clientTypes/prompt";
import { isInSameCollection, addStrToActive } from "client/utils/index";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";
import syncCurrentPrompts from "client/synchroniseCurrentPrompts";

class KnownPromptsEvent {

    private static addPromptItem(targetItem: Prompt) {
        if(!targetItem) return;
        const activePrompts = ActivePrompts.getCurrentPrompts();
        const {id, addAtStart, addAfter, addStart, addEnd} = targetItem;
    
        if(activePrompts.some(item => item.id === id)) return;
    
        const newPrompt: Prompt = {id, weight: DEFAULT_PROMPT_WEIGHT, isExternalNetwork: targetItem.isExternalNetwork};
    
        if(addStart) addStrToActive(addStart, true);
    
        if(addAfter) {
            if(addAtStart) {
                addStrToActive(addAfter, true);
                activePrompts.unshift(newPrompt);
    
            } else {
                activePrompts.push(newPrompt);
                addStrToActive(addAfter, false);
            }
    
        } else {
            if(addAtStart) activePrompts.unshift(newPrompt);
            else activePrompts.push(newPrompt);
        }
    
        if(addEnd) addStrToActive(addEnd, false);
    }

    /**
     * Adds a random prompt from the prompts corresponding to the current filter settings.
     */
    public static onAddRandom() {
        const {data} = Database;
        const {state} = PromptsBrowser;
        const {united} = data;
        const activePrompts = ActivePrompts.getCurrentPrompts();
        let dataArr = [];

        if(state.filterCollection) {
            const targetCategory = data.original[state.filterCollection];
            if(targetCategory) {
                for(const id in targetCategory) {
                    const targetOriginalItem = targetCategory[id];
                    const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
                    if(targetMixedItem && KnownPrompts.checkFilter(targetMixedItem)) dataArr.push({...targetMixedItem});
                }
            }

        } else {
            for(const id in united) {
                if(KnownPrompts.checkFilter(united[id])) dataArr.push({...united[id]});
            }
        }

        dataArr = dataArr.filter(dataItem => !activePrompts.some(item => item.id === dataItem.id));

        const randomPrompt = dataArr[Math.floor(Math.random() * dataArr.length)];

        KnownPromptsEvent.addPromptItem(randomPrompt);
        CurrentPrompts.update();
    }

    public static onDragStart(e: DragEvent) {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
        const splash = target.querySelector(".PBE_promptElementSplash") as HTMLElement;
        splash.style.display = "none";

        const promptItem = target.dataset.prompt;

        state.dragInfo.id = promptItem;
        e.dataTransfer.setData("text", promptItem);
    }

    public static onDragOver(e: DragEvent) {
        e.preventDefault();
    }

    public static onDragEnter(e: DragEvent) {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
        e.preventDefault();
        const dragItem = target.dataset.prompt;
        const dropItem = state.dragItemId;

        if(!dragItem || !dropItem) return;
        if(dragItem === dropItem) return;
        
        if(isInSameCollection(dragItem, dropItem)) target.classList.add("PBE_swap");
    }

    public static onDragLeave(e: DragEvent) {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove("PBE_swap");
    }

    public static onDrop(e: DragEvent) {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
        const dragItem = target.dataset.prompt;
        const dropItem = e.dataTransfer.getData("text");
        target.classList.remove("PBE_swap");

        //state.dragItemId = undefined;
        state.dragInfo.id = undefined;
        e.preventDefault();
        e.stopPropagation();

        if(isInSameCollection(dragItem, dropItem)) {
            Database.movePrompt(dragItem, dropItem);
        }
    }

    public static onPromptClick = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {readonly} = Database.meta;
        const {united} = Database.data;
        const {state} = PromptsBrowser;
    
        syncCurrentPrompts();
    
        const promptItem = target.dataset.prompt;
        const targetItem = united.find(item => item.id === promptItem);
        if(!targetItem) return;
    
        if(!readonly && e.shiftKey) {
            state.editingPrompt = promptItem;
            PromptEdit.update();
    
            return;
        }
    
        if(!readonly && (e.metaKey || e.ctrlKey) ) {
            let targetCollection = state.filterCollection;
            if(!targetCollection) {
                
                if(!targetItem.collections) return;
                const firstCollection = targetItem.collections[0];
                if(!firstCollection) return;
                targetCollection = targetItem.collections[0];
            }
    
            if( confirm(`Remove prompt "${promptItem}" from catalogue "${targetCollection}"?`) ) {
                if(!Database.data.original[targetCollection]) return;
    
                Database.data.original[targetCollection] = Database.data.original[targetCollection].filter(item => item.id !== promptItem);
    
                Database.movePreviewImage(promptItem, targetCollection, targetCollection, "delete");
                Database.saveJSONData(targetCollection);
                Database.updateMixedList();
                PromptEdit.update();
                CurrentPrompts.update();
            }
    
            return;
        }
        
        KnownPromptsEvent.addPromptItem(targetItem);
        CurrentPrompts.update();
    }
}

export default KnownPromptsEvent;
