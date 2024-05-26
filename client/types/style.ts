import Prompt from "clientTypes/prompt";

type Style = {
    name: string;

    id?: string;

    positive?: Prompt[];

    negative?: string;

    height?: number;

    width?: number;

    cfg?: number;

    steps?: number;

    sampling?: string;

    previewImage?: "png" | "jpg";

    seed?: number;
}

export default Style;
