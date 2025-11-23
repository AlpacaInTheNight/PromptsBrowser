import Database from "client/Database";
import DOMCache from "client/DOMCache";
import appStore from "client/store";
import generateNextPreview from "./generateNextPreview";
import StaticStore from "./StaticStore";


export default function checkProgressState() {
    const {currentContainer} = appStore.getState();
    const resultsContainer = DOMCache.containers[currentContainer].resultsContainer;
    if(!resultsContainer) return;

    /**
     * Progress bar is being added during generation and is removed from the DOM after generation finished.
     * Its presence serves as a marker when checking the state of generation.
     */
    const progressBar = resultsContainer.querySelector(".progressDiv");

    if(!progressBar) {
        Database.savePromptPreview(false);
        generateNextPreview();

        return;
    }

    clearTimeout(StaticStore.generateNextTimer);
    StaticStore.generateNextTimer = setTimeout(checkProgressState, 500);
}
