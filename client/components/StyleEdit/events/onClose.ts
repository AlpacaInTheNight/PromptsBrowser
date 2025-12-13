import {setEditStyle} from 'client/store'


export default function onClose() {
    setEditStyle(undefined);
}
