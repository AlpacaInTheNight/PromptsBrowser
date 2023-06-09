
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.styles = {};

PromptsBrowser.styles.selectedItem = {
	collection: "",
	styleId: "",
	index: 0,
}

PromptsBrowser.styles.init = (mainWrapper) => {
	const stylesWindow = document.createElement("div");

	stylesWindow.className = "PBE_generalWindow PBE_stylesWindow";
	stylesWindow.id = "PBE_stylesWindow";

	PromptsBrowser.DOMCache.stylesWindow = stylesWindow;
	mainWrapper.appendChild(stylesWindow);
}

PromptsBrowser.styles.initButton = (positiveWrapper) => {
	const addStylesButton = document.createElement("button");

	addStylesButton.className = "PBE_actionButton PBE_stylesButton";
	addStylesButton.innerText = "Styles";

	addStylesButton.addEventListener("click", PromptsBrowser.styles.onOpenStyles);

	positiveWrapper.appendChild(addStylesButton);
}

PromptsBrowser.styles.onUpdatePreview = (e) => {
	const {state, data} = PromptsBrowser;

	let collectionId = undefined;
	let styleId = undefined;

	if(e.currentTarget.dataset.action) {
		const {selectedItem} = PromptsBrowser.styles;
		collectionId = selectedItem.collection;
		styleId = selectedItem.styleId;

	} else {
		collectionId = e.currentTarget.dataset.id;
		styleId = e.currentTarget.dataset.id;
	}

	if(!collectionId || !styleId) return;

	const imageArea = PromptsBrowser.DOMCache.containers[state.currentContainer].imageArea;
	if(!imageArea) return;

	const imageContainer = imageArea.querySelector("img");
	if(!imageContainer) return;

	let src = imageContainer.src;
	const fileMarkIndex = src.indexOf("file=");
	if(fileMarkIndex === -1) return;
	src = src.slice(fileMarkIndex + 5);

	const cacheMarkIndex = src.indexOf("?");
	if(cacheMarkIndex) src = src.substring(0, cacheMarkIndex);

	const imageExtension = src.split('.').pop();

	(async () => {
		const saveData = {src, style: styleId, collection: collectionId};

		const rawResponse = await fetch('http://127.0.0.1:3000/saveStylePreview', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(saveData)
		});
		//const content = await rawResponse.json();

		const targetStylesCollection = data.styles[collectionId];
		if(targetStylesCollection) {
			targetStylesCollection.some(item => {
				if(item.name === styleId) {
					item.previewImage = imageExtension;
	
					return true;
				}
			});
		}

		PromptsBrowser.styles.update();
	})();
}

PromptsBrowser.styles.onCardClick = (e) => {
	const isShift = e.shiftKey;
	const isCtrl = e.metaKey || e.ctrlKey;

	if(isShift) PromptsBrowser.styles.applyStyle(e, false);
	else if(isCtrl) PromptsBrowser.styles.removeStyle(e);
	else PromptsBrowser.styles.onSelectStyle(e);
}

PromptsBrowser.styles.onChangeFilterCollection = (e) => {
	const {state} = PromptsBrowser;
	const value = e.currentTarget.value;

	state.filterStyleCollection = value;
	PromptsBrowser.styles.update();
}

PromptsBrowser.styles.onChangeFilterName = (e) => {
	const {state} = PromptsBrowser;
	const value = e.currentTarget.value;

	state.filterStyleName = value.toLowerCase();
	PromptsBrowser.styles.update();
}

PromptsBrowser.styles.onChangeNewCollection = (e) => {
	const {state} = PromptsBrowser;
	const value = e.currentTarget.value;
	if(!value) return;

	state.newStyleCollection = value;
}

