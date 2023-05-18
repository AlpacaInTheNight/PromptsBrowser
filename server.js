//import { saveCollectionShort } from './saveCollectionShort';
const saveCollectionShort = require('./saveCollectionShort').saveCollectionShort;
const saveCollectionExpanded = require('./saveCollectionExpanded').saveCollectionExpanded;
const utils = require('./utils');

const http = require('http');
const fs = require('fs');
const path = require('path');
const filename = require.main.filename;

const hostname = '127.0.0.1';
const port = 3000;

const MARKER_FILE = "webui.py";
const PROMPTS_FOLDER = "prompts_catalogue";
const STYLES_FOLDER = "styles_catalogue";
const DEFAULT_CATALOGUE = "myprompts";
const DEFAULT_STYLES = "mystyles";

const currentPath = path.dirname(filename);
let pathArr = currentPath.split(path.sep);

pathArr = pathArr.slice(0, -2);
const pathToWebui = pathArr.join(path.sep);
const promptsCataloguePath = pathToWebui + path.sep + PROMPTS_FOLDER;
const stylesCataloguePath = pathToWebui + path.sep + STYLES_FOLDER;

function init() {
	const markerFile = pathToWebui + path.sep + MARKER_FILE;

	//check if extension is in extensions directory inside Stable Diffusion WebUI directory
	if(!fs.existsSync(markerFile)) {
		console.log("Directory Error: No Stable Diffusion WebUI directory found. Check if extension is placed in the extensions directory");
		return false;
	}

	//check if prompts catalogue directory exists
	if(!fs.existsSync(promptsCataloguePath)) {
		fs.mkdirSync(promptsCataloguePath);
	}

	//check if styles catalogue directory exists
	if(!fs.existsSync(stylesCataloguePath)) {
		fs.mkdirSync(stylesCataloguePath);
	}

	//checks if at least one prompts catalogue collection exists
	const promptsDirectory = fs.readdirSync(promptsCataloguePath, {withFileTypes: true});
	let noFolders = true;
	for(const dirItem of promptsDirectory) {
		if(dirItem.isDirectory()) {
			noFolders = false;
			break;
		}
	}

	if(noFolders) {
		const pathToDefaultCatalogue = promptsCataloguePath + path.sep + DEFAULT_CATALOGUE;
		fs.mkdirSync(pathToDefaultCatalogue);
		fs.mkdirSync(pathToDefaultCatalogue + path.sep + "preview");
		fs.writeFileSync(pathToDefaultCatalogue + path.sep + "data.json", "[]");
	}

	//converting old styles collection to new one
	//TODO: remove me later
	const oldBaseStylePath = stylesCataloguePath + path.sep + "base.json";
	if(fs.existsSync(oldBaseStylePath) && !fs.existsSync(stylesCataloguePath + path.sep + "base")) {
		const oldPreviewPath = stylesCataloguePath + path.sep + "preview";

		fs.mkdirSync(stylesCataloguePath + path.sep + "base");
		fs.renameSync(oldBaseStylePath, stylesCataloguePath + path.sep + "base" + path.sep + "data.json");

		if(fs.existsSync(oldPreviewPath)) {
			const newPreviewPath = stylesCataloguePath + path.sep + "base" + path.sep + "preview";
			fs.renameSync(oldPreviewPath, newPreviewPath);
		}
	}

	//checks if at least one style catalogue collection exists
	noFolders = true;
	const stylesDirectory = fs.readdirSync(stylesCataloguePath, {withFileTypes: true});
	for(const dirItem of stylesDirectory) {
		if(dirItem.isDirectory()) {
			noFolders = false;
			break;
		}
	}

	if(noFolders) {
		const pathToDefaultStyle = stylesCataloguePath + path.sep + DEFAULT_STYLES;
		fs.mkdirSync(pathToDefaultStyle);
		fs.mkdirSync(pathToDefaultStyle + path.sep + "preview");
		fs.writeFileSync(pathToDefaultStyle + path.sep + "data.json", "[]");
	}
}

