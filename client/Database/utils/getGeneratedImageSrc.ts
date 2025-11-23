import DOMCache from "client/DOMCache";
import appStore from "client/store";
import previewStore from "client/components/PreviewSave/store";


export default function getGeneratedImageSrc(): {src: string, extension: string} | false {
    const {selectedPrompt, currentContainer} = appStore.getState();
    const {previewCollection} = previewStore.getState();
    if(!currentContainer) return false;

    const imageArea = DOMCache.containers[currentContainer].imageArea;
    if(!imageArea || !selectedPrompt || !previewCollection) return false;

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