PromptsBrowser.styles.onToggleShortMode = (e) => {
	const {state} = PromptsBrowser;
	const id = "styles_simplified_view";

	if(state.toggledButtons.includes(id)) {
		state.toggledButtons = state.toggledButtons.filter(item => item !== id);
	} else {
		state.toggledButtons.push(id);
	}
	
	PromptsBrowser.styles.update();
}

PromptsBrowser.styles.onSaveStyle = (e) => {
	const {data, state} = PromptsBrowser;
	const collectionId = state.newStyleCollection;
	if(!collectionId) return;
	const styleNameInput = PromptsBrowser.DOMCache.stylesWindow.querySelector("#PBE_newStyleName");

	const name = styleNameInput.value;
	if(!name || !data.styles) return;
	const activePrompts = PromptsBrowser.getCurrentPrompts();

	if(!activePrompts || !activePrompts.length) return;
	const targetCollection = data.styles[collectionId];
	if(!targetCollection) return;

	targetCollection.push({name, positive: activePrompts});

	PromptsBrowser.db.updateStyles(collectionId);
	PromptsBrowser.styles.update();
}

PromptsBrowser.styles.removeStyle = (e) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;
	if(!data.styles) return;

	let collectionId = undefined;
	let index = undefined;

	if(e.currentTarget.dataset.action) {
		const {selectedItem} = PromptsBrowser.styles;
		collectionId = selectedItem.collection;
		index = selectedItem.index;

	} else {
		collectionId = e.currentTarget.dataset.id;
		index = Number(e.currentTarget.dataset.index);
	}

	if(!collectionId || Number.isNaN(index)) return;

	const targetCollection = data.styles[collectionId];
	if(!targetCollection) return;

	const targetStyle = data.styles[collectionId][index];
	if(!targetStyle) return;

	if( confirm(`Remove style "${targetStyle.name}" from catalogue "${collectionId}"?`) ) {
		targetCollection.splice(index, 1);

		PromptsBrowser.db.updateStyles(collectionId);
		PromptsBrowser.styles.update();
	}
}

PromptsBrowser.styles.updateStyle = (e) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;
	if(!data.styles) return;
	const activePrompts = PromptsBrowser.getCurrentPrompts();

	let collectionId = undefined;
	let index = undefined;

	if(e.currentTarget.dataset.action) {
		const {selectedItem} = PromptsBrowser.styles;
		collectionId = selectedItem.collection;
		index = selectedItem.index;

	} else {
		collectionId = e.currentTarget.dataset.id;
		index = Number(e.currentTarget.dataset.index);
	}

	if(!collectionId || Number.isNaN(index)) return;

	const targetCollection = data.styles[collectionId];
	if(!targetCollection) return;

	const targetStyle = data.styles[collectionId][index];
	if(!targetStyle) return;

	if( confirm(`Replace style "${targetStyle.name}" params to the currently selected?`) ) {
		targetStyle.positive = JSON.parse(JSON.stringify(activePrompts));

		PromptsBrowser.db.updateStyles(collectionId);
		PromptsBrowser.styles.update();
	}
}

PromptsBrowser.styles.onSelectStyle = (e) => {
	const collection = e.currentTarget.dataset.id;
	const styleId = e.currentTarget.dataset.name;
	const index = Number(e.currentTarget.dataset.index);
	if(!collection || Number.isNaN(index)) return;

	if(e.currentTarget.classList.contains("PBE_selectedCurrentElement")) {
		PromptsBrowser.styles.selectedItem = {collection: "", styleId: "", index: 0};
		e.currentTarget.classList.remove("PBE_selectedCurrentElement");

	} else {
		PromptsBrowser.styles.selectedItem = {collection, styleId, index};

		const prevSelected = e.currentTarget.parentNode.querySelector(".PBE_selectedCurrentElement");
		if(prevSelected) prevSelected.classList.remove("PBE_selectedCurrentElement");

		e.currentTarget.classList.add("PBE_selectedCurrentElement");
	}
	
}

