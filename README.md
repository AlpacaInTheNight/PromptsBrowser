# Prompts Browser Extension 0.1
Prompts Browser Extension for the AUTOMATIC1111/stable-diffusion-webui client

![](preview.png)

Installation:

1. install node.js <https://nodejs.org/en/download>
The collections server runs on node. In the future I plan to rewrite the server in python and get rid of the dependency on node. but since I don't know python, this will take time.

2. Unzip/clone the plugin into the `extensions/PromptsBrowser` folder.

3. In the stable-diffusion folder will be created folder `prompts_catalogue` with subfolder `myprompts` - this will be the first collection of prompts. As well as the folder `styles_catalogue` where new styles will be stored.

Usage:

Adding new prompts to the collection:

Enter text in the text box - the text will be divided by the presence of a comma in the prompts in the text box. If you click on the icon of a prompt, it will become the selected one. Now you can generate an image and if any of the currently active prompts is selected there will be a button `Save preview` above the generated image. By saving the preview, it will be added to the collection, and the preview image for that sample will be added to the collection's `preview` folder.

Known Prompt Browser:

1. The known prompts browser will display all known prompts from all the collections added to the `prompts_catalogue` folder.

2. click on a prompt to add it to the active prompts.

3. shift + click: opens prompt edition window.

4. ctrl (meta) + click: opens the dialog of removing the sample from the collection (it will be lost).

5. Prompts in the collection can be moved by drag and drop.
