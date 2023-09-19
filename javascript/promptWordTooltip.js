if(!window.PromptsBrowser) window.PromptsBrowser = {};

/**
 * Prompt autocomplite tooltip window
 */
PromptsBrowser.promptWordTooltip = {};

PromptsBrowser.promptWordTooltip.selectedIndex = 0;

PromptsBrowser.promptWordTooltip.unfocusTimeout = 0;

PromptsBrowser.promptWordTooltip.init = (positivePrompts, containerId) => {
    if(!positivePrompts) return;
    const textArea = positivePrompts.querySelector("textarea");
    if(!textArea) return;

    const autocompliteWindow = document.createElement("div");
    autocompliteWindow.className = "PBE_autocompliteBox";

    positivePrompts.style.position = "relative";
    positivePrompts.appendChild(autocompliteWindow);
    PromptsBrowser.DOMCache.containers[containerId].autocompliteWindow = autocompliteWindow;

    textArea.addEventListener("keydown", PromptsBrowser.promptWordTooltip.onKeyDown);
    textArea.addEventListener("blur", PromptsBrowser.promptWordTooltip.onUnfocus);
    textArea.addEventListener("keyup", PromptsBrowser.promptWordTooltip.processCarretPosition);
    textArea.addEventListener("click", PromptsBrowser.promptWordTooltip.processCarretPosition);
}

PromptsBrowser.promptWordTooltip.onKeyDown = (e) => {
    const {autocomplitePromptMode = "prompts"} = PromptsBrowser.state.config;
    if(autocomplitePromptMode === "off") return;

    const {state} = PromptsBrowser;
    const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
    if(!autoCompleteBox) return;
    if(autoCompleteBox.style.display === "none") return;
    if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return;
    const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
    if(!hintElements || !hintElements.length) return;

    e.stopPropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
}

PromptsBrowser.promptWordTooltip.onUnfocus = (e) => {
    const {autocomplitePromptMode = "prompts"} = PromptsBrowser.state.config;
    if(autocomplitePromptMode === "off") return;

    const {state} = PromptsBrowser;
    const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
    if(!autoCompleteBox) return;
    if(autoCompleteBox.style.display === "none") return;
    
    clearTimeout(PromptsBrowser.promptWordTooltip.unfocusTimeout);
    PromptsBrowser.promptWordTooltip.unfocusTimeout = setTimeout(() => {
        autoCompleteBox.style.display = "none";
        autoCompleteBox.style.innerHTML = "";
    }, 400);
}

PromptsBrowser.promptWordTooltip.onHintWindowKey = (e) => {
    const {state, promptWordTooltip} = PromptsBrowser;
    const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
    if(!autoCompleteBox) return false;
    if(autoCompleteBox.style.display === "none") return false;
    if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return false;
    const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
    if(!hintElements || !hintElements.length) return false;

    if(e.keyCode === 13) {
        const selectedHint = autoCompleteBox.querySelector(".PBE_hintItemSelected");
        if(!selectedHint) return false;

        const start = Number(selectedHint.dataset.start);
        const end = Number(selectedHint.dataset.end);
        const newPrompt = selectedHint.innerText;
        const collection = selectedHint.dataset.collection;
        const style = selectedHint.dataset.style;
    
        if(Number.isNaN(start) || Number.isNaN(end)) return;
    
        if(style) PromptsBrowser.promptWordTooltip.onApplyStyleHint(start, end, style, collection);
        else PromptsBrowser.promptWordTooltip.onApplyHint(start, end, newPrompt);

        return true;
    }

    const isDown = e.keyCode == 40;

    if(isDown) promptWordTooltip.selectedIndex++;
    else promptWordTooltip.selectedIndex--;

    if(promptWordTooltip.selectedIndex < 0) promptWordTooltip.selectedIndex = hintElements.length - 1;
    else if(promptWordTooltip.selectedIndex > hintElements.length - 1) promptWordTooltip.selectedIndex = 0;

    for(let i = 0; i < hintElements.length; i++) {
        const element = hintElements[i];

        if(i === promptWordTooltip.selectedIndex) element.classList.add("PBE_hintItemSelected");
        else element.classList.remove("PBE_hintItemSelected");
    }

    return true;
}

PromptsBrowser.promptWordTooltip.onClickHint = (e) => {
    const {state} = PromptsBrowser;
    const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
    const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
    if(!textArea || !autoCompleteBox) return;

    const target = e.currentTarget;
    if(!target) return;

    const start = Number(target.dataset.start);
    const end = Number(target.dataset.end);
    const collection = target.dataset.collection;
    const style = target.dataset.style;
    const newPrompt = target.innerText;

    if(Number.isNaN(start) || Number.isNaN(end)) return;

    if(style) PromptsBrowser.promptWordTooltip.onApplyStyleHint(start, end, style, collection);
    else PromptsBrowser.promptWordTooltip.onApplyHint(start, end, newPrompt);
}

