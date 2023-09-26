
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.styles = {};

PromptsBrowser.styles.selectedItem = {
    collection: "",
    styleId: "",
    index: 0,
}

PromptsBrowser.styles.init = (mainWrapper) => {
    const stylesWindow = document.createElement("div");

    stylesWindow.className = "PBE_generalWindow PBE_stylesWindow";
    stylesWindow.id = "PBE_stylesWindow";

    PromptsBrowser.DOMCache.stylesWindow = stylesWindow;
    mainWrapper.appendChild(stylesWindow);
    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.styles.onCloseWindow;

    stylesWindow.addEventListener("click", () => {
        PromptsBrowser.onCloseActiveWindow = PromptsBrowser.styles.onCloseWindow;
    });
}

PromptsBrowser.styles.initButton = (positiveWrapper) => {
    const addStylesButton = document.createElement("button");

    addStylesButton.className = "PBE_actionButton PBE_stylesButton";
    addStylesButton.innerText = "Styles";

    addStylesButton.addEventListener("click", PromptsBrowser.styles.onOpenStyles);

    positiveWrapper.appendChild(addStylesButton);
}



PromptsBrowser.styles.onCloseWindow = () => {
    const {state} = PromptsBrowser;
    const wrapper = PromptsBrowser.DOMCache.stylesWindow;
    if(!wrapper || !state.showStylesWindow) return;

    state.showStylesWindow = undefined;
    wrapper.style.display = "none";
}

PromptsBrowser.styles.onCardClick = (e) => {
    const isShift = e.shiftKey;
    const isCtrl = e.metaKey || e.ctrlKey;

    if(isShift) PromptsBrowser.styles.applyStyle(e, false);
    else if(isCtrl) PromptsBrowser.styles.removeStyle(e);
    else PromptsBrowser.styles.onSelectStyle(e);
}

PromptsBrowser.styles.onChangeFilterCollection = (e) => {
    const {state} = PromptsBrowser;
    const value = e.currentTarget.value;

    state.filterStyleCollection = value;
    PromptsBrowser.styles.update();
}

PromptsBrowser.styles.onChangeFilterName = (e) => {
    const {state} = PromptsBrowser;
    const value = e.currentTarget.value;

    state.filterStyleName = value.toLowerCase();
    PromptsBrowser.styles.update();
}

PromptsBrowser.styles.onChangeNewCollection = (e) => {
    const {state} = PromptsBrowser;
    const value = e.currentTarget.value;
    if(!value) return;

    state.newStyleCollection = value;
}

PromptsBrowser.styles.onToggleShortMode = (e) => {
    const {state} = PromptsBrowser;
    const id = "styles_simplified_view";

    if(state.toggledButtons.includes(id)) {
        state.toggledButtons = state.toggledButtons.filter(item => item !== id);
    } else {
        state.toggledButtons.push(id);
    }
    
    PromptsBrowser.styles.update();
}

