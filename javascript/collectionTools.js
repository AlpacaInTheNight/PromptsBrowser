if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.collectionTools = {};

PromptsBrowser.collectionTools.autogen = {
    collection: "",
    style: "",
}

PromptsBrowser.collectionTools.autogenStyleSelector = undefined;

/**
 * Auto generate previews timer.
 */
PromptsBrowser.collectionTools.generateNextTimer = 0;

PromptsBrowser.collectionTools.generateQueue = [];

PromptsBrowser.collectionTools.init = (wrapper) => {
	const collectionTools = document.createElement("div");
	collectionTools.className = "PBE_generalWindow PBE_collectionToolsWindow";
	collectionTools.id = "PBE_collectionTools";

	PromptsBrowser.DOMCache.collectionTools = collectionTools;

	PromptsBrowser.collectionTools.generateQueue = [];
	clearTimeout(PromptsBrowser.collectionTools.generateNextTimer);
	wrapper.appendChild(collectionTools);

    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.collectionTools.onCloseWindow;

    collectionTools.addEventListener("click", () => {
        PromptsBrowser.onCloseActiveWindow = PromptsBrowser.collectionTools.onCloseWindow;
    });
}

/**
 * Updates UI components that shows existing prompts
 */
PromptsBrowser.collectionTools.updateViews = () => {
	PromptsBrowser.knownPrompts.update();
	PromptsBrowser.collectionTools.update();
	PromptsBrowser.currentPrompts.update(true);
}

PromptsBrowser.collectionTools.updateCurrentCollection = () => {
	const {state, data} = PromptsBrowser;
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
		if(!PromptsBrowser.utils.checkFilter(item, filterSetup)) {
			if(selectedCollectionPrompts.includes(id)) {
				state.selectedCollectionPrompts = state.selectedCollectionPrompts.filter(selId => selId !== id);
			}

			continue;
		}
    }

	PromptsBrowser.db.saveJSONData(collectionToolsId);
	PromptsBrowser.db.updateMixedList();
	PromptsBrowser.collectionTools.updateViews();
}

