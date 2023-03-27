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
		fs.writeFileSync(pathToDefaultCatalogue + path.sep + "data.json", "{}");
	}

	//checks if at least one style catalogue collection exists
	const stylesFiles = fs.readdirSync(stylesCataloguePath).filter(file => path.extname(file) === '.json');
	if(!stylesFiles.length) {
		fs.writeFileSync(stylesCataloguePath + path.sep + "base.json", "[]");
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

			const urlArr = src.split("/");

			let savePath = promptsCataloguePath + path.sep + collection + path.sep + "preview" + path.sep;

			const fileName = urlArr[urlArr.length - 1];
			const fileExtension = fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);

			//replacing additional networks marker. Otherwise on NTFS it will create undesired ADS.
			//Using ADS will actually works for WebUI and preview will be visible,
			//but for windows users all this previews will be shown in file browser as a single empty file.
			const newFileName = `${prompt.replace(":", "_")}.${fileExtension}`;
			savePath += newFileName;

			fs.copyFile(src, savePath, (err) => {
				if (err) throw err;
			});

			const pathToData = promptsCataloguePath + path.sep + collection + path.sep + "data.json";

			let rawdata = fs.readFileSync(pathToData);
			let jsonData = JSON.parse(rawdata);

			if(jsonData && !jsonData.some(item => item.id === prompt)) {
				const promptItem = {id: prompt, tags: [], category: []};
				if(isExternalNetwork) promptItem.isExternalNetwork = true;
				jsonData.push(promptItem);
				fs.writeFileSync(pathToData, JSON.stringify(jsonData, null, "\t"));
			}

			const d = new Date();
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

			sourcePath += item.replace(":", "_") + ".png";
			savePath += item.replace(":", "_") + ".png";

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
		const stylesDirectoryContent = fs.readdirSync(stylesCataloguePath).filter(file => path.extname(file) === '.json');
		
		const dataList = {
			prompts: {},
			styles: {}
		};

		for(const dirItem of promptsDirectoryContent) {
			if(dirItem.isDirectory()) {
				const pathToDataFile = promptsCataloguePath + path.sep + dirItem.name + path.sep + "data.json";
				if(!fs.existsSync(pathToDataFile)) continue;

				const rawdata = fs.readFileSync(pathToDataFile);
				const JSONData = JSON.parse(rawdata);

				dataList.prompts[dirItem.name] = JSONData;
			}
		}

		for(const fileItem of stylesDirectoryContent) {
			const fileName = path.parse(fileItem).name;

			const rawdata = fs.readFileSync(stylesCataloguePath + path.sep + fileItem);
			const JSONData = JSON.parse(rawdata);

			dataList.styles[fileName] = JSONData;
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

			const pathToDataFile = stylesCataloguePath + path.sep + collection + ".json";

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
			const prevIndex = {};
			const newIndex = {};

			const pathToDataFile = promptsCataloguePath + path.sep + collection + path.sep + "data.json";
			
			//TODO: remove me
			const rawdata = fs.readFileSync(pathToDataFile);
			const prevJSON = JSON.parse(rawdata);

			const jsonData = JSON.parse(data);

			fs.writeFileSync(pathToDataFile, JSON.stringify(jsonData, null, "\t"));
			const d = new Date();
			console.log(d.toLocaleTimeString() + "-> updated data for: " + collection);

			for(let i = 0; i < jsonData.length; i++) {
				const newField = jsonData[i];
				newIndex[newField.id] = i;
			}

			for(let i = 0; i < prevJSON.length; i++) {
				const prevField = prevJSON[i];
				prevIndex[prevField.id] = i;
			}

			for(const id in prevIndex) {
				if(newIndex[id] === undefined) console.log(d.toLocaleTimeString() + "---> removed prompt: " + id);
				const prevField = prevJSON[prevIndex[id]];
				const newField = jsonData[newIndex[id]];

				if(JSON.stringify(prevField) !== JSON.stringify(newField)) {
					console.log(d.toLocaleTimeString() + "---> updated prompt: " + id);
				}
			}

			for(const id in newIndex) {
				if(prevIndex[id] === undefined) console.log(d.toLocaleTimeString() + "---> new prompt: " + id);
			}

			return "ok";
		});
		
	}
	
	res.end("failed");
	
});

server.listen(port, hostname, () => {
	console.log(`===== Prompts Browser Extension server running at http://${hostname}:${port}/ =====`);
});
