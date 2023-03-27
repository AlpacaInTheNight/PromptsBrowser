
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.styles = {};

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

PromptsBrowser.styles.saveStyle = (e) => {
	const {data} = PromptsBrowser;
	const styleNameInput = PromptsBrowser.DOMCache.stylesWindow.querySelector("#PBE_newStyleName");

	const name = styleNameInput.value;
	if(!name || !data.styles) return;
	const activePrompts = PromptsBrowser.getCurrentPrompts();

	if(!activePrompts || !activePrompts.length) return;
	const targetCollection = data.styles["base"];

	targetCollection.push({name, positive: activePrompts});

	PromptsBrowser.db.updateStyles("base");
	PromptsBrowser.styles.update();
}

PromptsBrowser.styles.removeStyle = (e) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;
	if(!data.styles) return;

	const collectionId = e.currentTarget.dataset.id;
	const index = Number(e.currentTarget.dataset.index);
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

	const collectionId = e.currentTarget.dataset.id;
	const index = Number(e.currentTarget.dataset.index);
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

PromptsBrowser.styles.applyStyle = (e) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;
	if(!data.styles) return;
	const activePrompts = PromptsBrowser.getCurrentPrompts();

	const isAfter = e.currentTarget.dataset.isafter ? true : false;
	const collectionId = e.currentTarget.dataset.id;
	const index = Number(e.currentTarget.dataset.index);
	if(!collectionId || Number.isNaN(index)) return;

	const targetCollection = data.styles[collectionId];
	if(!targetCollection) return;

	const targetStyle = data.styles[collectionId][index];
	if(!targetStyle) return;
	const {positive} = targetStyle;

	if(isAfter) {
		for(const prompt of positive) {
			const {id, weight} = prompt;
			if( activePrompts.some(item => item.id === id) ) return;
	
			activePrompts.push({...prompt});
		}

	} else {
		for(let i = positive.length - 1; i >= 0; i--) {
			const prompt = positive[i];

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

	saveButton.addEventListener("click", PromptsBrowser.styles.saveStyle);

	setupContainer.appendChild(styleNameInput);
	setupContainer.appendChild(saveButton);

	wrapper.appendChild(currentPromptsContainer);
	wrapper.appendChild(setupContainer);
}

PromptsBrowser.styles.showStyles = (wrapper) => {
	const {data} = PromptsBrowser;
	const {state} = PromptsBrowser;
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
		const {name, positive, id, index} = style;

		const stylesItem = document.createElement("div");
		const nameContainer = document.createElement("div");
		const contentContainer = document.createElement("div");

		const currentPromptsContainer = document.createElement("div");
		const actionsContainer = document.createElement("div");

		stylesItem.className = "PBE_styleItem";
		nameContainer.className = "PBE_styleItemName";
		contentContainer.className = "PBE_styleItemContent";
		currentPromptsContainer.className = "PBE_stylesCurrentList PBE_Scrollbar";
		actionsContainer.className = "PBE_stylesAction";

		nameContainer.innerText = name;

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

		actionsContainer.appendChild(addBeforeButton);
		if(activePrompts && activePrompts.length) actionsContainer.appendChild(addAfterButton);
		actionsContainer.appendChild(removeButton);
		if(activePrompts && activePrompts.length) actionsContainer.appendChild(updateButton);

		contentContainer.appendChild(currentPromptsContainer);
		contentContainer.appendChild(actionsContainer);

		stylesItem.appendChild(nameContainer);
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

	const currentPromptsBlock = document.createElement("div");
	const possibleStylesBlock = document.createElement("div");
	const footerBlock = document.createElement("div");
	const closeButton = document.createElement("button");
	footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_stylesFooter";
	currentPromptsBlock.className = "PBE_dataBlock PBE_stylesHeader";
	possibleStylesBlock.className = "PBE_dataColumn PBE_Scrollbar PBE_windowContent";
	closeButton.innerText = "Close";
	closeButton.className = "PBE_button";

	PromptsBrowser.styles.showCurrentPrompts(currentPromptsBlock);
	PromptsBrowser.styles.showStyles(possibleStylesBlock);

	closeButton.addEventListener("click", (e) => {
		state.showStylesWindow = undefined;
		wrapper.style.display = "none";
	});

	footerBlock.appendChild(closeButton);

	wrapper.appendChild(currentPromptsBlock);
	wrapper.appendChild(possibleStylesBlock);
	wrapper.appendChild(footerBlock);
};
