
if(!window.PromptsBrowser) window.PromptsBrowser = {};
if(!PromptsBrowser.utils) PromptsBrowser.utils = {};

PromptsBrowser.DOMCache = {};
PromptsBrowser.data = {};
PromptsBrowser.db = {};

PromptsBrowser.state = {
    config: {
        belowOneWeight: 0.05,
        aboveOneWeight: 0.02,

        toLowerCase: true,
        spaceMode: "space",
        showPromptIndex: false,

        cardWidth: 50,
        cardHeight: 100,
        splashCardWidth: 200,
        splashCardHeight: 300,

        rowsInKnownCards: 3,
        maxCardsShown: 1000,

        /**
         * If true, will enable extended syntax element support for prompts used by some addons.
         */
        supportExtendedSyntax: true,

        saveStyleMeta: {
            seed: false,
            size: false,
            quality: false,
            sampler: false,
            negative: false,
        }
    },

    showControlPanel: true,
    showViews: ["known", "current", "positive", "negative"],
    currentContainer: "text2Img",
    currentPromptsList: {},
    selectedPrompt: undefined,
    editingPrompt: undefined,
    filesIteration: (new Date().valueOf()), //to avoid getting old image cache
    filterCategory: undefined,
    filterName: undefined,
    filterCollection: undefined,
    filterTags: undefined,
    filterStyleCollection: undefined,
    filterStyleName: undefined,
    newStyleCollection: undefined,
    sortKnownPrompts: undefined,
    copyOrMoveTo: undefined,
    dragItemId: undefined,
    dragCurrentIndex: undefined,
    promptToolsId: undefined,
    collectionToolsId: undefined,
    savePreviewCollection: undefined,
    editTargetCollection: undefined,
    editItem: undefined,
    showStylesWindow: undefined,
    showSaveStyleWindow: undefined,
    showScriberWindow: undefined,
    toggledButtons: ["tools_tags", "tools_category", "tools_name", "tools_replaceMode", "new_in_all_collections", "styles_simplified_view"],
    selectedNewPrompts: [],
    selectedCollectionPrompts: [],
    promptsFilter: {},
    autoGenerateType: "prompt",
    //autoGenerateKeepCurrent: false,
}

PromptsBrowser.params = {};
PromptsBrowser.params.DEFAULT_PROMPT_WEIGHT = 1;
PromptsBrowser.params.PROMPT_WEIGHT_FACTOR = 1.1;
PromptsBrowser.params.EMPTY_CARD_GRADIENT = "linear-gradient(135deg, rgba(179,220,237,1) 0%,rgba(41,184,229,1) 50%,rgba(188,224,238,1) 100%)";
PromptsBrowser.params.NEW_CARD_GRADIENT = "linear-gradient(135deg, rgba(180,221,180,1) 0%,rgba(131,199,131,1) 17%,rgba(82,177,82,1) 33%,rgba(0,138,0,1) 67%,rgba(0,87,0,1) 83%,rgba(0,36,0,1) 100%)";

PromptsBrowser.data.categories = [
    "character",
    "character description",
    "portrait",
    "body",
    "composition",
    "object",
    "interior",
    "exterior",
    "artist",
    "action",
    "cloth",
    "style",
    "lighting",
    "building",
    "scenery",
    "architecture",
    "texture",
    "position",
    "background",
    "emotion",
    "media",
    "condition",
    "quality",
    "franchise",
    "effect",
    "meta",
    "creature"
].sort();

PromptsBrowser.onCloseActiveWindow = undefined;

