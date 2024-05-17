import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import { makeElement, makeSelect } from "client/dom";
import { makeFileNameSafe } from "client/utils";

class SetupWindow {
    
    /**
     * Shown Setup window tab
     */
    private static viewMode = "normal";

    /**
     * Inits Setup window HTML on page, loads config data.
     * @param {*} wrapper 
     */
    public static init = (wrapper: HTMLElement) => {
    /*  const {state} = PromptsBrowser;

        const savedConfigString = localStorage.getItem("PBE_config");
        if(savedConfigString) {
            const savedConfig = JSON.parse(savedConfigString);
            if(savedConfig) state.config = savedConfig;
        } */

        const setupWindow = document.createElement("div");
        setupWindow.className = "PBE_setupWindow PBE_generalWindow";

        PromptsBrowser.DOMCache.setupWindow = setupWindow;
        wrapper.appendChild(setupWindow);

        PromptsBrowser.onCloseActiveWindow = SetupWindow.onCloseWindow;

        setupWindow.addEventListener("click", () => {
            PromptsBrowser.onCloseActiveWindow = SetupWindow.onCloseWindow;
        });
    }

    /**
     * Closes Setup window
     * @returns 
     */
    private static onCloseWindow = () => {
        const {viewMode} = SetupWindow;
        const wrapper = PromptsBrowser.DOMCache.setupWindow;
        if(!wrapper) return;

        if(viewMode === "newCollection" || viewMode === "newStylesCollection") {
            SetupWindow.viewMode = "normal";
            SetupWindow.update();
            return true;

        } else wrapper.style.display = "none";
    }

    private static onUpdateDirName = (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        let value = target.value;
        if(!value) return;

        value = makeFileNameSafe(value);
        target.value = value;
    }

    private static onCreate = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLButtonElement;
        const {viewMode} = SetupWindow;
        if(!target.parentNode) return;
        const setupWindow = target.parentNode.parentNode;
        if(!setupWindow) return;

        if(viewMode === "newCollection") {
            const newNameInput = setupWindow.querySelector(".PBE_newCollectionName") as HTMLInputElement;
            const formatSelect = setupWindow.querySelector(".PBE_newCollectionFormat") as HTMLSelectElement;
            if(!newNameInput || !formatSelect) return;
            const newName = makeFileNameSafe(newNameInput.value);
            const format = formatSelect.value;
            if(!newName || !format) return;

            Database.createNewCollection(newName, format);
            
        } else if(viewMode === "newStylesCollection") {
            const newNameInput = setupWindow.querySelector(".PBE_newCollectionName") as HTMLInputElement;
            const formatSelect = setupWindow.querySelector(".PBE_newStyleCollectionFormat") as HTMLSelectElement;
            if(!newNameInput || !formatSelect) return;
            const newName = makeFileNameSafe(newNameInput.value);
            const format = formatSelect.value;
            if(!newName || !format) return;
            
            Database.createNewStylesCollection(newName, format);

        }

