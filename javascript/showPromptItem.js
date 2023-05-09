
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.showPromptItem = (promptItem, options = {}) => {
	const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
	const {index = 0, isShadowed = false, noSplash = false} = options;
	const {id = "", weight = DEFAULT_PROMPT_WEIGHT, isExternalNetwork = false} = promptItem;

	const promptElement = document.createElement("div");
	promptElement.className = "PBE_promptElement PBE_currentElement";
	promptElement.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(id, undefined);
	promptElement.dataset.prompt = id;
	promptElement.dataset.index = index;
	promptElement.draggable = "true";
	if(isExternalNetwork) promptElement.classList.add("PBE_externalNetwork");
	if(isShadowed) promptElement.classList.add("PBE_shadowedElement");
	if(weight !== DEFAULT_PROMPT_WEIGHT) promptElement.innerText += " " + weight;

	if(weight <= 0.8 && weight > 0.6) {
		promptElement.style.transform = "scale(0.9)";
		promptElement.style.zIndex = 3;

	} else if(weight <= 0.6 && weight > 0.4) {
		promptElement.style.transform = "scale(0.8)";
		promptElement.style.zIndex = 2;
		
	} else if(weight <= 0.4) {
		promptElement.style.transform = "scale(0.7)";
		promptElement.style.zIndex = 1;

	}

	if(weight > 1 && weight <= 1.2) {
		promptElement.style.transform = "scale(1.1)";
		promptElement.style.zIndex = 4;

	} else if(weight > 1.2 && weight <= 1.3) {
		promptElement.style.transform = "scale(1.2)";
		promptElement.style.zIndex = 5;

	} else if(weight > 1.3) {
		promptElement.style.transform = "scale(1.3)";
		promptElement.style.zIndex = 6;
	}

	if(!noSplash) {
		const splashElement = document.createElement("div");
		splashElement.className = "PBE_promptElementSplash PBE_currentElement";
		splashElement.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(id);
		splashElement.innerText = id;
		if(weight !== DEFAULT_PROMPT_WEIGHT) splashElement.innerText += " " + weight;

		promptElement.appendChild(splashElement);

		promptElement.addEventListener("mouseover", (e) => {
			const splash = e.currentTarget.querySelector(".PBE_promptElementSplash");
			if(!splash) return;
	
			const position = e.currentTarget.getBoundingClientRect();
			splash.style.top = position.top + "px";
			splash.style.left = position.left + "px";
		});
	}

	promptElement.innerHTML += id;
	return promptElement;
}

