import Prompt from "clientTypes/prompt";
import Style from "clientTypes/style";

type Data = {

    categories: string[];

    united: Prompt[];

    unitedList: {
        [key: string]: Prompt;
    };

    original: {
        [key: string]: Prompt[];
    }

    styles: {
        [key: string]: Style[];
    }
}

export default Data;
