import Style, { AddStyleType } from "clientTypes/style";
import ActivePrompts from "./index";
import applyForm from "./utils/applyForm";
import applyPositive from "./utils/applyPositive";


export default function applyStyle(style: Style, isAfter: boolean, override: boolean = false) {
    if(!style) return;

    const {positive, addType = AddStyleType.UniqueRoot} = style;
    if(override) ActivePrompts.setCurrentPrompts([]);

    applyPositive(positive, isAfter, addType);
    applyForm(style);

    ActivePrompts.updateTextArea();

    return true;
}
