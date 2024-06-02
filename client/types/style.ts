import Prompt, { PromptEntity } from "clientTypes/prompt";

type Style = {
    name: string;

    id?: string;

    positive?: PromptEntity[];

    negative?: string;

    height?: number;

    width?: number;

    cfg?: number;

    steps?: number;

    sampling?: string;

    previewImage?: "png" | "jpg";

    seed?: number;

    addType?: AddStyleType;
}

enum AddStyleType {
    UniqueOnly = "unique only",
    UniqueRoot = "unique root",
    All = "all",
}

export {
    AddStyleType,
}
export default Style;
