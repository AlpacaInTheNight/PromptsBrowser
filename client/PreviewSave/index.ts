import PromptsBrowser from "client/index";
import Database from "client/Database/index";

class PreviewSave {
    
    public static init = (wrapper: HTMLElement, containerId: string) => {
        const savePromptWrapper = document.createElement("div");
        wrapper.appendChild(savePromptWrapper);

        PromptsBrowser.DOMCache.containers[containerId].savePromptWrapper = savePromptWrapper;
    }

    private static onSavePreview() {
        Database.savePromptPreview();
    }

    public static update = () => {
        const {data} = Database;
        const {readonly} = Database.meta;
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].savePromptWrapper;
        if(readonly || !wrapper) return;
        wrapper.innerHTML = "";

        if(!state.selectedPrompt) return;

        const savePromptPreviewButton = document.createElement("div");
        savePromptPreviewButton.className = "PBE_actionButton PBE_savePromptPreview";
        savePromptPreviewButton.innerText = "save preview";

        const collectionSelect = document.createElement("select");
        collectionSelect.className = "PBE_generalInput PBE_select PBE_savePromptSelect";

        let options = "";
        for(const collectionId in data.original) {
            if(!state.savePreviewCollection) state.savePreviewCollection = collectionId;
            options += `<option value="${collectionId}">${collectionId}</option>`;
        }
        collectionSelect.innerHTML = options;

        if(state.savePreviewCollection) collectionSelect.value = state.savePreviewCollection;

        collectionSelect.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLSelectElement;
            const value = target.value;
            state.savePreviewCollection = value || undefined;
        });

        savePromptPreviewButton.removeEventListener("click", PreviewSave.onSavePreview);
        savePromptPreviewButton.addEventListener("click", PreviewSave.onSavePreview);

        wrapper.appendChild(collectionSelect);
        wrapper.appendChild(savePromptPreviewButton);
    }

}

export default PreviewSave;
