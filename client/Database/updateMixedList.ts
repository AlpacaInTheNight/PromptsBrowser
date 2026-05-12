import Prompt from "clientTypes/prompt";
import Database from "./index";


export default function updateMixedList() {
    const unitedArray: Prompt[] = [];
    const unitedList: {[key: string]: Prompt} = {};
    const res = Database.data.original;
    const addedIds: {[key: string]: boolean} = {};

    for(const collectionId in res) {
        const collection = res[collectionId];
        if(!Array.isArray(collection)) continue;

        for(const collectionPrompt of collection) {
            const {id, isExternalNetwork, previewImage, previews, addAtStart, addAfter, addStart, addEnd} = collectionPrompt;
            let newItem: Prompt = {id, tags: [], category: [], collections: [], knownPreviews: {}, knownModelPreviews: {}};
            if(addedIds[id]) newItem = unitedArray.find(item => item.id === id);

            if(addAtStart) newItem.addAtStart = addAtStart;
            if(addAfter) newItem.addAfter = addAfter;
            if(addStart) newItem.addStart = addStart;
            if(addEnd) newItem.addEnd = addEnd;

            if(isExternalNetwork) newItem.isExternalNetwork = true;

            if(previewImage) {
                newItem.knownPreviews[collectionId] = previewImage;
            }

            if(previews) {
                for(const modelId in previews) {
                    if(previews[modelId] && previews[modelId].file) {
                        if(!newItem.knownModelPreviews[collectionId]) newItem.knownModelPreviews[collectionId] = {};
                        newItem.knownModelPreviews[collectionId][modelId] = previews[modelId].file;
                    }
                }
            }

            if(!newItem.collections.includes(collectionId)) {
                newItem.collections.push(collectionId);
            }

            if(collectionPrompt.tags) {
                collectionPrompt.tags.forEach(item => {
                    if(!newItem.tags.includes(item)) newItem.tags.push(item);
                });
            }

            if(collectionPrompt.category) {
                collectionPrompt.category.forEach(item => {
                    if(!newItem.category.includes(item)) newItem.category.push(item);
                });
            }

            if(!addedIds[id]) {
                unitedArray.push(newItem);
                unitedList[id] = newItem;
            }
            addedIds[id] = true;
        }
    }

    Database.data.united = unitedArray;
    Database.data.unitedList = unitedList;
}