PromptsBrowser.styles.applyStyle = (e, isAfter) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;
	if(!data.styles) return;
	const activePrompts = PromptsBrowser.getCurrentPrompts();
	if(isAfter === undefined) isAfter = e.currentTarget.dataset.isafter ? true : false;
	
	let collectionId = undefined;
	let index = undefined;

	if(e.currentTarget.dataset.action) {
		const {selectedItem} = PromptsBrowser.styles;
		collectionId = selectedItem.collection;
		index = selectedItem.index;

	} else {
		collectionId = e.currentTarget.dataset.id;
		index = Number(e.currentTarget.dataset.index);
	}

	if(!collectionId || Number.isNaN(index)) return;

	const targetCollection = data.styles[collectionId];
	if(!targetCollection) return;

	const targetStyle = data.styles[collectionId][index];
	if(!targetStyle) return;
	const {positive} = targetStyle;

	if(isAfter) {
		for(const prompt of positive) {
			const {id, weight} = prompt;
			if( activePrompts.some(item => item.id === id) ) continue;
	
			activePrompts.push({...prompt});
		}

	} else {
		for(let i = positive.length - 1; i >= 0; i--) {
			const prompt = positive[i];
			const {id, weight} = prompt;
			if( activePrompts.some(item => item.id === id) ) continue;

			activePrompts.unshift({...prompt});
		}

	}

	PromptsBrowser.currentPrompts.update();
	PromptsBrowser.styles.update();
}

PromptsBrowser.styles.onOpenStyles = () => {
	const {state} = PromptsBrowser;

	state.showStylesWindow = true;
	PromptsBrowser.styles.update();
}

PromptsBrowser.styles.showCurrentPrompts = (wrapper) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;
	let activePrompts = PromptsBrowser.getCurrentPrompts();

	const setupContainer = document.createElement("div");
	const currentPromptsContainer = document.createElement("div");

	setupContainer.className = "PBE_List PBE_stylesSetup";
	currentPromptsContainer.className = "PBE_windowCurrentList PBE_Scrollbar";

	for(const i in activePrompts) {
		const currPrompt = activePrompts[i];

		const promptElement = PromptsBrowser.showPromptItem({id: currPrompt.id, isExternalNetwork: currPrompt.isExternalNetwork}, {});
		currentPromptsContainer.appendChild(promptElement);

		promptElement.addEventListener("click", (e) => {
			const currentId = e.currentTarget.dataset.prompt;
			if(!currentId) return;

			if(e.ctrlKey || e.metaKey) {
				activePrompts = activePrompts.filter(item => item.id !== currentId);
				PromptsBrowser.setCurrentPrompts(activePrompts);
				PromptsBrowser.styles.update();
				PromptsBrowser.currentPrompts.update();

				return;
			}
		});
	}

	currentPromptsContainer.addEventListener("wheel", (e) => {
		if(!e.deltaY) return;

		e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
		e.preventDefault();
	});

	const styleNameInput = document.createElement("input");
	const saveButton = document.createElement("button");
	saveButton.innerText = "Save as style";
	saveButton.className = "PBE_button";
	styleNameInput.placeholder = "Style name";
	styleNameInput.className = "PBE_newStyleName";
	styleNameInput.id = "PBE_newStyleName";

	saveButton.addEventListener("click", PromptsBrowser.styles.onSaveStyle);

	const collectionSelect = document.createElement("select");
	collectionSelect.className = "PBE_select";
	collectionSelect.style.height = "30px";
	collectionSelect.style.marginRight = "5px";
	let options = "";
	for(const collectionId in data.styles) {
		if(!state.newStyleCollection) state.newStyleCollection = collectionId;

		options += `<option value="${collectionId}">${collectionId}</option>`;
	}

	collectionSelect.innerHTML = options;
	collectionSelect.value = state.newStyleCollection;

	collectionSelect.addEventListener("change", PromptsBrowser.styles.onChangeNewCollection);

	const saveRow = document.createElement("div");
	saveRow.className = "PBE_row";

	saveRow.appendChild(collectionSelect);
	saveRow.appendChild(saveButton);

	setupContainer.appendChild(styleNameInput);
	setupContainer.appendChild(saveRow);

	wrapper.appendChild(currentPromptsContainer);
	wrapper.appendChild(setupContainer);
}

