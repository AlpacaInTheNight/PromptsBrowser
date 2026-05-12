import Database from "client/Database";
import { setAutogenCol, setAutogenStyle } from '../store';


export default function onChangeAutogenCollection(e: React.ChangeEvent) {
    const {data} = Database;
    const target = e.currentTarget as HTMLSelectElement;
    const collection = target.value;
    let style = "";

    if(collection) {
        const targetCollection = data.styles[collection];

        if(targetCollection) for(const styleItem of targetCollection) {
            style = styleItem.name;
            break;
        }
    }

    setAutogenCol(collection);
    setAutogenStyle(style);
}
