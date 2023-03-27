
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.promptEdit = {};

PromptsBrowser.promptEdit.init = (wrapper) => {
	const promptEdit = document.createElement("div");
	promptEdit.className = "PBE_promptEdit PBE_generalWindow";

	PromptsBrowser.DOMCache.promptEdit = promptEdit;
	wrapper.appendChild(promptEdit);
}

PromptsBrowser.promptEdit.addCollectionSelector = (wrapper) => {
	const {united} = PromptsBrowser.data;
	const {state} = PromptsBrowser;
	const targetItem = united.find(item => item.id === state.editingPrompt);
	if(!targetItem) return;

	if(!targetItem.collections) return;
	if(targetItem.collections.length === 1) return;

	const collectionSelect = document.createElement("select");

	let options = "";
	for(const collectionItem of targetItem.collections) {
		options += `<option value="${collectionItem}">${collectionItem}</option>`;
	}
	collectionSelect.innerHTML = options;

	if(state.editTargetCollection) collectionSelect.value = state.editTargetCollection;

	collectionSelect.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
		state.editTargetCollection = value || undefined;

		PromptsBrowser.promptEdit.update();
	});

	wrapper.appendChild(collectionSelect);
}

PromptsBrowser.promptEdit.addMoveBlock = (wrapper) => {
	const {united} = PromptsBrowser.data;
	const {state} = PromptsBrowser;
	const copyOrMoveBlock = document.createElement("div");
	const collectionSelect = document.createElement("select");
	const copyButton = document.createElement("button");
	const moveButton = document.createElement("button");
	const targetItem = united.find(item => item.id === state.editingPrompt);
	if(!targetItem) return;
	let atLestOnePossibleCollection = false;

	copyOrMoveBlock.className = "PBE_rowBlock";
	copyButton.className = "PBE_button";
	moveButton.className = "PBE_button";

	copyButton.innerText = "Copy";
	moveButton.innerText = "Move";

	let options = "";
	for(const collectionId in PromptsBrowser.data.original) {
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
		const value = e.currentTarget.value;
		state.copyOrMoveTo = value || undefined;
	});

	copyButton.addEventListener("click", (e) => {
		const to = state.copyOrMoveTo;
		const from = state.editTargetCollection;
		if(!to || !from) return;
		if(!PromptsBrowser.data.original[to] || !PromptsBrowser.data.original[from]) return;

		const originalItem = PromptsBrowser.data.original[from].find(item => item.id === state.editingPrompt);
		if(!originalItem) return;

		if(PromptsBrowser.data.original[to].some(item => item.id === state.editingPrompt)) return;

		PromptsBrowser.data.original[to].push(JSON.parse(JSON.stringify(originalItem)));

		PromptsBrowser.db.saveJSONData(to);
		PromptsBrowser.db.movePreviewImage(state.editingPrompt, from, to, "copy");
		PromptsBrowser.db.updateMixedList();
		PromptsBrowser.promptEdit.update();
	});

	moveButton.addEventListener("click", (e) => {
		const to = state.copyOrMoveTo;
		const from = state.editTargetCollection;
		if(!to || !from) return;
		if(!PromptsBrowser.data.original[to] || !PromptsBrowser.data.original[from]) return;

		const originalItem = PromptsBrowser.data.original[from].find(item => item.id === state.editingPrompt);
		if(!originalItem) return;

		PromptsBrowser.data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
		PromptsBrowser.data.original[from] = PromptsBrowser.data.original[from].filter(item => item.id !== state.editingPrompt);

		PromptsBrowser.db.saveJSONData(to);
		PromptsBrowser.db.saveJSONData(from);
		PromptsBrowser.db.movePreviewImage(state.editingPrompt, from, to, "move");
		PromptsBrowser.db.updateMixedList();
		PromptsBrowser.promptEdit.update();
	});

	copyOrMoveBlock.appendChild(collectionSelect);
	copyOrMoveBlock.appendChild(copyButton);
	copyOrMoveBlock.appendChild(moveButton);

	wrapper.appendChild(copyOrMoveBlock);

}