PromptsBrowser.styles.showFilters = (wrapper) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;

	const toggleShortMode = document.createElement("div");
	toggleShortMode.className = "PBE_toggleButton";
	toggleShortMode.innerText = "Simple mode";
	toggleShortMode.title = "Toggles simplified view mode";
	if(state.toggledButtons.includes("styles_simplified_view")) toggleShortMode.classList.add("PBE_toggledButton");
	toggleShortMode.style.height = "16px";

	toggleShortMode.addEventListener("click", PromptsBrowser.styles.onToggleShortMode);

	const collectionSelect = document.createElement("select");
	collectionSelect.className = "PBE_select";
	let options = "<option value=''>Any</option>";
	for(const collectionId in data.styles) {
		options += `<option value="${collectionId}">${collectionId}</option>`;
	}

	collectionSelect.innerHTML = options;
	collectionSelect.value = state.filterStyleCollection || "";

	collectionSelect.addEventListener("change", PromptsBrowser.styles.onChangeFilterCollection);

	const nameFilter = document.createElement("input");
	nameFilter.placeholder = "Search name";
	nameFilter.className = "PBE_input";
	nameFilter.value = state.filterStyleName || "";

	nameFilter.addEventListener("change", PromptsBrowser.styles.onChangeFilterName);

	wrapper.appendChild(toggleShortMode);
	wrapper.appendChild(collectionSelect);
	wrapper.appendChild(nameFilter);
}

PromptsBrowser.styles.showStylesShort = (wrapper) => {
	const {data} = PromptsBrowser;
	const {filterStyleCollection, filterStyleName} = PromptsBrowser.state;
	const {EMPTY_CARD_GRADIENT, NEW_CARD_GRADIENT} = PromptsBrowser.params;
	const activePrompts = PromptsBrowser.getCurrentPrompts();

	let styles = [];

	for(const collectionId in data.styles) {

		for(let i = 0; i < data.styles[collectionId].length; i++) {
			const styleItem = data.styles[collectionId][i];

			styles.push({...styleItem, id: collectionId, index: i});
		}
	}
	
	styles.sort( (A, B) => {
		if(A.name > B.name) return 1;
		if(A.name < B.name) return -1;

		return 0;
	});

	const iteration = new Date().valueOf();

	for(const style of styles) {
		const {name, positive, id, index, previewImage} = style;
		if(!name) continue;
		if(filterStyleCollection && filterStyleCollection !== id) continue;
		if(filterStyleName && !name.toLowerCase().includes(filterStyleName)) continue;
		let url = EMPTY_CARD_GRADIENT;

		if(previewImage) {
			const safeFileName = PromptsBrowser.makeFileNameSafe(name);
			url = `url('./file=styles_catalogue/${id}/preview/${safeFileName}.${previewImage}?${iteration}')`;
		}

		const element = PromptsBrowser.showPromptItem({id: name}, {url});
		element.dataset.id = id;
		element.dataset.index = index;
		element.dataset.name = name;

		if(PromptsBrowser.styles.selectedItem.collection === id && PromptsBrowser.styles.selectedItem.index === index) {
			element.classList.add("PBE_selectedCurrentElement");
		}

		element.addEventListener("click", PromptsBrowser.styles.onCardClick);

		wrapper.appendChild(element);
	}
}

