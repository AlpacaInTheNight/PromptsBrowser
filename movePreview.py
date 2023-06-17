import json
import os
import constant
import shutil

from utils import makeFileNameSafe
from utils import getWebUIDirectory
from utils import emitMessage

def movePreview(postJSON):
    item = postJSON["item"]
    itemFrom = postJSON["from"]
    itemTo = postJSON["to"]
    itemType = postJSON["type"]

    if not item or not itemFrom or not itemTo or not itemType: return "failed"

    webUIDir = getWebUIDirectory()
    promptsCataloguePath = webUIDir + constant.PROMPTS_FOLDER + os.sep

    sourcePath = promptsCataloguePath + itemFrom + os.sep + "preview" + os.sep
    savePath = promptsCataloguePath + itemTo + os.sep + "preview" + os.sep
    safeFileName = makeFileNameSafe(item)

    sourcePath += safeFileName + ".png"
    savePath += safeFileName + ".png"

    if not os.path.isfile(sourcePath): return "failed"

    if type == "copy":
        shutil.copy(sourcePath, savePath)
        emitMessage(f'copied prompt preview "${item}" from "${itemFrom}" to "${itemTo}"')

    elif type == "move":
        shutil.move(sourcePath, savePath)
        emitMessage(f'moved prompt preview "${item}" from "${itemFrom}" to "${itemTo}"')
    
    elif type == "delete":
        os.remove(sourcePath)
        emitMessage(f'deleted prompt preview "${item}" from "${itemFrom}"')
    
    return "ok"
