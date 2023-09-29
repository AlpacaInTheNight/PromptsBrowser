
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.promptTools = {};

PromptsBrowser.promptTools.currentFilters = {
    collection: "",
    category: "",
    tags: [],
    name: "",
}

PromptsBrowser.promptTools.possibleFilters = {
    collection: "",
    category: "",
    tags: [],
    name: "",
}

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
    const replaceMode = state.toggledButtons.includes("tools_replaceMode");
    let activePrompts = PromptsBrowser.getCurrentPrompts();

    const targetPrompt = united.find(item => item.id === clickPrompt);
    if(!targetPrompt) return;

    const currTargetIndex = activePrompts.findIndex(item => item.id === currPrompt);
    const clickTargetIndex = activePrompts.findIndex(item => item.id === clickPrompt);
    if(currTargetIndex === -1) return;

    if(clickTargetIndex !== -1) {

        if(e.metaKey || e.ctrlKey) {
            activePrompts = activePrompts.filter(item => item.id !== clickPrompt);
            PromptsBrowser.setCurrentPrompts(activePrompts);

        } else if(e.shiftKey) {
            state.editingPrompt = clickPrompt;
            PromptsBrowser.promptEdit.update();

        } else {
            state.promptToolsId = clickPrompt;
            
        }

        PromptsBrowser.promptTools.update();
        PromptsBrowser.currentPrompts.update();
        return;
    }

    const newItem = {id: clickPrompt, weight: DEFAULT_PROMPT_WEIGHT, isExternalNetwork: targetPrompt.isExternalNetwork};

    let action = "";

    if(e.shiftKey) {
        state.editingPrompt = clickPrompt;
        PromptsBrowser.promptEdit.update();
    } else {
        if(replaceMode) action = e.altKey ? "add" : "replace";
        else action = e.altKey ? "replace" : "add";
    }

    if(action === "add") activePrompts.splice(currTargetIndex, 0, newItem);
    else if (action === "replace") {
        activePrompts[currTargetIndex] = newItem;
        state.promptToolsId = clickPrompt;
    }

    PromptsBrowser.promptTools.update();
    PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.promptTools.showCurrentPrompts = (wrapper) => {
    const {state, data, makeElement, makeSelect} = PromptsBrowser;
    const {currentFilters} = PromptsBrowser.promptTools;
    const {checkFilter} = PromptsBrowser.promptsSimpleFilter;
    const activePrompts = PromptsBrowser.getCurrentPrompts();
    if(!state.promptToolsId) return;

    const setupContainer = makeElement({element: "div", className: "PBE_List PBE_toolsSetup"});
    const currentPromptsContainer = makeElement({element: "div", className: "PBE_windowCurrentList PBE_Scrollbar"});
    
    //setup fieldset
    const setupField = makeElement({element: "fieldset", className: "PBE_fieldset"});
    const setupLegend = makeElement({element: "legend", content: "Setup"});

    const showAll = makeElement({element: "div", content: "Show All", className: "PBE_toggleButton"});
    const replaceMode = makeElement({element: "div", content: "Replace mode", className: "PBE_toggleButton"});
    showAll.dataset.id = "tools_showAll";
    replaceMode.dataset.id = "tools_replaceMode";

    if(state.toggledButtons.includes("tools_showAll")) showAll.classList.add("PBE_toggledButton");
    if(state.toggledButtons.includes("tools_replaceMode")) replaceMode.classList.add("PBE_toggledButton");
    showAll.addEventListener("click", PromptsBrowser.promptTools.onToggleButton);
    replaceMode.addEventListener("click", PromptsBrowser.promptTools.onToggleButton);

    setupField.appendChild(setupLegend);
    setupField.appendChild(showAll);
    setupField.appendChild(replaceMode);

    //similarity fieldset
    const simField = makeElement({element: "fieldset", className: "PBE_fieldset"});
    const simLegend = makeElement({element: "legend", content: "Similarity by:"});

    const showTags = makeElement({element: "div", content: "Tags", className: "PBE_toggleButton"});
    const showCategory = makeElement({element: "div", content: "Category", className: "PBE_toggleButton"});
    const showName = makeElement({element: "div", content: "Name", className: "PBE_toggleButton"});

    simField.appendChild(simLegend);
    simField.appendChild(showTags);
    simField.appendChild(showCategory);
    simField.appendChild(showName);

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
        if(!currPrompt || currPrompt.isSyntax) continue;
        if(!checkFilter(currPrompt.id, currentFilters)) continue;
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

    setupContainer.appendChild(setupField);
    setupContainer.appendChild(simField);

    wrapper.appendChild(currentPromptsContainer);
    wrapper.appendChild(setupContainer);
}

