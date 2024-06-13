import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import { makeDiv, makeSelect } from "client/dom";

class PreviewSave {
    
    public static init = (wrapper: HTMLElement, containerId: string) => {
        const savePromptWrapper = document.createElement("div");
        wrapper.appendChild(savePromptWrapper);

        PromptsBrowser.DOMCache.containers[containerId].savePromptWrapper = savePromptWrapper;
    }

    private static onSavePreview() {
        Database.savePromptPreview();
    }

    private static onChangeCollection(e: Event) {
        const {state} = PromptsBrowser;

        const target = e.currentTarget as HTMLSelectElement;
        const value = target.value;
        state.savePreviewCollection = value || undefined;
    }

    public static update = () => {
        const {data} = Database;
        const {readonly} = Database.meta;
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].savePromptWrapper;
        if(readonly || !wrapper) return;
        wrapper.innerHTML = "";

        if(!state.selectedPrompt) return;

        const savePromptPreviewButton = makeDiv({className: "PBE_actionButton PBE_savePromptPreview",
            content: "Save preview",
            title: "Save the generated preview for the selected prompt",
            onClick: PreviewSave.onSavePreview,
        });

        let options: {id: string; name: string;}[] = [];
        for(const collectionId in data.original) {
            if(!state.savePreviewCollection) state.savePreviewCollection = collectionId;
            options.push({name: collectionId, id: collectionId})
        }

        const collectionSelect = makeSelect({className: "PBE_generalInput PBE_select PBE_savePromptSelect",
            value: state.savePreviewCollection || undefined,
            options,
            onChange: PreviewSave.onChangeCollection,
        });

        wrapper.appendChild(collectionSelect);
        wrapper.appendChild(savePromptPreviewButton);
    }

}

export default PreviewSave;