PromptsBrowser.styles.grabCurrentStyle = (styleName) => {
    const {data, state} = PromptsBrowser;
    const {saveStyleMeta = {}} = state.config || {};
    const collectionId = state.newStyleCollection;
    if(!collectionId) return false;
    if(!data.styles) return false;

    let seed = undefined;
    let negative = undefined;
    let width = undefined;
    let height = undefined;
    let steps = undefined;
    let cfg = undefined;
    let sampling = undefined;

    const activePrompts = PromptsBrowser.getCurrentPrompts();
    const seedInput = PromptsBrowser.DOMCache.containers[state.currentContainer].seedInput;
    const negativePrompts = PromptsBrowser.DOMCache.containers[state.currentContainer].negativePrompts;

    const widthInput = PromptsBrowser.DOMCache.containers[state.currentContainer].widthInput;
    const heightInput = PromptsBrowser.DOMCache.containers[state.currentContainer].heightInput;
    const stepsInput = PromptsBrowser.DOMCache.containers[state.currentContainer].stepsInput;
    const cfgInput = PromptsBrowser.DOMCache.containers[state.currentContainer].cfgInput;
    const samplingInput = PromptsBrowser.DOMCache.containers[state.currentContainer].samplingInput;

    if(seedInput) {
        const seedValue = Number(seedInput.value);
        if(seedValue !== undefined && seedValue !== -1 && !Number.isNaN(seedValue)) seed = seedValue;
    }

    if(negativePrompts) {
        const negativeTextAreas = negativePrompts.getElementsByTagName("textarea");
        if(negativeTextAreas && negativeTextAreas[0]) negative = negativeTextAreas[0].value;
    }

    if(widthInput) width = Number(widthInput.value);
    if(heightInput) height = Number(heightInput.value);
    if(stepsInput) steps = Number(stepsInput.value);
    if(cfgInput) cfg = Number(cfgInput.value);
    if(samplingInput) sampling = samplingInput.value;

    if(Number.isNaN(width)) width = undefined;
    if(Number.isNaN(height)) height = undefined;
    if(Number.isNaN(steps)) steps = undefined;
    if(Number.isNaN(cfg)) cfg = undefined;

    if(!activePrompts || !activePrompts.length) return;
    const targetCollection = data.styles[collectionId];
    if(!targetCollection) return;

    const newStyle = {positive: JSON.parse(JSON.stringify(activePrompts))};
    if(styleName) newStyle.name = styleName;

    if(saveStyleMeta.seed && seed !== undefined) newStyle.seed = seed;
    if(saveStyleMeta.negative && negative !== undefined) newStyle.negative = negative;
    
    if(saveStyleMeta.size && width !== undefined) newStyle.width = width;
    if(saveStyleMeta.size && height !== undefined) newStyle.height = height;
    
    if(saveStyleMeta.quality && steps !== undefined) newStyle.steps = steps;
    if(saveStyleMeta.quality && cfg !== undefined) newStyle.cfg = cfg;
    
    if(saveStyleMeta.sampler && sampling) newStyle.sampling = sampling;

    return newStyle;
}

PromptsBrowser.styles.onSaveStyle = () => {
    const {data, state} = PromptsBrowser;
    const collectionId = state.newStyleCollection;
    if(!collectionId) return;

    const targetCollection = data.styles[collectionId];
    if(!targetCollection) return;

    const styleNameInput = PromptsBrowser.DOMCache.stylesWindow.querySelector("#PBE_newStyleName");

    const name = styleNameInput.value;
    if(!name || !data.styles) return;

    const newStyle = PromptsBrowser.styles.grabCurrentStyle(name);
    if(!newStyle) return;

    targetCollection.push(newStyle);

    PromptsBrowser.db.updateStyles(collectionId);
    PromptsBrowser.styles.update();
}

PromptsBrowser.styles.removeStyle = (e) => {
    const {readonly} = PromptsBrowser.meta;
    const {data} = PromptsBrowser;
    const {state} = PromptsBrowser;
    if(readonly || !data.styles) return;

    let collectionId = undefined;
    let index = undefined;

    if(e.currentTarget.dataset.action) {
        const {selectedItem} = PromptsBrowser.styles;
        collectionId = selectedItem.collection;
        index = selectedItem.index;

    } else {
        collectionId = e.currentTarget.dataset.id;
        index = Number(e.currentTarget.dataset.index);
    }

    if(!collectionId || Number.isNaN(index)) return;

    const targetCollection = data.styles[collectionId];
    if(!targetCollection) return;

    const targetStyle = data.styles[collectionId][index];
    if(!targetStyle) return;

    if( confirm(`Remove style "${targetStyle.name}" from catalogue "${collectionId}"?`) ) {
        targetCollection.splice(index, 1);

        PromptsBrowser.db.updateStyles(collectionId);
        PromptsBrowser.styles.update();
    }
}