        SetupWindow.viewMode = "normal";
        SetupWindow.update();
    }

    /**
     * Shows block with create new collection buttons
     * @param {*} wrapper 
     */
    private static showCreateNew = (wrapper: HTMLElement) => {

        const newCollection = makeElement<HTMLButtonElement>({
            element: "button", className: "PBE_button", content: "New prompts collection"
        });

        const newStylesCollection = makeElement<HTMLButtonElement>({
            element: "button", className: "PBE_button", content: "New styles collection"
        });

        newCollection.addEventListener("click", () => {
            SetupWindow.viewMode = "newCollection";
            SetupWindow.update();
        });

        newStylesCollection.addEventListener("click", () => {
            SetupWindow.viewMode = "newStylesCollection";
            SetupWindow.update();
        });

        wrapper.appendChild(newCollection);
        wrapper.appendChild(newStylesCollection);
        //wrapper.appendChild(buttonsBlock);
    }

    private static showNewCollection = (wrapper: HTMLElement) => {
        const newName = document.createElement("div");
        const newNameLabel = document.createElement("div");
        const newNameInput = document.createElement("input");
        newName.className = "PBE_rowBlock";
        newName.style.maxWidth = "none";
        newNameInput.className = "PBE_generalInput PBE_input PBE_newCollectionName";

        newNameLabel.innerText = "New prompts collection name";

        newNameInput.addEventListener("change", SetupWindow.onUpdateDirName);

        newName.appendChild(newNameLabel);
        newName.appendChild(newNameInput);

        const format = document.createElement("div");
        const formatLabel = document.createElement("div");
        const formatSelect = document.createElement("select");
        format.className = "PBE_rowBlock";
        format.style.maxWidth = "none";
        formatSelect.value = "short";
        formatSelect.className = "PBE_generalInput PBE_select PBE_newCollectionFormat";

        formatSelect.innerHTML = `
            <option value="short">Short</option>
            <option value="expanded">Expanded</option>
        `;

        formatLabel.innerText = "Store format";

        format.appendChild(formatLabel);
        format.appendChild(formatSelect);

        wrapper.appendChild(newName);
        wrapper.appendChild(format);
    }

    private static showNewStylesCollection = (wrapper: HTMLElement) => {

        const newName = makeElement<HTMLDivElement>({element: "div", className: "PBE_rowBlock"});
        const format = makeElement<HTMLDivElement>({element: "div", className: "PBE_rowBlock"});
        newName.style.maxWidth = "none";
        format.style.maxWidth = "none";

        const newNameLabel = makeElement<HTMLDivElement>({element: "div", content: "New styles collection name"});
        const formatLabel = makeElement<HTMLDivElement>({element: "div", content: "Store format"});

        const newNameInput = makeElement<HTMLInputElement>({element: "input", className: "PBE_generalInput PBE_input PBE_newCollectionName"});
        newNameInput.addEventListener("change", SetupWindow.onUpdateDirName);

        newName.appendChild(newNameLabel);
        newName.appendChild(newNameInput);

        const formatSelect = makeSelect({
            className: "PBE_generalInput PBE_select PBE_newStyleCollectionFormat",
            value: "short",
            options: [
                {id: "short", name: "Short"},
                {id: "expanded", name: "Expanded"},
            ],
        });

        format.appendChild(formatLabel);
        format.appendChild(formatSelect);

        wrapper.appendChild(newName);
        wrapper.appendChild(format);
    }

    public static update = () => {
        const {readonly} = Database.meta;
        const {viewMode} = SetupWindow;
        const wrapper = PromptsBrowser.DOMCache.setupWindow;
        if(!wrapper) return;
        
        PromptsBrowser.onCloseActiveWindow = SetupWindow.onCloseWindow;
        wrapper.style.display = "flex";

        if(viewMode === "newCollection") wrapper.innerHTML = "New prompts collection";
        else if(viewMode === "newStylesCollection") wrapper.innerHTML = "New styles collections";
        else wrapper.innerHTML = "New Collection";

        const topBlock = document.createElement("div");
        const contentBlock = document.createElement("div");
        const footerBlock = document.createElement("div");
        const closeButton = document.createElement("button");

        topBlock.className = "PBE_row PBE_setupWindowTopBlock";
        contentBlock.className = "PBE_windowContent PBE_Scrollbar";
        contentBlock.style.width = "100%";

        if(viewMode === "newCollection") {
            SetupWindow.showNewCollection(contentBlock);

        } else if(viewMode === "newStylesCollection") {
            SetupWindow.showNewStylesCollection(contentBlock);

        } else {
            if(!readonly) SetupWindow.showCreateNew(topBlock);

            const infoMessage = document.createElement("div");
            infoMessage.innerText = `The extension settings have moved to the general webUI settings in the "Prompts Browser" category.`;
            contentBlock.appendChild(infoMessage);
        }

        const statusBlock = makeElement<HTMLDivElement>({element: "div", className: "PBE_setupWindowStatus PBE_row"});
        statusBlock.innerHTML = `
            version: ${Database.meta.version}
            <a target='_blank' href='https://github.com/AlpacaInTheNight/PromptsBrowser'>Project Page</a>
        `;

        footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
        footerBlock.style.justifyContent = "space-evenly";
        closeButton.innerText = viewMode === "normal" ? "Close" : "Cancel";
        closeButton.className = "PBE_button";
        if(viewMode !== "normal") closeButton.classList.add("PBE_buttonCancel");

        closeButton.addEventListener("click", SetupWindow.onCloseWindow);

        if(viewMode === "newCollection" || viewMode === "newStylesCollection") {
            const createButton = document.createElement("button");
            createButton.innerText = "Create";
            createButton.className = "PBE_button";

            createButton.addEventListener("click", SetupWindow.onCreate);

            footerBlock.appendChild(createButton);
        }

        footerBlock.appendChild(closeButton);

        wrapper.appendChild(topBlock);
        wrapper.appendChild(contentBlock);
        wrapper.appendChild(statusBlock);
        wrapper.appendChild(footerBlock);
    }
}

export default SetupWindow;
