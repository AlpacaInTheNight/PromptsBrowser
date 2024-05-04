
if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.currentPrompts = {};

PromptsBrowser.currentPrompts.init = (wrapper, containerId) => {
    const currentPrompts = document.createElement("div");
    currentPrompts.className = "PBE_currentPrompts";

    PromptsBrowser.DOMCache.containers[containerId].currentPrompts = currentPrompts;
    wrapper.appendChild(currentPrompts);
}

PromptsBrowser.currentPrompts.onDragStart = (e) => {
    const {state} = PromptsBrowser;
    const index = e.currentTarget.dataset.index;

    state.dragCurrentIndex = index;
    e.dataTransfer.setData("text", index);
}

PromptsBrowser.currentPrompts.onDragOver = (e) => {
    e.preventDefault();
}

PromptsBrowser.currentPrompts.onDragLeave = (e) => {
    e.currentTarget.classList.remove("PBE_swap");
}

PromptsBrowser.currentPrompts.onDragEnter = (e) => {
    const {state} = PromptsBrowser;

    e.preventDefault();
    const dragIndex = Number(e.currentTarget.dataset.index);
    const dropIndex = Number(state.dragCurrentIndex);

    if(Number.isNaN(dragIndex) || Number.isNaN(dropIndex)) return;
    if(dragIndex === undefined || dropIndex === undefined) return;
    if(dragIndex === dropIndex) return;
    
    e.currentTarget.classList.add("PBE_swap");
}