PromptsBrowser.promptWordTooltip.filterNewPromptsOnly = (str) => {
    if(!str) return "";

    const newStrPromptsArr = [];
    const activePrompts = PromptsBrowser.getCurrentPrompts();
    const newArr = str.split(",");

    for(let prompt of newArr) {
        const newPrompt = window.PromptsBrowser.promptStringToObject(prompt.trim());
        if(activePrompts.some(item => item.id === newPrompt.id)) continue;
        
        newStrPromptsArr.push(prompt);
    }

    return newStrPromptsArr.join(", ");
}

PromptsBrowser.promptWordTooltip.onApplyStyleHint = (start, end, style, collection) => {
    const {state, data} = PromptsBrowser;
    const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
    const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;

    if(!textArea || !autoCompleteBox) return;
    if(!style || !collection) return;

    const targetCollection = data.styles[collection];
    if(!targetCollection) return;

    const targetStyle = targetCollection.find(item => item.name === style);
    if(!targetStyle) return;

    autoCompleteBox.style.display = "none";
    let newValue = "";

    const prefix = textArea.value.substring(0, start);
    const postfix = textArea.value.substring(end);

    newValue += prefix;
    newValue += postfix;

    textArea.value = newValue;

    PromptsBrowser.promptWordTooltip.selectedIndex = 0;
    PromptsBrowser.synchroniseCurrentPrompts(false);

    PromptsBrowser.applyStyle(targetStyle, true, false);
}

PromptsBrowser.promptWordTooltip.onApplyHint = (start, end, newPrompt) => {
    const {filterNewPromptsOnly} = PromptsBrowser.promptWordTooltip;
    const {united} = PromptsBrowser.data;
    const {state} = PromptsBrowser;
    const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
    const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
    if(!textArea || !autoCompleteBox) return;
    const targetItem = united.find(item => item.id === newPrompt);
    autoCompleteBox.style.display = "none";
    let newValue = "";

    const addAfter = targetItem && targetItem.addAfter ? filterNewPromptsOnly(targetItem.addAfter) : "";
    const addStart = targetItem && targetItem.addStart ? filterNewPromptsOnly(targetItem.addStart) : "";
    const addEnd = targetItem && targetItem.addEnd ? filterNewPromptsOnly(targetItem.addEnd) : "";

    if(targetItem && targetItem.addAtStart) {
        const oldValue = textArea.value.substring(0, start) + textArea.value.substring(end);
        if(targetItem.isExternalNetwork) newPrompt = `<${newPrompt}>`;
        if(addAfter) newPrompt += ", " + addAfter + ", ";

        newValue += newPrompt;

        if(addStart) newValue += addStart + ", ";
        newValue += oldValue;

        if(addEnd) newValue += addEnd;

    } else {
        const prefix = textArea.value.substring(0, start);
        const postfix = textArea.value.substring(end);

        if(addStart) newValue += addStart + ", ";
        
        if(prefix) newValue += prefix + " ";
    
        if(targetItem) {
            if(targetItem.isExternalNetwork) newPrompt = `<${newPrompt}>`;
            if(addAfter) newPrompt += ", " + addAfter;
    
            newValue += newPrompt;
    
        } else newValue += newPrompt;
    
        if(postfix) newValue += postfix;
        else newValue += ", ";

        if(addEnd) newValue += addEnd;
    }

    textArea.value = newValue;

    PromptsBrowser.promptWordTooltip.selectedIndex = 0;
    PromptsBrowser.synchroniseCurrentPrompts(false);
}

PromptsBrowser.promptWordTooltip.getPossiblePrompts = (word) => {
    const promptsList = PromptsBrowser.data.united;
    const possiblePrompts = [];

    for(const prompt of promptsList) {
        if(!prompt.id) continue;
        if(prompt.id.toLowerCase().includes(word)) possiblePrompts.push(prompt.id);
    }

    possiblePrompts.sort();

    return possiblePrompts;
}

