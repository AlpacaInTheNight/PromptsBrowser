import PromptScribe from "./index";
import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Database from "client/Database/index";
import KnownPrompts from "client/KnownPrompts/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import Prompt from "clientTypes/prompt";

class PromptScribeEvent {

    public static onCloseWindow() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.promptScribe;

        if(!wrapper) return;

        state.showScriberWindow = undefined;
        wrapper.style.display = "none";
    }

    public static onAddUnknownPrompts() {
        const {data} = Database;
        const {state} = PromptsBrowser;
        let {selectedNewPrompts = []} = state;
        const uniquePrompts = ActivePrompts.getUnique();
        if(!state.savePreviewCollection) return;
        const targetCollection = data.original[state.savePreviewCollection];
        if(!targetCollection) return;
        let newPrompts = false;

        for(const prompt of uniquePrompts) {
            if(!selectedNewPrompts.includes(prompt.id)) continue;

            const known = targetCollection.some(item => item.id === prompt.id);
            if(!known) {
                if(!newPrompts) newPrompts = true;
                const targetItem: Prompt = {id: prompt.id, tags: [], category: []};
                if(prompt.isExternalNetwork) targetItem.isExternalNetwork = true;
                targetCollection.push(targetItem);

                //removing from the selected
                selectedNewPrompts = selectedNewPrompts.filter(item => item !== prompt.id);
            }
        }

        if(!newPrompts) return;
        state.selectedNewPrompts = selectedNewPrompts;

        Database.saveJSONData(state.savePreviewCollection);
        Database.updateMixedList();
        KnownPrompts.update();
        CurrentPrompts.update();
        PromptScribe.update();
    }

    public static onToggleOnlyNew(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const id = "new_in_all_collections";

        if(state.toggledButtons.includes(id)) {
            state.toggledButtons = state.toggledButtons.filter(item => item !== id);
        } else {
            state.toggledButtons.push(id);
        }
        
        PromptScribe.update();
    }

    public static onToggleAll(e: MouseEvent) {
        const {state} = PromptsBrowser;
        let {selectedNewPrompts = []} = state;

        if(!selectedNewPrompts.length) {
            PromptScribe.update(true);
            return;
        }

        state.selectedNewPrompts = [];
        
        PromptScribe.update();
    }
}

export default PromptScribeEvent;
