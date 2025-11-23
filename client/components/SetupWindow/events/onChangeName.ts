import { makeFileNameSafe } from "client/utils";
import { setColName } from "../store";


export default function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.currentTarget as HTMLInputElement;
    let value = target.value;
    if(!value) return;

    value = makeFileNameSafe(value);
    
    setColName(value);
}