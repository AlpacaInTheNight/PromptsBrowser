import { makeFileNameSafe, normalizePrompt } from "client/utils/index";
import { EMPTY_CARD_GRADIENT, NEW_CARD_GRADIENT } from "client/const";
import { getCheckpoint } from "client/utils/index";
import Prompt from "clientTypes/prompt";
import Database from "./index";


function getModelPreview({targetPrompt, desiredCollection, desiredModel, targetModelOnly = false}: {
    targetPrompt: Prompt;
    desiredCollection?: string;
    desiredModel?: string | false;
    targetModelOnly?: boolean;
}): string | false {
    if(!targetPrompt.knownModelPreviews) return false;
    if(!desiredModel) desiredModel = getCheckpoint();
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

    if(targetModelOnly && !foundDesiredModel) return false;

    if(targetCollection && targetModel && targetFile) {
        const safeFileName = makeFileNameSafe(targetPrompt.id);
        return `${targetCollection}/${targetModel}/${safeFileName}.${targetFile}`;
    }

    return false;
}

function getPromptPreviewURL({prompt, collectionId, model, filesIteration = 0, filterCollection}: {
    prompt: string;
    collectionId?: string;
    model?: string | false;
    filesIteration?: number;
    filterCollection?: string;
}) {
    if(!prompt) return NEW_CARD_GRADIENT;
    const apiUrl = Database.getAPIurl("promptImage");
    const {data} = Database;
    const {united} = data;
    let fileExtension = "";

    let targetPrompt = united.find(item => item.id.toLowerCase() === prompt.toLowerCase());

    //if no target prompt found - searching for the normalized version of the target prompt
    if(!targetPrompt) {
        const normalizedPrompt = normalizePrompt({prompt, data});
        targetPrompt = united.find(item => item.id.toLowerCase() === normalizedPrompt.toLowerCase());
    }

    //if no prompt found - returning New Card image.
    if(!targetPrompt) return NEW_CARD_GRADIENT;
    if(!collectionId && filterCollection) collectionId = filterCollection;

    //checking target model previews
    if(model !== false && targetPrompt.knownModelPreviews) {
        const modelPreviewPath = getModelPreview({
            targetPrompt,
            desiredCollection: collectionId,
            targetModelOnly: true,
            desiredModel: model || false,
        });
        
        if(modelPreviewPath) {
            return `url("${apiUrl}/${modelPreviewPath}?${filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
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

    if(!collectionId || !fileExtension) {

        if(model !== false) {
            const anyModelPreviewPath = getModelPreview({
                targetPrompt,
                desiredCollection: collectionId,
                targetModelOnly: false,
            });
            
            if(anyModelPreviewPath) {
                return `url("${apiUrl}/${anyModelPreviewPath}?${filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
            }
        }

        return EMPTY_CARD_GRADIENT;
    }

    const safeFileName = makeFileNameSafe(prompt);

    const url = `url("${apiUrl}/${collectionId}/${safeFileName}.${fileExtension}?${filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
    return url;
}

export default getPromptPreviewURL;

export {
    getModelPreview,
}
