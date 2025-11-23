import supportedContainers from 'client/supportedContainers'
import {log} from 'client/utils/index'
import gradioApp from 'client/utils/gradioApp'
import appStore, {loadUIConfig, ViewType, setCurrentContainer} from 'client/store'
import appStaticStore from './staticStore'
import DOMCache from './DOMCache'
import Database from './Database'
import syncCurrentPrompts from 'client/synchroniseCurrentPrompts'

import mountSetupWindow from 'client/components/SetupWindow/mount'
import mountControlPanel from 'client/components/ControlPanel/mount'
import mountKnownPrompts from 'client/components/KnownPrompts/mount'
import mountCurrentPrompts from 'client/components/CurrentPrompts/mount'
import mountPromptTooltip from 'client/components/PromptTooltip/mount'
import mountPromptEdit from 'client/components/PromptEdit/mount'
import mountTextareaButtons from 'client/components/TextareaButtons/mount'
import mountLoadStyle from 'client/components/LoadStyle/mount'
import mountSaveStyle from 'client/components/SaveStyle/mount'
import mountPromptScribe from 'client/components/PromptScribe/mount'
import mountPreviewSave from 'client/components/PreviewSave/mount'
import mountCollectionTools from 'client/components/CollectionTools/mount'
import mountPromptTools from 'client/components/PromptTools/mount'
import mountTagTooltip from 'client/components/ui/TagTooltip/mount'


let timeoutPBUpdatePrompt: any = 0;

function onChangeTab(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase()
    if(tagName !== "button") return;

    const text = target.innerText.trim();
    if(!text) return;

    setCurrentContainer(text);
}

function onDocumentKey(e: KeyboardEvent) {
    if(e.key !== "Escape") return;

    if(appStaticStore.onClose) {
        appStaticStore.onClose();
        appStaticStore.onClose = undefined;
    }
}

function tryToHook(tries = 0) {
    const store = appStore.getState();
    const showViews = store.showViews;
    const mainContainer = gradioApp() as HTMLElement;

    if(tries > 100) {
        log("No prompt wrapper container found or server did not returned prompts data.");
        return;
    }

    const checkContainer = mainContainer.querySelector("#txt2img_prompt_container");
    if(!checkContainer) {
        timeoutPBUpdatePrompt = setTimeout( () => tryToHook(tries + 1), 1000 );
        return;
    }

    DOMCache.mainContainer = mainContainer;
    DOMCache.modelCheckpoint = mainContainer.querySelector("#setting_sd_model_checkpoint");

    const tabsContainer = mainContainer.querySelector("#tabs > div:first-child");
    tabsContainer.removeEventListener("click", onChangeTab);
    tabsContainer.addEventListener("click", onChangeTab);

    document.removeEventListener('keyup', onDocumentKey);
    document.addEventListener('keyup', onDocumentKey);

    for(const containerId in supportedContainers) {
        const container = supportedContainers[containerId];
        
        const {tabName = ""} = container;
        DOMCache.containers[tabName] = {} as any;
        const domContainer = DOMCache.containers[tabName];

        if(container.prompt) {
            const promptContainer = mainContainer.querySelector(`#${container.prompt}`) as HTMLElement;
            const positivePrompts = mainContainer.querySelector(`#${container.prompt} > div`) as HTMLElement;
            const negativePrompts = mainContainer.querySelector(`#${container.prompt} > div:nth-child(2)`) as HTMLElement;
            if(!positivePrompts || !negativePrompts) {
                log(`No prompt containers found for ${tabName}`);
                continue;
            }

            domContainer.promptContainer = promptContainer;
            domContainer.positivePrompts = positivePrompts;
            domContainer.negativePrompts = negativePrompts;

            if(!showViews.includes(ViewType.POSITIVE)) positivePrompts.style.display = "none";
            if(!showViews.includes(ViewType.NEGATIVE)) negativePrompts.style.display = "none";

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

            //caching prompts textArea element
            domContainer.textArea = positivePrompts.querySelector("textarea") as HTMLTextAreaElement;
            const textArea = domContainer.textArea;

            if(textArea && !textArea.dataset.pbelistenerready) {
                textArea.dataset.pbelistenerready = "true";

                textArea.removeEventListener("input", () => syncCurrentPrompts(true, false));
                textArea.addEventListener("input", () => syncCurrentPrompts(true, false));
            }

            if(container.gallery) {
                domContainer.imageArea = mainContainer.querySelector(`#${container.gallery}`);
                mountPreviewSave({wrapper: domContainer.imageArea, tabName});
            }
            
            mountPromptTooltip({wrapper: positivePrompts, tabName});
            mountControlPanel({wrapper: promptContainer, tabName});
            mountKnownPrompts({wrapper: promptContainer, positivePrompts: domContainer.positivePrompts, tabName});
            mountCurrentPrompts({wrapper: promptContainer, tabName});
            
            mountTextareaButtons({positivePrompts: domContainer.positivePrompts, tabName});
        }

        if(container.seed) domContainer.seedInput = mainContainer.querySelector(`#${container.seed} input`);
        if(container.width) domContainer.widthInput = mainContainer.querySelector(`#${container.width} input`);
        if(container.height) domContainer.heightInput = mainContainer.querySelector(`#${container.height} input`);
        if(container.steps) domContainer.stepsInput = mainContainer.querySelector(`#${container.steps} input`);
        if(container.cfg) domContainer.cfgInput = mainContainer.querySelector(`#${container.cfg} input`);
        if(container.sampling) domContainer.samplingInput = mainContainer.querySelector(`#${container.sampling} input`);
    }

    mountSetupWindow({wrapper: mainContainer});
    mountLoadStyle({wrapper: mainContainer});
    mountSaveStyle({wrapper: mainContainer});
    mountPromptScribe({wrapper: mainContainer});
    mountCollectionTools({wrapper: mainContainer});
    mountPromptTools({wrapper: mainContainer});
    mountPromptEdit({wrapper: mainContainer});
    mountTagTooltip({wrapper: mainContainer});
}

document.addEventListener('DOMContentLoaded', function() {
    loadUIConfig();
    Database.load();
    tryToHook();
});

