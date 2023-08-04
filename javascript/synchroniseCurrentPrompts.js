
if(!window.PromptsBrowser) window.PromptsBrowser = {};

/**
 * Synchronises text content of the textarea with the array of active prompts used by the extension.
 */
PromptsBrowser.synchroniseCurrentPrompts = (noTextAreaUpdate = true) => {
	const {normalizePrompt} = window.PromptsBrowser;
	const {DEFAULT_PROMPT_WEIGHT, PROMPT_WEIGHT_FACTOR} = PromptsBrowser.params;
	const {state} = PromptsBrowser;
	const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea
	if(!textArea) return;
	let activePrompts = PromptsBrowser.getCurrentPrompts();
	let value = textArea.value;

	//trying to fix LORAs/Hypernetworks added without a preceding comma
	value = value.replace(/([^,])\ </g, "$1,\ <");

	const newPBE_currentPrompts = [];
	const prompts = value.split(",");

	for(const i in prompts) {
		let promptItem = prompts[i].trim();
		if(!promptItem) continue;

		const {id, weight, isExternalNetwork} = window.PromptsBrowser.promptStringToObject(promptItem);
		promptItem = id;

		if(!isExternalNetwork) promptItem = normalizePrompt(promptItem);

		let targetItem = activePrompts.find(item => item.id === promptItem);
		
		if(targetItem) {
			if(targetItem.weight !== weight) targetItem.weight = weight;
			
		} else {
			targetItem = {
				id: promptItem,
				weight: weight !== undefined ? weight : DEFAULT_PROMPT_WEIGHT
			}
		}

		if(isExternalNetwork) targetItem.isExternalNetwork = true;

		newPBE_currentPrompts.push(targetItem);
	}

	activePrompts = newPBE_currentPrompts;

	PromptsBrowser.setCurrentPrompts(activePrompts);
	PromptsBrowser.currentPrompts.update(noTextAreaUpdate);
}
