import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";
import Database from "client/Database/index";
import { makeElement, makeDiv } from "client/dom";
import showPromptItem from "client/showPromptItem";
import { replaceAllRegex } from "client/utils/index";
import PromptsSimpleFilter from "client/PromptsFilter/simple";
import showPrompts from "client/CurrentPrompts/showPrompts";
import { FilterSimple } from "clientTypes/filter";
import { clone } from "client/utils/index";
import PromptToolsEvent from "./event";

class PromptTools {
    
    private static currentFilters: FilterSimple = {
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

    private static possibleFilters: FilterSimple = {
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

    private static showCurrentPromptsList(wrapper: HTMLElement) {
        const {state} = PromptsBrowser;
        const {currentFilters} = PromptTools;
         const activePrompts = clone( ActivePrompts.getCurrentPrompts() );
        if(state.promptTools.index === undefined) return;

        const currentPromptsContainer = makeDiv({className: "PBE_windowCurrentList PBE_Scrollbar"});

        showPrompts({
            prompts: activePrompts,
            wrapper: currentPromptsContainer,
            focusOn: {index: state.promptTools.index, groupId: state.promptTools.groupId},
            filterSimple: currentFilters,
            allowMove: false,
            onClick: PromptToolsEvent.onChangeSelected,
        });

        currentPromptsContainer.addEventListener("wheel", (e) => {
            const target = e.currentTarget as HTMLElement;
            if(!e.deltaY) return;

            target.scrollLeft += e.deltaY + e.deltaX;
            e.preventDefault();
        });

        wrapper.appendChild(currentPromptsContainer);
    }

    private static showCurrentPrompts(wrapper: HTMLElement) {
        const {state} = PromptsBrowser;
        if(state.promptTools.index === undefined) return;

        const setupContainer = makeDiv({className: "PBE_List PBE_toolsSetup"});
        
        //setup fieldset
        const setupField = makeElement<HTMLElement>({element: "fieldset", className: "PBE_fieldset"});
        const setupLegend = makeElement<HTMLElement>({element: "legend", content: "Setup"});

        const showAll = makeDiv({content: "Show All", className: "PBE_toggleButton"});
        const replaceMode = makeDiv({content: "Replace mode", className: "PBE_toggleButton"});
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

        const showTags = makeDiv({content: "Tags", className: "PBE_toggleButton"});
        const showCategory = makeDiv({content: "Category", className: "PBE_toggleButton"});
        const showName = makeDiv({content: "Name", className: "PBE_toggleButton"});

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

        setupContainer.appendChild(setupField);
        setupContainer.appendChild(simField);

        PromptTools.showCurrentPromptsList(wrapper);
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
        const {index, groupId} = state.promptTools;
        const activePrompts = ActivePrompts.getCurrentPrompts();
        const uniquePrompts = ActivePrompts.getUniqueIds();
        const showAll = state.toggledButtons.includes("tools_showAll");
        if(index === undefined) return;

        const targetPrompt = ActivePrompts.getPromptByIndex(index, groupId);
        if(!targetPrompt || !targetPrompt.id) return;

        let targetTags: string[] = [];
        let targetCategories: string[] = [];
        let targetNameWords: string[] = replaceAllRegex(targetPrompt.id.toLowerCase(), "_", " ").split(" ");
        let shownItems = 0;

        const targetPromptSource = united.find(item => item.id === targetPrompt.id);
        if(targetPromptSource) {
            targetTags = targetPromptSource.tags || [];
            targetCategories = targetPromptSource.category || [];
        }

        const nameArr: string[] = targetPrompt.id.split(" ");
        const possiblePrompts: (Prompt & {simIndex: number})[] = [];
        const addedIds: string[] = [];

        for(const index in united) {
            const item = united[index];
            if(shownItems > maxCardsShown) break;

            const {id, tags, category} = item;

            if(!checkFilter(id, possibleFilters)) continue;

            //similarity index based on the same tags, categories and words used in the prompt name
            let simIndex = 0;

            if(id === targetPrompt.id) continue;

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
            const isShadowed = uniquePrompts.includes(item.id);

            addedIds.push(item.id);
            const promptElement = showPromptItem({prompt: item, options: {isShadowed}});
            promptElement.addEventListener("click", PromptToolsEvent.onSelectNew);
            wrapper.appendChild(promptElement);
        }

        for(const item of possiblePrompts) addElement(item);
    }

    public static update() {
        const {state} = PromptsBrowser;
        const {index, groupId = false} = state.promptTools;
        const wrapper = PromptsBrowser.DOMCache.promptTools;
        if(!wrapper || index === undefined) return;

        const targetPrompt = ActivePrompts.getPromptByIndex(index, groupId);
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
        if(targetPrompt && targetPrompt.id) backImage.style.backgroundImage = Database.getPromptPreviewURL(targetPrompt.id);
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
