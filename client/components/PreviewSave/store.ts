import { create } from 'zustand'


export type PreviewStore = {
    previewCollection: string;
}

const previewStore = create<PreviewStore>((set) => ({
    previewCollection: "",
}));

export const setPreviewCollection = (previewCollection: string) => previewStore.setState({previewCollection});

export default previewStore;
