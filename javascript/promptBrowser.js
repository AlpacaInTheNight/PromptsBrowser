/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/CollectionTools/index.ts":
/*!*****************************************!*\
  !*** ./client/CollectionTools/index.ts ***!
  \*****************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/KnownPrompts/index */ "./client/KnownPrompts/index.ts"), __webpack_require__(/*! client/CurrentPrompts/index */ "./client/CurrentPrompts/index.ts"), __webpack_require__(/*! client/PromptEdit/index */ "./client/PromptEdit/index.ts"), __webpack_require__(/*! client/PreviewSave/index */ "./client/PreviewSave/index.ts"), __webpack_require__(/*! client/PromptsFilter/index */ "./client/PromptsFilter/index.ts"), __webpack_require__(/*! client/TagTooltip/index */ "./client/TagTooltip/index.ts"), __webpack_require__(/*! client/dom */ "./client/dom.ts"), __webpack_require__(/*! client/checkFilter */ "./client/checkFilter.ts"), __webpack_require__(/*! client/applyStyle */ "./client/applyStyle.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4, index_5, index_6, index_7, index_8, dom_1, checkFilter_1, applyStyle_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class CollectionTools {
        static init(wrapper) {
            const collectionTools = document.createElement("div");
            collectionTools.className = "PBE_generalWindow PBE_collectionToolsWindow";
            collectionTools.id = "PBE_collectionTools";
            index_1.default.DOMCache.collectionTools = collectionTools;
            CollectionTools.generateQueue = [];
            clearTimeout(CollectionTools.generateNextTimer);
            wrapper.appendChild(collectionTools);
            index_1.default.onCloseActiveWindow = CollectionTools.onCloseWindow;
            collectionTools.addEventListener("click", () => {
                index_1.default.onCloseActiveWindow = CollectionTools.onCloseWindow;
            });
        }
        /**
         * Updates UI components that shows existing prompts
         */
        static updateViews() {
            index_3.default.update();
            CollectionTools.update();
            index_4.default.update(true);
        }
        static updateCurrentCollection() {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { promptsFilter } = index_1.default.state;
            const { collectionToolsId, selectedCollectionPrompts } = state;
            if (!collectionToolsId)
                return;
            const filterSetup = promptsFilter["collectionTools"];
            const targetCollection = data.original[collectionToolsId];
            if (!targetCollection)
                return;
            for (const item of targetCollection) {
                const { id } = item;
                if (!id)
                    continue;
                /**
                 * Removing prompt from selected if it will not be shown.
                 */
                if (!(0, checkFilter_1.default)(item, filterSetup)) {
                    if (selectedCollectionPrompts.includes(id)) {
                        state.selectedCollectionPrompts = state.selectedCollectionPrompts.filter(selId => selId !== id);
                    }
                    continue;
                }
            }
            index_2.default.saveJSONData(collectionToolsId);
            index_2.default.updateMixedList();
            CollectionTools.updateViews();
        }
        static generateNextPreview() {
            return __awaiter(this, void 0, void 0, function* () {
                const { state } = index_1.default;
                const { data } = index_2.default;
                const { collectionToolsId } = state;
                const { generateQueue } = CollectionTools;
                const textArea = index_1.default.DOMCache.containers[state.currentContainer].textArea;
                const generateButton = index_1.default.DOMCache.containers[state.currentContainer].generateButton;
                if (!textArea || !generateButton)
                    return;
                const nextItem = generateQueue.shift();
                if (!nextItem) {
                    (0, utils_1.log)("Finished generating prompt previews.");
                    state.selectedPrompt = undefined;
                    state.filesIteration++;
                    index_2.default.updateMixedList();
                    index_6.default.update();
                    index_3.default.update();
                    index_4.default.update(true);
                    CollectionTools.update(true);
                    return;
                }
                const message = `Generating preview for "${nextItem.id}". ${generateQueue.length} items in queue left. `;
                (0, utils_1.log)(message);
                CollectionTools.updateAutogenInfo(message);
                state.selectedPrompt = nextItem.id;
                state.savePreviewCollection = collectionToolsId;
                if (nextItem.autogen && nextItem.autogen.collection && nextItem.autogen.style) {
                    const delay = (ms) => new Promise(res => setTimeout(res, ms));
                    const targetCollection = data.styles[nextItem.autogen.collection];
                    if (targetCollection) {
                        const targetStyle = targetCollection.find(item => item.name === nextItem.autogen.style);
                        if (targetStyle) {
                            (0, applyStyle_1.default)(targetStyle, true, true);
                            yield delay(600); //need a pause due to a hacky nature of changing APP state
                            textArea.value = `((${nextItem.id})), ${textArea.value}`;
                        }
                    }
                }
                else if (nextItem.addPrompts) {
                    textArea.value = `((${nextItem.id})), ${nextItem.addPrompts}`;
                }
                else
                    textArea.value = nextItem.id;
                textArea.dispatchEvent(new Event('focus'));
                textArea.dispatchEvent(new Event('input'));
                textArea.dispatchEvent(new KeyboardEvent('keyup'));
                textArea.dispatchEvent(new KeyboardEvent('keypress'));
                textArea.dispatchEvent(new Event('blur'));
                generateButton.dispatchEvent(new Event('click'));
                clearTimeout(CollectionTools.generateNextTimer);
                CollectionTools.generateNextTimer = setTimeout(CollectionTools.checkProgressState, 100);
            });
        }
        static checkProgressState() {
            const { state } = index_1.default;
            const resultsContainer = index_1.default.DOMCache.containers[state.currentContainer].resultsContainer;
            if (!resultsContainer)
                return;
            /**
             * Progress bar is being added during generation and is removed from the DOM after generation finished.
             * Its presence serves as a marker when checking the state of generation.
             */
            const progressBar = resultsContainer.querySelector(".progressDiv");
            if (!progressBar) {
                index_2.default.savePromptPreview(false);
                CollectionTools.generateNextPreview();
                return;
            }
            clearTimeout(CollectionTools.generateNextTimer);
            CollectionTools.generateNextTimer = setTimeout(CollectionTools.checkProgressState, 500);
        }
        static onCloseWindow() {
            const wrapper = index_1.default.DOMCache.collectionTools;
            if (!wrapper)
                return;
            clearTimeout(CollectionTools.generateNextTimer);
            wrapper.style.display = "none";
        }
        static onChangeAutogenerateType(e) {
            const { state } = index_1.default;
            const target = e.currentTarget;
            const value = target.value;
            if (!value)
                return;
            state.autoGenerateType = value;
        }
        static onGeneratePreviews(e) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { autogen } = CollectionTools;
            const { selectedCollectionPrompts, collectionToolsId, autoGenerateType } = state;
            const textArea = index_1.default.DOMCache.containers[state.currentContainer].textArea;
            const targetCollection = data.original[collectionToolsId];
            let currentPrompt = "";
            if (!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection)
                return;
            CollectionTools.generateQueue = [];
            if (autoGenerateType === "current" && textArea) {
                currentPrompt = textArea.value;
            }
            for (const promptId of selectedCollectionPrompts) {
                const prompt = targetCollection.find(item => item.id === promptId);
                if (!prompt)
                    continue;
                const generateItem = {
                    id: promptId,
                };
                if (autoGenerateType === "current") {
                    generateItem.addPrompts = currentPrompt;
                }
                else if (autoGenerateType === "autogen") {
                    if (prompt.autogen)
                        generateItem.autogen = Object.assign({}, prompt.autogen);
                }
                else if (autoGenerateType === "selected") {
                    if (prompt.autogen)
                        generateItem.autogen = Object.assign({}, autogen);
                }
                CollectionTools.generateQueue.push(generateItem);
            }
            CollectionTools.generateNextPreview();
        }
        static onAssignAutogenStyle(e) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { collection, style } = CollectionTools.autogen;
            const { selectedCollectionPrompts, collectionToolsId } = state;
            const targetCollection = data.original[collectionToolsId];
            if (!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection)
                return;
            for (const promptId of selectedCollectionPrompts) {
                const prompt = targetCollection.find(item => item.id === promptId);
                if (!prompt)
                    continue;
                if (collection && style)
                    prompt.autogen = { collection, style };
                else
                    delete prompt.autogen;
            }
            CollectionTools.updateCurrentCollection();
        }
        static onAddCategory(e) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const target = e.currentTarget;
            const parent = target.parentElement;
            const { selectedCollectionPrompts, collectionToolsId } = state;
            const targetCollection = data.original[collectionToolsId];
            const categorySelect = parent.querySelector(".PBE_categoryAction");
            if (!categorySelect)
                return;
            const categoryId = categorySelect.value;
            if (!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection)
                return;
            for (const promptId of selectedCollectionPrompts) {
                const prompt = targetCollection.find(item => item.id === promptId);
                if (!prompt)
                    continue;
                if (!prompt.category)
                    prompt.category = [];
                if (!prompt.category.includes(categoryId))
                    prompt.category.push(categoryId);
            }
            CollectionTools.updateCurrentCollection();
        }
        static onRemoveCategory(e) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const target = e.currentTarget;
            const parent = target.parentElement;
            const { selectedCollectionPrompts, collectionToolsId } = state;
            const targetCollection = data.original[collectionToolsId];
            const categorySelect = parent.querySelector(".PBE_categoryAction");
            if (!categorySelect)
                return;
            const categoryId = categorySelect.value;
            if (!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection)
                return;
            for (const promptId of selectedCollectionPrompts) {
                const prompt = targetCollection.find(item => item.id === promptId);
                if (!prompt)
                    continue;
                if (!prompt.category)
                    continue;
                if (prompt.category.includes(categoryId))
                    prompt.category = prompt.category.filter(id => id !== categoryId);
            }
            CollectionTools.updateCurrentCollection();
        }
        static onAddTags(e) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const target = e.currentTarget;
            const parent = target.parentElement;
            const { selectedCollectionPrompts, collectionToolsId } = state;
            const targetCollection = data.original[collectionToolsId];
            const tagsInput = parent.querySelector(".PBE_tagsAction");
            if (!tagsInput)
                return;
            const tagsValue = tagsInput.value;
            if (!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection)
                return;
            const tagsArr = tagsValue.split(",");
            for (let i = 0; i < tagsArr.length; i++)
                tagsArr[i] = tagsArr[i].trim();
            for (const promptId of selectedCollectionPrompts) {
                const prompt = targetCollection.find(item => item.id === promptId);
                if (!prompt)
                    continue;
                if (!prompt.tags)
                    prompt.tags = [];
                for (const tagItem of tagsArr) {
                    if (!prompt.tags.includes(tagItem))
                        prompt.tags.push(tagItem);
                }
            }
            CollectionTools.updateCurrentCollection();
        }
        static onRemoveTags(e) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { selectedCollectionPrompts, collectionToolsId } = state;
            const targetCollection = data.original[collectionToolsId];
            const target = e.currentTarget;
            const parent = target.parentElement;
            const tagsInput = parent.querySelector(".PBE_tagsAction");
            if (!tagsInput)
                return;
            const tagsValue = tagsInput.value;
            if (!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection)
                return;
            const tagsArr = tagsValue.split(",");
            for (let i = 0; i < tagsArr.length; i++)
                tagsArr[i] = tagsArr[i].trim();
            for (const promptId of selectedCollectionPrompts) {
                const prompt = targetCollection.find(item => item.id === promptId);
                if (!prompt || !prompt.tags)
                    continue;
                prompt.tags = prompt.tags.filter(id => !tagsArr.includes(id));
            }
            CollectionTools.updateCurrentCollection();
        }
        static onSelectItem(e) {
            const target = e.currentTarget;
            const parent = target.parentElement;
            const { state } = index_1.default;
            const id = target.dataset.id;
            if (!id)
                return;
            if (e.shiftKey) {
                state.editingPrompt = id;
                index_5.default.update();
                return;
            }
            if (!state.selectedCollectionPrompts.includes(id)) {
                state.selectedCollectionPrompts.push(id);
                parent.classList.add("selected");
            }
            else {
                state.selectedCollectionPrompts = state.selectedCollectionPrompts.filter(promptId => promptId !== id);
                parent.classList.remove("selected");
            }
            CollectionTools.updateSelectedInfo();
        }
        static onToggleSelected(e) {
            const { promptsFilter } = index_1.default.state;
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { collectionToolsId } = state;
            const filterSetup = promptsFilter["collectionTools"];
            const targetCollection = data.original[collectionToolsId];
            if (!targetCollection)
                return;
            if (state.selectedCollectionPrompts.length) {
                state.selectedCollectionPrompts = [];
                CollectionTools.update();
                return;
            }
            state.selectedCollectionPrompts = [];
            for (const item of targetCollection) {
                if ((0, checkFilter_1.default)(item, filterSetup))
                    state.selectedCollectionPrompts.push(item.id);
            }
            CollectionTools.update();
        }
        /**
         * Deletes selected prompts after a user confirmation
         */
        static onDeleteSelected(e) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { selectedCollectionPrompts, collectionToolsId } = state;
            const targetCollection = data.original[collectionToolsId];
            if (!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection)
                return;
            if (confirm(`Remove ${selectedCollectionPrompts.length} prompts from catalogue "${collectionToolsId}"?`)) {
                data.original[collectionToolsId] = targetCollection.filter(prompt => !selectedCollectionPrompts.includes(prompt.id));
                for (const deletedPromptId of selectedCollectionPrompts) {
                    index_2.default.movePreviewImage(deletedPromptId, collectionToolsId, collectionToolsId, "delete");
                }
                index_2.default.saveJSONData(collectionToolsId);
                index_2.default.updateMixedList();
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
        static onMoveSelected(e, isCopy = false) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { selectedCollectionPrompts, collectionToolsId, copyOrMoveTo } = state;
            const targetCollection = data.original[collectionToolsId];
            if (!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection || !copyOrMoveTo)
                return;
            const to = state.copyOrMoveTo;
            const from = state.collectionToolsId;
            if (!to || !from)
                return;
            if (!data.original[to] || !data.original[from])
                return;
            let message = `${isCopy ? "Copy" : "Move"} ${selectedCollectionPrompts.length} prompts`;
            message += ` from catalogue "${collectionToolsId}" to catalogue "${copyOrMoveTo}"?`;
            if (confirm(message)) {
                for (const promptId of selectedCollectionPrompts) {
                    const originalItem = data.original[from].find(item => item.id === promptId);
                    if (!originalItem)
                        continue;
                    if (isCopy) {
                        if (data.original[to].some(item => item.id === promptId))
                            continue;
                        data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
                        index_2.default.movePreviewImage(promptId, from, to, "copy");
                    }
                    else {
                        if (!data.original[to].some(item => item.id === promptId)) {
                            data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
                        }
                        data.original[from] = data.original[from].filter(item => item.id !== promptId);
                        index_2.default.movePreviewImage(promptId, from, to, "move");
                    }
                }
                if (isCopy) {
                    index_2.default.saveJSONData(to, true);
                }
                else {
                    index_2.default.saveJSONData(to, true);
                    index_2.default.saveJSONData(from, true);
                }
                index_2.default.updateMixedList();
                state.selectedCollectionPrompts = [];
                CollectionTools.updateViews();
            }
        }
        static onChangeAutogenCollection(e) {
            const { data } = index_2.default;
            const target = e.currentTarget;
            const collection = target.value;
            let setFirst = false;
            CollectionTools.autogen.collection = collection;
            if (collection && CollectionTools.autogenStyleSelector) {
                let styleOptions = "";
                const targetCollection = data.styles[collection];
                if (targetCollection) {
                    for (const styleItem of targetCollection) {
                        if (!setFirst) {
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
        static onChangeAutogenStyle(e) {
            const target = e.currentTarget;
            const style = target.value;
            CollectionTools.autogen.style = style;
        }
        static showHeader(wrapper) {
            index_7.default.update(wrapper, "collectionTools");
        }
        static showPromptsDetailed(wrapper) {
            const { promptsFilter } = index_1.default.state;
            const filterSetup = promptsFilter["collectionTools"];
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { collectionToolsId, selectedCollectionPrompts } = state;
            const targetCollection = data.original[collectionToolsId];
            if (!targetCollection)
                return;
            wrapper.classList.add("PBE_detailedItemContainer");
            for (const item of targetCollection) {
                const { id, tags = [], category = [], comment = "", previewImage } = item;
                if (!id)
                    continue;
                /**
                 * Removing prompt from selected if it will not be shown.
                 */
                if (!(0, checkFilter_1.default)(item, filterSetup)) {
                    if (selectedCollectionPrompts.includes(id)) {
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
                selectArea.style.backgroundImage = index_2.default.getPromptPreviewURL(id, collectionToolsId);
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
                if (tags.length || category.length) {
                    bottomContainer.appendChild(tagsContainer);
                    bottomContainer.appendChild(categoriesContainer);
                }
                contentArea.appendChild(topContainer);
                contentArea.appendChild(bottomContainer);
                promptContainer.appendChild(selectArea);
                promptContainer.appendChild(contentArea);
                selectArea.addEventListener("click", CollectionTools.onSelectItem);
                if (selectedCollectionPrompts.includes(id))
                    promptContainer.classList.add("selected");
                wrapper.appendChild(promptContainer);
            }
        }
        static showPromptsShort(wrapper) {
        }
        static showCopyOrMove(wrapper) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { collectionToolsId } = state;
            const collectionSelect = document.createElement("select");
            collectionSelect.className = "PBE_generalInput PBE_select";
            const moveButton = document.createElement("div");
            moveButton.innerText = "Move";
            moveButton.className = "PBE_button";
            moveButton.title = "Move selected prompts to the target collection";
            moveButton.addEventListener("click", CollectionTools.onMoveSelected);
            const copyButton = document.createElement("div");
            copyButton.innerText = "Copy";
            copyButton.className = "PBE_button";
            copyButton.title = "Copy selected prompts to the target collection";
            copyButton.addEventListener("click", CollectionTools.onCopySelected);
            let options = "";
            for (const collectionId in data.original) {
                if (collectionId === collectionToolsId)
                    continue;
                if (!state.copyOrMoveTo)
                    state.copyOrMoveTo = collectionId;
                options += `<option value="${collectionId}">${collectionId}</option>`;
            }
            collectionSelect.innerHTML = options;
            collectionSelect.addEventListener("change", (e) => {
                const target = e.currentTarget;
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
        static showCategoryAction(wrapper) {
            const { data } = index_2.default;
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
            for (const categoryItem of categories) {
                if (!categorySelect.value)
                    categorySelect.value = categoryItem;
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
        static showTagsAction(wrapper) {
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
            index_8.default.add(tagsInput, true);
        }
        static showAutogenStyle(wrapper) {
            const { data } = index_2.default;
            const { collection, style } = CollectionTools.autogen;
            const container = (0, dom_1.makeElement)({ element: "fieldset", className: "PBE_fieldset" });
            const legend = (0, dom_1.makeElement)({ element: "legend", content: "Autogenerate style" });
            //collection select
            const colOptions = [{ id: "__none", name: "None" }];
            for (const colId in data.styles)
                colOptions.push({ id: colId, name: colId });
            const stylesCollectionsSelect = (0, dom_1.makeSelect)({
                className: "PBE_generalInput PBE_select", value: collection, options: colOptions,
                onChange: CollectionTools.onChangeAutogenCollection
            });
            container.appendChild(stylesCollectionsSelect);
            //style select
            const styleOptions = [];
            if (collection) {
                const targetCollection = data.styles[collection];
                if (targetCollection) {
                    for (const styleItem of targetCollection)
                        styleOptions.push({ id: styleItem.name, name: styleItem.name });
                }
            }
            const styleSelect = (0, dom_1.makeSelect)({
                className: "PBE_generalInput PBE_select", value: style || "", options: styleOptions,
                onChange: CollectionTools.onChangeAutogenStyle
            });
            container.appendChild(styleSelect);
            CollectionTools.autogenStyleSelector = styleSelect;
            //assign button
            const assignButton = (0, dom_1.makeElement)({ element: "div", className: "PBE_button", content: "Assign" });
            assignButton.addEventListener("click", CollectionTools.onAssignAutogenStyle);
            container.appendChild(assignButton);
            //append to wrapper
            container.appendChild(legend);
            wrapper.appendChild(container);
        }
        static showAutogenerate(wrapper) {
            const { state } = index_1.default;
            const generateButton = (0, dom_1.makeElement)({ element: "div", className: "PBE_button", content: "Generate" });
            generateButton.addEventListener("click", CollectionTools.onGeneratePreviews);
            const generateTypeSelect = (0, dom_1.makeSelect)({
                className: "PBE_generalInput PBE_select", value: state.autoGenerateType,
                options: [
                    { id: "prompt", name: "Prompt only" },
                    { id: "current", name: "With current prompts" },
                    { id: "autogen", name: "With prompt autogen style" },
                    { id: "selected", name: "With selected autogen style" },
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
        static showActions(wrapper) {
            const { data } = index_2.default;
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
            if (Object.keys(data.original).length > 1)
                CollectionTools.showCopyOrMove(wrapper);
            CollectionTools.showCategoryAction(wrapper);
            CollectionTools.showTagsAction(wrapper);
            CollectionTools.showAutogenStyle(wrapper);
            CollectionTools.showAutogenerate(wrapper);
        }
        static updateAutogenInfo(status, wrapper) {
            if (!wrapper)
                wrapper = document.querySelector(".PBE_collectionToolsAutogenInfo");
            if (!wrapper)
                return;
            wrapper.innerText = status;
        }
        static updateSelectedInfo(wrapper) {
            if (!wrapper)
                wrapper = document.querySelector(".PBE_collectionToolsSelectedInfo");
            if (!wrapper)
                return;
            const { selectedCollectionPrompts } = index_1.default.state;
            let text = "";
            const prevItems = [];
            const MAX_SHOWN_DETAILED = 3;
            if (!selectedCollectionPrompts || !selectedCollectionPrompts.length) {
                wrapper.innerText = "No items selected";
                return;
            }
            for (let i = 0; i < selectedCollectionPrompts.length; i++) {
                if (i + 1 > MAX_SHOWN_DETAILED)
                    break;
                prevItems.push(`"${selectedCollectionPrompts[i]}"`);
            }
            if (prevItems.length)
                text += prevItems.join(", ");
            const allSelected = selectedCollectionPrompts.length;
            if (allSelected > MAX_SHOWN_DETAILED) {
                text += `, and ${allSelected - MAX_SHOWN_DETAILED} more items selected.`;
            }
            wrapper.innerText = text;
        }
        static showStatus(wrapper) {
            const autogenStatus = (0, dom_1.makeElement)({ element: "div", className: "PBE_collectionToolsAutogenInfo" });
            const selectedStatus = (0, dom_1.makeElement)({ element: "div", className: "PBE_collectionToolsSelectedInfo" });
            CollectionTools.updateAutogenInfo("", autogenStatus);
            CollectionTools.updateSelectedInfo(selectedStatus);
            wrapper.appendChild(autogenStatus);
            wrapper.appendChild(selectedStatus);
        }
        static update(ifShown = false) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const wrapper = index_1.default.DOMCache.collectionTools;
            clearTimeout(CollectionTools.generateNextTimer);
            if (!wrapper || !data)
                return;
            if (ifShown && wrapper.style.display !== "flex")
                return;
            if (!state.collectionToolsId) {
                for (const colId in data.original) {
                    state.collectionToolsId = colId;
                    break;
                }
            }
            if (!state.collectionToolsId)
                return;
            index_1.default.onCloseActiveWindow = CollectionTools.onCloseWindow;
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
            const statusBlock = (0, dom_1.makeElement)({ element: "div", className: "PBE_collectionToolsStatus PBE_row" });
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
    CollectionTools.autogen = {
        collection: "",
        style: "",
    };
    CollectionTools.autogenStyleSelector = undefined;
    /**
     * Auto generate previews timer.
     */
    CollectionTools.generateNextTimer = 0;
    CollectionTools.generateQueue = [];
    CollectionTools.onCopySelected = (e) => CollectionTools.onMoveSelected(e, true);
    exports["default"] = CollectionTools;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/ControlPanel/index.ts":
/*!**************************************!*\
  !*** ./client/ControlPanel/index.ts ***!
  \**************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/SetupWindow/index */ "./client/SetupWindow/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class ControlPanel {
        static init(wrapper, containerId) {
            const controlPanel = document.createElement("div");
            controlPanel.className = "PBE_controlPanel";
            index_1.default.DOMCache.containers[containerId].controlPanel = controlPanel;
            wrapper.prepend(controlPanel);
        }
        static onTogglePanel(e) {
            const { state } = index_1.default;
            state.showControlPanel = !state.showControlPanel;
            ControlPanel.update();
            localStorage.setItem("showControlPanel", JSON.stringify(state.showControlPanel));
        }
        static onToggleVisibility(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            const id = target.dataset.id;
            if (!id)
                return;
            let targetWrapper = undefined;
            if (id === "known")
                targetWrapper = index_1.default.DOMCache.containers[state.currentContainer].promptBrowser;
            if (id === "current")
                targetWrapper = index_1.default.DOMCache.containers[state.currentContainer].currentPrompts;
            if (id === "positive")
                targetWrapper = index_1.default.DOMCache.containers[state.currentContainer].positivePrompts;
            if (id === "negative")
                targetWrapper = index_1.default.DOMCache.containers[state.currentContainer].negativePrompts;
            if (!targetWrapper)
                return;
            if (state.showViews.includes(id)) {
                state.showViews = state.showViews.filter(item => item !== id);
                target.classList.remove("PBE_activeControlIcon");
                targetWrapper.style.display = "none";
            }
            else {
                state.showViews.push(id);
                target.classList.add("PBE_activeControlIcon");
                targetWrapper.style.display = "";
            }
            localStorage.setItem("PBE_showViews", JSON.stringify(state.showViews));
        }
        static update() {
            const { state } = index_1.default;
            const controlPanel = index_1.default.DOMCache.containers[state.currentContainer].controlPanel;
            if (!controlPanel)
                return;
            controlPanel.innerHTML = "";
            if (state.showControlPanel)
                controlPanel.classList.remove("PBE_controlPanelHidden");
            else
                controlPanel.classList.add("PBE_controlPanelHidden");
            const togglePanelButton = document.createElement("div");
            togglePanelButton.className = "PBE_toggleControlPanel";
            togglePanelButton.innerText = state.showControlPanel ? "◀" : "▶";
            togglePanelButton.addEventListener("click", ControlPanel.onTogglePanel);
            controlPanel.appendChild(togglePanelButton);
            if (!state.showControlPanel)
                return;
            const iconKnownPrompts = document.createElement("div");
            const iconCurrentPrompts = document.createElement("div");
            const iconPositiveTextArea = document.createElement("div");
            const iconNegativeTextArea = document.createElement("div");
            iconKnownPrompts.className = "PBE_controlIcon";
            iconCurrentPrompts.className = "PBE_controlIcon";
            iconPositiveTextArea.className = "PBE_controlIcon";
            iconNegativeTextArea.className = "PBE_controlIcon";
            if (state.showViews.includes("known"))
                iconKnownPrompts.classList.add("PBE_activeControlIcon");
            if (state.showViews.includes("current"))
                iconCurrentPrompts.classList.add("PBE_activeControlIcon");
            if (state.showViews.includes("positive"))
                iconPositiveTextArea.classList.add("PBE_activeControlIcon");
            if (state.showViews.includes("negative"))
                iconNegativeTextArea.classList.add("PBE_activeControlIcon");
            iconKnownPrompts.dataset.id = "known";
            iconCurrentPrompts.dataset.id = "current";
            iconPositiveTextArea.dataset.id = "positive";
            iconNegativeTextArea.dataset.id = "negative";
            iconKnownPrompts.innerText = "K";
            iconCurrentPrompts.innerText = "C";
            iconPositiveTextArea.innerText = "P";
            iconNegativeTextArea.innerText = "N";
            iconKnownPrompts.title = "Known prompts";
            iconCurrentPrompts.title = "Current prompts";
            iconPositiveTextArea.title = "Positive prompts textarea";
            iconNegativeTextArea.title = "Negative prompts textarea";
            iconKnownPrompts.addEventListener("click", ControlPanel.onToggleVisibility);
            iconCurrentPrompts.addEventListener("click", ControlPanel.onToggleVisibility);
            iconPositiveTextArea.addEventListener("click", ControlPanel.onToggleVisibility);
            iconNegativeTextArea.addEventListener("click", ControlPanel.onToggleVisibility);
            const setupButton = document.createElement("button");
            setupButton.className = "PBE_button";
            setupButton.innerText = "New Collection";
            setupButton.style.marginRight = "10px";
            setupButton.addEventListener("click", index_2.default.update);
            controlPanel.appendChild(setupButton);
            controlPanel.appendChild(iconKnownPrompts);
            controlPanel.appendChild(iconCurrentPrompts);
            controlPanel.appendChild(iconPositiveTextArea);
            controlPanel.appendChild(iconNegativeTextArea);
        }
    }
    exports["default"] = ControlPanel;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/CurrentPrompts/index.ts":
/*!****************************************!*\
  !*** ./client/CurrentPrompts/index.ts ***!
  \****************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/PreviewSave/index */ "./client/PreviewSave/index.ts"), __webpack_require__(/*! client/PromptEdit/index */ "./client/PromptEdit/index.ts"), __webpack_require__(/*! client/PromptScribe/index */ "./client/PromptScribe/index.ts"), __webpack_require__(/*! client/PromptTools/index */ "./client/PromptTools/index.ts"), __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts.ts"), __webpack_require__(/*! client/showPromptItem */ "./client/showPromptItem.ts"), __webpack_require__(/*! client/const */ "./client/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4, index_5, index_6, synchroniseCurrentPrompts_1, showPromptItem_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class CurrentPrompts {
    }
    CurrentPrompts.init = (wrapper, containerId) => {
        const currentPrompts = document.createElement("div");
        currentPrompts.className = "PBE_currentPrompts";
        index_1.default.DOMCache.containers[containerId].currentPrompts = currentPrompts;
        wrapper.appendChild(currentPrompts);
    };
    CurrentPrompts.onDragStart = (e) => {
        const target = e.currentTarget;
        const { state } = index_1.default;
        const index = target.dataset.index;
        state.dragCurrentIndex = index;
        e.dataTransfer.setData("text", index);
    };
    CurrentPrompts.onDragOver = (e) => {
        e.preventDefault();
    };
    CurrentPrompts.onDragLeave = (e) => {
        const target = e.currentTarget;
        target.classList.remove("PBE_swap");
    };
    CurrentPrompts.onDragEnter = (e) => {
        const target = e.currentTarget;
        const { state } = index_1.default;
        e.preventDefault();
        const dragIndex = Number(target.dataset.index);
        const dropIndex = Number(state.dragCurrentIndex);
        if (Number.isNaN(dragIndex) || Number.isNaN(dropIndex))
            return;
        if (dragIndex === undefined || dropIndex === undefined)
            return;
        if (dragIndex === dropIndex)
            return;
        target.classList.add("PBE_swap");
    };
    CurrentPrompts.onDrop = (e) => {
        const target = e.currentTarget;
        const { state } = index_1.default;
        const activePrompts = index_1.default.getCurrentPrompts();
        const dragIndex = Number(target.dataset.index);
        const dropIndex = Number(state.dragCurrentIndex);
        target.classList.remove("PBE_swap");
        state.dragCurrentIndex = undefined;
        e.preventDefault();
        e.stopPropagation();
        const element = activePrompts.splice(dropIndex, 1)[0];
        activePrompts.splice(dragIndex, 0, element);
        CurrentPrompts.update();
    };
    CurrentPrompts.onDblClick = (e) => {
        const target = e.currentTarget;
        const { state } = index_1.default;
        const currentId = target.dataset.prompt;
        if (!currentId)
            return;
        state.promptToolsId = currentId;
        index_6.default.update();
    };
    CurrentPrompts.initButton = (positiveWrapper) => {
        const { readonly } = index_2.default.meta;
        const normalizeButton = document.createElement("button");
        normalizeButton.className = "PBE_actionButton PBE_normalizeButton";
        normalizeButton.innerText = "Normalize";
        if (readonly)
            normalizeButton.className = "PBE_actionButton PBE_normalizeButton_readonly";
        normalizeButton.addEventListener("click", CurrentPrompts.onNormalizePrompts);
        positiveWrapper.appendChild(normalizeButton);
    };
    CurrentPrompts.onPromptSelected = (e) => {
        const target = e.currentTarget;
        const { readonly } = index_2.default.meta;
        const { united } = index_2.default.data;
        const { state } = index_1.default;
        const currentId = target.dataset.prompt;
        let index = target.dataset.index;
        const isSyntax = target.dataset.issyntax ? true : false;
        const activePrompts = index_1.default.getCurrentPrompts();
        const wrapper = index_1.default.DOMCache.containers[state.currentContainer].currentPrompts;
        if (!wrapper || !currentId)
            return;
        if (index !== undefined)
            index = Number(index);
        if (isSyntax && index !== undefined && (e.ctrlKey || e.metaKey)) {
            activePrompts.splice(index, 1);
            index_1.default.setCurrentPrompts(activePrompts);
            CurrentPrompts.update();
            return;
        }
        const targetPrompt = united.find(item => item.id.toLowerCase() === currentId.toLowerCase());
        if (targetPrompt && targetPrompt.collections && targetPrompt.collections[0]) {
            if (!state.savePreviewCollection || !targetPrompt.collections.includes(state.savePreviewCollection)) {
                state.savePreviewCollection = targetPrompt.collections[0];
                index_3.default.update();
            }
        }
        if (e.ctrlKey || e.metaKey) {
            index_1.default.setCurrentPrompts(activePrompts.filter(item => item.id !== currentId));
            CurrentPrompts.update();
            return;
        }
        if (!readonly && e.shiftKey) {
            if (targetPrompt) {
                state.editingPrompt = currentId;
                index_4.default.update();
            }
            else {
                index_5.default.onOpenScriber();
            }
            return;
        }
        const selectedElements = wrapper.querySelectorAll(".PBE_selectedCurrentElement");
        for (let i = 0; i < selectedElements.length; ++i) {
            selectedElements[i].classList.remove("PBE_selectedCurrentElement");
        }
        if (state.selectedPrompt !== currentId) {
            target.classList.add("PBE_selectedCurrentElement");
            state.selectedPrompt = currentId;
        }
        else {
            state.selectedPrompt = undefined;
        }
        index_3.default.update();
    };
    /**
     * Handles the mouse wheel event and changes the weight of the prompt
     */
    CurrentPrompts.scrollWeight = (e) => {
        const target = e.currentTarget;
        const { state } = index_1.default;
        const { belowOneWeight = 0.05, aboveOneWeight = 0.01 } = state.config;
        if (!e.shiftKey)
            return;
        const currentId = target.dataset.prompt;
        const activePrompts = index_1.default.getCurrentPrompts();
        const targetItem = activePrompts.find(item => item.id === currentId);
        if (!currentId || !targetItem)
            return;
        if (targetItem.isSyntax)
            return;
        e.preventDefault();
        e.stopPropagation();
        if (!targetItem.weight)
            targetItem.weight = 0;
        if (e.deltaY < 0) { //rising weight
            if (targetItem.weight < 1 && (targetItem.weight + belowOneWeight) > 1) {
                targetItem.weight = 1;
            }
            else {
                if (targetItem.weight >= 1)
                    targetItem.weight += aboveOneWeight;
                else
                    targetItem.weight += belowOneWeight;
            }
        }
        else { //lowering weight
            if (targetItem.weight > 1 && (targetItem.weight - aboveOneWeight) < 1) {
                targetItem.weight = 1;
            }
            else {
                if (targetItem.weight <= 1)
                    targetItem.weight -= belowOneWeight;
                else
                    targetItem.weight -= aboveOneWeight;
            }
        }
        if (targetItem.weight < 0)
            targetItem.weight = 0;
        targetItem.weight = Number(targetItem.weight.toFixed(2));
        CurrentPrompts.update();
    };
    CurrentPrompts.onNormalizePrompts = () => {
        (0, synchroniseCurrentPrompts_1.default)(true, true);
        CurrentPrompts.update();
    };
    CurrentPrompts.update = (noTextAreaUpdate = false) => {
        const { state } = index_1.default;
        const activePrompts = index_1.default.getCurrentPrompts();
        const wrapper = index_1.default.DOMCache.containers[state.currentContainer].currentPrompts;
        const textArea = index_1.default.DOMCache.containers[state.currentContainer].textArea;
        if (!wrapper || !textArea)
            return;
        wrapper.innerHTML = "";
        const prompts = [];
        for (let index = 0; index < activePrompts.length; index++) {
            const promptItem = activePrompts[index];
            const id = promptItem.id;
            if (promptItem.isExternalNetwork) {
                prompts.push({ text: `<${id}:${promptItem.weight}>`, src: promptItem });
            }
            else {
                if (promptItem.weight !== undefined && promptItem.weight !== const_1.DEFAULT_PROMPT_WEIGHT) {
                    prompts.push({ text: `(${id}: ${promptItem.weight})`, src: promptItem });
                }
                else
                    prompts.push({ text: id, src: promptItem });
            }
            const promptElement = (0, showPromptItem_1.default)({ prompt: promptItem, options: { index } });
            if (promptItem.isSyntax) {
                promptElement.dataset.issyntax = "true";
            }
            else if (state.selectedPrompt === id)
                promptElement.classList.add("PBE_selectedCurrentElement");
            promptElement.addEventListener("dragstart", CurrentPrompts.onDragStart);
            promptElement.addEventListener("dragover", CurrentPrompts.onDragOver);
            promptElement.addEventListener("dragenter", CurrentPrompts.onDragEnter);
            promptElement.addEventListener("dragleave", CurrentPrompts.onDragLeave);
            promptElement.addEventListener("drop", CurrentPrompts.onDrop);
            promptElement.addEventListener("click", CurrentPrompts.onPromptSelected);
            if (!promptItem.isSyntax) {
                promptElement.addEventListener("dblclick", CurrentPrompts.onDblClick);
                promptElement.addEventListener("wheel", CurrentPrompts.scrollWeight);
            }
            wrapper.appendChild(promptElement);
        }
        if (noTextAreaUpdate)
            return;
        let newTextValue = "";
        for (let i = 0; i < prompts.length; i++) {
            const { text, src } = prompts[i];
            const nextPromptSrc = prompts[i + 1] ? prompts[i + 1].src : undefined;
            newTextValue += text;
            let addDelimiter = true;
            if (!nextPromptSrc)
                addDelimiter = false;
            else if (src.delimiter) {
                if (src.delimiter === "prev" || src.delimiter === "none")
                    addDelimiter = false;
            }
            else if (nextPromptSrc.delimiter) {
                if (nextPromptSrc.delimiter === "next" || nextPromptSrc.delimiter === "none")
                    addDelimiter = false;
            }
            if (addDelimiter)
                newTextValue += ", ";
        }
        textArea.value = newTextValue;
        //Just to be sure every api listening to changes in textarea done their job
        textArea.dispatchEvent(new Event('focus'));
        textArea.dispatchEvent(new Event('input'));
        textArea.dispatchEvent(new KeyboardEvent('keyup'));
        textArea.dispatchEvent(new KeyboardEvent('keypress'));
        textArea.dispatchEvent(new Event('blur'));
    };
    exports["default"] = CurrentPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/index.ts":
/*!**********************************!*\
  !*** ./client/Database/index.ts ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/CurrentPrompts/index */ "./client/CurrentPrompts/index.ts"), __webpack_require__(/*! client/PreviewSave/index */ "./client/PreviewSave/index.ts"), __webpack_require__(/*! client/LoadStyle/index */ "./client/LoadStyle/index.ts"), __webpack_require__(/*! client/categories */ "./client/categories.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! client/KnownPrompts/index */ "./client/KnownPrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4, categories_1, utils_1, const_1, index_5) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class Database {
        static load() {
            return __awaiter(this, void 0, void 0, function* () {
                const { state } = index_1.default;
                const url = Database.getAPIurl("getPrompts");
                yield fetch(url, {
                    method: 'GET',
                }).then(data => data.json()).then(res => {
                    if (!res || !res.prompts)
                        return; //TODO: process server error here
                    const { readonly = false } = res;
                    const prompts = res.prompts;
                    const styles = res.styles;
                    if (res.config) {
                        for (const i in res.config) {
                            state.config[i] = res.config[i];
                        }
                    }
                    Database.data.styles = styles;
                    Database.data.original = prompts;
                    Database.updateMixedList();
                    Database.meta.readonly = readonly;
                });
            });
        }
        static updateMixedList() {
            const unitedArray = [];
            const unitedList = {};
            const res = Database.data.original;
            const addedIds = {};
            for (const collectionId in res) {
                const collection = res[collectionId];
                if (!Array.isArray(collection))
                    continue;
                for (const collectionPrompt of collection) {
                    const { id, isExternalNetwork, previewImage, addAtStart, addAfter, addStart, addEnd } = collectionPrompt;
                    let newItem = { id, tags: [], category: [], collections: [], knownPreviews: {} };
                    if (addedIds[id])
                        newItem = unitedArray.find(item => item.id === id);
                    if (addAtStart)
                        newItem.addAtStart = addAtStart;
                    if (addAfter)
                        newItem.addAfter = addAfter;
                    if (addStart)
                        newItem.addStart = addStart;
                    if (addEnd)
                        newItem.addEnd = addEnd;
                    if (isExternalNetwork)
                        newItem.isExternalNetwork = true;
                    if (previewImage) {
                        newItem.knownPreviews[collectionId] = previewImage;
                    }
                    if (!newItem.collections.includes(collectionId)) {
                        newItem.collections.push(collectionId);
                    }
                    if (collectionPrompt.tags) {
                        collectionPrompt.tags.forEach(item => {
                            if (!newItem.tags.includes(item))
                                newItem.tags.push(item);
                        });
                    }
                    if (collectionPrompt.category) {
                        collectionPrompt.category.forEach(item => {
                            if (!newItem.category.includes(item))
                                newItem.category.push(item);
                        });
                    }
                    if (!addedIds[id]) {
                        unitedArray.push(newItem);
                        unitedList[id] = newItem;
                    }
                    addedIds[id] = true;
                }
            }
            Database.data.united = unitedArray;
            Database.data.unitedList = unitedList;
        }
        static getStylePreviewURL(style) {
            const { state } = index_1.default;
            if (!style)
                return const_1.NEW_CARD_GRADIENT;
            const { name, id, previewImage } = style;
            if (!name || !id || !previewImage)
                return const_1.NEW_CARD_GRADIENT;
            const apiUrl = Database.getAPIurl("styleImage");
            const safeFileName = (0, utils_1.makeFileNameSafe)(name);
            const url = `url("${apiUrl}/${id}/${safeFileName}.${previewImage}?${state.filesIteration}"), ${const_1.EMPTY_CARD_GRADIENT}`;
            return url;
        }
        static createNewCollection(id, mode = "short") {
            if (!id)
                return;
            const url = Database.getAPIurl("newCollection");
            (() => __awaiter(this, void 0, void 0, function* () {
                const rawResponse = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id, mode })
                });
                //const answer = await rawResponse.json();
                Database.load();
                index_5.default.update();
                index_2.default.update();
            }))();
        }
        static createNewStylesCollection(id, mode = "short") {
            if (!id)
                return;
            const url = Database.getAPIurl("newStylesCollection");
            (() => __awaiter(this, void 0, void 0, function* () {
                const rawResponse = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id, mode })
                });
                //const answer = await rawResponse.json();
                Database.load();
                index_5.default.update();
                index_2.default.update();
            }))();
        }
    }
    _a = Database;
    Database.data = {
        categories: categories_1.default,
    };
    Database.meta = {
        version: "1.2.0",
        readonly: false,
    };
    Database.getAPIurl = (endpoint, root = false) => {
        const server = root ? window.location.origin + "/" : window.location.origin + "/promptBrowser/";
        return server + endpoint;
    };
    Database.saveJSONData = (collectionId, noClear = false, noUpdate = false) => {
        if (!collectionId)
            return;
        const targetData = Database.data.original[collectionId];
        if (!targetData)
            return;
        const url = Database.getAPIurl("savePrompts");
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ collection: collectionId, data: JSON.stringify(targetData), noClear })
            });
            if (!noUpdate) {
                index_5.default.update();
                index_2.default.update(true);
            }
        }))();
    };
    Database.movePrompt = (promptA, promptB, collectionId) => {
        const { united } = Database.data;
        const { state } = index_1.default;
        if (!promptA || !promptB || promptA === promptB)
            return;
        if (!collectionId)
            collectionId = state.filterCollection;
        if (!collectionId) {
            const itemA = united.find(item => item.id === promptA);
            const itemB = united.find(item => item.id === promptB);
            if (!itemA.collections || !itemA.collections.length)
                return;
            if (!itemB.collections || !itemB.collections.length)
                return;
            for (const collectionItem of itemA.collections) {
                if (itemB.collections.includes(collectionItem)) {
                    collectionId = collectionItem;
                    break;
                }
            }
        }
        if (!collectionId)
            return;
        const targetCollection = Database.data.original[collectionId];
        if (!targetCollection)
            return;
        const indexInOriginB = targetCollection.findIndex(item => item.id === promptB);
        const indexInOriginA = targetCollection.findIndex(item => item.id === promptA);
        const element = targetCollection.splice(indexInOriginB, 1)[0];
        targetCollection.splice(indexInOriginA, 0, element);
        Database.saveJSONData(collectionId, false, true);
        Database.updateMixedList();
        index_5.default.update();
    };
    Database.movePreviewImage = (item, movefrom, to, type) => {
        const { state } = index_1.default;
        const url = Database.getAPIurl("movePreview");
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item, movefrom, to, type })
            });
            state.filesIteration++;
            index_5.default.update();
            index_2.default.update(true);
        }))();
    };
    Database.getPromptPreviewURL = (prompt, collectionId) => {
        if (!prompt)
            return const_1.NEW_CARD_GRADIENT;
        const apiUrl = Database.getAPIurl("promptImage");
        const { data } = Database;
        const { united } = data;
        const { state } = index_1.default;
        let fileExtension = "";
        let targetPrompt = united.find(item => item.id.toLowerCase() === prompt.toLowerCase());
        //if no target prompt found - searching for the normalized version of the target prompt
        if (!targetPrompt) {
            const normalizedPrompt = (0, utils_1.normalizePrompt)({ prompt, state, data });
            targetPrompt = united.find(item => item.id.toLowerCase() === normalizedPrompt.toLowerCase());
        }
        //if no prompt found - returning New Card image.
        if (!targetPrompt || !targetPrompt.knownPreviews)
            return const_1.NEW_CARD_GRADIENT;
        if (!collectionId && state.filterCollection)
            collectionId = state.filterCollection;
        if (collectionId && targetPrompt.knownPreviews[collectionId])
            fileExtension = targetPrompt.knownPreviews[collectionId];
        if (!fileExtension) {
            for (let colId in targetPrompt.knownPreviews) {
                fileExtension = targetPrompt.knownPreviews[colId];
                collectionId = colId;
                break;
            }
        }
        if (!collectionId)
            return const_1.EMPTY_CARD_GRADIENT;
        if (!fileExtension)
            return const_1.EMPTY_CARD_GRADIENT;
        const safeFileName = (0, utils_1.makeFileNameSafe)(prompt);
        const url = `url("${apiUrl}/${collectionId}/${safeFileName}.${fileExtension}?${state.filesIteration}"), ${const_1.EMPTY_CARD_GRADIENT}`;
        return url;
    };
    Database.savePromptPreview = (callUpdate = true) => {
        const { state } = index_1.default;
        const { data } = Database;
        const { united } = data;
        const { selectedPrompt, savePreviewCollection, currentContainer } = state;
        const url = Database.getAPIurl("savePreview");
        const imageArea = index_1.default.DOMCache.containers[currentContainer].imageArea;
        if (!imageArea)
            return;
        if (!selectedPrompt)
            return;
        if (!savePreviewCollection)
            return;
        const activePrompts = index_1.default.getCurrentPrompts();
        const imageContainer = imageArea.querySelector("img");
        if (!imageContainer)
            return;
        let isExternalNetwork = false;
        let src = imageContainer.src;
        const fileMarkIndex = src.indexOf("file=");
        if (fileMarkIndex === -1)
            return;
        src = src.slice(fileMarkIndex + 5);
        const cacheMarkIndex = src.indexOf("?");
        if (cacheMarkIndex && cacheMarkIndex !== -1)
            src = src.substring(0, cacheMarkIndex);
        const imageExtension = src.split('.').pop();
        if (!data.original[savePreviewCollection])
            return;
        const targetCurrentPrompt = activePrompts.find(item => item.id === state.selectedPrompt);
        if (targetCurrentPrompt && targetCurrentPrompt.isExternalNetwork)
            isExternalNetwork = true;
        const saveData = { src, prompt: selectedPrompt, collection: savePreviewCollection };
        if (isExternalNetwork)
            saveData.isExternalNetwork = true;
        let targetItem = united.find(item => item.id === selectedPrompt);
        if (!targetItem) {
            targetItem = { id: selectedPrompt, tags: [], category: [], collections: [] };
            if (isExternalNetwork)
                targetItem.isExternalNetwork = true;
            united.push(targetItem);
        }
        if (!targetItem.collections)
            targetItem.collections = [];
        if (!targetItem.collections.includes(savePreviewCollection)) {
            targetItem.collections.push(savePreviewCollection);
        }
        let originalItem = data.original[savePreviewCollection].find(item => item.id === selectedPrompt);
        if (!originalItem) {
            originalItem = { id: selectedPrompt, tags: [], category: [] };
            if (isExternalNetwork)
                originalItem.isExternalNetwork = true;
            data.original[savePreviewCollection].push(originalItem);
        }
        if (state.config.resizeThumbnails && state.config.resizeThumbnailsFormat) {
            originalItem.previewImage = state.config.resizeThumbnailsFormat.toLowerCase();
        }
        else
            originalItem.previewImage = imageExtension;
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });
            const answer = yield rawResponse.json();
            if (answer === "ok" && callUpdate) {
                state.selectedPrompt = undefined;
                state.filesIteration++;
                Database.updateMixedList();
                index_3.default.update();
                index_5.default.update();
                index_2.default.update(true);
            }
        }))();
    };
    Database.updateStyles = (collectionId) => {
        if (!collectionId)
            return;
        const { data } = Database;
        const targetData = data.styles[collectionId];
        if (!targetData)
            return;
        const url = Database.getAPIurl("saveStyles");
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ collection: collectionId, data: JSON.stringify(targetData) })
            });
            //const content = await rawResponse.json();
        }))();
    };
    Database.onRenameStyle = (collection, oldName, newName) => {
        const { data } = Database;
        if (!collection || !oldName || !newName)
            return;
        const url = Database.getAPIurl("renameStyle");
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const saveData = { oldName, newName, collection };
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });
            const targetStylesCollection = data.styles[collection];
            if (targetStylesCollection) {
                targetStylesCollection.some(item => {
                    if (item.name === oldName) {
                        item.name = newName;
                        return true;
                    }
                });
            }
            index_4.default.update();
        }))();
    };
    Database.onUpdateStylePreview = (e) => {
        const target = e.currentTarget;
        const { data } = Database;
        const { state } = index_1.default;
        let collectionId = undefined;
        let styleId = undefined;
        if (target.dataset.action) {
            const { selectedItem } = index_4.default;
            collectionId = selectedItem.collection;
            styleId = selectedItem.styleId;
        }
        else {
            collectionId = target.dataset.id;
            styleId = target.dataset.id;
        }
        if (!collectionId || !styleId)
            return;
        const imageArea = index_1.default.DOMCache.containers[state.currentContainer].imageArea;
        if (!imageArea)
            return;
        const imageContainer = imageArea.querySelector("img");
        if (!imageContainer)
            return;
        let src = imageContainer.src;
        const fileMarkIndex = src.indexOf("file=");
        if (fileMarkIndex === -1)
            return;
        src = src.slice(fileMarkIndex + 5);
        const cacheMarkIndex = src.indexOf("?");
        if (cacheMarkIndex && cacheMarkIndex !== -1)
            src = src.substring(0, cacheMarkIndex);
        const imageExtension = src.split('.').pop();
        const url = Database.getAPIurl("saveStylePreview");
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const saveData = { src, style: styleId, collection: collectionId };
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });
            //const content = await rawResponse.json();
            const targetStylesCollection = data.styles[collectionId];
            if (targetStylesCollection) {
                targetStylesCollection.some(item => {
                    if (item.name === styleId) {
                        if (state.config.resizeThumbnails && state.config.resizeThumbnailsFormat) {
                            item.previewImage = state.config.resizeThumbnailsFormat.toLowerCase();
                        }
                        else
                            item.previewImage = imageExtension;
                        return true;
                    }
                });
            }
            index_4.default.update();
        }))();
    };
    exports["default"] = Database;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/KnownPrompts/index.ts":
