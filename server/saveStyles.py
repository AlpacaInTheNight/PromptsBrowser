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

    webUIDir = getWebUIDirectory()
    stylesCataloguePath = webUIDir + constant.STYLES_FOLDER + os.sep
    pathToDataFile = stylesCataloguePath + collection + os.sep + "data.json"

    dataJSON = json.loads(data)
    with open(pathToDataFile, 'w') as outfile: json.dump(dataJSON, outfile, indent="\t")

    emitMessage("updated style: " + collection)
    return "ok"
    
