import DOMCache from "client/DOMCache";
import appStore from "client/store";
import ConfigManager from "client/managers/Config";
import Database from "./index";


export default async function updateStylePreview({collectionId, styleId}: {
    collectionId: string;
    styleId: string;
}) {
    if(!collectionId || !styleId) return;

    const {data} = Database;
    const {currentContainer} = appStore.getState();
    const config = ConfigManager.getConfig();

    const imageArea = DOMCache.containers[currentContainer].imageArea;
    if(!imageArea) return;

    const imageContainer = imageArea.querySelector("img");
    if(!imageContainer) return;

    let src = imageContainer.src;
    const fileMarkIndex = src.indexOf("file=");
    if(fileMarkIndex === -1) return;
    src = src.slice(fileMarkIndex + 5);

    const cacheMarkIndex = src.indexOf("?");
    if(cacheMarkIndex && cacheMarkIndex !== -1) src = src.substring(0, cacheMarkIndex);

    const imageExtension = src.split('.').pop();

    const url = Database.getAPIurl("saveStylePreview");

    await (async () => {
        const saveData = {src, style: styleId, collection: collectionId};

        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveData)
        });
        //const content = await rawResponse.json();

        const targetStylesCollection = data.styles[collectionId];
        if(targetStylesCollection) {
            targetStylesCollection.some(item => {
                if(item.name === styleId) {
                    if(config.resizeThumbnails && config.resizeThumbnailsFormat) {
                        item.previewImage = config.resizeThumbnailsFormat.toLowerCase() as any;
                
                    } else item.previewImage = imageExtension as any;
    
                    return true;
                }
            });
        }

        Database.updateStyles(collectionId);
    })();
}
