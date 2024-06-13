import State from "clientTypes/state";
import Database from "client/Database/index";
import SetupWindow from "client/SetupWindow/index";
import PromptEdit from "client/PromptEdit/index";
import PromptTools from "client/PromptTools/index";
import CollectionTools from "client/CollectionTools/index";
import ControlPanel from "client/ControlPanel/index";
import KnownPrompts from "client/KnownPrompts/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import SaveStyle from "client/SaveStyle/index";
import LoadStyle from "client/LoadStyle/index";
import PromptScribe from "client/PromptScribe/index";
import PreviewSave from "client/PreviewSave/index";
import PromptWordTooltip from "client/PromptWordTooltip/index";
import syncCurrentPrompts from "client/synchroniseCurrentPrompts";
import { log } from "client/utils/index";

import initialState from "client/initialState";
import supportedContainers from "client/supportedContainers";

class PromptsBrowser {

    private static timeoutPBUpdatePrompt: any = 0;

    public static DOMCache: {
        mainContainer?: ShadowRoot | HTMLElement;
        modelCheckpoint?: HTMLElement;

        collectionTools?: HTMLElement;
        promptEdit?: HTMLElement;
        promptScribe?: HTMLElement;
        promptTools?: HTMLElement;
        setupWindow?: HTMLElement;
        stylesWindow?: HTMLElement;
        saveStyleWindow?: HTMLElement;

        containers: {
            [key: string]: {
                promptContainer: HTMLElement;
                positivePrompts: HTMLElement;
                negativePrompts: HTMLElement;
                buttonsContainer: HTMLElement;
                generateButton: HTMLElement;
                resultsContainer: HTMLElement;
                textArea: HTMLTextAreaElement;
                imageArea: HTMLElement;

                controlPanel: HTMLElement;
                promptBrowser: HTMLElement;
                currentPrompts: HTMLElement;
                promptsCatalogue: HTMLElement;
                savePromptWrapper: HTMLElement;

                autocompliteWindow: HTMLElement;

                seedInput: HTMLInputElement;
                widthInput: HTMLInputElement;
                heightInput: HTMLInputElement;
                stepsInput: HTMLInputElement;
                cfgInput: HTMLInputElement;
                samplingInput: HTMLSelectElement;
            }
        };
    } = {
        containers: {},
    };

    public static state: State = initialState;

    public static onCloseActiveWindow: (() => undefined | void | boolean) | undefined  = undefined;

    public static supportedContainers = supportedContainers;

    private static textAreaSynchronise = () => syncCurrentPrompts(true, false);

    public static loadUIConfig = () => {
        const {state} = PromptsBrowser;
    
        const lsShowViews = localStorage.getItem("PBE_showViews");
        if(lsShowViews) state.showViews = JSON.parse(lsShowViews);
    
        const showControlPanel = localStorage.getItem("showControlPanel");
        if(showControlPanel === "false") state.showControlPanel = false;
    }

    /**
     * Loading extension configuration from the local storage
     * TODO: this is outdated. Config comes from server now.
     */
    public static loadConfig = () => {
        const {state} = PromptsBrowser;

        //getting config from local storage
        const savedConfigString = localStorage.getItem("PBE_config");
        if(savedConfigString) {
            const savedConfig = JSON.parse(savedConfigString);
            if(savedConfig) state.config = savedConfig;
        }
    }

    private static onChangeTab(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const tagName = target.tagName.toLowerCase()
        if(tagName !== "button") return;
    
        const {state} = PromptsBrowser;
        const text = target.innerText.trim();
        if(state.currentContainer === text) return;
        let update = false;
    
        if(text === "txt2img") {
            state.currentContainer = "text2Img";
            update = true;
        }
    
        if(text === "img2img") {
            state.currentContainer = "img2Img";
            update = true;
        }
    
        if(update) {
            ControlPanel.update();
            PreviewSave.update();
            KnownPrompts.update();
            CurrentPrompts.update();
        }
    }
    
    /**
     * Tracking escape key to close active window.
     * @param e 
     * @returns 
     */
    private static onDocumentKey(e: KeyboardEvent) {
        if(e.key !== "Escape") return;
        let hold: boolean | undefined = false;
    
        if(PromptsBrowser.onCloseActiveWindow) hold = PromptsBrowser.onCloseActiveWindow() || false;
        if(!hold) PromptsBrowser.onCloseActiveWindow = undefined;
    }

    public static gradioApp = () => {
        const elems = document.getElementsByTagName('gradio-app')
        const gradioShadowRoot = elems.length == 0 ? null : elems[0].shadowRoot
        return !!gradioShadowRoot ? gradioShadowRoot : document.body;
    }

