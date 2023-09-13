
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.knownPrompts = {};

PromptsBrowser.knownPrompts.init = (wrapper, positivePrompts, containerId) => {
	const promptBrowser = document.createElement("div");
	promptBrowser.className = "PBE_promptsWrapper";

	const promptsCatalogue = document.createElement("div");
	promptsCatalogue.className = "PBE_promptsCatalogue";
	
	promptBrowser.appendChild(promptsCatalogue);

	PromptsBrowser.DOMCache.containers[containerId].promptBrowser = promptBrowser;
	PromptsBrowser.DOMCache.containers[containerId].promptsCatalogue = promptsCatalogue;

	wrapper.insertBefore(promptBrowser, positivePrompts);
}

PromptsBrowser.knownPrompts.checkFilter = (prompt) => {
    const {state} = PromptsBrowser;

    if(state.filterCategory) {
        if(state.filterCategory === "__none") {
            if(prompt.category !== undefined && prompt.category.length) return false;

        } else {
            if(!prompt.category) return false;
            if(!prompt.category.includes(state.filterCategory)) return false;
        }
    }

    if(state.filterCollection) {
        if(!prompt.collections) return false;
        if(!prompt.collections.includes(state.filterCollection)) return false;
    }

    if(state.filterName) {
        if(!prompt.id.toLowerCase().includes(state.filterName)) return false;
    }

    if(state.filterTags && Array.isArray(state.filterTags)) {
        if(!prompt.tags) return false;
        let out = true;
        const TAG_MODE = "includeAll";

        if(TAG_MODE === "includeAll") {
            out = false;

            for(const filterTag of state.filterTags) {
                let fulfil = false;

                for(const promptTag of prompt.tags) {
                    if(promptTag === filterTag) {
                        fulfil = true;
                        break;
                    }
                }

                if(!fulfil) {
                    out = true;
                    break;
                }
            }

        } else {
            for(const filterTag of state.filterTags) {
                for(const promptTag of prompt.tags) {
                    if(promptTag.includes(filterTag)) {
                        out = false;
                        break;
                    }
                }
            }
        }
        
        if(out)  return false;
    }

    return true;
}

PromptsBrowser.knownPrompts.addPromptItem = (targetItem) => {
    if(!targetItem) return;
    const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
    const activePrompts = PromptsBrowser.getCurrentPrompts();
	const {id, addAtStart, addAfter, addStart, addEnd} = targetItem;

    if(activePrompts.some(item => item.id === id)) return;

	const newPrompt = {id, weight: DEFAULT_PROMPT_WEIGHT, isExternalNetwork: targetItem.isExternalNetwork};

	if(addStart) window.PromptsBrowser.addStrToActive(addStart, true);

	if(addAfter) {
		if(addAtStart) {
			window.PromptsBrowser.addStrToActive(addAfter, true);
			activePrompts.unshift(newPrompt);

		} else {
			activePrompts.push(newPrompt);
			window.PromptsBrowser.addStrToActive(addAfter, false);
		}

	} else {
		if(addAtStart) activePrompts.unshift(newPrompt);
		else activePrompts.push(newPrompt);
	}

	if(addEnd) window.PromptsBrowser.addStrToActive(addEnd, false);
}

/**
 * Adds a random prompt from the prompts corresponding to the current filter settings.
 */
