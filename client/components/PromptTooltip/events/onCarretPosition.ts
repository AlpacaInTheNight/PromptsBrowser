import ConfigManager from 'client/managers/Config'
import {setWord, setEnd, setStart} from '../store'
import gradioApp from 'client/utils/gradioApp'
import updateWindowPosition from './updateWindowPosition'
import onHintWindowKey from './onHintWindowKey'
import { STOP_SYMBOLS } from '../const'


export default function onCarretPosition(e: KeyboardEvent | MouseEvent) {
    const target = e.currentTarget as HTMLTextAreaElement;
    const keyCode: number | undefined = (e as any).keyCode;
    const {autocomplitePromptMode = "prompts"} = ConfigManager.getConfig();
    if(autocomplitePromptMode === "off") return;

    const doc = gradioApp();
    const activeElement = (doc as any).activeElement || document.activeElement;
    const textArea = target;
    const isFocused = activeElement === textArea;
    if(!isFocused) {
        setWord("");
        return;
    };

    if(keyCode === 38 || keyCode === 40 || keyCode === 13) {
        const block = onHintWindowKey(e as KeyboardEvent);

        /* if(block) {
            console.log("blocking event propagation");
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();

            return false;
        } */
    }

    const value = textArea.value;
    const caret = textArea.selectionStart;
    let position = caret;
    let word = "";
    let wordStart = caret;
    let wordEnd = caret;

    while(value[position]) {
        if(value[position] && STOP_SYMBOLS.includes(value[position])) break;

        word += value[position];
        position++;
        wordEnd = position;
    }

    position = caret - 1;
    while(value[position]) {
        if(value[position] && STOP_SYMBOLS.includes(value[position])) break;

        word = value[position] + word;
        wordStart = position;
        position--;
    }

    word = word.trim();
    if(!word) {
        setWord("");
        return;
    }

    word = word.toLowerCase();

    updateWindowPosition();
    setWord(word);
    setEnd(wordEnd);
    setStart(wordStart);
}