    public static init = (tries = 0) => {
        const {state} = PromptsBrowser;
        const {DOMCache} = PromptsBrowser;
        const {united} = Database.data;
        if(!DOMCache.containers) DOMCache.containers = {};
        const mainContainer = PromptsBrowser.gradioApp() as HTMLElement;
    
        if(tries > 100) {
            log("No prompt wrapper container found or server did not returned prompts data.");
            return;
        }
    
        const checkContainer = mainContainer.querySelector("#txt2img_prompt_container");
        if(!checkContainer || !united) {
            PromptsBrowser.timeoutPBUpdatePrompt = setTimeout( () => PromptsBrowser.init(tries + 1), 1000 );
            return;
        }

        DOMCache.mainContainer = mainContainer;
        DOMCache.modelCheckpoint = mainContainer.querySelector("#setting_sd_model_checkpoint");

        const tabsContainer = mainContainer.querySelector("#tabs > div:first-child");

        tabsContainer.removeEventListener("click", PromptsBrowser.onChangeTab);
        tabsContainer.addEventListener("click", PromptsBrowser.onChangeTab);

        document.removeEventListener('keyup', PromptsBrowser.onDocumentKey);
        document.addEventListener('keyup', PromptsBrowser.onDocumentKey);
    
        for(const containerId in PromptsBrowser.supportedContainers) {
            DOMCache.containers[containerId] = {} as any;
            const container = PromptsBrowser.supportedContainers[containerId];
            const domContainer = DOMCache.containers[containerId];

            if(container.prompt) {
                const promptContainer = mainContainer.querySelector(`#${container.prompt}`) as HTMLElement;
                if(promptContainer.dataset.loadedpbextension) continue;
                promptContainer.dataset.loadedpbextension = "true";

                const positivePrompts = mainContainer.querySelector(`#${container.prompt} > div`) as HTMLElement;
                const negativePrompts = mainContainer.querySelector(`#${container.prompt} > div:nth-child(2)`) as HTMLElement;
                if(!positivePrompts || !negativePrompts) {
                    log(`No prompt containers found for ${containerId}`);
                    continue;
                }

                domContainer.promptContainer = promptContainer;
                domContainer.positivePrompts = positivePrompts;
                domContainer.negativePrompts = negativePrompts;

                //in order to be able to place buttons correctly
                positivePrompts.style.position = "relative";

                if(container.buttons) {
                    const buttonsContainer = mainContainer.querySelector(`#${container.buttons}`) as HTMLElement;
                    if(buttonsContainer) {
                        domContainer.buttonsContainer = buttonsContainer;
    
                        const generateButton = buttonsContainer.querySelector(".primary") as HTMLElement;
                        if(generateButton) domContainer.generateButton = generateButton;
                    }
                }

                if(container.results) {
                    const resultsContainer = mainContainer.querySelector(`#${container.results}`) as HTMLElement;
                    if(resultsContainer) {
                        domContainer.resultsContainer = resultsContainer;
                    }
                }
    
                domContainer.textArea = positivePrompts.querySelector("textarea") as HTMLTextAreaElement;
                const textArea = domContainer.textArea;

                if(textArea && !textArea.dataset.pbelistenerready) {
                    textArea.dataset.pbelistenerready = "true";
    
                    textArea.removeEventListener("input", PromptsBrowser.textAreaSynchronise);
                    textArea.addEventListener("input", PromptsBrowser.textAreaSynchronise);
                }

                PromptWordTooltip.init(positivePrompts, containerId);
                ControlPanel.init(promptContainer, containerId);
                KnownPrompts.init(promptContainer, positivePrompts, containerId);
                CurrentPrompts.init(promptContainer, containerId);

                SaveStyle.initButton(positivePrompts);
                LoadStyle.initButton(positivePrompts);
                PromptScribe.initButton(positivePrompts);
                CurrentPrompts.initButton(positivePrompts);

                if(domContainer.promptBrowser && !state.showViews.includes("known")) {
                    domContainer.promptBrowser.style.display = "none";
                }
    
                if(domContainer.currentPrompts && !state.showViews.includes("current")) {
                    domContainer.currentPrompts.style.display = "none";
                }
    
                if(!state.showViews.includes("positive")) positivePrompts.style.display = "none";
                if(!state.showViews.includes("negative")) negativePrompts.style.display = "none";
            }

            if(container.seed) domContainer.seedInput = mainContainer.querySelector(`#${container.seed} input`);
            if(container.width) domContainer.widthInput = mainContainer.querySelector(`#${container.width} input`);
            if(container.height) domContainer.heightInput = mainContainer.querySelector(`#${container.height} input`);
            if(container.steps) domContainer.stepsInput = mainContainer.querySelector(`#${container.steps} input`);
            if(container.cfg) domContainer.cfgInput = mainContainer.querySelector(`#${container.cfg} input`);
            if(container.sampling) domContainer.samplingInput = mainContainer.querySelector(`#${container.sampling} input`);

            if(container.gallery) {
                domContainer.imageArea = PromptsBrowser.gradioApp().querySelector(`#${container.gallery}`);

                PreviewSave.init(domContainer.imageArea, containerId);
            }
        }

        SetupWindow.init(mainContainer);
        PromptEdit.init(mainContainer);
        PromptTools.init(mainContainer);
        CollectionTools.init(mainContainer);
        SaveStyle.init(mainContainer);
        LoadStyle.init(mainContainer);
        PromptScribe.init(mainContainer);

        ControlPanel.update();
        PreviewSave.update();

        KnownPrompts.update();
        CurrentPrompts.update();
    }
}

export default PromptsBrowser;

PromptsBrowser.loadConfig();

document.addEventListener('DOMContentLoaded', function() {
    PromptsBrowser.loadUIConfig();

    Database.load();

    PromptsBrowser.init();
});
