import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Prompt from "clientTypes/prompt";
import Database from "client/Database/index";
import { makeElement } from "client/dom";
import showPromptItem from "client/showPromptItem";
import { replaceAllRegex } from "client/utils/index";
import PromptsSimpleFilter from "client/PromptsFilter/simple";
import PromptToolsEvent from "./event";

class PromptTools {
    
    private static currentFilters = {
        collection: "",
        category: "",
        tags: [] as string[],
        name: "",

        sorting: "__none",
        sortingOptions: [
            {id: "__none", name: "Unsorted"},
            {id: "weight", name: "By weight"},
            {id: "alph", name: "Alphabetical"},
            {id: "alphReversed", name: "Alphabetical reversed"},
        ]
    }

    private static possibleFilters = {
        collection: "",
        category: "",
        tags: [] as string[],
        name: "",

        sorting: "sim",
        sortingOptions: [
            {id: "__none", name: "Unsorted"},
            {id: "sim", name: "By similarity"},
            {id: "alph", name: "Alphabetical"},
            {id: "alphReversed", name: "Alphabetical reversed"},
        ]
    }

    public static init(wrapper: HTMLElement) {
        const promptTools = document.createElement("div");
        promptTools.className = "PBE_generalWindow PBE_promptTools";
        promptTools.id = "PBE_promptTools";

        PromptsBrowser.DOMCache.promptTools = promptTools;

        wrapper.appendChild(promptTools);

        PromptsBrowser.onCloseActiveWindow = PromptToolsEvent.onCloseWindow;

        promptTools.addEventListener("click", () => {
            PromptsBrowser.onCloseActiveWindow = PromptToolsEvent.onCloseWindow;
        });
    }

    private static showCurrentPrompts(wrapper: HTMLElement) {
        const {data} = Database;
        const {state} = PromptsBrowser;
        const {currentFilters} = PromptTools;
        const {checkFilter} = PromptsSimpleFilter;
        const {sorting} = currentFilters;
        const {unitedList} = data;
        const activePrompts = [...ActivePrompts.getCurrentPrompts()];
        if(!state.promptToolsId) return;

        const setupContainer = makeElement<HTMLElement>({element: "div", className: "PBE_List PBE_toolsSetup"});
        const currentPromptsContainer = makeElement<HTMLElement>({element: "div", className: "PBE_windowCurrentList PBE_Scrollbar"});
        
        //setup fieldset
        const setupField = makeElement<HTMLElement>({element: "fieldset", className: "PBE_fieldset"});
        const setupLegend = makeElement<HTMLElement>({element: "legend", content: "Setup"});

        const showAll = makeElement<HTMLElement>({element: "div", content: "Show All", className: "PBE_toggleButton"});
        const replaceMode = makeElement<HTMLElement>({element: "div", content: "Replace mode", className: "PBE_toggleButton"});
        showAll.dataset.id = "tools_showAll";
        replaceMode.dataset.id = "tools_replaceMode";

        if(state.toggledButtons.includes("tools_showAll")) showAll.classList.add("PBE_toggledButton");
        if(state.toggledButtons.includes("tools_replaceMode")) replaceMode.classList.add("PBE_toggledButton");
        showAll.addEventListener("click", PromptToolsEvent.onToggleButton);
        replaceMode.addEventListener("click", PromptToolsEvent.onToggleButton);

        setupField.appendChild(setupLegend);
        setupField.appendChild(showAll);
        setupField.appendChild(replaceMode);

        //similarity fieldset
        const simField = makeElement<HTMLElement>({element: "fieldset", className: "PBE_fieldset"});
        const simLegend = makeElement<HTMLElement>({element: "legend", content: "Similarity by:"});

        const showTags = makeElement<HTMLElement>({element: "div", content: "Tags", className: "PBE_toggleButton"});
        const showCategory = makeElement<HTMLElement>({element: "div", content: "Category", className: "PBE_toggleButton"});
        const showName = makeElement<HTMLElement>({element: "div", content: "Name", className: "PBE_toggleButton"});

        simField.appendChild(simLegend);
        simField.appendChild(showTags);
        simField.appendChild(showCategory);
        simField.appendChild(showName);

        showTags.dataset.id = "tools_tags";
        showCategory.dataset.id = "tools_category";
        showName.dataset.id = "tools_name";

        if(state.toggledButtons.includes("tools_tags")) showTags.classList.add("PBE_toggledButton");
        if(state.toggledButtons.includes("tools_category")) showCategory.classList.add("PBE_toggledButton");
        if(state.toggledButtons.includes("tools_name")) showName.classList.add("PBE_toggledButton");
        

        showTags.addEventListener("click", PromptToolsEvent.onToggleButton);
        showCategory.addEventListener("click", PromptToolsEvent.onToggleButton);
        showName.addEventListener("click", PromptToolsEvent.onToggleButton);

        switch(sorting) {

            case "alph":
                //sorting prompts alphabetically
                activePrompts.sort( (A, B) => {
                    if(A.id.toLowerCase() < B.id.toLowerCase()) return -1;
                    if(A.id.toLowerCase() > B.id.toLowerCase()) return 1;

                    return 0;
                });
                break;

            case "alphReversed":
                //sorting prompts alphabetically in reverse orderd
                activePrompts.sort( (A, B) => {
                    if(A.id.toLowerCase() < B.id.toLowerCase()) return 1;
                    if(A.id.toLowerCase() > B.id.toLowerCase()) return -1;

                    return 0;
                });
                break;

            case "weight":
                //sorting prompts based on their weight
                activePrompts.sort( (A, B) => {
                    if(A.weight < B.weight) return 1;
                    if(A.weight > B.weight) return -1;

                    return 0;
                });
        }

        for(const i in activePrompts) {
            const currPrompt = activePrompts[i];
            if(!currPrompt || currPrompt.isSyntax) continue;
            if(unitedList[currPrompt.id] && !checkFilter(currPrompt.id, currentFilters)) continue;
            const isShadowed = currPrompt.id !== state.promptToolsId;

            const promptElement = showPromptItem({
                prompt: {id: currPrompt.id, isExternalNetwork: currPrompt.isExternalNetwork},
                options: {isShadowed},
            });
            
            promptElement.addEventListener("click", PromptToolsEvent.onElementClick);
            currentPromptsContainer.appendChild(promptElement);
        }

        currentPromptsContainer.addEventListener("wheel", (e) => {
            const target = e.currentTarget as HTMLElement;
            if(!e.deltaY) return;

            target.scrollLeft += e.deltaY + e.deltaX;
            e.preventDefault();
        })

        setupContainer.appendChild(setupField);
        setupContainer.appendChild(simField);

        wrapper.appendChild(currentPromptsContainer);
        wrapper.appendChild(setupContainer);
    }