const result = init();
if(result === false) {
	console.log("Failed to init. Exiting");
	process.exit();
}

const server = http.createServer((req, res) => {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:7860');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');

	if(req.method === "POST" && req.url === "/savePreview") {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const postMessage = JSON.parse(body);
			const src = postMessage.src;
			const prompt = postMessage.prompt;
			const collection = postMessage.collection;
			const isExternalNetwork = postMessage.isExternalNetwork;
			if(!src || !prompt || !collection) return "failed";
			const d = new Date();

			const urlArr = src.split("/");

			let savePath = promptsCataloguePath + path.sep + collection + path.sep + "preview" + path.sep;

			const fileName = urlArr[urlArr.length - 1];
			const fileExtension = fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);

			const safeFileName = utils.makeFileNameSafe(prompt);
			const newFileName = `${safeFileName}.${fileExtension}`;
			savePath += newFileName;

			if(!fs.existsSync(src)) {
				console.log(d.toLocaleTimeString() + `-> failed to save preview: file "${src}" not found`);

				return;
			}

			fs.copyFile(src, savePath, (err) => {
				if (err) throw err;
			});

			const pathToMetaFile = promptsCataloguePath + path.sep + collection + path.sep + "meta.json";
			const pathToDataFile = promptsCataloguePath + path.sep + collection + path.sep + "data.json";
			const pathToOrderFile = promptsCataloguePath + path.sep + collection + path.sep + "order.json";

			const newPromptDefault = {id: prompt, tags: [], category: []};
			if(isExternalNetwork) newPromptDefault.isExternalNetwork = true;

			//"short" | "expanded"
			let format = "short";

			if(fs.existsSync(pathToMetaFile)) {
				const rawMeta = fs.readFileSync(pathToMetaFile);
				const metaJSON = JSON.parse(rawMeta);

				if(metaJSON.format) format = metaJSON.format;
			}

			if(format === "short") {
				let rawdata = fs.readFileSync(pathToDataFile);
				let jsonData = JSON.parse(rawdata);
	
				if(jsonData && !jsonData.some(item => item.id === prompt)) {
					jsonData.push(newPromptDefault);
					fs.writeFileSync(pathToDataFile, JSON.stringify(jsonData, null, "\t"));
				}

			} else if(format === "expanded") {
				const safeFileName = utils.makeFileNameSafe(prompt);
				const promptsFolder = promptsCataloguePath + path.sep + collection + path.sep + "prompts";
				const filePath = promptsFolder + path.sep + safeFileName + ".json";

				if(!fs.existsSync(promptsFolder)) fs.mkdirSync(promptsFolder);

				if(!fs.existsSync(filePath) && fs.existsSync(pathToOrderFile)) {
					const rawOrderFile = fs.readFileSync(pathToOrderFile);
					const JSONOrder = JSON.parse(rawOrderFile);

					fs.writeFileSync(filePath, JSON.stringify(newPromptDefault, null, "\t"));

					if(!JSONOrder.includes(prompt)) {
						JSONOrder.push(prompt);
						fs.writeFileSync(pathToOrderFile, JSON.stringify(JSONOrder, null, "\t"));
					}
				}
			}

			console.log(d.toLocaleTimeString() + "-> updated preview and data for: " + collection);
			
			return "ok";
		});
	}

	if(req.method === "POST" && req.url === "/movePreview") {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const postMessage = JSON.parse(body);
			const item = postMessage.item;
			const from = postMessage.from;
			const to = postMessage.to;
			const type = postMessage.type;
			const d = new Date();
			if(!item || !from || !to || !type) return "failed";

			let sourcePath = promptsCataloguePath + path.sep + from + path.sep + "preview" + path.sep;
			let savePath = promptsCataloguePath + path.sep + to + path.sep + "preview" + path.sep;
			const safeFileName = utils.makeFileNameSafe(item);

			sourcePath += safeFileName + ".png";
			savePath += safeFileName + ".png";

			if(!fs.existsSync(sourcePath)) return "failed";

			if(type === "copy") {
				fs.copyFileSync(sourcePath, savePath);
				console.log(d.toLocaleTimeString() + `-> copied prompt preview "${item}" from ${from} to ${to}`);

			} else if (type === "move") {
				fs.renameSync(sourcePath, savePath);
				console.log(d.toLocaleTimeString() + `-> moved prompt preview "${item}" from ${from} to ${to}`);

			} else if(type === "delete") {
				fs.unlinkSync(sourcePath);
				console.log(d.toLocaleTimeString() + `-> deleted prompt preview "${item}" from ${from} collection`);
				
			}
			
			return "ok";
		});
	}

	if(req.method === "GET" && req.url === "/getPrompts") {
		const promptsDirectoryContent = fs.readdirSync(promptsCataloguePath, {withFileTypes: true});
		const stylesDirectoryContent = fs.readdirSync(stylesCataloguePath, {withFileTypes: true});
		//const stylesDirectoryContent = fs.readdirSync(stylesCataloguePath).filter(file => path.extname(file) === '.json');
		
		const dataList = {
			prompts: {},
			styles: {}
		};

		for(const dirItem of promptsDirectoryContent) {
			if(dirItem.isDirectory()) {
				const pathToDataFile = promptsCataloguePath + path.sep + dirItem.name + path.sep + "data.json";
				const pathToOrderFile = promptsCataloguePath + path.sep + dirItem.name + path.sep + "order.json";
				const pathToMetaFile = promptsCataloguePath + path.sep + dirItem.name + path.sep + "meta.json";
				const pathToPromptsFolder = promptsCataloguePath + path.sep + dirItem.name + path.sep + "prompts";
				const pathToPreviewFolder = promptsCataloguePath + path.sep + dirItem.name + path.sep + "preview";
				let JSONDataFinal = [];

				//"short" | "expanded"
				let format = "short";

				if(!fs.existsSync(pathToMetaFile)) {
					const defaultMeta = {
						format: "short"
					}

					fs.writeFileSync(pathToMetaFile, JSON.stringify(defaultMeta, null, "\t"));
				} else {
					const rawMeta = fs.readFileSync(pathToMetaFile);
					const metaJSON = JSON.parse(rawMeta);

					if(metaJSON.format) format = metaJSON.format;
				}

				if(format === "short") {
					if(!fs.existsSync(pathToDataFile)) continue;

					const rawdata = fs.readFileSync(pathToDataFile);
					JSONDataFinal = JSON.parse(rawdata);

				} else if(format === "expanded") {
					if(!fs.existsSync(pathToOrderFile)) continue;
					const rawOrderFile = fs.readFileSync(pathToOrderFile);
					const JSONOrder = JSON.parse(rawOrderFile);
					
					const newPromptsFromFolder = [];
					const promptsObject = {};

					if(fs.existsSync(pathToPromptsFolder)) {
						const promptsInFolder = fs.readdirSync(pathToPromptsFolder).filter(file => path.extname(file) === '.json');

						for(const fileItem of promptsInFolder) {
							const fileName = path.parse(fileItem).name;
					
							const pathToPromptFile = pathToPromptsFolder + path.sep + fileName + ".json";
							const rawFileData = fs.readFileSync(pathToPromptFile);
							const JSONFileData = JSON.parse(rawFileData);

							if(JSONFileData.id) promptsObject[JSONFileData.id] = JSONFileData;
						}
					}

					for(const promptInOrder of JSONOrder) {
						if(promptsObject[promptInOrder]) JSONDataFinal.push(promptsObject[promptInOrder]);
						else newPromptsFromFolder.push(promptsObject[promptInOrder]);
					}

					/**
					 * Adding new prompts that was found in prompts folder, but that was not pressent in the order.json file.
					 * This allows to add prompts to the collection by simply copying their .json files into collections prompts folder.
					 */
					if(newPromptsFromFolder.length) {
						JSONDataFinal = JSONDataFinal.concat(newPromptsFromFolder);
					}
				}

				/**
				 * Getting preview images to mark prompt if it have one or not.
				 * 
				 * Gradio seems to generate a lot of errors when requesting images that does not exists
				 * rather than just sending 404.
				 * So it's better to check if images are present or not to keep console clean.
				 */
				const previewImages = fs.readdirSync(pathToPreviewFolder).filter(
					file => (path.extname(file) === '.png' || path.extname(file) === '.jpg')
				);

				for(const promptItem of JSONDataFinal) {
					let previewImage = "";
					const safeFileName = utils.makeFileNameSafe(promptItem.id);
					
					for(const imageFile of previewImages) {
						if(imageFile === safeFileName + ".png") {
							previewImage = "png";
							break;

						} else if(imageFile === safeFileName + ".jpg") {
							previewImage = "jpg";
							break;

						}
					}

					if(previewImage) promptItem.previewImage = previewImage;
					else delete promptItem.previewImage;
				}

				/**
				 * Adding collection to the JSON answer message.
				 */
				dataList.prompts[dirItem.name] = JSONDataFinal;
			}
		}

		for(const dirItem of stylesDirectoryContent) {

			if(dirItem.isDirectory()) {
				const pathToDataFile = stylesCataloguePath + path.sep + dirItem.name + path.sep + "data.json";
				//const pathToPreviewFolder = promptsCataloguePath + path.sep + dirItem.name + path.sep + "preview";

				if(!fs.existsSync(pathToDataFile)) continue;

				const rawdata = fs.readFileSync(pathToDataFile);
				const JSONDataFinal = JSON.parse(rawdata);


				dataList.styles[dirItem.name] = JSONDataFinal;
			}

			/* const fileName = path.parse(fileItem).name;

			const rawdata = fs.readFileSync(stylesCataloguePath + path.sep + fileItem);
			const JSONData = JSON.parse(rawdata);

			dataList.styles[fileName] = JSONData; */
		}

		res.end(JSON.stringify(dataList));
		return;
	}

	if(req.method === "POST" && req.url === "/saveStyles") {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const postMessage = JSON.parse(body);
			const data = postMessage.data;
			const collection = postMessage.collection;
			if(!data || !collection) return "failed";

			const pathToCollection = stylesCataloguePath + path.sep + collection + path.sep;
			const pathToDataFile = pathToCollection + "data.json";

			const jsonData = JSON.parse(data);

			fs.writeFileSync(pathToDataFile, JSON.stringify(jsonData, null, "\t"));
			const d = new Date();
			console.log(d.toLocaleTimeString() + "-> updated style: " + collection);

			return "ok";
		});
	}

	if(req.method === "POST" && req.url === "/savePrompts") {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const postMessage = JSON.parse(body);
			const data = postMessage.data;
			const collection = postMessage.collection;
			if(!data || !collection) return "failed";

			//"short" | "expanded"
			let format = "short";

			const pathToCollection = promptsCataloguePath + path.sep + collection + path.sep;
			const pathToDataFile = pathToCollection + "data.json";
			const pathToMetaFile = pathToCollection + "meta.json";
			
			if(fs.existsSync(pathToMetaFile)) {
				const rawMeta = fs.readFileSync(pathToMetaFile);
				const metaJSON = JSON.parse(rawMeta);

				if(metaJSON.format) format = metaJSON.format;
			}

			if(format === "short") saveCollectionShort(pathToDataFile, data, collection);
			else if(format === "expanded") saveCollectionExpanded(pathToCollection, data, collection);

			return "ok";
		});
		
	}

	if(req.method === "POST" && req.url === "/saveStylePreview") {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const postMessage = JSON.parse(body);
			const src = postMessage.src;
			const style = postMessage.style;
			const collection = postMessage.collection;
			if(!src || !style || !collection) return "failed";

			const urlArr = src.split("/");

			const pathToCollection = stylesCataloguePath + path.sep + collection + path.sep;
			let savePath = pathToCollection + "preview" + path.sep;

			if(!fs.existsSync(pathToCollection)) fs.mkdirSync(pathToCollection);
			if(!fs.existsSync(savePath)) fs.mkdirSync(savePath);

			const fileName = urlArr[urlArr.length - 1];
			const fileExtension = fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);

			const safeFileName = utils.makeFileNameSafe(style);
			const newFileName = `${safeFileName}.${fileExtension}`;
			savePath += newFileName;

			fs.copyFile(src, savePath, (err) => {
				if (err) throw err;
			});

			const pathToDataFile = pathToCollection + "data.json";
			const rawdata = fs.readFileSync(pathToDataFile);
			const stylesJSON = JSON.parse(rawdata);

			const targetStyle = stylesJSON.find(item => item.name === style);
			if(targetStyle) {
				targetStyle.previewImage = fileExtension;
				fs.writeFileSync(pathToDataFile, JSON.stringify(stylesJSON, null, "\t"));
			}

			const d = new Date();
			console.log(d.toLocaleTimeString() + "-> updated style preview for: " + style);
			
			return "ok";
		});
	}

	if(req.method === "POST" && req.url === "/newCollection") {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const postMessage = JSON.parse(body);
			const id = postMessage.id;
			const mode = postMessage.mode;
			if(!id || !mode) return "failed";
			const d = new Date();

			const pathToCollection = promptsCataloguePath + path.sep + id + path.sep;

			if(fs.existsSync(pathToCollection)) {
				console.log(d.toLocaleTimeString() + `-> failed to create new collection: id ${id} already exists.`);

				return "false";
			}

			fs.mkdirSync(pathToCollection);
			fs.mkdirSync(pathToCollection + path.sep + "preview");

			const metaJSON = {
				format: mode
			};

			fs.writeFileSync(pathToCollection + path.sep + "meta.json", JSON.stringify(metaJSON, null, "\t"));

			if(mode === "expanded") {
				fs.mkdirSync(pathToCollection + path.sep + "prompts");
				const orderJSON = [];
				fs.writeFileSync(pathToCollection + path.sep + "order.json", JSON.stringify(orderJSON, null, "\t"));

			} else {
				const dataJSON = [];
				fs.writeFileSync(pathToCollection + path.sep + "data.json", JSON.stringify(dataJSON, null, "\t"));
			}

			console.log(d.toLocaleTimeString() + `-> created new prompts collection: ${id}.`);

			return "ok";
		});
	}

	if(req.method === "POST" && req.url === "/newStylesCollection") {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const postMessage = JSON.parse(body);
			const id = postMessage.id;
			if(!id) return "failed";
			const d = new Date();

			const pathToCollection = stylesCataloguePath + path.sep + id + path.sep;

			if(fs.existsSync(pathToCollection)) {
				console.log(d.toLocaleTimeString() + `-> failed to create new styles collection: id ${id} already exists.`);

				return "false";
			}

			fs.mkdirSync(pathToCollection);
			fs.mkdirSync(pathToCollection + path.sep + "preview");

			const dataJSON = [];
			fs.writeFileSync(pathToCollection + path.sep + "data.json", JSON.stringify(dataJSON, null, "\t"));

			console.log(d.toLocaleTimeString() + `-> created new styles collection: ${id}.`);

			return "ok";
		});
	}
	
	res.end("failed");
	
});

server.listen(port, hostname, () => {
	console.log(`===== Prompts Browser Extension server running at http://${hostname}:${port}/ =====`);
});
