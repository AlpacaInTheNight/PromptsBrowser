import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import KnownPrompts from "client/KnownPrompts/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import PromptEdit from "client/PromptEdit/index";
import PreviewSave from "client/PreviewSave/index";
import PromptsFilter from "client/PromptsFilter/index";
import TagTooltip from "client/TagTooltip/index";
import { makeElement, makeSelect } from "client/dom";
import checkFilter from "client/checkFilter";
import applyStyle from "client/applyStyle";

import {
    log,
} from "client/utils";

type Autogen = {
    collection: string;
    style: string;
}

type GenerateRequest = {
    id: string;
    autogen?: Partial<Autogen>;
    addPrompts?: string;
}

class CollectionTools {

    private static autogen: Autogen = {
        collection: "",
        style: "",
    }
    
    private static autogenStyleSelector: HTMLSelectElement | undefined = undefined;
    
    /**
     * Auto generate previews timer.
     */
    private static generateNextTimer: any = 0;
    
    private static generateQueue: GenerateRequest[] = [];
    
    public static init(wrapper: HTMLElement) {
        const collectionTools = document.createElement("div");
        collectionTools.className = "PBE_generalWindow PBE_collectionToolsWindow";
        collectionTools.id = "PBE_collectionTools";
    
        PromptsBrowser.DOMCache.collectionTools = collectionTools;
    
        CollectionTools.generateQueue = [];
        clearTimeout(CollectionTools.generateNextTimer);
        wrapper.appendChild(collectionTools);
    
        PromptsBrowser.onCloseActiveWindow = CollectionTools.onCloseWindow;
    
        collectionTools.addEventListener("click", () => {
            PromptsBrowser.onCloseActiveWindow = CollectionTools.onCloseWindow;
        });
    }
    
    /**
     * Updates UI components that shows existing prompts
     */
    private static updateViews() {
        KnownPrompts.update();
        CollectionTools.update();
        CurrentPrompts.update(true);
    }
    
    private static updateCurrentCollection() {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {promptsFilter} = PromptsBrowser.state;
        const {collectionToolsId, selectedCollectionPrompts} = state;
        if(!collectionToolsId) return;
        const filterSetup = promptsFilter["collectionTools"];
        const targetCollection = data.original[collectionToolsId];
        if(!targetCollection) return;
    
        for(const item of targetCollection) {
            const {id} = item;
            if(!id) continue;
    
            /**
             * Removing prompt from selected if it will not be shown.
             */
            if(!checkFilter(item, filterSetup)) {
                if(selectedCollectionPrompts.includes(id)) {
                    state.selectedCollectionPrompts = state.selectedCollectionPrompts.filter(selId => selId !== id);
                }
    
                continue;
            }
        }
    
        Database.saveJSONData(collectionToolsId);
        Database.updateMixedList();
        CollectionTools.updateViews();
    }
    
    private static async generateNextPreview() {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {collectionToolsId} = state;
        const {generateQueue} = CollectionTools;
        const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
        const generateButton = PromptsBrowser.DOMCache.containers[state.currentContainer].generateButton;
        if(!textArea || !generateButton) return;
    
        const nextItem = generateQueue.shift();
        if(!nextItem) {
            log("Finished generating prompt previews.");
    
            state.selectedPrompt = undefined;
            state.filesIteration++;
            Database.updateMixedList();
            
            PreviewSave.update();
            KnownPrompts.update();
            CurrentPrompts.update(true);
            CollectionTools.update(true);
            return;
        }
    
        const message = `Generating preview for "${nextItem.id}". ${generateQueue.length} items in queue left. `;
        log(message);
        CollectionTools.updateAutogenInfo(message);
    
        state.selectedPrompt = nextItem.id;
        state.savePreviewCollection = collectionToolsId;
    
        if(nextItem.autogen && nextItem.autogen.collection && nextItem.autogen.style) {
            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
            const targetCollection = data.styles[nextItem.autogen.collection];
            if(targetCollection) {
                const targetStyle = targetCollection.find(item => item.name === nextItem.autogen.style);
                if(targetStyle) {
                    applyStyle(targetStyle, true, true);
                    await delay(600); //need a pause due to a hacky nature of changing APP state
    
                    textArea.value = `((${nextItem.id})), ${textArea.value}`;
                }
            }
    
        } else if(nextItem.addPrompts) {
            textArea.value = `((${nextItem.id})), ${nextItem.addPrompts}`;
    
        } else textArea.value = nextItem.id;
    
        textArea.dispatchEvent(new Event('focus'));
        textArea.dispatchEvent(new Event('input'));
        textArea.dispatchEvent(new KeyboardEvent('keyup'));
        textArea.dispatchEvent(new KeyboardEvent('keypress'));
        textArea.dispatchEvent(new Event('blur'));
    
        generateButton.dispatchEvent(new Event('click'));
    
        clearTimeout(CollectionTools.generateNextTimer);
        CollectionTools.generateNextTimer = setTimeout(CollectionTools.checkProgressState, 100);
    }
    