PromptsBrowser.knownPrompts.onAddRandom = () => {
    const {state} = PromptsBrowser;
    const {united} = PromptsBrowser.data;
    const activePrompts = PromptsBrowser.getCurrentPrompts();
    let dataArr = [];

    if(state.filterCollection) {
		const targetCategory = PromptsBrowser.data.original[state.filterCollection];
		if(targetCategory) {
			for(const id in targetCategory) {
				const targetOriginalItem = targetCategory[id];
				const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
				if(targetMixedItem && PromptsBrowser.knownPrompts.checkFilter(targetMixedItem)) dataArr.push({...targetMixedItem});
			}
		}

	} else {
		for(const id in united) {
            if(PromptsBrowser.knownPrompts.checkFilter(united[id])) dataArr.push({...united[id]});
        }
	}

    dataArr = dataArr.filter(dataItem => !activePrompts.some(item => item.id === dataItem.id));

    const randomPrompt = dataArr[Math.floor(Math.random() * dataArr.length)];

    PromptsBrowser.knownPrompts.addPromptItem(randomPrompt);
    PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.knownPrompts.onDragStart = (e) => {
	const {state} = PromptsBrowser;
	const splash = e.currentTarget.querySelector(".PBE_promptElementSplash");
	splash.style.display = "none";

	const promptItem = e.currentTarget.dataset.prompt;

	state.dragItemId = promptItem;
	e.dataTransfer.setData("text", promptItem);
}

PromptsBrowser.knownPrompts.onDragOver = (e) => {
	e.preventDefault();
}

PromptsBrowser.knownPrompts.onDragEnter = (e) => {
	const {state} = PromptsBrowser;
	e.preventDefault();
	const dragItem = e.currentTarget.dataset.prompt;
	const dropItem = state.dragItemId;

	if(!dragItem || !dropItem) return;
	if(dragItem === dropItem) return;
	
	if(PromptsBrowser.utils.isInSameCollection(dragItem, dropItem)) e.currentTarget.classList.add("PBE_swap");
}

PromptsBrowser.knownPrompts.onDragLeave = (e) => {
	e.currentTarget.classList.remove("PBE_swap");
}

PromptsBrowser.knownPrompts.onDrop = (e) => {
	const {state} = PromptsBrowser;
	const dragItem = e.currentTarget.dataset.prompt;
	const dropItem = e.dataTransfer.getData("text");
	e.currentTarget.classList.remove("PBE_swap");

	state.dragItemId = undefined;
	e.preventDefault();
	e.stopPropagation();

	if(PromptsBrowser.utils.isInSameCollection(dragItem, dropItem)) {
		PromptsBrowser.db.movePrompt(dragItem, dropItem);
	}
}

PromptsBrowser.knownPrompts.onPromptClick = (e) => {
    const {readonly} = PromptsBrowser.meta;
	const {united} = PromptsBrowser.data;
	const {state} = PromptsBrowser;

	PromptsBrowser.synchroniseCurrentPrompts();

	const promptItem = e.currentTarget.dataset.prompt;
	const targetItem = united.find(item => item.id === promptItem);
	if(!targetItem) return;

	if(!readonly && e.shiftKey) {
		state.editingPrompt = promptItem;
		PromptsBrowser.promptEdit.update();

		return;
	}

	if(!readonly && (e.metaKey || e.ctrlKey) ) {
		let targetCollection = state.filterCollection;
		if(!targetCollection) {
			
			if(!targetItem.collections) return;
			const firstCollection = targetItem.collections[0];
			if(!firstCollection) return;
			targetCollection = targetItem.collections[0];
		}

		if( confirm(`Remove prompt "${promptItem}" from catalogue "${targetCollection}"?`) ) {
			if(!PromptsBrowser.data.original[targetCollection]) return;

			PromptsBrowser.data.original[targetCollection] = PromptsBrowser.data.original[targetCollection].filter(item => item.id !== promptItem);

            PromptsBrowser.db.movePreviewImage(promptItem, targetCollection, targetCollection, "delete");
			PromptsBrowser.db.saveJSONData(targetCollection);
			PromptsBrowser.db.updateMixedList();
			PromptsBrowser.promptEdit.update();
			PromptsBrowser.currentPrompts.update();
		}

		return;
	}
	
    PromptsBrowser.knownPrompts.addPromptItem(targetItem);
	PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.knownPrompts.showHeader = (wrapper, params = {}) => {
    const {readonly} = PromptsBrowser.meta;
    const {holdTagsInput = false} = params;
	const {state} = PromptsBrowser;

	const headerContainer = document.createElement("div");
	const categorySelector = document.createElement("select");
	const collectionSelector = document.createElement("select");
	const sortingSelector = document.createElement("select");
	const tagsInput = document.createElement("input");
	const nameInput = document.createElement("input");
	tagsInput.placeholder = "tag1, tag2, tag3...";
	nameInput.placeholder = "by name";
	const collectionToolsButton = document.createElement("button");
	collectionToolsButton.className = "PBE_button";
	collectionToolsButton.innerText = "Edit collection";
	collectionToolsButton.style.marginRight = "10px";

	headerContainer.className = "PBE_promptsCatalogueHeader";

	//categories selector
	const categories = PromptsBrowser.data.categories;
	let options = `
		<option value="">All categories</option>
		<option value="__none">Uncategorised</option>
	`;

	for(const categoryItem of categories) {
		if(!categorySelector.value) categorySelector.value = categoryItem;
		options += `<option value="${categoryItem}">${categoryItem}</option>`;
	}
	categorySelector.innerHTML = options;

	if(state.filterCategory) categorySelector.value = state.filterCategory;

	categorySelector.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
		state.filterCategory = value || undefined;

		PromptsBrowser.knownPrompts.update();
	});

	//collection selector
	options = `<option value="">All collections</option>`;

	for(const collectionId in PromptsBrowser.data.original) {
		options += `<option value="${collectionId}">${collectionId}</option>`;
	}
	collectionSelector.innerHTML = options;

	if(state.filterCollection) collectionSelector.value = state.filterCollection;

	collectionSelector.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
		state.filterCollection = value || undefined;

		state.filesIteration++;
		PromptsBrowser.knownPrompts.update();
		PromptsBrowser.currentPrompts.update(true);
	});

	//sorting selector
	options = `
		<option value="">Unsorted</option>
		<option value="reversed">Unsorted reversed</option>
		<option value="alph">Alphabetical</option>
		<option value="alphReversed">Alphabetical reversed</option>
	`;
	sortingSelector.innerHTML = options;

	if(state.sortKnownPrompts) sortingSelector.value = state.sortKnownPrompts;

	sortingSelector.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
		state.sortKnownPrompts = value || undefined;

		PromptsBrowser.knownPrompts.update();
	});

	//tags input
	if(state.filterTags) tagsInput.value = state.filterTags.join(", ");

	tagsInput.addEventListener("change", (e) => {
		const value = e.currentTarget.value;
        if(e.currentTarget.dataset.hint) return;

		let tags = value.split(",").map(item => item.trim());
        
        //removing empty tags
        tags = tags.filter(item => item);

		if(!tags) state.filterTags = undefined;
		else state.filterTags = tags;

		if(state.filterTags && !state.filterTags.length) state.filterTags = undefined;
		if(state.filterTags && state.filterTags.length === 1 && !state.filterTags[0]) state.filterTags = undefined;

		PromptsBrowser.knownPrompts.update({holdTagsInput: true});
	});

    //search input
    if(state.filterName) nameInput.value = state.filterName;

    nameInput.addEventListener("change", (e) => {
        let value = e.currentTarget.value || "";
        value = value.trim();

        if(value) {
            value = value.toLowerCase();
            state.filterName = value;
        } else {
            state.filterName = undefined;
        }
        
        PromptsBrowser.knownPrompts.update();
    });

    if(!readonly) {
        collectionToolsButton.addEventListener("click", (e) => {
            if(state.filterCollection) state.collectionToolsId = state.filterCollection;
            PromptsBrowser.collectionTools.update();
        });
    
        headerContainer.appendChild(collectionToolsButton);
    }
	
	headerContainer.appendChild(collectionSelector);
	headerContainer.appendChild(categorySelector);
	headerContainer.appendChild(tagsInput);
	headerContainer.appendChild(nameInput);
    headerContainer.appendChild(sortingSelector);

	wrapper.appendChild(headerContainer);

    PromptsBrowser.tagTooltip.add(tagsInput);

    if(holdTagsInput) tagsInput.focus();
}