/*!**************************************!*\
  !*** ./client/KnownPrompts/index.ts ***!
  \**************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/CurrentPrompts/index */ "./client/CurrentPrompts/index.ts"), __webpack_require__(/*! client/PromptEdit/index */ "./client/PromptEdit/index.ts"), __webpack_require__(/*! client/CollectionTools/index */ "./client/CollectionTools/index.ts"), __webpack_require__(/*! client/dom */ "./client/dom.ts"), __webpack_require__(/*! client/showPromptItem */ "./client/showPromptItem.ts"), __webpack_require__(/*! client/TagTooltip/index */ "./client/TagTooltip/index.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4, index_5, dom_1, showPromptItem_1, index_6, utils_1, const_1, synchroniseCurrentPrompts_1, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class KnownPrompts {
        static init(promptContainer, positivePrompts, containerId) {
            const promptBrowser = document.createElement("div");
            promptBrowser.className = "PBE_promptsWrapper";
            const promptsCatalogue = document.createElement("div");
            promptsCatalogue.className = "PBE_promptsCatalogue";
            promptBrowser.appendChild(promptsCatalogue);
            index_1.default.DOMCache.containers[containerId].promptBrowser = promptBrowser;
            index_1.default.DOMCache.containers[containerId].promptsCatalogue = promptsCatalogue;
            promptContainer.insertBefore(promptBrowser, positivePrompts);
        }
        static addPromptItem(targetItem) {
            if (!targetItem)
                return;
            const activePrompts = index_1.default.getCurrentPrompts();
            const { id, addAtStart, addAfter, addStart, addEnd } = targetItem;
            if (activePrompts.some(item => item.id === id))
                return;
            const newPrompt = { id, weight: const_1.DEFAULT_PROMPT_WEIGHT, isExternalNetwork: targetItem.isExternalNetwork };
            if (addStart)
                (0, utils_1.addStrToActive)(addStart, true);
            if (addAfter) {
                if (addAtStart) {
                    (0, utils_1.addStrToActive)(addAfter, true);
                    activePrompts.unshift(newPrompt);
                }
                else {
                    activePrompts.push(newPrompt);
                    (0, utils_1.addStrToActive)(addAfter, false);
                }
            }
            else {
                if (addAtStart)
                    activePrompts.unshift(newPrompt);
                else
                    activePrompts.push(newPrompt);
            }
            if (addEnd)
                (0, utils_1.addStrToActive)(addEnd, false);
        }
        /**
         * Adds a random prompt from the prompts corresponding to the current filter settings.
         */
        static onAddRandom() {
            const { data } = index_2.default;
            const { state } = index_1.default;
            const { united } = data;
            const activePrompts = index_1.default.getCurrentPrompts();
            let dataArr = [];
            if (state.filterCollection) {
                const targetCategory = data.original[state.filterCollection];
                if (targetCategory) {
                    for (const id in targetCategory) {
                        const targetOriginalItem = targetCategory[id];
                        const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
                        if (targetMixedItem && KnownPrompts.checkFilter(targetMixedItem))
                            dataArr.push(Object.assign({}, targetMixedItem));
                    }
                }
            }
            else {
                for (const id in united) {
                    if (KnownPrompts.checkFilter(united[id]))
                        dataArr.push(Object.assign({}, united[id]));
                }
            }
            dataArr = dataArr.filter(dataItem => !activePrompts.some(item => item.id === dataItem.id));
            const randomPrompt = dataArr[Math.floor(Math.random() * dataArr.length)];
            KnownPrompts.addPromptItem(randomPrompt);
            index_3.default.update();
        }
        static onDragStart(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            const splash = target.querySelector(".PBE_promptElementSplash");
            splash.style.display = "none";
            const promptItem = target.dataset.prompt;
            state.dragItemId = promptItem;
            e.dataTransfer.setData("text", promptItem);
        }
        static onDragOver(e) {
            e.preventDefault();
        }
        static onDragEnter(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            e.preventDefault();
            const dragItem = target.dataset.prompt;
            const dropItem = state.dragItemId;
            if (!dragItem || !dropItem)
                return;
            if (dragItem === dropItem)
                return;
            if ((0, utils_1.isInSameCollection)(dragItem, dropItem))
                target.classList.add("PBE_swap");
        }
        static onDragLeave(e) {
            const target = e.currentTarget;
            target.classList.remove("PBE_swap");
        }
        static onDrop(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            const dragItem = target.dataset.prompt;
            const dropItem = e.dataTransfer.getData("text");
            target.classList.remove("PBE_swap");
            state.dragItemId = undefined;
            e.preventDefault();
            e.stopPropagation();
            if ((0, utils_1.isInSameCollection)(dragItem, dropItem)) {
                index_2.default.movePrompt(dragItem, dropItem);
            }
        }
        static checkFilter(prompt) {
            const { state } = index_1.default;
            if (state.filterCategory) {
                if (state.filterCategory === "__none") {
                    if (prompt.category !== undefined && prompt.category.length)
                        return false;
                }
                else {
                    if (!prompt.category)
                        return false;
                    if (!prompt.category.includes(state.filterCategory))
                        return false;
                }
            }
            if (state.filterCollection) {
                if (!prompt.collections)
                    return false;
                if (!prompt.collections.includes(state.filterCollection))
                    return false;
            }
            if (state.filterName) {
                if (!prompt.id.toLowerCase().includes(state.filterName))
                    return false;
            }
            if (state.filterTags && Array.isArray(state.filterTags)) {
                if (!prompt.tags)
                    return false;
                let out = true;
                const TAG_MODE = "includeAll";
                if (TAG_MODE === "includeAll") {
                    out = false;
                    for (const filterTag of state.filterTags) {
                        let fulfil = false;
                        for (const promptTag of prompt.tags) {
                            if (promptTag === filterTag) {
                                fulfil = true;
                                break;
                            }
                        }
                        if (!fulfil) {
                            out = true;
                            break;
                        }
                    }
                }
                else {
                    for (const filterTag of state.filterTags) {
                        for (const promptTag of prompt.tags) {
                            if (promptTag.includes(filterTag)) {
                                out = false;
                                break;
                            }
                        }
                    }
                }
                if (out)
                    return false;
            }
            return true;
        }
        static update(params) {
            const { data } = index_2.default;
            const { readonly } = index_2.default.meta;
            const { united } = data;
            const { state } = index_1.default;
            const { cardWidth = 50, cardHeight = 100, showPromptIndex = false, rowsInKnownCards = 3, maxCardsShown = 1000 } = state.config;
            const wrapper = index_1.default.DOMCache.containers[state.currentContainer].promptsCatalogue;
            let scrollState = 0;
            let shownItems = 0;
            if (wrapper) {
                let prevPromptContainer = wrapper.querySelector(".PBE_promptsCatalogueContent");
                if (prevPromptContainer) {
                    scrollState = prevPromptContainer.scrollTop;
                    prevPromptContainer = undefined;
                }
            }
            wrapper.innerHTML = "";
            if (!united) {
                (0, utils_2.log)("No prompt data to show");
                return;
            }
            KnownPrompts.showHeader(wrapper, params);
            const proptsContainer = document.createElement("div");
            proptsContainer.className = "PBE_promptsCatalogueContent PBE_Scrollbar";
            proptsContainer.style.maxHeight = `${cardHeight * rowsInKnownCards}px`;
            let dataArr = [];
            if (state.filterCollection) {
                const targetCategory = data.original[state.filterCollection];
                if (targetCategory) {
                    for (const id in targetCategory) {
                        const targetOriginalItem = targetCategory[id];
                        const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
                        if (targetMixedItem)
                            dataArr.push(Object.assign({}, targetMixedItem));
                    }
                }
            }
            else {
                for (const id in united)
                    dataArr.push(Object.assign({}, united[id]));
            }
            if (state.sortKnownPrompts === "alph" || state.sortKnownPrompts === "alphReversed") {
                dataArr.sort((A, B) => {
                    if (state.sortKnownPrompts === "alph") {
                        if (A.id > B.id)
                            return 1;
                        if (A.id < B.id)
                            return -1;
                    }
                    else {
                        if (A.id > B.id)
                            return -1;
                        if (A.id < B.id)
                            return 1;
                    }
                    return 0;
                });
            }
            else if (state.sortKnownPrompts === "reversed") {
                dataArr.reverse();
            }
            //show Add Random card
            if (dataArr.length) {
                const addRandom = (0, dom_1.makeElement)({
                    element: "div",
                    className: "PBE_promptElement PBE_promptElement_random",
                    content: "Add random"
                });
                addRandom.addEventListener("click", KnownPrompts.onAddRandom);
                addRandom.style.width = `${cardWidth}px`;
                addRandom.style.height = `${cardHeight}px`;
                proptsContainer.appendChild(addRandom);
            }
            for (const index in dataArr) {
                const prompt = dataArr[index];
                if (shownItems > maxCardsShown)
                    break;
                if (!KnownPrompts.checkFilter(prompt))
                    continue;
                const promptElement = (0, showPromptItem_1.default)({ prompt });
                if (showPromptIndex && state.filterCollection) {
                    promptElement.appendChild((0, dom_1.makeElement)({
                        element: "div",
                        className: "PBE_promptElementIndex",
                        content: index,
                    }));
                    /* splashElement.appendChild(makeElement({
                        element: "div",
                        className: "PBE_promptElementIndex",
                        content: index,
                    })); */
                }
                if (!readonly) {
                    promptElement.addEventListener("dragstart", KnownPrompts.onDragStart);
                    promptElement.addEventListener("dragover", KnownPrompts.onDragOver);
                    promptElement.addEventListener("dragenter", KnownPrompts.onDragEnter);
                    promptElement.addEventListener("dragleave", KnownPrompts.onDragLeave);
                    promptElement.addEventListener("drop", KnownPrompts.onDrop);
                }
                promptElement.addEventListener("click", KnownPrompts.onPromptClick);
                proptsContainer.appendChild(promptElement);
                shownItems++;
            }
            wrapper.appendChild(proptsContainer);
            proptsContainer.scrollTo(0, scrollState);
        }
    }
    KnownPrompts.onPromptClick = (e) => {
        const target = e.currentTarget;
        const { readonly } = index_2.default.meta;
        const { united } = index_2.default.data;
        const { state } = index_1.default;
        (0, synchroniseCurrentPrompts_1.default)();
        const promptItem = target.dataset.prompt;
        const targetItem = united.find(item => item.id === promptItem);
        if (!targetItem)
            return;
        if (!readonly && e.shiftKey) {
            state.editingPrompt = promptItem;
            index_4.default.update();
            return;
        }
        if (!readonly && (e.metaKey || e.ctrlKey)) {
            let targetCollection = state.filterCollection;
            if (!targetCollection) {
                if (!targetItem.collections)
                    return;
                const firstCollection = targetItem.collections[0];
                if (!firstCollection)
                    return;
                targetCollection = targetItem.collections[0];
            }
            if (confirm(`Remove prompt "${promptItem}" from catalogue "${targetCollection}"?`)) {
                if (!index_2.default.data.original[targetCollection])
                    return;
                index_2.default.data.original[targetCollection] = index_2.default.data.original[targetCollection].filter(item => item.id !== promptItem);
                index_2.default.movePreviewImage(promptItem, targetCollection, targetCollection, "delete");
                index_2.default.saveJSONData(targetCollection);
                index_2.default.updateMixedList();
                index_4.default.update();
                index_3.default.update();
            }
            return;
        }
        KnownPrompts.addPromptItem(targetItem);
        index_3.default.update();
    };
    KnownPrompts.showHeader = (wrapper, params = {}) => {
        const { readonly } = index_2.default.meta;
        const { holdTagsInput = false } = params;
        const { state } = index_1.default;
        const headerContainer = document.createElement("div");
        const categorySelector = document.createElement("select");
        const collectionSelector = document.createElement("select");
        const sortingSelector = document.createElement("select");
        const tagsInput = document.createElement("input");
        const nameInput = document.createElement("input");
        tagsInput.placeholder = "tag1, tag2, tag3...";
        nameInput.placeholder = "by name";
        const collectionToolsButton = document.createElement("button");
        collectionToolsButton.className = "PBE_button";
        collectionToolsButton.innerText = "Edit collection";
        collectionToolsButton.style.marginRight = "10px";
        categorySelector.className = "PBE_generalInput";
        collectionSelector.className = "PBE_generalInput";
        sortingSelector.className = "PBE_generalInput";
        tagsInput.className = "PBE_generalInput";
        nameInput.className = "PBE_generalInput";
        headerContainer.className = "PBE_promptsCatalogueHeader";
        //categories selector
        const categories = index_2.default.data.categories;
        let options = `
            <option value="">All categories</option>
            <option value="__none">Uncategorised</option>
        `;
        for (const categoryItem of categories) {
            if (!categorySelector.value)
                categorySelector.value = categoryItem;
            options += `<option value="${categoryItem}">${categoryItem}</option>`;
        }
        categorySelector.innerHTML = options;
        if (state.filterCategory)
            categorySelector.value = state.filterCategory;
        categorySelector.addEventListener("change", (e) => {
            const target = e.currentTarget;
            const value = target.value;
            state.filterCategory = value || undefined;
            KnownPrompts.update();
        });
        //collection selector
        options = `<option value="">All collections</option>`;
        for (const collectionId in index_2.default.data.original) {
            options += `<option value="${collectionId}">${collectionId}</option>`;
        }
        collectionSelector.innerHTML = options;
        if (state.filterCollection)
            collectionSelector.value = state.filterCollection;
        collectionSelector.addEventListener("change", (e) => {
            const target = e.currentTarget;
            const value = target.value;
            state.filterCollection = value || undefined;
            state.filesIteration++;
            KnownPrompts.update();
            index_3.default.update(true);
        });
        //sorting selector
        options = `
            <option value="">Unsorted</option>
            <option value="reversed">Unsorted reversed</option>
            <option value="alph">Alphabetical</option>
            <option value="alphReversed">Alphabetical reversed</option>
        `;
        sortingSelector.innerHTML = options;
        if (state.sortKnownPrompts)
            sortingSelector.value = state.sortKnownPrompts;
        sortingSelector.addEventListener("change", (e) => {
            const target = e.currentTarget;
            const value = target.value;
            state.sortKnownPrompts = value || undefined;
            KnownPrompts.update();
        });
        //tags input
        if (state.filterTags)
            tagsInput.value = state.filterTags.join(", ");
        tagsInput.addEventListener("change", (e) => {
            const target = e.currentTarget;
            const value = target.value;
            if (target.dataset.hint)
                return;
            let tags = value.split(",").map(item => item.trim());
            //removing empty tags
            tags = tags.filter(item => item);
            if (!tags)
                state.filterTags = undefined;
            else
                state.filterTags = tags;
            if (state.filterTags && !state.filterTags.length)
                state.filterTags = undefined;
            if (state.filterTags && state.filterTags.length === 1 && !state.filterTags[0])
                state.filterTags = undefined;
            KnownPrompts.update({ holdTagsInput: true });
        });
        //search input
        if (state.filterName)
            nameInput.value = state.filterName;
        nameInput.addEventListener("change", (e) => {
            const target = e.currentTarget;
            let value = target.value || "";
            value = value.trim();
            if (value) {
                value = value.toLowerCase();
                state.filterName = value;
            }
            else {
                state.filterName = undefined;
            }
            KnownPrompts.update();
        });
        if (!readonly) {
            collectionToolsButton.addEventListener("click", (e) => {
                if (state.filterCollection)
                    state.collectionToolsId = state.filterCollection;
                index_5.default.update();
            });
            headerContainer.appendChild(collectionToolsButton);
        }
        headerContainer.appendChild(collectionSelector);
        headerContainer.appendChild(categorySelector);
        headerContainer.appendChild(tagsInput);
        headerContainer.appendChild(nameInput);
        headerContainer.appendChild(sortingSelector);
        wrapper.appendChild(headerContainer);
        index_6.default.add(tagsInput);
        if (holdTagsInput)
            tagsInput.focus();
    };
    exports["default"] = KnownPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/LoadStyle/index.ts":
