
if(!window.PromptsBrowser) window.PromptsBrowser = {};

/**
 * Extension setup window.
 */
PromptsBrowser.setupWindow = {};

/**
 * Shown Setup window tab
 */
PromptsBrowser.setupWindow.viewMode = "normal";

/**
 * Inits Setup window HTML on page, loads config data.
 * @param {*} wrapper 
 */
PromptsBrowser.setupWindow.init = (wrapper) => {
   /*  const {state} = PromptsBrowser;

    const savedConfigString = localStorage.getItem("PBE_config");
    if(savedConfigString) {
        const savedConfig = JSON.parse(savedConfigString);
        if(savedConfig) state.config = savedConfig;
    } */

    const setupWindow = document.createElement("div");
    setupWindow.className = "PBE_setupWindow PBE_generalWindow";

    PromptsBrowser.DOMCache.setupWindow = setupWindow;
    wrapper.appendChild(setupWindow);

    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.setupWindow.onCloseWindow;

    setupWindow.addEventListener("click", () => {
        PromptsBrowser.onCloseActiveWindow = PromptsBrowser.setupWindow.onCloseWindow;
    });
}

/**
 * Closes Setup window
 * @returns 
 */
PromptsBrowser.setupWindow.onCloseWindow = () => {
    const {viewMode} = PromptsBrowser.setupWindow;
    const wrapper = PromptsBrowser.DOMCache.setupWindow;
    if(!wrapper) return;

    if(viewMode === "newCollection" || viewMode === "newStylesCollection") {
        PromptsBrowser.setupWindow.viewMode = "normal";
        PromptsBrowser.setupWindow.update();
        return true;

    } else wrapper.style.display = "none";
}

