import DOMCache from 'client/DOMCache'
import appStore from 'client/store'


export default function getContainer() {
    const {currentContainer} = appStore.getState();
    if(!currentContainer) return false;

    const targetContainer = DOMCache.containers[currentContainer];
    if(!targetContainer) return false;

    if(targetContainer.tooltipWindow) return targetContainer.tooltipWindow;

    const tooltipWindow = document.getElementById("PBE_autocompliteBox");
    if(!tooltipWindow) return false;

    targetContainer.tooltipWindow = tooltipWindow;

    return targetContainer.tooltipWindow;
}
