import TagTooltip from "./index";

class TagTooltipEvent {

    public static onUnfocus(e: FocusEvent) {
        const inputElement = e;
        const autoCompleteBox = TagTooltip.container;

        if(!autoCompleteBox || !inputElement) return;
        if(autoCompleteBox.style.display === "none") return;
        
        clearTimeout(TagTooltip.unfocusTimeout);
        TagTooltip.unfocusTimeout = setTimeout(() => {
            autoCompleteBox.style.display = "none";
            autoCompleteBox.innerHTML = "";
        }, 400);
    }

    public static onKeyDown(e: KeyboardEvent) {
        const inputElement = e;
        const autoCompleteBox = TagTooltip.container;

        if(!autoCompleteBox || !inputElement) return;
        if(autoCompleteBox.style.display === "none") return;
        if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return;

        const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
        if(!hintElements || !hintElements.length) return;

        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    public static onClickHint(e: MouseEvent) {
        const inputElement = TagTooltip.input;
        const autoCompleteBox = TagTooltip.container;

        if(!autoCompleteBox || !inputElement) return;

        const target = e.currentTarget as HTMLElement;
        if(!target) return;

        const start = Number(target.dataset.start);
        const end = Number(target.dataset.end);
        const newPrompt = target.innerText;

        if(Number.isNaN(start) || Number.isNaN(end)) return;

        TagTooltipEvent.onApplyHint(start, end, newPrompt);
    }

    public static onHintWindowKey(e: KeyboardEvent) {
        const inputElement = TagTooltip.input;
        const autoCompleteBox = TagTooltip.container;
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
            const newPrompt = selectedHint.innerText;

            if(Number.isNaN(start) || Number.isNaN(end)) return false;
        
            TagTooltipEvent.onApplyHint(start, end, newPrompt);
            return true;
        }

        const isDown = e.keyCode == 40;

        if(isDown) TagTooltip.selectedIndex++;
        else TagTooltip.selectedIndex--;

        if(TagTooltip.selectedIndex < 0) TagTooltip.selectedIndex = hintElements.length - 1;
        else if(TagTooltip.selectedIndex > hintElements.length - 1) TagTooltip.selectedIndex = 0;

        for(let i = 0; i < hintElements.length; i++) {
            const element = hintElements[i];

            if(i === TagTooltip.selectedIndex) element.classList.add("PBE_hintItemSelected");
            else element.classList.remove("PBE_hintItemSelected");
        }

        return true;
    }

    public static onApplyHint(start: number, end: number, newTag: string) {
        const inputElement = TagTooltip.input;
        const autoCompleteBox = TagTooltip.container;
        if(!autoCompleteBox || !inputElement) return;

        autoCompleteBox.style.display = "none";
        inputElement.dataset.hint = "";
        let newValue = "";

        const prefix = inputElement.value.substring(0, start);
        const postfix = inputElement.value.substring(end);
        
        if(prefix) newValue += prefix + " ";
        newValue += newTag;
        if(postfix) newValue += postfix;

        inputElement.value = newValue;

        TagTooltip.selectedIndex = 0;

        inputElement.dispatchEvent(new Event("change"));
    }
}

export default TagTooltipEvent;
