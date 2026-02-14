import tagTooltipStore, { TagTooltipStaticStore } from "../store";
import onChange from '../events/onChange';


export default function applyHint({newTag, start, end}: {
    newTag: string;
    start: number;
    end: number;
}) {
    const autocompliteBox = tagTooltipStore.getState().autocompliteBox;
    const inputElement = tagTooltipStore.getState().inputElement;
    if(!autocompliteBox || !inputElement) return;

    autocompliteBox.style.display = "none";
    inputElement.dataset.hint = "";
    let newValue = "";

    const prefix = inputElement.value.substring(0, start);
    const postfix = inputElement.value.substring(end);
    
    if(prefix) newValue += prefix + " ";
    newValue += newTag;
    if(postfix) newValue += postfix;

    inputElement.value = newValue;

    TagTooltipStaticStore.selectedIndex = 0;

    onChange(inputElement.value);
}
