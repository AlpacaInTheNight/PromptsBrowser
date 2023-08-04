import json
import os
import constant

from utils import makeFileNameSafe
from utils import getWebUIDirectory
from utils import emitMessage
from utils import removeUnusedPreviews

def savePrompts(postJSON):
    data = postJSON["data"]
    collection = postJSON["collection"]
    noClear = False
    if "noClear" in postJSON: noClear = postJSON["noClear"]

    if not data or not collection: return

    #"short" | "expanded"
    format = "short"

    webUIDir = getWebUIDirectory()
    promptsCataloguePath = webUIDir + constant.PROMPTS_FOLDER + os.sep

    pathToCollection = promptsCataloguePath + collection + os.sep
    pathToDataFile = pathToCollection + "data.json"
    pathToMetaFile = pathToCollection + "meta.json"

    if os.path.isfile(pathToMetaFile):
        f = open(pathToMetaFile)
        metaFile = json.load(f)
        f.close()
        if metaFile["format"]: format = metaFile["format"]
    
    if format == "short": result = saveCollectionShort(pathToDataFile, data, collection, noClear)
    elif format == "expanded": result = saveCollectionExpanded(pathToCollection, data, collection, noClear)

    return result


def saveCollectionShort(pathToDataFile, data, collection, noClear):
    if not data or not collection or not pathToDataFile: return "failed"

    dataJSON = json.loads(data)

    with open(pathToDataFile, 'w') as outfile: json.dump(dataJSON, outfile, indent="\t")
    emitMessage("updated prompt collection: " + collection)

    if not noClear: removeUnusedPreviews(collection, dataJSON)

    return "ok"


def saveCollectionExpanded(pathToCollection, data, collection, noClear):
    if not data or not collection or not pathToCollection: return "failed"

    dataJSON = json.loads(data)
    promptsFolder = pathToCollection + "prompts"
    if not os.path.isdir(promptsFolder): os.makedirs(promptsFolder)

    promptOrder = []
    expectedFiles = []

    for promptItem in dataJSON:
        if not "id" in promptItem or not promptItem["id"]: continue
        promptId = promptItem["id"]

        safeFileName = makeFileNameSafe(promptId)
        expectedFiles.append(safeFileName + ".json")
        promptOrder.append(promptId)

        pathToPromptFile = promptsFolder + os.sep + safeFileName + ".json"

        if os.path.isfile(pathToPromptFile):
            f = open(pathToPromptFile)
            promptJSON = json.load(f)
            f.close()

            if(promptItem != promptJSON):
                with open(pathToPromptFile, 'w') as outfile: json.dump(promptItem, outfile, indent="\t")
                emitMessage(f'update prompts: changed prompt: "{promptItem["id"]}" in collection "{collection}"')

        else:
            with open(pathToPromptFile, 'w') as outfile: json.dump(promptItem, outfile, indent="\t")
            emitMessage(f'update prompts: added prompt: "{promptId}" to collection "{collection}"')
        
    jsonFileNames = [filename for filename in os.listdir(promptsFolder) if filename.endswith('.json')]
    for fileName in jsonFileNames:
        if fileName not in expectedFiles:
            pathToPromptFile = promptsFolder + os.sep + fileName
            os.remove(pathToPromptFile)
            emitMessage(f'update prompts: removed prompt file: "{fileName}" from collection "{collection}"')
    
    with open(pathToCollection + "order.json", 'w') as outfile: json.dump(promptOrder, outfile, indent="\t")
    
    if not noClear: removeUnusedPreviews(collection, dataJSON)

    return "ok"
