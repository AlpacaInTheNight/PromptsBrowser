
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.setupWindow = {};

PromptsBrowser.setupWindow.init = (wrapper) => {
	const {state} = PromptsBrowser;

	const savedConfigString = localStorage.getItem("PBE_config");
	if(savedConfigString) {
		const savedConfig = JSON.parse(savedConfigString);
		if(savedConfig) state.config = savedConfig;
	}

	const setupWindow = document.createElement("div");
	setupWindow.className = "PBE_setupWindow PBE_generalWindow";

	PromptsBrowser.DOMCache.setupWindow = setupWindow;
	wrapper.appendChild(setupWindow);
}

PromptsBrowser.setupWindow.onChangeLowerCase = (e) => {
	const {state} = PromptsBrowser;
	const checked = e.currentTarget.checked;

	state.config.toLowerCase = checked;
	localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeSpaceMode = (e) => {
	const {state} = PromptsBrowser;
	const value = e.currentTarget.value;

	state.config.spaceMode = value;
	localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeScrollWeight = (e) => {
	const {state} = PromptsBrowser;
	let value = Number(e.currentTarget.value);
	const isBelow = e.currentTarget.dataset.below ? true : false;
	if(Number.isNaN(value)) return;

	if(value > 5) value = 5;
	if(value < 0.01) value = 0.01;

	if(isBelow) state.config.belowOneWeight = value;
	else state.config.aboveOneWeight = value;

	localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.showWeightSetup = (wrapper) => {
	const {state} = PromptsBrowser;
	const {config} = state;

	const scrollBelowOneBlock = document.createElement("div");
	scrollBelowOneBlock.className = "PBE_rowBlock";
	scrollBelowOneBlock.style.maxWidth = "none";

	const scrollBelowOneText = document.createElement("div");
	scrollBelowOneText.innerText = "Below 1 scroll weight:";

	const scrollBelowOneInput = document.createElement("input");
	scrollBelowOneInput.className = "PBE_input";
	scrollBelowOneInput.type = "number";
	scrollBelowOneInput.value = config.belowOneWeight || 0.05;
	scrollBelowOneInput.dataset.below = "true";

	scrollBelowOneInput.addEventListener("change", PromptsBrowser.setupWindow.onChangeScrollWeight);

	scrollBelowOneBlock.appendChild(scrollBelowOneText);
	scrollBelowOneBlock.appendChild(scrollBelowOneInput);


	const scrollAboveOneBlock = document.createElement("div");
	scrollAboveOneBlock.className = "PBE_rowBlock";
	scrollAboveOneBlock.style.maxWidth = "none";

	const scrollAboveOneText = document.createElement("div");
	scrollAboveOneText.innerText = "Above 1 scroll weight:";

	const scrollAboveOneInput = document.createElement("input");
	scrollAboveOneInput.className = "PBE_input";
	scrollAboveOneInput.type = "number";
	scrollAboveOneInput.value = config.aboveOneWeight || 0.5;

	scrollAboveOneInput.addEventListener("change", PromptsBrowser.setupWindow.onChangeScrollWeight);

	scrollBelowOneInput.max = 5;
	scrollBelowOneInput.min = 0.01;

	scrollAboveOneInput.max = 5;
	scrollAboveOneInput.min = 0,01;

	scrollAboveOneBlock.appendChild(scrollAboveOneText);
	scrollAboveOneBlock.appendChild(scrollAboveOneInput);


	wrapper.appendChild(scrollBelowOneBlock);
	wrapper.appendChild(scrollAboveOneBlock);
}

PromptsBrowser.setupWindow.showNormalizeSetup = (wrapper) => {
	const {state} = PromptsBrowser;
	const {config} = state;

	const lowerCaseBlock = document.createElement("div");
	lowerCaseBlock.className = "PBE_rowBlock";
	lowerCaseBlock.style.maxWidth = "none";

	const lowerCaseInput = document.createElement("input");
	lowerCaseInput.id = "PBE_setupLowerCase";
	lowerCaseInput.name = "PBE_setupLowerCase";
	lowerCaseInput.type = "checkbox";
	lowerCaseInput.checked = config.toLowerCase;

	lowerCaseInput.addEventListener("change", PromptsBrowser.setupWindow.onChangeLowerCase);

	const lowerCaseLegend = document.createElement("label");
	lowerCaseLegend.htmlFor = lowerCaseInput.id;
	lowerCaseLegend.textContent = "Transform prompts to lower case:";

	lowerCaseBlock.appendChild(lowerCaseLegend);
	lowerCaseBlock.appendChild(lowerCaseInput);

	const spaceBlock = document.createElement("div");
	spaceBlock.className = "PBE_rowBlock";
	spaceBlock.style.maxWidth = "none";
	const spaceText = document.createElement("div");
	spaceText.innerText = "Spaces in prompts transform:";

	const spaceSelector = document.createElement("select");
	spaceSelector.className = "PBE_select";
	spaceSelector.innerHTML = `
		<option value="">Do nothing</option>
		<option value="space">To space</option>
		<option value="underscore">To underscore</option>
	`;
	spaceSelector.value = config.spaceMode;

	spaceSelector.addEventListener("change", PromptsBrowser.setupWindow.onChangeSpaceMode);

	spaceBlock.appendChild(spaceText);
	spaceBlock.appendChild(spaceSelector);

	wrapper.appendChild(lowerCaseBlock);
	wrapper.appendChild(spaceBlock);
}

PromptsBrowser.setupWindow.update = () => {
	const {state} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.setupWindow;
	if(!wrapper) return;
	wrapper.innerHTML = "Setup window";
	wrapper.style.display = "flex";

	const contentBlock = document.createElement("div");
	const footerBlock = document.createElement("div");
	const closeButton = document.createElement("button");

	contentBlock.className = "PBE_windowContent";
	contentBlock.style.width = "100%";

	PromptsBrowser.setupWindow.showWeightSetup(contentBlock);
	PromptsBrowser.setupWindow.showNormalizeSetup(contentBlock);

	footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
	closeButton.innerText = "Close";
	closeButton.className = "PBE_button";

	closeButton.addEventListener("click", (e) => {
		wrapper.style.display = "none";
	});

	footerBlock.appendChild(closeButton);

	wrapper.appendChild(contentBlock);
	wrapper.appendChild(footerBlock);
}