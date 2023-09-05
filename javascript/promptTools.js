
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.promptTools = {};

PromptsBrowser.promptTools.init = (wrapper) => {
	const promptTools = document.createElement("div");
	promptTools.className = "PBE_generalWindow PBE_promptTools";
	promptTools.id = "PBE_promptTools";

	PromptsBrowser.DOMCache.promptTools = promptTools;

	wrapper.appendChild(promptTools);

    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.promptTools.onCloseWindow;

    promptTools.addEventListener("click", () => {
        PromptsBrowser.onCloseActiveWindow = PromptsBrowser.promptTools.onCloseWindow;
    });
}

PromptsBrowser.promptTools.onCloseWindow = () => {
    const {state} = PromptsBrowser;
    const wrapper = PromptsBrowser.DOMCache.promptTools;

    if(!wrapper) return;

    state.promptToolsId = undefined;
    wrapper.style.display = "none";
}

PromptsBrowser.promptTools.onToggleButton = (e) => {
	const {state} = PromptsBrowser;

	const id = e.currentTarget.dataset.id;
	if(!id) return;

	if(state.toggledButtons.includes(id)) {
		state.toggledButtons = state.toggledButtons.filter(item => item !== id);
	} else {
		state.toggledButtons.push(id);
	}
	
	PromptsBrowser.promptTools.update();
}

