import {setShowPromptScribe} from "client/store";
import {setSelectedNewPrompts} from '../store';


export default function onClose() {
    setShowPromptScribe(false);
    setSelectedNewPrompts([]);
}
