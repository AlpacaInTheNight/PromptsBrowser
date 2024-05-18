import PromptEdit from "./index";
import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import Prompt from "clientTypes/prompt";

class PromptEditEvent {

    public static onCloseWindow() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.promptEdit;
        if(!wrapper || !state.editingPrompt) return;

        state.editingPrompt = undefined;
        wrapper.style.display = "none";
    }

    public static onAddTags(targetItem: Prompt, inputElement: HTMLInputElement) {
        if(!inputElement || !targetItem) return;
        const value = inputElement.value;

        let tags = value.split(",").map(item => item.trim());

        //removing empty tags
        tags = tags.filter(item => item);

        for(const tag of tags) {
            if(targetItem.tags.includes(tag)) continue;
            targetItem.tags.push(tag);
        }

        PromptEdit.update(targetItem);
    }

    public static onChangeAutogenCollection(value: string, prompt: Prompt) {
        if(!prompt) return;
        const {data} = Database;

        if(!prompt.autogen) prompt.autogen = {};
        if(!value || value === "__none") delete prompt.autogen.collection;
        else {
            prompt.autogen.collection = value;

            const targetCollection = data.styles[value];
            if(!targetCollection) return;
            prompt.autogen.style = "";

            for(const styleItem of targetCollection) {
                prompt.autogen.style = styleItem.name;
                break;
            }
        }

        PromptEdit.update(prompt);
    }

    public static onChangeAutogenStyle(value: string, prompt: Prompt) {
        if(!prompt || !value) return;

        if(!prompt.autogen) prompt.autogen = {};
        prompt.autogen.style = value;

        PromptEdit.update(prompt);
    }
}

export default PromptEditEvent;
