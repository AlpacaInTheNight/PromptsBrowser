import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import Style from "clientTypes/style";
import { makeElement, makeCheckbox } from "client/dom";
import showPromptItem from "client/showPromptItem";
import applyStyle from "client/applyStyle";
import { EMPTY_CARD_GRADIENT } from "client/const";
import { Config, ConfigTrackStyleMeta } from "clientTypes/state";

class LoadStyle {

    public static selectedItem = {
        collection: "",
        styleId: "",
        index: 0,
    }
    
    public static init(mainWrapper: HTMLElement) {
        const stylesWindow = document.createElement("div");
    
        stylesWindow.className = "PBE_generalWindow PBE_stylesWindow";
        stylesWindow.id = "PBE_stylesWindow";
    
        PromptsBrowser.DOMCache.stylesWindow = stylesWindow;
        mainWrapper.appendChild(stylesWindow);
        PromptsBrowser.onCloseActiveWindow = LoadStyle.onCloseWindow;
    
        stylesWindow.addEventListener("click", () => {
            PromptsBrowser.onCloseActiveWindow = LoadStyle.onCloseWindow;
        });
    }
    
    public static initButton(positiveWrapper: HTMLElement) {
        const addStylesButton = document.createElement("button");
    
        addStylesButton.className = "PBE_actionButton PBE_stylesButton";
        addStylesButton.innerText = "Styles";
    
        addStylesButton.addEventListener("click", LoadStyle.onOpenStyles);
    
        positiveWrapper.appendChild(addStylesButton);
    }

    private static onCloseWindow() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.stylesWindow;
        if(!wrapper || !state.showStylesWindow) return;
    
