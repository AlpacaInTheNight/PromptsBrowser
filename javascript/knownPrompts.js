
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.knownPrompts = {};

PromptsBrowser.knownPrompts.init = (wrapper, positivePrompts, containerId) => {
	const promptBrowser = document.createElement("div");
	promptBrowser.className = "PBE_promptsWrapper";

	const promptsCatalogue = document.createElement("div");
	promptsCatalogue.className = "PBE_promptsCatalogue";
	
	promptBrowser.appendChild(promptsCatalogue);

	PromptsBrowser.DOMCache.containers[containerId].promptBrowser = promptBrowser;
	PromptsBrowser.DOMCache.containers[containerId].promptsCatalogue = promptsCatalogue;

	wrapper.insertBefore(promptBrowser, positivePrompts);
}

PromptsBrowser.knownPrompts.onDragStart = (e) => {
	const {state} = PromptsBrowser;
	const splash = e.currentTarget.querySelector(".PBE_promptElementSplash");
	splash.style.display = "none";

	const promptItem = e.currentTarget.dataset.prompt;

	state.dragItemId = promptItem;
	e.dataTransfer.setData("text", promptItem);
}

PromptsBrowser.knownPrompts.onDragOver = (e) => {
	e.preventDefault();
}

PromptsBrowser.knownPrompts.onDragEnter = (e) => {
	const {state} = PromptsBrowser;
	e.preventDefault();
	const dragItem = e.currentTarget.dataset.prompt;
	const dropItem = state.dragItemId;

	if(!dragItem || !dropItem) return;
	if(dragItem === dropItem) return;
	
	if(PromptsBrowser.utils.isInSameCollection(dragItem, dropItem)) e.currentTarget.classList.add("PBE_swap");
}

PromptsBrowser.knownPrompts.onDragLeave = (e) => {
	e.currentTarget.classList.remove("PBE_swap");
}

PromptsBrowser.knownPrompts.onDrop = (e) => {
	const {state} = PromptsBrowser;
	const dragItem = e.currentTarget.dataset.prompt;
	const dropItem = e.dataTransfer.getData("text");
	e.currentTarget.classList.remove("PBE_swap");

	state.dragItemId = undefined;
	e.preventDefault();
	e.stopPropagation();

	if(PromptsBrowser.utils.isInSameCollection(dragItem, dropItem)) {
		PromptsBrowser.db.movePrompt(dragItem, dropItem);
	}
}

PromptsBrowser.knownPrompts.onHover = (e) => {
	const splash = e.currentTarget.querySelector(".PBE_promptElementSplash");
	const position = e.currentTarget.getBoundingClientRect();
	splash.style.display = "";

	splash.style.top = position.top + "px";
}

