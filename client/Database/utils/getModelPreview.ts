import { makeFileNameSafe } from "client/utils/index"
import getCheckpoint from "client/utils/getCheckpoint"
import Prompt from "clientTypes/prompt"


export default function getModelPreview({targetPrompt, desiredCollection, desiredModel, targetModelOnly = false}: {
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
