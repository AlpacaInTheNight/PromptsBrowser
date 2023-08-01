import json
import os
import constant
import shutil

from utils import makeFileNameSafe
from utils import getWebUIDirectory
from utils import emitMessage

def saveStyles(postJSON):
    data = postJSON["data"]
    collection = postJSON["collection"]
    
    if not data or not collection: return "failed"

    #"short" | "expanded"
    format = "short"

    webUIDir = getWebUIDirectory()
    stylesCataloguePath = webUIDir + constant.STYLES_FOLDER + os.sep

    pathToCollection = stylesCataloguePath + collection + os.sep
    pathToDataFile = stylesCataloguePath + collection + os.sep + "data.json"
    pathToMetaFile = pathToCollection + "meta.json"

    if os.path.isfile(pathToMetaFile):
        f = open(pathToMetaFile)
        metaFile = json.load(f)
        f.close()
        if metaFile["format"]: format = metaFile["format"]
    
    if format == "short": result = saveCollectionShort(pathToDataFile, data, collection)
    elif format == "expanded": result = saveCollectionExpanded(pathToCollection, data, collection)

    return result


def saveCollectionShort(pathToDataFile, data, collection):
    if not data or not collection or not pathToDataFile: return "failed"

    dataJSON = json.loads(data)
    with open(pathToDataFile, 'w') as outfile: json.dump(dataJSON, outfile, indent="\t")

    emitMessage("updated style: " + collection)

    return "ok"


def saveCollectionExpanded(pathToCollection, data, collection):
    if not data or not collection or not pathToCollection: return "failed"

    dataJSON = json.loads(data)
    stylesFolder = pathToCollection + "styles"
    if not os.path.isdir(stylesFolder): os.makedirs(stylesFolder)

    promptOrder = []
    expectedFiles = []

    for styleItem in dataJSON:
        if not "name" in styleItem or not styleItem["name"]: continue
        styleId = styleItem["name"]

        safeFileName = makeFileNameSafe(styleId)
        expectedFiles.append(safeFileName + ".json")
        promptOrder.append(styleId)

        pathToStyleFile = stylesFolder + os.sep + safeFileName + ".json"

        if os.path.isfile(pathToStyleFile):
            f = open(pathToStyleFile)
            styleJSON = json.load(f)
            f.close()

            if(styleItem != styleJSON):
                with open(pathToStyleFile, 'w') as outfile: json.dump(styleItem, outfile, indent="\t")
                emitMessage(f'update styles: changed style: "{styleItem["name"]}" in collection "{collection}"')

        else:
            with open(pathToStyleFile, 'w') as outfile: json.dump(styleItem, outfile, indent="\t")
            emitMessage(f'update styles: added style: "{styleId}" to collection "{collection}"')
        
    jsonFileNames = [filename for filename in os.listdir(stylesFolder) if filename.endswith('.json')]
    for fileName in jsonFileNames:
        if fileName not in expectedFiles:
            pathToStyleFile = stylesFolder + os.sep + fileName
            os.remove(pathToStyleFile)
            emitMessage(f'update styles: removed style file: "{fileName}" from collection "{collection}"')
    
    with open(pathToCollection + "order.json", 'w') as outfile: json.dump(promptOrder, outfile, indent="\t")
 
    return "ok"