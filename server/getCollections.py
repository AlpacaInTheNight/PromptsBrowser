import json
import os
from os.path import join, isdir, isfile

from . import constant
from .utils import emitMessage, getCollectionsDir, makeFileNameSafe
from modules.shared import opts

def formSetupObject():
    config = {}

    if hasattr(opts, "pbe_show_old_setup_window"):
        config["showOldSetupWindow"] = opts.pbe_show_old_setup_window

    if hasattr(opts, "pbe_autocomplete_prompt_mode"):
        if opts.pbe_autocomplete_prompt_mode == "Off":
            config["autocomplitePromptMode"] = "off"
        elif opts.pbe_autocomplete_prompt_mode == "Prompts only":
            config["autocomplitePromptMode"] = "prompts"
        elif opts.pbe_autocomplete_prompt_mode == "Styles only":
            config["autocomplitePromptMode"] = "styles"
        elif opts.pbe_autocomplete_prompt_mode == "Prompts and styles":
            config["autocomplitePromptMode"] = "all"

    if hasattr(opts, "pbe_show_prompt_index"):
        config["showPromptIndex"] = opts.pbe_show_prompt_index

    if hasattr(opts, "pbe_support_extended_syntax"):
        config["supportExtendedSyntax"] = opts.pbe_support_extended_syntax

    if hasattr(opts, "pbe_below_one_weight"):
        config["belowOneWeight"] = opts.pbe_below_one_weight

    if hasattr(opts, "pbe_above_one_weight"):
        config["aboveOneWeight"] = opts.pbe_above_one_weight

    if hasattr(opts, "pbe_to_lower_case"):
        config["toLowerCase"] = opts.pbe_to_lower_case

    if hasattr(opts, "pbe_space_mode"):
        if opts.pbe_space_mode == "Do nothing":
            config["spaceMode"] = ""
        elif opts.pbe_space_mode == "To space":
            config["spaceMode"] = "space"
        elif opts.pbe_space_mode == "To underscore":
            config["spaceMode"] = "underscore"

    if hasattr(opts, "pbe_card_width"):
        config["cardWidth"] = opts.pbe_card_width

    if hasattr(opts, "pbe_card_height"):
        config["cardHeight"] = opts.pbe_card_height
    
    if hasattr(opts, "pbe_splash_card_width"):
        config["splashCardWidth"] = opts.pbe_splash_card_width

    if hasattr(opts, "pbe_splash_card_height"):
        config["splashCardHeight"] = opts.pbe_splash_card_height

    if hasattr(opts, "pbe_rows_in_known_cards"):
        config["rowsInKnownCards"] = opts.pbe_rows_in_known_cards

    if hasattr(opts, "pbe_max_cards_shown"):
        config["maxCardsShown"] = opts.pbe_max_cards_shown

    if hasattr(opts, "pbe_resize_thumbnails"):
        config["resizeThumbnails"] = opts.pbe_resize_thumbnails

    if hasattr(opts, "pbe_resize_thumbnails_max_width"):
        config["resizeThumbnailsMaxWidth"] = opts.pbe_resize_thumbnails_max_width

    if hasattr(opts, "pbe_resize_thumbnails_max_height"):
        config["resizeThumbnailsMaxHeight"] = opts.pbe_resize_thumbnails_max_height

    if hasattr(opts, "pbe_resize_thumbnails_format"):
        config["resizeThumbnailsFormat"] = opts.pbe_resize_thumbnails_format
    
    return config