PromptsBrowser.collectionTools.generateNextPreview = async () => {
	const {state, data} = PromptsBrowser;
	const {collectionToolsId} = state;
	const {generateQueue} = PromptsBrowser.collectionTools;
	const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
	const generateButton = PromptsBrowser.DOMCache.containers[state.currentContainer].generateButton;
	if(!textArea || !generateButton) return;

	const nextItem = generateQueue.shift();
	if(!nextItem) {
		PromptsBrowser.utils.log("Finished generating prompt previews.");

		state.selectedPrompt = undefined;
		state.filesIteration++;
		PromptsBrowser.db.updateMixedList();
		
		PromptsBrowser.previewSave.update();
		PromptsBrowser.knownPrompts.update();
		PromptsBrowser.currentPrompts.update(true);
		PromptsBrowser.collectionTools.update(true);
		return;
	}

    const message = `Generating preview for "${nextItem.id}". ${generateQueue.length} items in queue left. `;
	PromptsBrowser.utils.log(message);
    PromptsBrowser.collectionTools.updateAutogenInfo(message);

	state.selectedPrompt = nextItem.id;
	state.savePreviewCollection = collectionToolsId;

    if(nextItem.autogen && nextItem.autogen.collection && nextItem.autogen.style) {
        const delay = ms => new Promise(res => setTimeout(res, ms));

        const targetCollection = data.styles[nextItem.autogen.collection];
        if(targetCollection) {
            const targetStyle = targetCollection.find(item => item.name === nextItem.autogen.style);
            if(targetStyle) {
                PromptsBrowser.applyStyle(targetStyle, true, true);
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

	clearTimeout(PromptsBrowser.collectionTools.generateNextTimer);
	PromptsBrowser.collectionTools.generateNextTimer = setTimeout(PromptsBrowser.collectionTools.checkProgressState, 100);
}

PromptsBrowser.collectionTools.checkProgressState = () => {
	const {state} = PromptsBrowser;
	const resultsContainer = PromptsBrowser.DOMCache.containers[state.currentContainer].resultsContainer;
	if(!resultsContainer) return;

	/**
	 * Progress bar is being added during generation and is removed from the DOM after generation finished.
	 * Its presence serves as a marker when checking the state of generation.
	 */
	const progressBar = resultsContainer.querySelector(".progressDiv");

	if(!progressBar) {
		PromptsBrowser.db.savePromptPreview(false);
		PromptsBrowser.collectionTools.generateNextPreview();

		return;
	}

	clearTimeout(PromptsBrowser.collectionTools.generateNextTimer);
	PromptsBrowser.collectionTools.generateNextTimer = setTimeout(PromptsBrowser.collectionTools.checkProgressState, 500);
}

PromptsBrowser.collectionTools.onCloseWindow = () => {
	const wrapper = PromptsBrowser.DOMCache.collectionTools;
	if(!wrapper) return;

    clearTimeout(PromptsBrowser.collectionTools.generateNextTimer);
	wrapper.style.display = "none";
}

PromptsBrowser.collectionTools.onChangeAutogenerateType = (e) => {
    const {state, data} = PromptsBrowser;
    const value = e.currentTarget.value;
    if(!value) return;

    state.autoGenerateType = value;
}

PromptsBrowser.collectionTools.onGeneratePreviews = (e) => {
	const {state, data} = PromptsBrowser;
    const {autogen} = PromptsBrowser.collectionTools;
	const {selectedCollectionPrompts, collectionToolsId, autoGenerateType} = state;
    const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
	const targetCollection = data.original[collectionToolsId];
    let currentPrompt = "";

	if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;

	PromptsBrowser.collectionTools.generateQueue = [];

    if(autoGenerateType === "current" && textArea) {
        currentPrompt = textArea.value;
    }

	for(const promptId of selectedCollectionPrompts) {
		const prompt = targetCollection.find(item => item.id === promptId);
		if(!prompt) continue;

		const generateItem = {
			id: promptId,
		};

        if(autoGenerateType === "current") {
            generateItem.addPrompts = currentPrompt;

        } else if(autoGenerateType === "autogen") {
            if(prompt.autogen) generateItem.autogen = {...prompt.autogen};

        } else if(autoGenerateType === "selected") {
            if(prompt.autogen) generateItem.autogen = {...autogen};
        }

		PromptsBrowser.collectionTools.generateQueue.push(generateItem);
	}

	PromptsBrowser.collectionTools.generateNextPreview();
}

PromptsBrowser.collectionTools.onAssignAutogenStyle = (e) => {
    const {state, data} = PromptsBrowser;
    const {collection, style} = PromptsBrowser.collectionTools.autogen;
	const {selectedCollectionPrompts, collectionToolsId} = state;
	const targetCollection = data.original[collectionToolsId];

	if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;

	for(const promptId of selectedCollectionPrompts) {
		const prompt = targetCollection.find(item => item.id === promptId);
		if(!prompt) continue;

        if(collection && style) prompt.autogen = {collection, style};
        else delete prompt.autogen;
	}

	PromptsBrowser.collectionTools.updateCurrentCollection();
}

PromptsBrowser.collectionTools.onAddCategory = (e) => {
	const {state, data} = PromptsBrowser;
	const {selectedCollectionPrompts, collectionToolsId} = state;
	const targetCollection = data.original[collectionToolsId];
	const categorySelect = e.currentTarget.parentNode.querySelector(".PBE_categoryAction");
	if(!categorySelect) return;
	const categoryId = categorySelect.value;

	if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;

	for(const promptId of selectedCollectionPrompts) {
		const prompt = targetCollection.find(item => item.id === promptId);
		if(!prompt) continue;

		if(!prompt.category) prompt.category = [];
		if(!prompt.category.includes(categoryId)) prompt.category.push(categoryId);
	}

	PromptsBrowser.collectionTools.updateCurrentCollection();
}

PromptsBrowser.collectionTools.onRemoveCategory = (e) => {
	const {state, data} = PromptsBrowser;
	const {selectedCollectionPrompts, collectionToolsId} = state;
	const targetCollection = data.original[collectionToolsId];
	const categorySelect = e.currentTarget.parentNode.querySelector(".PBE_categoryAction");
	if(!categorySelect) return;
	const categoryId = categorySelect.value;

	if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;

	for(const promptId of selectedCollectionPrompts) {
		const prompt = targetCollection.find(item => item.id === promptId);
		if(!prompt) continue;

		if(!prompt.category) continue;
		if(prompt.category.includes(categoryId)) prompt.category = prompt.category.filter(id => id !== categoryId);
	}

	PromptsBrowser.collectionTools.updateCurrentCollection();
}

PromptsBrowser.collectionTools.onAddTags = (e) => {
	const {state, data} = PromptsBrowser;
	const {selectedCollectionPrompts, collectionToolsId} = state;
	const targetCollection = data.original[collectionToolsId];
	const tagsInput = e.currentTarget.parentNode.querySelector(".PBE_tagsAction");
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

	PromptsBrowser.collectionTools.updateCurrentCollection();
}

PromptsBrowser.collectionTools.onRemoveTags = (e) => {
	const {state, data} = PromptsBrowser;
	const {selectedCollectionPrompts, collectionToolsId} = state;
	const targetCollection = data.original[collectionToolsId];
	const tagsInput = e.currentTarget.parentNode.querySelector(".PBE_tagsAction");
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

	PromptsBrowser.collectionTools.updateCurrentCollection();
}

PromptsBrowser.collectionTools.onSelectItem = (e) => {
	const {state, data} = PromptsBrowser;
	const id = e.currentTarget.dataset.id;
	if(!id) return;

	if(e.shiftKey) {
		state.editingPrompt = id;
		PromptsBrowser.promptEdit.update();

		return;
	}

	if(!state.selectedCollectionPrompts.includes(id)) {
		state.selectedCollectionPrompts.push(id);
		e.currentTarget.parentNode.classList.add("selected");
	} else {
		state.selectedCollectionPrompts = state.selectedCollectionPrompts.filter(promptId => promptId !== id);
		e.currentTarget.parentNode.classList.remove("selected");
	}

    PromptsBrowser.collectionTools.updateSelectedInfo();
}

PromptsBrowser.collectionTools.onToggleSelected = (e) => {
	const {promptsFilter} = PromptsBrowser.state;
	const {state, data} = PromptsBrowser;
	const {collectionToolsId} = state;
	const filterSetup = promptsFilter["collectionTools"];
	const targetCollection = data.original[collectionToolsId];
	if(!targetCollection) return;

	if(state.selectedCollectionPrompts.length) {
		state.selectedCollectionPrompts = [];
		PromptsBrowser.collectionTools.update();
		return;
	}

	state.selectedCollectionPrompts = [];

	for(const item of targetCollection) {
		if(PromptsBrowser.utils.checkFilter(item, filterSetup)) state.selectedCollectionPrompts.push(item.id);
	}

	PromptsBrowser.collectionTools.update();
}

/**
 * Deletes selected prompts after a user confirmation
 */
PromptsBrowser.collectionTools.onDeleteSelected = (e) => {
	const {state, data} = PromptsBrowser;
	const {selectedCollectionPrompts, collectionToolsId} = state;
	const targetCollection = data.original[collectionToolsId];

	if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection) return;

	if( confirm(`Remove ${selectedCollectionPrompts.length} prompts from catalogue "${collectionToolsId}"?`) ) {
		data.original[collectionToolsId] = targetCollection.filter(prompt => !selectedCollectionPrompts.includes(prompt.id));

		for(const deletedPromptId of selectedCollectionPrompts) {
			PromptsBrowser.db.movePreviewImage(deletedPromptId, collectionToolsId, collectionToolsId, "delete");
		}
        PromptsBrowser.db.saveJSONData(collectionToolsId);
		PromptsBrowser.db.updateMixedList();

		state.selectedCollectionPrompts = [];
		PromptsBrowser.collectionTools.updateViews();
	}
}

/**
 * Moves or copies the selected prompts to the selected collection.
 * By default moves prompts.
 * @param {*} e - mouse event object.
 * @param {*} isCopy if copy actions is required instead of move action.
 */
PromptsBrowser.collectionTools.onMoveSelected = (e, isCopy = false) => {
	const {state, data} = PromptsBrowser;
	const {selectedCollectionPrompts, collectionToolsId, copyOrMoveTo} = state;
	const targetCollection = data.original[collectionToolsId];

	if(!selectedCollectionPrompts || !selectedCollectionPrompts.length || !targetCollection || !copyOrMoveTo) return;

	const to = state.copyOrMoveTo;
	const from = state.collectionToolsId;
	if(!to || !from) return;
	if(!PromptsBrowser.data.original[to] || !PromptsBrowser.data.original[from]) return;

	let message = `${isCopy ? "Copy" : "Move"} ${selectedCollectionPrompts.length} prompts`;
	message += ` from catalogue "${collectionToolsId}" to catalogue "${copyOrMoveTo}"?`;

	if( confirm(message) ) {

		for(const promptId of selectedCollectionPrompts) {
			const originalItem = PromptsBrowser.data.original[from].find(item => item.id === promptId);
			if(!originalItem) continue;

            if(isCopy) {
                if(PromptsBrowser.data.original[to].some(item => item.id === promptId)) continue;

                PromptsBrowser.data.original[to].push(JSON.parse(JSON.stringify(originalItem)));

                PromptsBrowser.db.movePreviewImage(promptId, from, to, "copy");

            } else {
                if(!PromptsBrowser.data.original[to].some(item => item.id === promptId)) {
                    PromptsBrowser.data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
                }
                
                PromptsBrowser.data.original[from] = PromptsBrowser.data.original[from].filter(item => item.id !== promptId);

                PromptsBrowser.db.movePreviewImage(promptId, from, to, "move");
            }
		}

        if(isCopy) {
            PromptsBrowser.db.saveJSONData(to, true);

        } else {
            PromptsBrowser.db.saveJSONData(to, true);
            PromptsBrowser.db.saveJSONData(from, true);
        }
        PromptsBrowser.db.updateMixedList();

		state.selectedCollectionPrompts = [];
		PromptsBrowser.collectionTools.updateViews();
	}
}

PromptsBrowser.collectionTools.onCopySelected = (e) => PromptsBrowser.collectionTools.onMoveSelected(e, true);


PromptsBrowser.collectionTools.onChangeAutogenCollection = (e) => {
    const {state, data} = PromptsBrowser;
    const collection = e.currentTarget.value;
    let setFirst = false;

    PromptsBrowser.collectionTools.autogen.collection = collection;

    if(collection && PromptsBrowser.collectionTools.autogenStyleSelector) {
        let styleOptions = "";

        const targetCollection = data.styles[collection];
        if(targetCollection) {
            for(const styleItem of targetCollection) {
                if(!setFirst) {
                    PromptsBrowser.collectionTools.autogen.style = styleItem.name;
                    PromptsBrowser.collectionTools.autogenStyleSelector.value = styleItem.name;
                    setFirst = true;
                }
                styleOptions += `<option value="${styleItem.name}">${styleItem.name}</option>`;
            }
        }

        PromptsBrowser.collectionTools.autogenStyleSelector.innerHTML = styleOptions;
    }
}

PromptsBrowser.collectionTools.onChangeAutogenStyle = (e) => {
    const {state, data} = PromptsBrowser;
    const style = e.currentTarget.value;

    PromptsBrowser.collectionTools.autogen.style = style;
}

PromptsBrowser.collectionTools.showHeader = (wrapper) => {
	PromptsBrowser.promptsFilter.update(wrapper, "collectionTools");

}

PromptsBrowser.collectionTools.showPromptsDetailed = (wrapper) => {
	const {promptsFilter} = PromptsBrowser.state;
	const filterSetup = promptsFilter["collectionTools"];
	const {state, data} = PromptsBrowser;
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
		if(!PromptsBrowser.utils.checkFilter(item, filterSetup)) {
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
		selectArea.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(id, collectionToolsId);

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

		bottomContainer.appendChild(tagsContainer);
		bottomContainer.appendChild(categoriesContainer);

		contentArea.appendChild(topContainer);
		contentArea.appendChild(bottomContainer);

		promptContainer.appendChild(selectArea);
		promptContainer.appendChild(contentArea);

		selectArea.addEventListener("click", PromptsBrowser.collectionTools.onSelectItem);

		if(selectedCollectionPrompts.includes(id)) promptContainer.classList.add("selected");

		wrapper.appendChild(promptContainer);
	}
}

PromptsBrowser.collectionTools.showPromptsShort = (wrapper) => {

}

PromptsBrowser.collectionTools.showCopyOrMove = (wrapper) => {
	const {state} = PromptsBrowser;
	const {collectionToolsId} = state;

	const collectionSelect = document.createElement("select");
	collectionSelect.className = "PBE_select";

	const moveButton = document.createElement("div")
	moveButton.innerText = "Move";
	moveButton.className = "PBE_button";
	moveButton.title = "Move selected prompts to the target collection";
	moveButton.addEventListener("click", PromptsBrowser.collectionTools.onMoveSelected);

	const copyButton = document.createElement("div")
	copyButton.innerText = "Copy";
	copyButton.className = "PBE_button";
	copyButton.title = "Copy selected prompts to the target collection";
	copyButton.addEventListener("click", PromptsBrowser.collectionTools.onCopySelected);

	let options = "";
	for(const collectionId in PromptsBrowser.data.original) {
		if(collectionId === collectionToolsId) continue;
		if(!state.copyOrMoveTo) state.copyOrMoveTo = collectionId;

		options += `<option value="${collectionId}">${collectionId}</option>`;
	}

	collectionSelect.innerHTML = options;

	collectionSelect.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
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

PromptsBrowser.collectionTools.showCategoryAction = (wrapper) => {
	const categories = PromptsBrowser.data.categories;
	let options = "";

	const categorySelect = document.createElement("select");
	const addButton = document.createElement("div");
	const removeButton = document.createElement("div");

	categorySelect.classList = "PBE_select PBE_categoryAction";
	addButton.className = "PBE_button";
	addButton.title = "Add selected category to all selected prompts";
	removeButton.className = "PBE_button";

	addButton.innerText = "Add";
	removeButton.title = "Remove selected category from all selected prompts";
	removeButton.innerText = "Remove";

	for(const categoryItem of categories) {
		if(!categorySelect.value) categorySelect.value = categoryItem;
		options += `<option value="${categoryItem}">${categoryItem}</option>`;
	}
	categorySelect.innerHTML = options;

	addButton.addEventListener("click", PromptsBrowser.collectionTools.onAddCategory);
	removeButton.addEventListener("click", PromptsBrowser.collectionTools.onRemoveCategory);

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

PromptsBrowser.collectionTools.showTagsAction = (wrapper) => {

	const tagsInput = document.createElement("input");
	const addButton = document.createElement("div");
	const removeButton = document.createElement("div");

	tagsInput.placeholder = "tag1, tag2, tag3";

	tagsInput.className = "PBE_input PBE_tagsAction";
	addButton.className = "PBE_button";
	removeButton.className = "PBE_button";
	addButton.title = "Add target tags to all selected prompts";
	removeButton.title = "Remove target tags from all selected prompts";

	addButton.innerText = "Add";
	removeButton.innerText = "Remove";

	addButton.addEventListener("click", PromptsBrowser.collectionTools.onAddTags);
	removeButton.addEventListener("click", PromptsBrowser.collectionTools.onRemoveTags);

	const container = document.createElement("fieldset");
	container.className = "PBE_fieldset";
	const legend = document.createElement("legend");
	legend.innerText = "Tags";

	container.appendChild(legend);
	container.appendChild(tagsInput);
	container.appendChild(addButton);
	container.appendChild(removeButton);

	wrapper.appendChild(container);

    PromptsBrowser.tagTooltip.add(tagsInput, true);
}

PromptsBrowser.collectionTools.showAutogenStyle = (wrapper) => {
    const {state, data, makeElement, makeSelect} = PromptsBrowser;
    const {collection, style} = PromptsBrowser.collectionTools.autogen;

    const container = makeElement({element: "fieldset", className: "PBE_fieldset"});
    const legend = makeElement({element: "legend", content: "Autogenerate style"});

    //collection select
    const colOptions = [{id: "__none", name: "None"}];

    for(const colId in data.styles) colOptions.push({id: colId, name: colId});
    const stylesCollectionsSelect = makeSelect({
        className: "PBE_select", value: collection, options: colOptions,
        onChange: PromptsBrowser.collectionTools.onChangeAutogenCollection
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
        className: "PBE_select", value: style || "", options: styleOptions,
        onChange: PromptsBrowser.collectionTools.onChangeAutogenStyle
    });

    container.appendChild(styleSelect);
    PromptsBrowser.collectionTools.autogenStyleSelector = styleSelect;

    //assign button
    const assignButton = makeElement({element: "div", className: "PBE_button", content: "Assign"});
    assignButton.addEventListener("click", PromptsBrowser.collectionTools.onAssignAutogenStyle);
    container.appendChild(assignButton);

    //append to wrapper
    container.appendChild(legend);
	wrapper.appendChild(container);
}

PromptsBrowser.collectionTools.showAutogenerate = (wrapper) => {
    const {state, data, makeElement, makeSelect} = PromptsBrowser;

    const generateButton = makeElement({element: "div", className: "PBE_button", content: "Generate"});
	generateButton.addEventListener("click", PromptsBrowser.collectionTools.onGeneratePreviews);

    const generateTypeSelect = makeSelect({
        className: "PBE_select", value: state.autoGenerateType,
        options: [
            {id: "prompt", name: "Prompt only"},
            {id: "current", name: "With current prompts"},
            {id: "autogen", name: "With prompt autogen style"},
            {id: "selected", name: "With selected autogen style"},
        ],
        onChange: PromptsBrowser.collectionTools.onChangeAutogenerateType
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

PromptsBrowser.collectionTools.showActions = (wrapper) => {

	const toggleAllButton = document.createElement("div");
	toggleAllButton.innerText = "Toggle all";
	toggleAllButton.className = "PBE_button";
	toggleAllButton.title = "Select and unselect all visible prompts";
	toggleAllButton.addEventListener("click", PromptsBrowser.collectionTools.onToggleSelected);

	const deleteButton = document.createElement("div");
	deleteButton.innerText = "Delete selected";
	deleteButton.className = "PBE_button";
	deleteButton.title = "Delete selected prompts";
	deleteButton.addEventListener("click", PromptsBrowser.collectionTools.onDeleteSelected);

	const container = document.createElement("fieldset");
	container.className = "PBE_fieldset";
	const legend = document.createElement("legend");
	legend.innerText = "Actions";

	container.appendChild(legend);
	container.appendChild(toggleAllButton);
	container.appendChild(deleteButton);

	wrapper.appendChild(container);

	if(Object.keys(PromptsBrowser.data.original).length > 1) PromptsBrowser.collectionTools.showCopyOrMove(wrapper);
	PromptsBrowser.collectionTools.showCategoryAction(wrapper);
	PromptsBrowser.collectionTools.showTagsAction(wrapper);
	PromptsBrowser.collectionTools.showAutogenStyle(wrapper);
	PromptsBrowser.collectionTools.showAutogenerate(wrapper);
}

PromptsBrowser.collectionTools.updateAutogenInfo = (status, wrapper) => {
    if(!wrapper) wrapper = document.querySelector(".PBE_collectionToolsAutogenInfo");
    if(!wrapper) return;

    wrapper.innerText = status;
}

PromptsBrowser.collectionTools.updateSelectedInfo = (wrapper) => {
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

PromptsBrowser.collectionTools.showStatus = (wrapper) => {
    const {state, data, makeElement} = PromptsBrowser;

    const autogenStatus = makeElement({element: "div", className: "PBE_collectionToolsAutogenInfo"});
    const selectedStatus = makeElement({element: "div", className: "PBE_collectionToolsSelectedInfo"});

    PromptsBrowser.collectionTools.updateAutogenInfo("", autogenStatus);
    PromptsBrowser.collectionTools.updateSelectedInfo(selectedStatus);

    wrapper.appendChild(autogenStatus);
    wrapper.appendChild(selectedStatus);
}

PromptsBrowser.collectionTools.update = (ifShown = false) => {
	const {state, data, makeElement} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.collectionTools;
	clearTimeout(PromptsBrowser.collectionTools.generateNextTimer);

	if(!wrapper || !data) return;
	if(ifShown && wrapper.style.display !== "flex") return;

	if(!state.collectionToolsId) {
		for(const colId in data.original) {
			state.collectionToolsId = colId;
			break;
		}
	}

	if(!state.collectionToolsId) return;

    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.collectionTools.onCloseWindow;
	wrapper.innerHTML = "";
	wrapper.style.display = "flex";

	const footerBlock = document.createElement("div");
	const closeButton = document.createElement("button");
	footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_toolsFooter";
	closeButton.innerText = "Close";
	closeButton.className = "PBE_button";

	closeButton.addEventListener("click", PromptsBrowser.collectionTools.onCloseWindow);

	const headerBlock = document.createElement("div");
	headerBlock.className = "PBE_collectionToolsHeader";

	const contentBlock = document.createElement("div");
	contentBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";

    const statusBlock = makeElement({element: "div", className: "PBE_collectionToolsStatus PBE_row"});

	const actionsBlock = document.createElement("div");
	actionsBlock.className = "PBE_collectionToolsActions PBE_row";

	PromptsBrowser.collectionTools.showHeader(headerBlock);
	PromptsBrowser.collectionTools.showPromptsDetailed(contentBlock);

	footerBlock.appendChild(closeButton);

	wrapper.appendChild(headerBlock);
	wrapper.appendChild(contentBlock);
	wrapper.appendChild(statusBlock);
	wrapper.appendChild(actionsBlock);
	wrapper.appendChild(footerBlock);

    PromptsBrowser.collectionTools.showStatus(statusBlock);
    PromptsBrowser.collectionTools.showActions(actionsBlock);

}
