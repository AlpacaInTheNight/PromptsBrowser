import Database from "client/Database"
import getStyle from 'client/utils/getStyle';
import loadStyleStore, {iterateStore} from "../store"


export default function onUpdateStyle(selectedCollection?: string, selectedIndex?: number) {
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

    if( confirm(`Replace style "${targetStyle.name}" params to the currently selected?`) ) {
        const newStyle = getStyle({collectionId: selectedCollection, isUpdate: true});
        if(!newStyle) return;

        for(const i in newStyle) {
            (targetStyle as any)[i] = (newStyle as any)[i];
        }

        /**
         * Removing fields that are not part of the style anymore.
         * Some fields like name or previewImage must be kept in the object.
         * TODO: I probably should check dictionary of fields that can be added/removed
         * instead of hardcoding check for things like a name
         */
        for(const i in targetStyle) {
            if(i === "name") continue;
            if(i === "previewImage") continue;

            if(!(newStyle as any)[i]) delete (targetStyle as any)[i];
        }

        Database.updateStyles(selectedCollection);
        iterateStore();
    }
}
