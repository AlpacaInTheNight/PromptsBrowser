import PromptWordTooltip from "./index";
import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Database from "client/Database/index";
import { promptStringToObject } from "client/utils/index";
import syncCurrentPrompts from "client/synchroniseCurrentPrompts";
import applyStyle from "client/applyStyle";

class PromptWordTooltipEvent {

    private static filterNewPromptsOnly(str: string) {
        if(!str) return "";
    
        const newStrPromptsArr = [];
        const uniquePrompts = ActivePrompts.getUnique();
        const newArr = str.split(",");
    
        for(let prompt of newArr) {
            const newPrompt = promptStringToObject({prompt});
            if(uniquePrompts.some(item => item.id === newPrompt.id)) continue;
            
            newStrPromptsArr.push(prompt);
        }
    
        return newStrPromptsArr.join(", ");
    }

    public static onKeyDown(e: KeyboardEvent) {
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
    
    public static onUnfocus(e: FocusEvent) {
        const {autocomplitePromptMode = "prompts"} = PromptsBrowser.state.config;
        if(autocomplitePromptMode === "off") return;
    
        const {state} = PromptsBrowser;
        const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
        if(!autoCompleteBox) return;
        if(autoCompleteBox.style.display === "none") return;
        
        clearTimeout(PromptWordTooltip.unfocusTimeout);
        PromptWordTooltip.unfocusTimeout = setTimeout(() => {
            autoCompleteBox.style.display = "none";
            autoCompleteBox.innerHTML = "";
        }, 400);
    }
    
    public static onHintWindowKey(e: KeyboardEvent) {
        const {state} = PromptsBrowser;
        const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
        if(!autoCompleteBox) return false;
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
            const collection = selectedHint.dataset.collection;
            const style = selectedHint.dataset.style;
        
            if(Number.isNaN(start) || Number.isNaN(end)) return;
        
            if(style) PromptWordTooltipEvent.onApplyStyleHint(start, end, style, collection);
            else PromptWordTooltipEvent.onApplyHint(start, end, newPrompt);
    
            return true;
        }
    
        const isDown = e.keyCode == 40;
    
        if(isDown) PromptWordTooltip.selectedIndex++;
        else PromptWordTooltip.selectedIndex--;
    
        if(PromptWordTooltip.selectedIndex < 0) PromptWordTooltip.selectedIndex = hintElements.length - 1;
        else if(PromptWordTooltip.selectedIndex > hintElements.length - 1) PromptWordTooltip.selectedIndex = 0;
    
        for(let i = 0; i < hintElements.length; i++) {
            const element = hintElements[i];
    
            if(i === PromptWordTooltip.selectedIndex) element.classList.add("PBE_hintItemSelected");
            else element.classList.remove("PBE_hintItemSelected");
        }
    
        return true;
    }
    
    public static onClickHint(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const autoCompleteBox = PromptsBrowser.DOMCache.containers[state.currentContainer].autocompliteWindow;
        const textArea = PromptsBrowser.DOMCache.containers[state.currentContainer].textArea;
        if(!textArea || !autoCompleteBox) return;
    
        const target = e.currentTarget as HTMLElement;
        if(!target) return;
    
        const start = Number(target.dataset.start);
        const end = Number(target.dataset.end);
        const collection = target.dataset.collection;
        const style = target.dataset.style;
        const newPrompt = target.innerText;
    
        if(Number.isNaN(start) || Number.isNaN(end)) return;
    
        if(style) PromptWordTooltipEvent.onApplyStyleHint(start, end, style, collection);
        else PromptWordTooltipEvent.onApplyHint(start, end, newPrompt);
    }

    public static onApplyStyleHint(start: number, end: number, style: string, collection: string) {
        const {state} = PromptsBrowser;
        const {data} = Database;
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
    
        PromptWordTooltip.selectedIndex = 0;
        syncCurrentPrompts(false);
    
        applyStyle(targetStyle, true, false);
    }
    
    public static onApplyHint(start: number, end: number, newPrompt: string) {
        const {filterNewPromptsOnly} = PromptWordTooltipEvent;
        const {united} = Database.data;
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
    
        PromptWordTooltip.selectedIndex = 0;
        syncCurrentPrompts(false);
    }
}

export default PromptWordTooltipEvent;
