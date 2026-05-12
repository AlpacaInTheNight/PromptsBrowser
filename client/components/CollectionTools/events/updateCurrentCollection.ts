import Database from "client/Database";
import appStore from "client/store";
import collectionToolsStore, {iterateStore, setSelectedPrompts} from '../store';
import checkFilter from "client/components/ui/PromptsFilter/checkFilter";


export default function updateCurrentCollection() {
    const {data} = Database;
    const {filterCollection} = appStore.getState();
    const {promptsFilter} = collectionToolsStore.getState();
    let {selectedPrompts} = collectionToolsStore.getState();
    if(!filterCollection) return;

    const targetCollection = data.original[filterCollection];
    if(!selectedPrompts || !selectedPrompts.length || !targetCollection) return;

    for(const item of targetCollection) {
        const {id} = item;
        if(!id) continue;

        /**
         * Removing prompt from selected if it will not be shown.
         */
        if(!checkFilter(item, promptsFilter)) {
            if(selectedPrompts.includes(id)) {
                selectedPrompts = selectedPrompts.filter(selId => selId !== id);
            }

            continue;
        }
    }

    Database.saveJSONData(filterCollection);
    Database.updateMixedList();
    
    setSelectedPrompts(selectedPrompts);
    iterateStore();
}
