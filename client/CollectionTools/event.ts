import CollectionTools from "./index";
import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import PromptEdit from "client/PromptEdit/index";
import checkFilter from "client/checkFilter";
import { GenerateRequest } from "./type";
import generateNextPreview from "./generateNextPreview";
import updateCurrentCollection from "./updateCurrentCollection";

class CollectionToolsEvent {

    public static onCloseWindow() {
        const wrapper = PromptsBrowser.DOMCache.collectionTools;
        if(!wrapper) return;
    
        clearTimeout(CollectionTools.generateNextTimer);
        wrapper.style.display = "none";
    }
    
    public static onChangeAutogenerateType(e: Event) {
        const {state} = PromptsBrowser;
        const target = e.currentTarget as HTMLSelectElement;
        const value = target.value;
        if(!value) return;
    
        state.autoGenerateType = value as any;
    }
    
    public static onGeneratePreviews(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {autogen} = CollectionTools;
        const {selectedCollectionPrompts, collectionToolsId, autoGenerateType} = state;
        const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
        const targetCollection = data.original[collectionToolsId];
        let currentPrompt = "";
    
        if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;
    
        CollectionTools.generateQueue = [];
    
        if(autoGenerateType === "current" && textArea) {
            currentPrompt = textArea.value;
        }
    
        for(const promptId of selectedCollectionPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if(!prompt) continue;
    
            const generateItem: Partial<GenerateRequest> = {
                id: promptId,
            };
    
            if(autoGenerateType === "current") {
                generateItem.addPrompts = currentPrompt;
    
            } else if(autoGenerateType === "autogen") {
                if(prompt.autogen) generateItem.autogen = {...prompt.autogen};
    
            } else if(autoGenerateType === "selected") {
                if(prompt.autogen) generateItem.autogen = {...autogen};
            }
    
            CollectionTools.generateQueue.push(generateItem as GenerateRequest);
        }
    
        generateNextPreview();
    }
    
    public static onAssignAutogenStyle(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {collection, style} = CollectionTools.autogen;
        const {selectedCollectionPrompts, collectionToolsId} = state;
        const targetCollection = data.original[collectionToolsId];
    
        if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;
    
        for(const promptId of selectedCollectionPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if(!prompt) continue;
    
            if(collection && style) prompt.autogen = {collection, style};
            else delete prompt.autogen;
        }
    
        updateCurrentCollection();
    }
    
    public static onAddCategory(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const target = e.currentTarget as HTMLElement;
        const parent = target.parentElement;
        const {selectedCollectionPrompts, collectionToolsId} = state;
        const targetCollection = data.original[collectionToolsId];
        const categorySelect = parent.querySelector(".PBE_categoryAction") as HTMLSelectElement;
        if(!categorySelect) return;
        const categoryId = categorySelect.value;
    
        if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;
    
        for(const promptId of selectedCollectionPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if(!prompt) continue;
    
            if(!prompt.category) prompt.category = [];
            if(!prompt.category.includes(categoryId)) prompt.category.push(categoryId);
        }
    
        updateCurrentCollection();
    }
    
    public static onRemoveCategory(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const target = e.currentTarget as HTMLElement;
        const parent = target.parentElement;
        const {selectedCollectionPrompts, collectionToolsId} = state;
        const targetCollection = data.original[collectionToolsId];
        const categorySelect = parent.querySelector(".PBE_categoryAction") as HTMLSelectElement;
        if(!categorySelect) return;
        const categoryId = categorySelect.value;
    
        if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;
    
        for(const promptId of selectedCollectionPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if(!prompt) continue;
    
            if(!prompt.category) continue;
            if(prompt.category.includes(categoryId)) prompt.category = prompt.category.filter(id => id !== categoryId);
        }
    
        updateCurrentCollection();
    }
    
    public static onAddTags(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const target = e.currentTarget as HTMLElement;
        const parent = target.parentElement;
        const {selectedCollectionPrompts, collectionToolsId} = state;
        const targetCollection = data.original[collectionToolsId];
        const tagsInput = parent.querySelector(".PBE_tagsAction") as HTMLSelectElement;
        if(!tagsInput) return;
        const tagsValue = tagsInput.value;
    
        if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;
    
        const tagsArr = tagsValue.split(",");
        for(let i = 0; i < tagsArr.length; i++) tagsArr[i] = tagsArr[i].trim();
    
        for(const promptId of selectedCollectionPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if(!prompt) continue;
    
            if(!prompt.tags) prompt.tags = [];
    
            for(const tagItem of tagsArr) {
                if(!prompt.tags.includes(tagItem)) prompt.tags.push(tagItem);
            }
        }
    
        updateCurrentCollection();
    }
    
    public static onRemoveTags(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {selectedCollectionPrompts, collectionToolsId} = state;
        const targetCollection = data.original[collectionToolsId];
        const target = e.currentTarget as HTMLElement;
        const parent = target.parentElement;
        const tagsInput = parent.querySelector(".PBE_tagsAction") as HTMLInputElement;
        if(!tagsInput) return;
        const tagsValue = tagsInput.value;
    
        if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;
    
        const tagsArr = tagsValue.split(",");
        for(let i = 0; i < tagsArr.length; i++) tagsArr[i] = tagsArr[i].trim();
    
        for(const promptId of selectedCollectionPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if(!prompt || !prompt.tags) continue;
    
            prompt.tags = prompt.tags.filter(id => !tagsArr.includes(id));
        }
    
        updateCurrentCollection();
    }
    
