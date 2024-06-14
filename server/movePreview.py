import os
import shutil
from os.path import join, isdir, isfile

from . import constant

from .utils import makeFileNameSafe
from .utils import getCollectionsDir
from .utils import emitMessage

def moveModelPreviews(postJSON):
    item = postJSON.item
    itemFrom = postJSON.movefrom
    itemTo = postJSON.to
    itemType = postJSON.type

    if not item or not itemFrom or not itemTo or not itemType: return "failed"

    collDir = getCollectionsDir()

    pathPromptsCatalogue    = join(collDir, constant.PROMPTS_DIR)
    pathToPreviewDir        = join(pathPromptsCatalogue, itemFrom, "preview")
    safeFileName            = makeFileNameSafe(item)

    colModelsDirs = os.listdir(pathToPreviewDir)
    for colModelDirName in colModelsDirs:
        if not isdir(join(pathToPreviewDir, colModelDirName)): continue

        pathToPreviewDir        = join(pathPromptsCatalogue, itemFrom, "preview", colModelDirName)
        pathSaveDest            = join(pathPromptsCatalogue, itemTo, "preview", colModelDirName)
        os.makedirs(pathSaveDest, exist_ok=True)

        extension = ".png"

        imageFileNames = [filename for filename in os.listdir(pathToPreviewDir) if filename.endswith('.jpg') or filename.endswith('.png')]
        if safeFileName + ".png" in imageFileNames: extension = ".png"
        elif safeFileName + ".jpg" in imageFileNames: extension = ".jpg"
        else: continue

        sourcePath = join(pathToPreviewDir, safeFileName + extension)
        savePath = join(pathSaveDest, safeFileName + extension)

        if not isfile(sourcePath): continue

        if itemType == "copy":
            shutil.copy(sourcePath, savePath)
            emitMessage(f'preview image: copied prompt preview "{item}" from "{itemFrom}" to "{itemTo}" for model "{colModelDirName}"')

        elif itemType == "move":
            shutil.move(sourcePath, savePath)
            emitMessage(f'preview image: moved prompt preview "{item}" from "{itemFrom}" to "{itemTo}" for model "{colModelDirName}"')
        
        elif itemType == "delete":
            os.remove(sourcePath)
            emitMessage(f'preview image: deleted prompt preview "{item}" from "{itemFrom}" for model "{colModelDirName}"')
        
        return "ok"

def movePreview(postJSON):
    item = postJSON.item
    itemFrom = postJSON.movefrom
    itemTo = postJSON.to
    itemType = postJSON.type

    if not item or not itemFrom or not itemTo or not itemType: return "failed"

    moveModelPreviews(postJSON)

    collDir = getCollectionsDir()

    pathPromptsCatalogue    = join(collDir, constant.PROMPTS_DIR)
    pathToPreviewDir        = join(pathPromptsCatalogue, itemFrom, "preview")
    pathSaveDest            = join(pathPromptsCatalogue, itemTo, "preview")

    safeFileName = makeFileNameSafe(item)

    extension = ".png"

    imageFileNames = [filename for filename in os.listdir(pathToPreviewDir) if filename.endswith('.jpg') or filename.endswith('.png')]
    if safeFileName + ".png" in imageFileNames: extension = ".png"
    elif safeFileName + ".jpg" in imageFileNames: extension = ".jpg"
    else:
        emitMessage(f'preview image {itemType}: no image "{safeFileName}.png" or "{safeFileName}.jpg" found')
        return "failed"

    sourcePath = join(pathToPreviewDir, safeFileName + extension)
    savePath = join(pathSaveDest, safeFileName + extension)

    if not isfile(sourcePath):
        emitMessage(f'preview image {itemType}: source file "{sourcePath}" not found')
        return "failed"

    if itemType == "copy":
        shutil.copy(sourcePath, savePath)
        emitMessage(f'preview image: copied prompt preview "{item}" from "{itemFrom}" to "{itemTo}"')

    elif itemType == "move":
        shutil.move(sourcePath, savePath)
        emitMessage(f'preview image: moved prompt preview "{item}" from "{itemFrom}" to "{itemTo}"')
    
    elif itemType == "delete":
        os.remove(sourcePath)
        emitMessage(f'preview image: deleted prompt preview "{item}" from "{itemFrom}"')
    
    return "ok"
