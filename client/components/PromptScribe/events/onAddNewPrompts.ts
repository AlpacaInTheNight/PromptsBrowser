import Database from "client/Database"
import ActivePrompts from "client/managers/ActivePrompts"
import Prompt from "client/types/prompt"
import previewStore from 'client/components/PreviewSave/store'
import { updateFilesIteration } from 'client/store'
import promptScribeStore, {setSelectedNewPrompts} from "../store"


export default function onAddNewPrompts() {
    const {data} = Database;
    let {selectedNewPrompts = []} = promptScribeStore.getState();
    let {previewCollection} = previewStore.getState();
    const uniquePrompts = ActivePrompts.getUnique();
    if(!previewCollection) return;
    const targetCollection = data.original[previewCollection];
    if(!targetCollection) return;
    let newPrompts = false;

    for(const prompt of uniquePrompts) {
        if(!selectedNewPrompts.includes(prompt.id)) continue;

        const known = targetCollection.some(item => item.id === prompt.id);
        if(!known) {
            if(!newPrompts) newPrompts = true;
            const targetItem: Prompt = {id: prompt.id, tags: [], category: []};
            if(prompt.isExternalNetwork) targetItem.isExternalNetwork = true;
            targetCollection.push(targetItem);

            //removing from the selected
            selectedNewPrompts = selectedNewPrompts.filter(item => item !== prompt.id);
        }
    }

    if(!newPrompts) return;

    Database.saveJSONData(previewCollection);
    Database.updateMixedList();

    setSelectedNewPrompts(selectedNewPrompts);
    updateFilesIteration();
}
