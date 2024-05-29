import PromptsBrowser from "client/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import PreviewSave from "client/PreviewSave/index";
import LoadStyle from "client/LoadStyle/index";
import Prompt from "clientTypes/prompt";
import Style from "clientTypes/style";
import Data from "clientTypes/data";
import categories from "client/categories";
import { makeFileNameSafe, normalizePrompt } from "client/utils/index";
import { EMPTY_CARD_GRADIENT, NEW_CARD_GRADIENT } from "client/const";
import KnownPrompts from "client/KnownPrompts/index";

class Database {

    public static data: Data = {
        categories,
    } as Data;

    public static meta = {
        version: "1.2.0",
        readonly: false,
    }

    private static getAPIurl = (endpoint: string, root = false) => {
        const server = root ? window.location.origin + "/" : window.location.origin + "/promptBrowser/";
    
        return server + endpoint;
    }

    public static async load() {
        const {state} = PromptsBrowser;
        const url = Database.getAPIurl("getPrompts")
        
        await fetch(url, {
            method: 'GET',
        }).then(data => data.json()).then(res => {
            if(!res || !res.prompts) return; //TODO: process server error here
            const {readonly = false} = res;
            const prompts = res.prompts as {[key: string]: Prompt[]};
            const styles = res.styles as {[key: string]: Style[]};
    
            if(res.config) {
                for(const i in res.config) {
                    (state as any).config[i] = res.config[i];
                }
            }
    
            Database.data.styles = styles;
            Database.data.original = prompts;
            Database.updateMixedList();
    
            Database.meta.readonly = readonly;
        });
    }