PromptsBrowser.currentPrompts.onDrop = (e) => {
    const {state} = PromptsBrowser;
    const activePrompts = PromptsBrowser.getCurrentPrompts();

    const dragIndex = Number(e.currentTarget.dataset.index);
    const dropIndex = Number(state.dragCurrentIndex);
    e.currentTarget.classList.remove("PBE_swap");

    state.dragCurrentIndex = undefined;
    e.preventDefault();
    e.stopPropagation();

    const element = activePrompts.splice(dropIndex, 1)[0];
    activePrompts.splice(dragIndex, 0, element);

    PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.currentPrompts.onDblClick = (e) => {
    const {state} = PromptsBrowser;

    const currentId = e.currentTarget.dataset.prompt;
    if(!currentId) return;

    state.promptToolsId = currentId;
    PromptsBrowser.promptTools.update();
}

PromptsBrowser.currentPrompts.initButton = (positiveWrapper) => {
    const {readonly} = PromptsBrowser.meta;
    const normalizeButton = document.createElement("button");

    normalizeButton.className = "PBE_actionButton PBE_normalizeButton";
    normalizeButton.innerText = "Normalize";

    if(readonly) normalizeButton.className = "PBE_actionButton PBE_normalizeButton_readonly";

    normalizeButton.addEventListener("click", PromptsBrowser.currentPrompts.onNormalizePrompts);

    positiveWrapper.appendChild(normalizeButton);
}

PromptsBrowser.currentPrompts.onPromptSelected = (e) => {
    const {readonly} = PromptsBrowser.meta;
    const {united} = PromptsBrowser.data;
    const {state} = PromptsBrowser;
    const currentId = e.currentTarget.dataset.prompt;
    let index = e.currentTarget.dataset.index;
    const isSyntax = e.currentTarget.dataset.issyntax ? true : false;
    const activePrompts = PromptsBrowser.getCurrentPrompts();
    const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
    if(!wrapper || !currentId) return;

    if(index !== undefined) index = Number(index);

    if(isSyntax && index !== undefined && (e.ctrlKey || e.metaKey)) {
        activePrompts.splice(index, 1)
        PromptsBrowser.setCurrentPrompts(activePrompts);
        PromptsBrowser.currentPrompts.update();

        return;
    }

    const targetPrompt = united.find(item => item.id.toLowerCase() === currentId.toLowerCase());

    if(targetPrompt && targetPrompt.collections && targetPrompt.collections[0]) {
        if(!state.savePreviewCollection || !targetPrompt.collections.includes(state.savePreviewCollection)) {
            state.savePreviewCollection = targetPrompt.collections[0];
            PromptsBrowser.previewSave.update();
        }
    }

    if(e.ctrlKey || e.metaKey) {
        PromptsBrowser.setCurrentPrompts(activePrompts.filter(item => item.id !== currentId));
        PromptsBrowser.currentPrompts.update();

        return;
    }

    if(!readonly && e.shiftKey) {
        if(targetPrompt) {
            state.editingPrompt = currentId;
            PromptsBrowser.promptEdit.update();

        } else {
            PromptsBrowser.promptScribe.onOpenScriber();
            
        }

        return;
    }

    const selectedElements = wrapper.querySelectorAll(".PBE_selectedCurrentElement");
    for(let i = 0; i < selectedElements.length; ++i) {
        selectedElements[i].classList.remove("PBE_selectedCurrentElement");
    }

    if(state.selectedPrompt !== currentId) {
        e.currentTarget.classList.add("PBE_selectedCurrentElement");
        state.selectedPrompt = currentId;

    } else {
        state.selectedPrompt = undefined;
        
    }
    
    PromptsBrowser.previewSave.update();
}

/**
 * Handles the mouse wheel event and changes the weight of the prompt
 */
PromptsBrowser.currentPrompts.scrollWeight = (e) => {
    const {state} = PromptsBrowser;
    const {belowOneWeight = 0.05, aboveOneWeight = 0.01} = state.config;
    if(!e.shiftKey) return;
    const currentId = e.currentTarget.dataset.prompt;
    const activePrompts = PromptsBrowser.getCurrentPrompts();
    const targetItem = activePrompts.find(item => item.id === currentId);
    if(!currentId || !targetItem) return;
    if(targetItem.isSyntax) return;

    e.preventDefault();
    e.stopPropagation();

    if(!targetItem.weight) targetItem.weight = 0;

    if(e.deltaY < 0) { //rising weight

        if(targetItem.weight < 1 && (targetItem.weight + belowOneWeight) > 1 ) {
            targetItem.weight = 1;

        } else {
            if(targetItem.weight >= 1) targetItem.weight += aboveOneWeight;
            else targetItem.weight += belowOneWeight;

        }
        
    } else { //lowering weight

        if(targetItem.weight > 1 && (targetItem.weight - aboveOneWeight) < 1 ) {
            targetItem.weight = 1;

        } else {
            if(targetItem.weight <= 1) targetItem.weight -= belowOneWeight;
            else targetItem.weight -= aboveOneWeight;

        }

    }

    if(targetItem.weight < 0) targetItem.weight = 0;
    targetItem.weight = Number(targetItem.weight.toFixed(2));
    PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.currentPrompts.onNormalizePrompts = () => {
    PromptsBrowser.synchroniseCurrentPrompts(true, true);
    PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.currentPrompts.update = (noTextAreaUpdate = false) => {
    const {DEFAULT_PROMPT_WEIGHT} = PromptsBrowser.params;
    const {state} = PromptsBrowser;
    const activePrompts = PromptsBrowser.getCurrentPrompts();

    const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].currentPrompts;
    const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;

    if(!wrapper || !textArea) return;
    wrapper.innerHTML = "";
    const prompts = [];

    for(let index = 0; index < activePrompts.length; index++) {
        promptItem = activePrompts[index];
        const id = promptItem.id;

        if(promptItem.isExternalNetwork) {
            prompts.push({text: `<${id}:${promptItem.weight}>`, src: promptItem});

        } else {
            if(promptItem.weight !== undefined && promptItem.weight !== DEFAULT_PROMPT_WEIGHT) {
                prompts.push({text: `(${id}: ${promptItem.weight})`, src: promptItem});
            } else prompts.push({text: id, src: promptItem});
        }

        const promptElement = PromptsBrowser.showPromptItem(promptItem, {index});

        if(promptItem.isSyntax) {
            promptElement.dataset.issyntax = "true";
        } else if(state.selectedPrompt === id) promptElement.classList.add("PBE_selectedCurrentElement");

        promptElement.addEventListener("dragstart", PromptsBrowser.currentPrompts.onDragStart);
        promptElement.addEventListener("dragover", PromptsBrowser.currentPrompts.onDragOver);
        promptElement.addEventListener("dragenter", PromptsBrowser.currentPrompts.onDragEnter);
        promptElement.addEventListener("dragleave", PromptsBrowser.currentPrompts.onDragLeave);
        promptElement.addEventListener("drop", PromptsBrowser.currentPrompts.onDrop);
        promptElement.addEventListener("click", PromptsBrowser.currentPrompts.onPromptSelected);
        
        if(!promptItem.isSyntax) {
            promptElement.addEventListener("dblclick", PromptsBrowser.currentPrompts.onDblClick);
            promptElement.addEventListener("mousewheel", PromptsBrowser.currentPrompts.scrollWeight);
        }

        wrapper.appendChild(promptElement);
    }
    
    if(noTextAreaUpdate) return;

    //textArea.value = prompts.join(", ");

    let newTextValue = "";
    for(let i = 0; i < prompts.length; i++) {
        const {text, src} = prompts[i];
        const nextPromptSrc = prompts[i+1] ? prompts[i+1].src : undefined;
        newTextValue += text;

        let addDelimiter = true;

        if(!nextPromptSrc) addDelimiter = false;
        else if(src.delimiter) {
            if(src.delimiter === "prev" || src.delimiter === "none") addDelimiter = false;

        } else if(nextPromptSrc.delimiter) {
            if(nextPromptSrc.delimiter === "next" || nextPromptSrc.delimiter === "none") addDelimiter = false;

        }

        if(addDelimiter) newTextValue += ", ";
    }

    textArea.value = newTextValue;

    //Just to be sure every api listening to changes in textarea done their job
    textArea.dispatchEvent(new Event('focus'));
    textArea.dispatchEvent(new Event('input'));
    textArea.dispatchEvent(new KeyboardEvent('keyup'));
    textArea.dispatchEvent(new KeyboardEvent('keypress'));
    textArea.dispatchEvent(new Event('blur'));
}