PromptsBrowser.promptEdit.saveEdit = () => {
	const {united} = PromptsBrowser.data;
	const {state} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.promptEdit;
	const collection = PromptsBrowser.data.original[state.editTargetCollection];

	wrapper.style.display = "none";
	if(!state.editItem || !collection) return;
	const commentBlock = PromptsBrowser.DOMCache.promptEdit.querySelector("#PBE_commentArea");
	const comment = commentBlock ? commentBlock.value : "";

	state.editItem.comment = comment;
	if(!state.editItem.comment) delete state.editItem.comment;

	const indexInOrigin = collection.findIndex(item => item.id === state.editingPrompt);
	if(indexInOrigin !== -1) collection[indexInOrigin] = state.editItem;
	else collection.push(state.editItem);

	const targetItem = united.find(item => item.id === state.editingPrompt);

	if(targetItem) {
		targetItem.tags = [];
		targetItem.category = [];

		for(const originalId in PromptsBrowser.data.original) {
			const originalCollection = PromptsBrowser.data.original[originalId];

			const collectionPrompt = originalCollection.find(item => item.id === state.editingPrompt);
			if(!collectionPrompt) continue;

			if(collectionPrompt.tags) {
				collectionPrompt.tags.forEach(item => {
					if(!targetItem.tags.includes(item)) targetItem.tags.push(item);
				});
			}

			if(collectionPrompt.category) {
				collectionPrompt.category.forEach(item => {
					if(!targetItem.category.includes(item)) targetItem.category.push(item);
				});
			}
		}
	}

	PromptsBrowser.db.saveJSONData(state.editTargetCollection);

	state.editTargetCollection = undefined;
	state.editingPrompt = undefined;

	PromptsBrowser.knownPrompts.update();
}

PromptsBrowser.promptEdit.getTargetItem = () => {
	const {united} = PromptsBrowser.data;
	const {state} = PromptsBrowser;
	const targetItem = united.find(item => item.id === state.editingPrompt);

	if(!targetItem) return false;
	if(!targetItem.collections) return false;
	if(!targetItem.collections[0]) return false;

	if(!targetItem.collections.includes(state.editTargetCollection)) {
		state.editTargetCollection = targetItem.collections[0];
	}

	let collection = PromptsBrowser.data.original[state.editTargetCollection];
	if(!collection) return false;

	const originalItem = collection.find(item => item.id === state.editingPrompt);

	if(!originalItem) return false;

	state.editItem = JSON.parse(JSON.stringify(originalItem));
	return state.editItem;
}

