import promptScribeStore, { setSelectedNewPrompts } from "../store";
import onSelectAll from "./onSelectAll";


export default function onToggleAll() {
    const selectedNewPrompts = promptScribeStore.getState().selectedNewPrompts;

    if(!selectedNewPrompts.length) {
        onSelectAll();

        return;
    }

    setSelectedNewPrompts([]);
}