PromptsBrowser.styles.showActions = (wrapper) => {

	const actionContainer = document.createElement("fieldset");
	actionContainer.className = "PBE_fieldset";
	const actionLegend = document.createElement("legend");
	actionLegend.innerText = "Actions";

	const addBeforeButton = document.createElement("div");
	addBeforeButton.innerText = "Add before";
	addBeforeButton.className = "PBE_button";
	addBeforeButton.title = "Add style prompts at the start of current prompts";
	addBeforeButton.dataset.action = "true";
	addBeforeButton.addEventListener("click", PromptsBrowser.styles.applyStyle);

	const addAfterButton = document.createElement("div");
	addAfterButton.innerText = "Add after";
	addAfterButton.className = "PBE_button";
	addAfterButton.title = "Add style prompts at the end of current prompts";
	addAfterButton.dataset.action = "true";
	addAfterButton.dataset.isafter = "true";
	addAfterButton.addEventListener("click", PromptsBrowser.styles.applyStyle);

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
	updateButton.addEventListener("click", PromptsBrowser.styles.updateStyle);

	const updatePreviewButton = document.createElement("div");
	updatePreviewButton.innerText = "Update preview";
	updatePreviewButton.className = "PBE_button";
	updatePreviewButton.title = "Delete selected style";
	updatePreviewButton.dataset.action = "true";
	updatePreviewButton.addEventListener("click", PromptsBrowser.styles.onUpdatePreview);
	
	editContainer.appendChild(editLegend);
	editContainer.appendChild(updateButton);
	editContainer.appendChild(updatePreviewButton);


	const systemContainer = document.createElement("fieldset");
	systemContainer.className = "PBE_fieldset";
	const systemLegend = document.createElement("legend");
	systemLegend.innerText = "System";

	const deleteButton = document.createElement("div");
	deleteButton.innerText = "Delete";
	deleteButton.className = "PBE_button";
	deleteButton.title = "Delete selected style";
	deleteButton.dataset.action = "true";
	deleteButton.addEventListener("click", PromptsBrowser.styles.removeStyle);

	systemContainer.appendChild(systemLegend);
	systemContainer.appendChild(deleteButton);


	wrapper.appendChild(actionContainer);
	wrapper.appendChild(editContainer);
	wrapper.appendChild(systemContainer);
}

