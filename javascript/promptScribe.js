
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.promptScribe = {};

PromptsBrowser.promptScribe.init = (wrapper) => {
	const promptScribe = document.createElement("div");
	promptScribe.className = "PBE_generalWindow PBE_promptScribe";
	promptScribe.id = "PBE_promptScribe";

	PromptsBrowser.DOMCache.promptScribe = promptScribe;

	wrapper.appendChild(promptScribe);
}

PromptsBrowser.promptScribe.initButton = (positiveWrapper) => {
	const addUnknownButton = document.createElement("button");

	addUnknownButton.className = "PBE_actionButton PBE_addUnknownButton";
	addUnknownButton.innerText = "Add Unknown";

	addUnknownButton.addEventListener("click", PromptsBrowser.promptScribe.onOpenScriber);

	positiveWrapper.appendChild(addUnknownButton);
}

PromptsBrowser.promptScribe.onOpenScriber = () => {
	const {state} = PromptsBrowser;

	state.showScriberWindow = true;
	PromptsBrowser.promptScribe.update(true);
}

PromptsBrowser.promptScribe.onAddUnknownPrompts = () => {
	const {state} = PromptsBrowser;
	let {selectedNewPrompts = []} = state;
	const activePrompts = PromptsBrowser.getCurrentPrompts();
	if(!state.savePreviewCollection) return;
	const targetCollection = PromptsBrowser.data.original[state.savePreviewCollection];
	if(!targetCollection) return;
	let newPrompts = false;

	for(const prompt of activePrompts) {
		if(!selectedNewPrompts.includes(prompt.id)) continue;

		const known = targetCollection.some(item => item.id === prompt.id);
		if(!known) {
			if(!newPrompts) newPrompts = true;
			targetCollection.push({id: prompt.id, tags: [], category: []});

			//removing from the selected
			selectedNewPrompts = selectedNewPrompts.filter(item => item !== prompt.id);
		}
	}

	if(!newPrompts) return;
	state.selectedNewPrompts = selectedNewPrompts;

	PromptsBrowser.db.saveJSONData(state.savePreviewCollection);
	PromptsBrowser.db.updateMixedList();
	PromptsBrowser.knownPrompts.update();
	PromptsBrowser.currentPrompts.update();
	PromptsBrowser.promptScribe.update();
}

PromptsBrowser.promptScribe.onToggleOnlyNew = (e) => {
	const {state} = PromptsBrowser;
	const id = "new_in_all_collections";

	if(state.toggledButtons.includes(id)) {
		state.toggledButtons = state.toggledButtons.filter(item => item !== id);
	} else {
		state.toggledButtons.push(id);
	}
	
	PromptsBrowser.promptScribe.update();
}

PromptsBrowser.promptScribe.onToggleAll = (e) => {
	const {state} = PromptsBrowser;
	let {selectedNewPrompts = []} = state;

	if(!selectedNewPrompts.length) {
		PromptsBrowser.promptScribe.update(true);
		return;
	}

	state.selectedNewPrompts = [];
	
	PromptsBrowser.promptScribe.update();
}