PromptsBrowser.promptEdit.update = (targetItem) => {
	const {state} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.promptEdit;
	if(!wrapper || !state.editingPrompt) return;
	if(!targetItem) targetItem = PromptsBrowser.promptEdit.getTargetItem();
	if(!targetItem) return;
	wrapper.innerHTML = "";

	const headerBlock = document.createElement("div");
	const headerTitle = document.createElement("div");
	headerBlock.className = "PBE_rowBlock";
	headerTitle.className = "PBE_promptEditTitle";
	headerTitle.innerText = state.editingPrompt;

	headerBlock.appendChild(headerTitle);
	PromptsBrowser.promptEdit.addCollectionSelector(headerBlock);

	wrapper.style.display = "flex";
	wrapper.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(state.editingPrompt, state.editTargetCollection);
	
	const currentTagsBlock = document.createElement("div");
	const currentCategoriesBlock = document.createElement("div");
	const addTagBlock = document.createElement("div");
	const addCategoryBlock = document.createElement("div");
	const footerBlock = document.createElement("div");

	const tagsTitle = document.createElement("div");
	const tagsList = document.createElement("div");

	const tagInput = document.createElement("input");
	const addTagButton = document.createElement("button");

	const categoriesTitle = document.createElement("div");
	const categoriesList = document.createElement("div");

	const categorySelect = document.createElement("select");
	const addCategoryButton = document.createElement("button");

	const commentArea = document.createElement("textarea");

	const cancelButton = document.createElement("button");
	const saveButton = document.createElement("button");

	currentTagsBlock.className = "PBE_rowBlock";
	currentCategoriesBlock.className = "PBE_rowBlock";
	addTagBlock.className = "PBE_rowBlock";
	addCategoryBlock.className = "PBE_rowBlock";
	footerBlock.className = "PBE_rowBlock";
	tagsList.className = "PBE_List PBE_Scrollbar";
	categoriesList.className = "PBE_List PBE_Scrollbar";
	commentArea.className = "PBE_Textarea PBE_Scrollbar";

	tagInput.id = "PBE_addTagInput";
	categorySelect.id = "PBE_addCategorySelect";
	commentArea.id = "PBE_commentArea";
	tagsTitle.innerText = "Tags:";
	categoriesTitle.innerText = "Categories:";
	addTagButton.innerText = "Add tag";
	addTagButton.className = "PBE_button";
	addCategoryButton.innerText = "Add category";
	addCategoryButton.className = "PBE_button";
	cancelButton.innerText = "Cancel";
	cancelButton.className = "PBE_button";
	saveButton.innerText = "Save";
	saveButton.className = "PBE_button";

	commentArea.value = targetItem.comment || "";

	for(const tagItem of targetItem.tags) {
		const tagElement = document.createElement("div");
		tagElement.innerText = tagItem;

		tagElement.addEventListener("click", (e) => {
			if(!e.metaKey && !e.ctrlKey) return;
			const tagId = e.currentTarget.innerText;

			targetItem.tags = targetItem.tags.filter(item => item !== tagId);
			PromptsBrowser.promptEdit.update(targetItem);
		});

		tagsList.appendChild(tagElement);
	}

	for(const categoryItem of targetItem.category) {
		const categoryElement = document.createElement("div");
		categoryElement.innerText = categoryItem;

		categoryElement.addEventListener("click", (e) => {
			if(!e.metaKey && !e.ctrlKey) return;
			const categoryId = e.currentTarget.innerText;

			targetItem.category = targetItem.category.filter(item => item !== categoryId);
		
			PromptsBrowser.promptEdit.update(targetItem);
		});

		categoriesList.appendChild(categoryElement);
	}

	const categories = PromptsBrowser.data.categories;
	let options = "";

	for(const categoryItem of categories) {
		if(targetItem.category.includes(categoryItem)) continue;
		if(!categorySelect.value) categorySelect.value = categoryItem;
		options += `<option value="${categoryItem}">${categoryItem}</option>`;
	}
	categorySelect.innerHTML = options;

	addTagButton.addEventListener("click", (e) => {
		const inputElement = wrapper.querySelector("#PBE_addTagInput");
		if(!inputElement) return;
		const value = inputElement.value;

		if(targetItem.tags.includes(value)) return;
		targetItem.tags.push(value);

		PromptsBrowser.promptEdit.update(targetItem);
	});

	addCategoryButton.addEventListener("click", (e) => {
		const selectElement = wrapper.querySelector("#PBE_addCategorySelect");
		if(!selectElement) return;
		const value = selectElement.value;

		if(targetItem.category.includes(value)) return;
		targetItem.category.push(value);

		PromptsBrowser.promptEdit.update(targetItem);
	});

	commentArea.addEventListener("change", (e) => targetItem.comment = e.currentTarget.value);

	cancelButton.addEventListener("click", (e) => {
		state.editingPrompt = undefined;
		wrapper.style.display = "none";
	});

	saveButton.addEventListener("click", PromptsBrowser.promptEdit.saveEdit);

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

	if(Object.keys(PromptsBrowser.data.original).length > 1) {
		PromptsBrowser.promptEdit.addMoveBlock(wrapper);
	}

	wrapper.appendChild(currentTagsBlock);
	wrapper.appendChild(currentCategoriesBlock);

	wrapper.appendChild(addTagBlock);
	wrapper.appendChild(addCategoryBlock);

	wrapper.appendChild(commentArea);

	wrapper.appendChild(footerBlock);
}