PromptsBrowser.supportedContainers = {
    text2Img: {
        prompt: "txt2img_prompt_container",
        results: "txt2img_results",
        gallery: "txt2img_gallery_container",
        buttons: "txt2img_generate_box",
        settings: "txt2img_settings",
        seed: "txt2img_seed",
        width: "txt2img_width",
        height: "txt2img_height",
        steps: "txt2img_steps",
        cfg: "txt2img_cfg_scale",
        sampling: "txt2img_sampling",
    },
    img2Img: {
        prompt: "img2img_prompt_container",
        results: "img2img_results",
        gallery: "img2img_gallery_container",
        buttons: "img2img_generate_box",
        settings: "img2img_settings",
        seed: "img2img_seed",
        width: "img2img_width",
        height: "img2img_height",
        steps: "img2img_steps",
        cfg: "img2img_cfg_scale",
        sampling: "img2img_sampling",
    }
}

PromptsBrowser.utils.log = (message) => {
    console.log(message);
}

PromptsBrowser.utils.randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

PromptsBrowser.utils.isInSameCollection = (promptA, promptB) => {
    let targetCollection = undefined;
    
    for(const id in PromptsBrowser.data.original) {
        const collection = PromptsBrowser.data.original[id];
        const containsA = collection.some(item => item.id === promptA);
        const containsB = collection.some(item => item.id === promptB);
        if(containsA && containsB) {
            targetCollection = id;
            break;
        }
    }
    
    return targetCollection
}

PromptsBrowser.db.movePrompt = (promptA, promptB, collectionId) => {
    const {united} = PromptsBrowser.data;
    const {state} = PromptsBrowser;
    if(!promptA || !promptB || promptA === promptB) return;

    if(!collectionId) collectionId = state.filterCollection;

    if(!collectionId) {
        const itemA = united.find(item => item.id === promptA);
        const itemB = united.find(item => item.id === promptB);
        if(!itemA.collections || !itemA.collections.length) return;
        if(!itemB.collections || !itemB.collections.length) return;

        for(const collectionItem of itemA.collections) {
            if(itemB.collections.includes(collectionItem)) {
                collectionId = collectionItem;
                break;
            }
        }
    }

    if(!collectionId) return;
    const targetCollection = PromptsBrowser.data.original[collectionId];
    if(!targetCollection) return;
    
    const indexInOriginB = targetCollection.findIndex(item => item.id === promptB);
    const indexInOriginA = targetCollection.findIndex(item => item.id === promptA);

    const element = targetCollection.splice(indexInOriginB, 1)[0];
    targetCollection.splice(indexInOriginA, 0, element);

    PromptsBrowser.db.saveJSONData(collectionId, false, true);
    PromptsBrowser.db.updateMixedList();
    PromptsBrowser.knownPrompts.update();
    //PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.gradioApp = () => {
    const elems = document.getElementsByTagName('gradio-app')
    const gradioShadowRoot = elems.length == 0 ? null : elems[0].shadowRoot
    return !!gradioShadowRoot ? gradioShadowRoot : document.body;
}

/**
 * Checks if the target collection have preview image for the target prompt.
 * Returns true if have preview and false if not.
 * 
 * @param {*} prompt prompt id
 * @param {*} collectionId collection id
 * @returns boolean
 */
PromptsBrowser.utils.collectionHavePreview = (prompt, collectionId) => {
    const {original} = PromptsBrowser.data;
    if(!prompt || !collectionId || !original) return false;

    const targetCollection = original[collectionId];
    if(!targetCollection) return false;

    const targetPrompt = targetCollection.find(item => item.id.toLowerCase() === prompt.toLowerCase());
    if(!targetPrompt) return false;

    return targetPrompt.previewImage ? true : false;
}

