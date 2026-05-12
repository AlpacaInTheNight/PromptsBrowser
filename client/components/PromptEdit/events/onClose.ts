import {setEditPrompt, setEditTargetCollection} from 'client/store'


export default function onClose() {
    setEditPrompt(undefined);
    setEditTargetCollection(undefined);
}