PromptsBrowser.promptWordTooltip.getPossibleStyles = (word) => {
    const MAX_STYLES = 5;
    const IGNORED_COLLECTIONS = ["autogen"];

    const {styles} = PromptsBrowser.data;
    const possibleStyles = [];
    let addedStyles = 0;

    topLoop: for(const collectionId in styles) {
        if(IGNORED_COLLECTIONS.includes(collectionId)) continue;

        for(let i = 0; i < styles[collectionId].length; i++) {
            const styleItem = styles[collectionId][i];
            if(!styleItem.name) continue;

            if(styleItem.name.toLowerCase().includes(word)) {
                possibleStyles.push({collection: collectionId, name: styleItem.name});
                addedStyles++;
            }

            if(addedStyles > MAX_STYLES) break topLoop;
        }
    }

    possibleStyles.sort( (A, B) => {
        if(A.name > B.name) return 1;
        if(A.name < B.name) return -1;

        return 0;
    });

    return possibleStyles;
}

PromptsBrowser.promptWordTooltip.processCarretPosition = (e) => {
    const {autocomplitePromptMode = "prompts"} = PromptsBrowser.state.config;
    if(autocomplitePromptMode === "off") return;

    const doc = PromptsBrowser.gradioApp();
    const activeElement = doc.activeElement || document.activeElement;
    const textArea = e.currentTarget;
    const isFocused = activeElement === textArea;
    if(!isFocused) return;
    clearTimeout(PromptsBrowser.promptWordTooltip.unfocusTimeout);

    if(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
        const block = PromptsBrowser.promptWordTooltip.onHintWindowKey(e);

        if(block) {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();

            return false;
        }
    }

    const {selectedIndex = 0} = PromptsBrowser.promptWordTooltip;
    const {state} = PromptsBrowser;
    if(!PromptsBrowser.data || !PromptsBrowser.data.united) return;
    const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
    if(!autoCompleteBox) return;
    autoCompleteBox.innerHTML = "";

    const MAX_HINTS = 20;
    let currHints = 0;
    const value = textArea.value;
    const caret = textArea.selectionStart;
    const stopSymbols = [",", "(", ")", "<", ">", ":"];
    const textAreaPosition = textArea.getBoundingClientRect();
    let position = caret;
    let word = "";
    let wordStart = caret;
    let wordEnd = caret;

    while(value[position]) {
        if(value[position] && stopSymbols.includes(value[position])) break;

        word += value[position];
        position++;
        wordEnd = position;
    }

    position = caret - 1;
    while(value[position]) {
        if(value[position] && stopSymbols.includes(value[position])) break;

        word = value[position] + word;
        wordStart = position;
        position--;
    }

    word = word.trim();
    if(!word) return;

    word = word.toLowerCase();

    const showPrompts = autocomplitePromptMode === "prompts" || autocomplitePromptMode === "all";
    const showStyles = autocomplitePromptMode === "styles" || autocomplitePromptMode === "all";

    const possiblePrompts = showPrompts ? PromptsBrowser.promptWordTooltip.getPossiblePrompts(word) : [];
    const possibleStyles = showStyles ? PromptsBrowser.promptWordTooltip.getPossibleStyles(word) : [];

    let haveAnyHints = false;

    if(possiblePrompts.length > 1 || (possiblePrompts.length === 1 && word !== possiblePrompts[0])) haveAnyHints = true;
    if(possibleStyles.length) haveAnyHints = true;

    if(!haveAnyHints) {
        autoCompleteBox.style.display = "none";
        return;
    } else autoCompleteBox.style.display = "";

    if(showPrompts) for(const item of possiblePrompts) {
        if(currHints >= MAX_HINTS) break;
        const hintItem = document.createElement("div");
        hintItem.className = "PBE_hintItem";
        hintItem.innerText = item;
        hintItem.dataset.start = wordStart;
        hintItem.dataset.end = wordEnd;
        if(currHints === selectedIndex) hintItem.classList.add("PBE_hintItemSelected");

        hintItem.addEventListener("click", PromptsBrowser.promptWordTooltip.onClickHint);

        autoCompleteBox.appendChild(hintItem);

        currHints++;
    }

    if(showStyles) for(const item of possibleStyles) {
        if(currHints >= MAX_HINTS) break;
        const hintItem = document.createElement("div");
        hintItem.className = "PBE_hintItem";
        hintItem.innerText = "Style: " + item.name;
        hintItem.dataset.collection = item.collection;
        hintItem.dataset.style = item.name;
        hintItem.dataset.start = wordStart;
        hintItem.dataset.end = wordEnd;
        if(currHints === selectedIndex) hintItem.classList.add("PBE_hintItemSelected");

        hintItem.addEventListener("click", PromptsBrowser.promptWordTooltip.onClickHint);

        autoCompleteBox.appendChild(hintItem);

        currHints++;
    }

    const caretePos = getCaretCoordinates(textArea, caret);

    if(caretePos) {
        autoCompleteBox.style.bottom = textAreaPosition.height + "px";
        autoCompleteBox.style.left = caretePos.left + 10 + "px";
    }
}