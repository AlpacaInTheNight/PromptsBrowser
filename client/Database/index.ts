import Prompt from "clientTypes/prompt";
import Style from "clientTypes/style";
import Data from "clientTypes/data";
import categories from "client/categories";
import ConfigManager from 'client/managers/Config'
import { updateCollectionsIteration } from "client/store";

import updateMixedList from "./updateMixedList";
import savePromptPreview from "./savePromptPreview";
import getPromptPreviewURL from './getPromptPreviewURL'
import getStylePreviewURL from './getStylePreviewURL'
import updateStylePreview from './updateStylePreview'
import renameStyle from './renameStyle'


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
        const url = Database.getAPIurl("getPrompts")
        
        await fetch(url, {
            method: 'GET',
        }).then(data => data.json()).then(res => {
            if(!res || !res.prompts) return; //TODO: process server error here
            const {readonly = false} = res;
            const prompts = res.prompts as {[key: string]: Prompt[]};
            const styles = res.styles as {[key: string]: Style[]};
    
            if(res.config) ConfigManager.setConfig(res.config);

            Database.data.styles = styles;
            Database.data.original = prompts;
            Database.updateMixedList();
    
            Database.meta.readonly = readonly;

            updateCollectionsIteration();
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
        })();
    }

    public static updateMixedList = updateMixedList;

    /**
     * Note: Code from the old implementation.
     * I found updating the prompt collection to be a simpler and more universal solution. I left this code in case I'm wrong.
     */
    /* public static movePrompt = (promptA: string, promptB: string, collectionId?: string) => {
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
    } */

    public static movePreviewImage = (item: string, movefrom: string, to: string, type: string) => {
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
    
            /* state.filesIteration++;
            KnownPrompts.update();
            CurrentPrompts.update(true); */
        })();
    }

    public static getPromptPreviewURL = getPromptPreviewURL;
    public static getStylePreviewURL = getStylePreviewURL;

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

    public static renameStyle = renameStyle;

    public static updateStylePreview = updateStylePreview;

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
        })();
    }

}

export default Database;