        state.showStylesWindow = undefined;
        wrapper.style.display = "none";
    }
    
    private static onCardClick(e: MouseEvent) {
        const isShift = e.shiftKey;
        const isCtrl = e.metaKey || e.ctrlKey;
    
        if(isShift) LoadStyle.applyStyle(e, false);
        else if(isCtrl) LoadStyle.removeStyle(e);
        else LoadStyle.onSelectStyle(e);
    }
    
    private static onChangeFilterCollection(e: Event) {
        const target = e.currentTarget as HTMLSelectElement;
        const {state} = PromptsBrowser;
        const value = target.value;
    
        state.filterStyleCollection = value;
        LoadStyle.update();
    }
    
    private static onChangeFilterName(e: Event) {
        const target = e.currentTarget as HTMLInputElement;
        const {state} = PromptsBrowser;
        const value = target.value;
    
        state.filterStyleName = value.toLowerCase();
        LoadStyle.update();
    }
    
    private static onToggleShortMode(e: MouseEvent) {
        const {state} = PromptsBrowser;
        const id = "styles_simplified_view";
    
        if(state.toggledButtons.includes(id)) {
            state.toggledButtons = state.toggledButtons.filter(item => item !== id);
        } else {
            state.toggledButtons.push(id);
        }
        
        LoadStyle.update();
    }
    
    private static onChangeSaveMeta(e: Event) {
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
    
    private static onChangeUpdateMeta(e: Event) {
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
    
    public static showMetaCheckboxes(wrapper: HTMLElement, isUpdate = false) {
        const {state} = PromptsBrowser;
        const {saveStyleMeta = {} as ConfigTrackStyleMeta, updateStyleMeta = {} as ConfigTrackStyleMeta} = state.config || {};
        const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;
    
        const paramsRow = makeElement<HTMLFieldSetElement>({element: "fieldset", className: "PBE_fieldset PBE_styleMetaCheckboxes"});
        const paramsRowLegend = makeElement<HTMLLegendElement>({element: "legend", content: "Save meta:"});
    
        const onChange = isUpdate ? LoadStyle.onChangeUpdateMeta : LoadStyle.onChangeSaveMeta;
        const prefix = isUpdate ? "Update" : "Save";
    
        const keepSeed =
            makeCheckbox({onChange, checked: targetMeta.seed, name: "Seed", id: `PBE_${prefix}keepSeed`, data: "seed"});
    
        const keepPositive =
            makeCheckbox({onChange, checked: targetMeta.positive, name: "Positive", id: `PBE_${prefix}keepPositive`, data: "positive"});
    
        const keepNegative =
            makeCheckbox({onChange, checked: targetMeta.negative, name: "Negative", id: `PBE_${prefix}keepNegative`, data: "negative"});
    
        const keepSize =
            makeCheckbox({onChange, checked: targetMeta.size, name: "Size", id: `PBE_${prefix}keepSize`, data: "size"});
    
        const keepSampler =
            makeCheckbox({onChange, checked: targetMeta.sampler, name: "Sampler", id: `PBE_${prefix}keepSampler`, data: "sampler"});
    
        const keepQuality =
            makeCheckbox({onChange, checked: targetMeta.quality, name: "Quality", id: `PBE_${prefix}keepQuality`, data: "quality"});
    
        paramsRow.appendChild(paramsRowLegend);
        paramsRow.appendChild(keepPositive);
        paramsRow.appendChild(keepNegative);
        paramsRow.appendChild(keepSize);
        paramsRow.appendChild(keepSampler);
        paramsRow.appendChild(keepQuality);
        paramsRow.appendChild(keepSeed);
    
        wrapper.appendChild(paramsRow);
    }
    
    public static grabCurrentStyle(styleName: string, collectionId: string, isUpdate = false) {
        const {data} = Database;
        const {state} = PromptsBrowser;
        const {saveStyleMeta = {} as ConfigTrackStyleMeta, updateStyleMeta = {} as ConfigTrackStyleMeta} = state.config || {};
        const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;
    
        if(!collectionId) return false;
        if(!data.styles) return false;
    
        let seed = undefined;
        let negative = undefined;
        let width = undefined;
        let height = undefined;
        let steps = undefined;
        let cfg = undefined;
        let sampling = undefined;
    
        const activePrompts = PromptsBrowser.getCurrentPrompts();
        const seedInput = PromptsBrowser.DOMCache.containers[state.currentContainer].seedInput;
        const negativePrompts = PromptsBrowser.DOMCache.containers[state.currentContainer].negativePrompts;
    
        const widthInput = PromptsBrowser.DOMCache.containers[state.currentContainer].widthInput;
        const heightInput = PromptsBrowser.DOMCache.containers[state.currentContainer].heightInput;
        const stepsInput = PromptsBrowser.DOMCache.containers[state.currentContainer].stepsInput;
        const cfgInput = PromptsBrowser.DOMCache.containers[state.currentContainer].cfgInput;
        const samplingInput = PromptsBrowser.DOMCache.containers[state.currentContainer].samplingInput;
    
        if(seedInput) {
            const seedValue = Number(seedInput.value);
            if(seedValue !== undefined && seedValue !== -1 && !Number.isNaN(seedValue)) seed = seedValue;
        }
    
        if(negativePrompts) {
            const negativeTextAreas = negativePrompts.getElementsByTagName("textarea");
            if(negativeTextAreas && negativeTextAreas[0]) negative = negativeTextAreas[0].value;
        }
    
        if(widthInput) width = Number(widthInput.value);
        if(heightInput) height = Number(heightInput.value);
        if(stepsInput) steps = Number(stepsInput.value);
        if(cfgInput) cfg = Number(cfgInput.value);
        if(samplingInput) sampling = samplingInput.value;
    
        if(Number.isNaN(width)) width = undefined;
        if(Number.isNaN(height)) height = undefined;
        if(Number.isNaN(steps)) steps = undefined;
        if(Number.isNaN(cfg)) cfg = undefined;
    
        const targetCollection = data.styles[collectionId];
        if(!targetCollection) return;

        const newStyle: Partial<Style> = {};
        
        if(styleName) newStyle.name = styleName;
    
        //positive prompts. added as array of prompt objects
        if(targetMeta.positive) {
            if(activePrompts && activePrompts.length) newStyle.positive = JSON.parse(JSON.stringify(activePrompts));
            else newStyle.positive = [];
        }
    
        if(targetMeta.seed && seed !== undefined) newStyle.seed = seed;
    
        //negative prompts. currently added as a string, may be changed to array of prompts in future
        if(targetMeta.negative && negative !== undefined) newStyle.negative = negative;
        
        if(targetMeta.size && width !== undefined) newStyle.width = width;
        if(targetMeta.size && height !== undefined) newStyle.height = height;
        
        if(targetMeta.quality && steps !== undefined) newStyle.steps = steps;
        if(targetMeta.quality && cfg !== undefined) newStyle.cfg = cfg;
        
        if(targetMeta.sampler && sampling) newStyle.sampling = sampling;
    
        return newStyle;
    }
    
    private static removeStyle(e: MouseEvent) {
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
    
    private static onRenameStyle(e: MouseEvent) {
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
    
    private static updateStyle(e: MouseEvent) {
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
    
    private static onSelectStyle(e: MouseEvent) {
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
    
                    if(state.config) state.config.updateStyleMeta = updateStyleMeta;
                }
    
                if(targetStyle?.name && nameInputField) {
                    nameInputField.value = targetStyle.name;
                }
    
            }
    
            target.classList.add("PBE_selectedCurrentElement");
        }
        
    }
    
    private static applyStyle(e: MouseEvent, isAfter?: boolean) {
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
    
    private static onOpenStyles() {
        const {state} = PromptsBrowser;
    
        state.showStylesWindow = true;
        LoadStyle.update();
    }
    
    private static showFilters(wrapper: HTMLElement) {
        const {data} = Database;
        const {state} = PromptsBrowser;
    
        const toggleShortMode = document.createElement("div");
        toggleShortMode.className = "PBE_toggleButton";
        toggleShortMode.innerText = "Simple mode";
        toggleShortMode.title = "Toggles simplified view mode";
        if(state.toggledButtons.includes("styles_simplified_view")) toggleShortMode.classList.add("PBE_toggledButton");
        toggleShortMode.style.height = "16px";
    
        toggleShortMode.addEventListener("click", LoadStyle.onToggleShortMode);
    
        const collectionSelect = document.createElement("select");
        collectionSelect.className = "PBE_generalInput PBE_select";
        let options = "<option value=''>Any</option>";
        for(const collectionId in data.styles) {
            options += `<option value="${collectionId}">${collectionId}</option>`;
        }
    
        collectionSelect.innerHTML = options;
        collectionSelect.value = state.filterStyleCollection || "";
    
        collectionSelect.addEventListener("change", LoadStyle.onChangeFilterCollection);
    
        const nameFilter = document.createElement("input");
        nameFilter.placeholder = "Search name";
        nameFilter.className = "PBE_generalInput PBE_input";
        nameFilter.value = state.filterStyleName || "";
    
        nameFilter.addEventListener("change", LoadStyle.onChangeFilterName);
    
        wrapper.appendChild(toggleShortMode);
        wrapper.appendChild(collectionSelect);
        wrapper.appendChild(nameFilter);
    }
    
    private static showStylesShort(wrapper: HTMLElement) {
        const {data} = Database;
        const {filterStyleCollection, filterStyleName} = PromptsBrowser.state;
    
        let styles = [];
    
        for(const collectionId in data.styles) {
    
            for(let i = 0; i < data.styles[collectionId].length; i++) {
                const styleItem = data.styles[collectionId][i];
    
                styles.push({...styleItem, id: collectionId, index: i});
            }
        }
        
        styles.sort( (A, B) => {
            if(A.name > B.name) return 1;
            if(A.name < B.name) return -1;
    
            return 0;
        });
    
        for(const style of styles) {
            const {name, positive, negative, width, height, steps, cfg, sampling, id, index, previewImage} = style;
            if(!name) continue;
            if(filterStyleCollection && filterStyleCollection !== id) continue;
            if(filterStyleName && !name.toLowerCase().includes(filterStyleName)) continue;
            let url = EMPTY_CARD_GRADIENT;
            if(previewImage) url = Database.getStylePreviewURL(style);
    
            const element = showPromptItem({
                prompt: {id: name},
                options: {url},
            });
            element.dataset.id = id;
            element.dataset.index = index + "";
            element.dataset.name = name;
    
            if(LoadStyle.selectedItem.collection === id && LoadStyle.selectedItem.index === index) {
                element.classList.add("PBE_selectedCurrentElement");
            }
    
            element.addEventListener("click", LoadStyle.onCardClick);
    
            wrapper.appendChild(element);
        }
    }
    
    private static showActions(wrapper: HTMLElement, isShort = true) {
        const {readonly} = Database.meta;
    
        const nameContainer = makeElement<HTMLFieldSetElement>({element: "fieldset", className: "PBE_fieldset"});
        const nameLegend = makeElement<HTMLLegendElement>({element: "legend", content: "Name"});
        const nameField = makeElement<HTMLInputElement>({element: "input", className: "PBE_generalInput PBE_input PBE_nameAction"});
        nameField.placeholder = "Style name";
        const renameButton = makeElement<HTMLDivElement>({element: "div", className: "PBE_button", content: "Rename", title: "Rename selected style"});
        renameButton.dataset.action = "true";
        renameButton.addEventListener("click", LoadStyle.onRenameStyle);
    
        nameContainer.appendChild(nameLegend);
        nameContainer.appendChild(nameField);
        nameContainer.appendChild(renameButton);
    
        if(!isShort) {
            if(!readonly) {
                wrapper.appendChild(nameContainer);
                LoadStyle.showMetaCheckboxes(wrapper, true);
            }
    
            return;
        }
    
        const actionContainer = document.createElement("fieldset");
        actionContainer.className = "PBE_fieldset";
        const actionLegend = document.createElement("legend");
        actionLegend.innerText = "Actions";
    
        const addBeforeButton = document.createElement("div");
        addBeforeButton.innerText = "Add before";
        addBeforeButton.className = "PBE_button";
        addBeforeButton.title = "Add style prompts at the start of current prompts";
        addBeforeButton.dataset.action = "true";
        addBeforeButton.addEventListener("click", LoadStyle.applyStyle);
    
        const addAfterButton = document.createElement("div");
        addAfterButton.innerText = "Add after";
        addAfterButton.className = "PBE_button";
        addAfterButton.title = "Add style prompts at the end of current prompts";
        addAfterButton.dataset.action = "true";
        addAfterButton.dataset.isafter = "true";
        addAfterButton.addEventListener("click", LoadStyle.applyStyle);
    
        actionContainer.appendChild(actionLegend);
        actionContainer.appendChild(addBeforeButton);
        actionContainer.appendChild(addAfterButton);
    
        const editContainer = document.createElement("fieldset");
        editContainer.className = "PBE_fieldset";
        const editLegend = document.createElement("legend");
        editLegend.innerText = "Edit";
    
        const updateButton = document.createElement("div");
        updateButton.innerText = "Update";
        updateButton.className = "PBE_button";
        updateButton.title = "Update selected style";
        updateButton.dataset.action = "true";
        updateButton.addEventListener("click", LoadStyle.updateStyle);
    
        const updatePreviewButton = document.createElement("div");
        updatePreviewButton.innerText = "Update preview";
        updatePreviewButton.className = "PBE_button";
        updatePreviewButton.title = "Delete selected style";
        updatePreviewButton.dataset.action = "true";
        updatePreviewButton.addEventListener("click", Database.onUpdateStylePreview);
        
        editContainer.appendChild(editLegend);
        editContainer.appendChild(updateButton);
        editContainer.appendChild(updatePreviewButton);
    
        const systemContainer = document.createElement("fieldset");
        systemContainer.className = "PBE_fieldset";
        const systemLegend = document.createElement("legend");
        systemLegend.innerText = "System";
    
        const deleteButton = document.createElement("div");
        deleteButton.innerText = "Delete";
        deleteButton.className = "PBE_button PBE_buttonCancel";
        deleteButton.title = "Delete selected style";
        deleteButton.dataset.action = "true";
        deleteButton.addEventListener("click", LoadStyle.removeStyle);
    
        systemContainer.appendChild(systemLegend);
        systemContainer.appendChild(deleteButton);
    
        wrapper.appendChild(actionContainer);
    
        if(!readonly) {
            wrapper.appendChild(editContainer);
            wrapper.appendChild(nameContainer);
            LoadStyle.showMetaCheckboxes(wrapper, true);
            wrapper.appendChild(systemContainer);
        }
    }
    
    private static showStyles(wrapper: HTMLElement) {
        const {readonly} = Database.meta;
        const {data} = Database;
        const {state} = PromptsBrowser;
        const {filterStyleCollection, filterStyleName} = state;
        const activePrompts = PromptsBrowser.getCurrentPrompts();
    
        let styles = [];
    
        for(const collectionId in data.styles) {
    
            for(let i = 0; i < data.styles[collectionId].length; i++) {
                const styleItem = data.styles[collectionId][i];
    
                styles.push({...styleItem, id: collectionId, index: i});
            }
        }
        
        styles.sort( (A, B) => {
            if(A.name > B.name) return 1;
            if(A.name < B.name) return -1;
    
            return 0;
        });
    
        for(const style of styles) {
            const {name, positive, negative, width, height, steps, cfg, sampling, id, index, previewImage} = style;
    
            if(filterStyleCollection && filterStyleCollection !== id) continue;
            if(filterStyleName && !name.toLowerCase().includes(filterStyleName)) continue;
    
            const stylesItem = document.createElement("div");
            const styleHeader = document.createElement("div");
            const nameContainer = document.createElement("div");
            const contentContainer = document.createElement("div");
            const metaInfoContainer = document.createElement("div");
            const updatePreview = document.createElement("div");
    
            const currentPromptsContainer = document.createElement("div");
            const actionsContainer = document.createElement("div");
    
            stylesItem.className = "PBE_styleItem";
            styleHeader.className = "PBE_styleHeader";
            nameContainer.className = "PBE_styleItemName";
            contentContainer.className = "PBE_styleItemContent";
            metaInfoContainer.className = "PBE_styleItemMetaInfo";
            currentPromptsContainer.className = "PBE_stylesCurrentList PBE_Scrollbar";
            actionsContainer.className = "PBE_stylesAction";
            updatePreview.className = "PBE_button";
    
            if(previewImage) {
                const url = Database.getStylePreviewURL(style);
                stylesItem.style.backgroundImage = url;
            }
    
            nameContainer.innerText = name;
            updatePreview.innerText = "Update preview";
    
            updatePreview.dataset.id = name;
            updatePreview.dataset.collection = id;
    
            if(positive) for(const stylePrompt of positive) {
                const {id, weight, isExternalNetwork} = stylePrompt;
                const promptElement = showPromptItem({
                    prompt: {id, weight, isExternalNetwork},
                    options: {},
                });
                currentPromptsContainer.appendChild(promptElement);
            }
    
            /* currentPromptsContainer.addEventListener("wheel", (e) => {
                if(!e.deltaY) return;
        
                e.currentTarget.scrollLeft += e.deltaY + e.deltaX;
                e.preventDefault();
            }); */
    
            const addBeforeButton = document.createElement("button");
            const addAfterButton = document.createElement("button");
            const removeButton = document.createElement("button");
            const updateButton = document.createElement("button");
            addBeforeButton.innerText = "Add before";
            addAfterButton.innerText = "Add after";
            removeButton.innerText = "Remove";
            updateButton.innerText = "Update";
    
            addBeforeButton.className = "PBE_button";
            addAfterButton.className = "PBE_button";
            removeButton.className = "PBE_button PBE_buttonCancel";
            updateButton.className = "PBE_button";
    
            addAfterButton.dataset.isafter = "true";
    
            stylesItem.dataset.name = name;
            stylesItem.dataset.id = id;
            addAfterButton.dataset.id = id;
            addBeforeButton.dataset.id = id;
            removeButton.dataset.id = id;
            updateButton.dataset.id = id;
    
            stylesItem.dataset.index = index + "";
            addAfterButton.dataset.index = index + "";
            addBeforeButton.dataset.index = index + "";
            removeButton.dataset.index = index + "";
            updateButton.dataset.index = index + "";
    
            addBeforeButton.addEventListener("click", LoadStyle.applyStyle);
            addAfterButton.addEventListener("click", LoadStyle.applyStyle);
            removeButton.addEventListener("click", LoadStyle.removeStyle);
            updateButton.addEventListener("click", LoadStyle.updateStyle);
            updatePreview.addEventListener("click", Database.onUpdateStylePreview);
    
            actionsContainer.appendChild(addBeforeButton);
            if(activePrompts && activePrompts.length) actionsContainer.appendChild(addAfterButton);
    
            if(!readonly) {
                actionsContainer.appendChild(removeButton);
                if(activePrompts && activePrompts.length) actionsContainer.appendChild(updateButton);
            }
    
            contentContainer.appendChild(currentPromptsContainer);
            contentContainer.appendChild(actionsContainer);
    
            styleHeader.appendChild(nameContainer);
            if(!readonly) styleHeader.appendChild(updatePreview);
    
            let metaInfo = [];//steps, cfg, sampling
            if(negative) metaInfo.push(`<span class="PBE_styleMetaField">Negative:</span> "${negative}"`);
    
            if(width) metaInfo.push(`<span class="PBE_styleMetaField">Width:</span> ${width}`);
            if(height) metaInfo.push(`<span class="PBE_styleMetaField">Height:</span> ${height}`);
    
            if(sampling) metaInfo.push(`<span class="PBE_styleMetaField">Sampling:</span> ${sampling}`);
            if(steps) metaInfo.push(`<span class="PBE_styleMetaField">Steps:</span> ${steps}`);
            if(cfg) metaInfo.push(`<span class="PBE_styleMetaField">CFG:</span> ${cfg}`);
    
            metaInfoContainer.innerHTML = metaInfo.join("; ");
    
            stylesItem.appendChild(styleHeader);
            stylesItem.appendChild(contentContainer);
            stylesItem.appendChild(metaInfoContainer);
    
            stylesItem.addEventListener("click", LoadStyle.onSelectStyle);
    
            wrapper.appendChild(stylesItem);
        }
    
    }
    
    public static update() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.stylesWindow;
        if(!wrapper || !state.showStylesWindow) return;
        PromptsBrowser.onCloseActiveWindow = LoadStyle.onCloseWindow;
        wrapper.innerHTML = "";
        wrapper.style.display = "flex";
        const isShort = state.toggledButtons.includes("styles_simplified_view");
    
        const possibleStylesBlock = document.createElement("div");
    
        const footerBlock = document.createElement("div");
        const closeButton = document.createElement("button");
        footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide";
        closeButton.innerText = "Close";
        closeButton.className = "PBE_button";
    
        if(isShort) {
            possibleStylesBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
            LoadStyle.showStylesShort(possibleStylesBlock);
    
        } else {
            possibleStylesBlock.className = "PBE_dataColumn PBE_Scrollbar PBE_windowContent";
            LoadStyle.showStyles(possibleStylesBlock);
        }
    
        closeButton.addEventListener("click", LoadStyle.onCloseWindow);
    
        footerBlock.appendChild(closeButton);
    
        const filterBlock = document.createElement("div");
        filterBlock.className = "PBE_row PBE_stylesFilter";
        LoadStyle.showFilters(filterBlock);
    
        wrapper.appendChild(filterBlock);
        wrapper.appendChild(possibleStylesBlock);
    
        const actionsBlock = document.createElement("div");
        actionsBlock.className = "PBE_collectionToolsActions PBE_row";
        LoadStyle.showActions(actionsBlock, isShort);
        wrapper.appendChild(actionsBlock);
    
        wrapper.appendChild(footerBlock);
    };
    
}

export default LoadStyle;