    private static showPossiblePromptswrapper(wrapper: HTMLElement) {
        const {data} = Database;
        const {united} = data;
        const {state} = PromptsBrowser;
        const {maxCardsShown = 1000} = state.config;
        const {possibleFilters} = PromptTools;
        const {sorting} = possibleFilters;
        const {checkFilter} = PromptsSimpleFilter;
        const promptId = state.promptToolsId;
        const activePrompts = ActivePrompts.getCurrentPrompts();
        const showAll = state.toggledButtons.includes("tools_showAll");
        if(!promptId) return;
        let targetTags: string[] = [];
        let targetCategories: string[] = [];
        let targetNameWords: string[] = replaceAllRegex(promptId.toLowerCase(), "_", " ").split(" ");
        let shownItems = 0;

        const targetPromptItem = united.find(item => item.id === promptId);
        if(targetPromptItem) {
            targetTags = targetPromptItem.tags || [];
            targetCategories = targetPromptItem.category || [];
        }

        const nameArr: string[] = promptId.split(" ");
        const possiblePrompts: (Prompt & {simIndex: number})[] = [];
        const addedIds: string[] = [];

        for(const index in united) {
            const item = united[index];
            if(shownItems > maxCardsShown) break;

            const {id, tags, category} = item;

            if(!checkFilter(id, possibleFilters)) continue;

            //similarity index based on the same tags, categories and words used in the prompt name
            let simIndex = 0;

            if(id === promptId) continue;

            let nameWords = replaceAllRegex(id.toLowerCase(), "_", " ").split(" ");

            if(state.toggledButtons.includes("tools_tags"))
                targetTags.forEach(tagItem => {if(tags.includes(tagItem)) simIndex++});
            
            if(state.toggledButtons.includes("tools_category"))
                targetCategories.forEach(catItem => {if(category.includes(catItem)) simIndex++});
            
            if(state.toggledButtons.includes("tools_name"))
                targetNameWords.forEach(wordItem => {if(nameWords.includes(wordItem)) simIndex++});

            if(showAll) {
                possiblePrompts.push({...item, simIndex});
                shownItems++;
                continue
            }

            if(state.toggledButtons.includes("tools_tags") && targetTags.length) {
                targetTags.some(targetTag => {
                    if(tags.includes(targetTag)) {
                        possiblePrompts.push({...item, simIndex});
                        shownItems++;

                        return true;
                    }
                });
            }

            if(state.toggledButtons.includes("tools_category") && targetCategories.length) {
                targetCategories.some(targetCategory => {
                    if(category.includes(targetCategory)) {
                        possiblePrompts.push({...item, simIndex});
                        shownItems++;

                        return true;
                    }
                });
            }

            if(state.toggledButtons.includes("tools_name")) {
                const itemNameArr = id.split(" ");

                wordLoop:
                for(const word of nameArr) {
                    for(const itemWord of itemNameArr) {
                        
                        if( itemWord.toLowerCase().includes(word.toLowerCase()) ) {
                            possiblePrompts.push({...item, simIndex});
                            shownItems++;

                            break wordLoop;
                        }
                    }
                }
            }
        };

        switch(sorting) {

            case "__none": break;

            case "alph":
                //sorting possible prompts alphabetically
                possiblePrompts.sort( (A, B) => {
                    if(A.id.toLowerCase() < B.id.toLowerCase()) return -1;
                    if(A.id.toLowerCase() > B.id.toLowerCase()) return 1;

                    return 0;
                });
                break;

            case "alphReversed":
                //sorting possible prompts alphabetically in reverse orderd
                possiblePrompts.sort( (A, B) => {
                    if(A.id.toLowerCase() < B.id.toLowerCase()) return 1;
                    if(A.id.toLowerCase() > B.id.toLowerCase()) return -1;

                    return 0;
                });
                break;

            default:
            case "sim":
                //sorting possible prompts based on their similarity to the selected prompt
                possiblePrompts.sort( (A, B) => {
                    if(A.simIndex < B.simIndex) return 1;
                    if(A.simIndex > B.simIndex) return -1;

                    if(A.id.toLowerCase() < B.id.toLowerCase()) return -1;
                    if(A.id.toLowerCase() > B.id.toLowerCase()) return 1;

                    return 0;
                });
        }

        function addElement(item: Prompt) {
            if(addedIds.includes(item.id)) return;
            const isShadowed = activePrompts.some(currItem => currItem.id === item.id);

            addedIds.push(item.id);
            const promptElement = showPromptItem({prompt: item, options: {isShadowed}});
            promptElement.addEventListener("click", PromptToolsEvent.onElementClick);
            wrapper.appendChild(promptElement);
        }

        for(const item of possiblePrompts) addElement(item);
    }

