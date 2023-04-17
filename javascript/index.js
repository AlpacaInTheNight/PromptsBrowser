
if(!window.PromptsBrowser) window.PromptsBrowser = {};
if(!PromptsBrowser.utils) PromptsBrowser.utils = {};

PromptsBrowser.DOMCache = {};
PromptsBrowser.data = {};
PromptsBrowser.db = {};

PromptsBrowser.state = {
	showControlPanel: true,
	showViews: ["known", "current", "positive", "negative"],
	currentContainer: "text2Img",
	currentPromptsList: {},
	selectedPrompt: undefined,
	editingPrompt: undefined,
	filesIteration: (new Date().valueOf()), //to avoid getting old image cache
	filterCategory: undefined,
	filterCollection: undefined,
	filterTags: undefined,
	sortKnownPrompts: undefined,
	copyOrMoveTo: undefined,
	dragItemId: undefined,
	dragCurrentIndex: undefined,
	promptToolsId: undefined,
	collectionToolsId: undefined,
	savePreviewCollection: undefined,
	editTargetCollection: undefined,
	editItem: undefined,
	showStylesWindow: undefined,
	showScriberWindow: undefined,
	toggledButtons: ["tools_tags", "tools_category", "tools_name", "new_in_all_collections"],
	selectedNewPrompts: [],
	promptsFilter: {},
}

PromptsBrowser.params = {};
PromptsBrowser.params.DEFAULT_PROMPT_WEIGHT = 1.1;
PromptsBrowser.params.EMPTY_CARD_GRADIENT = "linear-gradient(135deg, rgba(179,220,237,1) 0%,rgba(41,184,229,1) 50%,rgba(188,224,238,1) 100%)";
PromptsBrowser.params.NEW_CARD_GRADIENT = "linear-gradient(135deg, rgba(180,221,180,1) 0%,rgba(131,199,131,1) 17%,rgba(82,177,82,1) 33%,rgba(0,138,0,1) 67%,rgba(0,87,0,1) 83%,rgba(0,36,0,1) 100%)";

PromptsBrowser.data.categories = [
	"character",
	"portrait",
	"body",
	"composition",
	"object",
	"interior",
	"exterior",
	"artist",
	"action",
	"cloth",
	"style",
	"lighting",
	"building",
	"scenery",
	"architecture",
	"texture",
	"position",
	"background",
	"emotion",
	"media",
	"condition",
	"quality",
	"franchise",
	"effect",
	"meta",
	"creature"
].sort();

PromptsBrowser.supportedContainers = {
	text2Img: {
		prompt: "txt2img_prompt_container",
		gallery: "txt2img_gallery_container"
	},
	img2Img: {
		prompt: "img2img_prompt_container",
		gallery: "img2img_gallery_container"
	}
}

PromptsBrowser.utils.log = (message) => {
	console.log(message);
}

PromptsBrowser.utils.randomIntFromInterval = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

PromptsBrowser.utils.isInSameCollection = (promptA, promptB) => {
	let targetCollection = undefined;
	
	for(const id in PromptsBrowser.data.original) {
		const collection = PromptsBrowser.data.original[id];
		const containsA = collection.some(item => item.id === promptA);
		const containsB = collection.some(item => item.id === promptB);
		if(containsA && containsB) {
			targetCollection = id;
			break;
		}
	}
	
	return targetCollection
}