PromptsBrowser.setupWindow.onChangeAutocompliteType = (e) => {
    const {state} = PromptsBrowser;
    const mode = e.currentTarget.value;

    state.config.autocomplitePromptMode = mode;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeExtendedSyntax = (e) => {
    const {state} = PromptsBrowser;
    const checked = e.currentTarget.checked;

    state.config.supportExtendedSyntax = checked;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeShowIndex = (e) => {
    const {state} = PromptsBrowser;
    const checked = e.currentTarget.checked;

    state.config.showPromptIndex = checked;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeCardWidth = (e) => {
    const {state} = PromptsBrowser;
    const width = Number(e.currentTarget.value);

    state.config.cardWidth = width;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeCardHeight = (e) => {
    const {state} = PromptsBrowser;
    const height = Number(e.currentTarget.value);

    state.config.cardHeight = height;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeSplashCardWidth = (e) => {
    const {state} = PromptsBrowser;
    const width = Number(e.currentTarget.value);

    state.config.splashCardWidth = width;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeSplashCardHeight = (e) => {
    const {state} = PromptsBrowser;
    const height = Number(e.currentTarget.value);

    state.config.splashCardHeight = height;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeKnownRows = (e) => {
    const {state} = PromptsBrowser;
    const rows = Number(e.currentTarget.value);

    state.config.rowsInKnownCards = rows;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
}

PromptsBrowser.setupWindow.onChangeMaxCards = (e) => {
    const {state} = PromptsBrowser;
    const maxCards = Number(e.currentTarget.value);

    state.config.maxCardsShown = maxCards;
    localStorage.setItem("PBE_config", JSON.stringify(state.config));
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

PromptsBrowser.setupWindow.onUpdateDirName = (e) => {
    let value = e.currentTarget.value;
    if(!value) return;

    value = window.PromptsBrowser.makeFileNameSafe(value);
    e.currentTarget.value = value;
}

PromptsBrowser.setupWindow.onCreate = (e) => {
    const target = e.currentTarget;
    const {viewMode} = PromptsBrowser.setupWindow;
    if(!target.parentNode) return;
    const setupWindow = target.parentNode.parentNode;
    if(!setupWindow) return;

    if(viewMode === "newCollection") {
        const newNameInput = setupWindow.querySelector(".PBE_newCollectionName");
        const formatSelect = setupWindow.querySelector(".PBE_newCollectionFormat");
        if(!newNameInput || !formatSelect) return;
        const newName = window.PromptsBrowser.makeFileNameSafe(newNameInput.value);
        const format = formatSelect.value;
        if(!newName || !format) return;

        PromptsBrowser.db.createNewCollection(newName, format);
        
    } else if(viewMode === "newStylesCollection") {
        const newNameInput = setupWindow.querySelector(".PBE_newCollectionName");
        const formatSelect = setupWindow.querySelector(".PBE_newStyleCollectionFormat");
        if(!newNameInput || !formatSelect) return;
        const newName = window.PromptsBrowser.makeFileNameSafe(newNameInput.value);
        const format = formatSelect.value;
        if(!newName || !format) return;
        
        PromptsBrowser.db.createNewStylesCollection(newName, format);

    }

    PromptsBrowser.setupWindow.viewMode = "normal";
    PromptsBrowser.setupWindow.update();
}

/**
 * Shows block with create new collection buttons
 * @param {*} wrapper 
 */
PromptsBrowser.setupWindow.showCreateNew = (wrapper) => {
    const {makeElement} = PromptsBrowser;

    const newCollection = makeElement({
        element: "button", className: "PBE_button", content: "New prompts collection"
    });

    const newStylesCollection = makeElement({
        element: "button", className: "PBE_button", content: "New styles collection"
    });

    newCollection.addEventListener("click", () => {
        PromptsBrowser.setupWindow.viewMode = "newCollection";
        PromptsBrowser.setupWindow.update();
    });

    newStylesCollection.addEventListener("click", () => {
        PromptsBrowser.setupWindow.viewMode = "newStylesCollection";
        PromptsBrowser.setupWindow.update();
    });

    wrapper.appendChild(newCollection);
    wrapper.appendChild(newStylesCollection);
    //wrapper.appendChild(buttonsBlock);
}

PromptsBrowser.setupWindow.showIntegrationSetup = (wrapper) => {
    const {makeElement, makeSelect, makeCheckbox} = PromptsBrowser;
    const {autocomplitePromptMode = "prompts", supportExtendedSyntax = true} = PromptsBrowser.state.config;

    const autocompliteTypeBlock = makeElement({
        element: "div",
        className: "PBE_rowBlock",
        title: "Prompt autocomplite in the textarea behavior",
        style: {maxWidth: "none"}
    });

    const autocompliteTypeText = makeElement({element: "div", content: "Autocomplite mode"});
    const autocompliteTypeSelect = makeSelect({
        className: "PBE_generalInput PBE_select",
        value: autocomplitePromptMode,
        onChange: PromptsBrowser.setupWindow.onChangeAutocompliteType,
        options: [
            {id: "off", name: "Off"},
            {id: "prompts", name: "Prompts only"},
            {id: "styles", name: "Styles only"},
            {id: "all", name: "Prompts and styles"},
        ]
    });

    autocompliteTypeBlock.appendChild(autocompliteTypeText);
    autocompliteTypeBlock.appendChild(autocompliteTypeSelect);

    const extendedSyntaxBlock = makeElement({
        element: "div",
        className: "PBE_rowBlock",
        title: "If true, will enable extended syntax element support for prompts used by some addons",
        style: {maxWidth: "none"}
    });
    
    makeCheckbox({
        onChange: PromptsBrowser.setupWindow.onChangeExtendedSyntax,
        checked: supportExtendedSyntax,
        name: "Extended syntax support",
        id: "PBE_extendedSyntaxSupport",
        wrapper: extendedSyntaxBlock,
        reverse: true,
    });

    wrapper.appendChild(autocompliteTypeBlock);
    wrapper.appendChild(extendedSyntaxBlock);
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
    scrollBelowOneInput.className = "PBE_generalInput PBE_input";
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
    scrollAboveOneInput.className = "PBE_generalInput PBE_input";
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
    spaceSelector.className = "PBE_generalInput PBE_select";
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

PromptsBrowser.setupWindow.showPromptCardsSetup = (wrapper) => {
    const {state, makeElement} = PromptsBrowser;
    const {config} = state;

    //show index
    const indexBlock = makeElement({element: "div", className: "PBE_rowBlock"});
    indexBlock.style.maxWidth = "none";

    const indexInput = makeElement({
        element: "input",
        className: "PBE_setupPromptIndex",
        id: "PBE_setupPromptIndex",
        name: "PBE_setupPromptIndex",
        type: "checkbox",
    })
    indexInput.checked = config.showPromptIndex;
    indexInput.addEventListener("change", PromptsBrowser.setupWindow.onChangeShowIndex);

    const indexLegend = makeElement({element: "label", content: "Show prompt index in database"});
    indexLegend.htmlFor = indexInput.id;

    indexBlock.appendChild(indexLegend);
    indexBlock.appendChild(indexInput);

    //card width
    const widthBlock = makeElement({element: "div", className: "PBE_rowBlock"});
    widthBlock.style.maxWidth = "none";

    const widthBlockTitle = makeElement({element: "div", className: "", content: "Card width"});
    const widthBlockInput = makeElement({
        element: "input",
        type: "number",
        className: "PBE_generalInput PBE_input",
        value: config.cardWidth || 50,
        onChange: PromptsBrowser.setupWindow.onChangeCardWidth
    });

    widthBlock.appendChild(widthBlockTitle);
    widthBlock.appendChild(widthBlockInput);

    //card height
    const heightBlock = makeElement({element: "div", className: "PBE_rowBlock"});
    heightBlock.style.maxWidth = "none";

    const heightBlockTitle = makeElement({element: "div", className: "", content: "Card height"});
    const heightBlockInput = makeElement({
        element: "input",
        type: "number",
        className: "PBE_generalInput PBE_input",
        value: config.cardHeight || 100,
        onChange: PromptsBrowser.setupWindow.onChangeCardHeight
    });

    heightBlock.appendChild(heightBlockTitle);
    heightBlock.appendChild(heightBlockInput);

    //splash card width
    const splashWidthBlock = makeElement({element: "div", className: "PBE_rowBlock"});
    splashWidthBlock.style.maxWidth = "none";

    const splasWidthBlockTitle = makeElement({element: "div", className: "", content: "Splash Card width"});
    const splasWidthBlockInput = makeElement({
        element: "input",
        type: "number",
        className: "PBE_generalInput PBE_input",
        value: config.splashCardWidth || 200,
        onChange: PromptsBrowser.setupWindow.onChangeSplashCardWidth
    });

    splashWidthBlock.appendChild(splasWidthBlockTitle);
    splashWidthBlock.appendChild(splasWidthBlockInput);

    //splash card height
    const splashHeightBlock = makeElement({element: "div", className: "PBE_rowBlock"});
    splashHeightBlock.style.maxWidth = "none";

    const splashHeightBlockTitle = makeElement({element: "div", className: "", content: "Splash card height"});
    const splashHeightBlockInput = makeElement({
        element: "input",
        type: "number",
        className: "PBE_generalInput PBE_input",
        value: config.splashCardHeight || 300,
        onChange: PromptsBrowser.setupWindow.onChangeSplashCardHeight
    });

    splashHeightBlock.appendChild(splashHeightBlockTitle);
    splashHeightBlock.appendChild(splashHeightBlockInput);
    
    //card rows in known prompts block
    const knownRowsBlock = makeElement({element: "div", className: "PBE_rowBlock"});
    knownRowsBlock.style.maxWidth = "none";

    const knownRowsBlockTitle = makeElement({element: "div", className: "", content: "Known cards rows"});
    const knownRowsBlockInput = makeElement({
        element: "input",
        type: "number",
        className: "PBE_generalInput PBE_input",
        value: config.rowsInKnownCards || 3,
        onChange: PromptsBrowser.setupWindow.onChangeKnownRows
    });

    knownRowsBlock.appendChild(knownRowsBlockTitle);
    knownRowsBlock.appendChild(knownRowsBlockInput);
    
    //max shown cards in a block
    const maxCardsBlock = makeElement({element: "div", className: "PBE_rowBlock"});
    maxCardsBlock.style.maxWidth = "none";

    const maxCardsBlockTitle = makeElement({element: "div", className: "", content: "Max shown cards"});
    const maxCardsBlockInput = makeElement({
        element: "input",
        type: "number",
        className: "PBE_generalInput PBE_input",
        value: config.maxCardsShown || 1000,
        onChange: PromptsBrowser.setupWindow.onChangeMaxCards
    });

    maxCardsBlock.appendChild(maxCardsBlockTitle);
    maxCardsBlock.appendChild(maxCardsBlockInput);

    wrapper.appendChild(indexBlock);
    wrapper.appendChild(widthBlock);
    wrapper.appendChild(heightBlock);
    wrapper.appendChild(splashWidthBlock);
    wrapper.appendChild(splashHeightBlock);
    wrapper.appendChild(knownRowsBlock);
    wrapper.appendChild(maxCardsBlock);
}

PromptsBrowser.setupWindow.showNewCollection = (wrapper) => {
    const newName = document.createElement("div");
    const newNameLabel = document.createElement("div");
    const newNameInput = document.createElement("input");
    newName.className = "PBE_rowBlock";
    newName.style.maxWidth = "none";
    newNameInput.className = "PBE_generalInput PBE_input PBE_newCollectionName";

    newNameLabel.innerText = "New prompts collection name";

    newNameInput.addEventListener("change", PromptsBrowser.setupWindow.onUpdateDirName);

    newName.appendChild(newNameLabel);
    newName.appendChild(newNameInput);

    const format = document.createElement("div");
    const formatLabel = document.createElement("div");
    const formatSelect = document.createElement("select");
    format.className = "PBE_rowBlock";
    format.style.maxWidth = "none";
    formatSelect.value = "short";
    formatSelect.className = "PBE_generalInput PBE_select PBE_newCollectionFormat";

    formatSelect.innerHTML = `
        <option value="short">Short</option>
        <option value="expanded">Expanded</option>
    `;

    formatLabel.innerText = "Store format";

    format.appendChild(formatLabel);
    format.appendChild(formatSelect);

    wrapper.appendChild(newName);
    wrapper.appendChild(format);
}

PromptsBrowser.setupWindow.showNewStylesCollection = (wrapper) => {
    const {makeElement, makeSelect} = PromptsBrowser;


    const newName = makeElement({element: "div", className: "PBE_rowBlock"});
    const format = makeElement({element: "div", className: "PBE_rowBlock"});
    newName.style.maxWidth = "none";
    format.style.maxWidth = "none";

    const newNameLabel = makeElement({element: "div", content: "New styles collection name"});
    const formatLabel = makeElement({element: "div", content: "Store format"});

    const newNameInput = makeElement({element: "input", className: "PBE_generalInput PBE_input PBE_newCollectionName"});
    newNameInput.addEventListener("change", PromptsBrowser.setupWindow.onUpdateDirName);

    newName.appendChild(newNameLabel);
    newName.appendChild(newNameInput);

    const formatSelect = makeSelect({
        className: "PBE_generalInput PBE_select PBE_newStyleCollectionFormat",
        value: "short",
        options: [
            {id: "short", name: "Short"},
            {id: "expanded", name: "Expanded"},
        ],
    });

    format.appendChild(formatLabel);
    format.appendChild(formatSelect);

    wrapper.appendChild(newName);
    wrapper.appendChild(format);
}

PromptsBrowser.setupWindow.update = () => {
    const {readonly} = PromptsBrowser.meta;
    const {viewMode} = PromptsBrowser.setupWindow;
    const {state, makeElement} = PromptsBrowser;
    const wrapper = PromptsBrowser.DOMCache.setupWindow;
    if(!wrapper) return;
    
    PromptsBrowser.onCloseActiveWindow = PromptsBrowser.setupWindow.onCloseWindow;
    wrapper.style.display = "flex";

    if(viewMode === "newCollection") wrapper.innerHTML = "New prompts collection";
    else if(viewMode === "newStylesCollection") wrapper.innerHTML = "New styles collections";
    else wrapper.innerHTML = "New Collection";

    const topBlock = document.createElement("div");
    const contentBlock = document.createElement("div");
    const footerBlock = document.createElement("div");
    const closeButton = document.createElement("button");

    topBlock.className = "PBE_row PBE_setupWindowTopBlock";
    contentBlock.className = "PBE_windowContent PBE_Scrollbar";
    contentBlock.style.width = "100%";

    if(viewMode === "newCollection") {
        PromptsBrowser.setupWindow.showNewCollection(contentBlock);

    } else if(viewMode === "newStylesCollection") {
        PromptsBrowser.setupWindow.showNewStylesCollection(contentBlock);

    } else {
        if(!readonly) PromptsBrowser.setupWindow.showCreateNew(topBlock);

        const infoMessage = document.createElement("div");
        infoMessage.innerText = `The extension settings have moved to the general webUI settings in the "Prompts Browser" category.`;
        contentBlock.appendChild(infoMessage);

        /* PromptsBrowser.setupWindow.showIntegrationSetup(contentBlock);
        PromptsBrowser.setupWindow.showWeightSetup(contentBlock);
        PromptsBrowser.setupWindow.showNormalizeSetup(contentBlock);
        PromptsBrowser.setupWindow.showPromptCardsSetup(contentBlock); */
    }

    const statusBlock = makeElement({element: "div", className: "PBE_setupWindowStatus PBE_row"});
    statusBlock.innerHTML = `
        version: ${PromptsBrowser.meta.version}
        <a target='_blank' href='https://github.com/AlpacaInTheNight/PromptsBrowser'>Project Page</a>
    `;

    footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
    footerBlock.style.justifyContent = "space-evenly";
    closeButton.innerText = viewMode === "normal" ? "Close" : "Cancel";
    closeButton.className = "PBE_button";
    if(viewMode !== "normal") closeButton.classList.add("PBE_buttonCancel");

    closeButton.addEventListener("click", PromptsBrowser.setupWindow.onCloseWindow);

    if(viewMode === "newCollection" || viewMode === "newStylesCollection") {
        const createButton = document.createElement("button");
        createButton.innerText = "Create";
        createButton.className = "PBE_button";

        createButton.addEventListener("click", PromptsBrowser.setupWindow.onCreate);

        footerBlock.appendChild(createButton);
    }

    footerBlock.appendChild(closeButton);

    wrapper.appendChild(topBlock);
    wrapper.appendChild(contentBlock);
    wrapper.appendChild(statusBlock);
    wrapper.appendChild(footerBlock);
}