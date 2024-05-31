import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import CollectionTools from "client/CollectionTools/index";
import Prompt from "clientTypes/prompt";
import { makeElement, makeDiv } from "client/dom";
import showPromptItem from "client/showPromptItem";
import TagTooltip from "client/TagTooltip/index";
import { log } from "client/utils/index";
import KnownPromptsEvent from "./event";
import ActivePrompts from "client/ActivePrompts/index";

type UpdateOptions = {
    holdTagsInput?: boolean;
}

class KnownPrompts {

    public static init(promptContainer: HTMLElement, positivePrompts: HTMLElement, containerId: string) {
        const promptBrowser = document.createElement("div");
        promptBrowser.className = "PBE_promptsWrapper";

        const promptsCatalogue = document.createElement("div");
        promptsCatalogue.className = "PBE_promptsCatalogue";
        
        promptBrowser.appendChild(promptsCatalogue);

        PromptsBrowser.DOMCache.containers[containerId].promptBrowser = promptBrowser;
        PromptsBrowser.DOMCache.containers[containerId].promptsCatalogue = promptsCatalogue;

        promptContainer.insertBefore(promptBrowser, positivePrompts);
    }

    public static checkFilter(prompt: Prompt) {
        const {state} = PromptsBrowser;
    
        if(state.filterCategory) {
            if(state.filterCategory === "__none") {
                if(prompt.category !== undefined && prompt.category.length) return false;
    
            } else {
                if(!prompt.category) return false;
                if(!prompt.category.includes(state.filterCategory)) return false;
            }
        }
    
        if(state.filterCollection) {
            if(!prompt.collections) return false;
            if(!prompt.collections.includes(state.filterCollection)) return false;
        }
    
        if(state.filterName) {
            if(!prompt.id.toLowerCase().includes(state.filterName)) return false;
        }
    
        if(state.filterTags && Array.isArray(state.filterTags)) {
            if(!prompt.tags) return false;
            let out = true;
            const TAG_MODE = "includeAll";
    
            if(TAG_MODE === "includeAll") {
                out = false;
    
                for(const filterTag of state.filterTags) {
                    let fulfil = false;
    
                    for(const promptTag of prompt.tags) {
                        if(promptTag === filterTag) {
                            fulfil = true;
                            break;
                        }
                    }
    
                    if(!fulfil) {
                        out = true;
                        break;
                    }
                }
    
            } else {
                for(const filterTag of state.filterTags) {
                    for(const promptTag of prompt.tags) {
                        if(promptTag.includes(filterTag)) {
                            out = false;
                            break;
                        }
                    }
                }
            }
            
            if(out) return false;
        }
    
        return true;
    }