/*!***********************************!*\
  !*** ./client/LoadStyle/index.ts ***!
  \***********************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/dom */ "./client/dom.ts"), __webpack_require__(/*! client/showPromptItem */ "./client/showPromptItem.ts"), __webpack_require__(/*! client/applyStyle */ "./client/applyStyle.ts"), __webpack_require__(/*! client/const */ "./client/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, dom_1, showPromptItem_1, applyStyle_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class LoadStyle {
        static init(mainWrapper) {
            const stylesWindow = document.createElement("div");
            stylesWindow.className = "PBE_generalWindow PBE_stylesWindow";
            stylesWindow.id = "PBE_stylesWindow";
            index_1.default.DOMCache.stylesWindow = stylesWindow;
            mainWrapper.appendChild(stylesWindow);
            index_1.default.onCloseActiveWindow = LoadStyle.onCloseWindow;
            stylesWindow.addEventListener("click", () => {
                index_1.default.onCloseActiveWindow = LoadStyle.onCloseWindow;
            });
        }
        static initButton(positiveWrapper) {
            const addStylesButton = document.createElement("button");
            addStylesButton.className = "PBE_actionButton PBE_stylesButton";
            addStylesButton.innerText = "Styles";
            addStylesButton.addEventListener("click", LoadStyle.onOpenStyles);
            positiveWrapper.appendChild(addStylesButton);
        }
        static onCloseWindow() {
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.stylesWindow;
            if (!wrapper || !state.showStylesWindow)
                return;
            state.showStylesWindow = undefined;
            wrapper.style.display = "none";
        }
        static onCardClick(e) {
            const isShift = e.shiftKey;
            const isCtrl = e.metaKey || e.ctrlKey;
            if (isShift)
                LoadStyle.applyStyle(e, false);
            else if (isCtrl)
                LoadStyle.removeStyle(e);
            else
                LoadStyle.onSelectStyle(e);
        }
        static onChangeFilterCollection(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            const value = target.value;
            state.filterStyleCollection = value;
            LoadStyle.update();
        }
        static onChangeFilterName(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            const value = target.value;
            state.filterStyleName = value.toLowerCase();
            LoadStyle.update();
        }
        static onToggleShortMode(e) {
            const { state } = index_1.default;
            const id = "styles_simplified_view";
            if (state.toggledButtons.includes(id)) {
                state.toggledButtons = state.toggledButtons.filter(item => item !== id);
            }
            else {
                state.toggledButtons.push(id);
            }
            LoadStyle.update();
        }
        static onChangeSaveMeta(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            const checked = target.checked;
            const id = target.dataset.id;
            if (!id)
                return;
            if (!state.config)
                state.config = {};
            if (!state.config.saveStyleMeta)
                state.config.saveStyleMeta = {};
            state.config.saveStyleMeta[id] = checked;
            localStorage.setItem("PBE_config", JSON.stringify(state.config));
        }
        static onChangeUpdateMeta(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            const checked = target.checked;
            const id = target.dataset.id;
            if (!id)
                return;
            if (!state.config)
                state.config = {};
            if (!state.config.updateStyleMeta)
                state.config.updateStyleMeta = {};
            state.config.updateStyleMeta[id] = checked;
            localStorage.setItem("PBE_config", JSON.stringify(state.config));
        }
        static showMetaCheckboxes(wrapper, isUpdate = false) {
            const { state } = index_1.default;
            const { saveStyleMeta = {}, updateStyleMeta = {} } = state.config || {};
            const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;
            const paramsRow = (0, dom_1.makeElement)({ element: "fieldset", className: "PBE_fieldset PBE_styleMetaCheckboxes" });
            const paramsRowLegend = (0, dom_1.makeElement)({ element: "legend", content: "Save meta:" });
            const onChange = isUpdate ? LoadStyle.onChangeUpdateMeta : LoadStyle.onChangeSaveMeta;
            const prefix = isUpdate ? "Update" : "Save";
            const keepSeed = (0, dom_1.makeCheckbox)({ onChange, checked: targetMeta.seed, name: "Seed", id: `PBE_${prefix}keepSeed`, data: "seed" });
            const keepPositive = (0, dom_1.makeCheckbox)({ onChange, checked: targetMeta.positive, name: "Positive", id: `PBE_${prefix}keepPositive`, data: "positive" });
            const keepNegative = (0, dom_1.makeCheckbox)({ onChange, checked: targetMeta.negative, name: "Negative", id: `PBE_${prefix}keepNegative`, data: "negative" });
            const keepSize = (0, dom_1.makeCheckbox)({ onChange, checked: targetMeta.size, name: "Size", id: `PBE_${prefix}keepSize`, data: "size" });
            const keepSampler = (0, dom_1.makeCheckbox)({ onChange, checked: targetMeta.sampler, name: "Sampler", id: `PBE_${prefix}keepSampler`, data: "sampler" });
            const keepQuality = (0, dom_1.makeCheckbox)({ onChange, checked: targetMeta.quality, name: "Quality", id: `PBE_${prefix}keepQuality`, data: "quality" });
            paramsRow.appendChild(paramsRowLegend);
            paramsRow.appendChild(keepPositive);
            paramsRow.appendChild(keepNegative);
            paramsRow.appendChild(keepSize);
            paramsRow.appendChild(keepSampler);
            paramsRow.appendChild(keepQuality);
            paramsRow.appendChild(keepSeed);
            wrapper.appendChild(paramsRow);
        }
        static grabCurrentStyle(styleName, collectionId, isUpdate = false) {
            const { data } = index_2.default;
            const { state } = index_1.default;
            const { saveStyleMeta = {}, updateStyleMeta = {} } = state.config || {};
            const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;
            if (!collectionId)
                return false;
            if (!data.styles)
                return false;
            let seed = undefined;
            let negative = undefined;
            let width = undefined;
            let height = undefined;
            let steps = undefined;
            let cfg = undefined;
            let sampling = undefined;
            const activePrompts = index_1.default.getCurrentPrompts();
            const seedInput = index_1.default.DOMCache.containers[state.currentContainer].seedInput;
            const negativePrompts = index_1.default.DOMCache.containers[state.currentContainer].negativePrompts;
            const widthInput = index_1.default.DOMCache.containers[state.currentContainer].widthInput;
            const heightInput = index_1.default.DOMCache.containers[state.currentContainer].heightInput;
            const stepsInput = index_1.default.DOMCache.containers[state.currentContainer].stepsInput;
            const cfgInput = index_1.default.DOMCache.containers[state.currentContainer].cfgInput;
            const samplingInput = index_1.default.DOMCache.containers[state.currentContainer].samplingInput;
            if (seedInput) {
                const seedValue = Number(seedInput.value);
                if (seedValue !== undefined && seedValue !== -1 && !Number.isNaN(seedValue))
                    seed = seedValue;
            }
            if (negativePrompts) {
                const negativeTextAreas = negativePrompts.getElementsByTagName("textarea");
                if (negativeTextAreas && negativeTextAreas[0])
                    negative = negativeTextAreas[0].value;
            }
            if (widthInput)
                width = Number(widthInput.value);
            if (heightInput)
                height = Number(heightInput.value);
            if (stepsInput)
                steps = Number(stepsInput.value);
            if (cfgInput)
                cfg = Number(cfgInput.value);
            if (samplingInput)
                sampling = samplingInput.value;
            if (Number.isNaN(width))
                width = undefined;
            if (Number.isNaN(height))
                height = undefined;
            if (Number.isNaN(steps))
                steps = undefined;
            if (Number.isNaN(cfg))
                cfg = undefined;
            const targetCollection = data.styles[collectionId];
            if (!targetCollection)
                return;
            const newStyle = {};
            if (styleName)
                newStyle.name = styleName;
            //positive prompts. added as array of prompt objects
            if (targetMeta.positive) {
                if (activePrompts && activePrompts.length)
                    newStyle.positive = JSON.parse(JSON.stringify(activePrompts));
                else
                    newStyle.positive = [];
            }
            if (targetMeta.seed && seed !== undefined)
                newStyle.seed = seed;
            //negative prompts. currently added as a string, may be changed to array of prompts in future
            if (targetMeta.negative && negative !== undefined)
                newStyle.negative = negative;
            if (targetMeta.size && width !== undefined)
                newStyle.width = width;
            if (targetMeta.size && height !== undefined)
                newStyle.height = height;
            if (targetMeta.quality && steps !== undefined)
                newStyle.steps = steps;
            if (targetMeta.quality && cfg !== undefined)
                newStyle.cfg = cfg;
            if (targetMeta.sampler && sampling)
                newStyle.sampling = sampling;
            return newStyle;
        }
        static removeStyle(e) {
            const target = e.currentTarget;
            const { readonly } = index_2.default.meta;
            const { data } = index_2.default;
            if (readonly || !data.styles)
                return;
            let collectionId = undefined;
            let index = undefined;
            if (target.dataset.action) {
                const { selectedItem } = LoadStyle;
                collectionId = selectedItem.collection;
                index = selectedItem.index;
            }
            else {
                collectionId = target.dataset.id;
                index = Number(target.dataset.index);
            }
            if (!collectionId || Number.isNaN(index))
                return;
            const targetCollection = data.styles[collectionId];
            if (!targetCollection)
                return;
            const targetStyle = data.styles[collectionId][index];
            if (!targetStyle)
                return;
            if (confirm(`Remove style "${targetStyle.name}" from catalogue "${collectionId}"?`)) {
                targetCollection.splice(index, 1);
                index_2.default.updateStyles(collectionId);
                LoadStyle.update();
            }
        }
        static onRenameStyle(e) {
            const target = e.currentTarget;
            const { data } = index_2.default;
            if (!data.styles)
                return;
            let collectionId = undefined;
            let index = undefined;
            if (target.dataset.action) {
                const { selectedItem } = LoadStyle;
                collectionId = selectedItem.collection;
                index = selectedItem.index;
            }
            else {
                collectionId = target.dataset.id;
                index = Number(target.dataset.index);
            }
            if (!collectionId || Number.isNaN(index))
                return;
            const targetCollection = data.styles[collectionId];
            if (!targetCollection)
                return;
            const targetStyle = data.styles[collectionId][index];
            if (!targetStyle)
                return;
            const nameInputField = document.querySelector("#PBE_stylesWindow .PBE_nameAction");
            if (!nameInputField || !nameInputField.value)
                return;
            for (const styleItem of targetCollection) {
                if (styleItem.name === nameInputField.value) {
                    alert("Style name already used");
                    return;
                }
            }
            if (confirm(`Rename style "${targetStyle.name}" to "${nameInputField.value}"?`)) {
                index_2.default.onRenameStyle(collectionId, targetStyle.name, nameInputField.value);
            }
        }
        static updateStyle(e) {
            const target = e.currentTarget;
            const { data } = index_2.default;
            if (!data.styles)
                return;
            let collectionId = undefined;
            let index = undefined;
            if (target.dataset.action) {
                const { selectedItem } = LoadStyle;
                collectionId = selectedItem.collection;
                index = selectedItem.index;
            }
            else {
                collectionId = target.dataset.id;
                index = Number(target.dataset.index);
            }
            if (!collectionId || Number.isNaN(index))
                return;
            const targetCollection = data.styles[collectionId];
            if (!targetCollection)
                return;
            const targetStyle = data.styles[collectionId][index];
            if (!targetStyle)
                return;
            if (confirm(`Replace style "${targetStyle.name}" params to the currently selected?`)) {
                const newStyle = LoadStyle.grabCurrentStyle(undefined, collectionId, true);
                if (!newStyle)
                    return;
                for (const i in newStyle) {
                    targetStyle[i] = newStyle[i];
                }
                /**
                 * Removing fields that are not part of the style anymore.
                 * Some fields like name or previewImage must be kept in the object.
                 * TODO: I probably should check dictionary of fields that can be added/removed
                 * instead of hardcoding check for things like a name
                 */
                for (const i in targetStyle) {
                    if (i === "name")
                        continue;
                    if (i === "previewImage")
                        continue;
                    if (!newStyle[i])
                        delete targetStyle[i];
                }
                index_2.default.updateStyles(collectionId);
                LoadStyle.update();
            }
        }
        static onSelectStyle(e) {
            const target = e.currentTarget;
            const { data } = index_2.default;
            const { state } = index_1.default;
            const { updateStyleMeta = {} } = state.config || {};
            const collection = target.dataset.id;
            const styleId = target.dataset.name;
            const index = Number(target.dataset.index);
            if (!data || !data.styles || !collection || Number.isNaN(index))
                return;
            if (target.classList.contains("PBE_selectedCurrentElement")) {
                LoadStyle.selectedItem = { collection: "", styleId: "", index: 0 };
                target.classList.remove("PBE_selectedCurrentElement");
            }
            else {
                LoadStyle.selectedItem = { collection, styleId, index };
                const prevSelected = target.parentNode.querySelector(".PBE_selectedCurrentElement");
                if (prevSelected)
                    prevSelected.classList.remove("PBE_selectedCurrentElement");
                const targetCollection = data.styles[collection];
                if (targetCollection) {
                    const targetStyle = targetCollection[index];
                    const checkBoxesWrapper = document.querySelector("#PBE_stylesWindow .PBE_styleMetaCheckboxes");
                    const nameInputField = document.querySelector("#PBE_stylesWindow .PBE_nameAction");
                    if (targetStyle && checkBoxesWrapper) {
                        const checkStatus = {
                            positive: { id: "#PBE_UpdatekeepPositive", checked: targetStyle.positive !== undefined },
                            negative: { id: "#PBE_UpdatekeepNegative", checked: targetStyle.negative !== undefined },
                            size: { id: "#PBE_UpdatekeepSize", checked: targetStyle.height !== undefined },
                            sampler: { id: "#PBE_UpdatekeepSampler", checked: targetStyle.sampling !== undefined },
                            quality: { id: "#PBE_UpdatekeepQuality", checked: targetStyle.steps !== undefined },
                            seed: { id: "#PBE_UpdatekeepSeed", checked: targetStyle.seed !== undefined },
                        };
                        for (const fieldId in checkStatus) {
                            const field = checkStatus[fieldId];
                            const targetElement = checkBoxesWrapper.querySelector(field.id);
                            targetElement.checked = field.checked;
                            updateStyleMeta[fieldId] = field.checked;
                        }
                        if (state.config)
                            state.config.updateStyleMeta = updateStyleMeta;
                    }
                    if ((targetStyle === null || targetStyle === void 0 ? void 0 : targetStyle.name) && nameInputField) {
                        nameInputField.value = targetStyle.name;
                    }
                }
                target.classList.add("PBE_selectedCurrentElement");
            }
        }
        static applyStyle(e, isAfter) {
            const target = e.currentTarget;
            const { data } = index_2.default;
            if (!data.styles)
                return;
            if (isAfter === undefined)
                isAfter = target.dataset.isafter ? true : false;
            let collectionId = undefined;
            let index = undefined;
            if (target.dataset.action) {
                const { selectedItem } = LoadStyle;
                collectionId = selectedItem.collection;
                index = selectedItem.index;
            }
            else {
                collectionId = target.dataset.id;
                index = Number(target.dataset.index);
            }
            if (!collectionId || Number.isNaN(index))
                return;
            const targetCollection = data.styles[collectionId];
            if (!targetCollection)
                return;
            const targetStyle = data.styles[collectionId][index];
            if (!targetStyle)
                return;
            (0, applyStyle_1.default)(targetStyle, isAfter);
        }
        static onOpenStyles() {
            const { state } = index_1.default;
            state.showStylesWindow = true;
            LoadStyle.update();
        }
        static showFilters(wrapper) {
            const { data } = index_2.default;
            const { state } = index_1.default;
            const toggleShortMode = document.createElement("div");
            toggleShortMode.className = "PBE_toggleButton";
            toggleShortMode.innerText = "Simple mode";
            toggleShortMode.title = "Toggles simplified view mode";
            if (state.toggledButtons.includes("styles_simplified_view"))
                toggleShortMode.classList.add("PBE_toggledButton");
            toggleShortMode.style.height = "16px";
            toggleShortMode.addEventListener("click", LoadStyle.onToggleShortMode);
            const collectionSelect = document.createElement("select");
            collectionSelect.className = "PBE_generalInput PBE_select";
            let options = "<option value=''>Any</option>";
            for (const collectionId in data.styles) {
                options += `<option value="${collectionId}">${collectionId}</option>`;
            }
            collectionSelect.innerHTML = options;
            collectionSelect.value = state.filterStyleCollection || "";
            collectionSelect.addEventListener("change", LoadStyle.onChangeFilterCollection);
            const nameFilter = document.createElement("input");
            nameFilter.placeholder = "Search name";
            nameFilter.className = "PBE_generalInput PBE_input";
            nameFilter.value = state.filterStyleName || "";
            nameFilter.addEventListener("change", LoadStyle.onChangeFilterName);
            wrapper.appendChild(toggleShortMode);
            wrapper.appendChild(collectionSelect);
            wrapper.appendChild(nameFilter);
        }
        static showStylesShort(wrapper) {
            const { data } = index_2.default;
            const { filterStyleCollection, filterStyleName } = index_1.default.state;
            let styles = [];
            for (const collectionId in data.styles) {
                for (let i = 0; i < data.styles[collectionId].length; i++) {
                    const styleItem = data.styles[collectionId][i];
                    styles.push(Object.assign(Object.assign({}, styleItem), { id: collectionId, index: i }));
                }
            }
            styles.sort((A, B) => {
                if (A.name > B.name)
                    return 1;
                if (A.name < B.name)
                    return -1;
                return 0;
            });
            for (const style of styles) {
                const { name, positive, negative, width, height, steps, cfg, sampling, id, index, previewImage } = style;
                if (!name)
                    continue;
                if (filterStyleCollection && filterStyleCollection !== id)
                    continue;
                if (filterStyleName && !name.toLowerCase().includes(filterStyleName))
                    continue;
                let url = const_1.EMPTY_CARD_GRADIENT;
                if (previewImage)
                    url = index_2.default.getStylePreviewURL(style);
                const element = (0, showPromptItem_1.default)({
                    prompt: { id: name },
                    options: { url },
                });
                element.dataset.id = id;
                element.dataset.index = index + "";
                element.dataset.name = name;
                if (LoadStyle.selectedItem.collection === id && LoadStyle.selectedItem.index === index) {
                    element.classList.add("PBE_selectedCurrentElement");
                }
                element.addEventListener("click", LoadStyle.onCardClick);
                wrapper.appendChild(element);
            }
        }
        static showActions(wrapper, isShort = true) {
            const { readonly } = index_2.default.meta;
            const nameContainer = (0, dom_1.makeElement)({ element: "fieldset", className: "PBE_fieldset" });
            const nameLegend = (0, dom_1.makeElement)({ element: "legend", content: "Name" });
            const nameField = (0, dom_1.makeElement)({ element: "input", className: "PBE_generalInput PBE_input PBE_nameAction" });
            nameField.placeholder = "Style name";
            const renameButton = (0, dom_1.makeElement)({ element: "div", className: "PBE_button", content: "Rename", title: "Rename selected style" });
            renameButton.dataset.action = "true";
            renameButton.addEventListener("click", LoadStyle.onRenameStyle);
            nameContainer.appendChild(nameLegend);
            nameContainer.appendChild(nameField);
            nameContainer.appendChild(renameButton);
            if (!isShort) {
                if (!readonly) {
                    wrapper.appendChild(nameContainer);
                    LoadStyle.showMetaCheckboxes(wrapper, true);
                }
                return;
            }
            const actionContainer = document.createElement("fieldset");
            actionContainer.className = "PBE_fieldset";
            const actionLegend = document.createElement("legend");
            actionLegend.innerText = "Actions";
            const addBeforeButton = document.createElement("div");
            addBeforeButton.innerText = "Add before";
            addBeforeButton.className = "PBE_button";
            addBeforeButton.title = "Add style prompts at the start of current prompts";
            addBeforeButton.dataset.action = "true";
            addBeforeButton.addEventListener("click", LoadStyle.applyStyle);
            const addAfterButton = document.createElement("div");
            addAfterButton.innerText = "Add after";
            addAfterButton.className = "PBE_button";
            addAfterButton.title = "Add style prompts at the end of current prompts";
            addAfterButton.dataset.action = "true";
            addAfterButton.dataset.isafter = "true";
            addAfterButton.addEventListener("click", LoadStyle.applyStyle);
            actionContainer.appendChild(actionLegend);
            actionContainer.appendChild(addBeforeButton);
            actionContainer.appendChild(addAfterButton);
            const editContainer = document.createElement("fieldset");
            editContainer.className = "PBE_fieldset";
            const editLegend = document.createElement("legend");
            editLegend.innerText = "Edit";
            const updateButton = document.createElement("div");
            updateButton.innerText = "Update";
            updateButton.className = "PBE_button";
            updateButton.title = "Update selected style";
            updateButton.dataset.action = "true";
            updateButton.addEventListener("click", LoadStyle.updateStyle);
            const updatePreviewButton = document.createElement("div");
            updatePreviewButton.innerText = "Update preview";
            updatePreviewButton.className = "PBE_button";
            updatePreviewButton.title = "Delete selected style";
            updatePreviewButton.dataset.action = "true";
            updatePreviewButton.addEventListener("click", index_2.default.onUpdateStylePreview);
            editContainer.appendChild(editLegend);
            editContainer.appendChild(updateButton);
            editContainer.appendChild(updatePreviewButton);
            const systemContainer = document.createElement("fieldset");
            systemContainer.className = "PBE_fieldset";
            const systemLegend = document.createElement("legend");
            systemLegend.innerText = "System";
            const deleteButton = document.createElement("div");
            deleteButton.innerText = "Delete";
            deleteButton.className = "PBE_button PBE_buttonCancel";
            deleteButton.title = "Delete selected style";
            deleteButton.dataset.action = "true";
            deleteButton.addEventListener("click", LoadStyle.removeStyle);
            systemContainer.appendChild(systemLegend);
            systemContainer.appendChild(deleteButton);
            wrapper.appendChild(actionContainer);
            if (!readonly) {
                wrapper.appendChild(editContainer);
                wrapper.appendChild(nameContainer);
                LoadStyle.showMetaCheckboxes(wrapper, true);
                wrapper.appendChild(systemContainer);
            }
        }
        static showStyles(wrapper) {
            const { readonly } = index_2.default.meta;
            const { data } = index_2.default;
            const { state } = index_1.default;
            const { filterStyleCollection, filterStyleName } = state;
            const activePrompts = index_1.default.getCurrentPrompts();
            let styles = [];
            for (const collectionId in data.styles) {
                for (let i = 0; i < data.styles[collectionId].length; i++) {
                    const styleItem = data.styles[collectionId][i];
                    styles.push(Object.assign(Object.assign({}, styleItem), { id: collectionId, index: i }));
                }
            }
            styles.sort((A, B) => {
                if (A.name > B.name)
                    return 1;
                if (A.name < B.name)
                    return -1;
                return 0;
            });
            for (const style of styles) {
                const { name, positive, negative, width, height, steps, cfg, sampling, id, index, previewImage } = style;
                if (filterStyleCollection && filterStyleCollection !== id)
                    continue;
                if (filterStyleName && !name.toLowerCase().includes(filterStyleName))
                    continue;
                const stylesItem = document.createElement("div");
                const styleHeader = document.createElement("div");
                const nameContainer = document.createElement("div");
                const contentContainer = document.createElement("div");
                const metaInfoContainer = document.createElement("div");
                const updatePreview = document.createElement("div");
                const currentPromptsContainer = document.createElement("div");
                const actionsContainer = document.createElement("div");
                stylesItem.className = "PBE_styleItem";
                styleHeader.className = "PBE_styleHeader";
                nameContainer.className = "PBE_styleItemName";
                contentContainer.className = "PBE_styleItemContent";
                metaInfoContainer.className = "PBE_styleItemMetaInfo";
                currentPromptsContainer.className = "PBE_stylesCurrentList PBE_Scrollbar";
                actionsContainer.className = "PBE_stylesAction";
                updatePreview.className = "PBE_button";
                if (previewImage) {
                    const url = index_2.default.getStylePreviewURL(style);
                    stylesItem.style.backgroundImage = url;
                }
                nameContainer.innerText = name;
                updatePreview.innerText = "Update preview";
                updatePreview.dataset.id = name;
                updatePreview.dataset.collection = id;
                if (positive)
                    for (const stylePrompt of positive) {
                        const { id, weight, isExternalNetwork } = stylePrompt;
                        const promptElement = (0, showPromptItem_1.default)({
                            prompt: { id, weight, isExternalNetwork },
                            options: {},
                        });
                        currentPromptsContainer.appendChild(promptElement);
                    }
                /* currentPromptsContainer.addEventListener("wheel", (e) => {
                    if(!e.deltaY) return;
            
                    e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
                    e.preventDefault();
                }); */
                const addBeforeButton = document.createElement("button");
                const addAfterButton = document.createElement("button");
                const removeButton = document.createElement("button");
                const updateButton = document.createElement("button");
                addBeforeButton.innerText = "Add before";
                addAfterButton.innerText = "Add after";
                removeButton.innerText = "Remove";
                updateButton.innerText = "Update";
                addBeforeButton.className = "PBE_button";
                addAfterButton.className = "PBE_button";
                removeButton.className = "PBE_button PBE_buttonCancel";
                updateButton.className = "PBE_button";
                addAfterButton.dataset.isafter = "true";
                stylesItem.dataset.name = name;
                stylesItem.dataset.id = id;
                addAfterButton.dataset.id = id;
                addBeforeButton.dataset.id = id;
                removeButton.dataset.id = id;
                updateButton.dataset.id = id;
                stylesItem.dataset.index = index + "";
                addAfterButton.dataset.index = index + "";
                addBeforeButton.dataset.index = index + "";
                removeButton.dataset.index = index + "";
                updateButton.dataset.index = index + "";
                addBeforeButton.addEventListener("click", LoadStyle.applyStyle);
                addAfterButton.addEventListener("click", LoadStyle.applyStyle);
                removeButton.addEventListener("click", LoadStyle.removeStyle);
                updateButton.addEventListener("click", LoadStyle.updateStyle);
                updatePreview.addEventListener("click", index_2.default.onUpdateStylePreview);
                actionsContainer.appendChild(addBeforeButton);
                if (activePrompts && activePrompts.length)
                    actionsContainer.appendChild(addAfterButton);
                if (!readonly) {
                    actionsContainer.appendChild(removeButton);
                    if (activePrompts && activePrompts.length)
                        actionsContainer.appendChild(updateButton);
                }
                contentContainer.appendChild(currentPromptsContainer);
                contentContainer.appendChild(actionsContainer);
                styleHeader.appendChild(nameContainer);
                if (!readonly)
                    styleHeader.appendChild(updatePreview);
                let metaInfo = []; //steps, cfg, sampling
                if (negative)
                    metaInfo.push(`<span class="PBE_styleMetaField">Negative:</span> "${negative}"`);
                if (width)
                    metaInfo.push(`<span class="PBE_styleMetaField">Width:</span> ${width}`);
                if (height)
                    metaInfo.push(`<span class="PBE_styleMetaField">Height:</span> ${height}`);
                if (sampling)
                    metaInfo.push(`<span class="PBE_styleMetaField">Sampling:</span> ${sampling}`);
                if (steps)
                    metaInfo.push(`<span class="PBE_styleMetaField">Steps:</span> ${steps}`);
                if (cfg)
                    metaInfo.push(`<span class="PBE_styleMetaField">CFG:</span> ${cfg}`);
                metaInfoContainer.innerHTML = metaInfo.join("; ");
                stylesItem.appendChild(styleHeader);
                stylesItem.appendChild(contentContainer);
                stylesItem.appendChild(metaInfoContainer);
                stylesItem.addEventListener("click", LoadStyle.onSelectStyle);
                wrapper.appendChild(stylesItem);
            }
        }
        static update() {
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.stylesWindow;
            if (!wrapper || !state.showStylesWindow)
                return;
            index_1.default.onCloseActiveWindow = LoadStyle.onCloseWindow;
            wrapper.innerHTML = "";
            wrapper.style.display = "flex";
            const isShort = state.toggledButtons.includes("styles_simplified_view");
            const possibleStylesBlock = document.createElement("div");
            const footerBlock = document.createElement("div");
            const closeButton = document.createElement("button");
            footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
            closeButton.innerText = "Close";
            closeButton.className = "PBE_button";
            if (isShort) {
                possibleStylesBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
                LoadStyle.showStylesShort(possibleStylesBlock);
            }
            else {
                possibleStylesBlock.className = "PBE_dataColumn PBE_Scrollbar PBE_windowContent";
                LoadStyle.showStyles(possibleStylesBlock);
            }
            closeButton.addEventListener("click", LoadStyle.onCloseWindow);
            footerBlock.appendChild(closeButton);
            const filterBlock = document.createElement("div");
            filterBlock.className = "PBE_row PBE_stylesFilter";
            LoadStyle.showFilters(filterBlock);
            wrapper.appendChild(filterBlock);
            wrapper.appendChild(possibleStylesBlock);
            const actionsBlock = document.createElement("div");
            actionsBlock.className = "PBE_collectionToolsActions PBE_row";
            LoadStyle.showActions(actionsBlock, isShort);
            wrapper.appendChild(actionsBlock);
            wrapper.appendChild(footerBlock);
        }
        ;
    }
    LoadStyle.selectedItem = {
        collection: "",
        styleId: "",
        index: 0,
    };
    exports["default"] = LoadStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/PreviewSave/index.ts":
