import Prompt, { PromptEntity } from "clientTypes/prompt";
import Filter from "clientTypes/filter";
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

type State = {
    config: Config;

    dragInfo: {
        id?: string;
        index?: number;
        groupId?: number | false;
    }

    promptTools: {
        index?: number;
        groupId?: number | false;
    }

    showControlPanel: boolean;
    showViews: string[];
    currentContainer: string;
    currentPromptsList: {[key: string]: PromptEntity[]};
    selectedPrompt: string | undefined;
    editingPrompt: string | undefined;
    filesIteration: number; //to avoid getting old image cache
    filterCategory: string | undefined;
    filterName: string | undefined;
    filterCollection: string | undefined;
    filterTags: string[];
    filterStyleCollection: string | undefined;
    filterStyleName: string | undefined;
    newStyleCollection: string | undefined;
    sortKnownPrompts: string | undefined;
    copyOrMoveTo: string | undefined;

    //dragItemId: string | undefined;
    //dragCurrentIndex: string | number | undefined;

    //promptToolsId: string | undefined;
    
    collectionToolsId: string | undefined;
    savePreviewCollection: string | undefined;
    editTargetCollection: string | undefined;
    editItem: Prompt | undefined;
    showStylesWindow: boolean | undefined;
    showSaveStyleWindow: boolean | undefined;
    showScriberWindow: boolean | undefined;
    toggledButtons: string[];
    selectedNewPrompts: string[];
    selectedCollectionPrompts: string[];
    promptsFilter: {[key: string]: Filter[]},
    autoGenerateType: "prompt" | "current" | "autogen" | "selected";
    //autoGenerateKeepCurrent: false,
}

export {
    Config,
    ConfigTrackStyleMeta,
}

export default State;