    public static saveJSONData = (collectionId: string, noClear = false, noUpdate = false) => {
        if(!collectionId) return;
    
        const targetData = Database.data.original[collectionId];
        if(!targetData) return;
    
        const url = Database.getAPIurl("savePrompts");
    
        (async () => {
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({collection: collectionId, data: JSON.stringify(targetData), noClear})
            });
    
            if(!noUpdate) {
                KnownPrompts.update();
                CurrentPrompts.update(true);
            }
        })();
    }

    public static updateMixedList() {
        const unitedArray: Prompt[] = [];
        const unitedList: {[key: string]: Prompt} = {};
        const res = Database.data.original;
        const addedIds: {[key: string]: boolean} = {};
    
        for(const collectionId in res) {
            const collection = res[collectionId];
            if(!Array.isArray(collection)) continue;
    
            for(const collectionPrompt of collection) {
                const {id, isExternalNetwork, previewImage, addAtStart, addAfter, addStart, addEnd} = collectionPrompt;
                let newItem: Prompt = {id, tags: [], category: [], collections: [], knownPreviews: {}};
                if(addedIds[id]) newItem = unitedArray.find(item => item.id === id);
    
                if(addAtStart) newItem.addAtStart = addAtStart;
                if(addAfter) newItem.addAfter = addAfter;
                if(addStart) newItem.addStart = addStart;
                if(addEnd) newItem.addEnd = addEnd;
    
                if(isExternalNetwork) newItem.isExternalNetwork = true;
                if(previewImage) {
                    newItem.knownPreviews[collectionId] = previewImage;
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
    
                if(!addedIds[id]) {
                    unitedArray.push(newItem);
                    unitedList[id] = newItem;
                }
                addedIds[id] = true;
            }
        }
    
        Database.data.united = unitedArray;
        Database.data.unitedList = unitedList;
    }

    public static movePrompt = (promptA: string, promptB: string, collectionId?: string) => {
        const {united} = Database.data;
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
        const targetCollection = Database.data.original[collectionId];
        if(!targetCollection) return;
        
        const indexInOriginB = targetCollection.findIndex(item => item.id === promptB);
        const indexInOriginA = targetCollection.findIndex(item => item.id === promptA);
    
        const element = targetCollection.splice(indexInOriginB, 1)[0];
        targetCollection.splice(indexInOriginA, 0, element);
    
        Database.saveJSONData(collectionId, false, true);
        Database.updateMixedList();
        KnownPrompts.update();
    }

    public static movePreviewImage = (item: string, movefrom: string, to: string, type: string) => {
        const {state} = PromptsBrowser;
        const url = Database.getAPIurl("movePreview");
    
        (async () => {
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({item, movefrom, to, type})
            });
    
            state.filesIteration++;
            KnownPrompts.update();
            CurrentPrompts.update(true);
        })();
    }

    public static getPromptPreviewURL = (prompt: string, collectionId?: string) => {
        if(!prompt) return NEW_CARD_GRADIENT;
        const apiUrl = Database.getAPIurl("promptImage");
        const {data} = Database;
        const {united} = data;
        const {state} = PromptsBrowser;
        let fileExtension = "";
    
        let targetPrompt = united.find(item => item.id.toLowerCase() === prompt.toLowerCase());
    
        //if no target prompt found - searching for the normalized version of the target prompt
        if(!targetPrompt) {
            const normalizedPrompt = normalizePrompt({prompt, state, data});
            targetPrompt = united.find(item => item.id.toLowerCase() === normalizedPrompt.toLowerCase());
        }
    
        //if no prompt found - returning New Card image.
        if(!targetPrompt || !targetPrompt.knownPreviews) return NEW_CARD_GRADIENT;
    
        if(!collectionId && state.filterCollection) collectionId = state.filterCollection;
    
        if(collectionId && targetPrompt.knownPreviews[collectionId])
            fileExtension = targetPrompt.knownPreviews[collectionId];
        
        if(!fileExtension) {
            for(let colId in targetPrompt.knownPreviews) {
                fileExtension = targetPrompt.knownPreviews[colId];
                collectionId = colId;
                break;
            }
        }
    
        if(!collectionId) return EMPTY_CARD_GRADIENT;
        if(!fileExtension) return EMPTY_CARD_GRADIENT;
    
        const safeFileName = makeFileNameSafe(prompt);
    
        const url = `url("${apiUrl}/${collectionId}/${safeFileName}.${fileExtension}?${state.filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
        return url;
    }
    
    public static getStylePreviewURL(style: Style) {
        const {state} = PromptsBrowser;
        if(!style) return NEW_CARD_GRADIENT;
        const {name, id, previewImage} = style;
        if(!name || !id || !previewImage) return NEW_CARD_GRADIENT;
    
        const apiUrl = Database.getAPIurl("styleImage");
    
        const safeFileName = makeFileNameSafe(name);
    
        const url = `url("${apiUrl}/${id}/${safeFileName}.${previewImage}?${state.filesIteration}"), ${EMPTY_CARD_GRADIENT}`;
        return url;
    }

    public static savePromptPreview = (callUpdate: boolean = true) => {
        const {state} = PromptsBrowser;
        const {data} = Database;
        const {united} = data;
        const {selectedPrompt, savePreviewCollection, currentContainer} = state;
        const url = Database.getAPIurl("savePreview");
    
        const imageArea = PromptsBrowser.DOMCache.containers[currentContainer].imageArea;
        if(!imageArea) return;
        if(!selectedPrompt) return;
        if(!savePreviewCollection) return;
        
        const activePrompts = PromptsBrowser.getCurrentPrompts();
        const imageContainer = imageArea.querySelector("img");
        if(!imageContainer) return;
    
        let isExternalNetwork = false;
        let src = imageContainer.src;
        const fileMarkIndex = src.indexOf("file=");
        if(fileMarkIndex === -1) return;
        src = src.slice(fileMarkIndex + 5);
    
        const cacheMarkIndex = src.indexOf("?");
        if(cacheMarkIndex && cacheMarkIndex !== -1) src = src.substring(0, cacheMarkIndex);
    
        const imageExtension = src.split('.').pop();
    
        if(!data.original[savePreviewCollection]) return;
    
        //const targetCurrentPrompt = activePrompts.find(item => item.id === state.selectedPrompt);
        const targetCurrentPrompt = PromptsBrowser.getPromptById({id: state.selectedPrompt});
        if(targetCurrentPrompt && targetCurrentPrompt.isExternalNetwork) isExternalNetwork = true;
    
        const saveData = {src, prompt: selectedPrompt, collection: savePreviewCollection};
        if(isExternalNetwork) (saveData as any).isExternalNetwork = true;
    
        let targetItem = united.find(item => item.id === selectedPrompt);
        if(!targetItem) {
            targetItem = {id: selectedPrompt, tags: [], category: [], collections: []};
            if(isExternalNetwork) targetItem.isExternalNetwork = true;
            united.push(targetItem);
        }
    
        if(!targetItem.collections) targetItem.collections = [];
        if(!targetItem.collections.includes(savePreviewCollection)) {
            targetItem.collections.push(savePreviewCollection);
        }
    
        let originalItem = data.original[savePreviewCollection].find(item => item.id === selectedPrompt);
        if(!originalItem) {
            originalItem = {id: selectedPrompt, tags: [], category: []};
            if(isExternalNetwork) originalItem.isExternalNetwork = true;
            data.original[savePreviewCollection].push(originalItem);
        }
    
        if(state.config.resizeThumbnails && state.config.resizeThumbnailsFormat) {
            originalItem.previewImage = state.config.resizeThumbnailsFormat.toLowerCase() as any;
    
        } else originalItem.previewImage = imageExtension as any;
    
        (async () => {
    
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });
            const answer = await rawResponse.json();
    
            if(answer === "ok" && callUpdate) {
                state.selectedPrompt = undefined;
                state.filesIteration++;
                Database.updateMixedList();
                
                PreviewSave.update();
                KnownPrompts.update();
                CurrentPrompts.update(true);
            }
    
        })();
    }

    public static updateStyles = (collectionId: string) => {
        if(!collectionId) return;
        const {data} = Database;
    
        const targetData = data.styles[collectionId];
        if(!targetData) return;
    
        const url = Database.getAPIurl("saveStyles");
    
        (async () => {
            const rawResponse = await fetch(url, {
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

    public static onRenameStyle = (collection: string, oldName: string, newName: string) => {
        const {data} = Database;
    
        if(!collection || !oldName || !newName) return;
    
        const url = Database.getAPIurl("renameStyle");
    
        (async () => {
            const saveData = {oldName, newName, collection};
    
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });
    
            const targetStylesCollection = data.styles[collection];
            if(targetStylesCollection) {
                targetStylesCollection.some(item => {
                    if(item.name === oldName) {
                        item.name = newName;
        
                        return true;
                    }
                });
            }
    
            LoadStyle.update();
        })();
    }

    public static onUpdateStylePreview = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const {data} = Database;
        const {state} = PromptsBrowser;
    
        let collectionId = undefined;
        let styleId = undefined;
    
        if(target.dataset.action) {
            const {selectedItem} = LoadStyle;
            collectionId = selectedItem.collection;
            styleId = selectedItem.styleId;
    
        } else {
            collectionId = target.dataset.id;
            styleId = target.dataset.id;
        }
    
        if(!collectionId || !styleId) return;
    
        const imageArea = PromptsBrowser.DOMCache.containers[state.currentContainer].imageArea;
        if(!imageArea) return;
    
        const imageContainer = imageArea.querySelector("img");
        if(!imageContainer) return;
    
        let src = imageContainer.src;
        const fileMarkIndex = src.indexOf("file=");
        if(fileMarkIndex === -1) return;
        src = src.slice(fileMarkIndex + 5);
    
        const cacheMarkIndex = src.indexOf("?");
        if(cacheMarkIndex && cacheMarkIndex !== -1) src = src.substring(0, cacheMarkIndex);
    
        const imageExtension = src.split('.').pop();
    
        const url = Database.getAPIurl("saveStylePreview");
    
        (async () => {
            const saveData = {src, style: styleId, collection: collectionId};
    
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });
            //const content = await rawResponse.json();
    
            const targetStylesCollection = data.styles[collectionId];
            if(targetStylesCollection) {
                targetStylesCollection.some(item => {
                    if(item.name === styleId) {
                        if(state.config.resizeThumbnails && state.config.resizeThumbnailsFormat) {
                            item.previewImage = state.config.resizeThumbnailsFormat.toLowerCase() as any;
                    
                        } else item.previewImage = imageExtension as any;
        
                        return true;
                    }
                });
            }
    
            LoadStyle.update();
        })();
    }

    public static createNewCollection(id: string, mode = "short") {
        if(!id) return;
        const url = Database.getAPIurl("newCollection");
    
        (async () => {
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id, mode})
            });
            //const answer = await rawResponse.json();
    
            Database.load();
            KnownPrompts.update();
            CurrentPrompts.update();
        })();
    }
    
    public static createNewStylesCollection(id: string, mode = "short") {
        if(!id) return;
        const url = Database.getAPIurl("newStylesCollection");
    
        (async () => {
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id, mode})
            });
            //const answer = await rawResponse.json();
    
            Database.load();
            KnownPrompts.update();
            CurrentPrompts.update();
        })();
    }

}

export default Database;
