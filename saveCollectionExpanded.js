const fs = require('fs');
const path = require('path');
const utils = require('./utils');

/**
 * Collection storege method that stores every prompt object in a separate file.
 * 
 * This format is designed to make it easier to control versions of a collection
 * and to work on collections in collaboration with others.
 */
function saveCollectionExpanded(pathToCollection, data, collection) {
	let d = new Date();
	console.log(d.toLocaleTimeString() + "-> updating data for: " + collection);

	const jsonData = JSON.parse(data);

	const promptsFolder = pathToCollection + "prompts";

	if(!fs.existsSync(promptsFolder)) {
		fs.mkdirSync(promptsFolder);
	}

	const promptOrder = [];
	const expectedFiles = [];

	for(let i = 0; i < jsonData.length; i++) {
		d = new Date();
		const promptItem = jsonData[i];
		const safeFileName = utils.makeFileNameSafe(promptItem.id);
		expectedFiles.push(safeFileName);
		promptOrder.push(promptItem.id);

		const pathToPromptFile = promptsFolder + path.sep + safeFileName + ".json";
		
		if(fs.existsSync(pathToPromptFile)) {
			const rawdata = fs.readFileSync(pathToPromptFile);
			const JSONData = JSON.parse(rawdata);

			if(!utils.compareDeep(promptItem, JSONData)) {
				fs.writeFileSync(pathToPromptFile, JSON.stringify(promptItem, null, "\t"));
				console.log(d.toLocaleTimeString() + "---> changed prompt: " + promptItem.id);
			}

		} else {
			fs.writeFileSync(pathToPromptFile, JSON.stringify(promptItem, null, "\t"));
			console.log(d.toLocaleTimeString() + "---> added prompt: " + promptItem.id);
		}
	}

	const promptsInFolder = fs.readdirSync(promptsFolder).filter(file => path.extname(file) === '.json');
	d = new Date();
	for(const fileItem of promptsInFolder) {
		const fileName = path.parse(fileItem).name;

		if(!expectedFiles.includes(fileName)) {
			const pathToPromptFile = promptsFolder + path.sep + fileName + ".json";
			fs.unlinkSync(pathToPromptFile);
			console.log(d.toLocaleTimeString() + "---> removed prompt file: " + fileName);
		}
	}

	fs.writeFileSync(pathToCollection + "order.json", JSON.stringify(promptOrder, null, "\t"));
}

exports.saveCollectionExpanded = saveCollectionExpanded;
