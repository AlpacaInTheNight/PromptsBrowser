import json
import os
import constant
import shutil

from utils import makeFileNameSafe
from utils import getWebUIDirectory
from utils import emitMessage

def newStylesCollection(postJSON):
    id = postJSON["id"]

    if not id: return "failed"

    webUIDir = getWebUIDirectory()
    pathToCollection = webUIDir + constant.STYLES_FOLDER + os.sep + id + os.sep

    if os.path.isdir(pathToCollection):
        emitMessage(f'failed to create new styles collection: id "{id}" already exists')
        return "failed"
    
    os.makedirs(pathToCollection + "preview")

    dataJSON = []
    with open(pathToCollection + "data.json", 'w') as outfile: json.dump(dataJSON, outfile)

    emitMessage(f'created new styles collection: {id}')
    return "ok"
