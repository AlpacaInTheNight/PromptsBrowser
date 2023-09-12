import json
import os
from os.path import join, isdir, isfile

from . import constant

from .utils import getCollectionsDir
from .utils import emitMessage

def newStylesCollection(postJSON):
    id = postJSON.id
    mode = postJSON.mode

    if not id or not mode: return "failed"

    collDir = getCollectionsDir()
    pathToCollection = join(collDir, constant.STYLES_DIR, id)

    if isdir(pathToCollection):
        emitMessage(f'failed to create new styles collection: id "{id}" already exists')
        return "failed"
    
    os.makedirs(join(pathToCollection, "preview"))

    metaJSON = {
        "format": mode
    }

    with open(join(pathToCollection, "meta.json"), 'w') as outfile: json.dump(metaJSON, outfile, indent="\t")

    if mode == "expanded":
        orderJSON = []
        with open(join(pathToCollection, "order.json"), 'w') as outfile: json.dump(orderJSON, outfile, indent="\t")
    else:
        dataJSON = []
        with open(join(pathToCollection, "data.json"), 'w') as outfile: json.dump(dataJSON, outfile, indent="\t")

    emitMessage(f'created new styles collection: {id}')
    return "ok"
