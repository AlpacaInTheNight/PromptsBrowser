import Database from "client/Database";
import appStore from "client/store";
import collectionToolsStore, {setSelectedPrompts} from '../store';


/**
 * Moves or copies the selected prompts to the selected collection.
 * By default moves prompts.
 * @param {*} isCopy if copy actions is required instead of move action.
 */
export default function onMoveSelected(isCopy: boolean = false) {
    const {data} = Database;
    const {selectedPrompts, copyOrMoveTo} = collectionToolsStore.getState();
    const {filterCollection} = appStore.getState();
    if(!filterCollection) return;

    const targetCollection = data.original[filterCollection];
    if(!selectedPrompts || !selectedPrompts.length || !targetCollection || !copyOrMoveTo) return;

    const to = copyOrMoveTo;
    const from = filterCollection;
    if(!to || !from) return;
    if(!data.original[to] || !data.original[from]) return;

    let message = `${isCopy ? "Copy" : "Move"} ${selectedPrompts.length} prompts`;
    message += ` from catalogue "${filterCollection}" to catalogue "${copyOrMoveTo}"?`;

    if( confirm(message) ) {

        for(const promptId of selectedPrompts) {
            const originalItem = data.original[from].find(item => item.id === promptId);
            if(!originalItem) continue;

            if(isCopy) {
                if(data.original[to].some(item => item.id === promptId)) continue;

                data.original[to].push(JSON.parse(JSON.stringify(originalItem)));

                Database.movePreviewImage(promptId, from, to, "copy");

            } else {
                if(!data.original[to].some(item => item.id === promptId)) {
                    data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
                }
                
                data.original[from] = data.original[from].filter(item => item.id !== promptId);

                Database.movePreviewImage(promptId, from, to, "move");
            }
        }

        if(isCopy) {
            Database.saveJSONData(to, true);

        } else {
            Database.saveJSONData(to, true);
            Database.saveJSONData(from, true);
        }
        Database.updateMixedList();

        setSelectedPrompts([]);
    }
}
