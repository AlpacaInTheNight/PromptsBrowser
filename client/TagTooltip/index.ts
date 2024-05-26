import Database from "client/Database/index";
import TagTooltipEvent from "./event";

class TagTooltip {
        
    public static selectedIndex = 0;

    public static unfocusTimeout: any = 0;

    public static container: HTMLDivElement | undefined = undefined;
    public static input: HTMLInputElement | undefined = undefined;

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

        inputContainer.addEventListener("keydown", TagTooltipEvent.onKeyDown);
        inputContainer.addEventListener("blur", TagTooltipEvent.onUnfocus);
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

    private static processCarretPosition(e: KeyboardEvent) {
        const target = e.currentTarget as HTMLInputElement;
        TagTooltip.input = target;
        const elementPosition = target.dataset.position || "";
        clearTimeout(TagTooltip.unfocusTimeout);

        if(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
            const block = TagTooltipEvent.onHintWindowKey(e);

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

            hintItem.addEventListener("click", TagTooltipEvent.onClickHint);

            autoCompleteBox.appendChild(hintItem);

            currHints++;
        }
    }

}

export default TagTooltip;