PromptsBrowser.knownPrompts.onPromptClick = (e) => {
	const {united} = PromptsBrowser.data;
	const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
	const {state} = PromptsBrowser;

	PromptsBrowser.synchroniseCurrentPrompts();
	const activePrompts = PromptsBrowser.getCurrentPrompts();

	const promptItem = e.currentTarget.dataset.prompt;
	const targetItem = united.find(item => item.id === promptItem);
	if(!targetItem) return;
	const {addAtStart, addAfter, addStart, addEnd} = targetItem;

	if(e.shiftKey) {
		state.editingPrompt = promptItem;
		PromptsBrowser.promptEdit.update();

		return;
	}

	if(e.metaKey || e.ctrlKey) {
		let targetCollection = state.filterCollection;
		if(!targetCollection) {
			
			if(!targetItem.collections) return;
			const firstCollection = targetItem.collections[0];
			if(!firstCollection) return;
			targetCollection = targetItem.collections[0];
		}

		if( confirm(`Remove prompt "${promptItem}" from catalogue "${targetCollection}"?`) ) {
			if(!PromptsBrowser.data.original[targetCollection]) return;

			PromptsBrowser.data.original[targetCollection] = PromptsBrowser.data.original[targetCollection].filter(item => item.id !== promptItem);

            PromptsBrowser.db.movePreviewImage(promptItem, targetCollection, targetCollection, "delete");
			PromptsBrowser.db.saveJSONData(targetCollection);
			PromptsBrowser.db.updateMixedList();
			PromptsBrowser.promptEdit.update();
			PromptsBrowser.currentPrompts.update();
		}

		return;
	}
	
	if(activePrompts.some(item => item.id === promptItem)) return;

	const newPrompt = {id: promptItem, weight: DEFAULT_PROMPT_WEIGHT, isExternalNetwork: targetItem.isExternalNetwork};

	if(addStart) window.PromptsBrowser.addStrToActive(addStart, true);

	if(addAfter) {
		if(addAtStart) {
			window.PromptsBrowser.addStrToActive(addAfter, true);
			activePrompts.unshift(newPrompt);

		} else {
			activePrompts.push(newPrompt);
			window.PromptsBrowser.addStrToActive(addAfter, false);
		}

	} else {
		if(addAtStart) activePrompts.unshift(newPrompt);
		else activePrompts.push(newPrompt);
	}

	if(addEnd) window.PromptsBrowser.addStrToActive(addEnd, false);

	PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.knownPrompts.showHeader = (wrapper) => {
	const {state} = PromptsBrowser;

	const headerContainer = document.createElement("div");
	const categorySelector = document.createElement("select");
	const collectionSelector = document.createElement("select");
	const sortingSelector = document.createElement("select");
	const tagsInput = document.createElement("input");
	tagsInput.placeholder = "tag1, tag2, tag3...";
	const collectionToolsButton = document.createElement("button");
	collectionToolsButton.className = "PBE_button";
	collectionToolsButton.innerText = "Edit collection";
	collectionToolsButton.style.marginRight = "10px";

	headerContainer.className = "PBE_promptsCatalogueHeader";

	//categories selector
	const categories = PromptsBrowser.data.categories;
	let options = `
		<option value="">All</option>
		<option value="__none">Uncategorised</option>
	`;

	for(const categoryItem of categories) {
		if(!categorySelector.value) categorySelector.value = categoryItem;
		options += `<option value="${categoryItem}">${categoryItem}</option>`;
	}
	categorySelector.innerHTML = options;

	if(state.filterCategory) categorySelector.value = state.filterCategory;

	categorySelector.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
		state.filterCategory = value || undefined;

		PromptsBrowser.knownPrompts.update();
	});

	//collection selector
	options = `<option value="">All</option>`;

	for(const collectionId in PromptsBrowser.data.original) {
		options += `<option value="${collectionId}">${collectionId}</option>`;
	}
	collectionSelector.innerHTML = options;

	if(state.filterCollection) collectionSelector.value = state.filterCollection;

	collectionSelector.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
		state.filterCollection = value || undefined;

		state.filesIteration++;
		PromptsBrowser.knownPrompts.update();
		PromptsBrowser.currentPrompts.update(true);
	});

	//sorting selector
	options = `
		<option value="">Unsorted</option>
		<option value="reversed">Unsorted reversed</option>
		<option value="alph">Alphabetical</option>
		<option value="alphReversed">Alphabetical reversed</option>
	`;
	sortingSelector.innerHTML = options;

	if(state.sortKnownPrompts) sortingSelector.value = state.sortKnownPrompts;

	sortingSelector.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
		state.sortKnownPrompts = value || undefined;

		PromptsBrowser.knownPrompts.update();
	});

	//tags input
	if(state.filterTags) tagsInput.value = state.filterTags.join(", ");

	tagsInput.addEventListener("change", (e) => {
		const value = e.currentTarget.value;

		const tags = value.split(",").map(item => item.trim());
		if(!tags) state.filterTags = undefined;
		else state.filterTags = tags;

		if(state.filterTags && !state.filterTags.length) state.filterTags = undefined;
		if(state.filterTags && state.filterTags.length === 1 && !state.filterTags[0]) state.filterTags = undefined;
		
		PromptsBrowser.knownPrompts.update();
	});

	collectionToolsButton.addEventListener("click", (e) => {
		if(state.filterCollection) state.collectionToolsId = state.filterCollection;
		PromptsBrowser.collectionTools.update();
	});

	headerContainer.appendChild(collectionToolsButton);
	headerContainer.appendChild(collectionSelector);
	headerContainer.appendChild(categorySelector);
	headerContainer.appendChild(tagsInput);
	headerContainer.appendChild(sortingSelector);

	wrapper.appendChild(headerContainer);
}