PromptsBrowser.utils.getPromptPreviewURL = (prompt, collectionId) => {
    const {EMPTY_CARD_GRADIENT, NEW_CARD_GRADIENT} = PromptsBrowser.params;
    const {normalizePrompt} = window.PromptsBrowser;
    if(!prompt) return NEW_CARD_GRADIENT;
    const apiUrl = PromptsBrowser.db.getAPIurl("promptImage");
    
    const {united} = PromptsBrowser.data;
    const {state} = PromptsBrowser;
    let fileExtension = "";

    let targetPrompt = united.find(item => item.id.toLowerCase() === prompt.toLowerCase());

    //if no target prompt found - searching for the normalized version of the target prompt
    if(!targetPrompt) {
        const normalizedPrompt = normalizePrompt(prompt);
        targetPrompt = united.find(item => item.id.toLowerCase() === normalizedPrompt.toLowerCase());
    }

    //if no prompt found - returning New Card image.
    if(!targetPrompt || !targetPrompt.knownPreviews) return NEW_CARD_GRADIENT;

    if(!collectionId && state.filterCollection) collectionId = state.filterCollection;

    if(collectionId && targetPrompt.knownPreviews[collectionId])
        fileExtension = targetPrompt.knownPreviews[collectionId];
    
    if(!fileExtension) {
        for(let colId in targetPrompt.knownPreviews) {
            fileExtension = targetPrompt.knownPreviews[colId];
            collectionId = colId;
            break;
        }
    }

    if(!collectionId) return EMPTY_CARD_GRADIENT;
    if(!fileExtension) return EMPTY_CARD_GRADIENT;

    const safeFileName = PromptsBrowser.makeFileNameSafe(prompt);

    //const url = `url("./file=prompts_catalogue/${collectionId}/preview/${safeFileName}.${fileExtension}?${state.filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
    const url = `url("${apiUrl}/${collectionId}/${safeFileName}.${fileExtension}?${state.filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
    return url;
}

PromptsBrowser.utils.getStylePreviewURL = (style) => {
    const {state} = PromptsBrowser;
    const {EMPTY_CARD_GRADIENT, NEW_CARD_GRADIENT} = PromptsBrowser.params;
    if(!style) return NEW_CARD_GRADIENT;
    const {name, id, previewImage} = style;
    if(!name || !id || !previewImage) return NEW_CARD_GRADIENT;

    const apiUrl = PromptsBrowser.db.getAPIurl("styleImage");

    const safeFileName = PromptsBrowser.makeFileNameSafe(name);

    const url = `url("${apiUrl}/${id}/${safeFileName}.${previewImage}?${state.filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
    return url;
}

PromptsBrowser.db.createNewCollection = (id, mode = "short") => {
    if(!id) return;
    const url = PromptsBrowser.db.getAPIurl("newCollection");

    (async () => {
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, mode})
        });
        //const answer = await rawResponse.json();

        PromptsBrowser.db.loadDatabase();
        PromptsBrowser.knownPrompts.update();
        PromptsBrowser.currentPrompts.update();
    })();
}

PromptsBrowser.db.createNewStylesCollection = (id, mode = "short") => {
    if(!id) return;
    const url = PromptsBrowser.db.getAPIurl("newStylesCollection");

    (async () => {
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, mode})
        });
        //const answer = await rawResponse.json();

        PromptsBrowser.db.loadDatabase();
        PromptsBrowser.knownPrompts.update();
        PromptsBrowser.currentPrompts.update();
    })();
}

PromptsBrowser.db.movePreviewImage = (item, movefrom, to, type) => {
    const {state} = PromptsBrowser;
    const url = PromptsBrowser.db.getAPIurl("movePreview");

    (async () => {
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({item, movefrom, to, type})
        });
        //const content = await rawResponse.json();

        state.filesIteration++;
        PromptsBrowser.knownPrompts.update();
        PromptsBrowser.currentPrompts.update(true);
    })();
}

PromptsBrowser.db.saveJSONData = (collectionId, noClear = false, noUpdate = false) => {
    if(!collectionId) return;

    const targetData = PromptsBrowser.data.original[collectionId];
    if(!targetData) return;

    const url = PromptsBrowser.db.getAPIurl("savePrompts");

    (async () => {
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({collection: collectionId, data: JSON.stringify(targetData), noClear})
        });
        //const content = await rawResponse.json();

        if(!noUpdate) {
            PromptsBrowser.knownPrompts.update();
            PromptsBrowser.currentPrompts.update(true);
        }
    })();
}

