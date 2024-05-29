import PromptTools from "./index";
import PromptsBrowser from "client/index";
import Prompt from "clientTypes/prompt";
import Database from "client/Database/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import PromptEdit from "client/PromptEdit/index";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";

class PromptToolsEvent {

    public static onCloseWindow() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.promptTools;

        if(!wrapper) return;

        state.promptToolsId = undefined;
        wrapper.style.display = "none";
    }

    public static onToggleButton(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;

        const id = target.dataset.id;
        if(!id) return;

        if(state.toggledButtons.includes(id)) {
            state.toggledButtons = state.toggledButtons.filter(item => item !== id);
        } else {
            state.toggledButtons.push(id);
        }
        
        PromptTools.update();
    }

    public static onElementClick(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const {data} = Database;
        const {united} = data;
        const {state} = PromptsBrowser;
        const currPrompt = state.promptToolsId;
        const clickPrompt = target.dataset.prompt;
        if(!currPrompt || !clickPrompt) return;
        const replaceMode = state.toggledButtons.includes("tools_replaceMode");
        let activePrompts = PromptsBrowser.getCurrentPrompts();
        let activePrompt: Prompt | undefined = undefined;

        //let selectedPrompt = activePrompts.find(item => item.id === clickPrompt);
        let selectedPrompt = PromptsBrowser.getPromptById({id: clickPrompt});
        if(!selectedPrompt) {
            selectedPrompt = united.find(item => item.id === clickPrompt);
        }
        if(!selectedPrompt) return;

        const currTargetIndex = activePrompts.findIndex(item => {
            if(item.id === currPrompt) {
                activePrompt = item;
                return true;
            }
        });
        const clickTargetIndex = activePrompts.findIndex(item => item.id === clickPrompt);
        if(currTargetIndex === -1) return;

        if(clickTargetIndex !== -1) {

            if(e.metaKey || e.ctrlKey) {
                //activePrompts = activePrompts.filter(item => item.id !== clickPrompt);
                //PromptsBrowser.setCurrentPrompts(activePrompts);
                PromptsBrowser.removePrompt(clickPrompt);

            } else if(e.shiftKey) {
                state.editingPrompt = clickPrompt;
                PromptEdit.update();

            } else {
                state.promptToolsId = clickPrompt;
                
            }

            PromptTools.update();
            CurrentPrompts.update();
            return;
        }

        const newItem = {
            id: clickPrompt,
            weight: DEFAULT_PROMPT_WEIGHT,
            isExternalNetwork: selectedPrompt.isExternalNetwork
        };

        let action = "";

        if(e.shiftKey) {
            state.editingPrompt = clickPrompt;
            PromptEdit.update();

        } else {
            if(replaceMode) action = e.altKey ? "add" : "replace";
            else action = e.altKey ? "replace" : "add";

        }

        if(action === "add") activePrompts.splice(currTargetIndex, 0, newItem);
        else if (action === "replace") {
            if(activePrompt && activePrompt.weight !== undefined) newItem.weight = activePrompt.weight;

            activePrompts[currTargetIndex] = newItem;
            state.promptToolsId = clickPrompt;
        }

        PromptTools.update();
        CurrentPrompts.update();
    }
}

export default PromptToolsEvent;
