import PromptsBrowser from "client/index";
import CurrentPrompts from "client/CurrentPrompts/index";
import LoadStyle from "client/LoadStyle/index";
import Prompt from "clientTypes/prompt";
import Style from "clientTypes/style";
import Data from "clientTypes/data";
import categories from "client/categories";
import { makeFileNameSafe } from "client/utils/index";
import { EMPTY_CARD_GRADIENT, NEW_CARD_GRADIENT } from "client/const";
import KnownPrompts from "client/KnownPrompts/index";
import savePromptPreview from "./savePromptPreview";
import getPromptPreviewURL from "./getPromptPreviewURL";

class Database {

    public static data: Data = {
        categories,
    } as Data;

    public static meta = {
        version: "1.3.0",
        readonly: false,
    }

    public static getAPIurl = (endpoint: string, root = false) => {
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
                const {id, isExternalNetwork, previewImage, previews, addAtStart, addAfter, addStart, addEnd} = collectionPrompt;
                let newItem: Prompt = {id, tags: [], category: [], collections: [], knownPreviews: {}, knownModelPreviews: {}};
                if(addedIds[id]) newItem = unitedArray.find(item => item.id === id);
    
                if(addAtStart) newItem.addAtStart = addAtStart;
                if(addAfter) newItem.addAfter = addAfter;
                if(addStart) newItem.addStart = addStart;
                if(addEnd) newItem.addEnd = addEnd;
    
                if(isExternalNetwork) newItem.isExternalNetwork = true;

                if(previewImage) {
                    newItem.knownPreviews[collectionId] = previewImage;
                }

                if(previews) {
                    for(const modelId in previews) {
                        if(previews[modelId] && previews[modelId].file) {
                            if(!newItem.knownModelPreviews[collectionId]) newItem.knownModelPreviews[collectionId] = {};
                            newItem.knownModelPreviews[collectionId][modelId] = previews[modelId].file;
                        }
                    }
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

    public static getPromptPreviewURL = getPromptPreviewURL;
    
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

    public static savePromptPreview = savePromptPreview;

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