PromptsBrowser.db.movePrompt = (promptA, promptB, collectionId) => {
	const {united} = PromptsBrowser.data;
	const {state} = PromptsBrowser;
	if(!promptA || !promptB || promptA === promptB) return;

	if(!collectionId) collectionId = state.filterCollection;

	if(!collectionId) {
		const itemA = united.find(item => item.id === promptA);
		const itemB = united.find(item => item.id === promptB);
		if(!itemA.collections || !itemA.collections.length) return;
		if(!itemB.collections || !itemB.collections.length) return;

		for(const collectionItem of itemA.collections) {
			if(itemB.collections.includes(collectionItem)) {
				collectionId = collectionItem;
				break;
			}
		}
	}

	if(!collectionId) return;
	const targetCollection = PromptsBrowser.data.original[collectionId];
	if(!targetCollection) return;

	
	const indexInOriginB = targetCollection.findIndex(item => item.id === promptB);
	const element = targetCollection.splice(indexInOriginB, 1)[0];

	const indexInOriginA = targetCollection.findIndex(item => item.id === promptA);
	targetCollection.splice(indexInOriginA + 1, 0, element);

	PromptsBrowser.db.saveJSONData(collectionId);
	PromptsBrowser.db.updateMixedList();
	PromptsBrowser.knownPrompts.update();
	PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.gradioApp = () => {
	const elems = document.getElementsByTagName('gradio-app')
	const gradioShadowRoot = elems.length == 0 ? null : elems[0].shadowRoot
	return !!gradioShadowRoot ? gradioShadowRoot : document;
}

PromptsBrowser.utils.getPromptPreviewURL = (prompt, collectionDir) => {
	const {united} = PromptsBrowser.data;
	const {EMPTY_CARD_GRADIENT, NEW_CARD_GRADIENT} = PromptsBrowser.params;
	const {state} = PromptsBrowser;
	const targetPrompt = united.find(item => item.id === prompt);
	if(!targetPrompt) return NEW_CARD_GRADIENT;
	if(!targetPrompt.previewImage) return EMPTY_CARD_GRADIENT;
	const fileExtension = targetPrompt.previewImage;

	if(!collectionDir) {
		if(state.filterCollection && targetPrompt.collections.includes(state.filterCollection)) {
			collectionDir = state.filterCollection;
		} else collectionDir = targetPrompt.collections[0];
	}

	const safeFileName = PromptsBrowser.makeFileNameSafe(prompt);

	const url = `url('./file=prompts_catalogue/${collectionDir}/preview/${safeFileName}.${fileExtension}?${state.filesIteration}'), ${EMPTY_CARD_GRADIENT}`;

	return url;
}

PromptsBrowser.db.movePreviewImage = (item, from, to, type) => {
	const {state} = PromptsBrowser;

	(async () => {
		const rawResponse = await fetch('http://127.0.0.1:3000/movePreview', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({item, from, to, type})
		});
		//const content = await rawResponse.json();

		state.filesIteration++;
		PromptsBrowser.knownPrompts.update();
		PromptsBrowser.currentPrompts.update(true);
	})();
}

PromptsBrowser.db.saveJSONData = (collectionId) => {
	if(!collectionId) return;

	const targetData = PromptsBrowser.data.original[collectionId];
	if(!targetData) return;

	(async () => {
		const rawResponse = await fetch('http://127.0.0.1:3000/savePrompts', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({collection: collectionId, data: JSON.stringify(targetData)})
		});
		//const content = await rawResponse.json();

		PromptsBrowser.knownPrompts.update();
		PromptsBrowser.currentPrompts.update(true);
	})();
}

PromptsBrowser.db.savePromptPreview = () => {
	const {state} = PromptsBrowser;
	const {united} = PromptsBrowser.data;

	const imageArea = PromptsBrowser.DOMCache.containers[state.currentContainer].imageArea;

	if(!imageArea) return;
	if(!state.selectedPrompt) return;
	if(!state.savePreviewCollection) return;
	const activePrompts = PromptsBrowser.getCurrentPrompts();
	const imageContainer = imageArea.querySelector("img");
	if(!imageContainer) return;

	let isExternalNetwork = false;
	let src = imageContainer.src;
	const fileMarkIndex = src.indexOf("file=");
	if(fileMarkIndex === -1) return;
	src = src.slice(fileMarkIndex + 5);

	const imageExtension = src.split('.').pop();

	if(!PromptsBrowser.data.original[state.savePreviewCollection]) return;

	const targetCurrentPrompt = activePrompts.find(item => item.id === state.selectedPrompt);
	if(targetCurrentPrompt && targetCurrentPrompt.isExternalNetwork) isExternalNetwork = true;

	(async () => {
		const saveData = {src, prompt: state.selectedPrompt, collection: state.savePreviewCollection};
		if(isExternalNetwork) saveData.isExternalNetwork = true;

		const rawResponse = await fetch('http://127.0.0.1:3000/savePreview', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(saveData)
		});
		//const content = await rawResponse.json();

		let targetItem = united.find(item => item.id === state.selectedPrompt);
		if(!targetItem) {
			targetItem = {id: state.selectedPrompt, tags: [], category: [], collections: []};
			if(isExternalNetwork) targetItem.isExternalNetwork = true;
			united.push(targetItem);
		}

		if(!targetItem.collections) targetItem.collections = [];
		if(!targetItem.collections.includes(state.savePreviewCollection)) {
			targetItem.collections.push(state.savePreviewCollection);
		}

		let originalItem = PromptsBrowser.data.original[state.savePreviewCollection].find(item => item.id === state.selectedPrompt);
		if(!originalItem) {
			originalItem = {id: state.selectedPrompt, tags: [], category: []};
			if(isExternalNetwork) originalItem.isExternalNetwork = true;
			PromptsBrowser.data.original[state.savePreviewCollection].push(originalItem);
		}

		originalItem.previewImage = imageExtension;

		state.selectedPrompt = undefined;
		state.filesIteration++;
		PromptsBrowser.db.updateMixedList();
		
		PromptsBrowser.previewSave.update();
		PromptsBrowser.knownPrompts.update();
		PromptsBrowser.currentPrompts.update(true);
	})();
}

