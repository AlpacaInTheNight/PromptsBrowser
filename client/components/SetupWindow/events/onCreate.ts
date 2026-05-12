import Database from "client/Database";
import setupWindowStore, {setMode, setColName} from "../store";
import { makeFileNameSafe } from "client/utils";


export default function onCrate() {
    let {colName} = setupWindowStore.getState();
    const {colType, mode} = setupWindowStore.getState();
    if(mode === "main") return;
    if(!colName || !colType) return;

    colName = makeFileNameSafe(colName);

    if(mode === "prompts") Database.createNewCollection(colName, colType);
    else if(mode === "styles") Database.createNewStylesCollection(colName, colType);

    setMode("main");
    setColName("");
}
