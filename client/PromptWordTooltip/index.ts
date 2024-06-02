import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import PromptWordTooltipEvent from "./event";

/**
 * Function from getCaretPos.js.
 * https://github.com/component/textarea-caret-position
 */
declare const getCaretCoordinates: (textArea: HTMLTextAreaElement, caret: number) => {left: number};

/**
 * Prompt autocomplite tooltip window
 */
class PromptWordTooltip {

    public static selectedIndex = 0;

    public static unfocusTimeout: any = 0;
    
    public static init(positivePrompts: HTMLElement, containerId: string) {
        if(!positivePrompts) return;
        const textArea = positivePrompts.querySelector("textarea");
        if(!textArea) return;
    
        const autocompliteWindow = document.createElement("div");
        autocompliteWindow.className = "PBE_autocompliteBox";
    
        positivePrompts.style.position = "relative";
        positivePrompts.appendChild(autocompliteWindow);
        PromptsBrowser.DOMCache.containers[containerId].autocompliteWindow = autocompliteWindow;
    
        textArea.addEventListener("keydown", PromptWordTooltipEvent.onKeyDown);
        textArea.addEventListener("blur", PromptWordTooltipEvent.onUnfocus);
        textArea.addEventListener("keyup", PromptWordTooltip.processCarretPosition);
        textArea.addEventListener("click", PromptWordTooltip.processCarretPosition);
    }
    
    public static getPossiblePrompts(word: string) {
        const promptsList = Database.data.united;
        const possiblePrompts = [];
    
        for(const prompt of promptsList) {
            if(!prompt.id) continue;
            if(prompt.id.toLowerCase().includes(word)) possiblePrompts.push(prompt.id);
        }
    
        possiblePrompts.sort();
    
        return possiblePrompts;
    }
    
    public static getPossibleStyles(word: string) {
        const MAX_STYLES = 5;
        const IGNORED_COLLECTIONS = ["autogen"];
    
        const {styles} = Database.data;
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
    
    public static processCarretPosition(e: KeyboardEvent) {
        const target = e.currentTarget as HTMLTextAreaElement;
        const {autocomplitePromptMode = "prompts"} = PromptsBrowser.state.config;
        if(autocomplitePromptMode === "off") return;
    
        const doc = PromptsBrowser.gradioApp() as any;
        const activeElement = doc.activeElement || document.activeElement;
        const textArea = target;
        const isFocused = activeElement === textArea;
        if(!isFocused) return;
        clearTimeout(PromptWordTooltip.unfocusTimeout);
    
        if(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
            const block = PromptWordTooltipEvent.onHintWindowKey(e);
    
            if(block) {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
    
                return false;
            }
        }
    
        const {selectedIndex = 0} = PromptWordTooltip;
        const {state} = PromptsBrowser;
        if(!Database.data || !Database.data.united) return;
        const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
        if(!autoCompleteBox) return;
        autoCompleteBox.innerHTML = "";
    
        const MAX_HINTS = 20;
        let currHints = 0;
        const value = textArea.value;
        const caret = textArea.selectionStart;
        const stopSymbols = [",", "(", ")", "<", ">", ":", "|", "{", "}"];
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
    
        const possiblePrompts = showPrompts ? PromptWordTooltip.getPossiblePrompts(word) : [];
        const possibleStyles = showStyles ? PromptWordTooltip.getPossibleStyles(word) : [];
    
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
            hintItem.dataset.start = wordStart + "";
            hintItem.dataset.end = wordEnd + "";
            if(currHints === selectedIndex) hintItem.classList.add("PBE_hintItemSelected");
    
            hintItem.addEventListener("click", PromptWordTooltipEvent.onClickHint);
    
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
            hintItem.dataset.start = wordStart + "";
            hintItem.dataset.end = wordEnd + "";
            if(currHints === selectedIndex) hintItem.classList.add("PBE_hintItemSelected");
    
            hintItem.addEventListener("click", PromptWordTooltipEvent.onClickHint);
    
            autoCompleteBox.appendChild(hintItem);
    
            currHints++;
        }
    
        const caretePos = getCaretCoordinates(textArea, caret);
    
        if(caretePos) {
            autoCompleteBox.style.bottom = textAreaPosition.height + "px";
            autoCompleteBox.style.left = caretePos.left + 10 + "px";
        }
    }

}

export default PromptWordTooltip;
