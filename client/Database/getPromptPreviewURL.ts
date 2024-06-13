import PromptsBrowser from "client/index";
import { makeFileNameSafe, normalizePrompt } from "client/utils/index";
import { EMPTY_CARD_GRADIENT, NEW_CARD_GRADIENT } from "client/const";
import { getCheckpoint } from "client/utils/index";
import Prompt from "clientTypes/prompt";
import Database from "./index";

function getModelPreview(targetPrompt: Prompt, desiredCollection?: string): string | false {
    if(!targetPrompt.knownModelPreviews) return false;
    let desiredModel = getCheckpoint();
    if(desiredModel) desiredModel = makeFileNameSafe(desiredModel);
    let foundDesiredModel: boolean = false;

    let targetCollection: string = "";
    let targetModel: string = "";
    let targetFile: string = "";

    for(const colId in targetPrompt.knownModelPreviews) {
        const models = targetPrompt.knownModelPreviews[colId];
        if(!models) continue;

        //checking all models if no preview for desired model found yet
        if(!foundDesiredModel) {
            for(const modelId in models) {
                const fileItem = models[modelId];

                if(fileItem) {
                    targetFile = fileItem;
                    targetModel = modelId;
                    targetCollection = colId;

                    if(modelId === desiredModel) {
                        foundDesiredModel = true;
                        break;
                    }
                }
            }
        } else if(desiredModel && models[desiredModel]) {//checking only preview for desired model if found it in any other collection
            targetFile = models[desiredModel];
            targetModel = desiredModel;
            targetCollection = colId;
        }

        if(foundDesiredModel && colId === desiredCollection) break;
    }

    if(targetCollection && targetModel && targetFile) {
        const safeFileName = makeFileNameSafe(targetPrompt.id);
        return `${targetCollection}/${targetModel}/${safeFileName}.${targetFile}`;
    }

    return false;
}

function getPromptPreviewURL(prompt: string, collectionId?: string) {
    if(!prompt) return NEW_CARD_GRADIENT;
    const apiUrl = Database.getAPIurl("promptImage");
    const {data} = Database;
    const {united} = data;
    const {state} = PromptsBrowser;
    let fileExtension = "";

    let targetPrompt = united.find(item => item.id.toLowerCase() === prompt.toLowerCase());

    //if no target prompt found - searching for the normalized version of the target prompt
    if(!targetPrompt) {
        const normalizedPrompt = normalizePrompt({prompt, state, data});
        targetPrompt = united.find(item => item.id.toLowerCase() === normalizedPrompt.toLowerCase());
    }

    //if no prompt found - returning New Card image.
    if(!targetPrompt) return NEW_CARD_GRADIENT;
    if(!collectionId && state.filterCollection) collectionId = state.filterCollection;

    //checking target model previews
    if(targetPrompt.knownModelPreviews) {
        const modelPreviewPath = getModelPreview(targetPrompt, collectionId);
        if(modelPreviewPath) {
            return `url("${apiUrl}/${modelPreviewPath}?${state.filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
        }
    }

    //checking general previews
    if(!targetPrompt.knownPreviews) return NEW_CARD_GRADIENT;

    if(collectionId && targetPrompt.knownPreviews[collectionId])
        fileExtension = targetPrompt.knownPreviews[collectionId];
    
    if(!fileExtension) {
        for(let colId in targetPrompt.knownPreviews) {
            fileExtension = targetPrompt.knownPreviews[colId];
            collectionId = colId;
            break;
        }
    }

    if(!collectionId) return EMPTY_CARD_GRADIENT;
    if(!fileExtension) return EMPTY_CARD_GRADIENT;

    const safeFileName = makeFileNameSafe(prompt);

    const url = `url("${apiUrl}/${collectionId}/${safeFileName}.${fileExtension}?${state.filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
    return url;
}

export default getPromptPreviewURL;
