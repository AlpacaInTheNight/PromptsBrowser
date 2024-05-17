import PromptsBrowser from "client/index";
import Style from "clientTypes/style";
import Database from "client/Database/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import LoadStyle from "client/LoadStyle/index";
import { makeElement } from "client/dom";
import showPromptItem from "client/showPromptItem";

class SaveStyle {

    public static init(mainWrapper: HTMLElement) {
        const saveStyleWindow = document.createElement("div");
    
        saveStyleWindow.className = "PBE_generalWindow PBE_stylesWindow";
        saveStyleWindow.id = "PBE_saveStyleWindow";
    
        PromptsBrowser.DOMCache.saveStyleWindow = saveStyleWindow;
        mainWrapper.appendChild(saveStyleWindow);
        PromptsBrowser.onCloseActiveWindow = SaveStyle.onCloseWindow;
    
        saveStyleWindow.addEventListener("click", () => {
            PromptsBrowser.onCloseActiveWindow = SaveStyle.onCloseWindow;
        });
    }
    
    public static initButton(positiveWrapper: HTMLElement) {
        const addStylesButton = document.createElement("button");
    
        addStylesButton.className = "PBE_actionButton PBE_saveStylesButton";
        addStylesButton.innerText = "Save style";
    
        addStylesButton.addEventListener("click", SaveStyle.onOpenStyles);
    
        positiveWrapper.appendChild(addStylesButton);
    }
    
    private static onOpenStyles() {
        const {state} = PromptsBrowser;
    
        state.showSaveStyleWindow = true;
        SaveStyle.update();
    }
    
    private static onCloseWindow() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.saveStyleWindow;
        if(!wrapper || !state.showSaveStyleWindow) return;
    
        state.showSaveStyleWindow = undefined;
        wrapper.style.display = "none";
    }
    
    private static onSaveStyle() {
        const {data} = Database;
        const {state} = PromptsBrowser;
        const collectionId = state.newStyleCollection;
        if(!collectionId) return;
    
        const targetCollection = data.styles[collectionId];
        if(!targetCollection) return;
    
        const styleNameInput = PromptsBrowser.DOMCache.saveStyleWindow.querySelector("#PBE_newStyleName") as HTMLInputElement;
    
        const name = styleNameInput.value;
        if(!name || !data.styles) return;
    
        const newStyle = LoadStyle.grabCurrentStyle(name, collectionId);
        if(!newStyle) return;
    
        targetCollection.push(newStyle as Style);
    
        Database.updateStyles(collectionId);
        SaveStyle.update();
    }
    
    private static onChangeNewCollection(e: Event) {
        const target = e.currentTarget as HTMLSelectElement;
        const {state} = PromptsBrowser;
        const value = target.value;
        if(!value) return;
    
        state.newStyleCollection = value;
    }
    
    private static showCurrentPrompts(wrapper: HTMLElement) {
        let activePrompts = PromptsBrowser.getCurrentPrompts();
    
        /* const currentPromptsContainer = document.createElement("div");
        currentPromptsContainer.className = "PBE_windowCurrentList PBE_Scrollbar"; */
    
        for(const i in activePrompts) {
            const currPrompt = activePrompts[i];
    
            const promptElement = showPromptItem({
                prompt: {id: currPrompt.id, isExternalNetwork: currPrompt.isExternalNetwork},
                options: {},
            });
            wrapper.appendChild(promptElement);
    
            promptElement.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLDivElement;
                const currentId = target.dataset.prompt;
                if(!currentId) return;
    
                if(e.ctrlKey || e.metaKey) {
                    activePrompts = activePrompts.filter(item => item.id !== currentId);
                    PromptsBrowser.setCurrentPrompts(activePrompts);
                    SaveStyle.update();
                    CurrentPrompts.update();
    
                    return;
                }
            });
        }
    
        /* currentPromptsContainer.addEventListener("wheel", (e) => {
            if(!e.deltaY) return;
    
            e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
            e.preventDefault();
        });
    
    
        wrapper.appendChild(currentPromptsContainer); */
    }
    
    private static showAddStyle(wrapper: HTMLElement) {
        const {data} = Database;
        const {state} = PromptsBrowser;
    
        const setupContainer = document.createElement("div");
    
        setupContainer.className = "PBE_List PBE_stylesSetup";
    
        const styleNameInput = document.createElement("input");
        const saveButton = document.createElement("button");
        saveButton.innerText = "Save as style";
        saveButton.className = "PBE_button";
        styleNameInput.placeholder = "Style name";
        styleNameInput.className = "PBE_generalInput PBE_newStyleName";
        styleNameInput.id = "PBE_newStyleName";
    
        saveButton.addEventListener("click", SaveStyle.onSaveStyle);
    
        const collectionSelect = document.createElement("select");
        collectionSelect.className = "PBE_generalInput PBE_select";
        collectionSelect.style.height = "30px";
        collectionSelect.style.marginRight = "5px";
        let options = "";
    
        for(const collectionId in data.styles) {
            if(!state.newStyleCollection) state.newStyleCollection = collectionId;
    
            options += `<option value="${collectionId}">${collectionId}</option>`;
        }
    
        collectionSelect.innerHTML = options;
        collectionSelect.value = state.newStyleCollection;
    
        collectionSelect.addEventListener("change", SaveStyle.onChangeNewCollection);
    
        const saveRow = makeElement<HTMLDivElement>({element: "div", className: "PBE_row"});
    
        saveRow.appendChild(collectionSelect);
        saveRow.appendChild(saveButton);
    
        setupContainer.appendChild(styleNameInput);
        setupContainer.appendChild(saveRow);
    
        wrapper.appendChild(setupContainer);
        LoadStyle.showMetaCheckboxes(wrapper);
    }
    
    public static update() {
        const {readonly} = Database.meta;
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.saveStyleWindow;
        if(!wrapper || !state.showSaveStyleWindow) return;
        PromptsBrowser.onCloseActiveWindow = SaveStyle.onCloseWindow;
        wrapper.innerHTML = "";
        wrapper.style.display = "flex";
    
        const currentPromptsBlock = document.createElement("div");
      
        const footerBlock = document.createElement("div");
        const closeButton = document.createElement("button");
        footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
        currentPromptsBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
        closeButton.innerText = "Close";
        closeButton.className = "PBE_button";
    
        const addNewContainer = makeElement<HTMLDivElement>({element: "div", className: "PBE_row"});
    
        if(!readonly) {
            SaveStyle.showCurrentPrompts(currentPromptsBlock);
            SaveStyle.showAddStyle(addNewContainer);
        }
    
        closeButton.addEventListener("click", SaveStyle.onCloseWindow);
    
        footerBlock.appendChild(closeButton);
    
        if(!readonly) {
            wrapper.appendChild(addNewContainer);
            wrapper.appendChild(currentPromptsBlock);
        }
    
        wrapper.appendChild(footerBlock);
    };
    
}

export default SaveStyle;
