import ConfigManager from 'client/managers/Config'
import tooltipStore from '../store'
import getContainer from '../getContainer'


export default function onKeyDown(e: KeyboardEvent) {
    const {autocomplitePromptMode = "prompts"} = ConfigManager.getConfig();
    if(autocomplitePromptMode === "off") return;

    const autoCompleteBox = getContainer();
    if(!autoCompleteBox) return;
    if(autoCompleteBox.style.display === "none") return;
    if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return;
    const hints = tooltipStore.getState().hints;
    if(!hints || !hints.length) return;

    e.stopPropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
}