PromptsBrowser.db.savePromptPreview = (callUpdate = true) => {
    const {state} = PromptsBrowser;
    const {united} = PromptsBrowser.data;
    const {selectedPrompt, savePreviewCollection, currentContainer} = state;
    const url = PromptsBrowser.db.getAPIurl("savePreview");

    const imageArea = PromptsBrowser.DOMCache.containers[currentContainer].imageArea;
    if(!imageArea) return;
    if(!selectedPrompt) return;
    if(!savePreviewCollection) return;
    
    const activePrompts = PromptsBrowser.getCurrentPrompts();
    const imageContainer = imageArea.querySelector("img");
    if(!imageContainer) return;

    let isExternalNetwork = false;
    let src = imageContainer.src;
    const fileMarkIndex = src.indexOf("file=");
    if(fileMarkIndex === -1) return;
    src = src.slice(fileMarkIndex + 5);

    const cacheMarkIndex = src.indexOf("?");
    if(cacheMarkIndex && cacheMarkIndex !== -1) src = src.substring(0, cacheMarkIndex);

    const imageExtension = src.split('.').pop();

    if(!PromptsBrowser.data.original[savePreviewCollection]) return;

    const targetCurrentPrompt = activePrompts.find(item => item.id === state.selectedPrompt);
    if(targetCurrentPrompt && targetCurrentPrompt.isExternalNetwork) isExternalNetwork = true;

    const saveData = {src, prompt: selectedPrompt, collection: savePreviewCollection};
    if(isExternalNetwork) saveData.isExternalNetwork = true;

    let targetItem = united.find(item => item.id === selectedPrompt);
    if(!targetItem) {
        targetItem = {id: selectedPrompt, tags: [], category: [], collections: []};
        if(isExternalNetwork) targetItem.isExternalNetwork = true;
        united.push(targetItem);
    }

    if(!targetItem.collections) targetItem.collections = [];
    if(!targetItem.collections.includes(savePreviewCollection)) {
        targetItem.collections.push(savePreviewCollection);
    }

    let originalItem = PromptsBrowser.data.original[savePreviewCollection].find(item => item.id === selectedPrompt);
    if(!originalItem) {
        originalItem = {id: selectedPrompt, tags: [], category: []};
        if(isExternalNetwork) originalItem.isExternalNetwork = true;
        PromptsBrowser.data.original[savePreviewCollection].push(originalItem);
    }

    originalItem.previewImage = imageExtension;

    (async () => {

        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveData)
        });
        const answer = await rawResponse.json();

        if(answer === "ok" && callUpdate) {
            state.selectedPrompt = undefined;
            state.filesIteration++;
            PromptsBrowser.db.updateMixedList();
            
            PromptsBrowser.previewSave.update();
            PromptsBrowser.knownPrompts.update();
            PromptsBrowser.currentPrompts.update(true);
        }

    })();
}

PromptsBrowser.db.onUpdateStylePreview = (e) => {
    const {state, data} = PromptsBrowser;

    let collectionId = undefined;
    let styleId = undefined;

    if(e.currentTarget.dataset.action) {
        const {selectedItem} = PromptsBrowser.styles;
        collectionId = selectedItem.collection;
        styleId = selectedItem.styleId;

    } else {
        collectionId = e.currentTarget.dataset.id;
        styleId = e.currentTarget.dataset.id;
    }

    if(!collectionId || !styleId) return;

    const imageArea = PromptsBrowser.DOMCache.containers[state.currentContainer].imageArea;
    if(!imageArea) return;

    const imageContainer = imageArea.querySelector("img");
    if(!imageContainer) return;

    let src = imageContainer.src;
    const fileMarkIndex = src.indexOf("file=");
    if(fileMarkIndex === -1) return;
    src = src.slice(fileMarkIndex + 5);

    const cacheMarkIndex = src.indexOf("?");
    if(cacheMarkIndex && cacheMarkIndex !== -1) src = src.substring(0, cacheMarkIndex);

    const imageExtension = src.split('.').pop();

    const url = PromptsBrowser.db.getAPIurl("saveStylePreview");

    (async () => {
        const saveData = {src, style: styleId, collection: collectionId};

        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveData)
        });
        //const content = await rawResponse.json();

        const targetStylesCollection = data.styles[collectionId];
        if(targetStylesCollection) {
            targetStylesCollection.some(item => {
                if(item.name === styleId) {
                    item.previewImage = imageExtension;
    
                    return true;
                }
            });
        }

        PromptsBrowser.styles.update();
    })();
}