    private static showHeader = (wrapper: HTMLElement, params: UpdateOptions = {}) => {
        const {readonly} = Database.meta;
        const {holdTagsInput = false} = params;
        const {state} = PromptsBrowser;
    
        const headerContainer = document.createElement("div");
        const categorySelector = document.createElement("select");
        const collectionSelector = document.createElement("select");
        const sortingSelector = document.createElement("select");
        const tagsInput = document.createElement("input");
        const nameInput = document.createElement("input");
        tagsInput.placeholder = "tag1, tag2, tag3...";
        nameInput.placeholder = "by name";
        const collectionToolsButton = document.createElement("button");
        collectionToolsButton.className = "PBE_button";
        collectionToolsButton.innerText = "Edit collection";
        collectionToolsButton.style.marginRight = "10px";
    
        categorySelector.className = "PBE_generalInput";
        collectionSelector.className = "PBE_generalInput";
        sortingSelector.className = "PBE_generalInput";
        tagsInput.className = "PBE_generalInput";
        nameInput.className = "PBE_generalInput";
    
        headerContainer.className = "PBE_promptsCatalogueHeader";
    
        //categories selector
        const categories = Database.data.categories;
        let options = `
            <option value="">All categories</option>
            <option value="__none">Uncategorised</option>
        `;
    
        for(const categoryItem of categories) {
            if(!categorySelector.value) categorySelector.value = categoryItem;
            options += `<option value="${categoryItem}">${categoryItem}</option>`;
        }
        categorySelector.innerHTML = options;
    
        if(state.filterCategory) categorySelector.value = state.filterCategory;
    
        categorySelector.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLSelectElement;
            const value = target.value;
            state.filterCategory = value || undefined;
    
            KnownPrompts.update();
        });
    
        //collection selector
        options = `<option value="">All collections</option>`;
    
        for(const collectionId in Database.data.original) {
            options += `<option value="${collectionId}">${collectionId}</option>`;
        }
        collectionSelector.innerHTML = options;
    
        if(state.filterCollection) collectionSelector.value = state.filterCollection;
    
        collectionSelector.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLSelectElement;
            const value = target.value;
            state.filterCollection = value || undefined;
    
            state.filesIteration++;
            KnownPrompts.update();
            CurrentPrompts.update(true);
        });
    
        //sorting selector
        options = `
            <option value="">Unsorted</option>
            <option value="reversed">Unsorted reversed</option>
            <option value="alph">Alphabetical</option>
            <option value="alphReversed">Alphabetical reversed</option>
        `;
        sortingSelector.innerHTML = options;
    
        if(state.sortKnownPrompts) sortingSelector.value = state.sortKnownPrompts;
    
        sortingSelector.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLSelectElement;
            const value = target.value;
            state.sortKnownPrompts = value || undefined;
    
            KnownPrompts.update();
        });
    
        //tags input
        if(state.filterTags) tagsInput.value = state.filterTags.join(", ");
    
        tagsInput.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLInputElement;
            const value = target.value;
            if(target.dataset.hint) return;
    
            let tags = value.split(",").map(item => item.trim());
            
            //removing empty tags
            tags = tags.filter(item => item);
    
            if(!tags) state.filterTags = undefined;
            else state.filterTags = tags;
    
            if(state.filterTags && !state.filterTags.length) state.filterTags = undefined;
            if(state.filterTags && state.filterTags.length === 1 && !state.filterTags[0]) state.filterTags = undefined;
    
            KnownPrompts.update({holdTagsInput: true});
        });
    
        //search input
        if(state.filterName) nameInput.value = state.filterName;
    
        nameInput.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLInputElement;
            let value = target.value || "";
            value = value.trim();
    
            if(value) {
                value = value.toLowerCase();
                state.filterName = value;
            } else {
                state.filterName = undefined;
            }
            
            KnownPrompts.update();
        });
    
        if(!readonly) {
            collectionToolsButton.addEventListener("click", (e) => {
                if(state.filterCollection) state.collectionToolsId = state.filterCollection;
                CollectionTools.update();
            });
        
            headerContainer.appendChild(collectionToolsButton);
        }
        
        headerContainer.appendChild(collectionSelector);
        headerContainer.appendChild(categorySelector);
        headerContainer.appendChild(tagsInput);
        headerContainer.appendChild(nameInput);
        headerContainer.appendChild(sortingSelector);
    
        wrapper.appendChild(headerContainer);
    
        TagTooltip.add(tagsInput);
    
        if(holdTagsInput) tagsInput.focus();
    }

    public static update(params?: UpdateOptions) {
        const {data} = Database;
        const {readonly} = Database.meta;
        const {united} = data;
        const {state} = PromptsBrowser;
        const {cardWidth = 50, cardHeight = 100, showPromptIndex = false, rowsInKnownCards = 3, maxCardsShown = 1000} = state.config;
        const wrapper = PromptsBrowser.DOMCache.containers[state.currentContainer].promptsCatalogue;
        const usedPrompts = ActivePrompts.getUniqueIds();
        let scrollState = 0;
        let shownItems = 0;
    
        if(wrapper) {
            let prevPromptContainer = wrapper.querySelector(".PBE_promptsCatalogueContent");
            if(prevPromptContainer) {
                scrollState = prevPromptContainer.scrollTop;
                prevPromptContainer = undefined;
            }
        }
    
        wrapper.innerHTML = "";
    
        if(!united) {
            log("No prompt data to show");
            return;
        }
    
        KnownPrompts.showHeader(wrapper, params);
    
        const proptsContainer = document.createElement("div");
        proptsContainer.className = "PBE_promptsCatalogueContent PBE_Scrollbar";
        proptsContainer.style.maxHeight = `${cardHeight * rowsInKnownCards}px`;
    
        let dataArr = [];
    
        if(state.filterCollection) {
            const targetCategory = data.original[state.filterCollection];
            if(targetCategory) {
                for(const id in targetCategory) {
                    const targetOriginalItem = targetCategory[id];
                    const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
                    if(targetMixedItem) dataArr.push({...targetMixedItem});
                }
            }
    
        } else {
            for(const id in united) dataArr.push({...united[id]});
        }
        
        if(state.sortKnownPrompts === "alph" || state.sortKnownPrompts === "alphReversed") {
            dataArr.sort( (A, B) => {
                if(state.sortKnownPrompts === "alph") {
                    if(A.id > B.id) return 1;
                    if(A.id < B.id) return -1;
    
                } else {
                    if(A.id > B.id) return -1;
                    if(A.id < B.id) return 1;
                }
    
                return 0;
            });
        } else if(state.sortKnownPrompts === "reversed") {
            dataArr.reverse()
        }
    
        //show Add Random card
        if(dataArr.length) {
    
            const addRandom = makeDiv({
                className: "PBE_promptElement PBE_promptElement_random",
                content: "Add random"
            });
    
            addRandom.addEventListener("click", KnownPromptsEvent.onAddRandom);
            addRandom.style.width = `${cardWidth}px`;
            addRandom.style.height = `${cardHeight}px`;
    
            proptsContainer.appendChild(addRandom);
        }
    
        for(const index in dataArr) {
            const prompt = dataArr[index];
            if(shownItems > maxCardsShown) break;
    
            if(!KnownPrompts.checkFilter(prompt)) continue;
            //const isShadowed = usedPrompts.includes(prompt.id);
            const promptElement = showPromptItem({prompt, options: {isShadowed: false}});
    
            if(showPromptIndex && state.filterCollection) {

                promptElement.appendChild(makeDiv({
                    className: "PBE_promptElementIndex",
                    content: index,
                }));

                /* splashElement.appendChild(makeElement({
                    element: "div",
                    className: "PBE_promptElementIndex",
                    content: index,
                })); */
            }
    
            if(!readonly) {
                promptElement.addEventListener("dragstart", KnownPromptsEvent.onDragStart);
                promptElement.addEventListener("dragover", KnownPromptsEvent.onDragOver);
                promptElement.addEventListener("dragenter", KnownPromptsEvent.onDragEnter);
                promptElement.addEventListener("dragleave", KnownPromptsEvent.onDragLeave);
                promptElement.addEventListener("drop", KnownPromptsEvent.onDrop);
            }
    
            promptElement.addEventListener("click", KnownPromptsEvent.onPromptClick);
    
            proptsContainer.appendChild(promptElement);
            shownItems++;
        }
    
        wrapper.appendChild(proptsContainer);
    
        proptsContainer.scrollTo(0, scrollState);
    }
}

export default KnownPrompts;
