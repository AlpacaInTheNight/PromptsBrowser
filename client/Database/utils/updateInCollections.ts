import ConfigManager from "client/managers/Config";
import { makeFileNameSafe } from "client/utils/index";
import previewStore from "client/components/PreviewSave/store";
import appStore from "client/store";
import Database from "../index";


export default function updateInCollections(isExternalNetwork: boolean, extension: string, checkpoint: string = "") {
    const {data} = Database;
    const {united, original} = data;
    const config = ConfigManager.getConfig();
    const {selectedPrompt} = appStore.getState();
    const {previewCollection} = previewStore.getState();
    checkpoint = makeFileNameSafe(checkpoint);

    let targetItem = united.find(item => item.id === selectedPrompt);
    if(!targetItem) {
        targetItem = {id: selectedPrompt, tags: [], category: [], collections: []};
        if(isExternalNetwork) targetItem.isExternalNetwork = true;
        united.push(targetItem);
    }

    if(!targetItem.collections) targetItem.collections = [];
    if(!targetItem.collections.includes(previewCollection)) {
        targetItem.collections.push(previewCollection);
    }

    let originalItem = original[previewCollection].find(item => item.id === selectedPrompt);
    if(!originalItem) {
        originalItem = {id: selectedPrompt, tags: [], category: []};
        if(isExternalNetwork) originalItem.isExternalNetwork = true;
        original[previewCollection].push(originalItem);
    }

    if(config.resizeThumbnails && config.resizeThumbnailsFormat) extension = config.resizeThumbnailsFormat.toLowerCase();

    if(config.savePreviewForModel) {

        if(!originalItem.previews) originalItem.previews = {};
        if(checkpoint) originalItem.previews[checkpoint] = {
            file: extension as any,
        };

    } else originalItem.previewImage = extension as any;
}