/*!*************************************!*\
  !*** ./client/PreviewSave/index.ts ***!
  \*************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class PreviewSave {
        static onSavePreview() {
            index_2.default.savePromptPreview();
        }
    }
    PreviewSave.init = (wrapper, containerId) => {
        const savePromptWrapper = document.createElement("div");
        wrapper.appendChild(savePromptWrapper);
        index_1.default.DOMCache.containers[containerId].savePromptWrapper = savePromptWrapper;
    };
    PreviewSave.update = () => {
        const { data } = index_2.default;
        const { readonly } = index_2.default.meta;
        const { state } = index_1.default;
        const wrapper = index_1.default.DOMCache.containers[state.currentContainer].savePromptWrapper;
        if (readonly || !wrapper)
            return;
        wrapper.innerHTML = "";
        if (!state.selectedPrompt)
            return;
        const savePromptPreviewButton = document.createElement("div");
        savePromptPreviewButton.className = "PBE_actionButton PBE_savePromptPreview";
        savePromptPreviewButton.innerText = "save preview";
        const collectionSelect = document.createElement("select");
        collectionSelect.className = "PBE_generalInput PBE_select PBE_savePromptSelect";
        let options = "";
        for (const collectionId in data.original) {
            if (!state.savePreviewCollection)
                state.savePreviewCollection = collectionId;
            options += `<option value="${collectionId}">${collectionId}</option>`;
        }
        collectionSelect.innerHTML = options;
        if (state.savePreviewCollection)
            collectionSelect.value = state.savePreviewCollection;
        collectionSelect.addEventListener("change", (e) => {
            const target = e.currentTarget;
            const value = target.value;
            state.savePreviewCollection = value || undefined;
        });
        savePromptPreviewButton.removeEventListener("click", PreviewSave.onSavePreview);
        savePromptPreviewButton.addEventListener("click", PreviewSave.onSavePreview);
        wrapper.appendChild(collectionSelect);
        wrapper.appendChild(savePromptPreviewButton);
    };
    exports["default"] = PreviewSave;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/PromptEdit/index.ts":
/*!************************************!*\
  !*** ./client/PromptEdit/index.ts ***!
  \************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/KnownPrompts/index */ "./client/KnownPrompts/index.ts"), __webpack_require__(/*! client/CollectionTools/index */ "./client/CollectionTools/index.ts"), __webpack_require__(/*! client/TagTooltip/index */ "./client/TagTooltip/index.ts"), __webpack_require__(/*! client/dom */ "./client/dom.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4, index_5, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class PromptEdit {
        static init(wrapper) {
            const promptEdit = document.createElement("div");
            promptEdit.className = "PBE_promptEdit PBE_generalWindow";
            index_1.default.DOMCache.promptEdit = promptEdit;
            wrapper.appendChild(promptEdit);
            index_1.default.onCloseActiveWindow = PromptEdit.onCloseWindow;
            promptEdit.addEventListener("click", () => {
                index_1.default.onCloseActiveWindow = PromptEdit.onCloseWindow;
            });
        }
        static onCloseWindow() {
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.promptEdit;
            if (!wrapper || !state.editingPrompt)
                return;
            state.editingPrompt = undefined;
            wrapper.style.display = "none";
        }
        static onAddTags(targetItem, inputElement) {
            if (!inputElement || !targetItem)
                return;
            const value = inputElement.value;
            let tags = value.split(",").map(item => item.trim());
            //removing empty tags
            tags = tags.filter(item => item);
            for (const tag of tags) {
                if (targetItem.tags.includes(tag))
                    continue;
                targetItem.tags.push(tag);
            }
            PromptEdit.update(targetItem);
        }
        static onChangeAutogenCollection(value, prompt) {
            if (!prompt)
                return;
            const { data } = index_2.default;
            if (!prompt.autogen)
                prompt.autogen = {};
            if (!value || value === "__none")
                delete prompt.autogen.collection;
            else {
                prompt.autogen.collection = value;
                const targetCollection = data.styles[value];
                if (!targetCollection)
                    return;
                prompt.autogen.style = "";
                for (const styleItem of targetCollection) {
                    prompt.autogen.style = styleItem.name;
                    break;
                }
            }
            PromptEdit.update(prompt);
        }
        static onChangeAutogenStyle(value, prompt) {
            if (!prompt || !value)
                return;
            if (!prompt.autogen)
                prompt.autogen = {};
            prompt.autogen.style = value;
            PromptEdit.update(prompt);
        }
        static addCollectionSelector(wrapper) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const { united } = data;
            const targetItem = united.find(item => item.id === state.editingPrompt);
            if (!targetItem)
                return;
            if (!targetItem.collections)
                return;
            if (targetItem.collections.length === 1) {
                const collName = targetItem.collections[0];
                const singleCollName = (0, dom_1.makeElement)({
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
            for (const collectionItem of targetItem.collections) {
                options += `<option value="${collectionItem}">${collectionItem}</option>`;
            }
            collectionSelect.innerHTML = options;
            if (state.editTargetCollection)
                collectionSelect.value = state.editTargetCollection;
            collectionSelect.addEventListener("change", (e) => {
                const target = e.currentTarget;
                const value = target.value;
                state.editTargetCollection = value || undefined;
                PromptEdit.update();
            });
            wrapper.appendChild(collectionSelect);
        }
        static addMoveBlock(wrapper) {
            const { data } = index_2.default;
            const { united } = data;
            const { state } = index_1.default;
            const copyOrMoveBlock = document.createElement("div");
            const collectionSelect = document.createElement("select");
            const copyButton = document.createElement("button");
            const moveButton = document.createElement("button");
            const targetItem = united.find(item => item.id === state.editingPrompt);
            if (!targetItem)
                return;
            let atLestOnePossibleCollection = false;
            collectionSelect.className = "PBE_generalInput";
            copyOrMoveBlock.className = "PBE_rowBlock";
            copyButton.className = "PBE_button";
            moveButton.className = "PBE_button";
            copyButton.innerText = "Copy";
            moveButton.innerText = "Move";
            let options = "";
            for (const collectionId in data.original) {
                if (targetItem.collections && targetItem.collections.includes(collectionId)) {
                    if (state.copyOrMoveTo === collectionId)
                        state.copyOrMoveTo = undefined;
                    continue;
                }
                ;
                if (!atLestOnePossibleCollection)
                    atLestOnePossibleCollection = true;
                if (!state.copyOrMoveTo)
                    state.copyOrMoveTo = collectionId;
                options += `<option value="${collectionId}">${collectionId}</option>`;
            }
            if (!atLestOnePossibleCollection)
                return;
            collectionSelect.innerHTML = options;
            if (state.copyOrMoveTo)
                collectionSelect.value = state.copyOrMoveTo;
            collectionSelect.addEventListener("change", (e) => {
                const target = e.currentTarget;
                const value = target.value;
                state.copyOrMoveTo = value || undefined;
            });
            copyButton.addEventListener("click", (e) => {
                const to = state.copyOrMoveTo;
                const from = state.editTargetCollection;
                if (!to || !from)
                    return;
                if (!data.original[to] || !data.original[from])
                    return;
                const originalItem = data.original[from].find(item => item.id === state.editingPrompt);
                if (!originalItem)
                    return;
                if (data.original[to].some(item => item.id === state.editingPrompt))
                    return;
                data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
                index_2.default.movePreviewImage(state.editingPrompt, from, to, "copy");
                index_2.default.saveJSONData(to, true);
                index_2.default.updateMixedList();
                PromptEdit.update();
            });
            moveButton.addEventListener("click", (e) => {
                const { data } = index_2.default;
                const to = state.copyOrMoveTo;
                const from = state.editTargetCollection;
                if (!to || !from)
                    return;
                if (!data.original[to] || !data.original[from])
                    return;
                const originalItem = data.original[from].find(item => item.id === state.editingPrompt);
                if (!originalItem)
                    return;
                if (!data.original[to].some(item => item.id === state.editingPrompt)) {
                    data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
                }
                data.original[from] = data.original[from].filter(item => item.id !== state.editingPrompt);
                index_2.default.movePreviewImage(state.editingPrompt, from, to, "move");
                index_2.default.saveJSONData(to, true);
                index_2.default.saveJSONData(from, true);
                index_2.default.updateMixedList();
                PromptEdit.update();
            });
            copyOrMoveBlock.appendChild(collectionSelect);
            copyOrMoveBlock.appendChild(copyButton);
            copyOrMoveBlock.appendChild(moveButton);
            wrapper.appendChild(copyOrMoveBlock);
        }
        static saveEdit() {
            const { data } = index_2.default;
            const { united } = data;
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.promptEdit;
            const collection = data.original[state.editTargetCollection];
            wrapper.style.display = "none";
            if (!state.editItem || !collection)
                return;
            const commentBlock = wrapper.querySelector("#PBE_commentArea");
            const addAtStartInput = wrapper.querySelector(".PBE_promptEdit_addAtStart");
            const addAfterInput = wrapper.querySelector(".PBE_promptEdit_addAfter");
            const addStartInput = wrapper.querySelector(".PBE_promptEdit_addStart");
            const addEndInput = wrapper.querySelector(".PBE_promptEdit_addEnd");
            const tagsList = wrapper.querySelectorAll(".PBE_tagsList > div");
            const categoriesList = wrapper.querySelectorAll(".PBE_categoryList > div");
            const autoGenCollectionSelect = wrapper.querySelector("#PBE_autoGentCollection");
            const autoGentStyleSelect = wrapper.querySelector("#PBE_autoGentStyle");
            const comment = commentBlock ? commentBlock.value : "";
            const addAtStart = addAtStartInput.checked;
            const addAfter = addAfterInput.value;
            const addStart = addStartInput.value;
            const addEnd = addEndInput.value;
            const tags = [];
            const category = [];
            const autogenCollection = (autoGenCollectionSelect === null || autoGenCollectionSelect === void 0 ? void 0 : autoGenCollectionSelect.value) || undefined;
            const autogenStyle = (autoGentStyleSelect === null || autoGentStyleSelect === void 0 ? void 0 : autoGentStyleSelect.value) || undefined;
            for (const divItem of tagsList)
                tags.push(divItem.innerText);
            for (const divItem of categoriesList)
                category.push(divItem.innerText);
            state.editItem.comment = comment;
            if (!state.editItem.comment)
                delete state.editItem.comment;
            const indexInOrigin = collection.findIndex(item => item.id === state.editingPrompt);
            if (indexInOrigin !== -1)
                collection[indexInOrigin] = state.editItem;
            else
                collection.push(state.editItem);
            const collectionPrompt = collection.find(item => item.id === state.editingPrompt);
            if (!collectionPrompt)
                return;
            collectionPrompt.tags = tags;
            collectionPrompt.category = category;
            if (!addAtStart)
                delete collectionPrompt.addAtStart;
            else
                collectionPrompt.addAtStart = addAtStart;
            if (!addAfter)
                delete collectionPrompt.addAfter;
            else
                collectionPrompt.addAfter = addAfter;
            if (!addStart)
                delete collectionPrompt.addStart;
            else
                collectionPrompt.addStart = addStart;
            if (!addEnd)
                delete collectionPrompt.addEnd;
            else
                collectionPrompt.addEnd = addEnd;
            if (autogenStyle && autogenCollection) {
                if (!collectionPrompt.autogen)
                    collectionPrompt.autogen = {};
                collectionPrompt.autogen.collection = autogenCollection;
                collectionPrompt.autogen.style = autogenStyle;
            }
            else
                delete collectionPrompt.autogen;
            index_2.default.saveJSONData(state.editTargetCollection);
            index_2.default.updateMixedList();
            state.editTargetCollection = undefined;
            state.editingPrompt = undefined;
            index_3.default.update();
            index_4.default.update(true);
        }
        static getTargetItem() {
            const { data } = index_2.default;
            const { united } = data;
            const { state } = index_1.default;
            const targetItem = united.find(item => item.id === state.editingPrompt);
            if (!targetItem)
                return false;
            if (!targetItem.collections)
                return false;
            if (!targetItem.collections[0])
                return false;
            if (!targetItem.collections.includes(state.editTargetCollection)) {
                state.editTargetCollection = targetItem.collections[0];
            }
            let collection = data.original[state.editTargetCollection];
            if (!collection)
                return false;
            const originalItem = collection.find(item => item.id === state.editingPrompt);
            if (!originalItem)
                return false;
            state.editItem = JSON.parse(JSON.stringify(originalItem));
            return state.editItem;
        }
        static showAddSetup(wrapper) {
            const targetItem = PromptEdit.getTargetItem();
            if (!targetItem)
                return;
            const { addAtStart = false, addAfter = "", addStart = "", addEnd = "" } = targetItem;
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
        static showAutoGenBlock(wrapper, prompt) {
            if (!wrapper || !prompt)
                return;
            const { data } = index_2.default;
            const { autogen = {} } = prompt;
            const collection = autogen.collection || "__none";
            const autoGenBlock = (0, dom_1.makeElement)({ element: "div", className: "PBE_rowBlock", content: "Autogen:" });
            autoGenBlock.style.height = "40px";
            const colOptions = [{ id: "__none", name: "None" }];
            for (const colId in data.styles)
                colOptions.push({ id: colId, name: colId });
            const stylesCollectionsSelect = (0, dom_1.makeSelect)({
                id: "PBE_autoGentCollection",
                className: "PBE_generalInput",
                value: collection,
                options: colOptions,
                onChange: (e) => PromptEdit.onChangeAutogenCollection(e.currentTarget.value, prompt)
            });
            autoGenBlock.appendChild(stylesCollectionsSelect);
            if (autogen.collection) {
                const targetCollection = data.styles[autogen.collection];
                if (targetCollection) {
                    const styleOptions = [];
                    for (const styleItem of targetCollection)
                        styleOptions.push({ id: styleItem.name, name: styleItem.name });
                    const styleSelect = (0, dom_1.makeSelect)({
                        id: "PBE_autoGentStyle",
                        className: "PBE_generalInput",
                        value: autogen.style || "",
                        options: styleOptions,
                        onChange: (e) => PromptEdit.onChangeAutogenStyle(e.currentTarget.value, prompt)
                    });
                    autoGenBlock.appendChild(styleSelect);
                }
            }
            wrapper.appendChild(autoGenBlock);
        }
        static update(targetItem) {
            const { data } = index_2.default;
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.promptEdit;
            if (!wrapper || !state.editingPrompt)
                return;
            if (!targetItem)
                targetItem = PromptEdit.getTargetItem() || undefined;
            if (!targetItem)
                return;
            index_1.default.onCloseActiveWindow = PromptEdit.onCloseWindow;
            wrapper.innerHTML = "";
            const headerBlock = (0, dom_1.makeElement)({ element: "div", className: "PBE_rowBlock" });
            const headerTitle = (0, dom_1.makeElement)({ element: "div", className: "PBE_promptEditTitle", content: state.editingPrompt });
            headerBlock.appendChild(headerTitle);
            PromptEdit.addCollectionSelector(headerBlock);
            wrapper.style.display = "flex";
            wrapper.style.backgroundImage = index_2.default.getPromptPreviewURL(state.editingPrompt, state.editTargetCollection);
            const currentTagsBlock = (0, dom_1.makeElement)({ element: "div", className: "PBE_rowBlock" });
            const currentCategoriesBlock = (0, dom_1.makeElement)({ element: "div", className: "PBE_rowBlock" });
            const addTagBlock = (0, dom_1.makeElement)({ element: "div", className: "PBE_rowBlock" });
            const addCategoryBlock = (0, dom_1.makeElement)({ element: "div", className: "PBE_rowBlock" });
            const footerBlock = (0, dom_1.makeElement)({ element: "div", className: "PBE_rowBlock" });
            const tagsTitle = (0, dom_1.makeElement)({ element: "div", content: "Tags:" });
            const tagsList = (0, dom_1.makeElement)({ element: "div", className: "PBE_List PBE_Scrollbar PBE_tagsList" });
            const tagInput = (0, dom_1.makeElement)({ element: "input", id: "PBE_addTagInput", className: "PBE_generalInput" });
            const addTagButton = (0, dom_1.makeElement)({ element: "button", content: "Add tag", className: "PBE_button" });
            const categoriesTitle = (0, dom_1.makeElement)({ element: "div", content: "Categories:" });
            const categoriesList = (0, dom_1.makeElement)({ element: "div", className: "PBE_List PBE_Scrollbar PBE_categoryList" });
            const categorySelect = (0, dom_1.makeElement)({ element: "select", id: "PBE_addCategorySelect", className: "PBE_generalInput" });
            const addCategoryButton = (0, dom_1.makeElement)({ element: "button", content: "Add category", className: "PBE_button" });
            const commentArea = (0, dom_1.makeElement)({ element: "textarea", id: "PBE_commentArea", className: "PBE_Textarea PBE_Scrollbar" });
            const cancelButton = (0, dom_1.makeElement)({ element: "button", content: "Cancel", className: "PBE_button PBE_buttonCancel" });
            const saveButton = (0, dom_1.makeElement)({ element: "button", content: "Save", className: "PBE_button" });
            commentArea.value = targetItem.comment || "";
            for (const tagItem of targetItem.tags) {
                const tagElement = document.createElement("div");
                tagElement.className = "PBE_promptEditInfoItem";
                tagElement.innerText = tagItem;
                tagElement.addEventListener("click", (e) => {
                    if (!e.metaKey && !e.ctrlKey)
                        return;
                    const target = e.currentTarget;
                    const tagId = target.innerText;
                    targetItem.tags = targetItem.tags.filter(item => item !== tagId);
                    PromptEdit.update(targetItem);
                });
                tagsList.appendChild(tagElement);
            }
            for (const categoryItem of targetItem.category) {
                const categoryElement = document.createElement("div");
                categoryElement.className = "PBE_promptEditInfoItem";
                categoryElement.innerText = categoryItem;
                categoryElement.addEventListener("click", (e) => {
                    if (!e.metaKey && !e.ctrlKey)
                        return;
                    const target = e.currentTarget;
                    const categoryId = target.innerText;
                    targetItem.category = targetItem.category.filter(item => item !== categoryId);
                    PromptEdit.update(targetItem);
                });
                categoriesList.appendChild(categoryElement);
            }
            const categories = data.categories;
            let options = "";
            for (const categoryItem of categories) {
                if (targetItem.category.includes(categoryItem))
                    continue;
                if (!categorySelect.value)
                    categorySelect.value = categoryItem;
                options += `<option value="${categoryItem}">${categoryItem}</option>`;
            }
            categorySelect.innerHTML = options;
            tagInput.addEventListener("keyup", (e) => {
                const target = e.currentTarget;
                if (e.keyCode !== 13)
                    return;
                if (target.dataset.hint)
                    return;
                PromptEdit.onAddTags(targetItem, tagInput);
            });
            addTagButton.addEventListener("click", (e) => {
                const inputElement = wrapper.querySelector("#PBE_addTagInput");
                if (!inputElement)
                    return;
                PromptEdit.onAddTags(targetItem, inputElement);
            });
            addCategoryButton.addEventListener("click", (e) => {
                const selectElement = wrapper.querySelector("#PBE_addCategorySelect");
                if (!selectElement)
                    return;
                const value = selectElement.value;
                if (targetItem.category.includes(value))
                    return;
                targetItem.category.push(value);
                PromptEdit.update(targetItem);
            });
            commentArea.addEventListener("change", (e) => targetItem.comment = e.currentTarget.value);
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
            if (Object.keys(data.original).length > 1) {
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
            index_5.default.add(tagInput, true);
        }
    }
    exports["default"] = PromptEdit;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/PromptScribe/index.ts":
/*!**************************************!*\
  !*** ./client/PromptScribe/index.ts ***!
  \**************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/KnownPrompts/index */ "./client/KnownPrompts/index.ts"), __webpack_require__(/*! client/CurrentPrompts/index */ "./client/CurrentPrompts/index.ts"), __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts.ts"), __webpack_require__(/*! client/showPromptItem */ "./client/showPromptItem.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4, synchroniseCurrentPrompts_1, showPromptItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class PromptScribe {
        static init(wrapper) {
            const promptScribe = document.createElement("div");
            promptScribe.className = "PBE_generalWindow PBE_promptScribe";
            promptScribe.id = "PBE_promptScribe";
            index_1.default.DOMCache.promptScribe = promptScribe;
            wrapper.appendChild(promptScribe);
            index_1.default.onCloseActiveWindow = PromptScribe.onCloseWindow;
            promptScribe.addEventListener("click", () => {
                index_1.default.onCloseActiveWindow = PromptScribe.onCloseWindow;
            });
        }
        static initButton(positiveWrapper) {
            const { readonly } = index_2.default.meta;
            if (readonly)
                return;
            const addUnknownButton = document.createElement("button");
            addUnknownButton.className = "PBE_actionButton PBE_addUnknownButton";
            addUnknownButton.innerText = "Add Unknown";
            addUnknownButton.addEventListener("click", PromptScribe.onOpenScriber);
            positiveWrapper.appendChild(addUnknownButton);
        }
        static onCloseWindow() {
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.promptScribe;
            if (!wrapper)
                return;
            state.showScriberWindow = undefined;
            wrapper.style.display = "none";
        }
        static onOpenScriber() {
            const { state } = index_1.default;
            (0, synchroniseCurrentPrompts_1.default)();
            state.showScriberWindow = true;
            PromptScribe.update(true);
        }
        static onAddUnknownPrompts() {
            const { data } = index_2.default;
            const { state } = index_1.default;
            let { selectedNewPrompts = [] } = state;
            const activePrompts = index_1.default.getCurrentPrompts();
            if (!state.savePreviewCollection)
                return;
            const targetCollection = data.original[state.savePreviewCollection];
            if (!targetCollection)
                return;
            let newPrompts = false;
            for (const prompt of activePrompts) {
                if (!selectedNewPrompts.includes(prompt.id))
                    continue;
                const known = targetCollection.some(item => item.id === prompt.id);
                if (!known) {
                    if (!newPrompts)
                        newPrompts = true;
                    const targetItem = { id: prompt.id, tags: [], category: [] };
                    if (prompt.isExternalNetwork)
                        targetItem.isExternalNetwork = true;
                    targetCollection.push(targetItem);
                    //removing from the selected
                    selectedNewPrompts = selectedNewPrompts.filter(item => item !== prompt.id);
                }
            }
            if (!newPrompts)
                return;
            state.selectedNewPrompts = selectedNewPrompts;
            index_2.default.saveJSONData(state.savePreviewCollection);
            index_2.default.updateMixedList();
            index_3.default.update();
            index_4.default.update();
            PromptScribe.update();
        }
        static onToggleOnlyNew(e) {
            const { state } = index_1.default;
            const id = "new_in_all_collections";
            if (state.toggledButtons.includes(id)) {
                state.toggledButtons = state.toggledButtons.filter(item => item !== id);
            }
            else {
                state.toggledButtons.push(id);
            }
            PromptScribe.update();
        }
        static onToggleAll(e) {
            const { state } = index_1.default;
            let { selectedNewPrompts = [] } = state;
            if (!selectedNewPrompts.length) {
                PromptScribe.update(true);
                return;
            }
            state.selectedNewPrompts = [];
            PromptScribe.update();
        }
        static showHeader(wrapper) {
            const { data } = index_2.default;
            const { state } = index_1.default;
            const newPromptsHeader = document.createElement("div");
            newPromptsHeader.className = "PBE_newPromptsHeader";
            const toggleOnlyNew = document.createElement("div");
            toggleOnlyNew.className = "PBE_toggleButton";
            toggleOnlyNew.innerText = "All collections";
            toggleOnlyNew.title = "Toggle if only unknown in all collections should be shown or only in the current collection";
            if (state.toggledButtons.includes("new_in_all_collections"))
                toggleOnlyNew.classList.add("PBE_toggledButton");
            toggleOnlyNew.style.height = "24px";
            toggleOnlyNew.addEventListener("click", PromptScribe.onToggleOnlyNew);
            const saveButton = document.createElement("button");
            saveButton.innerText = "Add new prompts";
            saveButton.className = "PBE_button";
            saveButton.addEventListener("click", PromptScribe.onAddUnknownPrompts);
            const toggleAll = document.createElement("button");
            toggleAll.innerText = "Toggle all";
            toggleAll.className = "PBE_button";
            toggleAll.style.marginRight = "10px";
            toggleAll.addEventListener("click", PromptScribe.onToggleAll);
            const collectionSelect = document.createElement("select");
            collectionSelect.className = "PBE_generalInput PBE_select";
            collectionSelect.style.margin = "0 10px";
            collectionSelect.style.height = "30px";
            let options = "";
            for (const collectionId in data.original) {
                if (!state.savePreviewCollection)
                    state.savePreviewCollection = collectionId;
                options += `<option value="${collectionId}">${collectionId}</option>`;
            }
            collectionSelect.innerHTML = options;
            if (state.savePreviewCollection)
                collectionSelect.value = state.savePreviewCollection;
            collectionSelect.addEventListener("change", (e) => {
                const target = e.currentTarget;
                const value = target.value;
                state.savePreviewCollection = value || undefined;
                PromptScribe.update();
            });
            newPromptsHeader.appendChild(toggleAll);
            newPromptsHeader.appendChild(toggleOnlyNew);
            newPromptsHeader.appendChild(collectionSelect);
            newPromptsHeader.appendChild(saveButton);
            wrapper.appendChild(newPromptsHeader);
        }
        static showUnknownPrompts(wrapper, initial = false) {
            const { data } = index_2.default;
            const { state } = index_1.default;
            let { selectedNewPrompts = [], savePreviewCollection, toggledButtons = [] } = state;
            const newInAllCollections = toggledButtons.includes("new_in_all_collections");
            const activePrompts = index_1.default.getCurrentPrompts();
            let database = data.united;
            if (!newInAllCollections && savePreviewCollection && data.original[state.savePreviewCollection]) {
                database = data.original[state.savePreviewCollection];
            }
            if (initial)
                selectedNewPrompts = [];
            let unknownPromptsList = [];
            for (const item of activePrompts) {
                if (item.isSyntax)
                    continue;
                let isKnown = false;
                for (const knownPrompt of database) {
                    if (knownPrompt.id.toLowerCase() === item.id.toLowerCase()) {
                        isKnown = true;
                        break;
                    }
                }
                if (!isKnown) {
                    unknownPromptsList.push(item);
                    if (initial)
                        selectedNewPrompts.push(item.id);
                }
            }
            if (initial)
                state.selectedNewPrompts = selectedNewPrompts;
            const newPromptsContainer = document.createElement("div");
            newPromptsContainer.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
            for (let item of unknownPromptsList) {
                const promptElement = (0, showPromptItem_1.default)({ prompt: item, options: { noSplash: true } });
                promptElement.classList.add("PBE_newElement");
                if (selectedNewPrompts.includes(item.id))
                    promptElement.classList.add("PBE_selectedNewElement");
                newPromptsContainer.appendChild(promptElement);
                promptElement.addEventListener("click", (e) => {
                    const target = e.currentTarget;
                    const id = target.dataset.prompt;
                    if (!id)
                        return;
                    if (selectedNewPrompts.includes(id)) {
                        selectedNewPrompts = selectedNewPrompts.filter(item => item !== id);
                        target.classList.remove("PBE_selectedNewElement");
                    }
                    else {
                        selectedNewPrompts.push(id);
                        target.classList.add("PBE_selectedNewElement");
                    }
                    index_1.default.state.selectedNewPrompts = selectedNewPrompts;
                });
            }
            wrapper.appendChild(newPromptsContainer);
        }
        static update(initial) {
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.promptScribe;
            if (!wrapper)
                return;
            index_1.default.onCloseActiveWindow = PromptScribe.onCloseWindow;
            wrapper.innerHTML = "";
            wrapper.style.display = "flex";
            const footerBlock = document.createElement("div");
            const closeButton = document.createElement("button");
            footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
            closeButton.innerText = "Close";
            closeButton.className = "PBE_button";
            closeButton.addEventListener("click", (e) => {
                state.showScriberWindow = undefined;
                wrapper.style.display = "none";
            });
            PromptScribe.showHeader(wrapper);
            PromptScribe.showUnknownPrompts(wrapper, initial);
            footerBlock.appendChild(closeButton);
            wrapper.appendChild(footerBlock);
        }
    }
    exports["default"] = PromptScribe;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/PromptTools/index.ts":
/*!*************************************!*\
  !*** ./client/PromptTools/index.ts ***!
  \*************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/CurrentPrompts/index */ "./client/CurrentPrompts/index.ts"), __webpack_require__(/*! client/PromptEdit/index */ "./client/PromptEdit/index.ts"), __webpack_require__(/*! client/dom */ "./client/dom.ts"), __webpack_require__(/*! client/showPromptItem */ "./client/showPromptItem.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! client/PromptsFilter/simple */ "./client/PromptsFilter/simple.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4, dom_1, showPromptItem_1, utils_1, const_1, simple_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class PromptTools {
        static init(wrapper) {
            const promptTools = document.createElement("div");
            promptTools.className = "PBE_generalWindow PBE_promptTools";
            promptTools.id = "PBE_promptTools";
            index_1.default.DOMCache.promptTools = promptTools;
            wrapper.appendChild(promptTools);
            index_1.default.onCloseActiveWindow = PromptTools.onCloseWindow;
            promptTools.addEventListener("click", () => {
                index_1.default.onCloseActiveWindow = PromptTools.onCloseWindow;
            });
        }
        static onCloseWindow() {
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.promptTools;
            if (!wrapper)
                return;
            state.promptToolsId = undefined;
            wrapper.style.display = "none";
        }
        static onToggleButton(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            const id = target.dataset.id;
            if (!id)
                return;
            if (state.toggledButtons.includes(id)) {
                state.toggledButtons = state.toggledButtons.filter(item => item !== id);
            }
            else {
                state.toggledButtons.push(id);
            }
            PromptTools.update();
        }
        static onElementClick(e) {
            const target = e.currentTarget;
            const { data } = index_2.default;
            const { united } = data;
            const { state } = index_1.default;
            const currPrompt = state.promptToolsId;
            const clickPrompt = target.dataset.prompt;
            if (!currPrompt || !clickPrompt)
                return;
            const replaceMode = state.toggledButtons.includes("tools_replaceMode");
            let activePrompts = index_1.default.getCurrentPrompts();
            let activePrompt = undefined;
            let selectedPrompt = activePrompts.find(item => item.id === clickPrompt);
            if (!selectedPrompt) {
                selectedPrompt = united.find(item => item.id === clickPrompt);
            }
            if (!selectedPrompt)
                return;
            const currTargetIndex = activePrompts.findIndex(item => {
                if (item.id === currPrompt) {
                    activePrompt = item;
                    return true;
                }
            });
            const clickTargetIndex = activePrompts.findIndex(item => item.id === clickPrompt);
            if (currTargetIndex === -1)
                return;
            if (clickTargetIndex !== -1) {
                if (e.metaKey || e.ctrlKey) {
                    activePrompts = activePrompts.filter(item => item.id !== clickPrompt);
                    index_1.default.setCurrentPrompts(activePrompts);
                }
                else if (e.shiftKey) {
                    state.editingPrompt = clickPrompt;
                    index_4.default.update();
                }
                else {
                    state.promptToolsId = clickPrompt;
                }
                PromptTools.update();
                index_3.default.update();
                return;
            }
            const newItem = {
                id: clickPrompt,
                weight: const_1.DEFAULT_PROMPT_WEIGHT,
                isExternalNetwork: selectedPrompt.isExternalNetwork
            };
            let action = "";
            if (e.shiftKey) {
                state.editingPrompt = clickPrompt;
                index_4.default.update();
            }
            else {
                if (replaceMode)
                    action = e.altKey ? "add" : "replace";
                else
                    action = e.altKey ? "replace" : "add";
            }
            if (action === "add")
                activePrompts.splice(currTargetIndex, 0, newItem);
            else if (action === "replace") {
                if (activePrompt && activePrompt.weight !== undefined)
                    newItem.weight = activePrompt.weight;
                activePrompts[currTargetIndex] = newItem;
                state.promptToolsId = clickPrompt;
            }
            PromptTools.update();
            index_3.default.update();
        }
        static showCurrentPrompts(wrapper) {
            const { data } = index_2.default;
            const { state } = index_1.default;
            const { currentFilters } = PromptTools;
            const { checkFilter } = simple_1.default;
            const { sorting } = currentFilters;
            const { unitedList } = data;
            const activePrompts = [...index_1.default.getCurrentPrompts()];
            if (!state.promptToolsId)
                return;
            const setupContainer = (0, dom_1.makeElement)({ element: "div", className: "PBE_List PBE_toolsSetup" });
            const currentPromptsContainer = (0, dom_1.makeElement)({ element: "div", className: "PBE_windowCurrentList PBE_Scrollbar" });
            //setup fieldset
            const setupField = (0, dom_1.makeElement)({ element: "fieldset", className: "PBE_fieldset" });
            const setupLegend = (0, dom_1.makeElement)({ element: "legend", content: "Setup" });
            const showAll = (0, dom_1.makeElement)({ element: "div", content: "Show All", className: "PBE_toggleButton" });
            const replaceMode = (0, dom_1.makeElement)({ element: "div", content: "Replace mode", className: "PBE_toggleButton" });
            showAll.dataset.id = "tools_showAll";
            replaceMode.dataset.id = "tools_replaceMode";
            if (state.toggledButtons.includes("tools_showAll"))
                showAll.classList.add("PBE_toggledButton");
            if (state.toggledButtons.includes("tools_replaceMode"))
                replaceMode.classList.add("PBE_toggledButton");
            showAll.addEventListener("click", PromptTools.onToggleButton);
            replaceMode.addEventListener("click", PromptTools.onToggleButton);
            setupField.appendChild(setupLegend);
            setupField.appendChild(showAll);
            setupField.appendChild(replaceMode);
            //similarity fieldset
            const simField = (0, dom_1.makeElement)({ element: "fieldset", className: "PBE_fieldset" });
            const simLegend = (0, dom_1.makeElement)({ element: "legend", content: "Similarity by:" });
            const showTags = (0, dom_1.makeElement)({ element: "div", content: "Tags", className: "PBE_toggleButton" });
            const showCategory = (0, dom_1.makeElement)({ element: "div", content: "Category", className: "PBE_toggleButton" });
            const showName = (0, dom_1.makeElement)({ element: "div", content: "Name", className: "PBE_toggleButton" });
            simField.appendChild(simLegend);
            simField.appendChild(showTags);
            simField.appendChild(showCategory);
            simField.appendChild(showName);
            showTags.dataset.id = "tools_tags";
            showCategory.dataset.id = "tools_category";
            showName.dataset.id = "tools_name";
            if (state.toggledButtons.includes("tools_tags"))
                showTags.classList.add("PBE_toggledButton");
            if (state.toggledButtons.includes("tools_category"))
                showCategory.classList.add("PBE_toggledButton");
            if (state.toggledButtons.includes("tools_name"))
                showName.classList.add("PBE_toggledButton");
            showTags.addEventListener("click", PromptTools.onToggleButton);
            showCategory.addEventListener("click", PromptTools.onToggleButton);
            showName.addEventListener("click", PromptTools.onToggleButton);
            switch (sorting) {
                case "alph":
                    //sorting prompts alphabetically
                    activePrompts.sort((A, B) => {
                        if (A.id.toLowerCase() < B.id.toLowerCase())
                            return -1;
                        if (A.id.toLowerCase() > B.id.toLowerCase())
                            return 1;
                        return 0;
                    });
                    break;
                case "alphReversed":
                    //sorting prompts alphabetically in reverse orderd
                    activePrompts.sort((A, B) => {
                        if (A.id.toLowerCase() < B.id.toLowerCase())
                            return 1;
                        if (A.id.toLowerCase() > B.id.toLowerCase())
                            return -1;
                        return 0;
                    });
                    break;
                case "weight":
                    //sorting prompts based on their weight
                    activePrompts.sort((A, B) => {
                        if (A.weight < B.weight)
                            return 1;
                        if (A.weight > B.weight)
                            return -1;
                        return 0;
                    });
            }
            for (const i in activePrompts) {
                const currPrompt = activePrompts[i];
                if (!currPrompt || currPrompt.isSyntax)
                    continue;
                if (unitedList[currPrompt.id] && !checkFilter(currPrompt.id, currentFilters))
                    continue;
                const isShadowed = currPrompt.id !== state.promptToolsId;
                const promptElement = (0, showPromptItem_1.default)({
                    prompt: { id: currPrompt.id, isExternalNetwork: currPrompt.isExternalNetwork },
                    options: { isShadowed },
                });
                promptElement.addEventListener("click", PromptTools.onElementClick);
                currentPromptsContainer.appendChild(promptElement);
            }
            currentPromptsContainer.addEventListener("wheel", (e) => {
                const target = e.currentTarget;
                if (!e.deltaY)
                    return;
                target.scrollLeft += e.deltaY + e.deltaX;
                e.preventDefault();
            });
            setupContainer.appendChild(setupField);
            setupContainer.appendChild(simField);
            wrapper.appendChild(currentPromptsContainer);
            wrapper.appendChild(setupContainer);
        }
        static showPossiblePromptswrapper(wrapper) {
            const { data } = index_2.default;
            const { united } = data;
            const { state } = index_1.default;
            const { maxCardsShown = 1000 } = state.config;
            const { possibleFilters } = PromptTools;
            const { sorting } = possibleFilters;
            const { checkFilter } = simple_1.default;
            const promptId = state.promptToolsId;
            const activePrompts = index_1.default.getCurrentPrompts();
            const showAll = state.toggledButtons.includes("tools_showAll");
            if (!promptId)
                return;
            let targetTags = [];
            let targetCategories = [];
            let targetNameWords = (0, utils_1.replaceAllRegex)(promptId.toLowerCase(), "_", " ").split(" ");
            let shownItems = 0;
            const targetPromptItem = united.find(item => item.id === promptId);
            if (targetPromptItem) {
                targetTags = targetPromptItem.tags || [];
                targetCategories = targetPromptItem.category || [];
            }
            const nameArr = promptId.split(" ");
            const possiblePrompts = [];
            const addedIds = [];
            for (const index in united) {
                const item = united[index];
                if (shownItems > maxCardsShown)
                    break;
                const { id, tags, category } = item;
                if (!checkFilter(id, possibleFilters))
                    continue;
                //similarity index based on the same tags, categories and words used in the prompt name
                let simIndex = 0;
                if (id === promptId)
                    continue;
                let nameWords = (0, utils_1.replaceAllRegex)(id.toLowerCase(), "_", " ").split(" ");
                if (state.toggledButtons.includes("tools_tags"))
                    targetTags.forEach(tagItem => { if (tags.includes(tagItem))
                        simIndex++; });
                if (state.toggledButtons.includes("tools_category"))
                    targetCategories.forEach(catItem => { if (category.includes(catItem))
                        simIndex++; });
                if (state.toggledButtons.includes("tools_name"))
                    targetNameWords.forEach(wordItem => { if (nameWords.includes(wordItem))
                        simIndex++; });
                if (showAll) {
                    possiblePrompts.push(Object.assign(Object.assign({}, item), { simIndex }));
                    shownItems++;
                    continue;
                }
                if (state.toggledButtons.includes("tools_tags") && targetTags.length) {
                    targetTags.some(targetTag => {
                        if (tags.includes(targetTag)) {
                            possiblePrompts.push(Object.assign(Object.assign({}, item), { simIndex }));
                            shownItems++;
                            return true;
                        }
                    });
                }
                if (state.toggledButtons.includes("tools_category") && targetCategories.length) {
                    targetCategories.some(targetCategory => {
                        if (category.includes(targetCategory)) {
                            possiblePrompts.push(Object.assign(Object.assign({}, item), { simIndex }));
                            shownItems++;
                            return true;
                        }
                    });
                }
                if (state.toggledButtons.includes("tools_name")) {
                    const itemNameArr = id.split(" ");
                    wordLoop: for (const word of nameArr) {
                        for (const itemWord of itemNameArr) {
                            if (itemWord.toLowerCase().includes(word.toLowerCase())) {
                                possiblePrompts.push(Object.assign(Object.assign({}, item), { simIndex }));
                                shownItems++;
                                break wordLoop;
                            }
                        }
                    }
                }
            }
            ;
            switch (sorting) {
                case "__none": break;
                case "alph":
                    //sorting possible prompts alphabetically
                    possiblePrompts.sort((A, B) => {
                        if (A.id.toLowerCase() < B.id.toLowerCase())
                            return -1;
                        if (A.id.toLowerCase() > B.id.toLowerCase())
                            return 1;
                        return 0;
                    });
                    break;
                case "alphReversed":
                    //sorting possible prompts alphabetically in reverse orderd
                    possiblePrompts.sort((A, B) => {
                        if (A.id.toLowerCase() < B.id.toLowerCase())
                            return 1;
                        if (A.id.toLowerCase() > B.id.toLowerCase())
                            return -1;
                        return 0;
                    });
                    break;
                default:
                case "sim":
                    //sorting possible prompts based on their similarity to the selected prompt
                    possiblePrompts.sort((A, B) => {
                        if (A.simIndex < B.simIndex)
                            return 1;
                        if (A.simIndex > B.simIndex)
                            return -1;
                        if (A.id.toLowerCase() < B.id.toLowerCase())
                            return -1;
                        if (A.id.toLowerCase() > B.id.toLowerCase())
                            return 1;
                        return 0;
                    });
            }
            function addElement(item) {
                if (addedIds.includes(item.id))
                    return;
                const isShadowed = activePrompts.some(currItem => currItem.id === item.id);
                addedIds.push(item.id);
                const promptElement = (0, showPromptItem_1.default)({ prompt: item, options: { isShadowed } });
                promptElement.addEventListener("click", PromptTools.onElementClick);
                wrapper.appendChild(promptElement);
            }
            for (const item of possiblePrompts)
                addElement(item);
        }
        static update() {
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.promptTools;
            if (!wrapper || !state.promptToolsId)
                return;
            index_1.default.onCloseActiveWindow = PromptTools.onCloseWindow;
            let currScrollState = 0;
            let prevPromptContainer = wrapper.querySelector(".PBE_windowCurrentList");
            if (prevPromptContainer) {
                currScrollState = prevPromptContainer.scrollLeft;
                prevPromptContainer = undefined;
            }
            wrapper.innerHTML = "";
            wrapper.style.display = "flex";
            const backImage = document.createElement("div");
            backImage.style.backgroundImage = index_2.default.getPromptPreviewURL(state.promptToolsId);
            backImage.className = "PBE_toolsBackImage";
            const currentFilterBlock = document.createElement("div");
            const possibleFilterBlock = document.createElement("div");
            const currentPromptsBlock = document.createElement("div");
            const possiblePromptsBlock = document.createElement("div");
            const footerBlock = document.createElement("div");
            const closeButton = document.createElement("button");
            footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_toolsFooter";
            currentFilterBlock.className = "PBE_dataBlock PBE_toolsFilter";
            possibleFilterBlock.className = "PBE_dataBlock PBE_toolsFilter";
            currentPromptsBlock.className = "PBE_dataBlock PBE_toolsHeader";
            possiblePromptsBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
            closeButton.innerText = "Close";
            closeButton.className = "PBE_button";
            simple_1.default.show(currentFilterBlock, PromptTools.currentFilters, PromptTools.update);
            PromptTools.showCurrentPrompts(currentPromptsBlock);
            simple_1.default.show(possibleFilterBlock, PromptTools.possibleFilters, PromptTools.update);
            PromptTools.showPossiblePromptswrapper(possiblePromptsBlock);
            closeButton.addEventListener("click", PromptTools.onCloseWindow);
            footerBlock.appendChild(closeButton);
            wrapper.appendChild(backImage);
            wrapper.appendChild(currentFilterBlock);
            wrapper.appendChild(currentPromptsBlock);
            wrapper.appendChild(possibleFilterBlock);
            wrapper.appendChild(possiblePromptsBlock);
            wrapper.appendChild(footerBlock);
            let currentPromptsContainer = currentPromptsBlock.querySelector(".PBE_windowCurrentList");
            if (currentPromptsContainer) {
                currentPromptsContainer.scrollTo(currScrollState, 0);
                currentPromptsContainer = undefined;
            }
        }
    }
    PromptTools.currentFilters = {
        collection: "",
        category: "",
        tags: [],
        name: "",
        sorting: "__none",
        sortingOptions: [
            { id: "__none", name: "Unsorted" },
            { id: "weight", name: "By weight" },
            { id: "alph", name: "Alphabetical" },
            { id: "alphReversed", name: "Alphabetical reversed" },
        ]
    };
    PromptTools.possibleFilters = {
        collection: "",
        category: "",
        tags: [],
        name: "",
        sorting: "sim",
        sortingOptions: [
            { id: "__none", name: "Unsorted" },
            { id: "sim", name: "By similarity" },
            { id: "alph", name: "Alphabetical" },
            { id: "alphReversed", name: "Alphabetical reversed" },
        ]
    };
    exports["default"] = PromptTools;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/PromptWordTooltip/index.ts":
/*!*******************************************!*\
  !*** ./client/PromptWordTooltip/index.ts ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts"), __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts.ts"), __webpack_require__(/*! client/applyStyle */ "./client/applyStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, utils_1, synchroniseCurrentPrompts_1, applyStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Prompt autocomplite tooltip window
     */
    class PromptWordTooltip {
        static init(positivePrompts, containerId) {
            if (!positivePrompts)
                return;
            const textArea = positivePrompts.querySelector("textarea");
            if (!textArea)
                return;
            const autocompliteWindow = document.createElement("div");
            autocompliteWindow.className = "PBE_autocompliteBox";
            positivePrompts.style.position = "relative";
            positivePrompts.appendChild(autocompliteWindow);
            index_1.default.DOMCache.containers[containerId].autocompliteWindow = autocompliteWindow;
            textArea.addEventListener("keydown", PromptWordTooltip.onKeyDown);
            textArea.addEventListener("blur", PromptWordTooltip.onUnfocus);
            textArea.addEventListener("keyup", PromptWordTooltip.processCarretPosition);
            textArea.addEventListener("click", PromptWordTooltip.processCarretPosition);
        }
        static onKeyDown(e) {
            const { autocomplitePromptMode = "prompts" } = index_1.default.state.config;
            if (autocomplitePromptMode === "off")
                return;
            const { state } = index_1.default;
            const autoCompleteBox = index_1.default.DOMCache.containers[state.currentContainer].autocompliteWindow;
            if (!autoCompleteBox)
                return;
            if (autoCompleteBox.style.display === "none")
                return;
            if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13)
                return;
            const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
            if (!hintElements || !hintElements.length)
                return;
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        static onUnfocus(e) {
            const { autocomplitePromptMode = "prompts" } = index_1.default.state.config;
            if (autocomplitePromptMode === "off")
                return;
            const { state } = index_1.default;
            const autoCompleteBox = index_1.default.DOMCache.containers[state.currentContainer].autocompliteWindow;
            if (!autoCompleteBox)
                return;
            if (autoCompleteBox.style.display === "none")
                return;
            clearTimeout(PromptWordTooltip.unfocusTimeout);
            PromptWordTooltip.unfocusTimeout = setTimeout(() => {
                autoCompleteBox.style.display = "none";
                autoCompleteBox.innerHTML = "";
            }, 400);
        }
        static onHintWindowKey(e) {
            const { state } = index_1.default;
            const autoCompleteBox = index_1.default.DOMCache.containers[state.currentContainer].autocompliteWindow;
            if (!autoCompleteBox)
                return false;
            if (autoCompleteBox.style.display === "none")
                return false;
            if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13)
                return false;
            const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
            if (!hintElements || !hintElements.length)
                return false;
            if (e.keyCode === 13) {
                const selectedHint = autoCompleteBox.querySelector(".PBE_hintItemSelected");
                if (!selectedHint)
                    return false;
                const start = Number(selectedHint.dataset.start);
                const end = Number(selectedHint.dataset.end);
                const newPrompt = selectedHint.innerText;
                const collection = selectedHint.dataset.collection;
                const style = selectedHint.dataset.style;
                if (Number.isNaN(start) || Number.isNaN(end))
                    return;
                if (style)
                    PromptWordTooltip.onApplyStyleHint(start, end, style, collection);
                else
                    PromptWordTooltip.onApplyHint(start, end, newPrompt);
                return true;
            }
            const isDown = e.keyCode == 40;
            if (isDown)
                PromptWordTooltip.selectedIndex++;
            else
                PromptWordTooltip.selectedIndex--;
            if (PromptWordTooltip.selectedIndex < 0)
                PromptWordTooltip.selectedIndex = hintElements.length - 1;
            else if (PromptWordTooltip.selectedIndex > hintElements.length - 1)
                PromptWordTooltip.selectedIndex = 0;
            for (let i = 0; i < hintElements.length; i++) {
                const element = hintElements[i];
                if (i === PromptWordTooltip.selectedIndex)
                    element.classList.add("PBE_hintItemSelected");
                else
                    element.classList.remove("PBE_hintItemSelected");
            }
            return true;
        }
        static onClickHint(e) {
            const { state } = index_1.default;
            const autoCompleteBox = index_1.default.DOMCache.containers[state.currentContainer].autocompliteWindow;
            const textArea = index_1.default.DOMCache.containers[state.currentContainer].textArea;
            if (!textArea || !autoCompleteBox)
                return;
            const target = e.currentTarget;
            if (!target)
                return;
            const start = Number(target.dataset.start);
            const end = Number(target.dataset.end);
            const collection = target.dataset.collection;
            const style = target.dataset.style;
            const newPrompt = target.innerText;
            if (Number.isNaN(start) || Number.isNaN(end))
                return;
            if (style)
                PromptWordTooltip.onApplyStyleHint(start, end, style, collection);
            else
                PromptWordTooltip.onApplyHint(start, end, newPrompt);
        }
        static filterNewPromptsOnly(str) {
            if (!str)
                return "";
            const newStrPromptsArr = [];
            const activePrompts = index_1.default.getCurrentPrompts();
            const newArr = str.split(",");
            for (let prompt of newArr) {
                const newPrompt = (0, utils_1.promptStringToObject)({ prompt });
                if (activePrompts.some(item => item.id === newPrompt.id))
                    continue;
                newStrPromptsArr.push(prompt);
            }
            return newStrPromptsArr.join(", ");
        }
        static onApplyStyleHint(start, end, style, collection) {
            const { state } = index_1.default;
            const { data } = index_2.default;
            const autoCompleteBox = index_1.default.DOMCache.containers[state.currentContainer].autocompliteWindow;
            const textArea = index_1.default.DOMCache.containers[state.currentContainer].textArea;
            if (!textArea || !autoCompleteBox)
                return;
            if (!style || !collection)
                return;
            const targetCollection = data.styles[collection];
            if (!targetCollection)
                return;
            const targetStyle = targetCollection.find(item => item.name === style);
            if (!targetStyle)
                return;
            autoCompleteBox.style.display = "none";
            let newValue = "";
            const prefix = textArea.value.substring(0, start);
            const postfix = textArea.value.substring(end);
            newValue += prefix;
            newValue += postfix;
            textArea.value = newValue;
            PromptWordTooltip.selectedIndex = 0;
            (0, synchroniseCurrentPrompts_1.default)(false);
            (0, applyStyle_1.default)(targetStyle, true, false);
        }
        static onApplyHint(start, end, newPrompt) {
            const { filterNewPromptsOnly } = PromptWordTooltip;
            const { united } = index_2.default.data;
            const { state } = index_1.default;
            const autoCompleteBox = index_1.default.DOMCache.containers[state.currentContainer].autocompliteWindow;
            const textArea = index_1.default.DOMCache.containers[state.currentContainer].textArea;
            if (!textArea || !autoCompleteBox)
                return;
            const targetItem = united.find(item => item.id === newPrompt);
            autoCompleteBox.style.display = "none";
            let newValue = "";
            const addAfter = targetItem && targetItem.addAfter ? filterNewPromptsOnly(targetItem.addAfter) : "";
            const addStart = targetItem && targetItem.addStart ? filterNewPromptsOnly(targetItem.addStart) : "";
            const addEnd = targetItem && targetItem.addEnd ? filterNewPromptsOnly(targetItem.addEnd) : "";
            if (targetItem && targetItem.addAtStart) {
                const oldValue = textArea.value.substring(0, start) + textArea.value.substring(end);
                if (targetItem.isExternalNetwork)
                    newPrompt = `<${newPrompt}>`;
                if (addAfter)
                    newPrompt += ", " + addAfter + ", ";
                newValue += newPrompt;
                if (addStart)
                    newValue += addStart + ", ";
                newValue += oldValue;
                if (addEnd)
                    newValue += addEnd;
            }
            else {
                const prefix = textArea.value.substring(0, start);
                const postfix = textArea.value.substring(end);
                if (addStart)
                    newValue += addStart + ", ";
                if (prefix)
                    newValue += prefix + " ";
                if (targetItem) {
                    if (targetItem.isExternalNetwork)
                        newPrompt = `<${newPrompt}>`;
                    if (addAfter)
                        newPrompt += ", " + addAfter;
                    newValue += newPrompt;
                }
                else
                    newValue += newPrompt;
                if (postfix)
                    newValue += postfix;
                else
                    newValue += ", ";
                if (addEnd)
                    newValue += addEnd;
            }
            textArea.value = newValue;
            PromptWordTooltip.selectedIndex = 0;
            (0, synchroniseCurrentPrompts_1.default)(false);
        }
        static getPossiblePrompts(word) {
            const promptsList = index_2.default.data.united;
            const possiblePrompts = [];
            for (const prompt of promptsList) {
                if (!prompt.id)
                    continue;
                if (prompt.id.toLowerCase().includes(word))
                    possiblePrompts.push(prompt.id);
            }
            possiblePrompts.sort();
            return possiblePrompts;
        }
        static getPossibleStyles(word) {
            const MAX_STYLES = 5;
            const IGNORED_COLLECTIONS = ["autogen"];
            const { styles } = index_2.default.data;
            const possibleStyles = [];
            let addedStyles = 0;
            topLoop: for (const collectionId in styles) {
                if (IGNORED_COLLECTIONS.includes(collectionId))
                    continue;
                for (let i = 0; i < styles[collectionId].length; i++) {
                    const styleItem = styles[collectionId][i];
                    if (!styleItem.name)
                        continue;
                    if (styleItem.name.toLowerCase().includes(word)) {
                        possibleStyles.push({ collection: collectionId, name: styleItem.name });
                        addedStyles++;
                    }
                    if (addedStyles > MAX_STYLES)
                        break topLoop;
                }
            }
            possibleStyles.sort((A, B) => {
                if (A.name > B.name)
                    return 1;
                if (A.name < B.name)
                    return -1;
                return 0;
            });
            return possibleStyles;
        }
        static processCarretPosition(e) {
            const target = e.currentTarget;
            const { autocomplitePromptMode = "prompts" } = index_1.default.state.config;
            if (autocomplitePromptMode === "off")
                return;
            const doc = index_1.default.gradioApp();
            const activeElement = doc.activeElement || document.activeElement;
            const textArea = target;
            const isFocused = activeElement === textArea;
            if (!isFocused)
                return;
            clearTimeout(PromptWordTooltip.unfocusTimeout);
            if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
                const block = PromptWordTooltip.onHintWindowKey(e);
                if (block) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }
            }
            const { selectedIndex = 0 } = PromptWordTooltip;
            const { state } = index_1.default;
            if (!index_2.default.data || !index_2.default.data.united)
                return;
            const autoCompleteBox = index_1.default.DOMCache.containers[state.currentContainer].autocompliteWindow;
            if (!autoCompleteBox)
                return;
            autoCompleteBox.innerHTML = "";
            const MAX_HINTS = 20;
            let currHints = 0;
            const value = textArea.value;
            const caret = textArea.selectionStart;
            const stopSymbols = [",", "(", ")", "<", ">", ":", "|", "{", "}"];
            const textAreaPosition = textArea.getBoundingClientRect();
            let position = caret;
            let word = "";
            let wordStart = caret;
            let wordEnd = caret;
            while (value[position]) {
                if (value[position] && stopSymbols.includes(value[position]))
                    break;
                word += value[position];
                position++;
                wordEnd = position;
            }
            position = caret - 1;
            while (value[position]) {
                if (value[position] && stopSymbols.includes(value[position]))
                    break;
                word = value[position] + word;
                wordStart = position;
                position--;
            }
            word = word.trim();
            if (!word)
                return;
            word = word.toLowerCase();
            const showPrompts = autocomplitePromptMode === "prompts" || autocomplitePromptMode === "all";
            const showStyles = autocomplitePromptMode === "styles" || autocomplitePromptMode === "all";
            const possiblePrompts = showPrompts ? PromptWordTooltip.getPossiblePrompts(word) : [];
            const possibleStyles = showStyles ? PromptWordTooltip.getPossibleStyles(word) : [];
            let haveAnyHints = false;
            if (possiblePrompts.length > 1 || (possiblePrompts.length === 1 && word !== possiblePrompts[0]))
                haveAnyHints = true;
            if (possibleStyles.length)
                haveAnyHints = true;
            if (!haveAnyHints) {
                autoCompleteBox.style.display = "none";
                return;
            }
            else
                autoCompleteBox.style.display = "";
            if (showPrompts)
                for (const item of possiblePrompts) {
                    if (currHints >= MAX_HINTS)
                        break;
                    const hintItem = document.createElement("div");
                    hintItem.className = "PBE_hintItem";
                    hintItem.innerText = item;
                    hintItem.dataset.start = wordStart + "";
                    hintItem.dataset.end = wordEnd + "";
                    if (currHints === selectedIndex)
                        hintItem.classList.add("PBE_hintItemSelected");
                    hintItem.addEventListener("click", PromptWordTooltip.onClickHint);
                    autoCompleteBox.appendChild(hintItem);
                    currHints++;
                }
            if (showStyles)
                for (const item of possibleStyles) {
                    if (currHints >= MAX_HINTS)
                        break;
                    const hintItem = document.createElement("div");
                    hintItem.className = "PBE_hintItem";
                    hintItem.innerText = "Style: " + item.name;
                    hintItem.dataset.collection = item.collection;
                    hintItem.dataset.style = item.name;
                    hintItem.dataset.start = wordStart + "";
                    hintItem.dataset.end = wordEnd + "";
                    if (currHints === selectedIndex)
                        hintItem.classList.add("PBE_hintItemSelected");
                    hintItem.addEventListener("click", PromptWordTooltip.onClickHint);
                    autoCompleteBox.appendChild(hintItem);
                    currHints++;
                }
            const caretePos = getCaretCoordinates(textArea, caret);
            if (caretePos) {
                autoCompleteBox.style.bottom = textAreaPosition.height + "px";
                autoCompleteBox.style.left = caretePos.left + 10 + "px";
            }
        }
    }
    PromptWordTooltip.selectedIndex = 0;
    PromptWordTooltip.unfocusTimeout = 0;
    exports["default"] = PromptWordTooltip;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/PromptsFilter/index.ts":
