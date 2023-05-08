
if(!window.PromptsBrowser) window.PromptsBrowser = {};

/**
 * Synchronises text content of the textarea with the array of active prompts used by the extension.
 */
PromptsBrowser.synchroniseCurrentPrompts = () => {
	const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
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
		let inTextAreaWeight = DEFAULT_PROMPT_WEIGHT;

		//prompt is a marker for usage of LORA/Hypernetwork
		let isExternalNetwork = false;

		let promptItem = prompts[i].trim();
		if(!promptItem) continue;

		//normalization. Replacing "_" to spaces and changing prompt to the lower case.
		//TODO: probably should make this configurable by the user
		//promptItem = promptItem.toLowerCase();
		//promptItem = promptItem.replaceAll("_", " ");

		//getting single prompt weight if it is using parenthesis syntax (currently not working with multiple prompts grouped by weight)
		if( promptItem.startsWith("(") && promptItem.endsWith(")") ) {
			let weightLvlStart = 1;
			let weightLvlEnd = 1;

			if( promptItem.startsWith("((") ) {
				weightLvlStart = 2;
				if(promptItem.startsWith("(((")) weightLvlStart = 3;
			}

			if( promptItem.endsWith("))") ) {
				weightLvlEnd = 2;
				if( promptItem.endsWith(")))") ) weightLvlEnd = 3;
			}

			if(weightLvlStart === weightLvlEnd) {
				promptItem = promptItem.replace(/^\(+/, '');
				promptItem = promptItem.replace(/\)+$/, '');

				inTextAreaWeight = Number( (DEFAULT_PROMPT_WEIGHT * weightLvlStart).toFixed(2));
			}
			
		}

		//detecting external network prompt
		if( promptItem.startsWith("<") && promptItem.endsWith(">") ) {
			isExternalNetwork = true;
			promptItem = promptItem.substring(1);
			promptItem = promptItem.substring(0, promptItem.length - 1);
		}

		//detecting weight marker
		if(promptItem.includes(":")) {
			const promptArr = promptItem.split(":");
			const weightDataItem = Number(promptArr.pop());

			if(!Number.isNaN(weightDataItem)) {
				const base = promptArr.join(":").trim();
				if(!base) continue;
				promptItem = base;
				inTextAreaWeight = weightDataItem;
			}
		}

		let targetItem = activePrompts.find(item => item.id === promptItem);
		
		if(targetItem) {
			if(targetItem.weight !== inTextAreaWeight) targetItem.weight = inTextAreaWeight;
		} else {
			targetItem = {
				id: promptItem,
				weight: inTextAreaWeight !== undefined ? inTextAreaWeight : DEFAULT_PROMPT_WEIGHT
			}
		}

		if(isExternalNetwork) targetItem.isExternalNetwork = true;

		newPBE_currentPrompts.push(targetItem);
	}

	activePrompts = newPBE_currentPrompts;

	PromptsBrowser.setCurrentPrompts(activePrompts);
	PromptsBrowser.currentPrompts.update(true);
}