PromptsBrowser.promptScribe.showHeader = (wrapper) => {
	const {state} = PromptsBrowser;

	const newPromptsHeader = document.createElement("div");
	newPromptsHeader.className = "PBE_newPromptsHeader";

	const toggleOnlyNew = document.createElement("div");
	toggleOnlyNew.className = "PBE_toggleButton";
	toggleOnlyNew.innerText = "All collections";
	toggleOnlyNew.title = "Toggle if only unknown in all collections should be shown or only in the current collection";
	if(state.toggledButtons.includes("new_in_all_collections")) toggleOnlyNew.classList.add("PBE_toggledButton");
	toggleOnlyNew.style.height = "24px";

	toggleOnlyNew.addEventListener("click", PromptsBrowser.promptScribe.onToggleOnlyNew);

	const saveButton = document.createElement("button");
	saveButton.innerText = "Add new prompts";
	saveButton.className = "PBE_button";

	saveButton.addEventListener("click", PromptsBrowser.promptScribe.onAddUnknownPrompts);

	const toggleAll = document.createElement("button");
	toggleAll.innerText = "Toggle all";
	toggleAll.className = "PBE_button";
	toggleAll.style.marginRight = "10px";

	toggleAll.addEventListener("click", PromptsBrowser.promptScribe.onToggleAll);

	const collectionSelect = document.createElement("select");
	collectionSelect.className = "PBE_select";
	collectionSelect.style.margin = "0 10px";
	collectionSelect.style.height = "30px";

	let options = "";
	for(const collectionId in PromptsBrowser.data.original) {
		if(!state.savePreviewCollection) state.savePreviewCollection = collectionId;
		options += `<option value="${collectionId}">${collectionId}</option>`;
	}
	collectionSelect.innerHTML = options;

	if(state.savePreviewCollection) collectionSelect.value = state.savePreviewCollection;

	collectionSelect.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
		state.savePreviewCollection = value || undefined;

		PromptsBrowser.promptScribe.update();
	});

	newPromptsHeader.appendChild(toggleAll);
	newPromptsHeader.appendChild(toggleOnlyNew);
	newPromptsHeader.appendChild(collectionSelect);
	newPromptsHeader.appendChild(saveButton);

	wrapper.appendChild(newPromptsHeader);
}

PromptsBrowser.promptScribe.showUnknownPrompts = (wrapper, initial = false) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;
	let {selectedNewPrompts = [], savePreviewCollection, toggledButtons = []} = state;
	const newInAllCollections = toggledButtons.includes("new_in_all_collections");
	const activePrompts = PromptsBrowser.getCurrentPrompts();
	let database = data.united;

	if(!newInAllCollections && savePreviewCollection && PromptsBrowser.data.original[state.savePreviewCollection]) {
		database = PromptsBrowser.data.original[state.savePreviewCollection];
	}

	if(initial) selectedNewPrompts = [];
	let unknownPromptsList = [];

	for(const item of activePrompts) {
		let isKnown = false;

		for(const knownPrompt of database) {
			if(knownPrompt.id === item.id) {
				isKnown = true;
				break;
			}
		}

		if(!isKnown) {
			unknownPromptsList.push(item);
			if(initial) selectedNewPrompts.push(item.id);
		}
	}

	if(initial) state.selectedNewPrompts = selectedNewPrompts;

	const newPromptsContainer = document.createElement("div");
	newPromptsContainer.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";

	for(item of unknownPromptsList) {
		const promptElement = PromptsBrowser.showPromptItem(item, {noSplash: true});
		promptElement.classList.add("PBE_newElement");
		if(selectedNewPrompts.includes(item.id)) promptElement.classList.add("PBE_selectedNewElement");
		newPromptsContainer.appendChild(promptElement);

		promptElement.addEventListener("click", (e) => {
			const id = e.currentTarget.dataset.prompt;
			if(!id) return;

			if(selectedNewPrompts.includes(id)) {
				selectedNewPrompts = selectedNewPrompts.filter(item => item !== id);
				e.currentTarget.classList.remove("PBE_selectedNewElement");
			} else {
				selectedNewPrompts.push(id);
				e.currentTarget.classList.add("PBE_selectedNewElement");
			}

			PromptsBrowser.state.selectedNewPrompts = selectedNewPrompts;
		});
	}

	wrapper.appendChild(newPromptsContainer);
}

PromptsBrowser.promptScribe.update = (initial) => {
	const {state} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.promptScribe;

	if(!wrapper) return;
	wrapper.innerHTML = "";
	wrapper.style.display = "flex";

	const footerBlock = document.createElement("div");
	const closeButton = document.createElement("button");
	footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_stylesFooter";
	closeButton.innerText = "Close";
	closeButton.className = "PBE_button";

	closeButton.addEventListener("click", (e) => {
		state.showScriberWindow = undefined;
		wrapper.style.display = "none";
	});

	PromptsBrowser.promptScribe.showHeader(wrapper);
	PromptsBrowser.promptScribe.showUnknownPrompts(wrapper, initial);

	footerBlock.appendChild(closeButton);

	wrapper.appendChild(footerBlock);
}