PromptsBrowser.styles.showStyles = (wrapper) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;
	const {filterStyleCollection, filterStyleName} = state;
	const activePrompts = PromptsBrowser.getCurrentPrompts();

	let styles = [];

	for(const collectionId in data.styles) {

		for(let i = 0; i < data.styles[collectionId].length; i++) {
			const styleItem = data.styles[collectionId][i];

			styles.push({...styleItem, id: collectionId, index: i});
		}
	}
	
	styles.sort( (A, B) => {
		if(A.name > B.name) return 1;
		if(A.name < B.name) return -1;

		return 0;
	});

	for(const style of styles) {
		const {name, positive, id, index, previewImage} = style;

		if(filterStyleCollection && filterStyleCollection !== id) continue;
		if(filterStyleName && !name.toLowerCase().includes(filterStyleName)) continue;

		const stylesItem = document.createElement("div");
		const styleHeader = document.createElement("div");
		const nameContainer = document.createElement("div");
		const contentContainer = document.createElement("div");
		const updatePreview = document.createElement("div");

		const currentPromptsContainer = document.createElement("div");
		const actionsContainer = document.createElement("div");

		stylesItem.className = "PBE_styleItem";
		styleHeader.className = "PBE_styleHeader";
		nameContainer.className = "PBE_styleItemName";
		contentContainer.className = "PBE_styleItemContent";
		currentPromptsContainer.className = "PBE_stylesCurrentList PBE_Scrollbar";
		actionsContainer.className = "PBE_stylesAction";
		updatePreview.className = "PBE_button";

		if(previewImage) {
			const safeFileName = PromptsBrowser.makeFileNameSafe(name);
			const iteration = new Date().valueOf();
			const url = `url('./file=styles_catalogue/${id}/preview/${safeFileName}.${previewImage}?${iteration}')`;

			stylesItem.style.backgroundImage = url;
		}

		nameContainer.innerText = name;
		updatePreview.innerText = "Update preview";

		updatePreview.dataset.id = name;
		updatePreview.dataset.collection = id;

		for(const stylePrompt of positive) {
			const {id, weight, isExternalNetwork} = stylePrompt;
			const promptElement = PromptsBrowser.showPromptItem({id, weight, isExternalNetwork}, {});
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
		removeButton.className = "PBE_button";
		updateButton.className = "PBE_button";

		addAfterButton.dataset.isafter = "true";

		addAfterButton.dataset.id = id;
		addBeforeButton.dataset.id = id;
		removeButton.dataset.id = id;
		updateButton.dataset.id = id;

		addAfterButton.dataset.index = index;
		addBeforeButton.dataset.index = index;
		removeButton.dataset.index = index;
		updateButton.dataset.index = index;

		addBeforeButton.addEventListener("click", PromptsBrowser.styles.applyStyle);
		addAfterButton.addEventListener("click", PromptsBrowser.styles.applyStyle);
		removeButton.addEventListener("click", PromptsBrowser.styles.removeStyle);
		updateButton.addEventListener("click", PromptsBrowser.styles.updateStyle);
		updatePreview.addEventListener("click", PromptsBrowser.styles.onUpdatePreview);

		actionsContainer.appendChild(addBeforeButton);
		if(activePrompts && activePrompts.length) actionsContainer.appendChild(addAfterButton);
		actionsContainer.appendChild(removeButton);
		if(activePrompts && activePrompts.length) actionsContainer.appendChild(updateButton);

		contentContainer.appendChild(currentPromptsContainer);
		contentContainer.appendChild(actionsContainer);

		styleHeader.appendChild(nameContainer);
		styleHeader.appendChild(updatePreview);

		stylesItem.appendChild(styleHeader);
		stylesItem.appendChild(contentContainer);

		wrapper.appendChild(stylesItem);
	}

}

PromptsBrowser.styles.update = () => {
	const {state} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.stylesWindow;
	if(!wrapper || !state.showStylesWindow) return;
	wrapper.innerHTML = "";
	wrapper.style.display = "flex";
	const isShort = state.toggledButtons.includes("styles_simplified_view");

	const currentPromptsBlock = document.createElement("div");
	const possibleStylesBlock = document.createElement("div");

	const footerBlock = document.createElement("div");
	const closeButton = document.createElement("button");
	footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
	currentPromptsBlock.className = "PBE_dataBlock PBE_stylesHeader";
	closeButton.innerText = "Close";
	closeButton.className = "PBE_button";

	PromptsBrowser.styles.showCurrentPrompts(currentPromptsBlock);

	if(isShort) {
		possibleStylesBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
		PromptsBrowser.styles.showStylesShort(possibleStylesBlock);

	} else {
		possibleStylesBlock.className = "PBE_dataColumn PBE_Scrollbar PBE_windowContent";
		PromptsBrowser.styles.showStyles(possibleStylesBlock);
	}

	closeButton.addEventListener("click", (e) => {
		state.showStylesWindow = undefined;
		wrapper.style.display = "none";
	});

	footerBlock.appendChild(closeButton);

	const filterBlock = document.createElement("div");
	filterBlock.className = "PBE_row PBE_stylesFilter";
	PromptsBrowser.styles.showFilters(filterBlock);

	wrapper.appendChild(currentPromptsBlock);
	wrapper.appendChild(filterBlock);
	wrapper.appendChild(possibleStylesBlock);

	if(isShort) {
		const actionsBlock = document.createElement("div");
		actionsBlock.className = "PBE_collectionToolsActions PBE_row";
		PromptsBrowser.styles.showActions(actionsBlock);
		wrapper.appendChild(actionsBlock);
	}

	wrapper.appendChild(footerBlock);
};