PromptsBrowser.promptTools.showPossiblePromptswrapper = (wrapper) => {
    const {replaceAllRegex} = window.PromptsBrowser;
    const {united} = PromptsBrowser.data;
    const {state} = PromptsBrowser;
    const {maxCardsShown = 1000} = state.config;
    const {possibleFilters} = PromptsBrowser.promptTools;
    const {checkFilter} = PromptsBrowser.promptsSimpleFilter;
    const prompt = state.promptToolsId;
    const activePrompts = PromptsBrowser.getCurrentPrompts();
    const showAll = state.toggledButtons.includes("tools_showAll");
    if(!prompt) return;
    let targetTags = [];
    let targetCategories = [];
    let targetNameWords = replaceAllRegex(prompt.toLowerCase(), "_", " ").split(" ");
    let shownItems = 0;

    const targetPromptItem = united.find(item => item.id === prompt);
    if(targetPromptItem) {
        targetTags = targetPromptItem.tags || [];
        targetCategories = targetPromptItem.category || [];
    }

    const nameArr = prompt.split(" ");
    const possiblePrompts = [];
    const addedIds = [];

    for(const index in united) {
        const item = united[index];
        if(shownItems > maxCardsShown) break;

        const {id, tags, category} = item;

        if(!checkFilter(id, possibleFilters)) continue;

        //similarity index based on the same tags, categories and words used in the prompt name
        let simIndex = 0;

        if(id === prompt) continue;

        let nameWords = replaceAllRegex(id.toLowerCase(), "_", " ").split(" ");

        if(state.toggledButtons.includes("tools_tags"))
            targetTags.forEach(tagItem => {if(tags.includes(tagItem)) simIndex++});
        
        if(state.toggledButtons.includes("tools_category"))
            targetCategories.forEach(catItem => {if(category.includes(catItem)) simIndex++});
        
        if(state.toggledButtons.includes("tools_name"))
            targetNameWords.forEach(wordItem => {if(nameWords.includes(wordItem)) simIndex++});

        if(showAll) {
            possiblePrompts.push({...item, simIndex});
            shownItems++;
            continue
        }

        if(state.toggledButtons.includes("tools_tags") && targetTags.length) {
            targetTags.some(targetTag => {
                if(tags.includes(targetTag)) {
                    possiblePrompts.push({...item, simIndex});
                    shownItems++;

                    return true;
                }
            });
        }

        if(state.toggledButtons.includes("tools_category") && targetCategories.length) {
            targetCategories.some(targetCategory => {
                if(category.includes(targetCategory)) {
                    possiblePrompts.push({...item, simIndex});
                    shownItems++;

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
                        shownItems++;

                        break wordLoop;
                    }
                }
            }
        }
    };

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

    const currentFilterBlock = document.createElement("div");
    const possibleFilterBlock = document.createElement("div");

    const currentPromptsBlock = document.createElement("div");
    const possiblePromptsBlock = document.createElement("div");
    const footerBlock = document.createElement("div");
    const closeButton = document.createElement("button");
    footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_toolsFooter";
    currentFilterBlock.className = "PBE_dataBlock PBE_toolsFilter";
    possibleFilterBlock.className = "PBE_dataBlock PBE_toolsFilter";
    currentPromptsBlock.className = "PBE_dataBlock PBE_toolsHeader";
    possiblePromptsBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
    closeButton.innerText = "Close";
    closeButton.className = "PBE_button";

    PromptsBrowser.promptsSimpleFilter.show(currentFilterBlock, PromptsBrowser.promptTools.currentFilters, PromptsBrowser.promptTools.update);
    PromptsBrowser.promptTools.showCurrentPrompts(currentPromptsBlock);

    PromptsBrowser.promptsSimpleFilter.show(possibleFilterBlock, PromptsBrowser.promptTools.possibleFilters, PromptsBrowser.promptTools.update);
    PromptsBrowser.promptTools.showPossiblePromptswrapper(possiblePromptsBlock);

    closeButton.addEventListener("click", PromptsBrowser.promptTools.onCloseWindow);

    footerBlock.appendChild(closeButton);

    wrapper.appendChild(backImage);

    wrapper.appendChild(currentFilterBlock);
    wrapper.appendChild(currentPromptsBlock);

    wrapper.appendChild(possibleFilterBlock);
    wrapper.appendChild(possiblePromptsBlock);

    wrapper.appendChild(footerBlock);
}
