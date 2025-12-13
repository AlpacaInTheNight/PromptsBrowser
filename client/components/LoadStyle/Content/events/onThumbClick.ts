import Database from "client/Database";
import loadStyleStore, {setSelectedStyle, setSelectedCollection, setSelectedName, setSelectedIndex} from "client/components/LoadStyle/store";
import { setEditStyle, setEditTargetCollection } from "client/store";
import onApplyStyle from "client/components/LoadStyle/events/onApplyStyle";
import onRemoveStyle from "client/components/LoadStyle/events/onRemoveStyle";


export default function onThumbClick(e: React.MouseEvent<HTMLDivElement>, idKey: string, name: string, collection: string, index: number) {
    const {data} = Database;

    const {selectedStyle} = loadStyleStore.getState();

    const isShift = e.shiftKey;
    const isCtrl = e.metaKey || e.ctrlKey;
    const isAlt = e.altKey;

    if(!isShift && !isCtrl && selectedStyle === idKey) {
        setSelectedStyle("");
        setSelectedName("");
        setSelectedCollection("");
        setSelectedIndex();

        return;
    }

    setSelectedStyle(idKey);
    setSelectedName(name);
    setSelectedCollection(collection);
    setSelectedIndex(index);

    if(isCtrl && !isShift) {
        onApplyStyle(true);

    } else if(isCtrl && isShift) {
        onApplyStyle(false);

    } else if(isShift) {
        const targetCollection = data.styles[collection];
        if(!targetCollection) return false;

        const targetStyle = data.styles[collection][index];
        if(!targetStyle) return false;

        setEditTargetCollection(collection);
        setEditStyle(JSON.parse(JSON.stringify(targetStyle)));
    }

    /* if(isShift) onApplyStyle(false);
    else if(isCtrl) onRemoveStyle(collection, index); */
}
