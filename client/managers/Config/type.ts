import { AddStyleType } from "clientTypes/style";

type Config = {
    belowOneWeight: number;
    aboveOneWeight: number;

    toLowerCase: boolean;
    spaceMode: "space" | "underscore",
    showPromptIndex: boolean;

    cardWidth: number;
    cardHeight: number;
    splashCardWidth: number;
    splashCardHeight: number;

    rowsInKnownCards: number;
    maxCardsShown: number;

    resizeThumbnails: boolean;
    resizeThumbnailsMaxWidth: number;
    resizeThumbnailsMaxHeight: number;
    resizeThumbnailsFormat: "JPG" | "PNG";

    savePreviewForModel: boolean;

    /**
     * If true, will enable extended syntax element support for prompts used by some addons.
     */
    supportExtendedSyntax: boolean;

    saveStyleMeta: ConfigTrackStyleMeta;

    updateStyleMeta: ConfigTrackStyleMeta;

    autocomplitePromptMode: "off" | "prompts" | "styles" | "all";
}

type ConfigTrackStyleMeta = {
    positive: boolean;
    seed: boolean;
    size: boolean;
    quality: boolean;
    sampler: boolean;
    negative: boolean;

    addType: AddStyleType;
}

export default Config;

export {
    Config,
    ConfigTrackStyleMeta,
}
