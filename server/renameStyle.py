import json
import os
from os.path import join, isdir, isfile

from . import constant

from .utils import makeFileNameSafe
from .utils import getCollectionsDir
from .utils import emitMessage

def renameStyle(postJSON):
    oldName = postJSON.oldName
    newName = postJSON.newName
    collection = postJSON.collection
    
    if not oldName or not newName or not collection: return "failed"

    #"short" | "expanded"
    format = "short"

    collDir = getCollectionsDir()

    pathStylesCatalogue     = join(collDir, constant.STYLES_DIR)
    pathToCollection        = join(pathStylesCatalogue, collection)
    pathToMetaFile          = join(pathToCollection, "meta.json")

    if isfile(pathToMetaFile):
        f = open(pathToMetaFile)
        metaFile = json.load(f)
        f.close()
        if metaFile["format"]: format = metaFile["format"]

    if format == "short": result = renameStyleShort(oldName, newName, collection)
    elif format == "expanded": result = renameStyleExpanded(oldName, newName, collection)

    if result == True:
        emitMessage(f'renamed style "{oldName}" to the "{newName}" in the collection "{collection}"')
    else:
        emitMessage(f'failed to rename: style "{oldName}" does not exist in the collection "{collection}"')

    return "ok"

def renameStylePreview(oldName, newName, collection):
    collDir = getCollectionsDir()

    safeOldFileName = makeFileNameSafe(oldName)
    safeNewFileName = makeFileNameSafe(newName)

    stylesCataloguePath     = join(collDir, constant.STYLES_DIR)
    collectionPath          = join(stylesCataloguePath, collection, "preview")

    oldJPG = join(collectionPath, safeOldFileName + ".jpg")
    oldPNG = join(collectionPath, safeOldFileName + ".png")

    if os.path.isfile(oldJPG): os.rename(oldJPG, join(collectionPath, safeNewFileName + ".jpg"))
    if os.path.isfile(oldPNG): os.rename(oldPNG, join(collectionPath, safeNewFileName + ".png"))


def renameStyleShort(oldName, newName, collection):
    if not oldName or not newName or not collection: return "failed"

    collDir = getCollectionsDir()

    pathStylesCatalogue = join(collDir, constant.STYLES_DIR)
    pathToDataFile      = join(pathStylesCatalogue, collection, "data.json")
    renamed = False

    with open(pathToDataFile, 'r') as file: data = json.load(file)

    for item in data:
        if item["name"] == oldName:
            item["name"] = newName
            renamed = True
            with open(pathToDataFile, 'w') as outfile: json.dump(data, outfile, indent="\t")
            renameStylePreview(oldName, newName, collection)
            break
    
    return renamed


def renameStyleExpanded(oldName, newName, collection):
    if not oldName or not newName or not collection: return "failed"

    collDir = getCollectionsDir()

    safeOldFileName = makeFileNameSafe(oldName)
    safeNewFileName = makeFileNameSafe(newName)

    pathStylesCatalogue = join(collDir, constant.STYLES_DIR)
    pathOrderFile = join(pathStylesCatalogue, collection, "order.json")
    pathOldFile = join(pathStylesCatalogue, collection, "styles", safeOldFileName + ".json")
    pathNewFile = join(pathStylesCatalogue, collection, "styles", safeNewFileName + ".json")
    renamed = False

    if os.path.isfile(pathOldFile):
        os.rename(pathOldFile, pathNewFile)

        with open(pathNewFile, 'r') as file: styleObject = json.load(file)
        styleObject["name"] = newName
        with open(pathNewFile, 'w') as outfile: json.dump(styleObject, outfile, indent="\t")

        renameStylePreview(oldName, newName, collection)
        renamed = True
    
    if renamed == True and os.path.isfile(pathOrderFile):
        with open(pathOrderFile, 'r') as file: orderArray = json.load(file)

        if oldName in orderArray:
            indexInOrder = orderArray.index(oldName)
            orderArray[indexInOrder] = newName
            with open(pathOrderFile, 'w') as outfile: json.dump(orderArray, outfile, indent="\t")

    return renamed
