import os
import json
from shutil import copyfile
from os.path import join, isdir

from .utils import emitMessage, getCollectionsDir
from . import constant

def initServer():
    collDir = getCollectionsDir()

    #markerFile              = join(collDir, constant.MARKER_FILE)
    pathPromptsCatalogue    = join(collDir, constant.PROMPTS_DIR)
    pathStylesCatalogue     = join(collDir, constant.STYLES_DIR)
    pathAutogenCatalogue    = join(collDir, constant.STYLES_DIR, constant.DEFAULT_AUTOGEN)
    pathAutogenPreset       = join(collDir, "server", "autogen")
    
    #check if extension is in extensions directory inside Stable Diffusion WebUI directory
    """ if not os.path.isfile(markerFile):
        emitMessage("Directory Error: No Stable Diffusion WebUI directory found. Check if extension is placed in the extensions directory")
        exit() """
    
    #check if prompts catalogue directory exists
    if not isdir(pathPromptsCatalogue): os.makedirs(pathPromptsCatalogue)
    
    #check if styles catalogue directory exists
    if not isdir(pathStylesCatalogue): os.makedirs(pathStylesCatalogue)

    #checks if at least one prompts catalogue collection exists
    promptCollections = [name for name in os.listdir(pathPromptsCatalogue) if isdir(join(pathPromptsCatalogue, name))]
    if not promptCollections:
        pathToDefaultCatalogue = join(pathPromptsCatalogue, constant.DEFAULT_CATALOGUE)
        os.makedirs(join(pathToDefaultCatalogue, "preview"))

        with open(join(pathToDefaultCatalogue, "data.json"), 'w') as outfile:
            json.dump([], outfile, indent="\t")

        with open(join(pathToDefaultCatalogue, "meta.json"), 'w') as outfile:
            json.dump({"format": "short"}, outfile, indent="\t")
    
    #checks if at least one style catalogue collection exists
    stylesCollections = [name for name in os.listdir(pathStylesCatalogue) if isdir(join(pathStylesCatalogue, name))]
    if not stylesCollections:
        pathToDefaultStyle = join(pathStylesCatalogue, constant.DEFAULT_STYLES)
        os.makedirs(join(pathToDefaultStyle, "preview"))
        with open(join(pathToDefaultStyle, "data.json"), 'w') as outfile: json.dump([], outfile, indent="\t")

    #checks if autogen style collection exists and is up to date
    if not isdir(pathAutogenCatalogue):
        os.makedirs(pathAutogenCatalogue)
        os.makedirs(join(pathAutogenCatalogue, "preview"))
        os.makedirs(join(pathAutogenCatalogue, "styles"))

        with open(join(pathAutogenCatalogue, "meta.json"), 'w') as outfile:
            json.dump({"format": "expanded"}, outfile, indent="\t")

        with open(join(pathAutogenCatalogue, "order.json"), 'w') as outfile:
            json.dump([], outfile, indent="\t")

    autogenPresets = [filename for filename in os.listdir(join(pathAutogenPreset, "styles")) if filename.endswith('.json')]
    for fileName in autogenPresets:
        if not isdir(join(pathAutogenCatalogue, "styles", fileName)):
            srcAutogenPreset = join(pathAutogenPreset, "styles", fileName)
            dstAutogenPreset = join(pathAutogenCatalogue, "styles", fileName)
            copyfile(srcAutogenPreset, dstAutogenPreset)