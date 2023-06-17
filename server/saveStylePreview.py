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

    shutil.copy(src, savePath)

    #updating collection data
    pathToDataFile = stylesCataloguePath + collection + os.sep + "data.json"

    if not os.path.isfile(pathToDataFile) or os.path.getsize(pathToDataFile) == 0: dataFile = []
    else:
        f = open(pathToDataFile)
        dataFile = json.load(f)
        f.close()

    targetStyle = next((item for item in dataFile if item['name'] == style), None)
    if targetStyle:
        if fileExtension[0] == ".": fileExtension = fileExtension[1:]
        targetStyle["previewImage"] = fileExtension
        with open(pathToDataFile, 'w') as outfile: json.dump(dataFile, outfile, indent="\t")
    
    emitMessage("updated style preview and data for: " + collection)
    return "ok"