    public static onSelectItem(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const parent = target.parentElement;
        const {state} = PromptsBrowser;
        const id = target.dataset.id;
        if(!id) return;
    
        if(e.shiftKey) {
            state.editingPrompt = id;
            PromptEdit.update();
    
            return;
        }
    
        if(!state.selectedCollectionPrompts.includes(id)) {
            state.selectedCollectionPrompts.push(id);
            parent.classList.add("selected");
        } else {
            state.selectedCollectionPrompts = state.selectedCollectionPrompts.filter(promptId => promptId !== id);
            parent.classList.remove("selected");
        }
    
        CollectionTools.updateSelectedInfo();
    }
    
    public static onToggleSelected(e: MouseEvent) {
        const {promptsFilter} = PromptsBrowser.state;
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {collectionToolsId} = state;
        const filterSetup = promptsFilter["collectionTools"];
        const targetCollection = data.original[collectionToolsId];
        if(!targetCollection) return;
    
        if(state.selectedCollectionPrompts.length) {
            state.selectedCollectionPrompts = [];
            CollectionTools.update();
            return;
        }
    
        state.selectedCollectionPrompts = [];
    
        for(const item of targetCollection) {
            if(checkFilter(item, filterSetup)) state.selectedCollectionPrompts.push(item.id);
        }
    
        CollectionTools.update();
    }
    
    /**
     * Deletes selected prompts after a user confirmation
     */
    public static onDeleteSelected(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {selectedCollectionPrompts, collectionToolsId} = state;
        const targetCollection = data.original[collectionToolsId];
    
        if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;
    
        if( confirm(`Remove ${selectedCollectionPrompts.length} prompts from catalogue "${collectionToolsId}"?`) ) {
            data.original[collectionToolsId] = targetCollection.filter(prompt => !selectedCollectionPrompts.includes(prompt.id));
    
            for(const deletedPromptId of selectedCollectionPrompts) {
                Database.movePreviewImage(deletedPromptId, collectionToolsId, collectionToolsId, "delete");
            }
            Database.saveJSONData(collectionToolsId);
            Database.updateMixedList();
    
            state.selectedCollectionPrompts = [];
            CollectionTools.updateViews();
        }
    }
    
    /**
     * Moves or copies the selected prompts to the selected collection.
     * By default moves prompts.
     * @param {*} e - mouse event object.
     * @param {*} isCopy if copy actions is required instead of move action.
     */
    public static onMoveSelected(e: MouseEvent, isCopy: boolean = false) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {selectedCollectionPrompts, collectionToolsId, copyOrMoveTo} = state;
        const targetCollection = data.original[collectionToolsId];
    
        if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection || !copyOrMoveTo) return;
    
        const to = state.copyOrMoveTo;
        const from = state.collectionToolsId;
        if(!to || !from) return;
        if(!data.original[to] || !data.original[from]) return;
    
        let message = `${isCopy ? "Copy" : "Move"} ${selectedCollectionPrompts.length} prompts`;
        message += ` from catalogue "${collectionToolsId}" to catalogue "${copyOrMoveTo}"?`;
    
        if( confirm(message) ) {
    
            for(const promptId of selectedCollectionPrompts) {
                const originalItem = data.original[from].find(item => item.id === promptId);
                if(!originalItem) continue;
    
                if(isCopy) {
                    if(data.original[to].some(item => item.id === promptId)) continue;
    
                    data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
    
                    Database.movePreviewImage(promptId, from, to, "copy");
    
                } else {
                    if(!data.original[to].some(item => item.id === promptId)) {
                        data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
                    }
                    
                    data.original[from] = data.original[from].filter(item => item.id !== promptId);
    
                    Database.movePreviewImage(promptId, from, to, "move");
                }
            }
    
            if(isCopy) {
                Database.saveJSONData(to, true);
    
            } else {
                Database.saveJSONData(to, true);
                Database.saveJSONData(from, true);
            }
            Database.updateMixedList();
    
            state.selectedCollectionPrompts = [];
            CollectionTools.updateViews();
        }
    }
    
    public static onCopySelected = (e: MouseEvent) => CollectionToolsEvent.onMoveSelected(e, true);
    
    
    public static onChangeAutogenCollection(e: Event) {
        const {data} = Database;
        const target = e.currentTarget as HTMLSelectElement;
        const collection = target.value;
        let setFirst = false;
    
        CollectionTools.autogen.collection = collection;
    
        if(collection && CollectionTools.autogenStyleSelector) {
            let styleOptions = "";
    
            const targetCollection = data.styles[collection];
            if(targetCollection) {
                for(const styleItem of targetCollection) {
                    if(!setFirst) {
                        CollectionTools.autogen.style = styleItem.name;
                        CollectionTools.autogenStyleSelector.value = styleItem.name;
                        setFirst = true;
                    }
                    styleOptions += `<option value="${styleItem.name}">${styleItem.name}</option>`;
                }
            }
    
            CollectionTools.autogenStyleSelector.innerHTML = styleOptions;
        }
    }
    
    public static onChangeAutogenStyle(e: Event) {
        const target = e.currentTarget as HTMLSelectElement;
        const style = target.value;
    
        CollectionTools.autogen.style = style;
    }

}

export default CollectionToolsEvent;