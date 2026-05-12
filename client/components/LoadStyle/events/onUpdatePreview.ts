import Database from 'client/Database'
import loadStyleStore, {iterateStore} from '../store'


export default async function onUpdatePreview(selectedCollection?: string, selectedName?: string) {
    if(!selectedCollection && !selectedName) {
        selectedCollection = loadStyleStore.getState().selectedCollection;
        selectedName = loadStyleStore.getState().selectedName;
    }

    if(!selectedCollection || !selectedName) return;

    await Database.updateStylePreview({collectionId: selectedCollection, styleId: selectedName});

    iterateStore();
}
