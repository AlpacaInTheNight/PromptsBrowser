import loadStyleStore, {setSelectedStyle, setSelectedCollection, setSelectedName, setSelectedIndex} from "../../store";
import onApplyStyle from "../../events/onApplyStyle";
import onRemoveStyle from "../../events/onRemoveStyle";


export default function onThumbClick(e: React.MouseEvent<HTMLDivElement>, idKey: string, name: string, collection: string, index: number) {
    const {selectedStyle} = loadStyleStore.getState();

    const isShift = e.shiftKey;
    const isCtrl = e.metaKey || e.ctrlKey;

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

    if(isShift) onApplyStyle(false);
    else if(isCtrl) onRemoveStyle(collection, index);
}