PromptsBrowser.knownPrompts.update = (params) => {
    const {readonly} = PromptsBrowser.meta;
	const {united} = PromptsBrowser.data;
	const {state, makeElement} = PromptsBrowser;
    const {showPromptIndex = false} = state.config;
	const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].promptsCatalogue;
    let scrollState = 0;

    if(wrapper) {
        let prevPromptContainer = wrapper.querySelector(".PBE_promptsCatalogueContent");
        if(prevPromptContainer) {
            scrollState = prevPromptContainer.scrollTop;
            prevPromptContainer = undefined;
        }
    }

	wrapper.innerHTML = "";

	const MAX_ITEMS_TO_DISPLAY = 1000;
	let shownItems = 0;

	if(!united) {
		PromptsBrowser.utils.log("No prompt data to show");
		return;
	}

	PromptsBrowser.knownPrompts.showHeader(wrapper, params);

	const proptsContainer = document.createElement("div");
	proptsContainer.className = "PBE_promptsCatalogueContent PBE_Scrollbar";

	let dataArr = [];

	if(state.filterCollection) {
		const targetCategory = PromptsBrowser.data.original[state.filterCollection];
		if(targetCategory) {
			for(const id in targetCategory) {
				const targetOriginalItem = targetCategory[id];
				const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
				if(targetMixedItem) dataArr.push({...targetMixedItem});
			}
		}

	} else {
		for(const id in united) dataArr.push({...united[id]});
	}
	
	if(state.sortKnownPrompts === "alph" || state.sortKnownPrompts === "alphReversed") {
		dataArr.sort( (A, B) => {
			if(state.sortKnownPrompts === "alph") {
				if(A.id > B.id) return 1;
				if(A.id < B.id) return -1;

			} else {
				if(A.id > B.id) return -1;
				if(A.id < B.id) return 1;
			}

			return 0;
		});
	} else if(state.sortKnownPrompts === "reversed") {
		dataArr.reverse()
	}

    //show Add Random card
    if(dataArr.length) {

        const addRandom = makeElement({
            element: "div",
            className: "PBE_promptElement PBE_promptElement_random",
            content: "Add random"
        });

        addRandom.addEventListener("click", PromptsBrowser.knownPrompts.onAddRandom);

        proptsContainer.appendChild(addRandom);
    }

    for(const index in dataArr) {
        const prompt = dataArr[index];
		const {id} = prompt;
		if(shownItems > MAX_ITEMS_TO_DISPLAY) break;

        if(!PromptsBrowser.knownPrompts.checkFilter(prompt)) continue;
		
		const promptElement = document.createElement("div");
		promptElement.className = "PBE_promptElement";
		promptElement.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(id, state.filterCollection);
		promptElement.dataset.prompt = id;
		promptElement.draggable = "true";
		if(prompt.isExternalNetwork) promptElement.classList.add("PBE_externalNetwork");

		const splashElement = document.createElement("div");
		splashElement.className = "PBE_promptElementSplash";
		splashElement.style.backgroundImage = PromptsBrowser.utils.getPromptPreviewURL(id, state.filterCollection);
		splashElement.innerText = id;

        if(showPromptIndex && state.filterCollection) {
            promptElement.appendChild(makeElement({
                element: "div",
                className: "PBE_promptElementIndex",
                content: index,
            }));
            splashElement.appendChild(makeElement({
                element: "div",
                className: "PBE_promptElementIndex",
                content: index,
            }));
        }

		promptElement.appendChild(splashElement);
		promptElement.innerHTML += id;

        if(!readonly) {
            promptElement.addEventListener("dragstart", PromptsBrowser.knownPrompts.onDragStart);
            promptElement.addEventListener("dragover", PromptsBrowser.knownPrompts.onDragOver);
            promptElement.addEventListener("dragenter", PromptsBrowser.knownPrompts.onDragEnter);
            promptElement.addEventListener("dragleave", PromptsBrowser.knownPrompts.onDragLeave);
            promptElement.addEventListener("drop", PromptsBrowser.knownPrompts.onDrop);
        }

		promptElement.addEventListener("click", PromptsBrowser.knownPrompts.onPromptClick);
		promptElement.addEventListener("mouseover", PromptsBrowser.onPromptCardHover);

		proptsContainer.appendChild(promptElement);
		shownItems++;
	}

	wrapper.appendChild(proptsContainer);

    proptsContainer.scrollTo(0, scrollState);
}
