import Database from 'client/Database';
import saveStyleStore from '../store';
import Style from 'client/types/style';
import getStyle from 'client/utils/getStyle';
import {updateCurrentIteration, setShowSaveStyle} from 'client/store';


export default function onSaveStyle() {
    const {data} = Database;
    const {styleName, collectionId} = saveStyleStore.getState();
    if(!styleName || !collectionId) return;

    const targetCollection = data.styles[collectionId];
    if(!targetCollection) return;

    const newStyle = getStyle({styleName, collectionId});
    if(!newStyle) return;

    targetCollection.push(newStyle as Style);
    Database.updateStyles(collectionId);
    updateCurrentIteration();
    setShowSaveStyle(false)
}