    public static update() {
        const {state} = PromptsBrowser;
        const wrapper = PromptsBrowser.DOMCache.promptTools;

        if(!wrapper || !state.promptToolsId) return;
        PromptsBrowser.onCloseActiveWindow = PromptToolsEvent.onCloseWindow;

        let currScrollState = 0;

        let prevPromptContainer = wrapper.querySelector(".PBE_windowCurrentList");
        if(prevPromptContainer) {
            currScrollState = prevPromptContainer.scrollLeft;
            prevPromptContainer = undefined;
        }

        wrapper.innerHTML = "";
        wrapper.style.display = "flex";

        const backImage = document.createElement("div");
        backImage.style.backgroundImage = Database.getPromptPreviewURL(state.promptToolsId);
        backImage.className = "PBE_toolsBackImage";

        const currentFilterBlock = document.createElement("div");
        const possibleFilterBlock = document.createElement("div");

        const currentPromptsBlock = document.createElement("div");
        const possiblePromptsBlock = document.createElement("div");
        const footerBlock = document.createElement("div");
        const closeButton = document.createElement("button");
        footerBlock.className = "PBE_rowBlock PBE_rowBlock_wide PBE_toolsFooter";
        currentFilterBlock.className = "PBE_dataBlock PBE_toolsFilter";
        possibleFilterBlock.className = "PBE_dataBlock PBE_toolsFilter";
        currentPromptsBlock.className = "PBE_dataBlock PBE_toolsHeader";
        possiblePromptsBlock.className = "PBE_dataBlock PBE_Scrollbar PBE_windowContent";
        closeButton.innerText = "Close";
        closeButton.className = "PBE_button";

        PromptsSimpleFilter.show(currentFilterBlock, PromptTools.currentFilters, PromptTools.update);
        PromptTools.showCurrentPrompts(currentPromptsBlock);

        PromptsSimpleFilter.show(possibleFilterBlock, PromptTools.possibleFilters, PromptTools.update);
        PromptTools.showPossiblePromptswrapper(possiblePromptsBlock);

        closeButton.addEventListener("click", PromptToolsEvent.onCloseWindow);

        footerBlock.appendChild(closeButton);

        wrapper.appendChild(backImage);

        wrapper.appendChild(currentFilterBlock);
        wrapper.appendChild(currentPromptsBlock);

        wrapper.appendChild(possibleFilterBlock);
        wrapper.appendChild(possiblePromptsBlock);

        wrapper.appendChild(footerBlock);

        let currentPromptsContainer = currentPromptsBlock.querySelector(".PBE_windowCurrentList");
        if(currentPromptsContainer) {
            currentPromptsContainer.scrollTo(currScrollState, 0);
            currentPromptsContainer = undefined;
        }
    }


}

export default PromptTools;