PromptsBrowser.styles.updateStyle = (e) => {
    const {data} = PromptsBrowser;
    if(!data.styles) return;

    let collectionId = undefined;
    let index = undefined;

    if(e.currentTarget.dataset.action) {
        const {selectedItem} = PromptsBrowser.styles;
        collectionId = selectedItem.collection;
        index = selectedItem.index;

    } else {
        collectionId = e.currentTarget.dataset.id;
        index = Number(e.currentTarget.dataset.index);
    }

    if(!collectionId || Number.isNaN(index)) return;

    const targetCollection = data.styles[collectionId];
    if(!targetCollection) return;

    const targetStyle = data.styles[collectionId][index];
    if(!targetStyle) return;

    if( confirm(`Replace style "${targetStyle.name}" params to the currently selected?`) ) {
        const newStyle = PromptsBrowser.styles.grabCurrentStyle();
        if(!newStyle) return;

        for(const i in newStyle) {
            targetStyle[i] = newStyle[i];
        }

        for(const i in targetStyle) {
            if(i === "name") continue;

            if(!newStyle[i]) delete targetStyle[i];
        }

        PromptsBrowser.db.updateStyles(collectionId);
        PromptsBrowser.styles.update();
    }
}

PromptsBrowser.styles.onSelectStyle = (e) => {
    const collection = e.currentTarget.dataset.id;
    const styleId = e.currentTarget.dataset.name;
    const index = Number(e.currentTarget.dataset.index);
    if(!collection || Number.isNaN(index)) return;

    if(e.currentTarget.classList.contains("PBE_selectedCurrentElement")) {
        PromptsBrowser.styles.selectedItem = {collection: "", styleId: "", index: 0};
        e.currentTarget.classList.remove("PBE_selectedCurrentElement");

    } else {
        PromptsBrowser.styles.selectedItem = {collection, styleId, index};

        const prevSelected = e.currentTarget.parentNode.querySelector(".PBE_selectedCurrentElement");
        if(prevSelected) prevSelected.classList.remove("PBE_selectedCurrentElement");

        e.currentTarget.classList.add("PBE_selectedCurrentElement");
    }
    
}