PromptsBrowser.db.updateStyles = (collectionId) => {
	if(!collectionId) return;

	const targetData = PromptsBrowser.data.styles[collectionId];
	if(!targetData) return;

	(async () => {
		const rawResponse = await fetch('http://127.0.0.1:3000/saveStyles', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({collection: collectionId, data: JSON.stringify(targetData)})
		});
		//const content = await rawResponse.json();

	})();
}

PromptsBrowser.getCurrentPrompts = () => {
	const {state} = PromptsBrowser;
	if(!state.currentPromptsList[state.currentContainer]) {
		state.currentPromptsList[state.currentContainer] = [];
	}

	return state.currentPromptsList[state.currentContainer];
}

PromptsBrowser.setCurrentPrompts = (currentPrompts) => {
	const {state} = PromptsBrowser;

	state.currentPromptsList[state.currentContainer] = currentPrompts;
}

PromptsBrowser.onChangeTab = (e) => {
	const tagName = e.target.tagName.toLowerCase()
	if(tagName !== "button") return;

	const {state} = PromptsBrowser;
	const text = e.target.innerText.trim();
	if(state.currentContainer === text) return;
	let update = false;

	if(text === "txt2img") {
		state.currentContainer = "text2Img";
		update = true;
	}

	if(text === "img2img") {
		state.currentContainer = "img2Img";
		update = true;
	}

	if(update) {
		PromptsBrowser.controlPanel.update();
		PromptsBrowser.previewSave.update();
		PromptsBrowser.knownPrompts.update();
		PromptsBrowser.currentPrompts.update();
	}
}

PromptsBrowser.loadConfig = () => {
	const {state} = PromptsBrowser;

	const lsShowViews = localStorage.getItem("PBE_showViews");
	if(lsShowViews) state.showViews = JSON.parse(lsShowViews);

	const showControlPanel = localStorage.getItem("showControlPanel");
	if(showControlPanel === "false") state.showControlPanel = false;
}