PromptsBrowser.db.updateStyles = (collectionId) => {
    if(!collectionId) return;

    const targetData = PromptsBrowser.data.styles[collectionId];
    if(!targetData) return;

    const url = PromptsBrowser.db.getAPIurl("saveStyles");

    (async () => {
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({collection: collectionId, data: JSON.stringify(targetData)})
        });
        //const content = await rawResponse.json();

    })();
}

PromptsBrowser.getCurrentPrompts = () => {
    const {state} = PromptsBrowser;
    if(!state.currentPromptsList[state.currentContainer]) {
        state.currentPromptsList[state.currentContainer] = [];
    }

    return state.currentPromptsList[state.currentContainer];
}

PromptsBrowser.setCurrentPrompts = (currentPrompts) => {
    const {state} = PromptsBrowser;

    state.currentPromptsList[state.currentContainer] = currentPrompts;
}

PromptsBrowser.onChangeTab = (e) => {
    const tagName = e.target.tagName.toLowerCase()
    if(tagName !== "button") return;

    const {state} = PromptsBrowser;
    const text = e.target.innerText.trim();
    if(state.currentContainer === text) return;
    let update = false;

    if(text === "txt2img") {
        state.currentContainer = "text2Img";
        update = true;
    }

    if(text === "img2img") {
        state.currentContainer = "img2Img";
        update = true;
    }

    if(update) {
        PromptsBrowser.controlPanel.update();
        PromptsBrowser.previewSave.update();
        PromptsBrowser.knownPrompts.update();
        PromptsBrowser.currentPrompts.update();
    }
}

PromptsBrowser.onDocumentKey = (e) => {
    if(e.key !== "Escape") return;
    let hold = false;

    if(PromptsBrowser.onCloseActiveWindow) hold = PromptsBrowser.onCloseActiveWindow();
    if(!hold) PromptsBrowser.onCloseActiveWindow = undefined;
}

PromptsBrowser.loadUIConfig = () => {
    const {state} = PromptsBrowser;

    const lsShowViews = localStorage.getItem("PBE_showViews");
    if(lsShowViews) state.showViews = JSON.parse(lsShowViews);

    const showControlPanel = localStorage.getItem("showControlPanel");
    if(showControlPanel === "false") state.showControlPanel = false;
}

/**
 * Loading extension configuration from the local storage
 */
PromptsBrowser.loadConfig = () => {
    const {state} = PromptsBrowser;

    //getting config from local storage
    const savedConfigString = localStorage.getItem("PBE_config");
    if(savedConfigString) {
        const savedConfig = JSON.parse(savedConfigString);
        if(savedConfig) state.config = savedConfig;
    }
}

PromptsBrowser._textAreaSynchronise = () => PromptsBrowser.synchroniseCurrentPrompts(true, false);

