import appStore, {setEditStyle, setEditTargetCollection} from 'client/store'
import Database from 'client/Database'


export default function onSaveStyle() {
    const {editStyle, editTargetCollection} = appStore.getState();
    const {readonly} = Database.meta;
    const {data} = Database;
    if(readonly || !data.styles) return;
    if(!editStyle || !editTargetCollection) return;

    const targetCollection = data.styles[editTargetCollection];
    if(!targetCollection) return;

    const targetIndex = targetCollection.findIndex(styleItem => styleItem.name === editStyle.name)
    if(targetIndex === -1) return;

    targetCollection[targetIndex] = editStyle;
    Database.updateStyles(editTargetCollection);

    setEditStyle(undefined);
    setEditTargetCollection(undefined);
}
