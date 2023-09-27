import json
import os
import shutil
from urllib.parse import unquote
from os.path import join, isdir, isfile

from . import constant

from .utils import makeFileNameSafe
from .utils import getCollectionsDir
from .utils import emitMessage

def saveStylePreview(postJSON):
    src = unquote(postJSON.src)
    style = postJSON.style
    collection = postJSON.collection
    
    if not src or not style or not collection: return "failed"

    if not os.path.isfile(src):
        emitMessage(f'failed to save preview: file "{src}" not found')
        return "failed"
    
    #saving preview image
    urlArr = src.split("/")
    fileName = urlArr[-1]
    fileExtension = os.path.splitext(fileName)[1]
    safeFileName = makeFileNameSafe(style)

    collDir = getCollectionsDir()

    stylesCataloguePath     = join(collDir, constant.STYLES_DIR)
    collectionPath          = join(stylesCataloguePath, collection, "preview")

    if not isdir(collectionPath): os.makedirs(collectionPath)

    savePath = join(collectionPath, safeFileName + fileExtension)
    if fileExtension[0] == ".": fileExtension = fileExtension[1:]

    #removing any previous previews
    if isfile(join(collectionPath, safeFileName + ".jpg")): os.remove(join(collectionPath, safeFileName + ".jpg"))
    if isfile(join(collectionPath, safeFileName + ".png")): os.remove(join(collectionPath, safeFileName + ".png"))

    shutil.copy(src, savePath)

    #updating collection data
    pathToMetaFile      = join(stylesCataloguePath, collection, "meta.json")
    pathToDataFile      = join(stylesCataloguePath, collection, "data.json")
    pathToOrderFile     = join(stylesCataloguePath, collection, "order.json")

    newStyleDefault = {"name": style}

    #"short" | "expanded"
    format = "short"

    if isfile(pathToMetaFile):
        f = open(pathToMetaFile)
        metaFile = json.load(f)
        f.close()
        if metaFile["format"]: format = metaFile["format"]


    #saving data in case of the short format collection
    if format == "short":
        if not isfile(pathToDataFile) or os.path.getsize(pathToDataFile) == 0: dataFile = []
        else:
            f = open(pathToDataFile)
            dataFile = json.load(f)
            f.close()

        targetStyle = next((item for item in dataFile if item['name'] == style), None)
        if targetStyle:
            targetStyle["previewImage"] = fileExtension
            with open(pathToDataFile, 'w') as outfile: json.dump(dataFile, outfile, indent="\t")

    #saving data in case of the expanded format collection
    elif format == "expanded":
        safeFileName = makeFileNameSafe(style)

        stylesDir    = join(stylesCataloguePath, collection, "styles")
        filePath     = join(stylesDir, safeFileName + ".json")

        if not isdir(stylesDir): os.makedirs(stylesDir)

        if not isfile(filePath):
            if(not isfile(pathToOrderFile) or os.path.getsize(pathToOrderFile) == 0): orderFile = []
            else:
                f = open(pathToOrderFile)
                orderFile = json.load(f)
                f.close()
            
            with open(filePath, 'w') as outfile: json.dump(newStyleDefault, outfile, indent="\t")

            if not style in orderFile:
                orderFile.append(style)
                with open(pathToOrderFile, 'w') as outfile: json.dump(orderFile, outfile, indent="\t")
        
        f = open(filePath)
        styleFile = json.load(f)
        styleFile["previewImage"] = fileExtension
        f.close()

        with open(filePath, 'w') as outfile: json.dump(styleFile, outfile, indent="\t")
    
    emitMessage("updated style preview and data for: " + collection)
    return "ok"