def getCollections(isReadOnly):
    collDir = getCollectionsDir()
    pathPromptsCatalogue    = join(collDir, constant.PROMPTS_DIR)
    pathStylesCatalogue     = join(collDir, constant.STYLES_DIR)
    config = formSetupObject()

    dataList = {
        "prompts": {},
        "styles": {},
        "config": config
    }

    #dataList["options"] = json.dumps(opts)

    if isReadOnly: dataList["readonly"] = True

    #getting promopt collections
    promptsDirs = os.listdir(pathPromptsCatalogue)
    for dirName in promptsDirs:
        if not isdir(join(pathPromptsCatalogue, dirName)): continue

        pathToDataFile      = join(pathPromptsCatalogue, dirName, "data.json")
        pathToOrderFile     = join(pathPromptsCatalogue, dirName, "order.json")
        pathToMetaFile      = join(pathPromptsCatalogue, dirName, "meta.json")
        pathToPromptsDir    = join(pathPromptsCatalogue, dirName, "prompts")
        pathToPreviewDir    = join(pathPromptsCatalogue, dirName, "preview")

        #"short" | "expanded"
        format = "short"
        dataFile = []

        #checking meta file information and getting its data. creating one if none.
        if not isfile(pathToMetaFile):
            with open(pathToMetaFile, 'w') as outfile: json.dump({"format": "short"}, outfile)

        else:
            f = open(pathToMetaFile)
            metaFile = json.load(f)
            f.close()
            if metaFile["format"]: format = metaFile["format"]

        #getting data based on the collection format type
        if format == "short":
            if not isfile(pathToDataFile): continue
            f = open(pathToDataFile)
            dataFile = json.load(f)
            f.close()

        else:
            if not isfile(pathToOrderFile): continue
            f = open(pathToOrderFile)
            JSONOrder = json.load(open(pathToOrderFile))
            f.close()

            newPromptsFromDir = []
            promptsObject = {}

            if isdir(pathToPromptsDir):
                jsonFileNames = [filename for filename in os.listdir(pathToPromptsDir) if filename.endswith('.json')]

                for fileName in jsonFileNames:
                    with open(join(pathToPromptsDir, fileName)) as jsonFile:
                        promptJSON = json.load(jsonFile)
                        if not "id" in promptJSON or not promptJSON["id"]: continue
                        promptId = promptJSON["id"]
                        promptsObject[promptId] = promptJSON
                
            for orderItem in JSONOrder:
                if orderItem in promptsObject and promptsObject[orderItem]: dataFile.append(promptsObject[orderItem])
            
            """
            Adding new prompts that was found in prompts directory, but that was not pressent in the order.json file.
            This allows to add prompts to the collection by simply copying their .json files into collections prompts directory.
            """
            for promptId in promptsObject:
                promptItem = promptsObject[promptId]
                if not promptItem["id"] in JSONOrder:
                    #emitMessage(f'new prompt found: "{promptItem["id"]}" in collection: "{dirName}"')
                    newPromptsFromDir.append(promptItem)
            
            if newPromptsFromDir: dataFile += newPromptsFromDir


        """
        Getting preview images to mark prompt if it have one or not.
        """
        if isdir(pathToPreviewDir):
            imageFileNames = [filename for filename in os.listdir(pathToPreviewDir) if filename.endswith('.jpg') or filename.endswith('.png')]

            for promptItem in dataFile:
                previewImage = ""
                safeFileName = makeFileNameSafe(promptItem["id"])

                if safeFileName + ".png" in imageFileNames: previewImage = "png"
                elif safeFileName + ".jpg" in imageFileNames: previewImage = "jpg"

                if previewImage: promptItem["previewImage"] = previewImage
                else: promptItem.pop("previewImage", None)
            
        dataList["prompts"][dirName] = dataFile
    
    #Getting styles collections
    stylesDirs = os.listdir(pathStylesCatalogue)
    for dirName in stylesDirs:
        if not isdir(join(pathStylesCatalogue, dirName)): continue

        pathToDataFile      = join(pathStylesCatalogue, dirName, "data.json")
        pathToOrderFile     = join(pathStylesCatalogue, dirName, "order.json")
        pathToMetaFile      = join(pathStylesCatalogue, dirName, "meta.json")
        pathToStylesDir     = join(pathStylesCatalogue, dirName, "styles")

        #"short" | "expanded"
        format = "short"
        dataFile = []

        #checking meta file information and getting its data. creating one if none.
        if not isfile(pathToMetaFile):
            with open(pathToMetaFile, 'w') as outfile: json.dump({"format": "short"}, outfile)

        else:
            f = open(pathToMetaFile)
            metaFile = json.load(f)
            f.close()
            if metaFile["format"]: format = metaFile["format"]
        

        if format == "short":
            if not isfile(pathToDataFile): continue
            f = open(pathToDataFile)
            dataFile = json.load(f)
            f.close()
        
        else:
            if not isfile(pathToOrderFile): continue
            f = open(pathToOrderFile)
            JSONOrder = json.load(open(pathToOrderFile))
            f.close()

            newStylesFromDir = []
            stylesObject = {}

            if isdir(pathToStylesDir):
                jsonFileNames = [filename for filename in os.listdir(pathToStylesDir) if filename.endswith('.json')]

                for fileName in jsonFileNames:
                    with open(join(pathToStylesDir, fileName)) as jsonFile:
                        styleJSON = json.load(jsonFile)
                        if not "name" in styleJSON or not styleJSON["name"]: continue
                        styleId = styleJSON["name"]
                        stylesObject[styleId] = styleJSON
                
            for orderItem in JSONOrder:
                if orderItem in stylesObject and stylesObject[orderItem]: dataFile.append(stylesObject[orderItem])

            """
            Adding new styles that was found in styles directory, but that was not pressent in the order.json file.
            This allows to add styles to the collection by simply copying their .json files into collections styles directory.
            """
            for styleId in stylesObject:
                styleItem = stylesObject[styleId]
                if not styleItem["name"] in JSONOrder:
                    newStylesFromDir.append(styleItem)
            
            if newStylesFromDir: dataFile += newStylesFromDir

        dataList["styles"][dirName] = dataFile

    return dataList
