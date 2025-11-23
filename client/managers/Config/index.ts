import ConfigType from './type';
import { AddStyleType } from "clientTypes/style";

export default class ConfigManager {

    private static config: ConfigType = {
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

        supportExtendedSyntax: true,

        savePreviewForModel: false,

        saveStyleMeta: {
            addType: AddStyleType.UniqueRoot,
            positive: true,
            seed: false,
            size: false,
            quality: false,
            sampler: false,
            negative: false,
        },

        updateStyleMeta: {
            addType: AddStyleType.UniqueRoot,
            positive: true,
            seed: false,
            size: false,
            quality: false,
            sampler: false,
            negative: false,
        },
    };

    public static getConfig(): ConfigType {

        return {...ConfigManager.config};
    }

    public static setConfig(config: Partial<ConfigType> = {}) {
        ConfigManager.config = {...ConfigManager.config, ...config};

        localStorage.setItem("PBE_config", JSON.stringify(ConfigManager.config));
    }
}
