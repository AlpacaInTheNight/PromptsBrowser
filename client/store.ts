import { create } from 'zustand'
import DOMCache from './DOMCache'
import {DEFAULT_CONTAINER_NAME} from './const'
import Prompt from 'client/types/prompt'
import Style from 'client/types/style'


export enum ViewType {
    KNOWN       = "known",
    CURRENT     = "current",
    POSITIVE    = "positive",
    NEGATIVE    = "negative",
}

export type AppStore = {
    modelIteration: number;
    currentContainer: string;
    showControlPanel: boolean;
    showViews: ViewType[];

    currentIteration: number;
    collectionsIteration: number;
    filesIteration: number;
    sortKnownPrompts: string | undefined;
    filterCollection: string | undefined;
    filterCategory: string | undefined;
    filterName: string | undefined;
    filterTags: string[];

    selectedPrompt: string | undefined;
    editPrompt: Prompt | undefined;
    editStyle: Style | undefined;
    editPromptIndex: number | false;
    editPromptGroup: number | false;
    editTargetCollection: string | undefined;

    showSetupWindow: boolean;
    showLoadStyle: boolean;
    showSaveStyle: boolean;
    showPromptScribe: boolean;
    showCollectionTools: boolean;
    showPromptTools: boolean;
}

export const appStore = create<AppStore>((set) => ({
    modelIteration: 0,
    currentContainer: DEFAULT_CONTAINER_NAME,
    showControlPanel: true,
    showViews: [ViewType.KNOWN, ViewType.CURRENT, ViewType.POSITIVE, ViewType.NEGATIVE],

    currentIteration: 0,
    collectionsIteration: 0,
    filesIteration: 0,
    sortKnownPrompts: undefined,
    filterCollection: undefined,
    filterCategory: undefined,
    filterName: undefined,
    filterTags: [],

    selectedPrompt: undefined,
    editPrompt: undefined,
    editStyle: undefined,
    editPromptIndex: false,
    editPromptGroup: false,
    editTargetCollection: undefined,

    showSetupWindow: false,
    showLoadStyle: false,
    showSaveStyle: false,
    showPromptScribe: false,
    showCollectionTools: false,
    showPromptTools: false,
}));

export const setCurrentContainer = (currentContainer: string) => appStore.setState({currentContainer});

export const setShowControlPanel = (showControlPanel: boolean) => {
    localStorage.setItem("showControlPanel", JSON.stringify(showControlPanel));
    appStore.setState({showControlPanel});
}

export const setShowViews = (showViews: ViewType[]) => appStore.setState({showViews});

export const toggleView = (viewUpdate: ViewType) => appStore.setState(state => {
    let newShowViews = [];

    if(state.showViews.includes(viewUpdate)) newShowViews = state.showViews.filter(viewItem => viewItem !== viewUpdate);
    else newShowViews = [...state.showViews, viewUpdate];

    if( (viewUpdate === ViewType.POSITIVE || viewUpdate === ViewType.NEGATIVE) && DOMCache && DOMCache.containers ) {
        const showPositive = newShowViews.includes(ViewType.POSITIVE);
        const showNegative = newShowViews.includes(ViewType.NEGATIVE);

        for(let containerId in DOMCache.containers) {
            const container = DOMCache.containers[containerId];

            if(container.negativePrompts) container.negativePrompts.style.display = showNegative ? "" : "none";
            if(container.positivePrompts) container.positivePrompts.style.display = showPositive ? "" : "none";
        }
    }

    localStorage.setItem("PBE_showViews", JSON.stringify(newShowViews));
    return {showViews: newShowViews};
});

export const iterateModel = () => appStore.setState(store => ({modelIteration: store.modelIteration + 1}));

export const setFilterCollection = (filterCollection?: string) => appStore.setState(store => ({filterCollection, filesIteration: store.filesIteration + 1}));
export const setFilterCategory = (filterCategory?: string) => appStore.setState({filterCategory});
export const setSortKnownPrompts = (sortKnownPrompts?: string) => appStore.setState({sortKnownPrompts});
export const setFilterName = (filterName?: string) => appStore.setState({filterName});
export const setFilterTags = (filterTags?: string[]) => appStore.setState({filterTags});

export const updateFilesIteration = () => appStore.setState(store => ({filesIteration: store.filesIteration + 1}));
export const updateCurrentIteration = () => appStore.setState(store => ({currentIteration: store.currentIteration + 1}));
export const updateCollectionsIteration = () => appStore.setState(store => ({collectionsIteration: store.collectionsIteration + 1}));

export const setEditStyle = (editStyle?: Style) => appStore.setState({editStyle});

export const setEditPrompt = (editPrompt?: Prompt) => appStore.setState({editPrompt});
export const setEditPromptIndex = (editPromptIndex: number | false = false) => appStore.setState({editPromptIndex});
export const setEditPromptGroup = (editPromptGroup: number | false = false) => appStore.setState({editPromptGroup});
export const setSelectedPrompt = (selectedPrompt?: string) => appStore.setState({selectedPrompt});
export const setEditTargetCollection = (editTargetCollection: string | undefined) => appStore.setState({editTargetCollection});

export const setShowSetupWindowe = (showSetupWindow: boolean) => appStore.setState({showSetupWindow});
export const setShowLoadStyle = (showLoadStyle: boolean) => appStore.setState({showLoadStyle});
export const setShowSaveStyle = (showSaveStyle: boolean) => appStore.setState({showSaveStyle});
export const setShowPromptScribe = (showPromptScribe: boolean) => appStore.setState({showPromptScribe});
export const setShowCollectionTools = (showCollectionTools: boolean) => appStore.setState({showCollectionTools});
export const setShowPromptTools = (showPromptTools: boolean) => appStore.setState({showPromptTools});

export function loadUIConfig() {
    const lsShowViews = localStorage.getItem("PBE_showViews");
    if(lsShowViews) {
        const showViews = JSON.parse(lsShowViews) as ViewType[];
        setShowViews(showViews);
    }

    const showControlPanel = localStorage.getItem("showControlPanel");
    if(showControlPanel === "false") setShowControlPanel(false);
}

export default appStore;