/*!***************************************!*\
  !*** ./client/PromptsFilter/index.ts ***!
  \***************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/CollectionTools/index */ "./client/CollectionTools/index.ts"), __webpack_require__(/*! client/TagTooltip/index */ "./client/TagTooltip/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class PromptsFilter {
        static onAddNewFilter(e) {
            const { promptsFilter } = index_1.default.state;
            const target = e.currentTarget;
            if (!target || !target.dataset.id)
                return;
            const parent = target.parentElement;
            if (!parent)
                return;
            if (target.innerText === "+") {
                const cancelButton = parent.querySelector(".PBE_filtersRemoveNew");
                const newFilterContainer = parent.querySelector(".PBE_newFilterContainer");
                if (!cancelButton || !newFilterContainer)
                    return;
                target.innerText = "✓";
                cancelButton.style.display = "flex";
                newFilterContainer.style.display = "flex";
                return;
            }
            const filterTypeSelector = target.parentElement.querySelector(".PBE_filterType");
            const filterActionElement = target.parentElement.querySelector(".PBE_filterAction");
            if (!filterTypeSelector || !filterTypeSelector.value)
                return;
            if (!filterActionElement || !filterActionElement.dataset.action)
                return;
            const id = target.dataset.id;
            const action = filterActionElement.dataset.action;
            const type = filterTypeSelector.value;
            let value = "";
            if (type === "meta") {
                const metaSelector = target.parentElement.querySelector(".PBE_filterMeta");
                if (!metaSelector || !metaSelector.value)
                    return;
                value = metaSelector.value;
            }
            else if (type === "category") {
                const categorySelector = target.parentElement.querySelector(".PBE_filterCategory");
                if (!categorySelector || !categorySelector.value)
                    return;
                value = categorySelector.value;
            }
            else {
                const nameInput = target.parentElement.querySelector(".PBE_filterName");
                if (!nameInput || !nameInput.value)
                    return;
                value = nameInput.value;
            }
            if (!promptsFilter[id])
                promptsFilter[id] = [];
            promptsFilter[id].push({ action, type: type, value });
            index_3.default.update();
        }
        static onHideNewFilter(e) {
            const target = e.currentTarget;
            if (!target)
                return;
            const parent = target.parentElement;
            if (!parent)
                return;
            const addButton = parent.querySelector(".PBE_filtersAddNewButton");
            const newFilterContainer = parent.querySelector(".PBE_newFilterContainer");
            if (!addButton || !newFilterContainer)
                return;
            addButton.innerText = "+";
            target.style.display = "none";
            newFilterContainer.style.display = "none";
        }
        static onRemoveFilter(e) {
            const { promptsFilter } = index_1.default.state;
            const target = e.currentTarget;
            const id = target.dataset.id;
            const index = Number(target.dataset.index);
            if (!id || Number.isNaN(index))
                return;
            if (!promptsFilter[id])
                return;
            promptsFilter[id].splice(index, 1);
            index_3.default.update();
        }
        static showActiveFilters(wrapper, filterId) {
            const { promptsFilter = {} } = index_1.default.state;
            const filterSetup = promptsFilter[filterId];
            if (!filterSetup)
                return;
            for (let i = 0; i < filterSetup.length; i++) {
                const filterItem = filterSetup[i];
                const { action, type, value } = filterItem;
                const isInclude = action === "include";
                const filterElement = document.createElement("div");
                filterElement.className = "PBE_filterItem";
                if (!isInclude)
                    filterElement.className += " PBE_filterItemNegative";
                filterElement.innerText = action === "include" ? "+" : "-";
                filterElement.innerText += `${type}: ${value}`;
                const removeButton = document.createElement("div");
                removeButton.className = "PBE_filterItemRemove PBE_buttonCancel";
                removeButton.innerText = "✕";
                removeButton.dataset.id = filterId;
                removeButton.dataset.index = i + "";
                removeButton.addEventListener("click", PromptsFilter.onRemoveFilter);
                filterElement.appendChild(removeButton);
                wrapper.appendChild(filterElement);
            }
        }
        static update(wrapper, filterId) {
            if (!wrapper || !filterId)
                return;
            const { promptsFilter } = index_1.default.state;
            wrapper.innerHTML = "";
            const filtersContainer = document.createElement("div");
            filtersContainer.className = "PBE_filtersWrapper";
            const addFilterButton = document.createElement("div");
            addFilterButton.className = "PBE_filtersAddNew PBE_filtersAddNewButton";
            addFilterButton.dataset.id = filterId;
            addFilterButton.innerText = "✓";
            const cancelButton = document.createElement("div");
            cancelButton.className = "PBE_filtersAddNew PBE_filtersRemoveNew .PBE_buttonCancel";
            cancelButton.innerText = "✕";
            const newFilterContainer = document.createElement("div");
            newFilterContainer.className = "PBE_row PBE_newFilterContainer";
            const activeFilters = document.createElement("div");
            activeFilters.className = "PBE_row";
            activeFilters.style.flexWrap = "wrap";
            const actionButton = document.createElement("div");
            actionButton.className = "PBE_filterAction";
            actionButton.innerText = "Include";
            actionButton.dataset.action = "include";
            const typeSelect = document.createElement("select");
            typeSelect.className = "PBE_generalInput PBE_select PBE_filterType";
            typeSelect.style.margin = "0 5px";
            typeSelect.innerHTML = `
            <option value="name">Name</option>
            <option value="tag">Tag</option>
            <option value="category">Category</option>
            <option value="meta">Meta</option>
        `;
            const addionalSetup = document.createElement("div");
            actionButton.addEventListener("click", (e) => {
                const target = e.currentTarget;
                const action = target.dataset.action;
                if (action === "include") {
                    target.dataset.action = "exclude";
                    target.innerText = "Exclude";
                }
                else {
                    target.dataset.action = "include";
                    target.innerText = "Include";
                }
            });
            typeSelect.addEventListener("change", (e) => {
                const target = e.currentTarget;
                const value = target.value;
                PromptsFilter.updateAdditionalSetup(addionalSetup, value, addFilterButton);
            });
            addFilterButton.addEventListener("click", PromptsFilter.onAddNewFilter);
            cancelButton.addEventListener("click", PromptsFilter.onHideNewFilter);
            PromptsFilter.showActiveFilters(activeFilters, filterId);
            PromptsFilter.updateAdditionalSetup(addionalSetup, "name", addFilterButton);
            newFilterContainer.appendChild(actionButton);
            newFilterContainer.appendChild(typeSelect);
            newFilterContainer.appendChild(addionalSetup);
            filtersContainer.appendChild(activeFilters);
            filtersContainer.appendChild(newFilterContainer);
            filtersContainer.appendChild(addFilterButton);
            filtersContainer.appendChild(cancelButton);
            wrapper.appendChild(filtersContainer);
        }
        static updateAdditionalSetup(wrapper, type, addFilterButton) {
            wrapper.innerHTML = "";
            if (type === "meta") {
                const metaSelect = document.createElement("select");
                metaSelect.className = "PBE_generalInput PBE_select PBE_filterMeta";
                metaSelect.innerHTML = `
                <option value="preview">Have preview image</option>
                <option value="categories">Have categories</option>
                <option value="categories3">Have at least 3 categories</option>
                <option value="tags">Have tags</option>
                <option value="tags3">Have at least 3 tags</option>
                <option value="comment">Have comment</option>
                <option value="comment">comment</option>
                <option value="autogen">Have autogen style</option>
                <option value="png">Is PNG</option>
                <option value="jpg">Is JPG</option>
            `;
                wrapper.appendChild(metaSelect);
                return;
            }
            if (type === "category") {
                const { data } = index_2.default;
                const categories = data.categories;
                const categorySelector = document.createElement("select");
                categorySelector.className = "PBE_generalInput PBE_select PBE_filterCategory";
                let options = `
                <option value="">All</option>
                <option value="__none">Uncategorised</option>
            `;
                for (const categoryItem of categories) {
                    options += `<option value="${categoryItem}">${categoryItem}</option>`;
                }
                categorySelector.innerHTML = options;
                wrapper.appendChild(categorySelector);
                return;
            }
            if (type === "tag" || type === "name") {
                const inputElement = document.createElement("input");
                inputElement.className = "PBE_generalInput PBE_input PBE_filterName";
                if (type === "tag")
                    index_4.default.add(inputElement, true);
                inputElement.addEventListener("keydown", (e) => {
                    if (e.keyCode !== 13)
                        return;
                    addFilterButton.dispatchEvent(new Event('click'));
                });
                wrapper.appendChild(inputElement);
                return;
            }
        }
    }
    exports["default"] = PromptsFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/PromptsFilter/simple.ts":
