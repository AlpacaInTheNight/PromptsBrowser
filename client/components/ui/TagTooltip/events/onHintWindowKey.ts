import tagTooltipStore, { TagTooltipStaticStore } from "../store";
import applyHint from "../utils/applyHint";


export default function onHintWindowKey(e: React.KeyboardEvent) {
    const autoCompleteBox = tagTooltipStore.getState().autocompliteBox;
    const inputElement = tagTooltipStore.getState().inputElement;
    const {selectedIndex} = TagTooltipStaticStore;
    if(!autoCompleteBox || !inputElement) return false;

    if(autoCompleteBox.style.display === "none") return false;
    if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return false;

    const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
    if(!hintElements || !hintElements.length) return false;

    if(e.keyCode === 13) {
        const selectedHint = autoCompleteBox.querySelector(".PBE_hintItemSelected") as HTMLElement;
        if(!selectedHint) return false;

        const start = Number(selectedHint.dataset.start);
        const end = Number(selectedHint.dataset.end);
        const newTag = selectedHint.innerText;

        if(Number.isNaN(start) || Number.isNaN(end)) return false;
    
        applyHint({start, end, newTag});
        return true;
    }

    const isDown = e.keyCode == 40;

    let newSelectedIndex = selectedIndex;

    if(isDown) newSelectedIndex++;
    else newSelectedIndex--;

    if(newSelectedIndex < 0) newSelectedIndex = hintElements.length - 1;
    else if(newSelectedIndex > hintElements.length - 1) newSelectedIndex = 0;

    TagTooltipStaticStore.selectedIndex = newSelectedIndex;

    const hints = document.querySelectorAll<HTMLDivElement>("#PBE_autocompliteTags .PBE_hintItem");
    hints.forEach(nodeItem => {
        if(nodeItem.dataset.index === newSelectedIndex + "") nodeItem.classList.add("PBE_hintItemSelected");
        else nodeItem.classList.remove("PBE_hintItemSelected");
    });

    return true;
}
