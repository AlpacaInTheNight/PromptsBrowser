import sys
from os.path import join, isdir
from pydantic import BaseModel
import gradio as gr

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse

from server.initServer import initServer

from server.getCollections import getCollections
from server.savePreview import savePreview
from server.saveStylePreview import saveStylePreview
from server.saveStyles import saveStyles
from server.renameStyle import renameStyle
from server.savePrompts import savePrompts
from server.newCollection import newCollection
from server.newStylesCollection import newStylesCollection
from server.movePreview import movePreview

from server.utils import emitMessage, getCollectionsDir
from server.constant import PROMPTS_DIR, STYLES_DIR

from scripts.settings import on_ui_settings

class ReqSavePreview(BaseModel):
    src: str
    prompt: str
    collection: str
    model: str

class ReqSaveStylePreview(BaseModel):
    src: str
    style: str
    collection: str

class ReqSaveStyles(BaseModel):
    data: str
    collection: str

class ReqRenameStyle(BaseModel):
    oldName: str
    newName: str
    collection: str

class ReqNewCollection(BaseModel):
    id: str
    mode: str

class ReqMovePreview(BaseModel):
    item: str
    movefrom: str
    to: str
    type: str

class ReqSavePrompts(BaseModel):
    data: str
    collection: str
    noClear: bool

SERVER_READ_ONLY = "--prompts-browser-readonly" in sys.argv

initServer()

def on_app_started(_: gr.Blocks, app: FastAPI):
    ROOT_URL = "/promptBrowser/"
    collDir = getCollectionsDir()
    pathPromptsCatalogue    = join(collDir, PROMPTS_DIR)
    pathStylesCatalogue     = join(collDir, STYLES_DIR)

    @app.get(ROOT_URL + "promptImage/{coll_id}/{prompt_id}")
    async def get_prompt_image(coll_id, prompt_id):
        url = join(pathPromptsCatalogue, coll_id, "preview", prompt_id)
        return FileResponse(url)

    @app.get(ROOT_URL + "promptImage/{coll_id}/{model_id}/{prompt_id}")
    async def get_prompt_model_image(coll_id, model_id, prompt_id):
        url = join(pathPromptsCatalogue, coll_id, "preview", model_id, prompt_id)
        return FileResponse(url)

    @app.get(ROOT_URL + "styleImage/{coll_id}/{style_id}")
    async def get_style_image(coll_id, style_id):
        url = join(pathStylesCatalogue, coll_id, "preview", style_id)
        return FileResponse(url)

    @app.get(ROOT_URL + "getPrompts")
    async def get_collections(): return getCollections(SERVER_READ_ONLY)
    
    if not SERVER_READ_ONLY:
        @app.post(ROOT_URL + "savePreview")
        async def save_preview(req: ReqSavePreview): return savePreview(req)
        
        @app.post(ROOT_URL + "saveStylePreview")
        async def save_style_preview(req: ReqSaveStylePreview): return saveStylePreview(req)
        
        @app.post(ROOT_URL + "saveStyles")
        async def save_styles(req: ReqSaveStyles): return saveStyles(req)
        
        @app.post(ROOT_URL + "renameStyle")
        async def rename_style(req: ReqRenameStyle): return renameStyle(req)
        
        @app.post(ROOT_URL + "newCollection")
        async def new_collection(req: ReqNewCollection): return newCollection(req)
        
        @app.post(ROOT_URL + "newStylesCollection")
        async def new_styles_collection(req: ReqNewCollection): return newStylesCollection(req)
        
        @app.post(ROOT_URL + "movePreview")
        async def move_preview(req: ReqMovePreview): return movePreview(req)
        
        @app.post(ROOT_URL + "savePrompts")
        async def save_prompts(req: ReqSavePrompts): return savePrompts(req)


try:
    import modules.script_callbacks as script_callbacks

    script_callbacks.on_app_started(on_app_started)
    script_callbacks.on_ui_settings(on_ui_settings)
except:
    pass
