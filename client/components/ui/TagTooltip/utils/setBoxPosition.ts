import tagTooltipStore from "../store";


export default function setBoxPosition(inputContainer: HTMLInputElement) {
    const boxContainer = tagTooltipStore.getState().autocompliteBox;
    if(!inputContainer || !boxContainer) return;

    const rect = inputContainer.getBoundingClientRect();

    boxContainer.style.top = rect.top + rect.height + "px";
    boxContainer.style.left = rect.left + "px";
    boxContainer.style.zIndex = "1000";
}
