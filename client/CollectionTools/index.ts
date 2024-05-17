import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import KnownPrompts from "client/KnownPrompts/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import PromptsFilter from "client/PromptsFilter/index";
import TagTooltip from "client/TagTooltip/index";
import { makeElement, makeDiv, makeSelect } from "client/dom";
import checkFilter from "client/checkFilter";
import CollectionToolsEvent from "./event";
import generateNextPreview from "./generateNextPreview";
import { Autogen, GenerateRequest } from "./type";

class CollectionTools {

    public static autogen: Autogen = {
        collection: "",
        style: "",
    }
    
    public static autogenStyleSelector: HTMLSelectElement | undefined = undefined;
    
    /**
     * Auto generate previews timer.
     */
    public static generateNextTimer: any = 0;
    
    public static generateQueue: GenerateRequest[] = [];
    
    public static init(wrapper: HTMLElement) {
        const collectionTools = document.createElement("div");
        collectionTools.className = "PBE_generalWindow PBE_collectionToolsWindow";
        collectionTools.id = "PBE_collectionTools";
    
        PromptsBrowser.DOMCache.collectionTools = collectionTools;
    
        CollectionTools.generateQueue = [];
        clearTimeout(CollectionTools.generateNextTimer);
        wrapper.appendChild(collectionTools);
    
        PromptsBrowser.onCloseActiveWindow = CollectionToolsEvent.onCloseWindow;
    
        collectionTools.addEventListener("click", () => {
            PromptsBrowser.onCloseActiveWindow = CollectionToolsEvent.onCloseWindow;
        });
    }
    
    /**
     * Updates UI components that shows existing prompts
     */
    public static updateViews() {
        KnownPrompts.update();
        CollectionTools.update();
        CurrentPrompts.update(true);
    }
    
    public static updateCurrentCollection() {
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
    
    public static checkProgressState() {
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
            generateNextPreview();
    
            return;
        }
    
        clearTimeout(CollectionTools.generateNextTimer);
        CollectionTools.generateNextTimer = setTimeout(CollectionTools.checkProgressState, 500);
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
    
            selectArea.addEventListener("click", CollectionToolsEvent.onSelectItem);
    
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
        moveButton.addEventListener("click", CollectionToolsEvent.onMoveSelected);
    
        const copyButton = document.createElement("div")
        copyButton.innerText = "Copy";
        copyButton.className = "PBE_button";
        copyButton.title = "Copy selected prompts to the target collection";
        copyButton.addEventListener("click", CollectionToolsEvent.onCopySelected);
    
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
    
        addButton.addEventListener("click", CollectionToolsEvent.onAddCategory);
        removeButton.addEventListener("click", CollectionToolsEvent.onRemoveCategory);
    
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
    
        addButton.addEventListener("click", CollectionToolsEvent.onAddTags);
        removeButton.addEventListener("click", CollectionToolsEvent.onRemoveTags);
    
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
            onChange: CollectionToolsEvent.onChangeAutogenCollection
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
            onChange: CollectionToolsEvent.onChangeAutogenStyle
        });
    
        container.appendChild(styleSelect);
        CollectionTools.autogenStyleSelector = styleSelect;
    
        //assign button
        const assignButton = makeElement<HTMLDivElement>({element: "div", className: "PBE_button", content: "Assign"});
        assignButton.addEventListener("click", CollectionToolsEvent.onAssignAutogenStyle);
        container.appendChild(assignButton);
    
        //append to wrapper
        container.appendChild(legend);
        wrapper.appendChild(container);
    }
    
    private static showAutogenerate(wrapper: HTMLElement) {
        const {state} = PromptsBrowser;
    
        const generateButton = makeElement<HTMLDivElement>({element: "div", className: "PBE_button", content: "Generate"});
        generateButton.addEventListener("click", CollectionToolsEvent.onGeneratePreviews);
    
        const generateTypeSelect = makeSelect({
            className: "PBE_generalInput PBE_select", value: state.autoGenerateType,
            options: [
                {id: "prompt", name: "Prompt only"},
                {id: "current", name: "With current prompts"},
                {id: "autogen", name: "With prompt autogen style"},
                {id: "selected", name: "With selected autogen style"},
            ],
            onChange: CollectionToolsEvent.onChangeAutogenerateType
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
        toggleAllButton.addEventListener("click", CollectionToolsEvent.onToggleSelected);
    
        const deleteButton = document.createElement("div");
        deleteButton.innerText = "Delete selected";
        deleteButton.className = "PBE_button PBE_buttonCancel";
        deleteButton.title = "Delete selected prompts";
        deleteButton.addEventListener("click", CollectionToolsEvent.onDeleteSelected);
    
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
    
    public static updateAutogenInfo(status: string, wrapper?: HTMLElement) {
        if(!wrapper) wrapper = document.querySelector(".PBE_collectionToolsAutogenInfo");
        if(!wrapper) return;
    
        wrapper.innerText = status;
    }
    
    public static updateSelectedInfo(wrapper?: HTMLElement) {
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
        const autogenStatus = makeDiv({className: "PBE_collectionToolsAutogenInfo"});
        const selectedStatus = makeDiv({className: "PBE_collectionToolsSelectedInfo"});
    
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
    
        PromptsBrowser.onCloseActiveWindow = CollectionToolsEvent.onCloseWindow;
        wrapper.innerHTML = "";
        wrapper.style.display = "flex";

        const footerBlock = makeDiv({className: "PBE_rowBlock PBE_rowBlock_wide PBE_toolsFooter"});

        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.className = "PBE_button";
    
        closeButton.addEventListener("click", CollectionToolsEvent.onCloseWindow);
    
        const headerBlock   = makeDiv({className: "PBE_collectionToolsHeader"});
        const contentBlock  = makeDiv({className: "PBE_dataBlock PBE_Scrollbar PBE_windowContent"});
        const statusBlock   = makeDiv({className: "PBE_collectionToolsStatus PBE_row"});
        const actionsBlock  = makeDiv({className: "PBE_collectionToolsActions PBE_row"});
    
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
