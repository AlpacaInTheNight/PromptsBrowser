import json
import os

from . import constant

from .utils import getWebUIDirectory
from .utils import emitMessage

def newCollection(postJSON):
    id = postJSON.id
    mode = postJSON.mode

    if not id or not mode: return "failed"

    webUIDir = getWebUIDirectory()
    pathToCollection = webUIDir + constant.PROMPTS_FOLDER + os.sep + id + os.sep

    if os.path.isdir(pathToCollection):
        emitMessage(f'failed to create new collection: id "{id}" already exists')
        return "failed"
    
    os.makedirs(pathToCollection + "preview")

    metaJSON = {
        "format": mode
    }

    with open(pathToCollection + "meta.json", 'w') as outfile: json.dump(metaJSON, outfile, indent="\t")

    if mode == "expanded":
        orderJSON = []
        with open(pathToCollection + "order.json", 'w') as outfile: json.dump(orderJSON, outfile, indent="\t")
    else:
        dataJSON = []
        with open(pathToCollection + "data.json", 'w') as outfile: json.dump(dataJSON, outfile, indent="\t")
    
    emitMessage(f'created new prompts collection: {id}')
    return "ok"