/*!****************************************!*\
  !*** ./client/PromptsFilter/simple.ts ***!
  \****************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/dom */ "./client/dom.ts"), __webpack_require__(/*! client/TagTooltip/index */ "./client/TagTooltip/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, dom_1, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class PromptsSimpleFilter {
        /**
         * Returns true if prompt passes filters params
         * @param {*} promptId
         * @param {*} filters
         * @returns
         */
        static checkFilter(promptId, filters = {}) {
            if (!promptId)
                return false;
            const { data } = index_2.default;
            const { state } = index_1.default;
            const { unitedList } = data;
            const { collection = "", category = "", tags = [], name = "" } = filters;
            const unitedPrompt = unitedList[promptId];
            if (!unitedPrompt)
                return false;
            //checking collections
            if (collection && !unitedPrompt.collections.includes(collection))
                return false;
            //checking categories
            if (category) {
                if (category === "__none" && unitedPrompt.category.length)
                    return false;
                else if (category !== "__none" && !unitedPrompt.category.includes(category))
                    return false;
            }
            //checking tags
            if (tags.length) {
                for (const tagItem of tags) {
                    if (!unitedPrompt.tags.includes(tagItem))
                        return false;
                }
            }
            //cheking name
            if (name && !unitedPrompt.id.toLowerCase().includes(name))
                return false;
            return true;
        }
        /**
         * Showing filters block
         * @param {*} wrapper
         * @param {*} filters
         * @param {*} callback
         * @returns
         */
        static show(wrapper, filters = {}, callback) {
            if (!wrapper || !callback)
                return;
            const { data } = index_2.default;
            const { categories } = data;
            const { collection = "", category = "", tags = [], name = "", sorting = "", sortingOptions } = filters;
            const filtersContainer = (0, dom_1.makeElement)({ element: "div", className: "PBE_filtersContainer" });
            //collections filter
            const colOptions = [{ id: "", name: "All collections" }];
            for (const collectionId in data.original)
                colOptions.push({ id: collectionId, name: collectionId });
            const collectionSelector = (0, dom_1.makeSelect)({
                className: "PBE_generalInput PBE_select",
                value: collection,
                options: colOptions,
                onChange: e => {
                    filters.collection = e.currentTarget.value;
                    callback();
                }
            });
            //categories filter
            const catOptions = [
                { id: "", name: "All categories" },
                { id: "__none", name: "Uncategorised" },
            ];
            for (const categoryId of categories)
                catOptions.push({ id: categoryId, name: categoryId });
            const categorySelector = (0, dom_1.makeSelect)({
                className: "PBE_generalInput PBE_select",
                value: category,
                options: catOptions,
                onChange: e => {
                    filters.category = e.currentTarget.value;
                    callback();
                }
            });
            //tags filter
            const tagsInput = (0, dom_1.makeElement)({
                element: "input",
                className: "PBE_generalInput PBE_input",
                value: tags.join(", "),
                placeholder: "tag1, tag2, tag3",
                onChange: e => {
                    const value = e.currentTarget.value;
                    let tags = value.split(",").map(item => item.trim());
                    //removing empty tags
                    tags = tags.filter(item => item);
                    filters.tags = tags || [];
                    callback();
                }
            });
            index_3.default.add(tagsInput);
            //name filter
            const nameInput = (0, dom_1.makeElement)({
                element: "input",
                className: "PBE_generalInput PBE_input",
                value: name,
                placeholder: "by name",
                onChange: e => {
                    filters.name = e.currentTarget.value.toLowerCase();
                    callback();
                }
            });
            filtersContainer.appendChild(collectionSelector);
            filtersContainer.appendChild(categorySelector);
            filtersContainer.appendChild(tagsInput);
            filtersContainer.appendChild(nameInput);
            //sorting selector
            if (sortingOptions) {
                const sortingSelector = (0, dom_1.makeSelect)({
                    className: "PBE_generalInput PBE_select",
                    value: sorting,
                    options: sortingOptions,
                    onChange: e => {
                        filters.sorting = e.currentTarget.value;
                        callback();
                    }
                });
                filtersContainer.appendChild(sortingSelector);
            }
            wrapper.appendChild(filtersContainer);
        }
    }
    exports["default"] = PromptsSimpleFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/SaveStyle/index.ts":
/*!***********************************!*\
  !*** ./client/SaveStyle/index.ts ***!
  \***********************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/CurrentPrompts/index */ "./client/CurrentPrompts/index.ts"), __webpack_require__(/*! client/LoadStyle/index */ "./client/LoadStyle/index.ts"), __webpack_require__(/*! client/dom */ "./client/dom.ts"), __webpack_require__(/*! client/showPromptItem */ "./client/showPromptItem.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4, dom_1, showPromptItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class SaveStyle {
        static init(mainWrapper) {
            const saveStyleWindow = document.createElement("div");
            saveStyleWindow.className = "PBE_generalWindow PBE_stylesWindow";
            saveStyleWindow.id = "PBE_saveStyleWindow";
            index_1.default.DOMCache.saveStyleWindow = saveStyleWindow;
            mainWrapper.appendChild(saveStyleWindow);
            index_1.default.onCloseActiveWindow = SaveStyle.onCloseWindow;
            saveStyleWindow.addEventListener("click", () => {
                index_1.default.onCloseActiveWindow = SaveStyle.onCloseWindow;
            });
        }
        static initButton(positiveWrapper) {
            const addStylesButton = document.createElement("button");
            addStylesButton.className = "PBE_actionButton PBE_saveStylesButton";
            addStylesButton.innerText = "Save style";
            addStylesButton.addEventListener("click", SaveStyle.onOpenStyles);
            positiveWrapper.appendChild(addStylesButton);
        }
        static onOpenStyles() {
            const { state } = index_1.default;
            state.showSaveStyleWindow = true;
            SaveStyle.update();
        }
        static onCloseWindow() {
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.saveStyleWindow;
            if (!wrapper || !state.showSaveStyleWindow)
                return;
            state.showSaveStyleWindow = undefined;
            wrapper.style.display = "none";
        }
        static onSaveStyle() {
            const { data } = index_2.default;
            const { state } = index_1.default;
            const collectionId = state.newStyleCollection;
            if (!collectionId)
                return;
            const targetCollection = data.styles[collectionId];
            if (!targetCollection)
                return;
            const styleNameInput = index_1.default.DOMCache.saveStyleWindow.querySelector("#PBE_newStyleName");
            const name = styleNameInput.value;
            if (!name || !data.styles)
                return;
            const newStyle = index_4.default.grabCurrentStyle(name, collectionId);
            if (!newStyle)
                return;
            targetCollection.push(newStyle);
            index_2.default.updateStyles(collectionId);
            SaveStyle.update();
        }
        static onChangeNewCollection(e) {
            const target = e.currentTarget;
            const { state } = index_1.default;
            const value = target.value;
            if (!value)
                return;
            state.newStyleCollection = value;
        }
        static showCurrentPrompts(wrapper) {
            let activePrompts = index_1.default.getCurrentPrompts();
            /* const currentPromptsContainer = document.createElement("div");
            currentPromptsContainer.className = "PBE_windowCurrentList PBE_Scrollbar"; */
            for (const i in activePrompts) {
                const currPrompt = activePrompts[i];
                const promptElement = (0, showPromptItem_1.default)({
                    prompt: { id: currPrompt.id, isExternalNetwork: currPrompt.isExternalNetwork },
                    options: {},
                });
                wrapper.appendChild(promptElement);
                promptElement.addEventListener("click", (e) => {
                    const target = e.currentTarget;
                    const currentId = target.dataset.prompt;
                    if (!currentId)
                        return;
                    if (e.ctrlKey || e.metaKey) {
                        activePrompts = activePrompts.filter(item => item.id !== currentId);
                        index_1.default.setCurrentPrompts(activePrompts);
                        SaveStyle.update();
                        index_3.default.update();
                        return;
                    }
                });
            }
            /* currentPromptsContainer.addEventListener("wheel", (e) => {
                if(!e.deltaY) return;
        
                e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
                e.preventDefault();
            });
        
        
            wrapper.appendChild(currentPromptsContainer); */
        }
        static showAddStyle(wrapper) {
            const { data } = index_2.default;
            const { state } = index_1.default;
            const setupContainer = document.createElement("div");
            setupContainer.className = "PBE_List PBE_stylesSetup";
            const styleNameInput = document.createElement("input");
            const saveButton = document.createElement("button");
            saveButton.innerText = "Save as style";
            saveButton.className = "PBE_button";
            styleNameInput.placeholder = "Style name";
            styleNameInput.className = "PBE_generalInput PBE_newStyleName";
            styleNameInput.id = "PBE_newStyleName";
            saveButton.addEventListener("click", SaveStyle.onSaveStyle);
            const collectionSelect = document.createElement("select");
            collectionSelect.className = "PBE_generalInput PBE_select";
            collectionSelect.style.height = "30px";
            collectionSelect.style.marginRight = "5px";
            let options = "";
            for (const collectionId in data.styles) {
                if (!state.newStyleCollection)
                    state.newStyleCollection = collectionId;
                options += `<option value="${collectionId}">${collectionId}</option>`;
            }
            collectionSelect.innerHTML = options;
            collectionSelect.value = state.newStyleCollection;
            collectionSelect.addEventListener("change", SaveStyle.onChangeNewCollection);
            const saveRow = (0, dom_1.makeElement)({ element: "div", className: "PBE_row" });
            saveRow.appendChild(collectionSelect);
            saveRow.appendChild(saveButton);
            setupContainer.appendChild(styleNameInput);
            setupContainer.appendChild(saveRow);
            wrapper.appendChild(setupContainer);
            index_4.default.showMetaCheckboxes(wrapper);
        }
        static update() {
            const { readonly } = index_2.default.meta;
            const { state } = index_1.default;
            const wrapper = index_1.default.DOMCache.saveStyleWindow;
            if (!wrapper || !state.showSaveStyleWindow)
                return;
            index_1.default.onCloseActiveWindow = SaveStyle.onCloseWindow;
            wrapper.innerHTML = "";
            wrapper.style.display = "flex";
            const currentPromptsBlock = document.createElement("div");
            const footerBlock = document.createElement("div");
            const closeButton = document.createElement("button");
            footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
            currentPromptsBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
            closeButton.innerText = "Close";
            closeButton.className = "PBE_button";
            const addNewContainer = (0, dom_1.makeElement)({ element: "div", className: "PBE_row" });
            if (!readonly) {
                SaveStyle.showCurrentPrompts(currentPromptsBlock);
                SaveStyle.showAddStyle(addNewContainer);
            }
            closeButton.addEventListener("click", SaveStyle.onCloseWindow);
            footerBlock.appendChild(closeButton);
            if (!readonly) {
                wrapper.appendChild(addNewContainer);
                wrapper.appendChild(currentPromptsBlock);
            }
            wrapper.appendChild(footerBlock);
        }
        ;
    }
    exports["default"] = SaveStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/SetupWindow/index.ts":
