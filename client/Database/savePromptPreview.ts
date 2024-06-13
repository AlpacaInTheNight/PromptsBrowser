import PromptsBrowser from "client/index";
import ActivePrompts from "client/ActivePrompts/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import PreviewSave from "client/PreviewSave/index";
import KnownPrompts from "client/KnownPrompts/index";
import { getCheckpoint, makeFileNameSafe } from "client/utils/index";
import Database from "./index";
import { SavePrompt } from "./type";

function getGeneratedImageSrc(): {src: string, extension: string} | false {
    const {state} = PromptsBrowser;
    const {selectedPrompt, savePreviewCollection, currentContainer} = state;

    const imageArea = PromptsBrowser.DOMCache.containers[currentContainer].imageArea;
    if(!imageArea) return false;
    if(!selectedPrompt) return false;
    if(!savePreviewCollection) return false;

    const imageContainer = imageArea.querySelector("img");
    if(!imageContainer) return false;

    let src = imageContainer.src;
    const fileMarkIndex = src.indexOf("file=");
    if(fileMarkIndex === -1) return false;
    src = src.slice(fileMarkIndex + 5);

    const cacheMarkIndex = src.indexOf("?");
    if(cacheMarkIndex && cacheMarkIndex !== -1) src = src.substring(0, cacheMarkIndex);

    const extension = src.split('.').pop();

    return {src, extension};
}

function updateInCollections(isExternalNetwork: boolean, extension: string, checkpoint: string = "") {
    const {state} = PromptsBrowser;
    const {data} = Database;
    const {united, original} = data;
    const {selectedPrompt, savePreviewCollection} = state;
    checkpoint = makeFileNameSafe(checkpoint);

    let targetItem = united.find(item => item.id === selectedPrompt);
    if(!targetItem) {
        targetItem = {id: selectedPrompt, tags: [], category: [], collections: []};
        if(isExternalNetwork) targetItem.isExternalNetwork = true;
        united.push(targetItem);
    }

    if(!targetItem.collections) targetItem.collections = [];
    if(!targetItem.collections.includes(savePreviewCollection)) {
        targetItem.collections.push(savePreviewCollection);
    }

    let originalItem = original[savePreviewCollection].find(item => item.id === selectedPrompt);
    if(!originalItem) {
        originalItem = {id: selectedPrompt, tags: [], category: []};
        if(isExternalNetwork) originalItem.isExternalNetwork = true;
        original[savePreviewCollection].push(originalItem);
    }

    if(state.config.resizeThumbnails && state.config.resizeThumbnailsFormat) extension = state.config.resizeThumbnailsFormat.toLowerCase();

    if(state.config.savePreviewForModel) {

        if(!originalItem.previews) originalItem.previews = {};
        if(checkpoint) originalItem.previews[checkpoint] = {
            file: extension as any,
        };

    } else originalItem.previewImage = extension as any;
}

function savePromptPreview(callUpdate: boolean = true) {
    const {state} = PromptsBrowser;
    const {data} = Database;
    const {selectedPrompt, savePreviewCollection} = state;
    const url = Database.getAPIurl("savePreview");
    let isExternalNetwork = false;

    if(!data.original[savePreviewCollection]) return;

    const srcImage = getGeneratedImageSrc();
    if(!srcImage) return;
    const {src, extension} = srcImage;

    //checking if prompt have an external network syntax.
    const targetCurrentPrompt = ActivePrompts.getPromptById({id: state.selectedPrompt});
    if(targetCurrentPrompt && targetCurrentPrompt.isExternalNetwork) isExternalNetwork = true;

    const saveData: SavePrompt = {src, prompt: selectedPrompt, collection: savePreviewCollection};
    if(isExternalNetwork) saveData.isExternalNetwork = true;

    const checkpoint = getCheckpoint();
    if(checkpoint) saveData.model = checkpoint;

    updateInCollections(isExternalNetwork, extension, checkpoint || "");

    (async () => {

        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveData)
        });
        const answer = await rawResponse.json();

        if(answer === "ok" && callUpdate) {
            state.selectedPrompt = undefined;
            state.filesIteration++;
            Database.updateMixedList();
            
            PreviewSave.update();
            KnownPrompts.update();
            CurrentPrompts.update(true);
        }

    })();
}

export default savePromptPreview;
