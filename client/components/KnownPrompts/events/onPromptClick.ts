import Database from 'client/Database'
import { updateCurrentIteration } from 'client/store'
import ActivePrompts from 'client/managers/ActivePrompts'
import addPromptItem from './addPromptItem'
import onEditPrompt from './onEditPrompt'
import onDeletePrompt from './onDeletePrompt'

export default function onPromptClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;
    const {readonly} = Database.meta;
    const {united} = Database.data;

    const promptItem = target.dataset.prompt;
    const targetItem = united.find(item => item.id === promptItem);
    if(!targetItem) return;

    if(!readonly && e.shiftKey) {
        onEditPrompt({targetItem});
        return;
    }

    if(!readonly && (e.metaKey || e.ctrlKey) ) {
        onDeletePrompt({targetItem});
        return;
    }

    addPromptItem(targetItem);
    ActivePrompts.updateTextArea();
    updateCurrentIteration();
}
