
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.controlPanel = {};

PromptsBrowser.controlPanel.onTogglePanel = (e) => {
	const {state} = PromptsBrowser;

	state.showControlPanel = !state.showControlPanel;

	PromptsBrowser.controlPanel.update();
	localStorage.setItem("showControlPanel", JSON.stringify(state.showControlPanel));
}

PromptsBrowser.controlPanel.onToggleVisibility = (e) => {
	const {state} = PromptsBrowser;

	const id = e.currentTarget.dataset.id;
	if(!id) return;
	let targetWrapper = undefined;

	if(id === "known") targetWrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].promptBrowser;
	if(id === "current") targetWrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
	if(id === "positive") targetWrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].positivePrompts;
	if(id === "negative") targetWrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].negativePrompts;

	if(!targetWrapper) return;

	if(state.showViews.includes(id)) {
		state.showViews = state.showViews.filter(item => item !== id);
		e.currentTarget.classList.remove("PBE_activeControlIcon");
		targetWrapper.style.display = "none";

	} else {
		state.showViews.push(id);
		e.currentTarget.classList.add("PBE_activeControlIcon");
		targetWrapper.style.display = "";
	}

	localStorage.setItem("PBE_showViews", JSON.stringify(state.showViews));
}

PromptsBrowser.controlPanel.init = (wrapper, containerId) => {
	const controlPanel = document.createElement("div");
	controlPanel.className = "PBE_controlPanel";

	PromptsBrowser.DOMCache.containers[containerId].controlPanel = controlPanel;
	wrapper.prepend(controlPanel);
}

PromptsBrowser.controlPanel.update = () => {
	const {state} = PromptsBrowser;

	const controlPanel = PromptsBrowser.DOMCache.containers[state.currentContainer].controlPanel;
	if(!controlPanel) return;

	controlPanel.innerHTML = "";

	if(state.showControlPanel) controlPanel.classList.remove("PBE_controlPanelHidden");
	else controlPanel.classList.add("PBE_controlPanelHidden");

	const togglePanelButton = document.createElement("div");
	togglePanelButton.className = "PBE_toggleControlPanel";

	togglePanelButton.innerText = state.showControlPanel ? "◀" : "▶";

	togglePanelButton.addEventListener("click", PromptsBrowser.controlPanel.onTogglePanel);

	controlPanel.appendChild(togglePanelButton);

	if(!state.showControlPanel) return;

	const iconKnownPrompts = document.createElement("div");
	const iconCurrentPrompts = document.createElement("div");
	const iconPositiveTextArea = document.createElement("div");
	const iconNegativeTextArea = document.createElement("div");

	iconKnownPrompts.className = "PBE_controlIcon";
	iconCurrentPrompts.className = "PBE_controlIcon";
	iconPositiveTextArea.className = "PBE_controlIcon";
	iconNegativeTextArea.className = "PBE_controlIcon";

	if(state.showViews.includes("known")) iconKnownPrompts.classList.add("PBE_activeControlIcon");
	if(state.showViews.includes("current")) iconCurrentPrompts.classList.add("PBE_activeControlIcon");
	if(state.showViews.includes("positive")) iconPositiveTextArea.classList.add("PBE_activeControlIcon");
	if(state.showViews.includes("negative")) iconNegativeTextArea.classList.add("PBE_activeControlIcon");

	iconKnownPrompts.dataset.id = "known";
	iconCurrentPrompts.dataset.id = "current";
	iconPositiveTextArea.dataset.id = "positive";
	iconNegativeTextArea.dataset.id = "negative";

	iconKnownPrompts.innerText = "K";
	iconCurrentPrompts.innerText = "C";
	iconPositiveTextArea.innerText = "P";
	iconNegativeTextArea.innerText = "N";

	iconKnownPrompts.title = "Known prompts";
	iconCurrentPrompts.title = "Current prompts";
	iconPositiveTextArea.title = "Positive prompts textarea";
	iconNegativeTextArea.title = "Negative prompts textarea";

	iconKnownPrompts.addEventListener("click", PromptsBrowser.controlPanel.onToggleVisibility);
	iconCurrentPrompts.addEventListener("click", PromptsBrowser.controlPanel.onToggleVisibility);
	iconPositiveTextArea.addEventListener("click", PromptsBrowser.controlPanel.onToggleVisibility);
	iconNegativeTextArea.addEventListener("click", PromptsBrowser.controlPanel.onToggleVisibility);

	controlPanel.appendChild(iconKnownPrompts);
	controlPanel.appendChild(iconCurrentPrompts);
	controlPanel.appendChild(iconPositiveTextArea);
	controlPanel.appendChild(iconNegativeTextArea);
}