    private static checkProgressState() {
        const {state} = PromptsBrowser;
        const resultsContainer = PromptsBrowser.DOMCache.containers[state.currentContainer].resultsContainer;
        if(!resultsContainer) return;
    
        /**
         * Progress bar is being added during generation and is removed from the DOM after generation finished.
         * Its presence serves as a marker when checking the state of generation.
         */
        const progressBar = resultsContainer.querySelector(".progressDiv");
    
        if(!progressBar) {
            Database.savePromptPreview(false);
            CollectionTools.generateNextPreview();
    
            return;
        }
    
        clearTimeout(CollectionTools.generateNextTimer);
        CollectionTools.generateNextTimer = setTimeout(CollectionTools.checkProgressState, 500);
    }
    
    private static onCloseWindow() {
        const wrapper = PromptsBrowser.DOMCache.collectionTools;
        if(!wrapper) return;
    
        clearTimeout(CollectionTools.generateNextTimer);
        wrapper.style.display = "none";
    }
    
    private static onChangeAutogenerateType(e: Event) {
        const {state} = PromptsBrowser;
        const target = e.currentTarget as HTMLSelectElement;
        const value = target.value;
        if(!value) return;
    
        state.autoGenerateType = value as any;
    }
    
    private static onGeneratePreviews(e: MouseEvent) {
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
    
        CollectionTools.generateNextPreview();
    }
    
    private static onAssignAutogenStyle(e: MouseEvent) {
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
    
        CollectionTools.updateCurrentCollection();
    }
    
    private static onAddCategory(e: MouseEvent) {
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
    
        CollectionTools.updateCurrentCollection();
    }
    
    private static onRemoveCategory(e: MouseEvent) {
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
    
        CollectionTools.updateCurrentCollection();
    }
    
    private static onAddTags(e: MouseEvent) {
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
    
        CollectionTools.updateCurrentCollection();
    }
    
    private static onRemoveTags(e: MouseEvent) {
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
    
        CollectionTools.updateCurrentCollection();
    }
    
