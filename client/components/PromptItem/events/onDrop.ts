import ActivePrompts from 'client/managers/ActivePrompts'
import { updateCurrentIteration } from 'client/store'
import DnDInfo, {clearDnD} from "./DnDInfo";


export default function onDrop(e: React.DragEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;

    const dragIndex = Number(target.dataset.index);
    let dragGroup: number | false = Number(target.dataset.group);
    if(Number.isNaN(dragGroup)) dragGroup = false;

    const dropIndex = DnDInfo.index;
    const dropGroup = DnDInfo.groupId;
    target.classList.remove("PBE_swap");
    
    clearDnD();

    e.preventDefault();
    e.stopPropagation();

    if(e.shiftKey) {
        ActivePrompts.groupPrompts({
            from: {index: dropIndex, groupId: dropGroup},
            to: {index: dragIndex, groupId: dragGroup},
        });

    } else {
        ActivePrompts.movePrompt({
            from: {index: dropIndex, groupId: dropGroup},
            to: {index: dragIndex, groupId: dragGroup},
        });
    }

    updateCurrentIteration();
    ActivePrompts.updateTextArea();
}
