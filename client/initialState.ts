import State from "clientTypes/state";

const initialState: State = {
    config: {
        belowOneWeight: 0.05,
        aboveOneWeight: 0.02,

        toLowerCase: true,
        spaceMode: "space",
        showPromptIndex: false,
        autocomplitePromptMode: "all",

        cardWidth: 50,
        cardHeight: 100,
        splashCardWidth: 200,
        splashCardHeight: 300,

        rowsInKnownCards: 3,
        maxCardsShown: 1000,

        resizeThumbnails: true,
        resizeThumbnailsMaxWidth: 300,
        resizeThumbnailsMaxHeight: 300,
        resizeThumbnailsFormat: "JPG",

        /**
         * If true, will enable extended syntax element support for prompts used by some addons.
         */
        supportExtendedSyntax: true,

        saveStyleMeta: {
            positive: true,
            seed: false,
            size: false,
            quality: false,
            sampler: false,
            negative: false,
        },

        updateStyleMeta: {
            positive: true,
            seed: false,
            size: false,
            quality: false,
            sampler: false,
            negative: false,
        },
    },

    showControlPanel: true,
    showViews: ["known", "current", "positive", "negative"],
    currentContainer: "text2Img",
    currentPromptsList: {},
    selectedPrompt: undefined,
    editingPrompt: undefined,
    filesIteration: (new Date().valueOf()), //to avoid getting old image cache
    filterCategory: undefined,
    filterName: undefined,
    filterCollection: undefined,
    filterTags: undefined,
    filterStyleCollection: undefined,
    filterStyleName: undefined,
    newStyleCollection: undefined,
    sortKnownPrompts: undefined,
    copyOrMoveTo: undefined,
    dragItemId: undefined,
    dragCurrentIndex: undefined,
    promptToolsId: undefined,
    collectionToolsId: undefined,
    savePreviewCollection: undefined,
    editTargetCollection: undefined,
    editItem: undefined,
    showStylesWindow: undefined,
    showSaveStyleWindow: undefined,
    showScriberWindow: undefined,
    toggledButtons: ["tools_tags", "tools_category", "tools_name", "tools_replaceMode", "new_in_all_collections", "styles_simplified_view"],
    selectedNewPrompts: [],
    selectedCollectionPrompts: [],
    promptsFilter: {},
    autoGenerateType: "prompt",
    //autoGenerateKeepCurrent: false,
}

export default initialState;
