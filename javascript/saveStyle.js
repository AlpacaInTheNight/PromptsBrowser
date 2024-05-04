
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.saveStyle = {};

PromptsBrowser.saveStyle.init = (mainWrapper) => {
    const saveStyleWindow = document.createElement("div");

    saveStyleWindow.className = "PBE_generalWindow PBE_stylesWindow";
    saveStyleWindow.id = "PBE_saveStyleWindow";

    PromptsBrowser.DOMCache.saveStyleWindow = saveStyleWindow;
    mainWrapper.appendChild(saveStyleWindow);
    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.saveStyle.onCloseWindow;

    saveStyleWindow.addEventListener("click", () => {
        PromptsBrowser.onCloseActiveWindow = PromptsBrowser.saveStyle.onCloseWindow;
    });
}

PromptsBrowser.saveStyle.initButton = (positiveWrapper) => {
    const addStylesButton = document.createElement("button");

    addStylesButton.className = "PBE_actionButton PBE_saveStylesButton";
    addStylesButton.innerText = "Save style";

    addStylesButton.addEventListener("click", PromptsBrowser.saveStyle.onOpenStyles);

    positiveWrapper.appendChild(addStylesButton);
}

PromptsBrowser.saveStyle.onOpenStyles = () => {
    const {state} = PromptsBrowser;

    state.showSaveStyleWindow = true;
    PromptsBrowser.saveStyle.update();
}

PromptsBrowser.saveStyle.onCloseWindow = () => {
    const {state} = PromptsBrowser;
    const wrapper = PromptsBrowser.DOMCache.saveStyleWindow;
    if(!wrapper || !state.showSaveStyleWindow) return;

    state.showSaveStyleWindow = undefined;
    wrapper.style.display = "none";
}

PromptsBrowser.saveStyle.onSaveStyle = () => {
    const {data, state} = PromptsBrowser;
    const collectionId = state.newStyleCollection;
    if(!collectionId) return;

    const targetCollection = data.styles[collectionId];
    if(!targetCollection) return;

    const styleNameInput = PromptsBrowser.DOMCache.saveStyleWindow.querySelector("#PBE_newStyleName");

    const name = styleNameInput.value;
    if(!name || !data.styles) return;

    const newStyle = PromptsBrowser.styles.grabCurrentStyle(name, collectionId);
    if(!newStyle) return;

    targetCollection.push(newStyle);

    PromptsBrowser.db.updateStyles(collectionId);
    PromptsBrowser.saveStyle.update();
}

PromptsBrowser.saveStyle.onChangeNewCollection = (e) => {
    const {state} = PromptsBrowser;
    const value = e.currentTarget.value;
    if(!value) return;

    state.newStyleCollection = value;
}

PromptsBrowser.saveStyle.showCurrentPrompts = (wrapper) => {
    let activePrompts = PromptsBrowser.getCurrentPrompts();

    /* const currentPromptsContainer = document.createElement("div");
    currentPromptsContainer.className = "PBE_windowCurrentList PBE_Scrollbar"; */

    for(const i in activePrompts) {
        const currPrompt = activePrompts[i];

        const promptElement = PromptsBrowser.showPromptItem({id: currPrompt.id, isExternalNetwork: currPrompt.isExternalNetwork}, {});
        wrapper.appendChild(promptElement);

        promptElement.addEventListener("click", (e) => {
            const currentId = e.currentTarget.dataset.prompt;
            if(!currentId) return;

            if(e.ctrlKey || e.metaKey) {
                activePrompts = activePrompts.filter(item => item.id !== currentId);
                PromptsBrowser.setCurrentPrompts(activePrompts);
                PromptsBrowser.saveStyle.update();
                PromptsBrowser.currentPrompts.update();

                return;
            }
        });
    }

    /* currentPromptsContainer.addEventListener("wheel", (e) => {
        if(!e.deltaY) return;

        e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
        e.preventDefault();
    });


    wrapper.appendChild(currentPromptsContainer); */
}

PromptsBrowser.saveStyle.showAddStyle = (wrapper) => {
    const {data, makeElement, makeCheckbox} = PromptsBrowser;
    const {state} = PromptsBrowser;

    const setupContainer = document.createElement("div");

    setupContainer.className = "PBE_List PBE_stylesSetup";

    const styleNameInput = document.createElement("input");
    const saveButton = document.createElement("button");
    saveButton.innerText = "Save as style";
    saveButton.className = "PBE_button";
    styleNameInput.placeholder = "Style name";
    styleNameInput.className = "PBE_generalInput PBE_newStyleName";
    styleNameInput.id = "PBE_newStyleName";

    saveButton.addEventListener("click", PromptsBrowser.saveStyle.onSaveStyle);

    const collectionSelect = document.createElement("select");
    collectionSelect.className = "PBE_generalInput PBE_select";
    collectionSelect.style.height = "30px";
    collectionSelect.style.marginRight = "5px";
    let options = "";

    for(const collectionId in data.styles) {
        if(!state.newStyleCollection) state.newStyleCollection = collectionId;

        options += `<option value="${collectionId}">${collectionId}</option>`;
    }

    collectionSelect.innerHTML = options;
    collectionSelect.value = state.newStyleCollection;

    collectionSelect.addEventListener("change", PromptsBrowser.saveStyle.onChangeNewCollection);

    const saveRow = makeElement({element: "div", className: "PBE_row"});

    saveRow.appendChild(collectionSelect);
    saveRow.appendChild(saveButton);

    setupContainer.appendChild(styleNameInput);
    setupContainer.appendChild(saveRow);

    wrapper.appendChild(setupContainer);
    PromptsBrowser.styles.showMetaCheckboxes(wrapper);
}

PromptsBrowser.saveStyle.update = () => {
    const {readonly} = PromptsBrowser.meta;
    const {state, makeElement} = PromptsBrowser;
    const wrapper = PromptsBrowser.DOMCache.saveStyleWindow;
    if(!wrapper || !state.showSaveStyleWindow) return;
    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.saveStyle.onCloseWindow;
    wrapper.innerHTML = "";
    wrapper.style.display = "flex";

    const currentPromptsBlock = document.createElement("div");
  
    const footerBlock = document.createElement("div");
    const closeButton = document.createElement("button");
    footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
    currentPromptsBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
    closeButton.innerText = "Close";
    closeButton.className = "PBE_button";

    const addNewContainer = makeElement({element: "div", className: "PBE_row"});

    if(!readonly) {
        PromptsBrowser.saveStyle.showCurrentPrompts(currentPromptsBlock);
        PromptsBrowser.saveStyle.showAddStyle(addNewContainer);
    }

    closeButton.addEventListener("click", PromptsBrowser.saveStyle.onCloseWindow);

    footerBlock.appendChild(closeButton);

    if(!readonly) {
        wrapper.appendChild(addNewContainer);
        wrapper.appendChild(currentPromptsBlock);
    }

    wrapper.appendChild(footerBlock);
};
