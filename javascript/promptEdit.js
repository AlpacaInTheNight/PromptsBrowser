
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.promptEdit = {};

PromptsBrowser.promptEdit.init = (wrapper) => {
	const promptEdit = document.createElement("div");
	promptEdit.className = "PBE_promptEdit PBE_generalWindow";

	PromptsBrowser.DOMCache.promptEdit = promptEdit;
	wrapper.appendChild(promptEdit);

    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.promptEdit.onCloseWindow;

    promptEdit.addEventListener("click", () => {
        PromptsBrowser.onCloseActiveWindow = PromptsBrowser.promptEdit.onCloseWindow;
    });
}

PromptsBrowser.promptEdit.onCloseWindow = () => {
    const {state} = PromptsBrowser;
    const wrapper = PromptsBrowser.DOMCache.promptEdit;
    if(!wrapper || !state.editingPrompt) return;

    state.editingPrompt = undefined;
    wrapper.style.display = "none";
}

PromptsBrowser.promptEdit.onAddTags = (targetItem, inputElement) => {
    if(!inputElement || !targetItem) return;
    const value = inputElement.value;

    let tags = value.split(",").map(item => item.trim());

    //removing empty tags
    tags = tags.filter(item => item);

    for(const tag of tags) {
        if(targetItem.tags.includes(tag)) continue;
        targetItem.tags.push(tag);
    }

    PromptsBrowser.promptEdit.update(targetItem);
}

PromptsBrowser.promptEdit.onChangeAutogenCollection = (value, prompt) => {
    if(!prompt) return;
    const {data} = PromptsBrowser;

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

    PromptsBrowser.promptEdit.update(prompt);
}

