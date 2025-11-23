import collectionToolsStore, {setSelectedPrompts} from '../store';
import { setEditPrompt, setEditTargetCollection } from 'client/store'
import Database from 'client/Database';


export default function onSelectPrompt(e: React.MouseEvent) {
    let {selectedPrompts} = collectionToolsStore.getState();
    const {readonly} = Database.meta;
    const {united, original} = Database.data;
    
    const target = e.currentTarget as HTMLElement;
    const id = target.dataset.id;
    if(!id) return;

    if(!readonly && e.shiftKey) {
        const targetPrompt = united.find(item => item.id === id);
        if(!targetPrompt) return;

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

    if(!selectedPrompts.includes(id)) {
        selectedPrompts.push(id);
    } else {
        selectedPrompts = selectedPrompts.filter(promptId => promptId !== id);
    }

    setSelectedPrompts([...selectedPrompts]);
}
