import supportedContainers from 'client/supportedContainers'
import {log} from 'client/utils/index'
import gradioApp from 'client/utils/gradioApp'
import {loadUIConfig} from 'client/store'
import DOMCache from './DOMCache'
import Database from './Database'

import mountContainer from './main/mountContainer'
import mountGlobal from './main/mountGlobal'
import onChangeTab from './main/events/onChangeTab'
import onDocumentKey from './main/events/onDocumentKey'
import formModelId from './utils/formModelId'
import { iterateModel } from 'client/store'


let timeoutPBUpdatePrompt: any = 0;

function tryToHook(tries = 0) {
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

    //Automatic1111
    let modelCheckpoint = mainContainer.querySelector("#setting_sd_model_checkpoint");
    
    //Forge
    if(!modelCheckpoint) {
        const forgeModelCheckpoint = mainContainer.querySelector("#quicksettings .model_selection");
        if(forgeModelCheckpoint) modelCheckpoint = forgeModelCheckpoint;
    }
    
    DOMCache.modelCheckpoint = modelCheckpoint as HTMLElement;

    if(DOMCache.modelCheckpoint) {
        const inputElement = DOMCache.modelCheckpoint.querySelector("input");
        inputElement?.addEventListener("blur", iterateModel)
    }

    const tabsContainer = mainContainer.querySelector("#tabs > div:first-child");
    tabsContainer.removeEventListener("click", onChangeTab);
    tabsContainer.addEventListener("click", onChangeTab);

    document.removeEventListener('keyup', onDocumentKey);
    document.addEventListener('keyup', onDocumentKey);

    for(const containerId in supportedContainers) mountContainer({containerId, mainContainer});

    mountGlobal({mainContainer});
}

document.addEventListener('DOMContentLoaded', function() {
    loadUIConfig();
    Database.load();
    tryToHook();
});

