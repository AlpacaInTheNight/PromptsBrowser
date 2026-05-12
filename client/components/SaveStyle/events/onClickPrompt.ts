import ActivePrompts from "client/managers/ActivePrompts";
import {updateCurrentIteration} from 'client/store';


export default function onClickPrompt(e: React.MouseEvent) {
    const target = e.currentTarget as HTMLElement;

    const index = Number(target.dataset.index);
    let group: number | false = Number(target.dataset.group);
    if(Number.isNaN(group)) group = false;

    if(e.ctrlKey || e.metaKey) {
        ActivePrompts.removePrompt(index, group);
        updateCurrentIteration();
        ActivePrompts.updateTextArea();

        return;
    }
}
