import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Database from "client/Database/index";
import syncCurrentPrompts from "client/synchroniseCurrentPrompts";
import showPromptItem from "client/showPromptItem";
import PromptScribeEvent from "./event";

class PromptScribe {
    
    public static init(wrapper: HTMLElement) {
        const promptScribe = document.createElement("div");
        promptScribe.className = "PBE_generalWindow PBE_promptScribe";
        promptScribe.id = "PBE_promptScribe";

        PromptsBrowser.DOMCache.promptScribe = promptScribe;

        wrapper.appendChild(promptScribe);

        PromptsBrowser.onCloseActiveWindow = PromptScribeEvent.onCloseWindow;

        promptScribe.addEventListener("click", () => {
            PromptsBrowser.onCloseActiveWindow = PromptScribeEvent.onCloseWindow;
        });
    }

    public static initButton(positiveWrapper: HTMLElement) {
        const {readonly} = Database.meta;
        if(readonly) return;
        const addUnknownButton = document.createElement("button");

        addUnknownButton.className = "PBE_actionButton PBE_addUnknownButton";
        addUnknownButton.innerText = "Add Unknown";

        addUnknownButton.addEventListener("click", PromptScribe.onOpenScriber);

        positiveWrapper.appendChild(addUnknownButton);
    }

    public static onOpenScriber() {
        const {state} = PromptsBrowser;
        syncCurrentPrompts();

        state.showScriberWindow = true;
        PromptScribe.update(true);
    }

    private static showHeader(wrapper: HTMLElement) {
        const {data} = Database;
        const {state} = PromptsBrowser;

        const newPromptsHeader = document.createElement("div");
        newPromptsHeader.className = "PBE_newPromptsHeader";

        const toggleOnlyNew = document.createElement("div");
        toggleOnlyNew.className = "PBE_toggleButton";
        toggleOnlyNew.innerText = "All collections";
        toggleOnlyNew.title = "Toggle if only unknown in all collections should be shown or only in the current collection";
        if(state.toggledButtons.includes("new_in_all_collections")) toggleOnlyNew.classList.add("PBE_toggledButton");
        toggleOnlyNew.style.height = "24px";

        toggleOnlyNew.addEventListener("click", PromptScribeEvent.onToggleOnlyNew);

        const saveButton = document.createElement("button");
        saveButton.innerText = "Add new prompts";
        saveButton.className = "PBE_button";

        saveButton.addEventListener("click", PromptScribeEvent.onAddUnknownPrompts);

        const toggleAll = document.createElement("button");
        toggleAll.innerText = "Toggle all";
        toggleAll.className = "PBE_button";
        toggleAll.style.marginRight = "10px";

        toggleAll.addEventListener("click", PromptScribeEvent.onToggleAll);

        const collectionSelect = document.createElement("select");
        collectionSelect.className = "PBE_generalInput PBE_select";
        collectionSelect.style.margin = "0 10px";
        collectionSelect.style.height = "30px";

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

            PromptScribe.update();
        });

        newPromptsHeader.appendChild(toggleAll);
        newPromptsHeader.appendChild(toggleOnlyNew);
        newPromptsHeader.appendChild(collectionSelect);
        newPromptsHeader.appendChild(saveButton);

        wrapper.appendChild(newPromptsHeader);
    }

    private static showUnknownPrompts(wrapper: HTMLElement, initial: boolean = false) {
        const {data} = Database;
        const {state} = PromptsBrowser;
        let {selectedNewPrompts = [], savePreviewCollection, toggledButtons = []} = state;
        const newInAllCollections = toggledButtons.includes("new_in_all_collections");
        //const activePrompts = ActivePrompts.getCurrentPrompts();
        const uniquePrompts = ActivePrompts.getUnique();
        let database = data.united;

        if(!newInAllCollections && savePreviewCollection && data.original[state.savePreviewCollection]) {
            database = data.original[state.savePreviewCollection];
        }

        if(initial) selectedNewPrompts = [];
        let unknownPromptsList = [];

        for(const item of uniquePrompts) {
            if(item.isSyntax) continue;
            let isKnown = false;

            for(const knownPrompt of database) {
                if(knownPrompt.id.toLowerCase() === item.id.toLowerCase()) {
                    isKnown = true;
                    break;
                }
            }

            if(!isKnown) {
                unknownPromptsList.push(item);
                if(initial) selectedNewPrompts.push(item.id);
            }
        }

        if(initial) state.selectedNewPrompts = selectedNewPrompts;

        const newPromptsContainer = document.createElement("div");
        newPromptsContainer.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";

        for(let item of unknownPromptsList) {
            const promptElement = showPromptItem({prompt: item, options: {noSplash: true}});
            promptElement.classList.add("PBE_newElement");
            if(selectedNewPrompts.includes(item.id)) promptElement.classList.add("PBE_selectedNewElement");
            newPromptsContainer.appendChild(promptElement);

            promptElement.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLDivElement;
                const id = target.dataset.prompt;
                if(!id) return;

                if(selectedNewPrompts.includes(id)) {
                    selectedNewPrompts = selectedNewPrompts.filter(item => item !== id);
                    target.classList.remove("PBE_selectedNewElement");
                } else {
                    selectedNewPrompts.push(id);
                    target.classList.add("PBE_selectedNewElement");
                }

                PromptsBrowser.state.selectedNewPrompts = selectedNewPrompts;
            });
        }

        wrapper.appendChild(newPromptsContainer);
    }

    public static update(initial?: boolean) {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.promptScribe;

        if(!wrapper) return;
        PromptsBrowser.onCloseActiveWindow = PromptScribeEvent.onCloseWindow;
        wrapper.innerHTML = "";
        wrapper.style.display = "flex";

        const footerBlock = document.createElement("div");
        const closeButton = document.createElement("button");
        footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
        closeButton.innerText = "Close";
        closeButton.className = "PBE_button";

        closeButton.addEventListener("click", (e) => {
            state.showScriberWindow = undefined;
            wrapper.style.display = "none";
        });

        PromptScribe.showHeader(wrapper);
        PromptScribe.showUnknownPrompts(wrapper, initial);

        footerBlock.appendChild(closeButton);

        wrapper.appendChild(footerBlock);
    }

}

export default PromptScribe;
