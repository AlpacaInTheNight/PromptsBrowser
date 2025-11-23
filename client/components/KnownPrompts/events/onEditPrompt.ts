import Database from 'client/Database'
import Prompt from 'clientTypes/prompt'
import appStore, { setEditPrompt, setEditTargetCollection } from 'client/store'


export default function onEditPrompt({targetItem}: {
    targetItem: Prompt;
}) {
    const {original} = Database.data;
    const promptItem = targetItem.id;
    const filterCollection = appStore.getState().filterCollection;

    if(!targetItem.collections) return false;
    if(!targetItem.collections[0]) return false;

    const targetCollection = filterCollection ? filterCollection : targetItem.collections[0];
    const collection = original[targetCollection];
    if(!collection) return false;

    const originalItem = collection.find(item => item.id === promptItem);
    if(!originalItem) return false;

    setEditPrompt(JSON.parse(JSON.stringify(originalItem)));
    setEditTargetCollection(targetCollection);
}