/*!*************************************!*\
  !*** ./client/SetupWindow/index.ts ***!
  \*************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/dom */ "./client/dom.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, dom_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class SetupWindow {
    }
    /**
     * Shown Setup window tab
     */
    SetupWindow.viewMode = "normal";
    /**
     * Inits Setup window HTML on page, loads config data.
     * @param {*} wrapper
     */
    SetupWindow.init = (wrapper) => {
        /*  const {state} = PromptsBrowser;
    
            const savedConfigString = localStorage.getItem("PBE_config");
            if(savedConfigString) {
                const savedConfig = JSON.parse(savedConfigString);
                if(savedConfig) state.config = savedConfig;
            } */
        const setupWindow = document.createElement("div");
        setupWindow.className = "PBE_setupWindow PBE_generalWindow";
        index_1.default.DOMCache.setupWindow = setupWindow;
        wrapper.appendChild(setupWindow);
        index_1.default.onCloseActiveWindow = SetupWindow.onCloseWindow;
        setupWindow.addEventListener("click", () => {
            index_1.default.onCloseActiveWindow = SetupWindow.onCloseWindow;
        });
    };
    /**
     * Closes Setup window
     * @returns
     */
    SetupWindow.onCloseWindow = () => {
        const { viewMode } = SetupWindow;
        const wrapper = index_1.default.DOMCache.setupWindow;
        if (!wrapper)
            return;
        if (viewMode === "newCollection" || viewMode === "newStylesCollection") {
            SetupWindow.viewMode = "normal";
            SetupWindow.update();
            return true;
        }
        else
            wrapper.style.display = "none";
    };
    SetupWindow.onUpdateDirName = (e) => {
        const target = e.currentTarget;
        let value = target.value;
        if (!value)
            return;
        value = (0, utils_1.makeFileNameSafe)(value);
        target.value = value;
    };
    SetupWindow.onCreate = (e) => {
        const target = e.currentTarget;
        const { viewMode } = SetupWindow;
        if (!target.parentNode)
            return;
        const setupWindow = target.parentNode.parentNode;
        if (!setupWindow)
            return;
        if (viewMode === "newCollection") {
            const newNameInput = setupWindow.querySelector(".PBE_newCollectionName");
            const formatSelect = setupWindow.querySelector(".PBE_newCollectionFormat");
            if (!newNameInput || !formatSelect)
                return;
            const newName = (0, utils_1.makeFileNameSafe)(newNameInput.value);
            const format = formatSelect.value;
            if (!newName || !format)
                return;
            index_2.default.createNewCollection(newName, format);
        }
        else if (viewMode === "newStylesCollection") {
            const newNameInput = setupWindow.querySelector(".PBE_newCollectionName");
            const formatSelect = setupWindow.querySelector(".PBE_newStyleCollectionFormat");
            if (!newNameInput || !formatSelect)
                return;
            const newName = (0, utils_1.makeFileNameSafe)(newNameInput.value);
            const format = formatSelect.value;
            if (!newName || !format)
                return;
            index_2.default.createNewStylesCollection(newName, format);
        }
        SetupWindow.viewMode = "normal";
        SetupWindow.update();
    };
    /**
     * Shows block with create new collection buttons
     * @param {*} wrapper
     */
    SetupWindow.showCreateNew = (wrapper) => {
        const newCollection = (0, dom_1.makeElement)({
            element: "button", className: "PBE_button", content: "New prompts collection"
        });
        const newStylesCollection = (0, dom_1.makeElement)({
            element: "button", className: "PBE_button", content: "New styles collection"
        });
        newCollection.addEventListener("click", () => {
            SetupWindow.viewMode = "newCollection";
            SetupWindow.update();
        });
        newStylesCollection.addEventListener("click", () => {
            SetupWindow.viewMode = "newStylesCollection";
            SetupWindow.update();
        });
        wrapper.appendChild(newCollection);
        wrapper.appendChild(newStylesCollection);
        //wrapper.appendChild(buttonsBlock);
    };
    SetupWindow.showNewCollection = (wrapper) => {
        const newName = document.createElement("div");
        const newNameLabel = document.createElement("div");
        const newNameInput = document.createElement("input");
        newName.className = "PBE_rowBlock";
        newName.style.maxWidth = "none";
        newNameInput.className = "PBE_generalInput PBE_input PBE_newCollectionName";
        newNameLabel.innerText = "New prompts collection name";
        newNameInput.addEventListener("change", SetupWindow.onUpdateDirName);
        newName.appendChild(newNameLabel);
        newName.appendChild(newNameInput);
        const format = document.createElement("div");
        const formatLabel = document.createElement("div");
        const formatSelect = document.createElement("select");
        format.className = "PBE_rowBlock";
        format.style.maxWidth = "none";
        formatSelect.value = "short";
        formatSelect.className = "PBE_generalInput PBE_select PBE_newCollectionFormat";
        formatSelect.innerHTML = `
            <option value="short">Short</option>
            <option value="expanded">Expanded</option>
        `;
        formatLabel.innerText = "Store format";
        format.appendChild(formatLabel);
        format.appendChild(formatSelect);
        wrapper.appendChild(newName);
        wrapper.appendChild(format);
    };
    SetupWindow.showNewStylesCollection = (wrapper) => {
        const newName = (0, dom_1.makeElement)({ element: "div", className: "PBE_rowBlock" });
        const format = (0, dom_1.makeElement)({ element: "div", className: "PBE_rowBlock" });
        newName.style.maxWidth = "none";
        format.style.maxWidth = "none";
        const newNameLabel = (0, dom_1.makeElement)({ element: "div", content: "New styles collection name" });
        const formatLabel = (0, dom_1.makeElement)({ element: "div", content: "Store format" });
        const newNameInput = (0, dom_1.makeElement)({ element: "input", className: "PBE_generalInput PBE_input PBE_newCollectionName" });
        newNameInput.addEventListener("change", SetupWindow.onUpdateDirName);
        newName.appendChild(newNameLabel);
        newName.appendChild(newNameInput);
        const formatSelect = (0, dom_1.makeSelect)({
            className: "PBE_generalInput PBE_select PBE_newStyleCollectionFormat",
            value: "short",
            options: [
                { id: "short", name: "Short" },
                { id: "expanded", name: "Expanded" },
            ],
        });
        format.appendChild(formatLabel);
        format.appendChild(formatSelect);
        wrapper.appendChild(newName);
        wrapper.appendChild(format);
    };
    SetupWindow.update = () => {
        const { readonly } = index_2.default.meta;
        const { viewMode } = SetupWindow;
        const wrapper = index_1.default.DOMCache.setupWindow;
        if (!wrapper)
            return;
        index_1.default.onCloseActiveWindow = SetupWindow.onCloseWindow;
        wrapper.style.display = "flex";
        if (viewMode === "newCollection")
            wrapper.innerHTML = "New prompts collection";
        else if (viewMode === "newStylesCollection")
            wrapper.innerHTML = "New styles collections";
        else
            wrapper.innerHTML = "New Collection";
        const topBlock = document.createElement("div");
        const contentBlock = document.createElement("div");
        const footerBlock = document.createElement("div");
        const closeButton = document.createElement("button");
        topBlock.className = "PBE_row PBE_setupWindowTopBlock";
        contentBlock.className = "PBE_windowContent PBE_Scrollbar";
        contentBlock.style.width = "100%";
        if (viewMode === "newCollection") {
            SetupWindow.showNewCollection(contentBlock);
        }
        else if (viewMode === "newStylesCollection") {
            SetupWindow.showNewStylesCollection(contentBlock);
        }
        else {
            if (!readonly)
                SetupWindow.showCreateNew(topBlock);
            const infoMessage = document.createElement("div");
            infoMessage.innerText = `The extension settings have moved to the general webUI settings in the "Prompts Browser" category.`;
            contentBlock.appendChild(infoMessage);
        }
        const statusBlock = (0, dom_1.makeElement)({ element: "div", className: "PBE_setupWindowStatus PBE_row" });
        statusBlock.innerHTML = `
            version: ${index_2.default.meta.version}
            <a target='_blank' href='https://github.com/AlpacaInTheNight/PromptsBrowser'>Project Page</a>
        `;
        footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
        footerBlock.style.justifyContent = "space-evenly";
        closeButton.innerText = viewMode === "normal" ? "Close" : "Cancel";
        closeButton.className = "PBE_button";
        if (viewMode !== "normal")
            closeButton.classList.add("PBE_buttonCancel");
        closeButton.addEventListener("click", SetupWindow.onCloseWindow);
        if (viewMode === "newCollection" || viewMode === "newStylesCollection") {
            const createButton = document.createElement("button");
            createButton.innerText = "Create";
            createButton.className = "PBE_button";
            createButton.addEventListener("click", SetupWindow.onCreate);
            footerBlock.appendChild(createButton);
        }
        footerBlock.appendChild(closeButton);
        wrapper.appendChild(topBlock);
        wrapper.appendChild(contentBlock);
        wrapper.appendChild(statusBlock);
        wrapper.appendChild(footerBlock);
    };
    exports["default"] = SetupWindow;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/TagTooltip/index.ts":
/*!************************************!*\
  !*** ./client/TagTooltip/index.ts ***!
  \************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class TagTooltip {
        static add(inputContainer, fixed = false) {
            TagTooltip.updateTagsList();
            //removing old element from the page
            if (TagTooltip.container) {
                const oldWindow = document.querySelector(".PBE_autocompliteTags");
                if (oldWindow)
                    oldWindow.remove();
                TagTooltip.container = undefined;
            }
            const autocompliteWindow = document.createElement("div");
            autocompliteWindow.className = "PBE_autocompliteBox PBE_autocompliteTags";
            if (fixed)
                inputContainer.dataset.position = "fixed";
            document.body.appendChild(autocompliteWindow);
            TagTooltip.setBoxPosition(inputContainer, autocompliteWindow);
            autocompliteWindow.innerText = "";
            TagTooltip.container = autocompliteWindow;
            TagTooltip.input = inputContainer;
            inputContainer.addEventListener("keydown", TagTooltip.onKeyDown);
            inputContainer.addEventListener("blur", TagTooltip.onUnfocus);
            inputContainer.addEventListener("keyup", TagTooltip.processCarretPosition);
            inputContainer.addEventListener("click", TagTooltip.processCarretPosition);
        }
        static setBoxPosition(inputContainer, boxContainer) {
            const rect = inputContainer.getBoundingClientRect();
            boxContainer.style.top = rect.top + rect.height + "px";
            boxContainer.style.left = rect.left + "px";
            boxContainer.style.zIndex = "1000";
        }
        static updateTagsList() {
            const { data } = index_1.default;
            if (!data || !data.united)
                return;
            const knownTags = [];
            const promptsList = data.united;
            for (const prompt of promptsList) {
                if (!prompt.tags)
                    continue;
                for (const tagItem of prompt.tags) {
                    if (!knownTags.includes(tagItem))
                        knownTags.push(tagItem);
                }
            }
            knownTags.sort();
            TagTooltip.knownTags = knownTags;
        }
        static onUnfocus(e) {
            const inputElement = e;
            const autoCompleteBox = TagTooltip.container;
            if (!autoCompleteBox || !inputElement)
                return;
            if (autoCompleteBox.style.display === "none")
                return;
            clearTimeout(TagTooltip.unfocusTimeout);
            TagTooltip.unfocusTimeout = setTimeout(() => {
                autoCompleteBox.style.display = "none";
                autoCompleteBox.innerHTML = "";
            }, 400);
        }
        static onKeyDown(e) {
            const inputElement = e;
            const autoCompleteBox = TagTooltip.container;
            if (!autoCompleteBox || !inputElement)
                return;
            if (autoCompleteBox.style.display === "none")
                return;
            if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13)
                return;
            const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
            if (!hintElements || !hintElements.length)
                return;
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        static onClickHint(e) {
            const inputElement = TagTooltip.input;
            const autoCompleteBox = TagTooltip.container;
            if (!autoCompleteBox || !inputElement)
                return;
            const target = e.currentTarget;
            if (!target)
                return;
            const start = Number(target.dataset.start);
            const end = Number(target.dataset.end);
            const newPrompt = target.innerText;
            if (Number.isNaN(start) || Number.isNaN(end))
                return;
            TagTooltip.onApplyHint(start, end, newPrompt);
        }
        static onHintWindowKey(e) {
            const inputElement = TagTooltip.input;
            const autoCompleteBox = TagTooltip.container;
            if (!autoCompleteBox || !inputElement)
                return false;
            if (autoCompleteBox.style.display === "none")
                return false;
            if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13)
                return false;
            const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
            if (!hintElements || !hintElements.length)
                return false;
            if (e.keyCode === 13) {
                const selectedHint = autoCompleteBox.querySelector(".PBE_hintItemSelected");
                if (!selectedHint)
                    return false;
                const start = Number(selectedHint.dataset.start);
                const end = Number(selectedHint.dataset.end);
                const newPrompt = selectedHint.innerText;
                if (Number.isNaN(start) || Number.isNaN(end))
                    return false;
                TagTooltip.onApplyHint(start, end, newPrompt);
                return true;
            }
            const isDown = e.keyCode == 40;
            if (isDown)
                TagTooltip.selectedIndex++;
            else
                TagTooltip.selectedIndex--;
            if (TagTooltip.selectedIndex < 0)
                TagTooltip.selectedIndex = hintElements.length - 1;
            else if (TagTooltip.selectedIndex > hintElements.length - 1)
                TagTooltip.selectedIndex = 0;
            for (let i = 0; i < hintElements.length; i++) {
                const element = hintElements[i];
                if (i === TagTooltip.selectedIndex)
                    element.classList.add("PBE_hintItemSelected");
                else
                    element.classList.remove("PBE_hintItemSelected");
            }
            return true;
        }
        static onApplyHint(start, end, newTag) {
            const inputElement = TagTooltip.input;
            const autoCompleteBox = TagTooltip.container;
            if (!autoCompleteBox || !inputElement)
                return;
            autoCompleteBox.style.display = "none";
            inputElement.dataset.hint = "";
            let newValue = "";
            const prefix = inputElement.value.substring(0, start);
            const postfix = inputElement.value.substring(end);
            if (prefix)
                newValue += prefix + " ";
            newValue += newTag;
            if (postfix)
                newValue += postfix;
            inputElement.value = newValue;
            TagTooltip.selectedIndex = 0;
            inputElement.dispatchEvent(new Event("change"));
        }
        static processCarretPosition(e) {
            const target = e.currentTarget;
            TagTooltip.input = target;
            const elementPosition = target.dataset.position || "";
            clearTimeout(TagTooltip.unfocusTimeout);
            if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
                const block = TagTooltip.onHintWindowKey(e);
                if (block) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            }
            const { selectedIndex = 0, knownTags = [] } = TagTooltip;
            const autoCompleteBox = TagTooltip.container;
            if (!autoCompleteBox || !target)
                return;
            autoCompleteBox.innerHTML = "";
            TagTooltip.setBoxPosition(target, autoCompleteBox);
            if (autoCompleteBox.style.position !== elementPosition) {
                autoCompleteBox.style.position = elementPosition;
            }
            const MAX_HINTS = 20;
            let currHints = 0;
            const value = target.value;
            const caret = target.selectionStart;
            const stopSymbols = [",", "(", ")", "<", ">", ":"];
            let position = caret;
            let word = "";
            let wordStart = caret;
            let wordEnd = caret;
            while (value[position]) {
                if (value[position] && stopSymbols.includes(value[position]))
                    break;
                word += value[position];
                position++;
                wordEnd = position;
            }
            position = caret - 1;
            while (value[position]) {
                if (value[position] && stopSymbols.includes(value[position]))
                    break;
                word = value[position] + word;
                wordStart = position;
                position--;
            }
            word = word.trim();
            if (!word) {
                target.dataset.hint = "";
                return;
            }
            word = word.toLowerCase();
            const possibleTags = [];
            for (const tag of knownTags) {
                if (tag.toLowerCase().includes(word))
                    possibleTags.push(tag);
            }
            if (!possibleTags.length || (possibleTags.length === 1 && word === possibleTags[0])) {
                autoCompleteBox.style.display = "none";
                target.dataset.hint = "";
                return;
            }
            else {
                autoCompleteBox.style.display = "";
                target.dataset.hint = "true";
            }
            for (const item of possibleTags) {
                if (currHints >= MAX_HINTS)
                    break;
                const hintItem = document.createElement("div");
                hintItem.className = "PBE_hintItem";
                hintItem.innerText = item;
                hintItem.dataset.start = wordStart + "";
                hintItem.dataset.end = wordEnd + "";
                if (currHints === selectedIndex)
                    hintItem.classList.add("PBE_hintItemSelected");
                hintItem.addEventListener("click", TagTooltip.onClickHint);
                autoCompleteBox.appendChild(hintItem);
                currHints++;
            }
        }
    }
    TagTooltip.selectedIndex = 0;
    TagTooltip.unfocusTimeout = 0;
    TagTooltip.container = undefined;
    TagTooltip.input = undefined;
    TagTooltip.knownTags = [];
    exports["default"] = TagTooltip;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/applyStyle.ts":
/*!******************************!*\
  !*** ./client/applyStyle.ts ***!
  \******************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/CurrentPrompts/index */ "./client/CurrentPrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    //making sure Svelte will pick up and delegate changes in the input value
    function triggerEvents(element) {
        element.dispatchEvent(new KeyboardEvent('keypress'));
        element.dispatchEvent(new KeyboardEvent('input'));
        element.dispatchEvent(new KeyboardEvent('blur'));
    }
    let _timerSamplerA = 0;
    let _timerSamplerB = 0;
    function applyStyle(style, isAfter, override = false) {
        if (!style)
            return;
        const { state } = index_1.default;
        const { positive, negative, seed, width, height, steps, cfg, sampling } = style;
        if (override)
            index_1.default.setCurrentPrompts([]);
        const activePrompts = index_1.default.getCurrentPrompts();
        const negativePrompts = index_1.default.DOMCache.containers[state.currentContainer].negativePrompts;
        const seedInput = index_1.default.DOMCache.containers[state.currentContainer].seedInput;
        const widthInput = index_1.default.DOMCache.containers[state.currentContainer].widthInput;
        const heightInput = index_1.default.DOMCache.containers[state.currentContainer].heightInput;
        const stepsInput = index_1.default.DOMCache.containers[state.currentContainer].stepsInput;
        const cfgInput = index_1.default.DOMCache.containers[state.currentContainer].cfgInput;
        const samplingInput = index_1.default.DOMCache.containers[state.currentContainer].samplingInput;
        if (positive && positive.length) {
            if (isAfter) {
                for (const prompt of positive) {
                    const { id } = prompt;
                    if (activePrompts.some(item => item.id === id))
                        continue;
                    activePrompts.push(Object.assign({}, prompt));
                }
            }
            else {
                for (let i = positive.length - 1; i >= 0; i--) {
                    const prompt = positive[i];
                    const { id } = prompt;
                    if (activePrompts.some(item => item.id === id))
                        continue;
                    activePrompts.unshift(Object.assign({}, prompt));
                }
            }
        }
        if (seed !== undefined && seedInput) {
            seedInput.value = seed + "";
            triggerEvents(seedInput);
        }
        if (negativePrompts && negative) {
            const negativeTextAreas = negativePrompts.getElementsByTagName("textarea");
            if (negativeTextAreas && negativeTextAreas[0]) {
                const textArea = negativeTextAreas[0];
                textArea.value = negative;
                triggerEvents(textArea);
            }
        }
        if (widthInput && width !== undefined) {
            widthInput.value = width + "";
            triggerEvents(widthInput);
        }
        if (heightInput && height !== undefined) {
            heightInput.value = height + "";
            triggerEvents(heightInput);
        }
        if (stepsInput && steps !== undefined) {
            stepsInput.value = steps + "";
            triggerEvents(stepsInput);
        }
        if (cfgInput && cfg !== undefined) {
            cfgInput.value = cfg + "";
            triggerEvents(cfgInput);
        }
        if (samplingInput && sampling) {
            const inputWrapper = samplingInput.parentElement.parentElement;
            const enterKeyEvent = new KeyboardEvent('keydown', {
                code: 'Enter',
                key: 'Enter',
                charCode: 13,
                keyCode: 13,
                view: window,
                bubbles: true
            });
            inputWrapper.style.opacity = "0";
            samplingInput.dispatchEvent(new KeyboardEvent('focus'));
            clearTimeout(_timerSamplerA);
            clearTimeout(_timerSamplerB);
            _timerSamplerA = setTimeout(() => {
                samplingInput.value = sampling;
                samplingInput.dispatchEvent(new KeyboardEvent('keydown'));
                samplingInput.dispatchEvent(new KeyboardEvent('keyup'));
                samplingInput.dispatchEvent(new KeyboardEvent('input'));
                _timerSamplerB = setTimeout(() => {
                    samplingInput.dispatchEvent(enterKeyEvent);
                    inputWrapper.style.opacity = "";
                }, 100);
            }, 100);
        }
        index_2.default.update();
    }
    exports["default"] = applyStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/categories.ts":
/*!******************************!*\
  !*** ./client/categories.ts ***!
  \******************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const categories = [
        "character",
        "character description",
        "portrait",
        "body",
        "composition",
        "object",
        "interior",
        "exterior",
        "artist",
        "action",
        "cloth",
        "style",
        "lighting",
        "building",
        "scenery",
        "architecture",
        "texture",
        "position",
        "background",
        "emotion",
        "media",
        "condition",
        "quality",
        "franchise",
        "effect",
        "meta",
        "creature"
    ].sort();
    exports["default"] = categories;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/checkFilter.ts":
/*!*******************************!*\
  !*** ./client/checkFilter.ts ***!
  \*******************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Returns true if prompt passes filter requirements
     * @param {*} prompt
     * @param {*} filter
     * @returns boolean
     */
    function checkFilter(prompt, filter) {
        if (!filter || !filter.length)
            return true; //no filter requirements
        let { id, comment = "", autogen = {} } = prompt;
        if (!id)
            return false; //invalid prompt
        const { tags = [], category = [], previewImage } = prompt;
        let fulfil = false;
        id = id.toLowerCase();
        comment = comment.toLowerCase();
        const haveAutogen = autogen.collection && autogen.style ? true : false;
        for (const filterItem of filter) {
            const { action, type, value } = filterItem;
            const isInclude = action === "include";
            fulfil = false;
            if (type === "name") {
                if (id.includes(value))
                    fulfil = isInclude ? true : false;
                else if (!isInclude)
                    fulfil = true;
            }
            else if (type === "category") {
                if (value === "__none") {
                    if (!category.length)
                        fulfil = isInclude ? true : false;
                }
                else {
                    if (category.includes(value))
                        fulfil = isInclude ? true : false;
                    else if (!isInclude)
                        fulfil = true;
                }
            }
            else if (type === "tag") {
                if (tags.includes(value))
                    fulfil = isInclude ? true : false;
                else if (!isInclude)
                    fulfil = true;
            }
            else if (type === "meta") {
                if (value === "preview")
                    fulfil = isInclude ? !!previewImage : !previewImage;
                else if (value === "png")
                    fulfil = isInclude ? previewImage === "png" : previewImage !== "png";
                else if (value === "jpg")
                    fulfil = isInclude ? previewImage === "jpg" : previewImage !== "jpg";
                else if (value === "categories")
                    fulfil = isInclude ? !!category.length : !category.length;
                else if (value === "tags")
                    fulfil = isInclude ? !!tags.length : !tags.length;
                else if (value === "comment")
                    fulfil = isInclude ? !!comment : !comment;
                else if (value === "autogen")
                    fulfil = isInclude ? haveAutogen : !haveAutogen;
                else if (value === "categories3")
                    fulfil = isInclude ? category.length >= 3 : category.length < 3;
                else if (value === "tags3")
                    fulfil = isInclude ? tags.length >= 3 : tags.length < 3;
            }
            if (!fulfil)
                return false;
        }
        return true;
    }
    exports["default"] = checkFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/const.ts":
