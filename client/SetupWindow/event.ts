import SetupWindow from "./index";
import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import { makeFileNameSafe } from "client/utils";

class SetupWindowEvent {

    /**
     * Closes Setup window
     * @returns 
     */
    public static onCloseWindow = () => {
        const {viewMode} = SetupWindow;
        const wrapper = PromptsBrowser.DOMCache.setupWindow;
        if(!wrapper) return;

        if(viewMode === "newCollection" || viewMode === "newStylesCollection") {
            SetupWindow.viewMode = "normal";
            SetupWindow.update();
            return true;

        } else wrapper.style.display = "none";
    }

    public static onUpdateDirName = (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        let value = target.value;
        if(!value) return;

        value = makeFileNameSafe(value);
        target.value = value;
    }

    public static onCreate = (e: MouseEvent) => {
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

}

export default SetupWindowEvent;