PromptsBrowser.styles.onChangeSaveMeta = (e) => {
    const {state} = PromptsBrowser;
    const checked = e.currentTarget.checked;
    const target = e.currentTarget.dataset.id;
    if(!target) return;

    if(!state.config) state.config = {};
    if(!state.config.saveStyleMeta) state.config.saveStyleMeta = {};

    state.config.saveStyleMeta[target] = checked;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.styles.applyStyle = (e, isAfter) => {
    const {data} = PromptsBrowser;
    if(!data.styles) return;
    if(isAfter === undefined) isAfter = e.currentTarget.dataset.isafter ? true : false;
    
    let collectionId = undefined;
    let index = undefined;

    if(e.currentTarget.dataset.action) {
        const {selectedItem} = PromptsBrowser.styles;
        collectionId = selectedItem.collection;
        index = selectedItem.index;

    } else {
        collectionId = e.currentTarget.dataset.id;
        index = Number(e.currentTarget.dataset.index);
    }

    if(!collectionId || Number.isNaN(index)) return;

    const targetCollection = data.styles[collectionId];
    if(!targetCollection) return;

    const targetStyle = data.styles[collectionId][index];
    if(!targetStyle) return;

    PromptsBrowser.applyStyle(targetStyle, isAfter);

    PromptsBrowser.styles.update();
}

PromptsBrowser.styles.onOpenStyles = () => {
    const {state} = PromptsBrowser;

    state.showStylesWindow = true;
    PromptsBrowser.styles.update();
}

PromptsBrowser.styles.showCurrentPrompts = (wrapper) => {
    const {data, makeElement, makeCheckbox} = PromptsBrowser;
    const {state} = PromptsBrowser;
    let activePrompts = PromptsBrowser.getCurrentPrompts();

    const setupContainer = document.createElement("div");
    const currentPromptsContainer = document.createElement("div");

    currentPromptsContainer.className = "PBE_windowCurrentList PBE_Scrollbar";

    for(const i in activePrompts) {
        const currPrompt = activePrompts[i];

        const promptElement = PromptsBrowser.showPromptItem({id: currPrompt.id, isExternalNetwork: currPrompt.isExternalNetwork}, {});
        currentPromptsContainer.appendChild(promptElement);

        promptElement.addEventListener("click", (e) => {
            const currentId = e.currentTarget.dataset.prompt;
            if(!currentId) return;

            if(e.ctrlKey || e.metaKey) {
                activePrompts = activePrompts.filter(item => item.id !== currentId);
                PromptsBrowser.setCurrentPrompts(activePrompts);
                PromptsBrowser.styles.update();
                PromptsBrowser.currentPrompts.update();

                return;
            }
        });
    }

    currentPromptsContainer.addEventListener("wheel", (e) => {
        if(!e.deltaY) return;

        e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
        e.preventDefault();
    });


    wrapper.appendChild(currentPromptsContainer);
}

PromptsBrowser.styles.showAddStyle = (wrapper) => {
    const {data, makeElement, makeCheckbox} = PromptsBrowser;
    const {state} = PromptsBrowser;
    const {saveStyleMeta = {}} = state.config || {};

    const setupContainer = document.createElement("div");

    setupContainer.className = "PBE_List PBE_stylesSetup";

    const styleNameInput = document.createElement("input");
    const saveButton = document.createElement("button");
    saveButton.innerText = "Save as style";
    saveButton.className = "PBE_button";
    styleNameInput.placeholder = "Style name";
    styleNameInput.className = "PBE_newStyleName";
    styleNameInput.id = "PBE_newStyleName";

    saveButton.addEventListener("click", PromptsBrowser.styles.onSaveStyle);

    const collectionSelect = document.createElement("select");
    collectionSelect.className = "PBE_select";
    collectionSelect.style.height = "30px";
    collectionSelect.style.marginRight = "5px";
    let options = "";
    for(const collectionId in data.styles) {
        if(!state.newStyleCollection) state.newStyleCollection = collectionId;

        options += `<option value="${collectionId}">${collectionId}</option>`;
    }

    collectionSelect.innerHTML = options;
    collectionSelect.value = state.newStyleCollection;

    collectionSelect.addEventListener("change", PromptsBrowser.styles.onChangeNewCollection);

    const onChange = PromptsBrowser.styles.onChangeSaveMeta;

    const keepSeed =
        makeCheckbox({onChange, checked: saveStyleMeta.seed, name: "Seed", id: "PBE_keepSeed", data: "seed"});
    const keepNegative =
        makeCheckbox({onChange, checked: saveStyleMeta.negative, name: "Negative", id: "PBE_keepNegative", data: "negative"});
    const keepSize =
        makeCheckbox({onChange, checked: saveStyleMeta.size, name: "Size", id: "PBE_keepSize", data: "size"});
    const keepSampler =
        makeCheckbox({onChange, checked: saveStyleMeta.sampler, name: "Sampler", id: "PBE_keepSampler", data: "sampler"});
    const keepQuality =
        makeCheckbox({onChange, checked: saveStyleMeta.quality, name: "Quality", id: "PBE_keepQuality", data: "quality"});

    const saveRow = makeElement({element: "div", className: "PBE_row"});
    const paramsRow = makeElement({element: "fieldset", className: "PBE_fieldset"});
    const paramsRowLegend = makeElement({element: "legend", content: "Save meta:"});

    saveRow.appendChild(collectionSelect);
    saveRow.appendChild(saveButton);

    paramsRow.appendChild(paramsRowLegend);
    paramsRow.appendChild(keepNegative);
    paramsRow.appendChild(keepSize);
    paramsRow.appendChild(keepSampler);
    paramsRow.appendChild(keepQuality);
    paramsRow.appendChild(keepSeed);

    setupContainer.appendChild(styleNameInput);
    setupContainer.appendChild(saveRow);

    wrapper.appendChild(setupContainer);
    wrapper.appendChild(paramsRow);
}

PromptsBrowser.styles.showFilters = (wrapper) => {
    const {data} = PromptsBrowser;
    const {state} = PromptsBrowser;

    const toggleShortMode = document.createElement("div");
    toggleShortMode.className = "PBE_toggleButton";
    toggleShortMode.innerText = "Simple mode";
    toggleShortMode.title = "Toggles simplified view mode";
    if(state.toggledButtons.includes("styles_simplified_view")) toggleShortMode.classList.add("PBE_toggledButton");
    toggleShortMode.style.height = "16px";

    toggleShortMode.addEventListener("click", PromptsBrowser.styles.onToggleShortMode);

    const collectionSelect = document.createElement("select");
    collectionSelect.className = "PBE_select";
    let options = "<option value=''>Any</option>";
    for(const collectionId in data.styles) {
        options += `<option value="${collectionId}">${collectionId}</option>`;
    }

    collectionSelect.innerHTML = options;
    collectionSelect.value = state.filterStyleCollection || "";

    collectionSelect.addEventListener("change", PromptsBrowser.styles.onChangeFilterCollection);

    const nameFilter = document.createElement("input");
    nameFilter.placeholder = "Search name";
    nameFilter.className = "PBE_input";
    nameFilter.value = state.filterStyleName || "";

    nameFilter.addEventListener("change", PromptsBrowser.styles.onChangeFilterName);

    wrapper.appendChild(toggleShortMode);
    wrapper.appendChild(collectionSelect);
    wrapper.appendChild(nameFilter);
}

PromptsBrowser.styles.showStylesShort = (wrapper) => {
    const {data} = PromptsBrowser;
    const {filterStyleCollection, filterStyleName} = PromptsBrowser.state;
    const {EMPTY_CARD_GRADIENT} = PromptsBrowser.params;

    let styles = [];

    for(const collectionId in data.styles) {

        for(let i = 0; i < data.styles[collectionId].length; i++) {
            const styleItem = data.styles[collectionId][i];

            styles.push({...styleItem, id: collectionId, index: i});
        }
    }
    
    styles.sort( (A, B) => {
        if(A.name > B.name) return 1;
        if(A.name < B.name) return -1;

        return 0;
    });

    //const iteration = new Date().valueOf();

    for(const style of styles) {
        const {name, positive, id, index, previewImage} = style;
        if(!name) continue;
        if(filterStyleCollection && filterStyleCollection !== id) continue;
        if(filterStyleName && !name.toLowerCase().includes(filterStyleName)) continue;
        let url = EMPTY_CARD_GRADIENT;

        if(previewImage) {
            //const safeFileName = PromptsBrowser.makeFileNameSafe(name);
            //url = `url('./file=styles_catalogue/${id}/preview/${safeFileName}.${previewImage}?${iteration}')`;
            url = PromptsBrowser.utils.getStylePreviewURL(style);
        }

        const element = PromptsBrowser.showPromptItem({id: name}, {url});
        element.dataset.id = id;
        element.dataset.index = index;
        element.dataset.name = name;

        if(PromptsBrowser.styles.selectedItem.collection === id && PromptsBrowser.styles.selectedItem.index === index) {
            element.classList.add("PBE_selectedCurrentElement");
        }

        element.addEventListener("click", PromptsBrowser.styles.onCardClick);

        wrapper.appendChild(element);
    }
}

PromptsBrowser.styles.showActions = (wrapper) => {
    const {readonly} = PromptsBrowser.meta;

    const actionContainer = document.createElement("fieldset");
    actionContainer.className = "PBE_fieldset";
    const actionLegend = document.createElement("legend");
    actionLegend.innerText = "Actions";

    const addBeforeButton = document.createElement("div");
    addBeforeButton.innerText = "Add before";
    addBeforeButton.className = "PBE_button";
    addBeforeButton.title = "Add style prompts at the start of current prompts";
    addBeforeButton.dataset.action = "true";
    addBeforeButton.addEventListener("click", PromptsBrowser.styles.applyStyle);

    const addAfterButton = document.createElement("div");
    addAfterButton.innerText = "Add after";
    addAfterButton.className = "PBE_button";
    addAfterButton.title = "Add style prompts at the end of current prompts";
    addAfterButton.dataset.action = "true";
    addAfterButton.dataset.isafter = "true";
    addAfterButton.addEventListener("click", PromptsBrowser.styles.applyStyle);

    actionContainer.appendChild(actionLegend);
    actionContainer.appendChild(addBeforeButton);
    actionContainer.appendChild(addAfterButton);

    const editContainer = document.createElement("fieldset");
    editContainer.className = "PBE_fieldset";
    const editLegend = document.createElement("legend");
    editLegend.innerText = "Edit";

    const updateButton = document.createElement("div");
    updateButton.innerText = "Update";
    updateButton.className = "PBE_button";
    updateButton.title = "Update selected style";
    updateButton.dataset.action = "true";
    updateButton.addEventListener("click", PromptsBrowser.styles.updateStyle);

    const updatePreviewButton = document.createElement("div");
    updatePreviewButton.innerText = "Update preview";
    updatePreviewButton.className = "PBE_button";
    updatePreviewButton.title = "Delete selected style";
    updatePreviewButton.dataset.action = "true";
    updatePreviewButton.addEventListener("click", PromptsBrowser.db.onUpdateStylePreview);
    
    editContainer.appendChild(editLegend);
    editContainer.appendChild(updateButton);
    editContainer.appendChild(updatePreviewButton);


    const systemContainer = document.createElement("fieldset");
    systemContainer.className = "PBE_fieldset";
    const systemLegend = document.createElement("legend");
    systemLegend.innerText = "System";

    const deleteButton = document.createElement("div");
    deleteButton.innerText = "Delete";
    deleteButton.className = "PBE_button PBE_buttonCancel";
    deleteButton.title = "Delete selected style";
    deleteButton.dataset.action = "true";
    deleteButton.addEventListener("click", PromptsBrowser.styles.removeStyle);

    systemContainer.appendChild(systemLegend);
    systemContainer.appendChild(deleteButton);

    wrapper.appendChild(actionContainer);

    if(!readonly) {
        wrapper.appendChild(editContainer);
        wrapper.appendChild(systemContainer);
    }
}

PromptsBrowser.styles.showStyles = (wrapper) => {
    const {readonly} = PromptsBrowser.meta;
    const {data} = PromptsBrowser;
    const {state} = PromptsBrowser;
    const {filterStyleCollection, filterStyleName} = state;
    const activePrompts = PromptsBrowser.getCurrentPrompts();

    let styles = [];

    for(const collectionId in data.styles) {

        for(let i = 0; i < data.styles[collectionId].length; i++) {
            const styleItem = data.styles[collectionId][i];

            styles.push({...styleItem, id: collectionId, index: i});
        }
    }
    
    styles.sort( (A, B) => {
        if(A.name > B.name) return 1;
        if(A.name < B.name) return -1;

        return 0;
    });

    for(const style of styles) {
        const {name, positive, id, index, previewImage} = style;

        if(filterStyleCollection && filterStyleCollection !== id) continue;
        if(filterStyleName && !name.toLowerCase().includes(filterStyleName)) continue;

        const stylesItem = document.createElement("div");
        const styleHeader = document.createElement("div");
        const nameContainer = document.createElement("div");
        const contentContainer = document.createElement("div");
        const updatePreview = document.createElement("div");

        const currentPromptsContainer = document.createElement("div");
        const actionsContainer = document.createElement("div");

        stylesItem.className = "PBE_styleItem";
        styleHeader.className = "PBE_styleHeader";
        nameContainer.className = "PBE_styleItemName";
        contentContainer.className = "PBE_styleItemContent";
        currentPromptsContainer.className = "PBE_stylesCurrentList PBE_Scrollbar";
        actionsContainer.className = "PBE_stylesAction";
        updatePreview.className = "PBE_button";

        if(previewImage) {
            //const safeFileName = PromptsBrowser.makeFileNameSafe(name);
            //const iteration = new Date().valueOf();
            //const url = `url('./file=styles_catalogue/${id}/preview/${safeFileName}.${previewImage}?${iteration}')`;
            url = PromptsBrowser.utils.getStylePreviewURL(style);

            stylesItem.style.backgroundImage = url;
        }

        nameContainer.innerText = name;
        updatePreview.innerText = "Update preview";

        updatePreview.dataset.id = name;
        updatePreview.dataset.collection = id;

        for(const stylePrompt of positive) {
            const {id, weight, isExternalNetwork} = stylePrompt;
            const promptElement = PromptsBrowser.showPromptItem({id, weight, isExternalNetwork}, {});
            currentPromptsContainer.appendChild(promptElement);
        }

        /* currentPromptsContainer.addEventListener("wheel", (e) => {
            if(!e.deltaY) return;
    
            e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
            e.preventDefault();
        }); */

        const addBeforeButton = document.createElement("button");
        const addAfterButton = document.createElement("button");
        const removeButton = document.createElement("button");
        const updateButton = document.createElement("button");
        addBeforeButton.innerText = "Add before";
        addAfterButton.innerText = "Add after";
        removeButton.innerText = "Remove";
        updateButton.innerText = "Update";

        addBeforeButton.className = "PBE_button";
        addAfterButton.className = "PBE_button";
        removeButton.className = "PBE_button PBE_buttonCancel";
        updateButton.className = "PBE_button";

        addAfterButton.dataset.isafter = "true";

        addAfterButton.dataset.id = id;
        addBeforeButton.dataset.id = id;
        removeButton.dataset.id = id;
        updateButton.dataset.id = id;

        addAfterButton.dataset.index = index;
        addBeforeButton.dataset.index = index;
        removeButton.dataset.index = index;
        updateButton.dataset.index = index;

        addBeforeButton.addEventListener("click", PromptsBrowser.styles.applyStyle);
        addAfterButton.addEventListener("click", PromptsBrowser.styles.applyStyle);
        removeButton.addEventListener("click", PromptsBrowser.styles.removeStyle);
        updateButton.addEventListener("click", PromptsBrowser.styles.updateStyle);
        updatePreview.addEventListener("click", PromptsBrowser.db.onUpdateStylePreview);

        actionsContainer.appendChild(addBeforeButton);
        if(activePrompts && activePrompts.length) actionsContainer.appendChild(addAfterButton);

        if(!readonly) {
            actionsContainer.appendChild(removeButton);
            if(activePrompts && activePrompts.length) actionsContainer.appendChild(updateButton);
        }

        contentContainer.appendChild(currentPromptsContainer);
        contentContainer.appendChild(actionsContainer);

        styleHeader.appendChild(nameContainer);
        if(!readonly) styleHeader.appendChild(updatePreview);

        stylesItem.appendChild(styleHeader);
        stylesItem.appendChild(contentContainer);

        wrapper.appendChild(stylesItem);
    }

}

PromptsBrowser.styles.update = () => {
    const {readonly} = PromptsBrowser.meta;
    const {state, makeElement} = PromptsBrowser;
    const wrapper = PromptsBrowser.DOMCache.stylesWindow;
    if(!wrapper || !state.showStylesWindow) return;
    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.styles.onCloseWindow;
    wrapper.innerHTML = "";
    wrapper.style.display = "flex";
    const isShort = state.toggledButtons.includes("styles_simplified_view");

    const currentPromptsBlock = document.createElement("div");
    const possibleStylesBlock = document.createElement("div");

    const footerBlock = document.createElement("div");
    const closeButton = document.createElement("button");
    footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
    currentPromptsBlock.className = "PBE_dataBlock PBE_stylesHeader";
    closeButton.innerText = "Close";
    closeButton.className = "PBE_button";

    const addNewContainer = makeElement({element: "div", className: "PBE_row"});

    if(!readonly) {
        PromptsBrowser.styles.showCurrentPrompts(currentPromptsBlock);
        PromptsBrowser.styles.showAddStyle(addNewContainer);
    }

    if(isShort) {
        possibleStylesBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
        PromptsBrowser.styles.showStylesShort(possibleStylesBlock);

    } else {
        possibleStylesBlock.className = "PBE_dataColumn PBE_Scrollbar PBE_windowContent";
        PromptsBrowser.styles.showStyles(possibleStylesBlock);
    }

    closeButton.addEventListener("click", PromptsBrowser.styles.onCloseWindow);

    footerBlock.appendChild(closeButton);

    const filterBlock = document.createElement("div");
    filterBlock.className = "PBE_row PBE_stylesFilter";
    PromptsBrowser.styles.showFilters(filterBlock);

    if(!readonly) {
        wrapper.appendChild(currentPromptsBlock);
        wrapper.appendChild(addNewContainer);
    }

    wrapper.appendChild(filterBlock);
    wrapper.appendChild(possibleStylesBlock);

    if(isShort) {
        const actionsBlock = document.createElement("div");
        actionsBlock.className = "PBE_collectionToolsActions PBE_row";
        PromptsBrowser.styles.showActions(actionsBlock);
        wrapper.appendChild(actionsBlock);
    }

    wrapper.appendChild(footerBlock);
};
