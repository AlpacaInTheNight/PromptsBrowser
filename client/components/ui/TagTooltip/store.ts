import { create } from 'zustand'
import { PossibleTag } from './type';


export const TagTooltipStaticStore: {
    onUpdate: ((tags: string[]) => void) | undefined;
    selectedIndex: number;
} = {
    onUpdate: undefined,
    selectedIndex: 0,
}

export type TagTooltipStore = {
    iterate: number;

    /**
     * List of all known tags
     */
    knownTags: string[];

    /**
     * List of tags suitable for autocompletion of the entered word
     */
    possibleTags: PossibleTag[];

    autocompliteBox: HTMLDivElement | undefined;
    inputElement: HTMLInputElement | undefined;
}

const tagTooltipStore = create<TagTooltipStore>((set) => ({
    iterate: 0,
    knownTags: [],
    possibleTags: [],

    autocompliteBox: undefined,
    inputElement: undefined,
}));

export const iterateStore = () => tagTooltipStore.setState({iterate: tagTooltipStore.getState().iterate + 1});

export const setKnownTags = (knownTags: string[]) => tagTooltipStore.setState({knownTags});
export const setAutocompliteBox = (autocompliteBox: HTMLDivElement | undefined) => tagTooltipStore.setState({autocompliteBox});
export const setInputElement = (inputElement: HTMLInputElement | undefined) => tagTooltipStore.setState({inputElement});

export const setPossibleTags = (possibleTags: PossibleTag[]) => tagTooltipStore.setState({ possibleTags });

export default tagTooltipStore;
