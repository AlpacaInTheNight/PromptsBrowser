import json
import os
import shutil
from urllib.parse import unquote
from os.path import join, isdir, isfile
from modules.shared import opts

from . import constant

from .resize_image import resize_image
from .utils import makeFileNameSafe
from .utils import getCollectionsDir
from .utils import emitMessage

def savePreview(postJSON):
    src = unquote(postJSON.src)
    prompt = postJSON.prompt
    collection = postJSON.collection
    model = makeFileNameSafe(postJSON.model)
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

    collDir = getCollectionsDir()

    pathPromptsCatalogue    = join(collDir, constant.PROMPTS_DIR)
    pathPreviewsCatalogue   = join(pathPromptsCatalogue, collection, "preview")
    savePath                = join(pathPreviewsCatalogue, safeFileName + fileExtension)

    possiblePrevJPG         = join(pathPreviewsCatalogue, safeFileName + ".jpg")
    possiblePrevPNG         = join(pathPreviewsCatalogue, safeFileName + ".png")

    if model and hasattr(opts, "pbe_preview_for_model") and opts.pbe_preview_for_model == True:
        #making dir for the target model if needed
        modelDir = join(pathPreviewsCatalogue, model)
        if not isdir(modelDir): os.makedirs(modelDir)

        #changing savePath to model dir one
        savePath = join(modelDir, safeFileName + fileExtension)
        possiblePrevJPG = join(modelDir, safeFileName + ".jpg")
        possiblePrevPNG = join(modelDir, safeFileName + ".png")

    #removing any previous previews
    if isfile(possiblePrevJPG): os.remove(possiblePrevJPG)
    if isfile(possiblePrevPNG): os.remove(possiblePrevPNG)
    
    #copying image
    shutil.copy(src, savePath)

    #resize image
    resize_image(savePath)

    #updating collection data
    pathToMetaFile      = join(pathPromptsCatalogue, collection, "meta.json")
    pathToDataFile      = join(pathPromptsCatalogue, collection, "data.json")
    pathToOrderFile     = join(pathPromptsCatalogue, collection, "order.json")

    newPromptDefault = {"id": prompt, "tags": [], "category": []}

    if isExternalNetwork: newPromptDefault["isExternalNetwork"] = True

    #"short" | "expanded"
    format = "short"

    if isfile(pathToMetaFile):
        f = open(pathToMetaFile)
        metaFile = json.load(f)
        f.close()
        if metaFile["format"]: format = metaFile["format"]

    #saving data in case of the short format collection
    if format == "short":
        if not isfile(pathToDataFile):
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

        promptsDir = join(pathPromptsCatalogue, collection, "prompts")
        filePath = join(promptsDir, safeFileName + ".json")

        if not isdir(promptsDir): os.makedirs(promptsDir)

        if not isfile(filePath):
            if(not isfile(pathToOrderFile) or os.path.getsize(pathToOrderFile) == 0): orderFile = []
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

