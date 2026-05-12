import Database from 'client/Database'
import Prompt from 'clientTypes/prompt'
import appStore, { updateFilesIteration } from 'client/store'


export default function onDeletePrompt({targetItem}: {
    targetItem: Prompt;
}) {
    const promptItem = targetItem.id;
    let targetCollection = appStore.getState().filterCollection;

    if(!targetCollection) {
        if(!targetItem.collections) return;
        const firstCollection = targetItem.collections[0];
        if(!firstCollection) return;
        targetCollection = targetItem.collections[0];
    }

    if( confirm(`Remove prompt "${promptItem}" from catalogue "${targetCollection}"?`) ) {
        if(!Database.data.original[targetCollection]) return;

        Database.data.original[targetCollection] = Database.data.original[targetCollection].filter(item => item.id !== promptItem);

        Database.movePreviewImage(promptItem, targetCollection, targetCollection, "delete");
        Database.saveJSONData(targetCollection);
        Database.updateMixedList();
        
        updateFilesIteration();
    }
}