/*!*************************!*\
  !*** ./client/const.ts ***!
  \*************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.NEW_CARD_GRADIENT = exports.EMPTY_CARD_GRADIENT = exports.PROMPT_WEIGHT_FACTOR = exports.DEFAULT_PROMPT_WEIGHT = void 0;
    const DEFAULT_PROMPT_WEIGHT = 1;
    exports.DEFAULT_PROMPT_WEIGHT = DEFAULT_PROMPT_WEIGHT;
    const PROMPT_WEIGHT_FACTOR = 1.1;
    exports.PROMPT_WEIGHT_FACTOR = PROMPT_WEIGHT_FACTOR;
    const EMPTY_CARD_GRADIENT = "linear-gradient(135deg, rgba(179,220,237,1) 0%,rgba(41,184,229,1) 50%,rgba(188,224,238,1) 100%)";
    exports.EMPTY_CARD_GRADIENT = EMPTY_CARD_GRADIENT;
    const NEW_CARD_GRADIENT = "linear-gradient(135deg, rgba(180,221,180,1) 0%,rgba(131,199,131,1) 17%,rgba(82,177,82,1) 33%,rgba(0,138,0,1) 67%,rgba(0,87,0,1) 83%,rgba(0,36,0,1) 100%)";
    exports.NEW_CARD_GRADIENT = NEW_CARD_GRADIENT;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/dom.ts":
/*!***********************!*\
  !*** ./client/dom.ts ***!
  \***********************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.makeSelect = exports.makeCheckbox = exports.makeElement = void 0;
    function makeElement(params) {
        if (!params)
            return;
        const { element, id, name, className, type, content, title, style, value, placeholder, onChange } = params;
        if (!element)
            return;
        const newElement = document.createElement(element);
        if (type)
            newElement.type = type;
        if (id)
            newElement.id = id;
        if (name)
            newElement.name = name;
        if (className)
            newElement.className = className;
        if (content)
            newElement.innerText = content;
        if (title)
            newElement.title = title;
        if (value)
            newElement.value = value;
        if (placeholder)
            newElement.placeholder = placeholder;
        if (style)
            for (const i in style)
                newElement.style[i] = style[i];
        if (onChange)
            newElement.addEventListener("change", onChange);
        return newElement;
    }
    exports.makeElement = makeElement;
    function makeCheckbox(params) {
        if (!params)
            return;
        const { name = "", title = "", checked = false, id, data, onChange, reverse = false } = params;
        let { wrapper } = params;
        if (!wrapper)
            wrapper = makeElement({ element: "div" });
        const checkBox = makeElement(Object.assign(Object.assign({}, params), { element: "input", type: "checkbox" }));
        const boxTitle = makeElement({ element: "label", content: name, title });
        checkBox.checked = checked;
        if (reverse) {
            wrapper.appendChild(boxTitle);
            wrapper.appendChild(checkBox);
        }
        else {
            wrapper.appendChild(checkBox);
            wrapper.appendChild(boxTitle);
        }
        if (onChange)
            checkBox.addEventListener("change", onChange);
        if (id) {
            checkBox.name = id;
            boxTitle.htmlFor = id;
        }
        if (data)
            checkBox.dataset.id = data;
        return wrapper;
    }
    exports.makeCheckbox = makeCheckbox;
    function makeSelect(params) {
        if (!params)
            return;
        const { id, value = "", options = [], className, onChange, style } = params;
        const selectElement = makeElement({ element: "select", id, className, style });
        if (onChange)
            selectElement.addEventListener("change", onChange);
        let htmlOptions = "";
        for (const option of options) {
            htmlOptions += `<option value="${option.id}">${option.name}</option>`;
        }
        selectElement.innerHTML = htmlOptions;
        selectElement.value = value;
        return selectElement;
    }
    exports.makeSelect = makeSelect;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/index.ts":
/*!*************************!*\
  !*** ./client/index.ts ***!
  \*************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/SetupWindow/index */ "./client/SetupWindow/index.ts"), __webpack_require__(/*! client/PromptEdit/index */ "./client/PromptEdit/index.ts"), __webpack_require__(/*! client/PromptTools/index */ "./client/PromptTools/index.ts"), __webpack_require__(/*! client/CollectionTools/index */ "./client/CollectionTools/index.ts"), __webpack_require__(/*! client/ControlPanel/index */ "./client/ControlPanel/index.ts"), __webpack_require__(/*! client/KnownPrompts/index */ "./client/KnownPrompts/index.ts"), __webpack_require__(/*! client/CurrentPrompts/index */ "./client/CurrentPrompts/index.ts"), __webpack_require__(/*! client/SaveStyle/index */ "./client/SaveStyle/index.ts"), __webpack_require__(/*! client/LoadStyle/index */ "./client/LoadStyle/index.ts"), __webpack_require__(/*! client/PromptScribe/index */ "./client/PromptScribe/index.ts"), __webpack_require__(/*! client/PreviewSave/index */ "./client/PreviewSave/index.ts"), __webpack_require__(/*! client/PromptWordTooltip/index */ "./client/PromptWordTooltip/index.ts"), __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts"), __webpack_require__(/*! client/initialState */ "./client/initialState.ts"), __webpack_require__(/*! client/supportedContainers */ "./client/supportedContainers.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, index_4, index_5, index_6, index_7, index_8, index_9, index_10, index_11, index_12, index_13, synchroniseCurrentPrompts_1, utils_1, initialState_1, supportedContainers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class PromptsBrowser {
        static onChangeTab(e) {
            const target = e.target;
            const tagName = target.tagName.toLowerCase();
            if (tagName !== "button")
                return;
            const { state } = PromptsBrowser;
            const text = target.innerText.trim();
            if (state.currentContainer === text)
                return;
            let update = false;
            if (text === "txt2img") {
                state.currentContainer = "text2Img";
                update = true;
            }
            if (text === "img2img") {
                state.currentContainer = "img2Img";
                update = true;
            }
            if (update) {
                index_6.default.update();
                index_12.default.update();
                index_7.default.update();
                index_8.default.update();
            }
        }
        /**
         * Tracking escape key to close active window.
         * @param e
         * @returns
         */
        static onDocumentKey(e) {
            if (e.key !== "Escape")
                return;
            let hold = false;
            if (PromptsBrowser.onCloseActiveWindow)
                hold = PromptsBrowser.onCloseActiveWindow() || false;
            if (!hold)
                PromptsBrowser.onCloseActiveWindow = undefined;
        }
    }
    PromptsBrowser.timeoutPBUpdatePrompt = 0;
    PromptsBrowser.DOMCache = {
        containers: {},
    };
    PromptsBrowser.state = initialState_1.default;
    PromptsBrowser.onCloseActiveWindow = undefined;
    PromptsBrowser.supportedContainers = supportedContainers_1.default;
    PromptsBrowser.textAreaSynchronise = () => (0, synchroniseCurrentPrompts_1.default)(true, false);
    PromptsBrowser.getCurrentPrompts = () => {
        const { state } = PromptsBrowser;
        if (!state.currentPromptsList[state.currentContainer]) {
            state.currentPromptsList[state.currentContainer] = [];
        }
        return state.currentPromptsList[state.currentContainer];
    };
    PromptsBrowser.setCurrentPrompts = (currentPrompts = []) => {
        const { state } = PromptsBrowser;
        const { currentPromptsList, currentContainer } = state;
        currentPromptsList[currentContainer] = currentPrompts;
    };
    PromptsBrowser.loadUIConfig = () => {
        const { state } = PromptsBrowser;
        const lsShowViews = localStorage.getItem("PBE_showViews");
        if (lsShowViews)
            state.showViews = JSON.parse(lsShowViews);
        const showControlPanel = localStorage.getItem("showControlPanel");
        if (showControlPanel === "false")
            state.showControlPanel = false;
    };
    /**
     * Loading extension configuration from the local storage
     * TODO: this is outdated. Config comes from server now.
     */
    PromptsBrowser.loadConfig = () => {
        const { state } = PromptsBrowser;
        //getting config from local storage
        const savedConfigString = localStorage.getItem("PBE_config");
        if (savedConfigString) {
            const savedConfig = JSON.parse(savedConfigString);
            if (savedConfig)
                state.config = savedConfig;
        }
    };
    PromptsBrowser.gradioApp = () => {
        const elems = document.getElementsByTagName('gradio-app');
        const gradioShadowRoot = elems.length == 0 ? null : elems[0].shadowRoot;
        return !!gradioShadowRoot ? gradioShadowRoot : document.body;
    };
    PromptsBrowser.init = (tries = 0) => {
        const { state } = PromptsBrowser;
        const { DOMCache } = PromptsBrowser;
        const { united } = index_1.default.data;
        if (!DOMCache.containers)
            DOMCache.containers = {};
        const mainContainer = PromptsBrowser.gradioApp();
        if (tries > 100) {
            (0, utils_1.log)("No prompt wrapper container found or server did not returned prompts data.");
            return;
        }
        const checkContainer = mainContainer.querySelector("#txt2img_prompt_container");
        if (!checkContainer || !united) {
            PromptsBrowser.timeoutPBUpdatePrompt = setTimeout(() => PromptsBrowser.init(tries + 1), 1000);
            return;
        }
        DOMCache.mainContainer = mainContainer;
        const tabsContainer = mainContainer.querySelector("#tabs > div:first-child");
        tabsContainer.removeEventListener("click", PromptsBrowser.onChangeTab);
        tabsContainer.addEventListener("click", PromptsBrowser.onChangeTab);
        document.removeEventListener('keyup', PromptsBrowser.onDocumentKey);
        document.addEventListener('keyup', PromptsBrowser.onDocumentKey);
        for (const containerId in PromptsBrowser.supportedContainers) {
            DOMCache.containers[containerId] = {};
            const container = PromptsBrowser.supportedContainers[containerId];
            const domContainer = DOMCache.containers[containerId];
            if (container.prompt) {
                const promptContainer = mainContainer.querySelector(`#${container.prompt}`);
                if (promptContainer.dataset.loadedpbextension)
                    continue;
                promptContainer.dataset.loadedpbextension = "true";
                const positivePrompts = mainContainer.querySelector(`#${container.prompt} > div`);
                const negativePrompts = mainContainer.querySelector(`#${container.prompt} > div:nth-child(2)`);
                if (!positivePrompts || !negativePrompts) {
                    (0, utils_1.log)(`No prompt containers found for ${containerId}`);
                    continue;
                }
                domContainer.promptContainer = promptContainer;
                domContainer.positivePrompts = positivePrompts;
                domContainer.negativePrompts = negativePrompts;
                //in order to be able to place buttons correctly
                positivePrompts.style.position = "relative";
                if (container.buttons) {
                    const buttonsContainer = mainContainer.querySelector(`#${container.buttons}`);
                    if (buttonsContainer) {
                        domContainer.buttonsContainer = buttonsContainer;
                        const generateButton = buttonsContainer.querySelector(".primary");
                        if (generateButton)
                            domContainer.generateButton = generateButton;
                    }
                }
                if (container.results) {
                    const resultsContainer = mainContainer.querySelector(`#${container.results}`);
                    if (resultsContainer) {
                        domContainer.resultsContainer = resultsContainer;
                    }
                }
                domContainer.textArea = positivePrompts.querySelector("textarea");
                const textArea = domContainer.textArea;
                if (textArea && !textArea.dataset.pbelistenerready) {
                    textArea.dataset.pbelistenerready = "true";
                    textArea.removeEventListener("input", PromptsBrowser.textAreaSynchronise);
                    textArea.addEventListener("input", PromptsBrowser.textAreaSynchronise);
                }
                index_13.default.init(positivePrompts, containerId);
                index_6.default.init(promptContainer, containerId);
                index_7.default.init(promptContainer, positivePrompts, containerId);
                index_8.default.init(promptContainer, containerId);
                index_9.default.initButton(positivePrompts);
                index_10.default.initButton(positivePrompts);
                index_11.default.initButton(positivePrompts);
                index_8.default.initButton(positivePrompts);
                if (domContainer.promptBrowser && !state.showViews.includes("known")) {
                    domContainer.promptBrowser.style.display = "none";
                }
                if (domContainer.currentPrompts && !state.showViews.includes("current")) {
                    domContainer.currentPrompts.style.display = "none";
                }
                if (!state.showViews.includes("positive"))
                    positivePrompts.style.display = "none";
                if (!state.showViews.includes("negative"))
                    negativePrompts.style.display = "none";
            }
            if (container.seed)
                domContainer.seedInput = mainContainer.querySelector(`#${container.seed} input`);
            if (container.width)
                domContainer.widthInput = mainContainer.querySelector(`#${container.width} input`);
            if (container.height)
                domContainer.heightInput = mainContainer.querySelector(`#${container.height} input`);
            if (container.steps)
                domContainer.stepsInput = mainContainer.querySelector(`#${container.steps} input`);
            if (container.cfg)
                domContainer.cfgInput = mainContainer.querySelector(`#${container.cfg} input`);
            if (container.sampling)
                domContainer.samplingInput = mainContainer.querySelector(`#${container.sampling} input`);
            if (container.gallery) {
                domContainer.imageArea = PromptsBrowser.gradioApp().querySelector(`#${container.gallery}`);
                index_12.default.init(domContainer.imageArea, containerId);
            }
        }
        index_2.default.init(mainContainer);
        index_3.default.init(mainContainer);
        index_4.default.init(mainContainer);
        index_5.default.init(mainContainer);
        index_9.default.init(mainContainer);
        index_10.default.init(mainContainer);
        index_11.default.init(mainContainer);
        index_6.default.update();
        index_12.default.update();
        index_7.default.update();
        index_8.default.update();
    };
    exports["default"] = PromptsBrowser;
    PromptsBrowser.loadConfig();
    document.addEventListener('DOMContentLoaded', function () {
        PromptsBrowser.loadUIConfig();
        index_1.default.load();
        PromptsBrowser.init();
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/initialState.ts":
/*!********************************!*\
  !*** ./client/initialState.ts ***!
  \********************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const initialState = {
        config: {
            belowOneWeight: 0.05,
            aboveOneWeight: 0.02,
            toLowerCase: true,
            spaceMode: "space",
            showPromptIndex: false,
            autocomplitePromptMode: "all",
            cardWidth: 50,
            cardHeight: 100,
            splashCardWidth: 200,
            splashCardHeight: 300,
            rowsInKnownCards: 3,
            maxCardsShown: 1000,
            resizeThumbnails: true,
            resizeThumbnailsMaxWidth: 300,
            resizeThumbnailsMaxHeight: 300,
            resizeThumbnailsFormat: "JPG",
            /**
             * If true, will enable extended syntax element support for prompts used by some addons.
             */
            supportExtendedSyntax: true,
            saveStyleMeta: {
                positive: true,
                seed: false,
                size: false,
                quality: false,
                sampler: false,
                negative: false,
            },
            updateStyleMeta: {
                positive: true,
                seed: false,
                size: false,
                quality: false,
                sampler: false,
                negative: false,
            },
        },
        showControlPanel: true,
        showViews: ["known", "current", "positive", "negative"],
        currentContainer: "text2Img",
        currentPromptsList: {},
        selectedPrompt: undefined,
        editingPrompt: undefined,
        filesIteration: (new Date().valueOf()),
        filterCategory: undefined,
        filterName: undefined,
        filterCollection: undefined,
        filterTags: undefined,
        filterStyleCollection: undefined,
        filterStyleName: undefined,
        newStyleCollection: undefined,
        sortKnownPrompts: undefined,
        copyOrMoveTo: undefined,
        dragItemId: undefined,
        dragCurrentIndex: undefined,
        promptToolsId: undefined,
        collectionToolsId: undefined,
        savePreviewCollection: undefined,
        editTargetCollection: undefined,
        editItem: undefined,
        showStylesWindow: undefined,
        showSaveStyleWindow: undefined,
        showScriberWindow: undefined,
        toggledButtons: ["tools_tags", "tools_category", "tools_name", "tools_replaceMode", "new_in_all_collections", "styles_simplified_view"],
        selectedNewPrompts: [],
        selectedCollectionPrompts: [],
        promptsFilter: {},
        autoGenerateType: "prompt",
        //autoGenerateKeepCurrent: false,
    };
    exports["default"] = initialState;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/showPromptItem.ts":
/*!**********************************!*\
  !*** ./client/showPromptItem.ts ***!
  \**********************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts"), __webpack_require__(/*! client/const */ "./client/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, utils_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onPromptCardHover(e) {
        const { splashCardWidth = 200, splashCardHeight = 300 } = index_1.default.state.config;
        const target = e.currentTarget;
        const splash = target.querySelector(".PBE_promptElementSplash");
        if (!splash)
            return;
        const BIG_CARD_HEIGHT = splashCardHeight;
        splash.style.display = "";
        const position = target.getBoundingClientRect();
        const bottomPosition = position.y + position.height + BIG_CARD_HEIGHT;
        if (bottomPosition < window.innerHeight)
            splash.style.top = position.top + "px";
        else
            splash.style.top = (position.top - position.height - BIG_CARD_HEIGHT) + "px";
        splash.style.left = position.left + "px";
    }
    /**
     * Shows prompt card
     */
    function showPromptItem({ prompt, options = {} }) {
        const { cardWidth = 50, cardHeight = 100, splashCardWidth = 200, splashCardHeight = 300 } = index_1.default.state.config;
        const { index = 0, isShadowed = false, noSplash = false, url } = options;
        const { id = "", weight = const_1.DEFAULT_PROMPT_WEIGHT, isExternalNetwork = false, isSyntax = false } = prompt;
        const imageSrc = url || index_2.default.getPromptPreviewURL(id, undefined);
        const promptElement = document.createElement("div");
        const weightContainer = document.createElement("div");
        promptElement.className = "PBE_promptElement PBE_currentElement";
        promptElement.style.backgroundImage = imageSrc;
        promptElement.dataset.prompt = id;
        promptElement.dataset.index = index + "";
        promptElement.draggable = true;
        if (isExternalNetwork)
            promptElement.classList.add("PBE_externalNetwork");
        if (isShadowed)
            promptElement.classList.add("PBE_shadowedElement");
        if (isSyntax)
            promptElement.classList.add("PBE_syntaxElement");
        promptElement.style.width = `${cardWidth}px`;
        promptElement.style.height = `${cardHeight}px`;
        let promptName = id;
        if (!isSyntax) {
            promptName = (0, utils_1.replaceAllRegex)(promptName, "\\\\", "");
            promptName = (0, utils_1.replaceAllRegex)(promptName, ":", ": ");
            promptName = (0, utils_1.replaceAllRegex)(promptName, "_", " ");
            promptName = (0, utils_1.replaceAllRegex)(promptName, "{", "");
            promptName = (0, utils_1.replaceAllRegex)(promptName, "}", "");
            if (weight !== const_1.DEFAULT_PROMPT_WEIGHT) {
                weightContainer.className = "PBE_promptElementWeight";
                weightContainer.innerText = weight + "";
                promptElement.appendChild(weightContainer);
            }
            if (weight < 1 && weight > 0.6) {
                promptElement.style.transform = "scale(0.9)";
                promptElement.style.zIndex = "3";
                weightContainer.style.color = "green";
            }
            else if (weight <= 0.6 && weight > 0.4) {
                promptElement.style.transform = "scale(0.8)";
                promptElement.style.zIndex = "2";
                weightContainer.style.color = "blue";
            }
            else if (weight <= 0.4) {
                promptElement.style.transform = "scale(0.7)";
                promptElement.style.zIndex = "1";
                weightContainer.style.color = "purple";
            }
            if (weight > 1 && weight <= 1.2) {
                promptElement.style.transform = "scale(1.1)";
                promptElement.style.zIndex = "4";
                weightContainer.style.color = "orange";
            }
            else if (weight > 1.2 && weight <= 1.3) {
                promptElement.style.transform = "scale(1.2)";
                promptElement.style.zIndex = "5";
                weightContainer.style.color = "orangered";
            }
            else if (weight > 1.3) {
                promptElement.style.transform = "scale(1.3)";
                promptElement.style.zIndex = "6";
                weightContainer.style.color = "red";
            }
        }
        if (!noSplash && !isSyntax) {
            const splashElement = document.createElement("div");
            splashElement.className = "PBE_promptElementSplash PBE_currentElement";
            splashElement.style.backgroundImage = imageSrc;
            splashElement.innerText = promptName;
            splashElement.style.width = `${splashCardWidth}px`;
            splashElement.style.height = `${splashCardHeight}px`;
            splashElement.style.marginTop = `${cardHeight}px`;
            if (weight !== const_1.DEFAULT_PROMPT_WEIGHT) {
                splashElement.appendChild(weightContainer.cloneNode(true));
            }
            promptElement.appendChild(splashElement);
            promptElement.addEventListener("mouseover", onPromptCardHover);
        }
        promptElement.innerHTML += promptName;
        return promptElement;
    }
    exports["default"] = showPromptItem;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/supportedContainers.ts":
/*!***************************************!*\
  !*** ./client/supportedContainers.ts ***!
  \***************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const supportedContainers = {
        text2Img: {
            prompt: "txt2img_prompt_container",
            results: "txt2img_results",
            gallery: "txt2img_gallery_container",
            buttons: "txt2img_generate_box",
            settings: "txt2img_settings",
            seed: "txt2img_seed",
            width: "txt2img_width",
            height: "txt2img_height",
            steps: "txt2img_steps",
            cfg: "txt2img_cfg_scale",
            sampling: "txt2img_sampling",
        },
        img2Img: {
            prompt: "img2img_prompt_container",
            results: "img2img_results",
            gallery: "img2img_gallery_container",
            buttons: "img2img_generate_box",
            settings: "img2img_settings",
            seed: "img2img_seed",
            width: "img2img_width",
            height: "img2img_height",
            steps: "img2img_steps",
            cfg: "img2img_cfg_scale",
            sampling: "img2img_sampling",
        }
    };
    exports["default"] = supportedContainers;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/synchroniseCurrentPrompts.ts":
/*!*********************************************!*\
  !*** ./client/synchroniseCurrentPrompts.ts ***!
  \*********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/CurrentPrompts/index */ "./client/CurrentPrompts/index.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! client/utils */ "./client/utils.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, index_3, const_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Synchronises text content of the textarea with the array of active prompts used by the extension.
     */
    function synchroniseCurrentPrompts(noTextAreaUpdate = true, normalize = false) {
        const { state } = index_2.default;
        const { data } = index_1.default;
        const { supportExtendedSyntax = true } = state.config;
        const textArea = index_2.default.DOMCache.containers[state.currentContainer].textArea;
        const KEEP_SYNTAX_SYMBOLS = ["{", "}", "|"];
        const DELIMITER_CHAR = ",";
        const SPACE_CHAR = " ";
        if (!textArea)
            return;
        let activePrompts = index_2.default.getCurrentPrompts();
        let value = textArea.value;
        //trying to fix LORAs/Hypernetworks added without a preceding comma
        value = value.replace(/([^,])\ </g, "$1,\ <");
        const newPBE_currentPrompts = [];
        let prompts = [];
        if (supportExtendedSyntax) {
            prompts = value.split(/([,{}|])/g);
            prompts = prompts.filter(strItem => strItem);
            prompts = prompts.map((strItem, i, arr) => {
                if (typeof strItem !== "string")
                    return strItem;
                let trimStr = strItem.trim();
                if (KEEP_SYNTAX_SYMBOLS.includes(trimStr)) {
                    const prevItem = i > 0 ? arr[i - 1] : "";
                    const nextItem = arr[i + 1];
                    if (prevItem && prevItem[prevItem.length - 1] === SPACE_CHAR)
                        strItem = SPACE_CHAR + strItem;
                    if (nextItem && nextItem[0] === SPACE_CHAR)
                        strItem += SPACE_CHAR;
                }
                return strItem;
            });
            prompts = prompts.filter(strItem => strItem && strItem.trim());
        }
        else {
            prompts = value.split(",");
            prompts = prompts.filter(strItem => strItem && strItem.trim());
        }
        let currNestedWeight = 0;
        let index = 0;
        for (let i = 0; i < prompts.length; i++) {
            let promptItem = prompts[i];
            if (!promptItem || promptItem === ",")
                continue;
            const { id, weight, isExternalNetwork, isSyntax = false, nestedWeight } = (0, utils_1.promptStringToObject)({ prompt: promptItem, nestedWeight: currNestedWeight });
            currNestedWeight = nestedWeight;
            promptItem = id;
            if (normalize && !isExternalNetwork && !isSyntax)
                promptItem = (0, utils_1.normalizePrompt)({ prompt: promptItem, state, data });
            let targetItem = !isSyntax ? activePrompts.find(item => item.id === promptItem) : undefined;
            if (targetItem) {
                if (targetItem.weight !== weight)
                    targetItem.weight = weight;
            }
            else {
                targetItem = {
                    id: promptItem,
                    index,
                    weight: weight !== undefined ? weight : const_1.DEFAULT_PROMPT_WEIGHT
                };
            }
            if (isExternalNetwork)
                targetItem.isExternalNetwork = true;
            /**
             * If it is a syntax token - also checking if it needs delimiters on its sides in string.
             */
            if (isSyntax) {
                const prevItem = i > 0 ? prompts[i - 1] : "";
                const nextItem = prompts[i + 1];
                targetItem.isSyntax = true;
                targetItem.delimiter = "none";
                if (prevItem === DELIMITER_CHAR && nextItem === DELIMITER_CHAR)
                    targetItem.delimiter = "both";
                else if (prevItem === DELIMITER_CHAR)
                    targetItem.delimiter = "prev";
                else if (nextItem === DELIMITER_CHAR)
                    targetItem.delimiter = "next";
            }
            newPBE_currentPrompts.push(targetItem);
            index++;
        }
        activePrompts = newPBE_currentPrompts;
        index_2.default.setCurrentPrompts(activePrompts);
        index_3.default.update(noTextAreaUpdate);
    }
    exports["default"] = synchroniseCurrentPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/utils.ts":
/*!*************************!*\
  !*** ./client/utils.ts ***!
  \*************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/index */ "./client/index.ts"), __webpack_require__(/*! client/const */ "./client/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, index_2, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.log = exports.isInSameCollection = exports.randomIntFromInterval = exports.addStrToActive = exports.stringToPromptsArray = exports.promptStringToObject = exports.normalizePrompt = exports.makeFileNameSafe = exports.replaceAllRegex = void 0;
    const regex = {
        REGX_SINGLE_UNDERSCORE: /(?<!_)_(?!_)/g,
    };
    function replaceAllRegex(str, oldStr, newStr) {
        if (!str || !oldStr)
            return str;
        return str.replace(new RegExp(oldStr, 'g'), newStr);
    }
    exports.replaceAllRegex = replaceAllRegex;
    ;
    /**
     * Make sure to update server-side makeFileNameSafe method as well
     */
    function makeFileNameSafe(fileName) {
        if (!fileName)
            return;
        const { REGX_SINGLE_UNDERSCORE } = regex;
        fileName = replaceAllRegex(fileName, REGX_SINGLE_UNDERSCORE, " ");
        //unix/win
        fileName = replaceAllRegex(fileName, "/", "_fsl_");
        //win
        fileName = replaceAllRegex(fileName, ":", "_col_");
        fileName = replaceAllRegex(fileName, "\\\\", "_bsl_");
        fileName = replaceAllRegex(fileName, "<", "_lt_");
        fileName = replaceAllRegex(fileName, ">", "_gt_");
        fileName = replaceAllRegex(fileName, "\"", "_dq_");
        fileName = replaceAllRegex(fileName, "\\|", "_pip_");
        fileName = replaceAllRegex(fileName, "\\?", "_qm_");
        fileName = replaceAllRegex(fileName, "\\*", "_ast_");
        fileName = fileName.trim();
        return fileName;
    }
    exports.makeFileNameSafe = makeFileNameSafe;
    /**
     * Modifies prompt input so that prompts conform to the same style.
     * @param {*} prompt
     * @returns
     */
    function normalizePrompt({ prompt, state, data }) {
        const { unitedList } = data;
        const { config } = state;
        const { REGX_SINGLE_UNDERSCORE } = regex;
        if (!prompt)
            return prompt;
        prompt = prompt.trim();
        if (!prompt)
            return prompt;
        //do not modify saved prompts
        if (unitedList[prompt])
            return prompt;
        //Skip external networks prompts.
        if (prompt.startsWith("<") && prompt.endsWith(">"))
            return prompt;
        if (config.toLowerCase)
            prompt = prompt.toLowerCase();
        if (config.spaceMode === "space")
            prompt = prompt.replaceAll(REGX_SINGLE_UNDERSCORE, " ");
        else if (config.spaceMode === "underscore")
            prompt = prompt.replaceAll(" ", "_");
        return prompt;
    }
    exports.normalizePrompt = normalizePrompt;
    /**
     * Converts prompt string to prompt object (including meta data like weight and external network).
     * @param {*} promptItem
     */
    function promptStringToObject({ prompt, nestedWeight = 0, supportExtendedSyntax = true }) {
        const KEEP_SYNTAX_SYMBOLS = ["{", "}", "|"];
        if (supportExtendedSyntax && KEEP_SYNTAX_SYMBOLS.includes(prompt.trim()))
            return { id: prompt, isSyntax: true };
        else
            prompt = prompt.trim();
        //prompt weight
        let weight = const_1.DEFAULT_PROMPT_WEIGHT;
        //prompt is a marker for usage of LORA/Hypernetwork
        let isExternalNetwork = false;
        let currChar = "";
        let isEscape = false;
        let i = 0;
        //entering weight
        while (i < prompt.length) {
            if (isEscape) {
                isEscape = false;
                i++;
                continue;
            }
            currChar = prompt.charAt(i);
            if (currChar === "\\") {
                isEscape = true;
                i++;
                continue;
            }
            if (currChar !== "(")
                break;
            nestedWeight += 1;
            i++;
        }
        //getting prompt weight
        weight = Number(Math.pow(const_1.PROMPT_WEIGHT_FACTOR, nestedWeight).toFixed(2));
        //outing weight
        i = prompt.length - 1;
        while (i < prompt.length) {
            if (isEscape) {
                isEscape = false;
                i--;
                continue;
            }
            currChar = prompt.charAt(i);
            if (prompt.charAt(i - 1) === "\\") {
                isEscape = true;
                i--;
                continue;
            }
            if (currChar !== ")")
                break;
            nestedWeight -= 1;
            i--;
        }
        //getting new prompt name without weight syntax characters
        i = 0;
        isEscape = false;
        let newPromptItem = "";
        while (i < prompt.length) {
            currChar = prompt.charAt(i);
            if (currChar === "\\") {
                isEscape = true;
                newPromptItem += currChar;
                i++;
                continue;
            }
            if ((currChar !== "(" && currChar !== ")") || isEscape)
                newPromptItem += currChar;
            if (isEscape)
                isEscape = false;
            i++;
        }
        prompt = newPromptItem;
        //detecting external network prompt
        if (prompt.startsWith("<") && prompt.endsWith(">")) {
            isExternalNetwork = true;
            prompt = prompt.substring(1);
            prompt = prompt.substring(0, prompt.length - 1);
        }
        //detecting weight marker
        if (prompt.includes(":")) {
            const promptArr = prompt.split(":");
            const weightDataItem = Number(promptArr.pop());
            if (!Number.isNaN(weightDataItem)) {
                const base = promptArr.join(":").trim();
                prompt = base;
                weight = weightDataItem;
            }
        }
        const promptObject = { id: prompt, weight, isExternalNetwork, nestedWeight };
        return promptObject;
    }
    exports.promptStringToObject = promptStringToObject;
    function stringToPromptsArray(str, supportExtendedSyntax) {
        if (!str)
            return false;
        const promptsArray = [];
        const arr = str.split(",");
        for (let prompt of arr) {
            prompt = prompt.trim();
            if (!prompt)
                continue;
            const newPrompt = promptStringToObject({ prompt, supportExtendedSyntax });
            promptsArray.push(newPrompt);
        }
        return promptsArray;
    }
    exports.stringToPromptsArray = stringToPromptsArray;
    function addStrToActive(str, atStart = false, supportExtendedSyntax = false) {
        const arr = stringToPromptsArray(str, supportExtendedSyntax);
        if (!arr || !arr.length)
            return;
        const activePrompts = index_2.default.getCurrentPrompts();
        for (let prompt of arr) {
            if (activePrompts.some(item => item.id === prompt.id))
                continue;
            atStart ? activePrompts.unshift(prompt) : activePrompts.push(prompt);
        }
    }
    exports.addStrToActive = addStrToActive;
    function log(message) {
        console.log(message);
    }
    exports.log = log;
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    exports.randomIntFromInterval = randomIntFromInterval;
    function isInSameCollection(promptA, promptB) {
        let targetCollection = undefined;
        for (const id in index_1.default.data.original) {
            const collection = index_1.default.data.original[id];
            const containsA = collection.some(item => item.id === promptA);
            const containsB = collection.some(item => item.id === promptB);
            if (containsA && containsB) {
                targetCollection = id;
                break;
            }
        }
        return targetCollection;
    }
    exports.isInSameCollection = isInSameCollection;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./client/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=promptBrowser.js.map