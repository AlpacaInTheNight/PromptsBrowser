import SaveStyle from "./index";
import PromptsBrowser from "client/index";
import Style from "clientTypes/style";
import Database from "client/Database/index";
import LoadStyle from "client/LoadStyle/index";

class SaveStyleEvent {

    public static onOpenStyles() {
        const {state} = PromptsBrowser;
    
        state.showSaveStyleWindow = true;
        SaveStyle.update();
    }
    
    public static onCloseWindow() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.saveStyleWindow;
        if(!wrapper || !state.showSaveStyleWindow) return;
    
        state.showSaveStyleWindow = undefined;
        wrapper.style.display = "none";
    }
    
    public static onSaveStyle() {
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
    
    public static onChangeNewCollection(e: Event) {
        const target = e.currentTarget as HTMLSelectElement;
        const {state} = PromptsBrowser;
        const value = target.value;
        if(!value) return;
    
        state.newStyleCollection = value;
    }
}

export default SaveStyleEvent;
