import json
import os
import constant
from utils import emitMessage, getWebUIDirectory, makeFileNameSafe

def getCollections():
    webUIDir = getWebUIDirectory()
    promptsCataloguePath = webUIDir + constant.PROMPTS_FOLDER
    stylesDirectoryContent = webUIDir + constant.STYLES_FOLDER

    dataList = {
        "prompts": {},
        "styles": {}
    }

    #getting promopt collections
    promptsDirs = os.listdir(promptsCataloguePath)
    for dirName in promptsDirs:
        if not os.path.isdir(promptsCataloguePath + "/" + dirName): continue

        pathToDataFile = promptsCataloguePath + "/" + dirName + "/" + "data.json"
        pathToOrderFile = promptsCataloguePath + "/" + dirName + "/" + "order.json"
        pathToMetaFile = promptsCataloguePath + "/" + dirName + "/" + "meta.json"
        pathToPromptsFolder = promptsCataloguePath + "/" + dirName + "/" + "prompts"
        pathToPreviewFolder = promptsCataloguePath + "/" + dirName + "/" + "preview"

        #"short" | "expanded"
        format = "short"
        dataFile = []

        #checking meta file information and getting its data. creating one if none.
        if not os.path.isfile(pathToMetaFile):
            with open(pathToMetaFile, 'w') as outfile: json.dump({"format": "short"}, outfile)

        else:
            f = open(pathToMetaFile)
            metaFile = json.load(f)
            f.close()
            if metaFile["format"]: format = metaFile["format"]

        #getting data based on the collection format type
        if format == "short":
            if not os.path.isfile(pathToDataFile): continue
            f = open(pathToDataFile)
            dataFile = json.load(f)
            f.close()

        else:
            if not os.path.isfile(pathToOrderFile): continue
            f = open(pathToOrderFile)
            JSONOrder = json.load(open(pathToOrderFile))
            f.close()

            newPromptsFromFolder = []
            promptsObject = {}

            if os.path.isdir(pathToPromptsFolder):
                jsonFileNames = [filename for filename in os.listdir(pathToPromptsFolder) if filename.endswith('.json')]

                for fileName in jsonFileNames:
                    with open(os.path.join(pathToPromptsFolder, fileName)) as jsonFile:
                        promptJSON = json.load(jsonFile)
                        if not "id" in promptJSON or not promptJSON["id"]: continue
                        promptId = promptJSON["id"]
                        promptsObject[promptId] = promptJSON
                
            for orderItem in JSONOrder:
                if orderItem in promptsObject and promptsObject[orderItem]: dataFile.append(promptsObject[orderItem])
            
            """
            Adding new prompts that was found in prompts folder, but that was not pressent in the order.json file.
            This allows to add prompts to the collection by simply copying their .json files into collections prompts folder.
            """
            for promptId in promptsObject:
                promptItem = promptsObject[promptId]
                if not promptItem["id"] in JSONOrder:
                    #emitMessage(f'new prompt found: "{promptItem["id"]}" in collection: "{dirName}"')
                    newPromptsFromFolder.append(promptItem)
            
            if newPromptsFromFolder: dataFile += newPromptsFromFolder


        """
        Getting preview images to mark prompt if it have one or not.
        """
        if os.path.isdir(pathToPreviewFolder):
            imageFileNames = [filename for filename in os.listdir(pathToPreviewFolder) if filename.endswith('.jpg') or filename.endswith('.png')]

            for promptItem in dataFile:
                previewImage = ""
                safeFileName = makeFileNameSafe(promptItem["id"])

                if safeFileName + ".png" in imageFileNames: previewImage = "png"
                elif safeFileName + ".jpg" in imageFileNames: previewImage = "jpg"

                if previewImage: promptItem["previewImage"] = previewImage
                else: promptItem.pop("previewImage", None)
            
        dataList["prompts"][dirName] = dataFile
    
    #Getting styles collections
    stylesDirs = os.listdir(stylesDirectoryContent)
    for dirName in stylesDirs:
        if not os.path.isdir(stylesDirectoryContent + "/" + dirName): continue
        pathToDataFile = stylesDirectoryContent + "/" + dirName + "/" + "data.json"
        if not os.path.isfile(pathToDataFile): continue
        
        f = open(pathToDataFile)
        dataFile = json.load(open(pathToDataFile))
        f.close()

        dataList["styles"][dirName] = dataFile

    return dataList