PromptsBrowser.initPromptBrowser = (tries = 0) => {
    const {state} = PromptsBrowser;
    const {DOMCache} = PromptsBrowser;
    const {united} = PromptsBrowser.data;
    if(!DOMCache.containers) DOMCache.containers = {};
    const mainContainer = PromptsBrowser.gradioApp();

    if(tries > 100) {
        PromptsBrowser.utils.log("No prompt wrapper container found or server did not returned prompts data.");
        return;
    }

    const checkContainer = mainContainer.querySelector("#txt2img_prompt_container");
    if(!checkContainer || !united) {
        window.__timeoutPBUpdatePrompt = setTimeout( () => PromptsBrowser.initPromptBrowser(tries + 1), 1000 );
        return;
    }
    
    DOMCache.mainContainer = mainContainer;

    const tabsContainer = mainContainer.querySelector("#tabs > div:first-child");

    tabsContainer.removeEventListener("click", PromptsBrowser.onChangeTab);
    tabsContainer.addEventListener("click", PromptsBrowser.onChangeTab);

    document.removeEventListener('keyup', PromptsBrowser.onDocumentKey);
    document.addEventListener('keyup', PromptsBrowser.onDocumentKey);

    for(const containerId in PromptsBrowser.supportedContainers) {
        DOMCache.containers[containerId] = {};
        const container = PromptsBrowser.supportedContainers[containerId];
        const domContainer = DOMCache.containers[containerId];

        if(container.prompt) {
            const promptContainer = mainContainer.querySelector(`#${container.prompt}`);
            if(promptContainer.dataset.loadedpbextension) continue;
            promptContainer.dataset.loadedpbextension = "true";

            const positivePrompts = mainContainer.querySelector(`#${container.prompt} > div`);
            const negativePrompts = mainContainer.querySelector(`#${container.prompt} > div:nth-child(2)`);
            if(!positivePrompts || !negativePrompts) {
                PromptsBrowser.utils.log(`No prompt containers found for ${containerId}`);
                continue;
            }

            domContainer.promptContainer = promptContainer;
            domContainer.positivePrompts = positivePrompts;
            domContainer.negativePrompts = negativePrompts;

            if(container.buttons) {
                const buttonsContainer = mainContainer.querySelector(`#${container.buttons}`);
                if(buttonsContainer) {
                    domContainer.buttonsContainer = buttonsContainer;

                    const generateButton = buttonsContainer.querySelector(".primary");
                    if(generateButton) domContainer.generateButton = generateButton;
                }
            }

            if(container.results) {
                const resultsContainer = mainContainer.querySelector(`#${container.results}`);
                if(resultsContainer) {
                    domContainer.resultsContainer = resultsContainer;
                }
            }

            domContainer.textArea = positivePrompts.querySelector("textarea");
            const textArea = domContainer.textArea;

            if(textArea && !textArea.dataset.pbelistenerready) {
                textArea.dataset.pbelistenerready = "true";

                textArea.removeEventListener("input", PromptsBrowser._textAreaSynchronise);
                textArea.addEventListener("input", PromptsBrowser._textAreaSynchronise);
            }

            PromptsBrowser.promptWordTooltip.init(positivePrompts, containerId);
            PromptsBrowser.controlPanel.init(promptContainer, containerId);
            PromptsBrowser.knownPrompts.init(promptContainer, positivePrompts, containerId);
            PromptsBrowser.currentPrompts.init(promptContainer, containerId);
            PromptsBrowser.saveStyle.initButton(positivePrompts);
            PromptsBrowser.styles.initButton(positivePrompts);
            PromptsBrowser.promptScribe.initButton(positivePrompts);
            PromptsBrowser.currentPrompts.initButton(positivePrompts);

            if(domContainer.promptBrowser && !state.showViews.includes("known")) {
                domContainer.promptBrowser.style.display = "none";
            }

            if(domContainer.currentPrompts && !state.showViews.includes("current")) {
                domContainer.currentPrompts.style.display = "none";
            }

            if(!state.showViews.includes("positive")) positivePrompts.style.display = "none";
            if(!state.showViews.includes("negative")) negativePrompts.style.display = "none";
        }

        if(container.seed) domContainer.seedInput = mainContainer.querySelector(`#${container.seed} input`);
        if(container.width) domContainer.widthInput = mainContainer.querySelector(`#${container.width} input`);
        if(container.height) domContainer.heightInput = mainContainer.querySelector(`#${container.height} input`);
        if(container.steps) domContainer.stepsInput = mainContainer.querySelector(`#${container.steps} input`);
        if(container.cfg) domContainer.cfgInput = mainContainer.querySelector(`#${container.cfg} input`);
        if(container.sampling) domContainer.samplingInput = mainContainer.querySelector(`#${container.sampling} input`);

        if(container.gallery) {
            domContainer.imageArea = PromptsBrowser.gradioApp().querySelector(`#${container.gallery}`);

            PromptsBrowser.previewSave.init(domContainer.imageArea, containerId);
        }
    }

    PromptsBrowser.setupWindow.init(mainContainer);
    PromptsBrowser.promptEdit.init(mainContainer);
    PromptsBrowser.promptTools.init(mainContainer);
    PromptsBrowser.collectionTools.init(mainContainer);
    PromptsBrowser.saveStyle.init(mainContainer);
    PromptsBrowser.styles.init(mainContainer);
    PromptsBrowser.promptScribe.init(mainContainer);

    PromptsBrowser.controlPanel.update();
    PromptsBrowser.previewSave.update();
    PromptsBrowser.knownPrompts.update();
    PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.db.updateMixedList = () => {
    const unitedArray = [];
    const unitedList = {};
    const res = PromptsBrowser.data.original;
    const addedIds = {};

    for(const collectionId in res) {
        const collection = res[collectionId];
        if(!Array.isArray(collection)) continue;

        for(const collectionPrompt of collection) {
            const {id, isExternalNetwork, previewImage, addAtStart, addAfter, addStart, addEnd} = collectionPrompt;
            let newItem = {id, tags: [], category: [], collections: [], knownPreviews: {}};
            if(addedIds[id]) newItem = unitedArray.find(item => item.id === id);

            if(addAtStart) newItem.addAtStart = addAtStart;
            if(addAfter) newItem.addAfter = addAfter;
            if(addStart) newItem.addStart = addStart;
            if(addEnd) newItem.addEnd = addEnd;

            if(isExternalNetwork) newItem.isExternalNetwork = true;
            if(previewImage) {
                newItem.knownPreviews[collectionId] = previewImage;
            }

            if(!newItem.collections.includes(collectionId)) {
                newItem.collections.push(collectionId);
            }

            if(collectionPrompt.tags) {
                collectionPrompt.tags.forEach(item => {
                    if(!newItem.tags.includes(item)) newItem.tags.push(item);
                });
            }

            if(collectionPrompt.category) {
                collectionPrompt.category.forEach(item => {
                    if(!newItem.category.includes(item)) newItem.category.push(item);
                });
            }

            if(!addedIds[id]) {
                unitedArray.push(newItem);
                unitedList[id] = newItem;
            }
            addedIds[id] = true;
        }
    }

    PromptsBrowser.data.united = unitedArray;
    PromptsBrowser.data.unitedList = unitedList;
}

PromptsBrowser.db.getAPIurl = (endpoint, root = false) => {
    const server = root ? window.location.origin + "/" : window.location.origin + "/promptBrowser/";

    return server + endpoint;
}

PromptsBrowser.db.loadDatabase = async () => {
    const {state} = PromptsBrowser;
    const url = PromptsBrowser.db.getAPIurl("getPrompts")
    
    await fetch(url, {
        method: 'GET',
    }).then(data => data.json()).then(res => {
        if(!res || !res.prompts) return; //TODO: process server error here
        const {prompts, styles, readonly = false} = res;
        

        if(res.config) {
            for(const i in res.config) {
                state.config[i] = res.config[i];
            }
        }

        PromptsBrowser.data.styles = styles;
        PromptsBrowser.data.original = prompts;
        PromptsBrowser.db.updateMixedList();

        PromptsBrowser.meta.readonly = readonly;
    });
}

PromptsBrowser.loadConfig();

document.addEventListener('DOMContentLoaded', function() {
    PromptsBrowser.loadUIConfig();

    PromptsBrowser.db.loadDatabase();
    
    PromptsBrowser.initPromptBrowser();
});
