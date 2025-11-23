import Database from 'client/Database';
import ActivePrompts from 'client/managers/ActivePrompts';
import previewStore from 'client/components/PreviewSave/store';
import promptScribeStore, {setSelectedNewPrompts} from "../store";


export default function onSelectAll() {
    const {data} = Database;
    let database = data.united;
    const uniquePrompts = ActivePrompts.getUnique();
    const {newInAllCollections} = promptScribeStore.getState();
    const {previewCollection} = previewStore.getState();
    let selectedNewPrompts: string[] = [];

    if(!newInAllCollections && previewCollection && data.original[previewCollection]) {
        database = data.original[previewCollection];
    }

    for(const item of uniquePrompts) {
        if(item.isSyntax) continue;
        let isKnown = false;

        for(const knownPrompt of database) {
            if(knownPrompt.id.toLowerCase() === item.id.toLowerCase()) {
                isKnown = true;
                break;
            }
        }

        if(!isKnown) selectedNewPrompts.push(item.id);
    }

    setSelectedNewPrompts(selectedNewPrompts);
}
