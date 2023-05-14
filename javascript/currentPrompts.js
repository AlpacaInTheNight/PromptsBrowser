
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.currentPrompts = {};

PromptsBrowser.currentPrompts.init = (wrapper, containerId) => {
	const currentPrompts = document.createElement("div");
	currentPrompts.className = "PBE_currentPrompts";

	PromptsBrowser.DOMCache.containers[containerId].currentPrompts = currentPrompts;
	wrapper.appendChild(currentPrompts);
}

PromptsBrowser.currentPrompts.initButton = (positiveWrapper) => {
	const normalizeButton = document.createElement("button");

	normalizeButton.className = "PBE_actionButton PBE_normalizeButton";
	normalizeButton.innerText = "Normalize";

	normalizeButton.addEventListener("click", PromptsBrowser.currentPrompts.onNormalizePrompts);

	positiveWrapper.appendChild(normalizeButton);
}

PromptsBrowser.currentPrompts.scrollWeight = (e) => {
	const {state} = PromptsBrowser;
	const {belowOneWeight = 0.05, aboveOneWeight = 0.01} = state.config;
	if(!e.shiftKey) return;
	const currentId = e.currentTarget.dataset.prompt;
	const activePrompts = PromptsBrowser.getCurrentPrompts();
	const targetItem = activePrompts.find(item => item.id === currentId);
	if(!currentId || !targetItem) return;

	e.preventDefault();
	e.stopPropagation();

	if(!targetItem.weight) targetItem.weight = 0;

	if(e.deltaY < 0) { //rising weight

		if(targetItem.weight < 1 && (targetItem.weight + belowOneWeight) > 1 ) {
			targetItem.weight = 1;

		} else {
			if(targetItem.weight >= 1) targetItem.weight += aboveOneWeight;
			else targetItem.weight += belowOneWeight;

		}
		
	} else { //lowering weight

		if(targetItem.weight > 1 && (targetItem.weight - aboveOneWeight) < 1 ) {
			targetItem.weight = 1;

		} else {
			if(targetItem.weight <= 1) targetItem.weight -= belowOneWeight;
			else targetItem.weight -= aboveOneWeight;

		}

	}

	if(targetItem.weight < 0) targetItem.weight = 0;
	targetItem.weight = Number(targetItem.weight.toFixed(2));
	PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.currentPrompts.onNormalizePrompts = () => {
	PromptsBrowser.currentPrompts.update();
	PromptsBrowser.synchroniseCurrentPrompts();
}

PromptsBrowser.currentPrompts.update = (noTextAreaUpdate = false) => {
	const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
	const {state} = PromptsBrowser;
	const activePrompts = PromptsBrowser.getCurrentPrompts();

	const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
	const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;

	if(!wrapper || !textArea) return;
	wrapper.innerHTML = "";
	const prompts = [];

	for(let index = 0; index < activePrompts.length; index++) {
		promptItem = activePrompts[index];
		const id = promptItem.id;

		if(promptItem.isExternalNetwork) {
			prompts.push(`<${id}:${promptItem.weight}>`);

		} else {
			if(promptItem.weight !== DEFAULT_PROMPT_WEIGHT) {
				prompts.push(`(${id}: ${promptItem.weight})`);
			} else prompts.push(id);
		}

		const promptElement = PromptsBrowser.showPromptItem(promptItem, {index});

		if(state.selectedPrompt === id) promptElement.classList.add("PBE_selectedCurrentElement");

		promptElement.addEventListener("dragstart", (e) => {
			const index = e.currentTarget.dataset.index;

			state.dragCurrentIndex = index;
			e.dataTransfer.setData("text", index);
		});

		promptElement.addEventListener("dragover", (e) => {
			e.preventDefault();
		});

		promptElement.addEventListener("dragenter", (e) => {
			e.preventDefault();
			const dragIndex = Number(e.currentTarget.dataset.index);
			const dropIndex = Number(state.dragCurrentIndex);

			if(Number.isNaN(dragIndex) || Number.isNaN(dropIndex)) return;
			if(dragIndex === undefined || dropIndex === undefined) return;
			if(dragIndex === dropIndex) return;
			
			e.currentTarget.classList.add("PBE_swap");
		});

		promptElement.addEventListener("dragleave", (e) => {
			e.currentTarget.classList.remove("PBE_swap");
		});

		promptElement.addEventListener("drop", (e) => {
			const dragIndex = Number(e.currentTarget.dataset.index);
			const dropIndex = Number(state.dragCurrentIndex);
			e.currentTarget.classList.remove("PBE_swap");

			state.dragCurrentIndex = undefined;
			e.preventDefault();
			e.stopPropagation();

			const element = activePrompts.splice(dropIndex, 1)[0];
			activePrompts.splice(dragIndex, 0, element);

			PromptsBrowser.currentPrompts.update();
		});

		promptElement.addEventListener("click", (e) => {
			const currentId = e.currentTarget.dataset.prompt;
			if(!currentId) return;

			if(e.ctrlKey || e.metaKey) {
				PromptsBrowser.setCurrentPrompts(activePrompts.filter(item => item.id !== currentId));
				PromptsBrowser.currentPrompts.update();

				return;
			}

			const selectedElements = wrapper.querySelectorAll(".PBE_selectedCurrentElement");
			for(let i = 0; i < selectedElements.length; ++i) {
				selectedElements[i].classList.remove("PBE_selectedCurrentElement");
			}

			if(state.selectedPrompt !== currentId) {
				e.currentTarget.classList.add("PBE_selectedCurrentElement");
				state.selectedPrompt = currentId;

			} else {
				state.selectedPrompt = undefined;
				
			}
			
			PromptsBrowser.previewSave.update();
		});

		promptElement.addEventListener("dblclick", (e) => {
			const currentId = e.currentTarget.dataset.prompt;
			if(!currentId) return;

			state.promptToolsId = currentId;
			PromptsBrowser.promptTools.update();
		});

		promptElement.addEventListener("mousewheel", PromptsBrowser.currentPrompts.scrollWeight);

		wrapper.appendChild(promptElement);
	}
	
	if(noTextAreaUpdate) return;

	textArea.value = prompts.join(", ");

	//Just to be sure every api listening to changes in textarea done their job
	textArea.dispatchEvent(new Event('focus'));
	textArea.dispatchEvent(new Event('input'));
	textArea.dispatchEvent(new KeyboardEvent('keyup'));
	textArea.dispatchEvent(new KeyboardEvent('keypress'));
	textArea.dispatchEvent(new Event('blur'));
}
