import http.server
import socketserver
import json
import os

import constant
from utils import emitMessage, getWebUIDirectory, isPortInUse

from getCollections import getCollections
from savePreview import savePreview
from saveStylePreview import saveStylePreview
from saveStyles import saveStyles
from savePrompts import savePrompts
from newCollection import newCollection
from newStylesCollection import newStylesCollection
from movePreview import movePreview

if isPortInUse(constant.PORT):
    emitMessage(f'Server already running or port {constant.PORT} not available')
    exit()

def set_default_headers(self):
    self.send_response(200)
    self.send_header('Content-type', 'text/json')
    self.send_header('Access-Control-Allow-Origin', self.headers["Origin"])
    self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    self.send_header('Access-Control-Allow-Headers', '*')

    self.end_headers()

def initExtension():
    webUIDir = getWebUIDirectory()
    markerFile = webUIDir + constant.MARKER_FILE
    promptsCataloguePath = webUIDir + constant.PROMPTS_FOLDER
    stylesCataloguePath = webUIDir + constant.STYLES_FOLDER
    
    #check if extension is in extensions directory inside Stable Diffusion WebUI directory
    if not os.path.isfile(markerFile):
        emitMessage("Directory Error: No Stable Diffusion WebUI directory found. Check if extension is placed in the extensions directory")
        exit()
    
    #check if prompts catalogue directory exists
    if not os.path.isdir(promptsCataloguePath): os.makedirs(promptsCataloguePath)
    
    #check if styles catalogue directory exists
    if not os.path.isdir(stylesCataloguePath): os.makedirs(stylesCataloguePath)

    #checks if at least one prompts catalogue collection exists
    promptCollections = [name for name in os.listdir(promptsCataloguePath) if os.path.isdir(os.path.join(promptsCataloguePath, name))]
    if not promptCollections:
        pathToDefaultCatalogue = promptsCataloguePath + os.sep + constant.DEFAULT_CATALOGUE + os.sep
        os.makedirs(pathToDefaultCatalogue + "preview")
        with open(pathToDefaultCatalogue + "data.json", 'w') as outfile: json.dump([], outfile)
        with open(pathToDefaultCatalogue + "meta.json", 'w') as outfile: json.dump({"format": "short"}, outfile)
    
    #checks if at least one style catalogue collection exists
    stylesCollections = [name for name in os.listdir(stylesCataloguePath) if os.path.isdir(os.path.join(stylesCataloguePath, name))]
    if not stylesCollections:
        pathToDefaultStyle = stylesCataloguePath + os.sep + constant.DEFAULT_STYLES + os.sep
        os.makedirs(pathToDefaultStyle + "preview")
        with open(pathToDefaultStyle + "data.json", 'w') as outfile: json.dump([], outfile)

initExtension()

class RESTServer(http.server.SimpleHTTPRequestHandler):

    def do_OPTIONS(self):
        if self.client_address[0] != constant.ALLOWED_URL: return

        set_default_headers(self)

    def do_GET(self):
        if self.client_address[0] != constant.ALLOWED_URL: return

        if self.path == "/getPrompts":
            data = getCollections()

            set_default_headers(self)
            self.wfile.write(json.dumps(data).encode())
    
    def do_POST(self):
        if self.client_address[0] != constant.ALLOWED_URL: return

        contentLength = int(self.headers['Content-Length'])
        
        if contentLength:
            postMessage = self.rfile.read(contentLength)
            postJSON = json.loads(postMessage)
        else:
            postJSON = None

        if self.path == "/savePreview": savePreview(postJSON)
        elif self.path == "/saveStylePreview": saveStylePreview(postJSON)
        elif self.path == "/saveStyles": saveStyles(postJSON)
        elif self.path == "/newCollection": newCollection(postJSON)
        elif self.path == "/newStylesCollection": newStylesCollection(postJSON)
        elif self.path == "/movePreview": movePreview(postJSON)
        elif self.path == "/savePrompts": savePrompts(postJSON)
        
        output_data = {'status': 'OK'}
        output_json = json.dumps(output_data)
        
        set_default_headers(self)
        self.wfile.write(output_json.encode('utf-8'))


Handler = RESTServer

try:
    with socketserver.TCPServer(("", constant.PORT), Handler) as httpd:
        emitMessage(f"Starting at http://0.0.0.0:{constant.PORT}")
        httpd.serve_forever()

except KeyboardInterrupt:
    print("Stopping by Ctrl+C")
    httpd.server_close()  # to resolve problem `OSError: [Errno 98] Address already in use`