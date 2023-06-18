import json
import os
import constant
import shutil

from utils import makeFileNameSafe
from utils import getWebUIDirectory
from utils import emitMessage

def savePreview(postJSON):
    src = postJSON["src"]
    prompt = postJSON["prompt"]
    collection = postJSON["collection"]
    isExternalNetwork = False

    if "isExternalNetwork" in postJSON and postJSON["isExternalNetwork"]: isExternalNetwork = True

    if not src or not prompt or not collection: return "failed"

    if not os.path.isfile(src):
        emitMessage(f'failed to save preview: file "{src}" not found')
        return "failed"
    
    #saving preview image
    urlArr = src.split("/")
    fileName = urlArr[-1]
    fileExtension = os.path.splitext(fileName)[1]
    safeFileName = makeFileNameSafe(prompt)

    webUIDir = getWebUIDirectory()
    promptsCataloguePath = webUIDir + constant.PROMPTS_FOLDER + os.sep
    savePath = promptsCataloguePath + collection + os.sep + "preview" + os.sep
    savePath += safeFileName + fileExtension
    
    shutil.copy(src, savePath)

    #updating collection data
    pathToMetaFile = promptsCataloguePath + collection + os.sep + "meta.json"
    pathToDataFile = promptsCataloguePath + collection + os.sep + "data.json"
    pathToOrderFile = promptsCataloguePath + collection + os.sep + "order.json"
    newPromptDefault = {"id": prompt, "tags": [], "category": []}

    if isExternalNetwork: newPromptDefault["isExternalNetwork"] = True

    #"short" | "expanded"
    format = "short"

    if os.path.isfile(pathToMetaFile):
        f = open(pathToMetaFile)
        metaFile = json.load(f)
        f.close()
        if metaFile["format"]: format = metaFile["format"]

    #saving data in case of the short format collection
    if format == "short":
        if not os.path.isfile(pathToDataFile):
            emitMessage('collection format is set to "short", but file "data.json" is not found')
            return "failed"

        if(os.path.getsize(pathToDataFile) == 0): dataFile = []
        else:
            f = open(pathToDataFile)
            dataFile = json.load(f)
            f.close()

        if not any(item['id'] == prompt for item in dataFile):
            dataFile.append(newPromptDefault)
            with open(pathToDataFile, 'w') as outfile: json.dump(dataFile, outfile, indent="\t")
    
    #saving data in case of the expanded format collection
    elif format == "expanded":
        safeFileName = makeFileNameSafe(prompt)
        promptsFolder = promptsCataloguePath + collection + os.sep + "prompts"
        filePath = promptsFolder + os.sep + safeFileName + ".json"

        if not os.path.isdir(promptsFolder): os.makedirs(promptsFolder)

        if not os.path.isfile(filePath):
            if(not os.path.isfile(pathToOrderFile) or os.path.getsize(pathToOrderFile) == 0): orderFile = []
            else:
                f = open(pathToOrderFile)
                orderFile = json.load(f)
                f.close()
            
            with open(filePath, 'w') as outfile: json.dump(newPromptDefault, outfile, indent="\t")

            if not prompt in orderFile:
                orderFile.append(prompt)
                with open(pathToOrderFile, 'w') as outfile: json.dump(orderFile, outfile, indent="\t")


    emitMessage("updated preview and data for: " + collection)
    return "ok"

