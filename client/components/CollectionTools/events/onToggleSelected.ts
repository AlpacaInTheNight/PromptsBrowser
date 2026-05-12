import Database from "client/Database";
import appStore from "client/store";
import checkFilter from "client/components/ui/PromptsFilter/checkFilter";
import collectionToolsStore, {setSelectedPrompts} from '../store';


export default function onToggleSelected() {
    const {data} = Database;
    const {promptsFilter} = collectionToolsStore.getState();
    let {selectedPrompts} = collectionToolsStore.getState();
    const {filterCollection} = appStore.getState();
    if(!filterCollection) return;

    const targetCollection = data.original[filterCollection];
    if(!targetCollection) return;

    if(selectedPrompts.length) {
        setSelectedPrompts([]);
        return;
    }

    selectedPrompts = [];

    for(const item of targetCollection) {
        if(checkFilter(item, promptsFilter)) selectedPrompts.push(item.id);
    }

    setSelectedPrompts(selectedPrompts);
}
