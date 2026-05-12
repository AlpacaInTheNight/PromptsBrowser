import tagTooltipStore, {setPossibleTags} from "../store";
import { PossibleTag } from "../type";


export default function processCarretPosition(e: React.KeyboardEvent | React.MouseEvent | React.FocusEvent) {
    const target = e.currentTarget as HTMLInputElement;
    const {knownTags = []} = tagTooltipStore.getState();

    const MAX_HINTS = 20;
    let currHints = 0;
    const value = target.value;
    const caret = target.selectionStart;
    const stopSymbols = [",", "(", ")", "<", ">", ":"];
    let position = caret;
    let word = "";
    let wordStart = caret;
    let wordEnd = caret;

    while(value[position]) {
        if(value[position] && stopSymbols.includes(value[position])) break;

        word += value[position];
        position++;
        wordEnd = position;
    }

    position = caret - 1;
    while(value[position]) {
        if(value[position] && stopSymbols.includes(value[position])) break;

        word = value[position] + word;
        wordStart = position;
        position--;
    }

    word = word.trim();
    if(!word) {
        target.dataset.hint = "";
        setPossibleTags([]);
        return;
    }

    word = word.toLowerCase();
    const possibleTags: PossibleTag[] = [];

    for(const tag of knownTags) {
        if(currHints >= MAX_HINTS) break;

        if(tag.toLowerCase().includes(word)) {

            possibleTags.push({
                value: tag,
                wordStart,
                wordEnd,
            });

            currHints++;
        }
    }

    setPossibleTags(possibleTags);
}