PromptsBrowser.knownPrompts.update = () => {
	const {united} = PromptsBrowser.data;
	const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
	const {state} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].promptsCatalogue;
	wrapper.innerHTML = "";

	const MAX_ITEMS_TO_DISPLAY = 1000;
	let shownItems = 0;

	if(!united) {
		PromptsBrowser.utils.log("No prompt data to show");
		return;
	}

	PromptsBrowser.knownPrompts.showHeader(wrapper);

	const proptsContainer = document.createElement("div");
	proptsContainer.className = "PBE_promptsCatalogueContent PBE_Scrollbar";

	let dataArr = [];

	if(state.filterCollection) {
		const targetCategory = PromptsBrowser.data.original[state.filterCollection];
		if(targetCategory) {
			for(const id in targetCategory) {
				const targetOriginalItem = targetCategory[id];
				const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
				if(targetMixedItem) dataArr.push({...targetMixedItem});
			}
		}

	} else {
		for(const id in united) dataArr.push({...united[id]});
	}	
	
	if(state.sortKnownPrompts === "alph" || state.sortKnownPrompts === "alphReversed") {
		dataArr.sort( (A, B) => {
			if(state.sortKnownPrompts === "alph") {
				if(A.id > B.id) return 1;
				if(A.id < B.id) return -1;

			} else {
				if(A.id > B.id) return -1;
				if(A.id < B.id) return 1;
			}

			return 0;
		});
	} else if(state.sortKnownPrompts === "reversed") {
		dataArr.reverse()
	}

	for(const prompt of dataArr) {
		const {id} = prompt;
		if(shownItems > MAX_ITEMS_TO_DISPLAY) break;

		if(state.filterCategory) {
			if(state.filterCategory === "__none") {
				if(prompt.category !== undefined && prompt.category.length) continue;

			} else {
				if(!prompt.category) continue;
				if(!prompt.category.includes(state.filterCategory)) continue;
			}
		}

		if(state.filterCollection) {
			if(!prompt.collections) continue;
			if(!prompt.collections.includes(state.filterCollection)) continue;
		}

		if(state.filterTags && Array.isArray(state.filterTags)) {
			if(!prompt.tags) continue;
			let out = true;

			for(const filterTag of state.filterTags) {
				for(const promptTag of prompt.tags) {
					if(promptTag.includes(filterTag)) {
						out = false;
						break;
					}
				}
			}
			
			if(out) continue;
		}
		
		const promptElement = document.createElement("div");
		promptElement.className = "PBE_promptElement";
		promptElement.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(id, state.filterCollection);
		promptElement.dataset.prompt = id;
		promptElement.draggable = "true";
		if(prompt.isExternalNetwork) promptElement.classList.add("PBE_externalNetwork");

		const splashElement = document.createElement("div");
		splashElement.className = "PBE_promptElementSplash";
		splashElement.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(id, state.filterCollection);
		splashElement.innerText = id;

		promptElement.appendChild(splashElement);
		promptElement.innerHTML += id;

		promptElement.addEventListener("dragstart", PromptsBrowser.knownPrompts.onDragStart);

		promptElement.addEventListener("dragover", PromptsBrowser.knownPrompts.onDragOver);

		promptElement.addEventListener("dragenter", PromptsBrowser.knownPrompts.onDragEnter);

		promptElement.addEventListener("dragleave", PromptsBrowser.knownPrompts.onDragLeave);

		promptElement.addEventListener("drop", PromptsBrowser.knownPrompts.onDrop);
	
		promptElement.addEventListener("click", PromptsBrowser.knownPrompts.onPromptClick);

		promptElement.addEventListener("mouseover", PromptsBrowser.knownPrompts.onHover);

		proptsContainer.appendChild(promptElement);
		shownItems++;
	}

	wrapper.appendChild(proptsContainer);
}
