import supportedContainers from 'client/supportedContainers'
import {log} from 'client/utils/index'
import appStore, {ViewType} from 'client/store'
import DOMCache from 'client/DOMCache'
import syncCurrentPrompts from 'client/synchroniseCurrentPrompts'

import mountControlPanel from 'client/components/ControlPanel/mount'
import mountKnownPrompts from 'client/components/KnownPrompts/mount'
import mountCurrentPrompts from 'client/components/CurrentPrompts/mount'
import mountPromptTooltip from 'client/components/PromptTooltip/mount'
import mountTextareaButtons from 'client/components/TextareaButtons/mount'
import mountPreviewSave from 'client/components/PreviewSave/mount'


export default function mountContainer({containerId, mainContainer}: {
    containerId: string;
    mainContainer: HTMLElement;
}) {
    const store = appStore.getState();
    const showViews = store.showViews;
    const container = supportedContainers[containerId];

    if(!container) {
        log(`No speck for container "${containerId}"`);
        return false;
    }
        
    const {tabName = ""} = container;
    console.log("tab name: ", tabName);
    DOMCache.containers[tabName] = {} as any;
    const domContainer = DOMCache.containers[tabName];

    if(!domContainer) {
        log(`Tab container for "${tabName}" not found`);
        return false;
    }

    if(container.prompt) {
        const promptContainer = mainContainer.querySelector(`#${container.prompt}`) as HTMLElement;
        const positivePrompts = mainContainer.querySelector(`#${container.prompt} > div`) as HTMLElement;
        const negativePrompts = mainContainer.querySelector(`#${container.prompt} > div:nth-child(2)`) as HTMLElement;
        if(!positivePrompts || !negativePrompts) {
            log(`No prompt containers found for ${tabName}`);
            return false;
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

    return true;
}
