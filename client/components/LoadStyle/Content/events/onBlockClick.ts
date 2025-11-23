import loadStyleStore, {setSelectedStyle, setSelectedCollection, setSelectedName, setSelectedIndex} from "../../store";


export default function onBlockClick(idKey: string, name: string, collection: string, index: number) {
    const {selectedStyle} = loadStyleStore.getState();

    if(selectedStyle === idKey) {
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
}