PromptsBrowser.promptEdit.onChangeAutogenStyle = (value, prompt) => {
    if(!prompt || !value) return;

    if(!prompt.autogen) prompt.autogen = {};
    prompt.autogen.style = value;

    PromptsBrowser.promptEdit.update(prompt);
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

        PromptsBrowser.db.movePreviewImage(state.editingPrompt, from, to, "copy");
		PromptsBrowser.db.saveJSONData(to, true);
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

        if(!PromptsBrowser.data.original[to].some(item => item.id === state.editingPrompt)) {
            PromptsBrowser.data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
        }
		
		PromptsBrowser.data.original[from] = PromptsBrowser.data.original[from].filter(item => item.id !== state.editingPrompt);

        PromptsBrowser.db.movePreviewImage(state.editingPrompt, from, to, "move");
		PromptsBrowser.db.saveJSONData(to, true);
		PromptsBrowser.db.saveJSONData(from, true);
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

	PromptsBrowser.db.saveJSONData(state.editTargetCollection);
    PromptsBrowser.db.updateMixedList();

	state.editTargetCollection = undefined;
	state.editingPrompt = undefined;

	PromptsBrowser.knownPrompts.update();
	PromptsBrowser.collectionTools.update(true);
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

PromptsBrowser.promptEdit.showAddSetup = (wrapper) => {
	const targetItem = PromptsBrowser.promptEdit.getTargetItem();
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
	sisterTagsAfterInput.className = "PBE_promptEdit_addAfter";
	sisterTagsAfterInput.type = "text";
	sisterTagsAfterInput.value = addAfter;

	sisterTagsAfter.appendChild(sisterTagsAfterTitle);
	sisterTagsAfter.appendChild(sisterTagsAfterInput);


	const sisterTagsStart = document.createElement("div");
	const sisterTagsStartTitle = document.createElement("label");
	const sisterTagsStartInput = document.createElement("input");

	sisterTagsStart.className = "PBE_rowBlock";
	sisterTagsStartTitle.textContent = "Add prompts at the start:";
	sisterTagsStartInput.className = "PBE_promptEdit_addStart";
	sisterTagsStartInput.type = "text";
	sisterTagsStartInput.value = addStart;

	sisterTagsStart.appendChild(sisterTagsStartTitle);
	sisterTagsStart.appendChild(sisterTagsStartInput);


	const sisterTagsEnd = document.createElement("div");
	const sisterTagsEndTitle = document.createElement("label");
	const sisterTagsEndInput = document.createElement("input");

	sisterTagsEnd.className = "PBE_rowBlock";
	sisterTagsEndTitle.textContent = "Add prompts at the end:";
	sisterTagsEndInput.className = "PBE_promptEdit_addEnd";
	sisterTagsEndInput.type = "text";
	sisterTagsEndInput.value = addEnd;

	sisterTagsEnd.appendChild(sisterTagsEndTitle);
	sisterTagsEnd.appendChild(sisterTagsEndInput);



	wrapper.appendChild(addAtStartBlock);
	wrapper.appendChild(sisterTagsAfter);
	wrapper.appendChild(sisterTagsStart);
	wrapper.appendChild(sisterTagsEnd);
}

PromptsBrowser.promptEdit.showAutoGenBlock = (wrapper, prompt) => {
    if(!wrapper || !prompt) return;
    const {state, data, makeElement, makeSelect} = PromptsBrowser;
    const {autogen = {}} = prompt;
	const collection = autogen.collection || "__none";
    
    const autoGenBlock = makeElement({element: "div", className: "PBE_rowBlock", content: "Autogen:"});
    autoGenBlock.style.height = "40px";
    const colOptions = [{id: "__none", name: "None"}];

    for(const colId in data.styles) colOptions.push({id: colId, name: colId});
    const stylesCollectionsSelect = makeSelect({
        id: "PBE_autoGentCollection", value: collection, options: colOptions,
        onChange: (e) => PromptsBrowser.promptEdit.onChangeAutogenCollection(e.currentTarget.value, prompt)
    });

    autoGenBlock.appendChild(stylesCollectionsSelect);

    if(autogen.collection) {
        const targetCollection = data.styles[autogen.collection];
        if(targetCollection) {
            const styleOptions = [];

            for(const styleItem of targetCollection) styleOptions.push({id: styleItem.name, name: styleItem.name});

            const styleSelect = makeSelect({
                id: "PBE_autoGentStyle", value: autogen.style || "", options: styleOptions,
                onChange: (e) => PromptsBrowser.promptEdit.onChangeAutogenStyle(e.currentTarget.value, prompt)
            });

            autoGenBlock.appendChild(styleSelect);
        }
    }

	wrapper.appendChild(autoGenBlock);
}

PromptsBrowser.promptEdit.update = (targetItem) => {
	const {state, data, makeElement, makeSelect} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.promptEdit;
	if(!wrapper || !state.editingPrompt) return;
	if(!targetItem) targetItem = PromptsBrowser.promptEdit.getTargetItem();
	if(!targetItem) return;
    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.promptEdit.onCloseWindow;
	wrapper.innerHTML = "";

    const headerBlock = makeElement({element: "div", className: "PBE_rowBlock"});
    const headerTitle = makeElement({element: "div", className: "PBE_rowBlock", content: state.editingPrompt});

	headerBlock.appendChild(headerTitle);
	PromptsBrowser.promptEdit.addCollectionSelector(headerBlock);

	wrapper.style.display = "flex";
	wrapper.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(state.editingPrompt, state.editTargetCollection);
	
    const currentTagsBlock          = makeElement({element: "div", className: "PBE_rowBlock"});
    const currentCategoriesBlock    = makeElement({element: "div", className: "PBE_rowBlock"});
    const addTagBlock               = makeElement({element: "div", className: "PBE_rowBlock"});
    const addCategoryBlock          = makeElement({element: "div", className: "PBE_rowBlock"});
    const footerBlock               = makeElement({element: "div", className: "PBE_rowBlock"});

    const tagsTitle                 = makeElement({element: "div", content: "Tags:"});
    const tagsList                  = makeElement({element: "div", className: "PBE_List PBE_Scrollbar PBE_tagsList"});
    const tagInput                  = makeElement({element: "input", id: "PBE_addTagInput"});
    const addTagButton              = makeElement({element: "button", content: "Add tag", className: "PBE_button"});
    const categoriesTitle           = makeElement({element: "div", content: "Categories:"});
    const categoriesList            = makeElement({element: "div", className: "PBE_List PBE_Scrollbar PBE_categoryList"});
    const categorySelect            = makeElement({element: "select", id: "PBE_addCategorySelect"});
    const addCategoryButton         = makeElement({element: "button", content: "Add category", className: "PBE_button"});
    const commentArea               = makeElement({element: "textarea", id: "PBE_commentArea", className: "PBE_Textarea PBE_Scrollbar"});

    const cancelButton              = makeElement({element: "button", content: "Cancel", className: "PBE_button"});
    const saveButton                = makeElement({element: "button", content: "Save", className: "PBE_button"});

	commentArea.value = targetItem.comment || "";

	for(const tagItem of targetItem.tags) {
		const tagElement = document.createElement("div");
        tagElement.className = "PBE_promptEditInfoItem";
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
        categoryElement.className = "PBE_promptEditInfoItem";
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

    tagInput.addEventListener("keyup", (e) => {
        if(e.keyCode !== 13) return;
        if(e.currentTarget.dataset.hint) return;

        PromptsBrowser.promptEdit.onAddTags(targetItem, tagInput);
    });

	addTagButton.addEventListener("click", (e) => {
		const inputElement = wrapper.querySelector("#PBE_addTagInput");
		if(!inputElement) return;

        PromptsBrowser.promptEdit.onAddTags(targetItem, inputElement);
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

	cancelButton.addEventListener("click", PromptsBrowser.promptEdit.onCloseWindow);

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

    //autogen block
    PromptsBrowser.promptEdit.showAutoGenBlock(wrapper, targetItem);

	PromptsBrowser.promptEdit.showAddSetup(wrapper);

	wrapper.appendChild(commentArea);

	wrapper.appendChild(footerBlock);

    PromptsBrowser.tagTooltip.add(tagInput);
}
