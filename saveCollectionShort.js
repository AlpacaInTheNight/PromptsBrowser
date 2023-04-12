const fs = require('fs');

function saveCollectionShort(pathToDataFile, data, collection) {
	const prevIndex = {};
	const newIndex = {};

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
}

exports.saveCollectionShort = saveCollectionShort;
