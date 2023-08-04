import json
import os
import constant
import shutil

from utils import makeFileNameSafe
from utils import getWebUIDirectory
from utils import emitMessage

def saveStylePreview(postJSON):
    src = postJSON["src"]
    style = postJSON["style"]
    collection = postJSON["collection"]
    
    if not src or not style or not collection: return "failed"

    if not os.path.isfile(src):
        emitMessage(f'failed to save preview: file "{src}" not found')
        return "failed"
    
    #saving preview image
    urlArr = src.split("/")
    fileName = urlArr[-1]
    fileExtension = os.path.splitext(fileName)[1]
    safeFileName = makeFileNameSafe(style)

    webUIDir = getWebUIDirectory()
    stylesCataloguePath = webUIDir + constant.STYLES_FOLDER + os.sep
    savePath = stylesCataloguePath + collection + os.sep + "preview" + os.sep

    if not os.path.isdir(savePath): os.makedirs(savePath)

    savePath += safeFileName + fileExtension
    if fileExtension[0] == ".": fileExtension = fileExtension[1:]

    shutil.copy(src, savePath)

    #updating collection data
    pathToMetaFile = stylesCataloguePath + collection + os.sep + "meta.json"
    pathToDataFile = stylesCataloguePath + collection + os.sep + "data.json"
    pathToOrderFile = stylesCataloguePath + collection + os.sep + "order.json"
    newStyleDefault = {"name": style}

    #"short" | "expanded"
    format = "short"

    if os.path.isfile(pathToMetaFile):
        f = open(pathToMetaFile)
        metaFile = json.load(f)
        f.close()
        if metaFile["format"]: format = metaFile["format"]


    #saving data in case of the short format collection
    if format == "short":
        if not os.path.isfile(pathToDataFile) or os.path.getsize(pathToDataFile) == 0: dataFile = []
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
        stylesFolder = stylesCataloguePath + collection + os.sep + "styles"
        filePath = stylesFolder + os.sep + safeFileName + ".json"

        if not os.path.isdir(stylesFolder): os.makedirs(stylesFolder)

        if not os.path.isfile(filePath):
            if(not os.path.isfile(pathToOrderFile) or os.path.getsize(pathToOrderFile) == 0): orderFile = []
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

