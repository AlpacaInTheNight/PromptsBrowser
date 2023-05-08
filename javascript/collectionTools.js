
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.collectionTools = {};

PromptsBrowser.collectionTools.init = (wrapper) => {
	const collectionTools = document.createElement("div");
	collectionTools.className = "PBE_generalWindow PBE_collectionToolsWindow";
	collectionTools.id = "PBE_collectionTools";

	PromptsBrowser.DOMCache.collectionTools = collectionTools;

	wrapper.appendChild(collectionTools);
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
	const {state} = PromptsBrowser;
	const {collectionToolsId} = state;
	if(!collectionToolsId) return;

	PromptsBrowser.db.saveJSONData(collectionToolsId);
	PromptsBrowser.db.updateMixedList();
	PromptsBrowser.collectionTools.updateViews();
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

		PromptsBrowser.db.saveJSONData(collectionToolsId);
		for(const deletedPromptId of selectedCollectionPrompts) {
			PromptsBrowser.db.movePreviewImage(deletedPromptId, collectionToolsId, collectionToolsId, "delete");
		}
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

				PromptsBrowser.db.saveJSONData(to);
				PromptsBrowser.db.movePreviewImage(promptId, from, to, "copy");
				PromptsBrowser.db.updateMixedList();

			} else {
				PromptsBrowser.data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
				PromptsBrowser.data.original[from] = PromptsBrowser.data.original[from].filter(item => item.id !== promptId);

				PromptsBrowser.db.saveJSONData(to);
				PromptsBrowser.db.saveJSONData(from);
				PromptsBrowser.db.movePreviewImage(promptId, from, to, "move");
				PromptsBrowser.db.updateMixedList();
			}
		}

		state.selectedCollectionPrompts = [];
		PromptsBrowser.collectionTools.updateViews();
	}
}

PromptsBrowser.collectionTools.onCopySelected = (e) => PromptsBrowser.collectionTools.onMoveSelected(e, true);

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
}

PromptsBrowser.collectionTools.update = (ifShown = false) => {
	const {state, data} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.collectionTools;

	if(!wrapper || !data) return;
	if(ifShown && wrapper.style.display !== "flex") return;

	if(!state.collectionToolsId) {
		for(const colId in data.original) {
			state.collectionToolsId = colId;
			break;
		}
	}

	if(!state.collectionToolsId) return;

	wrapper.innerHTML = "";
	wrapper.style.display = "flex";

	const footerBlock = document.createElement("div");
	const closeButton = document.createElement("button");
	footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_toolsFooter";
	closeButton.innerText = "Close";
	closeButton.className = "PBE_button";

	closeButton.addEventListener("click", (e) => {
		wrapper.style.display = "none";
	});

	const headerBlock = document.createElement("div");
	headerBlock.className = "PBE_collectionToolsHeader";

	const contentBlock = document.createElement("div");
	contentBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";

	const actionsBlock = document.createElement("div");
	actionsBlock.className = "PBE_collectionToolsActions PBE_row";

	PromptsBrowser.collectionTools.showHeader(headerBlock);
	PromptsBrowser.collectionTools.showPromptsDetailed(contentBlock);
	PromptsBrowser.collectionTools.showActions(actionsBlock);

	footerBlock.appendChild(closeButton);

	wrapper.appendChild(headerBlock);
	wrapper.appendChild(contentBlock);
	wrapper.appendChild(actionsBlock);
	wrapper.appendChild(footerBlock);
}
