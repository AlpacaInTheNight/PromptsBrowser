
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.previewSave = {};

PromptsBrowser.previewSave.init = (wrapper, containerId) => {
	const savePromptWrapper = document.createElement("div");
	wrapper.appendChild(savePromptWrapper);

	PromptsBrowser.DOMCache.containers[containerId].savePromptWrapper = savePromptWrapper;
}

PromptsBrowser.previewSave.update = () => {
    const {readonly} = PromptsBrowser.meta;
	const {state} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].savePromptWrapper;
	if(readonly || !wrapper) return;
	wrapper.innerHTML = "";

	if(!state.selectedPrompt) return;

	const savePromptPreviewButton = document.createElement("div");
	savePromptPreviewButton.className = "PBE_actionButton PBE_savePromptPreview";
	savePromptPreviewButton.innerText = "save preview";

	const collectionSelect = document.createElement("select");
	collectionSelect.className = "PBE_select PBE_savePromptSelect";

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
	});

	savePromptPreviewButton.removeEventListener("click", PromptsBrowser.db.savePromptPreview);
	savePromptPreviewButton.addEventListener("click", PromptsBrowser.db.savePromptPreview);

	wrapper.appendChild(collectionSelect);
	wrapper.appendChild(savePromptPreviewButton);
}