PromptsBrowser.promptTools.onElementClick = (e) => {
	const {united} = PromptsBrowser.data;
	const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
	const {state} = PromptsBrowser;
	const currPrompt = state.promptToolsId;
	const clickPrompt = e.currentTarget.dataset.prompt;
	if(!currPrompt || !clickPrompt) return;
	let activePrompts = PromptsBrowser.getCurrentPrompts();

	const targetPrompt = united.find(item => item.id === clickPrompt);
	if(!targetPrompt) return;

	const currTargetIndex = activePrompts.findIndex(item => item.id === currPrompt);
	const clickTargetIndex = activePrompts.findIndex(item => item.id === clickPrompt);
	if(currTargetIndex === -1) return;

	if(clickTargetIndex !== -1) {

		if(e.shiftKey || e.metaKey || e.ctrlKey) {
			activePrompts = activePrompts.filter(item => item.id !== clickPrompt);
			PromptsBrowser.setCurrentPrompts(activePrompts);

		} else {
			state.promptToolsId = clickPrompt;
			
		}

		PromptsBrowser.promptTools.update();
		PromptsBrowser.currentPrompts.update();
		return;
	}

	const newItem = {id: clickPrompt, weight: DEFAULT_PROMPT_WEIGHT, isExternalNetwork: targetPrompt.isExternalNetwork};

	if(e.shiftKey) {
		activePrompts.splice(currTargetIndex, 0, newItem);

	} else {
		activePrompts[currTargetIndex] = newItem;
		state.promptToolsId = clickPrompt;

	}

	PromptsBrowser.promptTools.update();
	PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.promptTools.showCurrentPrompts = (wrapper) => {
	const {state} = PromptsBrowser;
	const activePrompts = PromptsBrowser.getCurrentPrompts();
	if(!state.promptToolsId) return;

	const setupContainer = document.createElement("div");
	const currentPromptsContainer = document.createElement("div");

	const showTags = document.createElement("div");
	const showCategory = document.createElement("div");
	const showName = document.createElement("div");

	setupContainer.className = "PBE_List PBE_toolsSetup";
	currentPromptsContainer.className = "PBE_windowCurrentList PBE_Scrollbar";
	showTags.className = "PBE_toggleButton";
	showCategory.className = "PBE_toggleButton";
	showName.className = "PBE_toggleButton";

	showTags.innerText = "Tags";
	showCategory.innerText = "Category";
	showName.innerText = "Name";

	showTags.dataset.id = "tools_tags";
	showCategory.dataset.id = "tools_category";
	showName.dataset.id = "tools_name";

	if(state.toggledButtons.includes("tools_tags")) showTags.classList.add("PBE_toggledButton");
	if(state.toggledButtons.includes("tools_category")) showCategory.classList.add("PBE_toggledButton");
	if(state.toggledButtons.includes("tools_name")) showName.classList.add("PBE_toggledButton");

	showTags.addEventListener("click", PromptsBrowser.promptTools.onToggleButton);
	showCategory.addEventListener("click", PromptsBrowser.promptTools.onToggleButton);
	showName.addEventListener("click", PromptsBrowser.promptTools.onToggleButton);

	for(const i in activePrompts) {
		const currPrompt = activePrompts[i];
		const isShadowed = currPrompt.id !== state.promptToolsId;

		promptElement = PromptsBrowser.showPromptItem({id: currPrompt.id, isExternalNetwork: currPrompt.isExternalNetwork}, {isShadowed});
		promptElement.addEventListener("click", PromptsBrowser.promptTools.onElementClick);
		currentPromptsContainer.appendChild(promptElement);
	}

	currentPromptsContainer.addEventListener("wheel", (e) => {
		if(!e.deltaY) return;

		e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
		e.preventDefault();
	})

	setupContainer.appendChild(showTags);
	setupContainer.appendChild(showCategory);
	setupContainer.appendChild(showName);

	wrapper.appendChild(currentPromptsContainer);
	wrapper.appendChild(setupContainer);
}

PromptsBrowser.promptTools.showPossiblePromptswrapper = (wrapper) => {
    const {replaceAllRegex} = window.PromptsBrowser;
	const {united} = PromptsBrowser.data;
	const {state} = PromptsBrowser;
	const prompt = state.promptToolsId;
	const activePrompts = PromptsBrowser.getCurrentPrompts();
	if(!prompt) return;
	let targetTags = [];
	let targetCategories = [];
    let targetNameWords = replaceAllRegex(prompt.toLowerCase(), "_", " ").split(" ");

	const targetPromptItem = united.find(item => item.id === prompt);
	if(targetPromptItem) {
		targetTags = targetPromptItem.tags || [];
		targetCategories = targetPromptItem.category || [];
	}

	const nameArr = prompt.split(" ");
    const possiblePrompts = [];
	const addedIds = [];

	united.forEach(item => {
		const {id, tags, category} = item;

        //similarity index based on the same tags, categories and words used in the prompt name
        let simIndex = 0;

		if(id === prompt) return;

        let nameWords = replaceAllRegex(id.toLowerCase(), "_", " ").split(" ");

        if(state.toggledButtons.includes("tools_tags"))
            targetTags.forEach(tagItem => {if(tags.includes(tagItem)) simIndex++});
        
        if(state.toggledButtons.includes("tools_category"))
            targetCategories.forEach(catItem => {if(category.includes(catItem)) simIndex++});
        
        if(state.toggledButtons.includes("tools_name"))
            targetNameWords.forEach(wordItem => {if(nameWords.includes(wordItem)) simIndex++});
        
        

		if(state.toggledButtons.includes("tools_tags") && targetTags.length) {
			targetTags.some(targetTag => {
				if(tags.includes(targetTag)) {
					possiblePrompts.push({...item, simIndex});

					return true;
				}
			});
		}

		if(state.toggledButtons.includes("tools_category") && targetCategories.length) {
			targetCategories.some(targetCategory => {
				if(category.includes(targetCategory)) {
                    possiblePrompts.push({...item, simIndex});

					return true;
				}
			});
		}

		if(state.toggledButtons.includes("tools_name")) {
			const itemNameArr = id.split(" ");

			wordLoop:
			for(const word of nameArr) {
				for(const itemWord of itemNameArr) {
					
					if( itemWord.toLowerCase().includes(word.toLowerCase()) ) {
                        possiblePrompts.push({...item, simIndex});
						break wordLoop;
					}
				}
			}
		}
	});

    //sorting possible prompts based on their similarity to the selected prompt
    possiblePrompts.sort( (A, B) => {
        if(A.simIndex < B.simIndex) return 1;
        if(A.simIndex > B.simIndex) return -1;

        return 0;
    });

	function addElement(item) {
		if(addedIds.includes(item.id)) return;
		const isShadowed = activePrompts.some(currItem => currItem.id === item.id);

		addedIds.push(item.id);
		const promptElement = PromptsBrowser.showPromptItem(item, {isShadowed});
		promptElement.addEventListener("click", PromptsBrowser.promptTools.onElementClick);
		wrapper.appendChild(promptElement);
	}

	for(const item of possiblePrompts) addElement(item);
}

PromptsBrowser.promptTools.update = () => {
	const {state} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.promptTools;

	if(!wrapper || !state.promptToolsId) return;
    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.promptTools.onCloseWindow;
	wrapper.innerHTML = "";
	wrapper.style.display = "flex";

	const backImage = document.createElement("div");
	backImage.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(state.promptToolsId);
	backImage.className = "PBE_toolsBackImage";

	const currentPromptsBlock = document.createElement("div");
	const possiblePromptsBlock = document.createElement("div");
	const footerBlock = document.createElement("div");
	const closeButton = document.createElement("button");
	footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_toolsFooter";
	currentPromptsBlock.className = "PBE_dataBlock PBE_toolsHeader";
	possiblePromptsBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
	closeButton.innerText = "Close";
	closeButton.className = "PBE_button";

	PromptsBrowser.promptTools.showCurrentPrompts(currentPromptsBlock);
	PromptsBrowser.promptTools.showPossiblePromptswrapper(possiblePromptsBlock);

	closeButton.addEventListener("click", PromptsBrowser.promptTools.onCloseWindow);

	footerBlock.appendChild(closeButton);

	wrapper.appendChild(backImage);
	wrapper.appendChild(currentPromptsBlock);
	wrapper.appendChild(possiblePromptsBlock);
	wrapper.appendChild(footerBlock);
}
