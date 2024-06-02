import PromptTools from "./index";
import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Database from "client/Database/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import PromptEdit from "client/PromptEdit/index";
import { DEFAULT_PROMPT_WEIGHT } from "client/const";

class PromptToolsEvent {

    public static onCloseWindow() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.promptTools;

        if(!wrapper) return;

        state.promptTools = undefined;
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

    public static onChangeSelected(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const {state} = PromptsBrowser;
        const {index, groupId} = state.promptTools;
        if(index === undefined) return;

        const clickPrompt = target.dataset.prompt;
        const newIndex = Number(target.dataset.index);
        let newGroup: number | false = Number(target.dataset.group);
        if(Number.isNaN(newGroup)) newGroup = false;

        if(e.shiftKey && clickPrompt) {
            state.editingPrompt = clickPrompt;

            PromptEdit.update();
            return;
        }

        if(e.metaKey || e.ctrlKey) {
            ActivePrompts.removePrompt(newIndex, newGroup);

        } else {
            //same element
            if(index === newIndex && groupId === newGroup) return;

            state.promptTools.index = newIndex;
            state.promptTools.groupId = newGroup;
        }

        PromptTools.update();
        CurrentPrompts.update();
    }

    public static onSelectNew(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const {data} = Database;
        const {united} = data;
        const {state} = PromptsBrowser;
        const {index, groupId} = state.promptTools;
        const clickPrompt = target.dataset.prompt;
        const replaceMode = state.toggledButtons.includes("tools_replaceMode");
        if(index === undefined || !clickPrompt) return;

        const selectedPrompt = united.find(item => item.id === clickPrompt);
        if(!selectedPrompt) return;

        if(e.shiftKey) {
            state.editingPrompt = clickPrompt;
            PromptEdit.update();
            
            return;
        }

        const newItem = {
            id: clickPrompt,
            weight: DEFAULT_PROMPT_WEIGHT,
            isExternalNetwork: selectedPrompt.isExternalNetwork,
        };

        let action: "add" | "replace" = "add";

        if(replaceMode) action = e.altKey ? "add" : "replace";
        else action = e.altKey ? "replace" : "add";

        if(action === "add") ActivePrompts.insertPrompt(newItem, index + 1, groupId);
        else ActivePrompts.replacePrompt(newItem, index, groupId);

        PromptTools.update();
        CurrentPrompts.update();
    }

}

export default PromptToolsEvent;
