import os
import socket
from datetime import datetime
from os.path import dirname, abspath, join, isdir, isfile

from . import constant

#Make sure to update client-side makeFileNameSafe method as well
def makeFileNameSafe(fileName: str):
    if not fileName: return

    fileName = fileName.replace("_", " ")

    #unix/win
    fileName = fileName.replace("/", "_fsl_")

    #win
    fileName = fileName.replace(":", "_col_")
    fileName = fileName.replace("\\", "_bsl_")
    fileName = fileName.replace("<", "_lt_")
    fileName = fileName.replace(">", "_gt_")
    fileName = fileName.replace("\"", "_dq_")
    fileName = fileName.replace("|", "_pip_")
    fileName = fileName.replace("?", "_qm_")
    fileName = fileName.replace("*", "_ast_")

    fileName = fileName.strip()

    return fileName

#Returns directory containing prompts and styles collections
def getCollectionsDir():
    extensionDir = dirname(dirname(abspath(__file__)))
    if not extensionDir: return False
    print(extensionDir)

    return extensionDir

def getWebUIDirectory():
    curr = os.getcwd()

    #for running with SDWebUI
    if os.path.isfile(curr + os.sep + constant.MARKER_FILE): return curr + os.sep
        
    
    #for running server separately
    urlArr = curr.split(os.sep)

    #assuming webUI is located at ../../../
    urlArr = urlArr[0 : -3]

    rootPath = os.sep.join(urlArr) + os.sep

    return rootPath


def emitMessage(message: str):
    now = datetime.now()

    showMessage = 'PromptsBrowser: ' + now.strftime("%H:%M:%S") + ' -> '
    showMessage += message

    print(showMessage)


def removeUnusedPreviews(collection, prompts):
    collDir = getCollectionsDir()

    pathPromptsCatalogue    = join(collDir, constant.PROMPTS_DIR)
    pathToCollection        = join(pathPromptsCatalogue, collection)
    pathToPreviews          = join(pathToCollection, "preview")

    if not isdir(pathToPreviews): return

    imageFileNames = [filename for filename in os.listdir(pathToPreviews) if (filename.endswith('.png') or filename.endswith('.jpg'))]

    for fileName in imageFileNames:
        used = False

        for promptItem in prompts:
            safeFileName = makeFileNameSafe(promptItem["id"])

            if not "previewImage" in promptItem or not promptItem["previewImage"]:
                if safeFileName + ".png" == fileName: promptItem["previewImage"] = "png"
                elif safeFileName + ".jpg" == fileName: promptItem["previewImage"] = "jpg"
            
            if not "previewImage" in promptItem or not promptItem["previewImage"]: continue

            if safeFileName + "." + promptItem["previewImage"] == fileName:
                used = True
                break
        
        if not used:
            os.remove(join(pathToPreviews, fileName))
            emitMessage("removed not used preview: " + fileName + f' from collection "{collection}"')

def isPortInUse(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0
