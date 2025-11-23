import Database from "client/Database";
import appStore from "client/store";
import collectionToolsStore, {setSelectedPrompts} from '../store';


/**
 * Deletes selected prompts after a user confirmation
 */
export default function onDeleteSelected() {
    const {data} = Database;
    const {selectedPrompts} = collectionToolsStore.getState();
    const {filterCollection} = appStore.getState();
    if(!filterCollection) return;

    const targetCollection = data.original[filterCollection];

    if(!selectedPrompts || !selectedPrompts.length || !targetCollection) return;

    if( confirm(`Remove ${selectedPrompts.length} prompts from catalogue "${filterCollection}"?`) ) {
        data.original[filterCollection] = targetCollection.filter(prompt => !selectedPrompts.includes(prompt.id));

        for(const deletedPromptId of selectedPrompts) {
            Database.movePreviewImage(deletedPromptId, filterCollection, filterCollection, "delete");
        }

        Database.saveJSONData(filterCollection);
        Database.updateMixedList();

        setSelectedPrompts([]);
    }
}
