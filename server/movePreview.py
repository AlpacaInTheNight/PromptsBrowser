import json
import os
import constant
import shutil

from utils import makeFileNameSafe
from utils import getWebUIDirectory
from utils import emitMessage

def movePreview(postJSON):
    item = postJSON["item"]
    itemFrom = postJSON["from"]
    itemTo = postJSON["to"]
    itemType = postJSON["type"]

    if not item or not itemFrom or not itemTo or not itemType: return "failed"

    webUIDir = getWebUIDirectory()
    promptsCataloguePath = webUIDir + constant.PROMPTS_FOLDER + os.sep

    pathToPreviewFolder = promptsCataloguePath + itemFrom + os.sep + "preview" + os.sep
    savePath = promptsCataloguePath + itemTo + os.sep + "preview" + os.sep
    safeFileName = makeFileNameSafe(item)

    extension = ".png"

    imageFileNames = [filename for filename in os.listdir(pathToPreviewFolder) if filename.endswith('.jpg') or filename.endswith('.png')]
    if safeFileName + ".png" in imageFileNames: extension = ".png"
    elif safeFileName + ".jpg" in imageFileNames: extension = ".jpg"
    else:
        emitMessage(f'image {itemType}: no image "{safeFileName}.png" or "{safeFileName}.jpg" found')
        return "failed"

    sourcePath = pathToPreviewFolder + safeFileName + extension
    savePath += safeFileName + extension

    if not os.path.isfile(sourcePath):
        emitMessage(f'image {itemType}: source file "{sourcePath}" not found')
        return "failed"

    if itemType == "copy":
        shutil.copy(sourcePath, savePath)
        emitMessage(f'copied prompt preview "{item}" from "{itemFrom}" to "{itemTo}"')

    elif itemType == "move":
        shutil.move(sourcePath, savePath)
        emitMessage(f'moved prompt preview "{item}" from "{itemFrom}" to "{itemTo}"')
    
    elif itemType == "delete":
        os.remove(sourcePath)
        emitMessage(f'deleted prompt preview "{item}" from "{itemFrom}"')
    
    return "ok"