PromptsBrowser.initPromptBrowser = (tries = 0) => {
	const {state} = PromptsBrowser;
	const {DOMCache} = PromptsBrowser;
	const {united} = PromptsBrowser.data;
	if(!DOMCache.containers) DOMCache.containers = {};

	if(tries > 10) {
		PromptsBrowser.utils.log("No prompt wrapper container found or server did not returned prompts data.");
		return;
	}

	const checkContainer = PromptsBrowser.gradioApp().getElementById("txt2img_prompt_container");
	if(!checkContainer || !united) {
		window.__timeoutPBUpdatePrompt = setTimeout( () => PromptsBrowser.initPromptBrowser(tries + 1), 1000 );
		return;
	}

	const mainContainer = PromptsBrowser.gradioApp();
	DOMCache.mainContainer = mainContainer;

	const tabsContainer = mainContainer.querySelector("#tabs > div:first-child");

	tabsContainer.removeEventListener("click", PromptsBrowser.onChangeTab);
	tabsContainer.addEventListener("click", PromptsBrowser.onChangeTab);

	for(const containerId in PromptsBrowser.supportedContainers) {
		DOMCache.containers[containerId] = {};
		const container = PromptsBrowser.supportedContainers[containerId];
		const domContainer = DOMCache.containers[containerId];

		if(container.prompt) {
			const promptContainer = PromptsBrowser.gradioApp().getElementById(container.prompt);
			if(promptContainer.dataset.loadedpbextension) continue;
			promptContainer.dataset.loadedpbextension = "true";

			const positivePrompts = PromptsBrowser.gradioApp().querySelector(`#${container.prompt} > div`);
			const negativePrompts = PromptsBrowser.gradioApp().querySelector(`#${container.prompt} > div:nth-child(2)`);
			if(!positivePrompts || !negativePrompts) {
				PromptsBrowser.utils.log(`No prompt containers found for ${containerId}`);
				continue;
			}

			domContainer.promptContainer = promptContainer;
			domContainer.positivePrompts = positivePrompts;
			domContainer.negativePrompts = negativePrompts;

			domContainer.textArea = positivePrompts.querySelector("textarea");
			const textArea = domContainer.textArea;

			if(textArea && !textArea.dataset.pbelistenerready) {
				textArea.dataset.pbelistenerready = "true";

				textArea.removeEventListener("input", PromptsBrowser.synchroniseCurrentPrompts);
				textArea.addEventListener("input", PromptsBrowser.synchroniseCurrentPrompts);
			}

			PromptsBrowser.promptWordTooltip.init(positivePrompts, containerId);
			PromptsBrowser.controlPanel.init(promptContainer, containerId);
			PromptsBrowser.knownPrompts.init(promptContainer, positivePrompts, containerId);
			PromptsBrowser.currentPrompts.init(promptContainer, containerId);
			PromptsBrowser.styles.initButton(positivePrompts);
			PromptsBrowser.promptScribe.initButton(positivePrompts);

			if(domContainer.promptBrowser && !state.showViews.includes("known")) {
				domContainer.promptBrowser.style.display = "none";
			}

			if(domContainer.currentPrompts && !state.showViews.includes("current")) {
				domContainer.currentPrompts.style.display = "none";
			}

			if(!state.showViews.includes("positive")) positivePrompts.style.display = "none";
			if(!state.showViews.includes("negative")) negativePrompts.style.display = "none";
		}

		if(container.gallery) {
			domContainer.imageArea = PromptsBrowser.gradioApp().querySelector(`#${container.gallery}`);

			PromptsBrowser.previewSave.init(domContainer.imageArea, containerId);
		}
	}

	PromptsBrowser.promptEdit.init(mainContainer);
	PromptsBrowser.promptTools.init(mainContainer);
	PromptsBrowser.collectionTools.init(mainContainer);
	PromptsBrowser.styles.init(mainContainer);
	PromptsBrowser.promptScribe.init(mainContainer);

	PromptsBrowser.controlPanel.update();
	PromptsBrowser.previewSave.update();
	PromptsBrowser.knownPrompts.update();
	PromptsBrowser.currentPrompts.update();
}

PromptsBrowser.db.updateMixedList = () => {
	const unitedList = [];
	const res = PromptsBrowser.data.original;
	const addedIds = {};

	for(const collectionId in res) {
		const collection = res[collectionId];
		if(!Array.isArray(collection)) return;

		for(const collectionPrompt of collection) {
			const {id, isExternalNetwork, previewImage} = collectionPrompt;
			let newItem = {id, tags: [], category: [], collections: []};
			if(isExternalNetwork) newItem.isExternalNetwork = true;
			if(previewImage) newItem.previewImage = previewImage;

			if(addedIds[id]) {
				newItem = unitedList.find(item => item.id === id);
			}

			if(!newItem.collections.includes(collectionId)) {
				newItem.collections.push(collectionId);
			}

			if(collectionPrompt.tags) {
				collectionPrompt.tags.forEach(item => {
					if(!newItem.tags.includes(item)) newItem.tags.push(item);
				});
			}

			if(collectionPrompt.category) {
				collectionPrompt.category.forEach(item => {
					if(!newItem.category.includes(item)) newItem.category.push(item);
				});
			}

			if(!addedIds[id]) unitedList.push(newItem);
			addedIds[id] = true;
		}
	}

	PromptsBrowser.data.united = unitedList;
}

document.addEventListener('DOMContentLoaded', function() {
	PromptsBrowser.loadConfig();

	fetch("http://127.0.0.1:3000/getPrompts", {
		method: 'GET',
	}).then(data => data.json()).then(res => {
		if(!res || !res.prompts) return; //TODO: process server error here
		const {prompts, styles} = res;

		PromptsBrowser.data.styles = styles;
		PromptsBrowser.data.original = prompts;
		PromptsBrowser.db.updateMixedList();
	});
	
	PromptsBrowser.initPromptBrowser();
});
