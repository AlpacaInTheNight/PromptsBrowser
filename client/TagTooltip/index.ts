import PromptsBrowser from "client/index";
import Database from "client/Database/index";

class TagTooltip {
        
    private static selectedIndex = 0;

    private static unfocusTimeout: any = 0;

    private static container: HTMLDivElement | undefined = undefined;
    private static input: HTMLInputElement | undefined = undefined;

    private static knownTags: string[] = [];

    public static add(inputContainer: HTMLInputElement, fixed = false) {
        TagTooltip.updateTagsList();

        //removing old element from the page
        if(TagTooltip.container) {
            const oldWindow = document.querySelector(".PBE_autocompliteTags");
            if(oldWindow) oldWindow.remove();
            TagTooltip.container = undefined;
        }

        const autocompliteWindow = document.createElement("div");
        autocompliteWindow.className = "PBE_autocompliteBox PBE_autocompliteTags";
        if(fixed) inputContainer.dataset.position = "fixed";

        document.body.appendChild(autocompliteWindow);

        TagTooltip.setBoxPosition(inputContainer, autocompliteWindow);
        autocompliteWindow.innerText = "";

        TagTooltip.container = autocompliteWindow;
        TagTooltip.input = inputContainer;

        inputContainer.addEventListener("keydown", TagTooltip.onKeyDown);
        inputContainer.addEventListener("blur", TagTooltip.onUnfocus);
        inputContainer.addEventListener("keyup", TagTooltip.processCarretPosition);
        inputContainer.addEventListener("click", TagTooltip.processCarretPosition);
    }

    private static setBoxPosition(inputContainer: HTMLInputElement, boxContainer: HTMLDivElement) {
        const rect = inputContainer.getBoundingClientRect();
        boxContainer.style.top = rect.top + rect.height + "px";
        boxContainer.style.left = rect.left + "px";
        boxContainer.style.zIndex = "1000";
    }

    private static updateTagsList() {
        const {data} = Database;
        if(!data || !data.united) return;
        const knownTags: string[] = [];

        const promptsList = data.united;

        for(const prompt of promptsList) {
            if(!prompt.tags) continue;

            for(const tagItem of prompt.tags) {
                if(!knownTags.includes(tagItem)) knownTags.push(tagItem)
            }
        }

        knownTags.sort();
        TagTooltip.knownTags = knownTags;
    }

    private static onUnfocus(e: FocusEvent) {
        const inputElement = e;
        const autoCompleteBox = TagTooltip.container;

        if(!autoCompleteBox || !inputElement) return;
        if(autoCompleteBox.style.display === "none") return;
        
        clearTimeout(TagTooltip.unfocusTimeout);
        TagTooltip.unfocusTimeout = setTimeout(() => {
            autoCompleteBox.style.display = "none";
            autoCompleteBox.innerHTML = "";
        }, 400);
    }

    private static onKeyDown(e: KeyboardEvent) {
        const inputElement = e;
        const autoCompleteBox = TagTooltip.container;

        if(!autoCompleteBox || !inputElement) return;
        if(autoCompleteBox.style.display === "none") return;
        if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return;

        const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
        if(!hintElements || !hintElements.length) return;

        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    private static onClickHint(e: MouseEvent) {
        const inputElement = TagTooltip.input;
        const autoCompleteBox = TagTooltip.container;

        if(!autoCompleteBox || !inputElement) return;

        const target = e.currentTarget as HTMLElement;
        if(!target) return;

        const start = Number(target.dataset.start);
        const end = Number(target.dataset.end);
        const newPrompt = target.innerText;

        if(Number.isNaN(start) || Number.isNaN(end)) return;

        TagTooltip.onApplyHint(start, end, newPrompt);
    }

    private static onHintWindowKey(e: KeyboardEvent) {
        const inputElement = TagTooltip.input;
        const autoCompleteBox = TagTooltip.container;
        if(!autoCompleteBox || !inputElement) return false;
        if(autoCompleteBox.style.display === "none") return false;
        if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return false;

        const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
        if(!hintElements || !hintElements.length) return false;

        if(e.keyCode === 13) {
            const selectedHint = autoCompleteBox.querySelector(".PBE_hintItemSelected") as HTMLElement;
            if(!selectedHint) return false;

            const start = Number(selectedHint.dataset.start);
            const end = Number(selectedHint.dataset.end);
            const newPrompt = selectedHint.innerText;

            if(Number.isNaN(start) || Number.isNaN(end)) return false;
        
            TagTooltip.onApplyHint(start, end, newPrompt);
            return true;
        }

        const isDown = e.keyCode == 40;

        if(isDown) TagTooltip.selectedIndex++;
        else TagTooltip.selectedIndex--;

        if(TagTooltip.selectedIndex < 0) TagTooltip.selectedIndex = hintElements.length - 1;
        else if(TagTooltip.selectedIndex > hintElements.length - 1) TagTooltip.selectedIndex = 0;

        for(let i = 0; i < hintElements.length; i++) {
            const element = hintElements[i];

            if(i === TagTooltip.selectedIndex) element.classList.add("PBE_hintItemSelected");
            else element.classList.remove("PBE_hintItemSelected");
        }

        return true;
    }

    private static onApplyHint(start: number, end: number, newTag: string) {
        const inputElement = TagTooltip.input;
        const autoCompleteBox = TagTooltip.container;
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

        TagTooltip.selectedIndex = 0;

        inputElement.dispatchEvent(new Event("change"));
    }

    private static processCarretPosition(e: KeyboardEvent) {
        const target = e.currentTarget as HTMLInputElement;
        TagTooltip.input = target;
        const elementPosition = target.dataset.position || "";
        clearTimeout(TagTooltip.unfocusTimeout);

        if(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
            const block = TagTooltip.onHintWindowKey(e);

            if(block) {
                e.stopPropagation();
                e.preventDefault();

                return false;
            }
        }

        const {selectedIndex = 0, knownTags = []} = TagTooltip;
        const autoCompleteBox = TagTooltip.container;
        if(!autoCompleteBox || !target) return;
        autoCompleteBox.innerHTML = "";

        TagTooltip.setBoxPosition(target, autoCompleteBox);

        if(autoCompleteBox.style.position !== elementPosition) {
            autoCompleteBox.style.position = elementPosition;
        }

        const MAX_HINTS = 20;
        let currHints = 0;
        const value = target.value;
        const caret = target.selectionStart;
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
            target.dataset.hint = "";
            return;
        }

        word = word.toLowerCase();
        const possibleTags = [];

        for(const tag of knownTags) {
            if(tag.toLowerCase().includes(word)) possibleTags.push(tag);
        }

        if(!possibleTags.length || (possibleTags.length === 1 && word === possibleTags[0])) {
            autoCompleteBox.style.display = "none";
            target.dataset.hint = "";
            return;
        } else {
            autoCompleteBox.style.display = "";
            target.dataset.hint = "true";
        }

        for(const item of possibleTags) {
            if(currHints >= MAX_HINTS) break;
            const hintItem = document.createElement("div");
            hintItem.className = "PBE_hintItem";
            hintItem.innerText = item;
            hintItem.dataset.start = wordStart + "";
            hintItem.dataset.end = wordEnd + "";
            if(currHints === selectedIndex) hintItem.classList.add("PBE_hintItemSelected");

            hintItem.addEventListener("click", TagTooltip.onClickHint);

            autoCompleteBox.appendChild(hintItem);

            currHints++;
        }
    }

}

export default TagTooltip;
