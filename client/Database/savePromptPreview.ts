import ActivePrompts from "client/managers/ActivePrompts"
import getCheckpoint from "client/utils/getCheckpoint"
import previewStore from "client/components/PreviewSave/store"
import appStore, {setSelectedPrompt, updateFilesIteration} from "client/store"
import Database from "./index"
import { SavePrompt } from "./type"
import getGeneratedImageSrc from "./utils/getGeneratedImageSrc"
import updateInCollections from "./utils/updateInCollections"


export default function savePromptPreview(callUpdate: boolean = true) {
    const {data} = Database;
    const {selectedPrompt} = appStore.getState();
    const {previewCollection} = previewStore.getState();
    const url = Database.getAPIurl("savePreview");
    let isExternalNetwork = false;

    if(!data.original[previewCollection]) return;

    const srcImage = getGeneratedImageSrc();
    if(!srcImage) return;
    const {src, extension} = srcImage;

    //checking if prompt have an external network syntax.
    const targetCurrentPrompt = ActivePrompts.getPromptById({id: selectedPrompt});
    if(targetCurrentPrompt && targetCurrentPrompt.isExternalNetwork) isExternalNetwork = true;

    const saveData: SavePrompt = {src, prompt: selectedPrompt, collection: previewCollection};
    if(isExternalNetwork) saveData.isExternalNetwork = true;

    const checkpoint = getCheckpoint();
    if(checkpoint) saveData.model = checkpoint;

    updateInCollections(isExternalNetwork, extension, checkpoint || "");

    (async () => {

        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(saveData)
        });
        const answer = await rawResponse.json();

        if(answer === "ok" && callUpdate) {
            Database.updateMixedList();

            setSelectedPrompt(undefined);
            updateFilesIteration();
        }

    })();
}
