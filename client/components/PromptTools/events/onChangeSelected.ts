import appStore, { setEditPrompt, setEditTargetCollection, updateCurrentIteration, setEditPromptGroup, setEditPromptIndex, setSelectedPrompt } from 'client/store'
import Database from 'client/Database';
import ActivePrompts from 'client/managers/ActivePrompts';


export default function onChangeSelected(e: React.MouseEvent) {
    const {data} = Database;
    const {united, original} = data;
    const {readonly} = Database.meta;
    const target = e.currentTarget as HTMLElement;
    const {editPromptIndex: index, editPromptGroup: groupId} = appStore.getState();
    if(index === undefined) return;

    const clickPrompt = target.dataset.prompt;
    const newIndex = Number(target.dataset.index);
    let newGroup: number | false = Number(target.dataset.group);
    if(Number.isNaN(newGroup)) newGroup = false;

    const targetPrompt = united.find(item => item.id === clickPrompt);
    if(!targetPrompt) return;

    if(!readonly && e.shiftKey) {
        if(targetPrompt) {
            const targetItem = united.find(item => item.id === targetPrompt.id);
            if(!targetItem) return false;
            if(!targetItem.collections) return false;
            if(!targetItem.collections[0]) return false;

            let collection = original[targetItem.collections[0]];
            if(!collection) return false;

            const originalItem = collection.find(item => item.id === targetPrompt.id);
            if(!originalItem) return false;

            setEditPrompt(JSON.parse(JSON.stringify(originalItem)));
            setEditTargetCollection(targetItem.collections[0]);
        }

        return;
    }

    if(e.metaKey || e.ctrlKey) { //remove prompt
        if(Number.isNaN(newIndex)) return;

        ActivePrompts.removePrompt(newIndex, newGroup);
        updateCurrentIteration();
        ActivePrompts.updateTextArea();

        return;

    } else { //select new prompt
        if(index === newIndex && groupId === newGroup) return; //same prompt

        setEditPromptGroup(newGroup);
        setEditPromptIndex(newIndex);
        setSelectedPrompt(targetPrompt.id);
        updateCurrentIteration();
    }

}
