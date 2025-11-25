import appStaticStore from 'client/staticStore'


export default function onDocumentKey(e: KeyboardEvent) {
    if(e.key !== "Escape") return;

    if(appStaticStore.onClose) {
        appStaticStore.onClose();
        appStaticStore.onClose = undefined;
    }
}
