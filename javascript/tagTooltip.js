if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.tagTooltip = {};

PromptsBrowser.tagTooltip.selectedIndex = 0;

PromptsBrowser.tagTooltip.unfocusTimeout = 0;

PromptsBrowser.tagTooltip.container = undefined;
PromptsBrowser.tagTooltip.input = undefined;

PromptsBrowser.tagTooltip.knownTags = [];

PromptsBrowser.tagTooltip.add = (inputContainer) => {
    PromptsBrowser.tagTooltip.updateTagsList();

    const autocompliteWindow = document.createElement("div");
	autocompliteWindow.className = "PBE_autocompliteBox PBE_autocompliteTags";

	document.body.appendChild(autocompliteWindow);

    const rect = inputContainer.getBoundingClientRect();
    autocompliteWindow.style.top = rect.top + rect.height + "px";
    autocompliteWindow.style.left = rect.left + "px";
    autocompliteWindow.style.zIndex = 1000;
    autocompliteWindow.innerText = "";

    PromptsBrowser.tagTooltip.container = autocompliteWindow;
	PromptsBrowser.tagTooltip.input = inputContainer;

    inputContainer.addEventListener("keydown", PromptsBrowser.tagTooltip.onKeyDown);
	inputContainer.addEventListener("blur", PromptsBrowser.tagTooltip.onUnfocus);
	inputContainer.addEventListener("keyup", PromptsBrowser.tagTooltip.processCarretPosition);
    inputContainer.addEventListener("click", PromptsBrowser.tagTooltip.processCarretPosition);
}

PromptsBrowser.tagTooltip.updateTagsList = () => {
    if(!PromptsBrowser.data || !PromptsBrowser.data.united) return;
    const knownTags = [];

    const promptsList = PromptsBrowser.data.united;

    for(const prompt of promptsList) {
		if(!prompt.tags) continue;

        for(const tagItem of prompt.tags) {
            if(!knownTags.includes(tagItem)) knownTags.push(tagItem)
        }
	}

    knownTags.sort();
    PromptsBrowser.tagTooltip.knownTags = knownTags;
}

PromptsBrowser.tagTooltip.onUnfocus = (e) => {
    const inputElement = PromptsBrowser.tagTooltip.input;
	const autoCompleteBox = PromptsBrowser.tagTooltip.container;

	if(!autoCompleteBox || !inputElement) return;
	if(autoCompleteBox.style.display === "none") return;
	
	clearTimeout(PromptsBrowser.tagTooltip.unfocusTimeout);
	PromptsBrowser.tagTooltip.unfocusTimeout = setTimeout(() => {
		autoCompleteBox.style.display = "none";
		autoCompleteBox.style.innerHTML = "";
	}, 400);
}

PromptsBrowser.tagTooltip.onKeyDown = (e) => {
	const inputElement = PromptsBrowser.tagTooltip.input;
	const autoCompleteBox = PromptsBrowser.tagTooltip.container;

	if(!autoCompleteBox || !inputElement) return;
	if(autoCompleteBox.style.display === "none") return;
	if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return;

	const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
	if(!hintElements || !hintElements.length) return;

	e.stopPropagation();
	e.preventDefault();
}

PromptsBrowser.tagTooltip.onClickHint = (e) => {
    const inputElement = PromptsBrowser.tagTooltip.input;
	const autoCompleteBox = PromptsBrowser.tagTooltip.container;

	if(!autoCompleteBox || !inputElement) return;

	const target = e.currentTarget;
	if(!target) return;

	const start = Number(target.dataset.start);
	const end = Number(target.dataset.end);
	const newPrompt = target.innerText;

	if(Number.isNaN(start) || Number.isNaN(end)) return;

	PromptsBrowser.tagTooltip.onApplyHint(start, end, newPrompt);
}