    private static onSelectItem(e: MouseEvent) {
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
    
    private static onToggleSelected(e: MouseEvent) {
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
    private static onDeleteSelected(e: MouseEvent) {
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
    private static onMoveSelected(e: MouseEvent, isCopy: boolean = false) {
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
    
    private static onCopySelected = (e: MouseEvent) => CollectionTools.onMoveSelected(e, true);
    
    
    private static onChangeAutogenCollection(e: Event) {
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
    
    private static onChangeAutogenStyle(e: Event) {
        const target = e.currentTarget as HTMLSelectElement;
        const style = target.value;
    
        CollectionTools.autogen.style = style;
    }
    
    private static showHeader(wrapper: HTMLElement) {
        PromptsFilter.update(wrapper, "collectionTools");
    
    }
    
    private static showPromptsDetailed (wrapper: HTMLElement) {
        const {promptsFilter} = PromptsBrowser.state;
        const filterSetup = promptsFilter["collectionTools"];
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {collectionToolsId, selectedCollectionPrompts} = state;
        const targetCollection = data.original[collectionToolsId];
        if(!targetCollection) return;
    
        wrapper.classList.add("PBE_detailedItemContainer");
    
        for(const item of targetCollection) {
            const {id, tags = [], category = [], comment = "", previewImage} = item;
            if(!id) continue;
    
            /**
             * Removing prompt from selected if it will not be shown.
             */
            if(!checkFilter(item, filterSetup)) {
                if(selectedCollectionPrompts.includes(id)) {
                    state.selectedCollectionPrompts = state.selectedCollectionPrompts.filter(selId => selId !== id);
                }
    
                continue;
            }
    
            const promptContainer = document.createElement("div");
    
            const selectArea = document.createElement("div");
            const contentArea = document.createElement("div");
    
            const topContainer = document.createElement("div");
            const bottomContainer = document.createElement("div");
    
            const nameContainer = document.createElement("div");
            const tagsContainer = document.createElement("div");
            const categoriesContainer = document.createElement("div");
            const commentContainer = document.createElement("div");
    
            selectArea.dataset.id = id;
            selectArea.className = "PBE_detailedItemSelector";
            contentArea.className = "PBE_detailedItemContent";
            selectArea.style.backgroundImage = Database.getPromptPreviewURL(id, collectionToolsId);
    
            promptContainer.className = "PBE_detailedItem";
            topContainer.className = "PBE_detailedItemTop";
            bottomContainer.className = "PBE_detailedItemBottom";
    
            nameContainer.className = "PBE_detailedItemName";
            commentContainer.className = "PBE_detailedItemComment";
    
            tagsContainer.className = "PBE_detailedItemTags";
            categoriesContainer.className = "PBE_detailedItemCategories";
    
            nameContainer.innerText = id;
            tagsContainer.innerText = tags.join(", ");
            categoriesContainer.innerText = category.join(", ");
    
            commentContainer.innerText = comment;
    
            topContainer.appendChild(nameContainer);
            topContainer.appendChild(commentContainer);
    
            if(tags.length || category.length) {
                bottomContainer.appendChild(tagsContainer);
                bottomContainer.appendChild(categoriesContainer);
            }
    
            contentArea.appendChild(topContainer);
            contentArea.appendChild(bottomContainer);
    
            promptContainer.appendChild(selectArea);
            promptContainer.appendChild(contentArea);
    
            selectArea.addEventListener("click", CollectionTools.onSelectItem);
    
            if(selectedCollectionPrompts.includes(id)) promptContainer.classList.add("selected");
    
            wrapper.appendChild(promptContainer);
        }
    }
    
    private static showPromptsShort(wrapper: HTMLElement) {
    
    }
    
    private static showCopyOrMove(wrapper: HTMLElement) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {collectionToolsId} = state;
    
        const collectionSelect = document.createElement("select");
        collectionSelect.className = "PBE_generalInput PBE_select";
    
        const moveButton = document.createElement("div")
        moveButton.innerText = "Move";
        moveButton.className = "PBE_button";
        moveButton.title = "Move selected prompts to the target collection";
        moveButton.addEventListener("click", CollectionTools.onMoveSelected);
    
        const copyButton = document.createElement("div")
        copyButton.innerText = "Copy";
        copyButton.className = "PBE_button";
        copyButton.title = "Copy selected prompts to the target collection";
        copyButton.addEventListener("click", CollectionTools.onCopySelected);
    
        let options = "";
        for(const collectionId in data.original) {
            if(collectionId === collectionToolsId) continue;
            if(!state.copyOrMoveTo) state.copyOrMoveTo = collectionId;
    
            options += `<option value="${collectionId}">${collectionId}</option>`;
        }
    
        collectionSelect.innerHTML = options;
    
        collectionSelect.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLSelectElement;
            const value = target.value;
            state.copyOrMoveTo = value || undefined;
        });
    
        const container = document.createElement("fieldset");
        container.className = "PBE_fieldset";
        const legend = document.createElement("legend");
        legend.innerText = "Collection";
    
        container.appendChild(legend);
        container.appendChild(collectionSelect);
        container.appendChild(moveButton);
        container.appendChild(copyButton);
    
        wrapper.appendChild(container);
    }
    
    private static showCategoryAction(wrapper: HTMLElement) {
        const {data} = Database;
        const categories = data.categories;
        let options = "";
    
        const categorySelect = document.createElement("select");
        const addButton = document.createElement("div");
        const removeButton = document.createElement("div");
    
        categorySelect.className = "PBE_generalInput PBE_select PBE_categoryAction";
        addButton.className = "PBE_button";
        addButton.title = "Add selected category to all selected prompts";
        removeButton.className = "PBE_button PBE_buttonCancel";
    
        addButton.innerText = "Add";
        removeButton.title = "Remove selected category from all selected prompts";
        removeButton.innerText = "Remove";
    
        for(const categoryItem of categories) {
            if(!categorySelect.value) categorySelect.value = categoryItem;
            options += `<option value="${categoryItem}">${categoryItem}</option>`;
        }
        categorySelect.innerHTML = options;
    
        addButton.addEventListener("click", CollectionTools.onAddCategory);
        removeButton.addEventListener("click", CollectionTools.onRemoveCategory);
    
        const container = document.createElement("fieldset");
        container.className = "PBE_fieldset";
        const legend = document.createElement("legend");
        legend.innerText = "Category";
    
        container.appendChild(legend);
        container.appendChild(categorySelect);
        container.appendChild(addButton);
        container.appendChild(removeButton);
    
        wrapper.appendChild(container);
    }
    
    private static showTagsAction(wrapper: HTMLElement) {
    
        const tagsInput = document.createElement("input");
        const addButton = document.createElement("div");
        const removeButton = document.createElement("div");
    
        tagsInput.placeholder = "tag1, tag2, tag3";
    
        tagsInput.className = "PBE_generalInput PBE_input PBE_tagsAction";
        addButton.className = "PBE_button";
        removeButton.className = "PBE_button PBE_buttonCancel";
        addButton.title = "Add target tags to all selected prompts";
        removeButton.title = "Remove target tags from all selected prompts";
    
        addButton.innerText = "Add";
        removeButton.innerText = "Remove";
    
        addButton.addEventListener("click", CollectionTools.onAddTags);
        removeButton.addEventListener("click", CollectionTools.onRemoveTags);
    
        const container = document.createElement("fieldset");
        container.className = "PBE_fieldset";
        const legend = document.createElement("legend");
        legend.innerText = "Tags";
    
        container.appendChild(legend);
        container.appendChild(tagsInput);
        container.appendChild(addButton);
        container.appendChild(removeButton);
    
        wrapper.appendChild(container);
    
        TagTooltip.add(tagsInput, true);
    }
    
    private static showAutogenStyle(wrapper: HTMLElement) {
         const {data} = Database;
        const {collection, style} = CollectionTools.autogen;
    
        const container = makeElement<HTMLFieldSetElement>({element: "fieldset", className: "PBE_fieldset"});
        const legend = makeElement<HTMLLegendElement>({element: "legend", content: "Autogenerate style"});
    
        //collection select
        const colOptions = [{id: "__none", name: "None"}];
    
        for(const colId in data.styles) colOptions.push({id: colId, name: colId});
        const stylesCollectionsSelect = makeSelect({
            className: "PBE_generalInput PBE_select", value: collection, options: colOptions,
            onChange: CollectionTools.onChangeAutogenCollection
        });
    
        container.appendChild(stylesCollectionsSelect);
    
        //style select
        const styleOptions = [];
    
        if(collection) {
            const targetCollection = data.styles[collection];
            if(targetCollection) {
                for(const styleItem of targetCollection) styleOptions.push({id: styleItem.name, name: styleItem.name});
            }
        }
        
        const styleSelect = makeSelect({
            className: "PBE_generalInput PBE_select", value: style || "", options: styleOptions,
            onChange: CollectionTools.onChangeAutogenStyle
        });
    
        container.appendChild(styleSelect);
        CollectionTools.autogenStyleSelector = styleSelect;
    
        //assign button
        const assignButton = makeElement<HTMLDivElement>({element: "div", className: "PBE_button", content: "Assign"});
        assignButton.addEventListener("click", CollectionTools.onAssignAutogenStyle);
        container.appendChild(assignButton);
    
        //append to wrapper
        container.appendChild(legend);
        wrapper.appendChild(container);
    }
    
    private static showAutogenerate(wrapper: HTMLElement) {
        const {state} = PromptsBrowser;
    
        const generateButton = makeElement<HTMLDivElement>({element: "div", className: "PBE_button", content: "Generate"});
        generateButton.addEventListener("click", CollectionTools.onGeneratePreviews);
    
        const generateTypeSelect = makeSelect({
            className: "PBE_generalInput PBE_select", value: state.autoGenerateType,
            options: [
                {id: "prompt", name: "Prompt only"},
                {id: "current", name: "With current prompts"},
                {id: "autogen", name: "With prompt autogen style"},
                {id: "selected", name: "With selected autogen style"},
            ],
            onChange: CollectionTools.onChangeAutogenerateType
        });
    
        const container = document.createElement("fieldset");
        container.className = "PBE_fieldset";
        const legend = document.createElement("legend");
        legend.innerText = "Generate preview";
    
        container.appendChild(legend);
        container.appendChild(generateTypeSelect);
        container.appendChild(generateButton);
    
        wrapper.appendChild(container);
    }
    
    private static showActions(wrapper: HTMLElement) {
        const {data} = Database;
    
        const toggleAllButton = document.createElement("div");
        toggleAllButton.innerText = "Toggle all";
        toggleAllButton.className = "PBE_button";
        toggleAllButton.title = "Select and unselect all visible prompts";
        toggleAllButton.addEventListener("click", CollectionTools.onToggleSelected);
    
        const deleteButton = document.createElement("div");
        deleteButton.innerText = "Delete selected";
        deleteButton.className = "PBE_button PBE_buttonCancel";
        deleteButton.title = "Delete selected prompts";
        deleteButton.addEventListener("click", CollectionTools.onDeleteSelected);
    
        const container = document.createElement("fieldset");
        container.className = "PBE_fieldset";
        const legend = document.createElement("legend");
        legend.innerText = "Actions";
    
        container.appendChild(legend);
        container.appendChild(toggleAllButton);
        container.appendChild(deleteButton);
    
        wrapper.appendChild(container);
    
        if(Object.keys(data.original).length > 1) CollectionTools.showCopyOrMove(wrapper);
        CollectionTools.showCategoryAction(wrapper);
        CollectionTools.showTagsAction(wrapper);
        CollectionTools.showAutogenStyle(wrapper);
        CollectionTools.showAutogenerate(wrapper);
    }
    
    private static updateAutogenInfo(status: string, wrapper?: HTMLElement) {
        if(!wrapper) wrapper = document.querySelector(".PBE_collectionToolsAutogenInfo");
        if(!wrapper) return;
    
        wrapper.innerText = status;
    }
    
    private static updateSelectedInfo(wrapper?: HTMLElement) {
        if(!wrapper) wrapper = document.querySelector(".PBE_collectionToolsSelectedInfo");
        if(!wrapper) return;
        
        const {selectedCollectionPrompts} = PromptsBrowser.state;
        let text = "";
        const prevItems = [];
        const MAX_SHOWN_DETAILED = 3;
    
        if(!selectedCollectionPrompts || !selectedCollectionPrompts.length) {
            wrapper.innerText = "No items selected";
            return;
        }
    
        for(let i = 0; i < selectedCollectionPrompts.length; i++) {
            if(i + 1 > MAX_SHOWN_DETAILED) break;
            prevItems.push(`"${selectedCollectionPrompts[i]}"`);
        }
    
        if(prevItems.length) text += prevItems.join(", ");
    
        const allSelected = selectedCollectionPrompts.length;
        if(allSelected > MAX_SHOWN_DETAILED) {
            text += `, and ${allSelected - MAX_SHOWN_DETAILED} more items selected.`
        }
    
        wrapper.innerText = text;
    }
    
    private static showStatus(wrapper: HTMLElement) {
        const autogenStatus = makeElement<HTMLDivElement>({element: "div", className: "PBE_collectionToolsAutogenInfo"});
        const selectedStatus = makeElement<HTMLDivElement>({element: "div", className: "PBE_collectionToolsSelectedInfo"});
    
        CollectionTools.updateAutogenInfo("", autogenStatus);
        CollectionTools.updateSelectedInfo(selectedStatus);
    
        wrapper.appendChild(autogenStatus);
        wrapper.appendChild(selectedStatus);
    }
    
    public static update(ifShown = false) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const wrapper = PromptsBrowser.DOMCache.collectionTools;
        clearTimeout(CollectionTools.generateNextTimer);
    
        if(!wrapper || !data) return;
        if(ifShown && wrapper.style.display !== "flex") return;
    
        if(!state.collectionToolsId) {
            for(const colId in data.original) {
                state.collectionToolsId = colId;
                break;
            }
        }
    
        if(!state.collectionToolsId) return;
    
        PromptsBrowser.onCloseActiveWindow = CollectionTools.onCloseWindow;
        wrapper.innerHTML = "";
        wrapper.style.display = "flex";
    
        const footerBlock = document.createElement("div");
        const closeButton = document.createElement("button");
        footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_toolsFooter";
        closeButton.innerText = "Close";
        closeButton.className = "PBE_button";
    
        closeButton.addEventListener("click", CollectionTools.onCloseWindow);
    
        const headerBlock = document.createElement("div");
        headerBlock.className = "PBE_collectionToolsHeader";
    
        const contentBlock = document.createElement("div");
        contentBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
    
        const statusBlock = makeElement<HTMLDivElement>({element: "div", className: "PBE_collectionToolsStatus PBE_row"});
    
        const actionsBlock = document.createElement("div");
        actionsBlock.className = "PBE_collectionToolsActions PBE_row";
    
        CollectionTools.showHeader(headerBlock);
        CollectionTools.showPromptsDetailed(contentBlock);
    
        footerBlock.appendChild(closeButton);
    
        wrapper.appendChild(headerBlock);
        wrapper.appendChild(contentBlock);
        wrapper.appendChild(statusBlock);
        wrapper.appendChild(actionsBlock);
        wrapper.appendChild(footerBlock);
    
        CollectionTools.showStatus(statusBlock);
        CollectionTools.showActions(actionsBlock);
    
    }

}

export default CollectionTools;
