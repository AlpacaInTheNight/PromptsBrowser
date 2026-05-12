import Database from "client/Database"
import loadStyleStore, {iterateStore, setNewName} from "../store"


export default async function onRenameStyle(selectedCollection?: string, selectedIndex?: number) {
    const {readonly} = Database.meta;
    const {data} = Database;
    if(readonly || !data.styles) return;
    const {newName} = loadStyleStore.getState();
    if(!newName) return;

    if(!selectedCollection && selectedIndex === undefined) {
        selectedCollection = loadStyleStore.getState().selectedCollection;
        selectedIndex = loadStyleStore.getState().selectedIndex;
    }

    if(!selectedCollection || selectedIndex === undefined) return;

    const targetCollection = data.styles[selectedCollection];
    if(!targetCollection) return;

    const targetStyle = data.styles[selectedCollection][selectedIndex];
    if(!targetStyle) return;

    for(const styleItem of targetCollection) {
        if(styleItem.name === newName) {
            alert("Style name already used");
            return;
        }
    }

    if( confirm(`Rename style "${targetStyle.name}" to "${newName}"?`) ) {

        await Database.renameStyle(selectedCollection, targetStyle.name, newName);
        setNewName("");
        iterateStore();
    }
}