PromptsBrowser.tagTooltip.onHintWindowKey = (e) => {
	const inputElement = PromptsBrowser.tagTooltip.input;
	const autoCompleteBox = PromptsBrowser.tagTooltip.container;
	if(!autoCompleteBox || !inputElement) return false;
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

		if(Number.isNaN(start) || Number.isNaN(end)) return false;
	
		PromptsBrowser.tagTooltip.onApplyHint(start, end, newPrompt);
		return true;
	}

	const isDown = e.keyCode == 40;

	if(isDown) PromptsBrowser.tagTooltip.selectedIndex++;
	else PromptsBrowser.tagTooltip.selectedIndex--;

	if(PromptsBrowser.tagTooltip.selectedIndex < 0) PromptsBrowser.tagTooltip.selectedIndex = hintElements.length - 1;
	else if(PromptsBrowser.tagTooltip.selectedIndex > hintElements.length - 1) PromptsBrowser.tagTooltip.selectedIndex = 0;

	for(let i = 0; i < hintElements.length; i++) {
		const element = hintElements[i];

		if(i === PromptsBrowser.tagTooltip.selectedIndex) element.classList.add("PBE_hintItemSelected");
		else element.classList.remove("PBE_hintItemSelected");
	}

	return true;
}

PromptsBrowser.tagTooltip.onApplyHint = (start, end, newTag) => {
	const inputElement = PromptsBrowser.tagTooltip.input;
	const autoCompleteBox = PromptsBrowser.tagTooltip.container;
	if(!autoCompleteBox || !inputElement) return;

	autoCompleteBox.style.display = "none";
	inputElement.dataset.hint = "";
	let newValue = "";

	const prefix = inputElement.value.substring(0, start);
    const postfix = inputElement.value.substring(end);
    
    if(prefix) newValue += prefix + " ";
    newValue += newTag;
    if(postfix) newValue += postfix;

	inputElement.value = newValue;

	PromptsBrowser.tagTooltip.selectedIndex = 0;

    inputElement.dispatchEvent(new Event("change"));
}

PromptsBrowser.tagTooltip.processCarretPosition = (e) => {
	clearTimeout(PromptsBrowser.tagTooltip.unfocusTimeout);

	if(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
		const block = PromptsBrowser.tagTooltip.onHintWindowKey(e);

		if(block) {
			e.stopPropagation();
			e.preventDefault();

			return false;
		}
	}

	const {selectedIndex = 0, knownTags = []} = PromptsBrowser.tagTooltip;
	const inputElement = PromptsBrowser.tagTooltip.input;
	const autoCompleteBox = PromptsBrowser.tagTooltip.container;
	if(!autoCompleteBox || !inputElement) return;
	autoCompleteBox.innerHTML = "";

	const MAX_HINTS = 20;
	let currHints = 0;
	const value = inputElement.value;
	const caret = inputElement.selectionStart;
	const stopSymbols = [",", "(", ")", "<", ">", ":"];
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
	if(!word) {
        inputElement.dataset.hint = "";
        return;
    }

	const possibleTags = [];

	for(const tag of knownTags) {
		if(tag.includes(word)) possibleTags.push(tag);
	}

	if(!possibleTags.length || (possibleTags.length === 1 && word === possibleTags[0])) {
		autoCompleteBox.style.display = "none";
        inputElement.dataset.hint = "";
		return;
	} else {
		autoCompleteBox.style.display = "";
        inputElement.dataset.hint = "true";
	}

	for(const item of possibleTags) {
		if(currHints >= MAX_HINTS) break;
		const hintItem = document.createElement("div");
		hintItem.className = "PBE_hintItem";
		hintItem.innerText = item;
		hintItem.dataset.start = wordStart;
		hintItem.dataset.end = wordEnd;
		if(currHints === selectedIndex) hintItem.classList.add("PBE_hintItemSelected");

		hintItem.addEventListener("click", PromptsBrowser.tagTooltip.onClickHint);

		autoCompleteBox.appendChild(hintItem);

		currHints++;
	}
}