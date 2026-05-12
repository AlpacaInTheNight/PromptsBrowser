import Database from "client/Database"
import loadStyleStore, {iterateStore} from "../store"


export default function onRemoveStyle(selectedCollection?: string, selectedIndex?: number) {
    const {readonly} = Database.meta;
    const {data} = Database;
    if(readonly || !data.styles) return;

    if(!selectedCollection && selectedIndex === undefined) {
        selectedCollection = loadStyleStore.getState().selectedCollection;
        selectedIndex = loadStyleStore.getState().selectedIndex;
    }

    if(!selectedCollection || selectedIndex === undefined) return;

    const targetCollection = data.styles[selectedCollection];
    if(!targetCollection) return;

    const targetStyle = data.styles[selectedCollection][selectedIndex];
    if(!targetStyle) return;

    if( confirm(`Remove style "${targetStyle.name}" from catalogue "${selectedCollection}"?`) ) {
        targetCollection.splice(selectedIndex, 1);

        Database.updateStyles(selectedCollection);
        iterateStore();
    }
}
