import LoadStyle from "./index";
import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import applyStyle from "client/applyStyle";
import { Config, ConfigTrackStyleMeta } from "clientTypes/state";
import { AddStyleType } from "clientTypes/style";

class LoadStyleEvent {

    public static onCloseWindow() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.stylesWindow;
        if(!wrapper || !state.showStylesWindow) return;
    
        state.showStylesWindow = undefined;
        wrapper.style.display = "none";
    }
    
    public static onCardClick(e: MouseEvent) {
        const isShift = e.shiftKey;
        const isCtrl = e.metaKey || e.ctrlKey;
    
        if(isShift) LoadStyleEvent.onApplyStyle(e, false);
        else if(isCtrl) LoadStyleEvent.onRemoveStyle(e);
        else LoadStyleEvent.onSelectStyle(e);
    }
    
    public static onChangeFilterCollection(e: Event) {
        const target = e.currentTarget as HTMLSelectElement;
        const {state} = PromptsBrowser;
        const value = target.value;
    
        state.filterStyleCollection = value;
        LoadStyle.update();
    }
    
    public static onChangeFilterName(e: Event) {
        const target = e.currentTarget as HTMLInputElement;
        const {state} = PromptsBrowser;
        const value = target.value;
    
        state.filterStyleName = value.toLowerCase();
        LoadStyle.update();
    }
    
    public static onToggleShortMode(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const id = "styles_simplified_view";
    
        if(state.toggledButtons.includes(id)) {
            state.toggledButtons = state.toggledButtons.filter(item => item !== id);
        } else {
            state.toggledButtons.push(id);
        }
        
        LoadStyle.update();
    }
    
    public static onChangeSaveMeta(e: Event) {
        const target = e.currentTarget as HTMLInputElement;
        const {state} = PromptsBrowser;
        const checked = target.checked;
        const id = target.dataset.id;
        if(!id) return;
    
        if(!state.config) state.config = {} as Config;
        if(!state.config.saveStyleMeta) state.config.saveStyleMeta = {} as ConfigTrackStyleMeta;
    
        (state.config.saveStyleMeta as any)[id] = checked;
        localStorage.setItem("PBE_config", JSON.stringify(state.config));
    }
    
    public static onChangeUpdateMeta(e: Event) {
        const target = e.currentTarget as HTMLInputElement;
        const {state} = PromptsBrowser;
        const checked = target.checked;
        const id = target.dataset.id;
        if(!id) return;
    
        if(!state.config) state.config = {} as Config;
        if(!state.config.updateStyleMeta) state.config.updateStyleMeta = {} as ConfigTrackStyleMeta;
    
        (state.config.updateStyleMeta as any)[id] = checked;
        localStorage.setItem("PBE_config", JSON.stringify(state.config));
    }

    public static onChangeApplyMethod(e: Event) {
        const {state} = PromptsBrowser;
        const target = e.currentTarget as HTMLSelectElement;
        const value = target.value;
        const isUpdate = target.dataset.update ? true : false;
        if(!value) return;
    
        if(!state.config) state.config = {} as Config;
        if(isUpdate) {
            if(!state.config.updateStyleMeta) state.config.updateStyleMeta = {} as ConfigTrackStyleMeta;
            state.config.updateStyleMeta.addType = value as any;
        } else {
            if(!state.config.saveStyleMeta) state.config.saveStyleMeta = {} as ConfigTrackStyleMeta;
            state.config.saveStyleMeta.addType = value as any;
        }
    
        localStorage.setItem("PBE_config", JSON.stringify(state.config));
    }

    public static onRemoveStyle(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const {readonly} = Database.meta;
        const {data} = Database;
        if(readonly || !data.styles) return;
    
        let collectionId = undefined;
        let index = undefined;
    
        if(target.dataset.action) {
            const {selectedItem} = LoadStyle;
            collectionId = selectedItem.collection;
            index = selectedItem.index;
    
        } else {
            collectionId = target.dataset.id;
            index = Number(target.dataset.index);
        }
    
        if(!collectionId || Number.isNaN(index)) return;
    
        const targetCollection = data.styles[collectionId];
        if(!targetCollection) return;
    
        const targetStyle = data.styles[collectionId][index];
        if(!targetStyle) return;
    
        if( confirm(`Remove style "${targetStyle.name}" from catalogue "${collectionId}"?`) ) {
            targetCollection.splice(index, 1);
    
            Database.updateStyles(collectionId);
            LoadStyle.update();
        }
    }
    
    public static onRenameStyle(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const {data} = Database;
        if(!data.styles) return;
    
        let collectionId = undefined;
        let index = undefined;
    
        if(target.dataset.action) {
            const {selectedItem} = LoadStyle;
            collectionId = selectedItem.collection;
            index = selectedItem.index;
    
        } else {
            collectionId = target.dataset.id;
            index = Number(target.dataset.index);
        }
    
        if(!collectionId || Number.isNaN(index)) return;
    
        const targetCollection = data.styles[collectionId];
        if(!targetCollection) return;
    
        const targetStyle = data.styles[collectionId][index];
        if(!targetStyle) return;
    
        const nameInputField = document.querySelector("#PBE_stylesWindow .PBE_nameAction") as HTMLInputElement;
        if(!nameInputField || !nameInputField.value) return;
    
        for(const styleItem of targetCollection) {
            if(styleItem.name === nameInputField.value) {
                alert("Style name already used");
                return;
            }
        }
    
        if( confirm(`Rename style "${targetStyle.name}" to "${nameInputField.value}"?`) ) {
            Database.onRenameStyle(collectionId, targetStyle.name, nameInputField.value);
        }
    }
    
    public static onUpdateStyle(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const {data} = Database;
        if(!data.styles) return;
    
        let collectionId = undefined;
        let index = undefined;
    
        if(target.dataset.action) {
            const {selectedItem} = LoadStyle;
            collectionId = selectedItem.collection;
            index = selectedItem.index;
    
        } else {
            collectionId = target.dataset.id;
            index = Number(target.dataset.index);
        }
    
        if(!collectionId || Number.isNaN(index)) return;
    
        const targetCollection = data.styles[collectionId];
        if(!targetCollection) return;
    
        const targetStyle = data.styles[collectionId][index];
        if(!targetStyle) return;
    
        if( confirm(`Replace style "${targetStyle.name}" params to the currently selected?`) ) {
            const newStyle = LoadStyle.grabCurrentStyle(undefined, collectionId, true);
            if(!newStyle) return;
    
            for(const i in newStyle) {
                (targetStyle as any)[i] = (newStyle as any)[i];
            }
    
            /**
             * Removing fields that are not part of the style anymore.
             * Some fields like name or previewImage must be kept in the object.
             * TODO: I probably should check dictionary of fields that can be added/removed
             * instead of hardcoding check for things like a name
             */
            for(const i in targetStyle) {
                if(i === "name") continue;
                if(i === "previewImage") continue;
    
                if(!(newStyle as any)[i]) delete (targetStyle as any)[i];
            }
    
            Database.updateStyles(collectionId);
            LoadStyle.update();
        }
    }
    
    public static onSelectStyle(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const {data} = Database;
        const {state} = PromptsBrowser;
        const {updateStyleMeta = {} as ConfigTrackStyleMeta} = state.config || {};
    
        const collection = target.dataset.id;
        const styleId = target.dataset.name;
        const index = Number(target.dataset.index);
        if(!data || !data.styles || !collection || Number.isNaN(index)) return;
    
        if(target.classList.contains("PBE_selectedCurrentElement")) {
            LoadStyle.selectedItem = {collection: "", styleId: "", index: 0};
            target.classList.remove("PBE_selectedCurrentElement");
    
        } else {
            LoadStyle.selectedItem = {collection, styleId, index};
    
            const prevSelected = target.parentNode.querySelector(".PBE_selectedCurrentElement");
            if(prevSelected) prevSelected.classList.remove("PBE_selectedCurrentElement");
    
            const targetCollection =  data.styles[collection];
            if(targetCollection) {
                const targetStyle = targetCollection[index];
                const checkBoxesWrapper = document.querySelector("#PBE_stylesWindow .PBE_styleMetaCheckboxes") as HTMLElement;
                const nameInputField = document.querySelector("#PBE_stylesWindow .PBE_nameAction") as HTMLInputElement;
                
                if(targetStyle && checkBoxesWrapper) {
    
                    const checkStatus: {[key: string]: {id: string, checked: boolean}} = {
                        positive: {id: "#PBE_UpdatekeepPositive", checked: targetStyle.positive !== undefined},
                        negative: {id: "#PBE_UpdatekeepNegative", checked: targetStyle.negative !== undefined},
                        size: {id: "#PBE_UpdatekeepSize", checked: targetStyle.height !== undefined},
                        sampler: {id: "#PBE_UpdatekeepSampler", checked: targetStyle.sampling !== undefined},
                        quality: {id: "#PBE_UpdatekeepQuality", checked: targetStyle.steps !== undefined},
                        seed: {id: "#PBE_UpdatekeepSeed", checked: targetStyle.seed !== undefined},
                    };
    
                    for(const fieldId in checkStatus) {
                        const field = checkStatus[fieldId];
                        
                        const targetElement = checkBoxesWrapper.querySelector(field.id) as HTMLInputElement;
                        targetElement.checked = field.checked;
                        (updateStyleMeta as any)[fieldId] = field.checked;
                    }

                    const addTypeSelector = document.querySelector("#PBE_stylesWindow .PBE_addStyleTypeSelect") as HTMLSelectElement;
                    if(addTypeSelector) {
                        if(targetStyle.addType) {
                            updateStyleMeta.addType = targetStyle.addType;
                            addTypeSelector.value = targetStyle.addType;
                        } else addTypeSelector.value = AddStyleType.UniqueRoot;
                    }
    
                    if(state.config) state.config.updateStyleMeta = updateStyleMeta;
                }
    
                if(targetStyle?.name && nameInputField) {
                    nameInputField.value = targetStyle.name;
                }
    
            }
    
            target.classList.add("PBE_selectedCurrentElement");
        }
        
    }
    
    public static onApplyStyle(e: MouseEvent, isAfter?: boolean) {
        const target = e.currentTarget as HTMLElement;
        const {data} = Database;
        if(!data.styles) return;
        if(isAfter === undefined) isAfter = target.dataset.isafter ? true : false;
        
        let collectionId = undefined;
        let index = undefined;
    
        if(target.dataset.action) {
            const {selectedItem} = LoadStyle;
            collectionId = selectedItem.collection;
            index = selectedItem.index;
    
        } else {
            collectionId = target.dataset.id;
            index = Number(target.dataset.index);
        }
    
        if(!collectionId || Number.isNaN(index)) return;
    
        const targetCollection = data.styles[collectionId];
        if(!targetCollection) return;
    
        const targetStyle = data.styles[collectionId][index];
        if(!targetStyle) return;
    
        applyStyle(targetStyle, isAfter);
    }
    
    public static onOpenStyles() {
        const {state} = PromptsBrowser;
    
        state.showStylesWindow = true;
        LoadStyle.update();
    }
}

export default LoadStyleEvent;
