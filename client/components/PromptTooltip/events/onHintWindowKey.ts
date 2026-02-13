import tooltipStore from '../store'
import getContainer from 'client/components/PromptTooltip/getContainer'
import state from '../state'
import onApplyHint from './onApplyHint'
import onApplyStyleHint from './onApplyStyleHint'
import { setIsActive } from '../store'


export default function onHintWindowKey(e: KeyboardEvent) {
    const {total = 0} = state;
    let {selected = 0} = state;
    const tooltipWindow = getContainer();
    if(!tooltipWindow) return;
    if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return false;

    if(e.keyCode === 13) {
        const {hints, start, end} = tooltipStore.getState();
        const selectedHint = hints[selected];
        if(!selectedHint) return false;
        const {name, isStyle = false, collection} = selectedHint;

        if(isStyle) onApplyStyleHint(start, end, name, collection);
        else onApplyHint(start, end, name);
        setIsActive(true);

        return;
    }

    const isDown = e.keyCode == 40;

    if(isDown) selected++;
    else selected--;

    if(selected < 0) selected = total - 1;
    else if(selected > total - 1) selected = 0;

    state.selected = selected;

    const hints = document.querySelectorAll<HTMLDivElement>("#PBE_autocompliteBox .PBE_hintItem");
    hints.forEach(nodeItem => {
        if(nodeItem.dataset.index === selected + "") nodeItem.classList.add("PBE_hintItemSelected");
        else nodeItem.classList.remove("PBE_hintItemSelected");
    })

    return true;
}
