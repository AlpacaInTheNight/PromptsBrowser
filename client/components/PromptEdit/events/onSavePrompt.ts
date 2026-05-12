import appStore, {setEditPrompt, setEditTargetCollection} from 'client/store'
import Database from 'client/Database'
import Prompt from 'client/types/prompt';


function cleanPromptObject(promptItem: Prompt) {
    if(!promptItem.addAtStart) delete promptItem.addAtStart;
    if(!promptItem.addAfter) delete promptItem.addAfter;
    if(!promptItem.addStart) delete promptItem.addStart;
    if(!promptItem.addEnd) delete promptItem.addEnd;
}

export default function onSavePrompt() {
    const {data} = Database;
    const state = appStore.getState();
    const editPrompt = state.editPrompt;
    const editTargetCollection = state.editTargetCollection;
    if(!editPrompt || !editTargetCollection) return;

    const collection = data.original[editTargetCollection];
    if(!collection) return;

    cleanPromptObject(editPrompt);

    const indexInOrigin = collection.findIndex(item => item.id === editPrompt.id);
    if(indexInOrigin !== -1) collection[indexInOrigin] = editPrompt;
    else collection.push(editPrompt);

    Database.saveJSONData(editTargetCollection);
    Database.updateMixedList();

    setEditPrompt(undefined);
    setEditTargetCollection(undefined);
}
