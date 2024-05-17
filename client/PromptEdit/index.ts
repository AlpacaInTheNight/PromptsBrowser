import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import KnownPrompts from "client/KnownPrompts/index";
import CollectionTools from "client/CollectionTools/index";
import Prompt from "clientTypes/prompt";
import TagTooltip from "client/TagTooltip/index";
import { makeElement, makeSelect } from "client/dom";

class PromptEdit {

    public static init(wrapper: HTMLElement) {
        const promptEdit = document.createElement("div");
        promptEdit.className = "PBE_promptEdit PBE_generalWindow";

        PromptsBrowser.DOMCache.promptEdit = promptEdit;
        wrapper.appendChild(promptEdit);

        PromptsBrowser.onCloseActiveWindow = PromptEdit.onCloseWindow;

        promptEdit.addEventListener("click", () => {
            PromptsBrowser.onCloseActiveWindow = PromptEdit.onCloseWindow;
        });
    }

    private static onCloseWindow() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.promptEdit;
        if(!wrapper || !state.editingPrompt) return;

        state.editingPrompt = undefined;
        wrapper.style.display = "none";
    }

    private static onAddTags(targetItem: Prompt, inputElement: HTMLInputElement) {
        if(!inputElement || !targetItem) return;
        const value = inputElement.value;

        let tags = value.split(",").map(item => item.trim());

        //removing empty tags
        tags = tags.filter(item => item);

        for(const tag of tags) {
            if(targetItem.tags.includes(tag)) continue;
            targetItem.tags.push(tag);
        }

        PromptEdit.update(targetItem);
    }

    private static onChangeAutogenCollection(value: string, prompt: Prompt) {
        if(!prompt) return;
        const {data} = Database;

        if(!prompt.autogen) prompt.autogen = {};
        if(!value || value === "__none") delete prompt.autogen.collection;
        else {
            prompt.autogen.collection = value;

            const targetCollection = data.styles[value];
            if(!targetCollection) return;
            prompt.autogen.style = "";

            for(const styleItem of targetCollection) {
                prompt.autogen.style = styleItem.name;
                break;
            }
        }

        PromptEdit.update(prompt);
    }

    private static onChangeAutogenStyle(value: string, prompt: Prompt) {
        if(!prompt || !value) return;

        if(!prompt.autogen) prompt.autogen = {};
        prompt.autogen.style = value;

        PromptEdit.update(prompt);
    }

    private static addCollectionSelector(wrapper: HTMLElement) {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {united} = data;
        const targetItem = united.find(item => item.id === state.editingPrompt);
        if(!targetItem) return;

        if(!targetItem.collections) return;
        if(targetItem.collections.length === 1) {
            const collName = targetItem.collections[0];
            const singleCollName = makeElement<HTMLDivElement>({
                element: "div",
                content: collName,
                className: "PBE_promptEditSingleCollection"
            });
            wrapper.appendChild(singleCollName);
            return;
        }

        const collectionSelect = document.createElement("select");
        collectionSelect.className = "PBE_generalInput";

        let options = "";
        for(const collectionItem of targetItem.collections) {
            options += `<option value="${collectionItem}">${collectionItem}</option>`;
        }
        collectionSelect.innerHTML = options;

        if(state.editTargetCollection) collectionSelect.value = state.editTargetCollection;

        collectionSelect.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLSelectElement;
            const value = target.value;
            state.editTargetCollection = value || undefined;

            PromptEdit.update();
        });

        wrapper.appendChild(collectionSelect);
    }

    private static addMoveBlock(wrapper: HTMLElement) {
        const {data} = Database;
        const {united} = data;
        const {state} = PromptsBrowser;
        const copyOrMoveBlock = document.createElement("div");
        const collectionSelect = document.createElement("select");
        const copyButton = document.createElement("button");
        const moveButton = document.createElement("button");
        const targetItem = united.find(item => item.id === state.editingPrompt);
        if(!targetItem) return;
        let atLestOnePossibleCollection = false;

        collectionSelect.className = "PBE_generalInput";
        copyOrMoveBlock.className = "PBE_rowBlock";
        copyButton.className = "PBE_button";
        moveButton.className = "PBE_button";

        copyButton.innerText = "Copy";
        moveButton.innerText = "Move";

        let options = "";
        for(const collectionId in data.original) {
            if(targetItem.collections && targetItem.collections.includes(collectionId)) {
                if(state.copyOrMoveTo === collectionId) state.copyOrMoveTo = undefined;
                continue;
            };

            if(!atLestOnePossibleCollection) atLestOnePossibleCollection = true;
            if(!state.copyOrMoveTo) state.copyOrMoveTo = collectionId;
            options += `<option value="${collectionId}">${collectionId}</option>`;
        }

        if(!atLestOnePossibleCollection) return;

        collectionSelect.innerHTML = options;

        if(state.copyOrMoveTo) collectionSelect.value = state.copyOrMoveTo;

        collectionSelect.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLSelectElement;
            const value = target.value;
            state.copyOrMoveTo = value || undefined;
        });

        copyButton.addEventListener("click", (e) => {
            const to = state.copyOrMoveTo;
            const from = state.editTargetCollection;
            if(!to || !from) return;
            if(!data.original[to] || !data.original[from]) return;

            const originalItem = data.original[from].find(item => item.id === state.editingPrompt);
            if(!originalItem) return;

            if(data.original[to].some(item => item.id === state.editingPrompt)) return;

            data.original[to].push(JSON.parse(JSON.stringify(originalItem)));

            Database.movePreviewImage(state.editingPrompt, from, to, "copy");
            Database.saveJSONData(to, true);
            Database.updateMixedList();
            PromptEdit.update();
        });

        moveButton.addEventListener("click", (e) => {
            const {data} = Database;
            const to = state.copyOrMoveTo;
            const from = state.editTargetCollection;
            if(!to || !from) return;
            if(!data.original[to] || !data.original[from]) return;

            const originalItem = data.original[from].find(item => item.id === state.editingPrompt);
            if(!originalItem) return;

            if(!data.original[to].some(item => item.id === state.editingPrompt)) {
                data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
            }
            
            data.original[from] = data.original[from].filter(item => item.id !== state.editingPrompt);

            Database.movePreviewImage(state.editingPrompt, from, to, "move");
            Database.saveJSONData(to, true);
            Database.saveJSONData(from, true);
            Database.updateMixedList();
            PromptEdit.update();
        });

        copyOrMoveBlock.appendChild(collectionSelect);
        copyOrMoveBlock.appendChild(copyButton);
        copyOrMoveBlock.appendChild(moveButton);

        wrapper.appendChild(copyOrMoveBlock);

    }

    private static saveEdit() {
        const {data} = Database;
        const {united} = data;
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.promptEdit;
        const collection = data.original[state.editTargetCollection];

        wrapper.style.display = "none";
        if(!state.editItem || !collection) return;
        const commentBlock = wrapper.querySelector("#PBE_commentArea") as HTMLTextAreaElement;
        const addAtStartInput = wrapper.querySelector(".PBE_promptEdit_addAtStart") as HTMLInputElement;
        const addAfterInput = wrapper.querySelector(".PBE_promptEdit_addAfter") as HTMLInputElement;
        const addStartInput = wrapper.querySelector(".PBE_promptEdit_addStart") as HTMLInputElement;
        const addEndInput = wrapper.querySelector(".PBE_promptEdit_addEnd") as HTMLInputElement;
        const tagsList: HTMLElement[] = wrapper.querySelectorAll(".PBE_tagsList > div") as any;
        const categoriesList: HTMLElement[] = wrapper.querySelectorAll(".PBE_categoryList > div") as any;

        const autoGenCollectionSelect = wrapper.querySelector("#PBE_autoGentCollection") as HTMLSelectElement;
        const autoGentStyleSelect = wrapper.querySelector("#PBE_autoGentStyle") as HTMLSelectElement;

        const comment = commentBlock ? commentBlock.value : "";
        const addAtStart = addAtStartInput.checked;
        const addAfter = addAfterInput.value;
        const addStart = addStartInput.value;
        const addEnd = addEndInput.value;
        const tags = [];
        const category = [];
        const autogenCollection = autoGenCollectionSelect?.value || undefined;
        const autogenStyle = autoGentStyleSelect?.value || undefined;

        for(const divItem of tagsList) tags.push(divItem.innerText);
        for(const divItem of categoriesList) category.push(divItem.innerText);

        state.editItem.comment = comment;
        if(!state.editItem.comment) delete state.editItem.comment;

        const indexInOrigin = collection.findIndex(item => item.id === state.editingPrompt);
        if(indexInOrigin !== -1) collection[indexInOrigin] = state.editItem;
        else collection.push(state.editItem);

        const collectionPrompt = collection.find(item => item.id === state.editingPrompt);
        if(!collectionPrompt) return;

        collectionPrompt.tags = tags;
        collectionPrompt.category = category;

        if(!addAtStart) delete collectionPrompt.addAtStart;
        else collectionPrompt.addAtStart = addAtStart;

        if(!addAfter) delete collectionPrompt.addAfter;
        else collectionPrompt.addAfter = addAfter;

        if(!addStart) delete collectionPrompt.addStart;
        else collectionPrompt.addStart = addStart;

        if(!addEnd) delete collectionPrompt.addEnd;
        else collectionPrompt.addEnd = addEnd;

        if(autogenStyle && autogenCollection) {
            if(!collectionPrompt.autogen) collectionPrompt.autogen = {}
            collectionPrompt.autogen.collection = autogenCollection;
            collectionPrompt.autogen.style = autogenStyle;

        } else delete collectionPrompt.autogen;

        Database.saveJSONData(state.editTargetCollection);
        Database.updateMixedList();

        state.editTargetCollection = undefined;
        state.editingPrompt = undefined;

        KnownPrompts.update();
        CollectionTools.update(true);
    }

    private static getTargetItem() {
        const {data} = Database;
        const {united} = data;
        const {state} = PromptsBrowser;
        const targetItem = united.find(item => item.id === state.editingPrompt);

        if(!targetItem) return false;
        if(!targetItem.collections) return false;
        if(!targetItem.collections[0]) return false;

        if(!targetItem.collections.includes(state.editTargetCollection)) {
            state.editTargetCollection = targetItem.collections[0];
        }

        let collection = data.original[state.editTargetCollection];
        if(!collection) return false;

        const originalItem = collection.find(item => item.id === state.editingPrompt);

        if(!originalItem) return false;

        state.editItem = JSON.parse(JSON.stringify(originalItem)) as Prompt;
        return state.editItem;
    }

    private static showAddSetup(wrapper: HTMLElement) {
        const targetItem = PromptEdit.getTargetItem();
        if(!targetItem) return;
        const {addAtStart = false, addAfter = "", addStart = "", addEnd = ""} = targetItem;

        const addAtStartBlock = document.createElement("div");
        const addAtStartTitle = document.createElement("label");
        const addAtStartCheckbox = document.createElement("input");

        addAtStartBlock.className = "PBE_rowBlock";
        addAtStartTitle.htmlFor = "PBE_promptEdit_addAtStart";
        addAtStartTitle.textContent = "Add at the beginning:";
        addAtStartCheckbox.type = "checkbox";
        addAtStartCheckbox.id = "PBE_promptEdit_addAtStart";
        addAtStartCheckbox.className = "PBE_promptEdit_addAtStart";
        addAtStartCheckbox.name = "PBE_promptEdit_addAtStart";
        addAtStartCheckbox.checked = addAtStart;

        addAtStartBlock.appendChild(addAtStartTitle);
        addAtStartBlock.appendChild(addAtStartCheckbox);


        const sisterTagsAfter = document.createElement("div");
        const sisterTagsAfterTitle = document.createElement("label");
        const sisterTagsAfterInput = document.createElement("input");

        sisterTagsAfter.className = "PBE_rowBlock";
        sisterTagsAfterTitle.textContent = "Subsequent prompts:";
        sisterTagsAfterInput.className = "PBE_generalInput PBE_promptEdit_addAfter";
        sisterTagsAfterInput.type = "text";
        sisterTagsAfterInput.value = addAfter;

        sisterTagsAfter.appendChild(sisterTagsAfterTitle);
        sisterTagsAfter.appendChild(sisterTagsAfterInput);


        const sisterTagsStart = document.createElement("div");
        const sisterTagsStartTitle = document.createElement("label");
        const sisterTagsStartInput = document.createElement("input");

        sisterTagsStart.className = "PBE_rowBlock";
        sisterTagsStartTitle.textContent = "Add prompts at the start:";
        sisterTagsStartInput.className = "PBE_generalInput PBE_promptEdit_addStart";
        sisterTagsStartInput.type = "text";
        sisterTagsStartInput.value = addStart;

        sisterTagsStart.appendChild(sisterTagsStartTitle);
        sisterTagsStart.appendChild(sisterTagsStartInput);


        const sisterTagsEnd = document.createElement("div");
        const sisterTagsEndTitle = document.createElement("label");
        const sisterTagsEndInput = document.createElement("input");

        sisterTagsEnd.className = "PBE_rowBlock";
        sisterTagsEndTitle.textContent = "Add prompts at the end:";
        sisterTagsEndInput.className = "PBE_generalInput PBE_promptEdit_addEnd";
        sisterTagsEndInput.type = "text";
        sisterTagsEndInput.value = addEnd;

        sisterTagsEnd.appendChild(sisterTagsEndTitle);
        sisterTagsEnd.appendChild(sisterTagsEndInput);



        wrapper.appendChild(addAtStartBlock);
        wrapper.appendChild(sisterTagsAfter);
        wrapper.appendChild(sisterTagsStart);
        wrapper.appendChild(sisterTagsEnd);
    }

    private static showAutoGenBlock(wrapper: HTMLElement, prompt: Prompt) {
        if(!wrapper || !prompt) return;
        const {data} = Database;
        const {autogen = {}} = prompt;
        const collection = autogen.collection || "__none";
        
        const autoGenBlock = makeElement<HTMLDivElement>({element: "div", className: "PBE_rowBlock", content: "Autogen:"});
        autoGenBlock.style.height = "40px";
        const colOptions = [{id: "__none", name: "None"}];

        for(const colId in data.styles) colOptions.push({id: colId, name: colId});
        const stylesCollectionsSelect = makeSelect({
            id: "PBE_autoGentCollection",
            className: "PBE_generalInput",
            value: collection,
            options: colOptions,
            onChange: (e) => PromptEdit.onChangeAutogenCollection((e.currentTarget as any).value, prompt)
        });

        autoGenBlock.appendChild(stylesCollectionsSelect);

        if(autogen.collection) {
            const targetCollection = data.styles[autogen.collection];
            if(targetCollection) {
                const styleOptions = [];

                for(const styleItem of targetCollection) styleOptions.push({id: styleItem.name, name: styleItem.name});

                const styleSelect = makeSelect({
                    id: "PBE_autoGentStyle",
                    className: "PBE_generalInput",
                    value: autogen.style || "",
                    options: styleOptions,
                    onChange: (e) => PromptEdit.onChangeAutogenStyle((e.currentTarget as any).value, prompt)
                });

                autoGenBlock.appendChild(styleSelect);
            }
        }

        wrapper.appendChild(autoGenBlock);
    }

    public static update(targetItem?: Prompt) {
        const {data} = Database;
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.promptEdit;
        if(!wrapper || !state.editingPrompt) return;
        if(!targetItem) targetItem = PromptEdit.getTargetItem() || undefined;
        if(!targetItem) return;
        PromptsBrowser.onCloseActiveWindow = PromptEdit.onCloseWindow;
        wrapper.innerHTML = "";

        const headerBlock = makeElement<HTMLDivElement>({element: "div", className: "PBE_rowBlock"});
        const headerTitle = makeElement<HTMLDivElement>({element: "div", className: "PBE_promptEditTitle", content: state.editingPrompt});

        headerBlock.appendChild(headerTitle);
        PromptEdit.addCollectionSelector(headerBlock);

        wrapper.style.display = "flex";
        wrapper.style.backgroundImage = Database.getPromptPreviewURL(state.editingPrompt, state.editTargetCollection);
        
        const currentTagsBlock          = makeElement<HTMLDivElement>({element: "div", className: "PBE_rowBlock"});
        const currentCategoriesBlock    = makeElement<HTMLDivElement>({element: "div", className: "PBE_rowBlock"});
        const addTagBlock               = makeElement<HTMLDivElement>({element: "div", className: "PBE_rowBlock"});
        const addCategoryBlock          = makeElement<HTMLDivElement>({element: "div", className: "PBE_rowBlock"});
        const footerBlock               = makeElement<HTMLDivElement>({element: "div", className: "PBE_rowBlock"});

        const tagsTitle                 = makeElement<HTMLDivElement>({element: "div", content: "Tags:"});
        const tagsList                  = makeElement<HTMLDivElement>({element: "div", className: "PBE_List PBE_Scrollbar PBE_tagsList"});
        const tagInput                  = makeElement<HTMLInputElement>({element: "input", id: "PBE_addTagInput", className: "PBE_generalInput"});
        const addTagButton              = makeElement<HTMLButtonElement>({element: "button", content: "Add tag", className: "PBE_button"});
        const categoriesTitle           = makeElement<HTMLDivElement>({element: "div", content: "Categories:"});
        const categoriesList            = makeElement<HTMLDivElement>({element: "div", className: "PBE_List PBE_Scrollbar PBE_categoryList"});
        const categorySelect            = makeElement<HTMLSelectElement>({element: "select", id: "PBE_addCategorySelect", className: "PBE_generalInput"});
        const addCategoryButton         = makeElement<HTMLButtonElement>({element: "button", content: "Add category", className: "PBE_button"});
        const commentArea               = makeElement<HTMLTextAreaElement>({element: "textarea", id: "PBE_commentArea", className: "PBE_Textarea PBE_Scrollbar"});

        const cancelButton              = makeElement<HTMLButtonElement>({element: "button", content: "Cancel", className: "PBE_button PBE_buttonCancel"});
        const saveButton                = makeElement<HTMLButtonElement>({element: "button", content: "Save", className: "PBE_button"});

        commentArea.value = targetItem.comment || "";

        for(const tagItem of targetItem.tags) {
            const tagElement = document.createElement("div");
            tagElement.className = "PBE_promptEditInfoItem";
            tagElement.innerText = tagItem;

            tagElement.addEventListener("click", (e) => {
                if(!e.metaKey && !e.ctrlKey) return;
                const target = e.currentTarget as HTMLElement;
                const tagId = target.innerText;

                targetItem.tags = targetItem.tags.filter(item => item !== tagId);
                PromptEdit.update(targetItem);
            });

            tagsList.appendChild(tagElement);
        }

        for(const categoryItem of targetItem.category) {
            const categoryElement = document.createElement("div");
            categoryElement.className = "PBE_promptEditInfoItem";
            categoryElement.innerText = categoryItem;

            categoryElement.addEventListener("click", (e) => {
                if(!e.metaKey && !e.ctrlKey) return;
                const target = e.currentTarget as HTMLElement;
                const categoryId = target.innerText;

                targetItem.category = targetItem.category.filter(item => item !== categoryId);
            
                PromptEdit.update(targetItem);
            });

            categoriesList.appendChild(categoryElement);
        }

        const categories = data.categories;
        let options = "";

        for(const categoryItem of categories) {
            if(targetItem.category.includes(categoryItem)) continue;
            if(!categorySelect.value) categorySelect.value = categoryItem;
            options += `<option value="${categoryItem}">${categoryItem}</option>`;
        }
        categorySelect.innerHTML = options;

        tagInput.addEventListener("keyup", (e) => {
            const target = e.currentTarget as HTMLInputElement;
            if(e.keyCode !== 13) return;
            if(target.dataset.hint) return;

            PromptEdit.onAddTags(targetItem, tagInput);
        });

        addTagButton.addEventListener("click", (e) => {
            const inputElement = wrapper.querySelector("#PBE_addTagInput") as HTMLInputElement;
            if(!inputElement) return;

            PromptEdit.onAddTags(targetItem, inputElement);
        });

        addCategoryButton.addEventListener("click", (e) => {
            const selectElement = wrapper.querySelector("#PBE_addCategorySelect") as HTMLSelectElement;
            if(!selectElement) return;
            const value = selectElement.value;

            if(targetItem.category.includes(value)) return;
            targetItem.category.push(value);

            PromptEdit.update(targetItem);
        });

        commentArea.addEventListener("change", (e) => targetItem.comment = (e.currentTarget as any).value);

        cancelButton.addEventListener("click", PromptEdit.onCloseWindow);

        saveButton.addEventListener("click", PromptEdit.saveEdit);

        currentTagsBlock.appendChild(tagsTitle);
        currentTagsBlock.appendChild(tagsList);

        currentCategoriesBlock.appendChild(categoriesTitle);
        currentCategoriesBlock.appendChild(categoriesList);

        addTagBlock.appendChild(tagInput);
        addTagBlock.appendChild(addTagButton);

        addCategoryBlock.appendChild(categorySelect);
        addCategoryBlock.appendChild(addCategoryButton);

        footerBlock.appendChild(cancelButton);
        footerBlock.appendChild(saveButton);

        wrapper.appendChild(headerBlock);

        if(Object.keys(data.original).length > 1) {
            PromptEdit.addMoveBlock(wrapper);
        }

        wrapper.appendChild(currentTagsBlock);
        wrapper.appendChild(currentCategoriesBlock);

        wrapper.appendChild(addTagBlock);
        wrapper.appendChild(addCategoryBlock);

        //autogen block
        PromptEdit.showAutoGenBlock(wrapper, targetItem);

        PromptEdit.showAddSetup(wrapper);

        wrapper.appendChild(commentArea);

        wrapper.appendChild(footerBlock);

        TagTooltip.add(tagInput, true);
    }

}

export default PromptEdit;
