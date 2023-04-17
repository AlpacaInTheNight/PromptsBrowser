
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.collectionTools = {};

PromptsBrowser.collectionTools.init = (wrapper) => {
	const collectionTools = document.createElement("div");
	collectionTools.className = "PBE_generalWindow PBE_collectionToolsWindow";
	collectionTools.id = "PBE_collectionTools";

	PromptsBrowser.DOMCache.collectionTools = collectionTools;

	wrapper.appendChild(collectionTools);
}

PromptsBrowser.collectionTools.showHeader = (wrapper) => {
	PromptsBrowser.promptsFilter.update(wrapper, "collectionTools");

}

PromptsBrowser.collectionTools.showPromptsDetailed = (wrapper) => {
	const {promptsFilter} = PromptsBrowser.state;
	const filterSetup = promptsFilter["collectionTools"];
	const {state, data} = PromptsBrowser;
	const {collectionToolsId} = state;
	const targetCollection = data.original[collectionToolsId];
	if(!targetCollection) return;

	wrapper.classList.add("PBE_detailedItemContainer");

	for(const item of targetCollection) {
		const {id, tags = [], category = [], comment = "", previewImage} = item;
		if(!id) continue;
		if(!PromptsBrowser.utils.checkFilter(item, filterSetup)) continue;

		const promptContainer = document.createElement("div");

		const topContainer = document.createElement("div");
		const bottomContainer = document.createElement("div");

		const nameContainer = document.createElement("div");
		const tagsContainer = document.createElement("div");
		const categoriesContainer = document.createElement("div");
		const commentContainer = document.createElement("div");

		promptContainer.className = "PBE_detailedItem";
		topContainer.className = "PBE_detailedItemTop";
		bottomContainer.className = "PBE_detailedItemBottom";

		nameContainer.className = "PBE_detailedItemName";
		commentContainer.className = "PBE_detailedItemComment";

		tagsContainer.className = "PBE_detailedItemTags";
		categoriesContainer.className = "PBE_detailedItemCategories";

		nameContainer.innerText = id;
		tagsContainer.innerText = tags.join(", ");
		categoriesContainer.innerText = category.join(", ");

		commentContainer.innerText = comment;

		topContainer.appendChild(nameContainer);
		topContainer.appendChild(commentContainer);

		bottomContainer.appendChild(tagsContainer);
		bottomContainer.appendChild(categoriesContainer);

		promptContainer.appendChild(topContainer);
		promptContainer.appendChild(bottomContainer);

		wrapper.appendChild(promptContainer);
	}
}

PromptsBrowser.collectionTools.showPromptsShort = () => {

}

PromptsBrowser.collectionTools.update = () => {
	const {state, data} = PromptsBrowser;
	const wrapper = PromptsBrowser.DOMCache.collectionTools;

	if(!wrapper || !data) return;

	if(!state.collectionToolsId) {
		for(const colId in data.original) {
			state.collectionToolsId = colId;
			break;
		}
	}

	if(!state.collectionToolsId) return;

	wrapper.innerHTML = "";
	wrapper.style.display = "flex";

	const footerBlock = document.createElement("div");
	const closeButton = document.createElement("button");
	footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_toolsFooter";
	closeButton.innerText = "Close";
	closeButton.className = "PBE_button";

	closeButton.addEventListener("click", (e) => {
		wrapper.style.display = "none";
	});

	const headerBlock = document.createElement("div");
	headerBlock.className = "PBE_collectionToolsHeader";

	const contentBlock = document.createElement("div");
	contentBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";

	PromptsBrowser.collectionTools.showHeader(headerBlock);
	PromptsBrowser.collectionTools.showPromptsDetailed(contentBlock);

	footerBlock.appendChild(closeButton);

	wrapper.appendChild(headerBlock);
	wrapper.appendChild(contentBlock);
	wrapper.appendChild(footerBlock);
}
