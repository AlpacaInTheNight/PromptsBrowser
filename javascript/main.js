/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/DOMCache.ts":
/*!****************************!*\
  !*** ./client/DOMCache.ts ***!
  \****************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const DOMCache = {
        containers: {},
    };
    exports["default"] = DOMCache;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/getPromptPreviewURL.ts":
/*!************************************************!*\
  !*** ./client/Database/getPromptPreviewURL.ts ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! ./index */ "./client/Database/index.ts"), __webpack_require__(/*! ./utils/getModelPreview */ "./client/Database/utils/getModelPreview.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, const_1, index_2, getModelPreview_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.getModelPreview = void 0;
    exports.getModelPreview = getModelPreview_1.default;
    function getPromptPreviewURL({ prompt, collectionId, model, filesIteration = 0, filterCollection }) {
        if (!prompt)
            return const_1.NEW_CARD_GRADIENT;
        const apiUrl = index_2.default.getAPIurl("promptImage");
        const { data } = index_2.default;
        const { united } = data;
        let fileExtension = "";
        let targetPrompt = united.find(item => item.id.toLowerCase() === prompt.toLowerCase());
        //if no target prompt found - searching for the normalized version of the target prompt
        if (!targetPrompt) {
            const normalizedPrompt = (0, index_1.normalizePrompt)({ prompt, data });
            targetPrompt = united.find(item => item.id.toLowerCase() === normalizedPrompt.toLowerCase());
        }
        //if no prompt found - returning New Card image.
        if (!targetPrompt)
            return const_1.NEW_CARD_GRADIENT;
        if (!collectionId && filterCollection)
            collectionId = filterCollection;
        //checking target model previews
        if (model !== false && targetPrompt.knownModelPreviews) {
            const modelPreviewPath = (0, getModelPreview_1.default)({
                targetPrompt,
                desiredCollection: collectionId,
                targetModelOnly: true,
                desiredModel: model || false,
            });
            if (modelPreviewPath) {
                return `url("${apiUrl}/${modelPreviewPath}?${filesIteration}"), ${const_1.EMPTY_CARD_GRADIENT}`;
            }
        }
        //checking general previews
        if (!targetPrompt.knownPreviews)
            return const_1.NEW_CARD_GRADIENT;
        if (collectionId && targetPrompt.knownPreviews[collectionId])
            fileExtension = targetPrompt.knownPreviews[collectionId];
        if (!fileExtension) {
            for (let colId in targetPrompt.knownPreviews) {
                fileExtension = targetPrompt.knownPreviews[colId];
                collectionId = colId;
                break;
            }
        }
        if (!collectionId || !fileExtension) {
            if (model !== false) {
                const anyModelPreviewPath = (0, getModelPreview_1.default)({
                    targetPrompt,
                    desiredCollection: collectionId,
                    targetModelOnly: false,
                });
                if (anyModelPreviewPath) {
                    return `url("${apiUrl}/${anyModelPreviewPath}?${filesIteration}"), ${const_1.EMPTY_CARD_GRADIENT}`;
                }
            }
            return const_1.EMPTY_CARD_GRADIENT;
        }
        const safeFileName = (0, index_1.makeFileNameSafe)(prompt);
        const url = `url("${apiUrl}/${collectionId}/${safeFileName}.${fileExtension}?${filesIteration}"), ${const_1.EMPTY_CARD_GRADIENT}`;
        return url;
    }
    exports["default"] = getPromptPreviewURL;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/getStylePreviewURL.ts":
/*!***********************************************!*\
  !*** ./client/Database/getStylePreviewURL.ts ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./index */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/const */ "./client/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, store_1, index_2, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getStylePreviewURL(style) {
        const { filesIteration } = store_1.default.getState();
        if (!style)
            return const_1.NEW_CARD_GRADIENT;
        const { name, id, previewImage } = style;
        if (!name || !id || !previewImage)
            return const_1.NEW_CARD_GRADIENT;
        const apiUrl = index_1.default.getAPIurl("styleImage");
        const safeFileName = (0, index_2.makeFileNameSafe)(name);
        const url = `url("${apiUrl}/${id}/${safeFileName}.${previewImage}?${filesIteration}"), ${const_1.EMPTY_CARD_GRADIENT}`;
        return url;
    }
    exports["default"] = getStylePreviewURL;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/index.ts":
/*!**********************************!*\
  !*** ./client/Database/index.ts ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/categories */ "./client/categories.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./updateMixedList */ "./client/Database/updateMixedList.ts"), __webpack_require__(/*! ./savePromptPreview */ "./client/Database/savePromptPreview.ts"), __webpack_require__(/*! ./getPromptPreviewURL */ "./client/Database/getPromptPreviewURL.ts"), __webpack_require__(/*! ./getStylePreviewURL */ "./client/Database/getStylePreviewURL.ts"), __webpack_require__(/*! ./updateStylePreview */ "./client/Database/updateStylePreview.ts"), __webpack_require__(/*! ./renameStyle */ "./client/Database/renameStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, categories_1, Config_1, store_1, updateMixedList_1, savePromptPreview_1, getPromptPreviewURL_1, getStylePreviewURL_1, updateStylePreview_1, renameStyle_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class Database {
        static load() {
            return __awaiter(this, void 0, void 0, function* () {
                const url = Database.getAPIurl("getPrompts");
                yield fetch(url, {
                    method: 'GET',
                }).then(data => data.json()).then(res => {
                    if (!res || !res.prompts)
                        return; //TODO: process server error here
                    const { readonly = false } = res;
                    const prompts = res.prompts;
                    const styles = res.styles;
                    if (res.config)
                        Config_1.default.setConfig(res.config);
                    Database.data.styles = styles;
                    Database.data.original = prompts;
                    Database.updateMixedList();
                    Database.meta.readonly = readonly;
                    (0, store_1.updateCollectionsIteration)();
                });
            });
        }
        static createNewCollection(id, mode = "short") {
            if (!id)
                return;
            const url = Database.getAPIurl("newCollection");
            (() => __awaiter(this, void 0, void 0, function* () {
                const rawResponse = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id, mode })
                });
                //const answer = await rawResponse.json();
                Database.load();
            }))();
        }
        static createNewStylesCollection(id, mode = "short") {
            if (!id)
                return;
            const url = Database.getAPIurl("newStylesCollection");
            (() => __awaiter(this, void 0, void 0, function* () {
                const rawResponse = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id, mode })
                });
                //const answer = await rawResponse.json();
                Database.load();
            }))();
        }
    }
    _a = Database;
    Database.data = {
        categories: categories_1.default,
    };
    Database.meta = {
        version: "1.3.0",
        readonly: false,
    };
    Database.getAPIurl = (endpoint, root = false) => {
        const server = root ? window.location.origin + "/" : window.location.origin + "/promptBrowser/";
        return server + endpoint;
    };
    Database.saveJSONData = (collectionId, noClear = false, noUpdate = false) => {
        if (!collectionId)
            return;
        const targetData = Database.data.original[collectionId];
        if (!targetData)
            return;
        const url = Database.getAPIurl("savePrompts");
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ collection: collectionId, data: JSON.stringify(targetData), noClear })
            });
        }))();
    };
    Database.updateMixedList = updateMixedList_1.default;
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
    Database.movePreviewImage = (item, movefrom, to, type) => {
        const url = Database.getAPIurl("movePreview");
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item, movefrom, to, type })
            });
            /* state.filesIteration++;
            KnownPrompts.update();
            CurrentPrompts.update(true); */
        }))();
    };
    Database.getPromptPreviewURL = getPromptPreviewURL_1.default;
    Database.getStylePreviewURL = getStylePreviewURL_1.default;
    Database.savePromptPreview = savePromptPreview_1.default;
    Database.updateStyles = (collectionId) => {
        if (!collectionId)
            return;
        const { data } = Database;
        const targetData = data.styles[collectionId];
        if (!targetData)
            return;
        const url = Database.getAPIurl("saveStyles");
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ collection: collectionId, data: JSON.stringify(targetData) })
            });
            //const content = await rawResponse.json();
        }))();
    };
    Database.renameStyle = renameStyle_1.default;
    Database.updateStylePreview = updateStylePreview_1.default;
    exports["default"] = Database;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/renameStyle.ts":
/*!****************************************!*\
  !*** ./client/Database/renameStyle.ts ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./index */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function renameStyle(collection, oldName, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = index_1.default;
            if (!collection || !oldName || !newName)
                return;
            const url = index_1.default.getAPIurl("renameStyle");
            yield (() => __awaiter(this, void 0, void 0, function* () {
                const saveData = { oldName, newName, collection };
                const rawResponse = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(saveData)
                });
                const targetStylesCollection = data.styles[collection];
                if (targetStylesCollection) {
                    targetStylesCollection.some(item => {
                        if (item.name === oldName) {
                            item.name = newName;
                            return true;
                        }
                    });
                }
            }))();
        });
    }
    exports["default"] = renameStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/savePromptPreview.ts":
/*!**********************************************!*\
  !*** ./client/Database/savePromptPreview.ts ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/utils/getCheckpoint */ "./client/utils/getCheckpoint.ts"), __webpack_require__(/*! client/components/PreviewSave/store */ "./client/components/PreviewSave/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./index */ "./client/Database/index.ts"), __webpack_require__(/*! ./utils/getGeneratedImageSrc */ "./client/Database/utils/getGeneratedImageSrc.ts"), __webpack_require__(/*! ./utils/updateInCollections */ "./client/Database/utils/updateInCollections.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ActivePrompts_1, getCheckpoint_1, store_1, store_2, index_1, getGeneratedImageSrc_1, updateInCollections_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function savePromptPreview(callUpdate = true) {
        const { data } = index_1.default;
        const { selectedPrompt } = store_2.default.getState();
        const { previewCollection } = store_1.default.getState();
        const url = index_1.default.getAPIurl("savePreview");
        let isExternalNetwork = false;
        if (!data.original[previewCollection])
            return;
        const srcImage = (0, getGeneratedImageSrc_1.default)();
        if (!srcImage)
            return;
        const { src, extension } = srcImage;
        //checking if prompt have an external network syntax.
        const targetCurrentPrompt = ActivePrompts_1.default.getPromptById({ id: selectedPrompt });
        if (targetCurrentPrompt && targetCurrentPrompt.isExternalNetwork)
            isExternalNetwork = true;
        const saveData = { src, prompt: selectedPrompt, collection: previewCollection };
        if (isExternalNetwork)
            saveData.isExternalNetwork = true;
        const checkpoint = (0, getCheckpoint_1.default)();
        if (checkpoint)
            saveData.model = checkpoint;
        (0, updateInCollections_1.default)(isExternalNetwork, extension, checkpoint || "");
        (() => __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData)
            });
            const answer = yield rawResponse.json();
            if (answer === "ok" && callUpdate) {
                index_1.default.updateMixedList();
                (0, store_2.setSelectedPrompt)(undefined);
                (0, store_2.updateFilesIteration)();
            }
        }))();
    }
    exports["default"] = savePromptPreview;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/updateMixedList.ts":
/*!********************************************!*\
  !*** ./client/Database/updateMixedList.ts ***!
  \********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./index */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function updateMixedList() {
        const unitedArray = [];
        const unitedList = {};
        const res = index_1.default.data.original;
        const addedIds = {};
        for (const collectionId in res) {
            const collection = res[collectionId];
            if (!Array.isArray(collection))
                continue;
            for (const collectionPrompt of collection) {
                const { id, isExternalNetwork, previewImage, previews, addAtStart, addAfter, addStart, addEnd } = collectionPrompt;
                let newItem = { id, tags: [], category: [], collections: [], knownPreviews: {}, knownModelPreviews: {} };
                if (addedIds[id])
                    newItem = unitedArray.find(item => item.id === id);
                if (addAtStart)
                    newItem.addAtStart = addAtStart;
                if (addAfter)
                    newItem.addAfter = addAfter;
                if (addStart)
                    newItem.addStart = addStart;
                if (addEnd)
                    newItem.addEnd = addEnd;
                if (isExternalNetwork)
                    newItem.isExternalNetwork = true;
                if (previewImage) {
                    newItem.knownPreviews[collectionId] = previewImage;
                }
                if (previews) {
                    for (const modelId in previews) {
                        if (previews[modelId] && previews[modelId].file) {
                            if (!newItem.knownModelPreviews[collectionId])
                                newItem.knownModelPreviews[collectionId] = {};
                            newItem.knownModelPreviews[collectionId][modelId] = previews[modelId].file;
                        }
                    }
                }
                if (!newItem.collections.includes(collectionId)) {
                    newItem.collections.push(collectionId);
                }
                if (collectionPrompt.tags) {
                    collectionPrompt.tags.forEach(item => {
                        if (!newItem.tags.includes(item))
                            newItem.tags.push(item);
                    });
                }
                if (collectionPrompt.category) {
                    collectionPrompt.category.forEach(item => {
                        if (!newItem.category.includes(item))
                            newItem.category.push(item);
                    });
                }
                if (!addedIds[id]) {
                    unitedArray.push(newItem);
                    unitedList[id] = newItem;
                }
                addedIds[id] = true;
            }
        }
        index_1.default.data.united = unitedArray;
        index_1.default.data.unitedList = unitedList;
    }
    exports["default"] = updateMixedList;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/updateStylePreview.ts":
/*!***********************************************!*\
  !*** ./client/Database/updateStylePreview.ts ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! ./index */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, DOMCache_1, store_1, Config_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function updateStylePreview({ collectionId, styleId }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!collectionId || !styleId)
                return;
            const { data } = index_1.default;
            const { currentContainer } = store_1.default.getState();
            const config = Config_1.default.getConfig();
            const imageArea = DOMCache_1.default.containers[currentContainer].imageArea;
            if (!imageArea)
                return;
            const imageContainer = imageArea.querySelector("img");
            if (!imageContainer)
                return;
            let src = imageContainer.src;
            const fileMarkIndex = src.indexOf("file=");
            if (fileMarkIndex === -1)
                return;
            src = src.slice(fileMarkIndex + 5);
            const cacheMarkIndex = src.indexOf("?");
            if (cacheMarkIndex && cacheMarkIndex !== -1)
                src = src.substring(0, cacheMarkIndex);
            const imageExtension = src.split('.').pop();
            const url = index_1.default.getAPIurl("saveStylePreview");
            yield (() => __awaiter(this, void 0, void 0, function* () {
                const saveData = { src, style: styleId, collection: collectionId };
                const rawResponse = yield fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(saveData)
                });
                //const content = await rawResponse.json();
                const targetStylesCollection = data.styles[collectionId];
                if (targetStylesCollection) {
                    targetStylesCollection.some(item => {
                        if (item.name === styleId) {
                            if (config.resizeThumbnails && config.resizeThumbnailsFormat) {
                                item.previewImage = config.resizeThumbnailsFormat.toLowerCase();
                            }
                            else
                                item.previewImage = imageExtension;
                            return true;
                        }
                    });
                }
                index_1.default.updateStyles(collectionId);
            }))();
        });
    }
    exports["default"] = updateStylePreview;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/utils/getGeneratedImageSrc.ts":
/*!*******************************************************!*\
  !*** ./client/Database/utils/getGeneratedImageSrc.ts ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/components/PreviewSave/store */ "./client/components/PreviewSave/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, DOMCache_1, store_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getGeneratedImageSrc() {
        const { selectedPrompt, currentContainer } = store_1.default.getState();
        const { previewCollection } = store_2.default.getState();
        if (!currentContainer)
            return false;
        const imageArea = DOMCache_1.default.containers[currentContainer].imageArea;
        if (!imageArea || !selectedPrompt || !previewCollection)
            return false;
        const imageContainer = imageArea.querySelector("img");
        if (!imageContainer)
            return false;
        let src = imageContainer.src;
        const fileMarkIndex = src.indexOf("file=");
        if (fileMarkIndex === -1)
            return false;
        src = src.slice(fileMarkIndex + 5);
        const cacheMarkIndex = src.indexOf("?");
        if (cacheMarkIndex && cacheMarkIndex !== -1)
            src = src.substring(0, cacheMarkIndex);
        const extension = src.split('.').pop();
        return { src, extension };
    }
    exports["default"] = getGeneratedImageSrc;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/utils/getModelPreview.ts":
/*!**************************************************!*\
  !*** ./client/Database/utils/getModelPreview.ts ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/utils/getCheckpoint */ "./client/utils/getCheckpoint.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, getCheckpoint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getModelPreview({ targetPrompt, desiredCollection, desiredModel, targetModelOnly = false }) {
        if (!targetPrompt.knownModelPreviews)
            return false;
        if (!desiredModel)
            desiredModel = (0, getCheckpoint_1.default)();
        if (desiredModel)
            desiredModel = (0, index_1.makeFileNameSafe)(desiredModel);
        let foundDesiredModel = false;
        let targetCollection = "";
        let targetModel = "";
        let targetFile = "";
        for (const colId in targetPrompt.knownModelPreviews) {
            const models = targetPrompt.knownModelPreviews[colId];
            if (!models)
                continue;
            //checking all models if no preview for desired model found yet
            if (!foundDesiredModel) {
                for (const modelId in models) {
                    const fileItem = models[modelId];
                    if (fileItem) {
                        targetFile = fileItem;
                        targetModel = modelId;
                        targetCollection = colId;
                        if (modelId === desiredModel) {
                            foundDesiredModel = true;
                            break;
                        }
                    }
                }
            }
            else if (desiredModel && models[desiredModel]) { //checking only preview for desired model if found it in any other collection
                targetFile = models[desiredModel];
                targetModel = desiredModel;
                targetCollection = colId;
            }
            if (foundDesiredModel && colId === desiredCollection)
                break;
        }
        if (targetModelOnly && !foundDesiredModel)
            return false;
        if (targetCollection && targetModel && targetFile) {
            const safeFileName = (0, index_1.makeFileNameSafe)(targetPrompt.id);
            return `${targetCollection}/${targetModel}/${safeFileName}.${targetFile}`;
        }
        return false;
    }
    exports["default"] = getModelPreview;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/Database/utils/updateInCollections.ts":
/*!******************************************************!*\
  !*** ./client/Database/utils/updateInCollections.ts ***!
  \******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/components/PreviewSave/store */ "./client/components/PreviewSave/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../index */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Config_1, index_1, store_1, store_2, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function updateInCollections(isExternalNetwork, extension, checkpoint = "") {
        const { data } = index_2.default;
        const { united, original } = data;
        const config = Config_1.default.getConfig();
        const { selectedPrompt } = store_2.default.getState();
        const { previewCollection } = store_1.default.getState();
        checkpoint = (0, index_1.makeFileNameSafe)(checkpoint);
        let targetItem = united.find(item => item.id === selectedPrompt);
        if (!targetItem) {
            targetItem = { id: selectedPrompt, tags: [], category: [], collections: [] };
            if (isExternalNetwork)
                targetItem.isExternalNetwork = true;
            united.push(targetItem);
        }
        if (!targetItem.collections)
            targetItem.collections = [];
        if (!targetItem.collections.includes(previewCollection)) {
            targetItem.collections.push(previewCollection);
        }
        let originalItem = original[previewCollection].find(item => item.id === selectedPrompt);
        if (!originalItem) {
            originalItem = { id: selectedPrompt, tags: [], category: [] };
            if (isExternalNetwork)
                originalItem.isExternalNetwork = true;
            original[previewCollection].push(originalItem);
        }
        if (config.resizeThumbnails && config.resizeThumbnailsFormat)
            extension = config.resizeThumbnailsFormat.toLowerCase();
        if (config.savePreviewForModel) {
            if (!originalItem.previews)
                originalItem.previews = {};
            if (checkpoint)
                originalItem.previews[checkpoint] = {
                    file: extension,
                };
        }
        else
            originalItem.previewImage = extension;
    }
    exports["default"] = updateInCollections;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/categories.ts":
/*!******************************!*\
  !*** ./client/categories.ts ***!
  \******************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const categories = [
        "character",
        "character description",
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
    exports["default"] = categories;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Actions/Autogen.tsx":
/*!***************************************************************!*\
  !*** ./client/components/CollectionTools/Actions/Autogen.tsx ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ../events/onChangeAutogenCollection */ "./client/components/CollectionTools/events/onChangeAutogenCollection.ts"), __webpack_require__(/*! ../events/onAssignAutogenStyle */ "./client/components/CollectionTools/events/onAssignAutogenStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1, onChangeAutogenCollection_1, onAssignAutogenStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Autogen() {
        const { data } = Database_1.default;
        const autogenCol = (0, store_1.default)(state => state.autogenCol);
        const autogenStyle = (0, store_1.default)(state => state.autogenStyle);
        const JSXStyleCollections = [];
        const JSXStyleItems = [];
        for (const colId in data.styles)
            JSXStyleCollections.push(React.createElement("option", { value: colId, key: colId }, colId));
        if (autogenCol) {
            const targetCollection = data.styles[autogenCol];
            if (targetCollection) {
                for (const styleItem of targetCollection)
                    JSXStyleItems.push(React.createElement("option", { value: styleItem.name, key: styleItem.name }, styleItem.name));
            }
        }
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "Autogenerate style"),
            React.createElement("select", { className: "PBE_generalInput PBE_select", value: autogenCol, onChange: onChangeAutogenCollection_1.default },
                React.createElement("option", { value: "" }, "None"),
                JSXStyleCollections),
            React.createElement("select", { className: "PBE_generalInput PBE_select", value: autogenStyle, onChange: e => (0, store_1.setAutogenStyle)(e.currentTarget.value) },
                React.createElement("option", { value: "" }, "None"),
                JSXStyleItems),
            React.createElement("button", { className: "PBE_button", title: "", onClick: onAssignAutogenStyle_1.default }, "Assign")));
    }
    exports["default"] = Autogen;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Actions/Category.tsx":
/*!****************************************************************!*\
  !*** ./client/components/CollectionTools/Actions/Category.tsx ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ../events/onAddCategory */ "./client/components/CollectionTools/events/onAddCategory.ts"), __webpack_require__(/*! ../events/onRemoveCategory */ "./client/components/CollectionTools/events/onRemoveCategory.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, Database_1, store_1, onAddCategory_1, onRemoveCategory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Category() {
        const { data } = Database_1.default;
        const categories = data.categories;
        const category = (0, store_1.default)(state => state.category);
        (0, react_1.useEffect)(() => {
            const { category } = store_1.default.getState();
            if (category)
                return;
            for (const categoryItem of categories) {
                (0, store_1.setCategory)(categoryItem);
                break;
            }
        }, []);
        const JSXCategories = [];
        for (const categoryItem of categories) {
            JSXCategories.push(React.createElement("option", { value: categoryItem, key: categoryItem }, categoryItem));
        }
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "Category"),
            React.createElement("select", { className: "PBE_generalInput PBE_select PBE_categoryAction", value: category, onChange: e => (0, store_1.setCategory)(e.currentTarget.value) }, JSXCategories),
            React.createElement("button", { className: "PBE_button", title: "Add selected category to all selected prompts", onClick: onAddCategory_1.default }, "Add"),
            React.createElement("button", { className: "PBE_button PBE_buttonCancel", title: "Remove selected category from all selected prompts", onClick: onRemoveCategory_1.default }, "Remove")));
    }
    exports["default"] = Category;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Actions/Copy.tsx":
/*!************************************************************!*\
  !*** ./client/components/CollectionTools/Actions/Copy.tsx ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../events/onMoveSelected */ "./client/components/CollectionTools/events/onMoveSelected.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1, store_2, onMoveSelected_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Copy() {
        const { data } = Database_1.default;
        const filterCollection = (0, store_2.default)(state => state.filterCollection);
        let copyOrMoveTo = (0, store_1.default)(state => state.copyOrMoveTo);
        const JSXCollections = [];
        for (const collectionId in data.original) {
            if (collectionId === filterCollection)
                continue;
            if (!copyOrMoveTo)
                copyOrMoveTo = collectionId;
            JSXCollections.push(React.createElement("option", { value: collectionId, key: collectionId }, collectionId));
        }
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "Collection"),
            React.createElement("select", { className: "PBE_generalInput PBE_select", value: copyOrMoveTo, onChange: e => (0, store_1.setCopyOrMoveTo)(e.currentTarget.value) }, JSXCollections),
            React.createElement("button", { className: "PBE_button", title: "Move selected prompts to the target collection", onClick: e => (0, onMoveSelected_1.default)() }, "Move"),
            React.createElement("button", { className: "PBE_button", title: "Copy selected prompts to the target collection", onClick: e => (0, onMoveSelected_1.default)(true) }, "Copy")));
    }
    exports["default"] = Copy;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Actions/Generate.tsx":
/*!****************************************************************!*\
  !*** ./client/components/CollectionTools/Actions/Generate.tsx ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ../events/onGeneratePreviews */ "./client/components/CollectionTools/events/onGeneratePreviews/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1, onGeneratePreviews_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Generate() {
        const { data } = Database_1.default;
        const generateMode = (0, store_1.default)(state => state.generateMode);
        const JSXStyleCollections = [];
        for (const colId in data.styles)
            JSXStyleCollections.push(React.createElement("option", { value: colId, key: colId }, colId));
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "Generate preview"),
            React.createElement("select", { className: "PBE_generalInput PBE_select", value: generateMode, onChange: e => (0, store_1.setGenerateMode)(e.currentTarget.value) },
                React.createElement("option", { value: "prompt" }, "Prompt only"),
                React.createElement("option", { value: "current" }, "With current prompts"),
                React.createElement("option", { value: "autogen" }, "With prompt autogen style"),
                React.createElement("option", { value: "selected" }, "With selected autogen style")),
            React.createElement("button", { className: "PBE_button", onClick: onGeneratePreviews_1.default }, "Generate")));
    }
    exports["default"] = Generate;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Actions/Operations.tsx":
/*!******************************************************************!*\
  !*** ./client/components/CollectionTools/Actions/Operations.tsx ***!
  \******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../events/onToggleSelected */ "./client/components/CollectionTools/events/onToggleSelected.ts"), __webpack_require__(/*! ../events/onDeleteSelected */ "./client/components/CollectionTools/events/onDeleteSelected.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, onToggleSelected_1, onDeleteSelected_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Operations() {
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "Actions"),
            React.createElement("button", { className: "PBE_button", title: "Select and unselect all visible prompts", onClick: onToggleSelected_1.default }, "Toggle all"),
            React.createElement("button", { className: "PBE_button PBE_buttonCancel", title: "Delete selected prompts", onClick: onDeleteSelected_1.default }, "Delete selected")));
    }
    exports["default"] = Operations;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Actions/Tags.tsx":
/*!************************************************************!*\
  !*** ./client/components/CollectionTools/Actions/Tags.tsx ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/components/ui/TagTooltip */ "./client/components/ui/TagTooltip/index.tsx"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ../events/onAddTags */ "./client/components/CollectionTools/events/onAddTags.ts"), __webpack_require__(/*! ../events/onRemoveTags */ "./client/components/CollectionTools/events/onRemoveTags.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, Database_1, TagTooltip_1, store_1, onAddTags_1, onRemoveTags_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Tags() {
        const { data } = Database_1.default;
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const tags = (0, store_1.default)(state => state.tags);
        const JSXStyleCollections = [];
        for (const colId in data.styles)
            JSXStyleCollections.push(React.createElement("option", { value: colId, key: colId }, colId));
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "Tags"),
            React.createElement(TagTooltip_1.default, { iteration: iterate, tags: tags.split(","), onUpdate: (tags) => {
                    (0, store_1.setTags)(tags.join(", "));
                } }),
            React.createElement("button", { className: "PBE_button", title: "Add target tags to all selected prompts", onClick: e => {
                    (0, onAddTags_1.default)();
                    (0, store_1.setTags)("");
                    setIterate(iterate + 1);
                } }, "Add"),
            React.createElement("button", { className: "PBE_button PBE_buttonCancel", title: "Remove target tags from all selected prompts", onClick: e => {
                    (0, onRemoveTags_1.default)();
                    (0, store_1.setTags)("");
                    setIterate(iterate + 1);
                } }, "Remove")));
    }
    exports["default"] = Tags;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Actions/index.tsx":
/*!*************************************************************!*\
  !*** ./client/components/CollectionTools/Actions/index.tsx ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ./Operations */ "./client/components/CollectionTools/Actions/Operations.tsx"), __webpack_require__(/*! ./Copy */ "./client/components/CollectionTools/Actions/Copy.tsx"), __webpack_require__(/*! ./Category */ "./client/components/CollectionTools/Actions/Category.tsx"), __webpack_require__(/*! ./Tags */ "./client/components/CollectionTools/Actions/Tags.tsx"), __webpack_require__(/*! ./Autogen */ "./client/components/CollectionTools/Actions/Autogen.tsx"), __webpack_require__(/*! ./Generate */ "./client/components/CollectionTools/Actions/Generate.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, Operations_1, Copy_1, Category_1, Tags_1, Autogen_1, Generate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Actions() {
        const { data } = Database_1.default;
        const showCopy = Object.keys(data.original).length > 1;
        return (React.createElement("div", { className: "PBE_collectionToolsActions PBE_row" },
            React.createElement(Operations_1.default, null),
            (showCopy) && React.createElement(Copy_1.default, null),
            React.createElement(Category_1.default, null),
            React.createElement(Tags_1.default, null),
            React.createElement(Autogen_1.default, null),
            React.createElement(Generate_1.default, null)));
    }
    exports["default"] = Actions;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Content.tsx":
/*!*******************************************************!*\
  !*** ./client/components/CollectionTools/Content.tsx ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ./events/onSelectPrompt */ "./client/components/CollectionTools/events/onSelectPrompt.ts"), __webpack_require__(/*! ../ui/PromptsFilter/checkFilter */ "./client/components/ui/PromptsFilter/checkFilter.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1, store_2, onSelectPrompt_1, checkFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Content() {
        const { data } = Database_1.default;
        const filterCollection = (0, store_1.default)(state => state.filterCollection);
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        const selectedPrompts = (0, store_2.default)(state => state.selectedPrompts);
        const promptsFilter = (0, store_2.default)(state => state.promptsFilter);
        const iterate = (0, store_2.default)(state => state.iterate);
        const targetCollection = data.original[filterCollection];
        if (!targetCollection)
            return React.createElement("div", null);
        const JSXPrompts = [];
        targetCollection.forEach(item => {
            const { id, tags = [], category = [], comment = "" } = item;
            if (!id)
                return null;
            const isShown = (0, checkFilter_1.default)(item, promptsFilter);
            if (!isShown)
                return null;
            const isSelected = selectedPrompts.includes(id);
            JSXPrompts.push(React.createElement("div", { key: id, className: "PBE_detailedItem" +
                    (isSelected ? " selected" : "") },
                React.createElement("div", { className: "PBE_detailedItemSelector", style: {
                        backgroundImage: Database_1.default.getPromptPreviewURL({
                            prompt: id,
                            collectionId: filterCollection,
                            filesIteration,
                        })
                    }, onClick: onSelectPrompt_1.default, "data-id": id }),
                React.createElement("div", { className: "PBE_detailedItemContent" },
                    React.createElement("div", { className: "PBE_detailedItemTop" },
                        React.createElement("div", { className: "PBE_detailedItemName" }, id),
                        React.createElement("div", { className: "PBE_detailedItemComment" }, comment)),
                    (tags.length > 0 || category.length > 0) && (React.createElement("div", { className: "PBE_detailedItemBottom" },
                        tags.length > 0 && (React.createElement("div", { className: "PBE_detailedItemTags" }, tags.join(", "))),
                        category.length > 0 && (React.createElement("div", { className: "PBE_detailedItemCategories" }, category.join(", "))))))));
        });
        return (React.createElement("div", { className: "PBE_dataBlock PBE_Scrollbar PBE_windowContent", "data-iterate": iterate, "data-files": filesIteration }, JSXPrompts));
    }
    exports["default"] = Content;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Header.tsx":
/*!******************************************************!*\
  !*** ./client/components/CollectionTools/Header.tsx ***!
  \******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../ui/PromptsFilter */ "./client/components/ui/PromptsFilter/index.tsx"), __webpack_require__(/*! ./store */ "./client/components/CollectionTools/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, PromptsFilter_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Header() {
        return (React.createElement("div", { className: "PBE_collectionToolsHeader" },
            React.createElement(PromptsFilter_1.default, { onChange: store_1.setPromptsFilter })));
    }
    exports["default"] = Header;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/Status.tsx":
/*!******************************************************!*\
  !*** ./client/components/CollectionTools/Status.tsx ***!
  \******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./store */ "./client/components/CollectionTools/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Status() {
        const autogenStatus = (0, store_1.default)(state => state.autogenStatus);
        const selectedPrompts = (0, store_1.default)(state => state.selectedPrompts);
        let selectionText = "";
        const prevItems = [];
        const MAX_SHOWN_DETAILED = 3;
        if (!selectedPrompts || !selectedPrompts.length) {
            selectionText = "No items selected";
        }
        else {
            for (let i = 0; i < selectedPrompts.length; i++) {
                if (i + 1 > MAX_SHOWN_DETAILED)
                    break;
                prevItems.push(`"${selectedPrompts[i]}"`);
            }
            if (prevItems.length)
                selectionText += prevItems.join(", ");
            const allSelected = selectedPrompts.length;
            if (allSelected > MAX_SHOWN_DETAILED) {
                selectionText += `, and ${allSelected - MAX_SHOWN_DETAILED} more items selected.`;
            }
        }
        return (React.createElement("div", { className: "PBE_collectionToolsStatus PBE_row" },
            autogenStatus !== "" &&
                React.createElement("div", { className: "PBE_collectionToolsAutogenInfo" }, autogenStatus),
            React.createElement("div", { className: "PBE_collectionToolsSelectedInfo" }, selectionText)));
    }
    exports["default"] = Status;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onAddCategory.ts":
/*!*******************************************************************!*\
  !*** ./client/components/CollectionTools/events/onAddCategory.ts ***!
  \*******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ./updateCurrentCollection */ "./client/components/CollectionTools/events/updateCurrentCollection.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2, updateCurrentCollection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onAddCategory() {
        const { data } = Database_1.default;
        const { filterCollection } = store_1.default.getState();
        const { category, selectedPrompts } = store_2.default.getState();
        if (!filterCollection)
            return;
        const targetCollection = data.original[filterCollection];
        if (!selectedPrompts || !selectedPrompts.length || !targetCollection || !category)
            return;
        for (const promptId of selectedPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if (!prompt)
                continue;
            if (!prompt.category)
                prompt.category = [];
            if (!prompt.category.includes(category))
                prompt.category.push(category);
        }
        (0, updateCurrentCollection_1.default)();
    }
    exports["default"] = onAddCategory;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onAddTags.ts":
/*!***************************************************************!*\
  !*** ./client/components/CollectionTools/events/onAddTags.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ./updateCurrentCollection */ "./client/components/CollectionTools/events/updateCurrentCollection.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2, updateCurrentCollection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onAddTags() {
        const { data } = Database_1.default;
        const { filterCollection } = store_1.default.getState();
        const { tags, selectedPrompts } = store_2.default.getState();
        if (!filterCollection)
            return;
        const targetCollection = data.original[filterCollection];
        if (!selectedPrompts || !selectedPrompts.length || !targetCollection || !tags)
            return;
        const tagsArr = tags.split(",");
        for (let i = 0; i < tagsArr.length; i++)
            tagsArr[i] = tagsArr[i].trim();
        for (const promptId of selectedPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if (!prompt)
                continue;
            if (!prompt.tags)
                prompt.tags = [];
            for (const tagItem of tagsArr) {
                if (!prompt.tags.includes(tagItem))
                    prompt.tags.push(tagItem);
            }
        }
        (0, updateCurrentCollection_1.default)();
    }
    exports["default"] = onAddTags;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onAssignAutogenStyle.ts":
/*!**************************************************************************!*\
  !*** ./client/components/CollectionTools/events/onAssignAutogenStyle.ts ***!
  \**************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ./updateCurrentCollection */ "./client/components/CollectionTools/events/updateCurrentCollection.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2, updateCurrentCollection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onAssignAutogenStyle() {
        const { data } = Database_1.default;
        const { filterCollection } = store_1.default.getState();
        const { selectedPrompts, autogenCol, autogenStyle } = store_2.default.getState();
        if (!filterCollection)
            return;
        const targetCollection = data.original[filterCollection];
        if (!selectedPrompts || !selectedPrompts.length || !targetCollection)
            return;
        for (const promptId of selectedPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if (!prompt)
                continue;
            if (autogenCol && autogenStyle)
                prompt.autogen = { collection: autogenCol, style: autogenStyle };
            else
                delete prompt.autogen;
        }
        (0, updateCurrentCollection_1.default)();
    }
    exports["default"] = onAssignAutogenStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onChangeAutogenCollection.ts":
/*!*******************************************************************************!*\
  !*** ./client/components/CollectionTools/events/onChangeAutogenCollection.ts ***!
  \*******************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onChangeAutogenCollection(e) {
        const { data } = Database_1.default;
        const target = e.currentTarget;
        const collection = target.value;
        let style = "";
        if (collection) {
            const targetCollection = data.styles[collection];
            if (targetCollection)
                for (const styleItem of targetCollection) {
                    style = styleItem.name;
                    break;
                }
        }
        (0, store_1.setAutogenCol)(collection);
        (0, store_1.setAutogenStyle)(style);
    }
    exports["default"] = onChangeAutogenCollection;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onDeleteSelected.ts":
/*!**********************************************************************!*\
  !*** ./client/components/CollectionTools/events/onDeleteSelected.ts ***!
  \**********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Deletes selected prompts after a user confirmation
     */
    function onDeleteSelected() {
        const { data } = Database_1.default;
        const { selectedPrompts } = store_2.default.getState();
        const { filterCollection } = store_1.default.getState();
        if (!filterCollection)
            return;
        const targetCollection = data.original[filterCollection];
        if (!selectedPrompts || !selectedPrompts.length || !targetCollection)
            return;
        if (confirm(`Remove ${selectedPrompts.length} prompts from catalogue "${filterCollection}"?`)) {
            data.original[filterCollection] = targetCollection.filter(prompt => !selectedPrompts.includes(prompt.id));
            for (const deletedPromptId of selectedPrompts) {
                Database_1.default.movePreviewImage(deletedPromptId, filterCollection, filterCollection, "delete");
            }
            Database_1.default.saveJSONData(filterCollection);
            Database_1.default.updateMixedList();
            (0, store_2.setSelectedPrompts)([]);
        }
    }
    exports["default"] = onDeleteSelected;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onGeneratePreviews/StaticStore.ts":
/*!************************************************************************************!*\
  !*** ./client/components/CollectionTools/events/onGeneratePreviews/StaticStore.ts ***!
  \************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const StaticStore = {
        generateQueue: [],
        generateNextTimer: 0,
    };
    exports["default"] = StaticStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onGeneratePreviews/checkProgressState.ts":
/*!*******************************************************************************************!*\
  !*** ./client/components/CollectionTools/events/onGeneratePreviews/checkProgressState.ts ***!
  \*******************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./generateNextPreview */ "./client/components/CollectionTools/events/onGeneratePreviews/generateNextPreview.ts"), __webpack_require__(/*! ./StaticStore */ "./client/components/CollectionTools/events/onGeneratePreviews/StaticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, DOMCache_1, store_1, generateNextPreview_1, StaticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function checkProgressState() {
        const { currentContainer } = store_1.default.getState();
        const resultsContainer = DOMCache_1.default.containers[currentContainer].resultsContainer;
        if (!resultsContainer)
            return;
        /**
         * Progress bar is being added during generation and is removed from the DOM after generation finished.
         * Its presence serves as a marker when checking the state of generation.
         */
        const progressBar = resultsContainer.querySelector(".progressDiv");
        if (!progressBar) {
            Database_1.default.savePromptPreview(false);
            (0, generateNextPreview_1.default)();
            return;
        }
        clearTimeout(StaticStore_1.default.generateNextTimer);
        StaticStore_1.default.generateNextTimer = setTimeout(checkProgressState, 500);
    }
    exports["default"] = checkProgressState;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onGeneratePreviews/generateNextPreview.ts":
/*!********************************************************************************************!*\
  !*** ./client/components/CollectionTools/events/onGeneratePreviews/generateNextPreview.ts ***!
  \********************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/components/PreviewSave/store */ "./client/components/PreviewSave/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ./checkProgressState */ "./client/components/CollectionTools/events/onGeneratePreviews/checkProgressState.ts"), __webpack_require__(/*! ./StaticStore */ "./client/components/CollectionTools/events/onGeneratePreviews/StaticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, ActivePrompts_1, DOMCache_1, index_2, store_1, store_2, store_3, checkProgressState_1, StaticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function generateNextPreview() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = index_1.default;
            const { filterCollection, currentContainer } = store_2.default.getState();
            const textArea = DOMCache_1.default.containers[currentContainer].textArea;
            const generateButton = DOMCache_1.default.containers[currentContainer].generateButton;
            if (!textArea || !generateButton)
                return;
            const nextItem = StaticStore_1.default.generateQueue.shift();
            if (!nextItem) {
                (0, index_2.log)("Finished generating prompt previews.");
                (0, store_2.setSelectedPrompt)(undefined);
                (0, store_2.updateFilesIteration)();
                index_1.default.updateMixedList();
                return;
            }
            const message = `Generating preview for "${nextItem.id}". ${StaticStore_1.default.generateQueue.length} items in queue left. `;
            (0, index_2.log)(message);
            (0, store_3.setAutogenStatus)(message);
            (0, store_2.setSelectedPrompt)(nextItem.id);
            (0, store_1.setPreviewCollection)(filterCollection);
            if (nextItem.autogen && nextItem.autogen.collection && nextItem.autogen.style) {
                const delay = (ms) => new Promise(res => setTimeout(res, ms));
                const targetCollection = data.styles[nextItem.autogen.collection];
                if (targetCollection) {
                    const targetStyle = targetCollection.find(item => item.name === nextItem.autogen.style);
                    if (targetStyle) {
                        ActivePrompts_1.default.applyStyle(targetStyle, true, true);
                        yield delay(600); //need a pause due to a hacky nature of changing APP state
                        textArea.value = `((${nextItem.id})), ${textArea.value}`;
                    }
                }
            }
            else if (nextItem.addPrompts) {
                textArea.value = `((${nextItem.id})), ${nextItem.addPrompts}`;
            }
            else
                textArea.value = nextItem.id;
            textArea.dispatchEvent(new Event('focus'));
            textArea.dispatchEvent(new Event('input'));
            textArea.dispatchEvent(new KeyboardEvent('keyup'));
            textArea.dispatchEvent(new KeyboardEvent('keypress'));
            textArea.dispatchEvent(new Event('blur'));
            generateButton.dispatchEvent(new Event('click'));
            clearTimeout(StaticStore_1.default.generateNextTimer);
            StaticStore_1.default.generateNextTimer = setTimeout(checkProgressState_1.default, 100);
        });
    }
    exports["default"] = generateNextPreview;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onGeneratePreviews/index.ts":
/*!******************************************************************************!*\
  !*** ./client/components/CollectionTools/events/onGeneratePreviews/index.ts ***!
  \******************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ../../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./generateNextPreview */ "./client/components/CollectionTools/events/onGeneratePreviews/generateNextPreview.ts"), __webpack_require__(/*! ./StaticStore */ "./client/components/CollectionTools/events/onGeneratePreviews/StaticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, DOMCache_1, store_1, store_2, generateNextPreview_1, StaticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onGeneratePreviews() {
        const { data } = index_1.default;
        const { currentContainer, filterCollection } = store_2.default.getState();
        const { selectedPrompts, generateMode, autogenCol, autogenStyle } = store_1.default.getState();
        const textArea = DOMCache_1.default.containers[currentContainer].textArea;
        const targetCollection = data.original[filterCollection];
        let currentPrompt = "";
        if (!selectedPrompts || !selectedPrompts.length || !targetCollection)
            return;
        StaticStore_1.default.generateQueue = [];
        if (generateMode === "current" && textArea) {
            currentPrompt = textArea.value;
        }
        for (const promptId of selectedPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if (!prompt)
                continue;
            const generateItem = {
                id: promptId,
            };
            if (generateMode === "current") {
                generateItem.addPrompts = currentPrompt;
            }
            else if (generateMode === "autogen") {
                if (prompt.autogen)
                    generateItem.autogen = Object.assign({}, prompt.autogen);
            }
            else if (generateMode === "selected") {
                if (prompt.autogen)
                    generateItem.autogen = {
                        collection: autogenCol,
                        style: autogenStyle,
                    };
            }
            StaticStore_1.default.generateQueue.push(generateItem);
        }
        (0, generateNextPreview_1.default)();
    }
    exports["default"] = onGeneratePreviews;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onMoveSelected.ts":
/*!********************************************************************!*\
  !*** ./client/components/CollectionTools/events/onMoveSelected.ts ***!
  \********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Moves or copies the selected prompts to the selected collection.
     * By default moves prompts.
     * @param {*} isCopy if copy actions is required instead of move action.
     */
    function onMoveSelected(isCopy = false) {
        const { data } = Database_1.default;
        const { selectedPrompts, copyOrMoveTo } = store_2.default.getState();
        const { filterCollection } = store_1.default.getState();
        if (!filterCollection)
            return;
        const targetCollection = data.original[filterCollection];
        if (!selectedPrompts || !selectedPrompts.length || !targetCollection || !copyOrMoveTo)
            return;
        const to = copyOrMoveTo;
        const from = filterCollection;
        if (!to || !from)
            return;
        if (!data.original[to] || !data.original[from])
            return;
        let message = `${isCopy ? "Copy" : "Move"} ${selectedPrompts.length} prompts`;
        message += ` from catalogue "${filterCollection}" to catalogue "${copyOrMoveTo}"?`;
        if (confirm(message)) {
            for (const promptId of selectedPrompts) {
                const originalItem = data.original[from].find(item => item.id === promptId);
                if (!originalItem)
                    continue;
                if (isCopy) {
                    if (data.original[to].some(item => item.id === promptId))
                        continue;
                    data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
                    Database_1.default.movePreviewImage(promptId, from, to, "copy");
                }
                else {
                    if (!data.original[to].some(item => item.id === promptId)) {
                        data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
                    }
                    data.original[from] = data.original[from].filter(item => item.id !== promptId);
                    Database_1.default.movePreviewImage(promptId, from, to, "move");
                }
            }
            if (isCopy) {
                Database_1.default.saveJSONData(to, true);
            }
            else {
                Database_1.default.saveJSONData(to, true);
                Database_1.default.saveJSONData(from, true);
            }
            Database_1.default.updateMixedList();
            (0, store_2.setSelectedPrompts)([]);
        }
    }
    exports["default"] = onMoveSelected;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onRemoveCategory.ts":
/*!**********************************************************************!*\
  !*** ./client/components/CollectionTools/events/onRemoveCategory.ts ***!
  \**********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ./updateCurrentCollection */ "./client/components/CollectionTools/events/updateCurrentCollection.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2, updateCurrentCollection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onRemoveCategory() {
        const { data } = Database_1.default;
        const { filterCollection } = store_1.default.getState();
        const { category, selectedPrompts } = store_2.default.getState();
        if (!filterCollection)
            return;
        const targetCollection = data.original[filterCollection];
        if (!selectedPrompts || !selectedPrompts.length || !targetCollection || !category)
            return;
        for (const promptId of selectedPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if (!prompt)
                continue;
            if (!prompt.category)
                continue;
            if (prompt.category.includes(category))
                prompt.category = prompt.category.filter(id => id !== category);
        }
        (0, updateCurrentCollection_1.default)();
    }
    exports["default"] = onRemoveCategory;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onRemoveTags.ts":
/*!******************************************************************!*\
  !*** ./client/components/CollectionTools/events/onRemoveTags.ts ***!
  \******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ./updateCurrentCollection */ "./client/components/CollectionTools/events/updateCurrentCollection.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2, updateCurrentCollection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onRemoveTags() {
        const { data } = Database_1.default;
        const { filterCollection } = store_1.default.getState();
        const { tags, selectedPrompts } = store_2.default.getState();
        if (!filterCollection)
            return;
        const targetCollection = data.original[filterCollection];
        if (!selectedPrompts || !selectedPrompts.length || !targetCollection || !tags)
            return;
        const tagsArr = tags.split(",");
        for (let i = 0; i < tagsArr.length; i++)
            tagsArr[i] = tagsArr[i].trim();
        for (const promptId of selectedPrompts) {
            const prompt = targetCollection.find(item => item.id === promptId);
            if (!prompt || !prompt.tags)
                continue;
            prompt.tags = prompt.tags.filter(id => !tagsArr.includes(id));
        }
        (0, updateCurrentCollection_1.default)();
    }
    exports["default"] = onRemoveTags;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onSelectPrompt.ts":
/*!********************************************************************!*\
  !*** ./client/components/CollectionTools/events/onSelectPrompt.ts ***!
  \********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, store_2, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onSelectPrompt(e) {
        let { selectedPrompts } = store_1.default.getState();
        const { readonly } = Database_1.default.meta;
        const { united, original } = Database_1.default.data;
        const target = e.currentTarget;
        const id = target.dataset.id;
        if (!id)
            return;
        if (!readonly && e.shiftKey) {
            const targetPrompt = united.find(item => item.id === id);
            if (!targetPrompt)
                return;
            if (targetPrompt) {
                const targetItem = united.find(item => item.id === targetPrompt.id);
                if (!targetItem)
                    return false;
                if (!targetItem.collections)
                    return false;
                if (!targetItem.collections[0])
                    return false;
                let collection = original[targetItem.collections[0]];
                if (!collection)
                    return false;
                const originalItem = collection.find(item => item.id === targetPrompt.id);
                if (!originalItem)
                    return false;
                (0, store_2.setEditPrompt)(JSON.parse(JSON.stringify(originalItem)));
                (0, store_2.setEditTargetCollection)(targetItem.collections[0]);
            }
            return;
        }
        if (!selectedPrompts.includes(id)) {
            selectedPrompts.push(id);
        }
        else {
            selectedPrompts = selectedPrompts.filter(promptId => promptId !== id);
        }
        (0, store_1.setSelectedPrompts)([...selectedPrompts]);
    }
    exports["default"] = onSelectPrompt;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/onToggleSelected.ts":
/*!**********************************************************************!*\
  !*** ./client/components/CollectionTools/events/onToggleSelected.ts ***!
  \**********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/components/ui/PromptsFilter/checkFilter */ "./client/components/ui/PromptsFilter/checkFilter.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, checkFilter_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onToggleSelected() {
        const { data } = Database_1.default;
        const { promptsFilter } = store_2.default.getState();
        let { selectedPrompts } = store_2.default.getState();
        const { filterCollection } = store_1.default.getState();
        if (!filterCollection)
            return;
        const targetCollection = data.original[filterCollection];
        if (!targetCollection)
            return;
        if (selectedPrompts.length) {
            (0, store_2.setSelectedPrompts)([]);
            return;
        }
        selectedPrompts = [];
        for (const item of targetCollection) {
            if ((0, checkFilter_1.default)(item, promptsFilter))
                selectedPrompts.push(item.id);
        }
        (0, store_2.setSelectedPrompts)(selectedPrompts);
    }
    exports["default"] = onToggleSelected;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/events/updateCurrentCollection.ts":
/*!*****************************************************************************!*\
  !*** ./client/components/CollectionTools/events/updateCurrentCollection.ts ***!
  \*****************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! client/components/ui/PromptsFilter/checkFilter */ "./client/components/ui/PromptsFilter/checkFilter.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2, checkFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function updateCurrentCollection() {
        const { data } = Database_1.default;
        const { filterCollection } = store_1.default.getState();
        const { promptsFilter } = store_2.default.getState();
        let { selectedPrompts } = store_2.default.getState();
        if (!filterCollection)
            return;
        const targetCollection = data.original[filterCollection];
        if (!selectedPrompts || !selectedPrompts.length || !targetCollection)
            return;
        for (const item of targetCollection) {
            const { id } = item;
            if (!id)
                continue;
            /**
             * Removing prompt from selected if it will not be shown.
             */
            if (!(0, checkFilter_1.default)(item, promptsFilter)) {
                if (selectedPrompts.includes(id)) {
                    selectedPrompts = selectedPrompts.filter(selId => selId !== id);
                }
                continue;
            }
        }
        Database_1.default.saveJSONData(filterCollection);
        Database_1.default.updateMixedList();
        (0, store_2.setSelectedPrompts)(selectedPrompts);
        (0, store_2.iterateStore)();
    }
    exports["default"] = updateCurrentCollection;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/index.tsx":
/*!*****************************************************!*\
  !*** ./client/components/CollectionTools/index.tsx ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./store */ "./client/components/CollectionTools/store.ts"), __webpack_require__(/*! ./mount */ "./client/components/CollectionTools/mount.tsx"), __webpack_require__(/*! ./Header */ "./client/components/CollectionTools/Header.tsx"), __webpack_require__(/*! ./Content */ "./client/components/CollectionTools/Content.tsx"), __webpack_require__(/*! ./Status */ "./client/components/CollectionTools/Status.tsx"), __webpack_require__(/*! ./Actions */ "./client/components/CollectionTools/Actions/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, store_2, mount_1, Header_1, Content_1, Status_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.mount = void 0;
    exports.mount = mount_1.default;
    function CollectionTools({ parent }) {
        const showCollectionTools = (0, store_1.default)(state => state.showCollectionTools);
        (0, react_1.useEffect)(() => {
            (0, store_2.setSelectedPrompts)([]);
            if (!showCollectionTools) {
                parent.style.display = "none";
            }
            else {
                parent.style.display = "flex";
            }
        }, [showCollectionTools]);
        if (!showCollectionTools)
            return React.createElement("div", null);
        return (React.createElement(React.Fragment, null,
            React.createElement(Header_1.default, null),
            React.createElement(Content_1.default, null),
            React.createElement(Status_1.default, null),
            React.createElement(Actions_1.default, null),
            React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide" },
                React.createElement("button", { className: "PBE_button", onClick: () => (0, store_1.setShowCollectionTools)(false) }, "Close"))));
    }
    exports["default"] = CollectionTools;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/mount.tsx":
/*!*****************************************************!*\
  !*** ./client/components/CollectionTools/mount.tsx ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/CollectionTools/index.tsx"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/staticStore */ "./client/staticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1, store_1, staticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper }) {
        const collectionTools = document.createElement("div");
        collectionTools.className = "PBE_generalWindow PBE_collectionToolsWindow";
        collectionTools.id = "PBE_collectionTools";
        collectionTools.style.display = "none";
        collectionTools.style.zIndex = "200";
        wrapper.appendChild(collectionTools);
        collectionTools.addEventListener("mouseenter", () => {
            staticStore_1.default.onClose = () => (0, store_1.setShowCollectionTools)(false);
        });
        const root = (0, client_1.createRoot)(collectionTools);
        root.render(React.createElement(index_1.default, { parent: collectionTools }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CollectionTools/store.ts":
/*!****************************************************!*\
  !*** ./client/components/CollectionTools/store.ts ***!
  \****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.setPromptsFilter = exports.setSelectedPrompts = exports.setAutogenStatus = exports.setGenerateMode = exports.setAutogenStyle = exports.setAutogenCol = exports.setTags = exports.setCategory = exports.setCopyOrMoveTo = exports.iterateStore = void 0;
    const collectionToolsStore = (0, zustand_1.create)((set) => ({
        iterate: 0,
        copyOrMoveTo: "",
        category: "",
        tags: "",
        autogenCol: "",
        autogenStyle: "",
        generateMode: "prompt",
        autogenStatus: "",
        selectedPrompts: [],
        promptsFilter: [],
    }));
    const iterateStore = () => collectionToolsStore.setState({ iterate: collectionToolsStore.getState().iterate + 1 });
    exports.iterateStore = iterateStore;
    const setCopyOrMoveTo = (copyOrMoveTo) => collectionToolsStore.setState({ copyOrMoveTo });
    exports.setCopyOrMoveTo = setCopyOrMoveTo;
    const setCategory = (category) => collectionToolsStore.setState({ category });
    exports.setCategory = setCategory;
    const setTags = (tags) => collectionToolsStore.setState({ tags });
    exports.setTags = setTags;
    const setAutogenCol = (autogenCol) => collectionToolsStore.setState({ autogenCol });
    exports.setAutogenCol = setAutogenCol;
    const setAutogenStyle = (autogenStyle) => collectionToolsStore.setState({ autogenStyle });
    exports.setAutogenStyle = setAutogenStyle;
    const setGenerateMode = (generateMode) => collectionToolsStore.setState({ generateMode });
    exports.setGenerateMode = setGenerateMode;
    const setAutogenStatus = (autogenStatus) => collectionToolsStore.setState({ autogenStatus });
    exports.setAutogenStatus = setAutogenStatus;
    const setSelectedPrompts = (selectedPrompts) => collectionToolsStore.setState({ selectedPrompts });
    exports.setSelectedPrompts = setSelectedPrompts;
    const setPromptsFilter = (promptsFilter) => collectionToolsStore.setState({ promptsFilter });
    exports.setPromptsFilter = setPromptsFilter;
    exports["default"] = collectionToolsStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ControlPanel/index.tsx":
/*!**************************************************!*\
  !*** ./client/components/ControlPanel/index.tsx ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./mount */ "./client/components/ControlPanel/mount.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, mount_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.mount = void 0;
    exports.mount = mount_1.default;
    function ControlPanel({ tabName }) {
        const showControlPanel = (0, store_1.default)(state => state.showControlPanel);
        const currentContainer = (0, store_1.default)(state => state.currentContainer);
        const showViews = (0, store_1.default)(state => state.showViews);
        if (currentContainer !== tabName)
            return React.createElement("div", { style: { display: "none" } });
        const activeIcon = "PBE_activeControlIcon PBE_controlIcon";
        const inactiveIcon = "PBE_controlIcon";
        return (React.createElement("div", { className: showControlPanel ? "PBE_controlPanel" : "PBE_controlPanel PBE_controlPanelHidden" },
            React.createElement("div", { className: "PBE_toggleControlPanel", onClick: () => (0, store_1.setShowControlPanel)(!showControlPanel) }, showControlPanel ? "◀" : "▶"),
            showControlPanel && React.createElement(React.Fragment, null,
                React.createElement("button", { className: "PBE_button", style: {
                        marginRight: "10px",
                    }, onClick: e => (0, store_1.setShowSetupWindowe)(true) }, "New Collection"),
                React.createElement("div", { onClick: () => (0, store_1.toggleView)(store_1.ViewType.KNOWN), className: showViews.includes(store_1.ViewType.KNOWN) ? activeIcon : inactiveIcon, title: "Known prompts" }, "K"),
                React.createElement("div", { onClick: () => (0, store_1.toggleView)(store_1.ViewType.CURRENT), className: showViews.includes(store_1.ViewType.CURRENT) ? activeIcon : inactiveIcon, title: "Current prompts" }, "C"),
                React.createElement("div", { onClick: () => (0, store_1.toggleView)(store_1.ViewType.POSITIVE), className: showViews.includes(store_1.ViewType.POSITIVE) ? activeIcon : inactiveIcon, title: "Positive prompts textarea" }, "P"),
                React.createElement("div", { onClick: () => (0, store_1.toggleView)(store_1.ViewType.NEGATIVE), className: showViews.includes(store_1.ViewType.NEGATIVE) ? activeIcon : inactiveIcon, title: "Negative prompts textarea" }, "N"))));
    }
    exports["default"] = ControlPanel;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ControlPanel/mount.tsx":
/*!**************************************************!*\
  !*** ./client/components/ControlPanel/mount.tsx ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/ControlPanel/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper, tabName }) {
        const controlPanel = document.createElement("div");
        wrapper.prepend(controlPanel);
        const root = (0, client_1.createRoot)(controlPanel);
        root.render(React.createElement(index_1.default, { tabName: tabName }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CurrentPrompts/events/onClick.ts":
/*!************************************************************!*\
  !*** ./client/components/CurrentPrompts/events/onClick.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/components/PreviewSave/store */ "./client/components/PreviewSave/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, ActivePrompts_1, store_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onPromptClick(e) {
        const { selectedPrompt } = store_2.default.getState();
        const { previewCollection } = store_1.default.getState();
        const target = e.currentTarget;
        const { readonly } = Database_1.default.meta;
        const { united, original } = Database_1.default.data;
        const currentId = target.dataset.prompt;
        let index = Number(target.dataset.index);
        let group = Number(target.dataset.group);
        const isSyntax = target.dataset.issyntax ? true : false;
        let groupId = Number(target.dataset.id);
        if (Number.isNaN(group))
            group = false;
        if (Number.isNaN(groupId))
            groupId = false;
        //is prompts group
        if (groupId !== false) {
            if (e.ctrlKey || e.metaKey)
                ActivePrompts_1.default.unGroup(groupId);
            else
                ActivePrompts_1.default.toggleGroupFold(groupId);
            (0, store_2.updateCurrentIteration)();
            ActivePrompts_1.default.updateTextArea();
            return;
        }
        if (!currentId)
            return;
        //on remove element
        if (e.ctrlKey || e.metaKey) {
            if (Number.isNaN(index))
                return;
            if (Number.isNaN(group))
                group = false;
            ActivePrompts_1.default.removePrompt(index, group);
            (0, store_2.updateCurrentIteration)();
            ActivePrompts_1.default.updateTextArea();
            return;
        }
        if (isSyntax)
            return;
        const targetPrompt = united.find(item => item.id.toLowerCase() === currentId.toLowerCase());
        if (targetPrompt && targetPrompt.collections && targetPrompt.collections[0]) {
            if (!previewCollection || !targetPrompt.collections.includes(previewCollection)) {
                (0, store_1.setPreviewCollection)(targetPrompt.collections[0]);
            }
        }
        if (!readonly && e.shiftKey) {
            if (targetPrompt) {
                const targetItem = united.find(item => item.id === targetPrompt.id);
                if (!targetItem)
                    return false;
                if (!targetItem.collections)
                    return false;
                if (!targetItem.collections[0])
                    return false;
                let collection = original[targetItem.collections[0]];
                if (!collection)
                    return false;
                const originalItem = collection.find(item => item.id === targetPrompt.id);
                if (!originalItem)
                    return false;
                (0, store_2.setEditPrompt)(JSON.parse(JSON.stringify(originalItem)));
                (0, store_2.setEditTargetCollection)(targetItem.collections[0]);
            }
            else {
                (0, store_2.setShowPromptScribe)(true);
            }
            return;
        }
        if (selectedPrompt !== currentId) {
            (0, store_2.setSelectedPrompt)(currentId);
            (0, store_2.setEditPromptGroup)(group);
            (0, store_2.setEditPromptIndex)(index);
        }
        else {
            (0, store_2.setSelectedPrompt)(undefined);
            (0, store_2.setEditPromptGroup)(false);
            (0, store_2.setEditPromptIndex)(false);
        }
        (0, store_2.updateCurrentIteration)();
    }
    exports["default"] = onPromptClick;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CurrentPrompts/events/onDoubleClick.ts":
/*!******************************************************************!*\
  !*** ./client/components/CurrentPrompts/events/onDoubleClick.ts ***!
  \******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onPromptDoubleClick(e) {
        const target = e.currentTarget;
        let index = Number(target.dataset.index);
        let group = Number(target.dataset.group);
        if (Number.isNaN(index))
            index = false;
        if (Number.isNaN(group))
            group = false;
        if (index === false)
            return;
        (0, store_1.setEditPromptIndex)(index);
        (0, store_1.setEditPromptGroup)(group);
        (0, store_1.setShowPromptTools)(true);
    }
    exports["default"] = onPromptDoubleClick;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CurrentPrompts/events/onWheel.ts":
/*!************************************************************!*\
  !*** ./client/components/CurrentPrompts/events/onWheel.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ActivePrompts_1, Config_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function riseWeight(targetItem) {
        const { belowOneWeight = 0.05, aboveOneWeight = 0.01 } = Config_1.default.getConfig();
        if (targetItem.weight < 1 && (targetItem.weight + belowOneWeight) > 1) {
            targetItem.weight = 1;
        }
        else {
            if (targetItem.weight >= 1)
                targetItem.weight += aboveOneWeight;
            else
                targetItem.weight += belowOneWeight;
        }
    }
    function lowerWeight(targetItem) {
        const { belowOneWeight = 0.05, aboveOneWeight = 0.01 } = Config_1.default.getConfig();
        if (targetItem.weight > 1 && (targetItem.weight - aboveOneWeight) < 1) {
            targetItem.weight = 1;
        }
        else {
            if (targetItem.weight <= 1)
                targetItem.weight -= belowOneWeight;
            else
                targetItem.weight -= aboveOneWeight;
        }
    }
    /**
    * Handles the mouse wheel event and changes the weight of the prompt
    */
    function onWheel(e) {
        const target = e.currentTarget;
        if (!e.shiftKey)
            return;
        const currentId = target.dataset.prompt;
        const groupId = Number(target.dataset.id);
        let index = Number(target.dataset.index);
        let group = Number(target.dataset.group);
        let targetItem = false;
        if (!Number.isNaN(groupId)) {
            //is prompts group
            targetItem = ActivePrompts_1.default.getGroupById(groupId);
            if (!targetItem)
                return;
        }
        else {
            //is prompt
            if (Number.isNaN(index))
                return;
            if (Number.isNaN(group))
                group = false;
            targetItem = ActivePrompts_1.default.getPromptByIndex(index, group);
            if (!targetItem)
                return;
            if (targetItem.isSyntax)
                return;
            if (!currentId)
                return;
        }
        if (!targetItem)
            return;
        e.preventDefault();
        e.stopPropagation();
        if (targetItem.weight === undefined)
            targetItem.weight = 1;
        if (e.deltaY < 0)
            riseWeight(targetItem);
        else
            lowerWeight(targetItem);
        if (targetItem.weight < 0)
            targetItem.weight = 0;
        targetItem.weight = Number(targetItem.weight.toFixed(2));
        if (targetItem.weight === 1)
            targetItem.weight = undefined;
        (0, store_1.updateCurrentIteration)();
        ActivePrompts_1.default.updateTextArea();
    }
    exports["default"] = onWheel;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CurrentPrompts/index.tsx":
/*!****************************************************!*\
  !*** ./client/components/CurrentPrompts/index.tsx ***!
  \****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/components/PromptsList */ "./client/components/PromptsList/index.tsx"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ./events/onClick */ "./client/components/CurrentPrompts/events/onClick.ts"), __webpack_require__(/*! ./events/onWheel */ "./client/components/CurrentPrompts/events/onWheel.ts"), __webpack_require__(/*! ./events/onDoubleClick */ "./client/components/CurrentPrompts/events/onDoubleClick.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, PromptsList_1, ActivePrompts_1, onClick_1, onWheel_1, onDoubleClick_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function CurrentPrompts({ tabName }) {
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        const modelIteration = (0, store_1.default)(state => state.modelIteration);
        const currentIteration = (0, store_1.default)(state => state.currentIteration);
        const showViews = (0, store_1.default)(state => state.showViews);
        const currentContainer = (0, store_1.default)(state => state.currentContainer);
        let render = true;
        if (!showViews.includes(store_1.ViewType.CURRENT))
            render = false;
        if (currentContainer !== tabName)
            render = false;
        if (!render)
            return React.createElement("div", { style: { display: "none" } });
        const activePrompts = ActivePrompts_1.default.getCurrentPrompts();
        return (React.createElement(PromptsList_1.default, { iteration: currentIteration + filesIteration + modelIteration, prompts: activePrompts, allowMove: true, onClick: onClick_1.default, onWheel: onWheel_1.default, onDblClick: onDoubleClick_1.default }));
    }
    exports["default"] = CurrentPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/CurrentPrompts/mount.tsx":
/*!****************************************************!*\
  !*** ./client/components/CurrentPrompts/mount.tsx ***!
  \****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/CurrentPrompts/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper, tabName }) {
        const currentPrompts = document.createElement("div");
        currentPrompts.className = "PBE_currentPrompts";
        wrapper.appendChild(currentPrompts);
        const root = (0, client_1.createRoot)(currentPrompts);
        root.render(React.createElement(index_1.default, { tabName: tabName }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/ShowContent.tsx":
/*!********************************************************!*\
  !*** ./client/components/KnownPrompts/ShowContent.tsx ***!
  \********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! ./getCards */ "./client/components/KnownPrompts/getCards.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, Config_1, getCards_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ShowContent() {
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        const filterCollection = (0, store_1.default)(state => state.filterCollection);
        const filterCategory = (0, store_1.default)(state => state.filterCategory);
        const sortKnownPrompts = (0, store_1.default)(state => state.sortKnownPrompts);
        const filterName = (0, store_1.default)(state => state.filterName);
        const filterTags = (0, store_1.default)(state => state.filterTags);
        const modelIteration = (0, store_1.default)(state => state.modelIteration);
        const cards = (0, getCards_1.default)({ filesIteration, filterCollection, filterCategory, filterName, filterTags, sortKnownPrompts });
        const { cardHeight = 100, rowsInKnownCards = 3 } = Config_1.default.getConfig();
        return (React.createElement("div", { "data-model": modelIteration, className: "PBE_promptsCatalogueContent PBE_Scrollbar", style: {
                maxHeight: `${cardHeight * rowsInKnownCards}px`,
            } }, cards));
    }
    exports["default"] = ShowContent;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/ShowHeader/ShowCategories.tsx":
/*!**********************************************************************!*\
  !*** ./client/components/KnownPrompts/ShowHeader/ShowCategories.tsx ***!
  \**********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ShowCategories({ value = "" }) {
        const JSXOptions = [];
        for (const categoryItem of Database_1.default.data.categories) {
            JSXOptions.push(React.createElement("option", { value: categoryItem, key: categoryItem }, categoryItem));
        }
        return (React.createElement("select", { className: "PBE_generalInput", value: value, onChange: e => (0, store_1.setFilterCategory)(e.currentTarget.value) },
            React.createElement("option", { value: "" }, "All categories"),
            React.createElement("option", { value: "__none" }, "Uncategorised"),
            JSXOptions));
    }
    exports["default"] = ShowCategories;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/ShowHeader/ShowCollections.tsx":
/*!***********************************************************************!*\
  !*** ./client/components/KnownPrompts/ShowHeader/ShowCollections.tsx ***!
  \***********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ShowCollections({ value = "" }) {
        const collectionsIteration = (0, store_2.default)(state => state.collectionsIteration);
        const JSXOptions = [];
        for (const collectionId in Database_1.default.data.original) {
            JSXOptions.push(React.createElement("option", { value: collectionId, key: collectionId }, collectionId));
        }
        return (React.createElement("select", { "data-iterate": collectionsIteration, className: "PBE_generalInput", value: value, onChange: e => (0, store_1.setFilterCollection)(e.currentTarget.value) },
            React.createElement("option", { value: "" }, "All collections"),
            JSXOptions));
    }
    exports["default"] = ShowCollections;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/ShowHeader/ShowSorting.tsx":
/*!*******************************************************************!*\
  !*** ./client/components/KnownPrompts/ShowHeader/ShowSorting.tsx ***!
  \*******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ShowSorting({ value = "" }) {
        const JSXOptions = [];
        for (const categoryItem of Database_1.default.data.categories) {
            JSXOptions.push(React.createElement("option", { value: categoryItem, key: categoryItem }, categoryItem));
        }
        for (const collectionId in Database_1.default.data.original) {
            JSXOptions.push(React.createElement("option", { value: collectionId, key: collectionId }, collectionId));
        }
        return (React.createElement("select", { className: "PBE_generalInput", value: value, onChange: e => (0, store_1.setSortKnownPrompts)(e.currentTarget.value) },
            React.createElement("option", { value: "" }, "Unsorted"),
            React.createElement("option", { value: "reversed" }, "Unsorted reversed"),
            React.createElement("option", { value: "alph" }, "Alphabetical"),
            React.createElement("option", { value: "alphReversed" }, "Alphabetical reversed")));
    }
    exports["default"] = ShowSorting;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/ShowHeader/index.tsx":
/*!*************************************************************!*\
  !*** ./client/components/KnownPrompts/ShowHeader/index.tsx ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ./ShowSorting */ "./client/components/KnownPrompts/ShowHeader/ShowSorting.tsx"), __webpack_require__(/*! ./ShowCollections */ "./client/components/KnownPrompts/ShowHeader/ShowCollections.tsx"), __webpack_require__(/*! ./ShowCategories */ "./client/components/KnownPrompts/ShowHeader/ShowCategories.tsx"), __webpack_require__(/*! ./utils/updateFilterName */ "./client/components/KnownPrompts/ShowHeader/utils/updateFilterName.ts"), __webpack_require__(/*! ./utils/updateFilterTags */ "./client/components/KnownPrompts/ShowHeader/utils/updateFilterTags.ts"), __webpack_require__(/*! client/components/ui/TagTooltip */ "./client/components/ui/TagTooltip/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, Database_1, ShowSorting_1, ShowCollections_1, ShowCategories_1, updateFilterName_1, updateFilterTags_1, TagTooltip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ShowHeader() {
        const { readonly = true } = Database_1.default.meta;
        const collectionsIteration = (0, store_1.default)(state => state.collectionsIteration);
        const filterCollection = (0, store_1.default)(state => state.filterCollection);
        const filterCategory = (0, store_1.default)(state => state.filterCategory);
        const sortKnownPrompts = (0, store_1.default)(state => state.sortKnownPrompts);
        const filterName = (0, store_1.default)(state => state.filterName);
        const filterTags = (0, store_1.default)(state => state.filterTags) || [];
        const disabled = filterCollection ? false : true;
        return (React.createElement("div", { className: "PBE_promptsCatalogueHeader", "data-iterate": collectionsIteration },
            !readonly &&
                React.createElement("button", { className: "PBE_button", style: {
                        marginRight: "10px",
                        opacity: disabled ? 0.2 : 1,
                        cursor: disabled ? "default" : "pointer",
                    }, onClick: disabled ? undefined : () => (0, store_1.setShowCollectionTools)(true), disabled: disabled }, "Edit collection"),
            React.createElement(ShowCollections_1.default, { value: filterCollection }),
            React.createElement(ShowCategories_1.default, { value: filterCategory }),
            React.createElement(TagTooltip_1.default, { tags: filterTags, onUpdate: updateFilterTags_1.default }),
            React.createElement("input", { className: "PBE_generalInput", placeholder: "by name", defaultValue: filterName, onChange: updateFilterName_1.default }),
            React.createElement(ShowSorting_1.default, { value: sortKnownPrompts })));
    }
    exports["default"] = ShowHeader;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/ShowHeader/utils/staticStore.ts":
/*!************************************************************************!*\
  !*** ./client/components/KnownPrompts/ShowHeader/utils/staticStore.ts ***!
  \************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const StaticStore = {
        updateTimeout: 0,
    };
    exports["default"] = StaticStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/ShowHeader/utils/updateFilterName.ts":
/*!*****************************************************************************!*\
  !*** ./client/components/KnownPrompts/ShowHeader/utils/updateFilterName.ts ***!
  \*****************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./staticStore */ "./client/components/KnownPrompts/ShowHeader/utils/staticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, staticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function updateFilterName(e) {
        let value = e.currentTarget.value || "";
        clearTimeout(staticStore_1.default.updateTimeout);
        staticStore_1.default.updateTimeout = setTimeout(() => {
            if (value)
                (0, store_1.setFilterName)(value.toLowerCase());
            else
                (0, store_1.setFilterName)(undefined);
        }, 500);
    }
    exports["default"] = updateFilterName;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/ShowHeader/utils/updateFilterTags.ts":
/*!*****************************************************************************!*\
  !*** ./client/components/KnownPrompts/ShowHeader/utils/updateFilterTags.ts ***!
  \*****************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./staticStore */ "./client/components/KnownPrompts/ShowHeader/utils/staticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, staticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function updateFilterTags(tags) {
        let filterTags = undefined;
        //removing empty tags
        tags = tags.filter(item => item);
        if (!tags)
            filterTags = undefined;
        else
            filterTags = tags;
        if (filterTags && !filterTags.length)
            filterTags = undefined;
        if (filterTags && filterTags.length === 1 && !filterTags[0])
            filterTags = undefined;
        clearTimeout(staticStore_1.default.updateTimeout);
        staticStore_1.default.updateTimeout = setTimeout(() => (0, store_1.setFilterTags)(filterTags), 500);
    }
    exports["default"] = updateFilterTags;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/checkFilter.ts":
/*!*******************************************************!*\
  !*** ./client/components/KnownPrompts/checkFilter.ts ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function checkFilter(prompt) {
        const { filterCollection, filterCategory, filterName, filterTags } = store_1.default.getState();
        if (filterCategory) {
            if (filterCategory === "__none") {
                if (prompt.category !== undefined && prompt.category.length)
                    return false;
            }
            else {
                if (!prompt.category)
                    return false;
                if (!prompt.category.includes(filterCategory))
                    return false;
            }
        }
        if (filterCollection) {
            if (!prompt.collections)
                return false;
            if (!prompt.collections.includes(filterCollection))
                return false;
        }
        if (filterName) {
            if (!prompt.id.toLowerCase().includes(filterName))
                return false;
        }
        if (filterTags && Array.isArray(filterTags)) {
            if (!prompt.tags)
                return false;
            let out = true;
            const TAG_MODE = "includeAll";
            if (TAG_MODE === "includeAll") {
                out = false;
                for (const filterTag of filterTags) {
                    let fulfil = false;
                    for (const promptTag of prompt.tags) {
                        if (promptTag === filterTag) {
                            fulfil = true;
                            break;
                        }
                    }
                    if (!fulfil) {
                        out = true;
                        break;
                    }
                }
            }
            else {
                for (const filterTag of filterTags) {
                    for (const promptTag of prompt.tags) {
                        if (promptTag.includes(filterTag)) {
                            out = false;
                            break;
                        }
                    }
                }
            }
            if (out)
                return false;
        }
        return true;
    }
    exports["default"] = checkFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/events/addPromptItem.ts":
/*!****************************************************************!*\
  !*** ./client/components/KnownPrompts/events/addPromptItem.ts ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, const_1, ActivePrompts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function addPromptItem(targetItem) {
        if (!targetItem)
            return;
        const activePrompts = ActivePrompts_1.default.getCurrentPrompts();
        const { id, addAtStart, addAfter, addStart, addEnd } = targetItem;
        const newPrompt = { id, weight: const_1.DEFAULT_PROMPT_WEIGHT, isExternalNetwork: targetItem.isExternalNetwork };
        if (addStart)
            ActivePrompts_1.default.addStrToActive(addStart, true);
        if (addAfter) {
            if (addAtStart) {
                ActivePrompts_1.default.addStrToActive(addAfter, true);
                activePrompts.unshift(newPrompt);
            }
            else {
                activePrompts.push(newPrompt);
                ActivePrompts_1.default.addStrToActive(addAfter, false);
            }
        }
        else {
            if (addAtStart)
                activePrompts.unshift(newPrompt);
            else
                activePrompts.push(newPrompt);
        }
        if (addEnd)
            ActivePrompts_1.default.addStrToActive(addEnd, false);
    }
    exports["default"] = addPromptItem;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/events/onAddRandom.ts":
/*!**************************************************************!*\
  !*** ./client/components/KnownPrompts/events/onAddRandom.ts ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ../checkFilter */ "./client/components/KnownPrompts/checkFilter.ts"), __webpack_require__(/*! ./addPromptItem */ "./client/components/KnownPrompts/events/addPromptItem.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, ActivePrompts_1, checkFilter_1, addPromptItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onAddRandom() {
        const { filterCollection } = store_1.default.getState();
        const { data } = Database_1.default;
        const { united } = data;
        const usedPrompts = ActivePrompts_1.default.getUniqueIds();
        let dataArr = [];
        if (filterCollection) {
            const targetCategory = data.original[filterCollection];
            if (targetCategory) {
                for (const id in targetCategory) {
                    const targetOriginalItem = targetCategory[id];
                    const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
                    if (targetMixedItem && (0, checkFilter_1.default)(targetMixedItem))
                        dataArr.push(Object.assign({}, targetMixedItem));
                }
            }
        }
        else {
            for (const id in united) {
                if ((0, checkFilter_1.default)(united[id]))
                    dataArr.push(Object.assign({}, united[id]));
            }
        }
        dataArr = dataArr.filter(dataItem => !usedPrompts.includes(dataItem.id));
        const randomPrompt = dataArr[Math.floor(Math.random() * dataArr.length)];
        (0, addPromptItem_1.default)(randomPrompt);
        ActivePrompts_1.default.updateTextArea();
        (0, store_1.updateCurrentIteration)();
    }
    exports["default"] = onAddRandom;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/events/onDeletePrompt.ts":
/*!*****************************************************************!*\
  !*** ./client/components/KnownPrompts/events/onDeletePrompt.ts ***!
  \*****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onDeletePrompt({ targetItem }) {
        const promptItem = targetItem.id;
        let targetCollection = store_1.default.getState().filterCollection;
        if (!targetCollection) {
            if (!targetItem.collections)
                return;
            const firstCollection = targetItem.collections[0];
            if (!firstCollection)
                return;
            targetCollection = targetItem.collections[0];
        }
        if (confirm(`Remove prompt "${promptItem}" from catalogue "${targetCollection}"?`)) {
            if (!Database_1.default.data.original[targetCollection])
                return;
            Database_1.default.data.original[targetCollection] = Database_1.default.data.original[targetCollection].filter(item => item.id !== promptItem);
            Database_1.default.movePreviewImage(promptItem, targetCollection, targetCollection, "delete");
            Database_1.default.saveJSONData(targetCollection);
            Database_1.default.updateMixedList();
            (0, store_1.updateFilesIteration)();
        }
    }
    exports["default"] = onDeletePrompt;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/events/onEditPrompt.ts":
/*!***************************************************************!*\
  !*** ./client/components/KnownPrompts/events/onEditPrompt.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onEditPrompt({ targetItem }) {
        const { original } = Database_1.default.data;
        const promptItem = targetItem.id;
        const filterCollection = store_1.default.getState().filterCollection;
        if (!targetItem.collections)
            return false;
        if (!targetItem.collections[0])
            return false;
        const targetCollection = filterCollection ? filterCollection : targetItem.collections[0];
        const collection = original[targetCollection];
        if (!collection)
            return false;
        const originalItem = collection.find(item => item.id === promptItem);
        if (!originalItem)
            return false;
        (0, store_1.setEditPrompt)(JSON.parse(JSON.stringify(originalItem)));
        (0, store_1.setEditTargetCollection)(targetCollection);
    }
    exports["default"] = onEditPrompt;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/events/onPromptClick.ts":
/*!****************************************************************!*\
  !*** ./client/components/KnownPrompts/events/onPromptClick.ts ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ./addPromptItem */ "./client/components/KnownPrompts/events/addPromptItem.ts"), __webpack_require__(/*! ./onEditPrompt */ "./client/components/KnownPrompts/events/onEditPrompt.ts"), __webpack_require__(/*! ./onDeletePrompt */ "./client/components/KnownPrompts/events/onDeletePrompt.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, ActivePrompts_1, addPromptItem_1, onEditPrompt_1, onDeletePrompt_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onPromptClick(e) {
        const target = e.currentTarget;
        const { readonly } = Database_1.default.meta;
        const { united } = Database_1.default.data;
        const promptItem = target.dataset.prompt;
        const targetItem = united.find(item => item.id === promptItem);
        if (!targetItem)
            return;
        if (!readonly && e.shiftKey) {
            (0, onEditPrompt_1.default)({ targetItem });
            return;
        }
        if (!readonly && (e.metaKey || e.ctrlKey)) {
            (0, onDeletePrompt_1.default)({ targetItem });
            return;
        }
        (0, addPromptItem_1.default)(targetItem);
        ActivePrompts_1.default.updateTextArea();
        (0, store_1.updateCurrentIteration)();
    }
    exports["default"] = onPromptClick;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/getCards.tsx":
/*!*****************************************************!*\
  !*** ./client/components/KnownPrompts/getCards.tsx ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/components/PromptItem/index */ "./client/components/PromptItem/index.tsx"), __webpack_require__(/*! ./checkFilter */ "./client/components/KnownPrompts/checkFilter.ts"), __webpack_require__(/*! ./events/onPromptClick */ "./client/components/KnownPrompts/events/onPromptClick.ts"), __webpack_require__(/*! ./events/onAddRandom */ "./client/components/KnownPrompts/events/onAddRandom.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, Config_1, index_1, checkFilter_1, onPromptClick_1, onAddRandom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getCards({ filesIteration = 0, filterCollection = "", filterCategory, filterName, sortKnownPrompts }) {
        const { data } = Database_1.default;
        const { readonly } = Database_1.default.meta;
        const { united } = data;
        const { cardWidth = 50, cardHeight = 100, showPromptIndex = false, maxCardsShown = 1000 } = Config_1.default.getConfig();
        let dataArr = [];
        let shownItems = 0;
        const JSXCards = [];
        const showIndex = (showPromptIndex && filterCollection) ? true : false;
        /**
         * TODO: not sure about that part. Some early versions optimisation or something.
         * checkFilter function will do filtering anyway.
         * Need to measure render time with and without this.
         */
        if (filterCollection) {
            const targetCategory = data.original[filterCollection];
            if (targetCategory) {
                for (const id in targetCategory) {
                    const targetOriginalItem = targetCategory[id];
                    const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
                    if (targetMixedItem)
                        dataArr.push(Object.assign({}, targetMixedItem));
                }
            }
        }
        else {
            for (const id in united)
                dataArr.push(Object.assign({}, united[id]));
        }
        //sorting prompts array
        if (sortKnownPrompts === "alph" || sortKnownPrompts === "alphReversed") {
            dataArr.sort((A, B) => {
                if (sortKnownPrompts === "alph") {
                    if (A.id > B.id)
                        return 1;
                    if (A.id < B.id)
                        return -1;
                }
                else {
                    if (A.id > B.id)
                        return -1;
                    if (A.id < B.id)
                        return 1;
                }
                return 0;
            });
        }
        else if (sortKnownPrompts === "reversed")
            dataArr.reverse();
        //show Add Random card
        if (dataArr.length) {
            JSXCards.push(React.createElement("div", { className: "PBE_promptElement PBE_promptElement_random", key: "__random", style: {
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                }, onClick: onAddRandom_1.default }, "Add random"));
        }
        for (const index in dataArr) {
            const prompt = dataArr[index];
            if (shownItems >= maxCardsShown)
                break;
            if (!(0, checkFilter_1.default)(prompt))
                continue;
            const imageSrc = Database_1.default.getPromptPreviewURL({ prompt: prompt.id, filesIteration, collectionId: filterCollection });
            JSXCards.push(React.createElement(index_1.default, { key: prompt.id, id: prompt.id, src: imageSrc, prompt: prompt, options: { isShadowed: false, showIndex, index }, onClick: onPromptClick_1.default }));
            shownItems++;
        }
        return JSXCards;
    }
    exports["default"] = getCards;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/index.tsx":
/*!**************************************************!*\
  !*** ./client/components/KnownPrompts/index.tsx ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./ShowHeader */ "./client/components/KnownPrompts/ShowHeader/index.tsx"), __webpack_require__(/*! ./ShowContent */ "./client/components/KnownPrompts/ShowContent.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, ShowHeader_1, ShowContent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function KnownPrompts({ tabName }) {
        const showViews = (0, store_1.default)(state => state.showViews);
        const currentContainer = (0, store_1.default)(state => state.currentContainer);
        let render = true;
        if (!showViews.includes(store_1.ViewType.KNOWN))
            render = false;
        if (currentContainer !== tabName)
            render = false;
        if (!render)
            return React.createElement("div", { style: { display: "none" } });
        return (React.createElement("div", { className: "PBE_promptsCatalogue" },
            React.createElement(ShowHeader_1.default, null),
            React.createElement(ShowContent_1.default, null)));
    }
    exports["default"] = KnownPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/KnownPrompts/mount.tsx":
/*!**************************************************!*\
  !*** ./client/components/KnownPrompts/mount.tsx ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/KnownPrompts/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper, positivePrompts, tabName }) {
        const knownPrompts = document.createElement("div");
        knownPrompts.className = "PBE_promptsWrapper";
        wrapper.insertBefore(knownPrompts, positivePrompts);
        const root = (0, client_1.createRoot)(knownPrompts);
        root.render(React.createElement(index_1.default, { tabName: tabName }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Actions/ActionButtons.tsx":
/*!***************************************************************!*\
  !*** ./client/components/LoadStyle/Actions/ActionButtons.tsx ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../events/onApplyStyle */ "./client/components/LoadStyle/events/onApplyStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, onApplyStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ActionButtons() {
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "Actions:"),
            React.createElement("div", { className: "PBE_button", title: "Add style prompts at the start of current prompts", onClick: () => (0, onApplyStyle_1.default)(false) }, "Add before"),
            React.createElement("div", { className: "PBE_button", title: "Add style prompts at the end of current prompts", onClick: () => (0, onApplyStyle_1.default)(true) }, "Add after")));
    }
    exports["default"] = ActionButtons;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Actions/EditButtons.tsx":
/*!*************************************************************!*\
  !*** ./client/components/LoadStyle/Actions/EditButtons.tsx ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../events/onUpdatePreview */ "./client/components/LoadStyle/events/onUpdatePreview.ts"), __webpack_require__(/*! ../events/onUpdateStyle */ "./client/components/LoadStyle/events/onUpdateStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, onUpdatePreview_1, onUpdateStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function EditButtons() {
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "Edit:"),
            React.createElement("div", { className: "PBE_button", title: "Update selected style", onClick: e => (0, onUpdateStyle_1.default)() }, "Update"),
            React.createElement("div", { className: "PBE_button", title: "Update selected style preview", onClick: e => (0, onUpdatePreview_1.default)() }, "Update preview")));
    }
    exports["default"] = EditButtons;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Actions/MetaCheckboxes.tsx":
/*!****************************************************************!*\
  !*** ./client/components/LoadStyle/Actions/MetaCheckboxes.tsx ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/components/ui/CheckBox */ "./client/components/ui/CheckBox/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, Config_1, CheckBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function MetaCheckboxes({ isUpdate = false }) {
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const { saveStyleMeta = {}, updateStyleMeta = {} } = Config_1.default.getConfig();
        const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;
        return (React.createElement("fieldset", { className: "PBE_fieldset PBE_styleMetaCheckboxes", "data-iterate": iterate },
            React.createElement("legend", null, "Save meta:"),
            React.createElement(CheckBox_1.default, { name: "Seed", checked: targetMeta.seed, onChange: checked => {
                    targetMeta.seed = checked;
                    Config_1.default.setConfig();
                    setIterate(iterate + 1);
                } }),
            React.createElement(CheckBox_1.default, { name: "Positive", checked: targetMeta.positive, onChange: checked => {
                    targetMeta.positive = checked;
                    Config_1.default.setConfig();
                    setIterate(iterate + 1);
                } }),
            React.createElement(CheckBox_1.default, { name: "Negative", checked: targetMeta.negative, onChange: checked => {
                    targetMeta.negative = checked;
                    Config_1.default.setConfig();
                    setIterate(iterate + 1);
                } }),
            React.createElement(CheckBox_1.default, { name: "Size", checked: targetMeta.size, onChange: checked => {
                    targetMeta.size = checked;
                    Config_1.default.setConfig();
                    setIterate(iterate + 1);
                } }),
            React.createElement(CheckBox_1.default, { name: "Sampler", checked: targetMeta.sampler, onChange: checked => {
                    targetMeta.sampler = checked;
                    Config_1.default.setConfig();
                    setIterate(iterate + 1);
                } }),
            React.createElement(CheckBox_1.default, { name: "Quality", checked: targetMeta.quality, onChange: checked => {
                    targetMeta.quality = checked;
                    Config_1.default.setConfig();
                    setIterate(iterate + 1);
                } })));
    }
    exports["default"] = MetaCheckboxes;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Actions/StyleName.tsx":
/*!***********************************************************!*\
  !*** ./client/components/LoadStyle/Actions/StyleName.tsx ***!
  \***********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts"), __webpack_require__(/*! ../events/onRenameStyle */ "./client/components/LoadStyle/events/onRenameStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, onRenameStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function StyleName() {
        const newName = (0, store_1.default)(state => state.newName);
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "Name:"),
            React.createElement("input", { type: "text", className: "PBE_generalInput PBE_input PBE_nameAction", placeholder: "Style name", maxLength: 150, value: newName, onChange: e => (0, store_1.setNewName)(e.currentTarget.value) }),
            React.createElement("div", { className: "PBE_button", title: "Rename selected style", onClick: e => (0, onRenameStyle_1.default)() }, "Rename")));
    }
    exports["default"] = StyleName;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Actions/StyleSetup.tsx":
/*!************************************************************!*\
  !*** ./client/components/LoadStyle/Actions/StyleSetup.tsx ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! clientTypes/style */ "./client/types/style.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, style_1, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function StyleSetup({ isUpdate = false }) {
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const { saveStyleMeta = {}, updateStyleMeta = {} } = Config_1.default.getConfig();
        const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;
        return (React.createElement("fieldset", { className: "PBE_fieldset PBE_styleCofig", "data-iterate": iterate },
            React.createElement("legend", null, "Addition Type:"),
            React.createElement("select", { className: "PBE_generalInput PBE_select PBE_addStyleTypeSelect", value: targetMeta.addType || style_1.AddStyleType.UniqueRoot, onChange: e => {
                    targetMeta.addType = e.currentTarget.value;
                    Config_1.default.setConfig();
                    setIterate(iterate + 1);
                } },
                React.createElement("option", { value: style_1.AddStyleType.All }, "All"),
                React.createElement("option", { value: style_1.AddStyleType.UniqueRoot }, "Unique at root"),
                React.createElement("option", { value: style_1.AddStyleType.UniqueOnly }, "Unique all"))));
    }
    exports["default"] = StyleSetup;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Actions/SystemButtons.tsx":
/*!***************************************************************!*\
  !*** ./client/components/LoadStyle/Actions/SystemButtons.tsx ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../events/onRemoveStyle */ "./client/components/LoadStyle/events/onRemoveStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, onRemoveStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function SystemButtons() {
        return (React.createElement("fieldset", { className: "PBE_fieldset" },
            React.createElement("legend", null, "System:"),
            React.createElement("div", { className: "PBE_button", title: "Delete selected style", onClick: e => (0, onRemoveStyle_1.default)() }, "Delete")));
    }
    exports["default"] = SystemButtons;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Actions/index.tsx":
/*!*******************************************************!*\
  !*** ./client/components/LoadStyle/Actions/index.tsx ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts"), __webpack_require__(/*! ./MetaCheckboxes */ "./client/components/LoadStyle/Actions/MetaCheckboxes.tsx"), __webpack_require__(/*! ./StyleSetup */ "./client/components/LoadStyle/Actions/StyleSetup.tsx"), __webpack_require__(/*! ./StyleName */ "./client/components/LoadStyle/Actions/StyleName.tsx"), __webpack_require__(/*! ./ActionButtons */ "./client/components/LoadStyle/Actions/ActionButtons.tsx"), __webpack_require__(/*! ./EditButtons */ "./client/components/LoadStyle/Actions/EditButtons.tsx"), __webpack_require__(/*! ./SystemButtons */ "./client/components/LoadStyle/Actions/SystemButtons.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1, MetaCheckboxes_1, StyleSetup_1, StyleName_1, ActionButtons_1, EditButtons_1, SystemButtons_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Actions() {
        const { readonly = false } = Database_1.default.meta;
        const isSimpleView = (0, store_1.default)(state => state.isSimpleView);
        if (!isSimpleView) {
            if (!readonly) {
                return (React.createElement("div", { className: "PBE_collectionToolsActions PBE_row" },
                    React.createElement(StyleName_1.default, null),
                    React.createElement(MetaCheckboxes_1.default, { isUpdate: true }),
                    React.createElement(StyleSetup_1.default, { isUpdate: true })));
            }
            return React.createElement("div", { style: { display: "none" } });
        }
        return (React.createElement("div", { className: "PBE_collectionToolsActions PBE_row" },
            React.createElement(ActionButtons_1.default, null),
            readonly === false && React.createElement(React.Fragment, null,
                React.createElement(EditButtons_1.default, null),
                React.createElement(StyleName_1.default, null),
                React.createElement(MetaCheckboxes_1.default, { isUpdate: true }),
                React.createElement(StyleSetup_1.default, { isUpdate: true }),
                React.createElement(SystemButtons_1.default, null))));
    }
    exports["default"] = Actions;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Content/DetailedList.tsx":
/*!**************************************************************!*\
  !*** ./client/components/LoadStyle/Content/DetailedList.tsx ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/components/PromptsList */ "./client/components/PromptsList/index.tsx"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts"), __webpack_require__(/*! ./utils/getStyles */ "./client/components/LoadStyle/Content/utils/getStyles.ts"), __webpack_require__(/*! ./events/onBlockClick */ "./client/components/LoadStyle/Content/events/onBlockClick.ts"), __webpack_require__(/*! ../events/onApplyStyle */ "./client/components/LoadStyle/events/onApplyStyle.ts"), __webpack_require__(/*! ../events/onUpdatePreview */ "./client/components/LoadStyle/events/onUpdatePreview.ts"), __webpack_require__(/*! ../events/onRemoveStyle */ "./client/components/LoadStyle/events/onRemoveStyle.ts"), __webpack_require__(/*! ../events/onUpdateStyle */ "./client/components/LoadStyle/events/onUpdateStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, PromptsList_1, ActivePrompts_1, store_1, getStyles_1, onBlockClick_1, onApplyStyle_1, onUpdatePreview_1, onRemoveStyle_1, onUpdateStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function DetailedList() {
        const { readonly } = Database_1.default.meta;
        const selectedStyle = (0, store_1.default)(state => state.selectedStyle);
        const filterStyleCollection = (0, store_1.default)(state => state.filterStyleCollection);
        const filterStyleName = (0, store_1.default)(state => state.filterStyleName);
        const activePrompts = ActivePrompts_1.default.getCurrentPrompts();
        const styles = (0, getStyles_1.default)();
        const JSXDetailedBlocks = [];
        for (const style of styles) {
            const { name, positive, negative, width, height, steps, cfg, sampling, id, index, previewImage } = style;
            if (filterStyleCollection && filterStyleCollection !== id)
                continue;
            if (filterStyleName && !name.toLowerCase().includes(filterStyleName))
                continue;
            const idKey = `${id}_${index}`;
            JSXDetailedBlocks.push(React.createElement("div", { key: idKey, className: idKey === selectedStyle ? "PBE_styleItem PBE_selectedCurrentElement" : "PBE_styleItem", style: {
                    backgroundImage: previewImage ? Database_1.default.getStylePreviewURL(style) : "",
                }, onClick: () => (0, onBlockClick_1.default)(idKey, name, id, index) },
                React.createElement("div", { className: "PBE_styleHeader" },
                    React.createElement("div", { className: "PBE_styleItemName" }, name),
                    readonly === false &&
                        React.createElement("button", { className: "PBE_button", onClick: e => (0, onUpdatePreview_1.default)(id, name) }, "Update preview")),
                React.createElement("div", { className: "PBE_styleItemContent" },
                    React.createElement("div", { className: "PBE_stylesCurrentList PBE_Scrollbar" }, (positive && positive.length !== 0) &&
                        React.createElement(PromptsList_1.default, { prompts: positive, allowMove: false, noWrap: true })),
                    React.createElement("div", { className: "PBE_stylesAction" },
                        React.createElement("button", { className: "PBE_button", onClick: () => (0, onApplyStyle_1.default)() }, "Add before"),
                        (activePrompts && activePrompts.length !== 0) &&
                            React.createElement("button", { className: "PBE_button", onClick: () => (0, onApplyStyle_1.default)(true) }, "Add after"),
                        readonly === false && React.createElement(React.Fragment, null,
                            React.createElement("button", { className: "PBE_button PBE_buttonCancel", onClick: e => (0, onRemoveStyle_1.default)(id, index) }, "Remove"),
                            React.createElement("button", { className: "PBE_button", onClick: e => (0, onUpdateStyle_1.default)(id, index) }, "Update")))),
                React.createElement("div", { className: "PBE_styleItemMetaInfo" },
                    negative && React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "PBE_styleMetaField" }, "Negative:"),
                        " ",
                        negative,
                        "; "),
                    width && React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "PBE_styleMetaField" }, "Width:"),
                        " ",
                        width,
                        "; "),
                    height && React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "PBE_styleMetaField" }, "Height:"),
                        " ",
                        height,
                        "; "),
                    sampling && React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "PBE_styleMetaField" }, "Sampling:"),
                        " ",
                        sampling,
                        "; "),
                    steps && React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "PBE_styleMetaField" }, "Steps:"),
                        " ",
                        steps,
                        "; "),
                    cfg && React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "PBE_styleMetaField" }, "CFG:"),
                        " ",
                        cfg,
                        "; "))));
        }
        return (React.createElement("div", { className: "PBE_dataColumn PBE_Scrollbar PBE_windowContent" }, JSXDetailedBlocks));
    }
    exports["default"] = DetailedList;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Content/ThumbsList.tsx":
/*!************************************************************!*\
  !*** ./client/components/LoadStyle/Content/ThumbsList.tsx ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts"), __webpack_require__(/*! ./utils/getStyles */ "./client/components/LoadStyle/Content/utils/getStyles.ts"), __webpack_require__(/*! client/components/PromptItem */ "./client/components/PromptItem/index.tsx"), __webpack_require__(/*! ./events/onThumbClick */ "./client/components/LoadStyle/Content/events/onThumbClick.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, const_1, store_1, getStyles_1, PromptItem_1, onThumbClick_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ThumbsList() {
        const iterate = (0, store_1.default)(state => state.iterate);
        const selectedStyle = (0, store_1.default)(state => state.selectedStyle);
        const filterStyleCollection = (0, store_1.default)(state => state.filterStyleCollection);
        const filterStyleName = (0, store_1.default)(state => state.filterStyleName);
        const styles = (0, getStyles_1.default)();
        const JSXThumbnails = [];
        for (const style of styles) {
            const { name, id, index, previewImage } = style;
            if (!name)
                continue;
            if (filterStyleCollection && filterStyleCollection !== id)
                continue;
            if (filterStyleName && !name.toLowerCase().includes(filterStyleName))
                continue;
            const idKey = `${id}_${index}`;
            JSXThumbnails.push(React.createElement(PromptItem_1.default, { key: idKey + "_" + iterate, id: name, prompt: { id: name }, src: previewImage ? Database_1.default.getStylePreviewURL(style) : const_1.EMPTY_CARD_GRADIENT, options: {
                    className: idKey === selectedStyle ? "PBE_selectedCurrentElement" : "",
                }, onClick: e => (0, onThumbClick_1.default)(e, idKey, name, id, index) }));
        }
        return (React.createElement("div", { className: "PBE_dataBlock PBE_Scrollbar PBE_windowContent", "data-iterate": iterate }, JSXThumbnails));
    }
    exports["default"] = ThumbsList;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Content/events/onBlockClick.ts":
/*!********************************************************************!*\
  !*** ./client/components/LoadStyle/Content/events/onBlockClick.ts ***!
  \********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../../store */ "./client/components/LoadStyle/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onBlockClick(idKey, name, collection, index) {
        const { selectedStyle } = store_1.default.getState();
        if (selectedStyle === idKey) {
            (0, store_1.setSelectedStyle)("");
            (0, store_1.setSelectedName)("");
            (0, store_1.setSelectedCollection)("");
            (0, store_1.setSelectedIndex)();
            return;
        }
        (0, store_1.setSelectedStyle)(idKey);
        (0, store_1.setSelectedName)(name);
        (0, store_1.setSelectedCollection)(collection);
        (0, store_1.setSelectedIndex)(index);
    }
    exports["default"] = onBlockClick;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Content/events/onThumbClick.ts":
/*!********************************************************************!*\
  !*** ./client/components/LoadStyle/Content/events/onThumbClick.ts ***!
  \********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/components/LoadStyle/store */ "./client/components/LoadStyle/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/components/LoadStyle/events/onApplyStyle */ "./client/components/LoadStyle/events/onApplyStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2, onApplyStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onThumbClick(e, idKey, name, collection, index) {
        const { data } = Database_1.default;
        const { selectedStyle } = store_1.default.getState();
        const isShift = e.shiftKey;
        const isCtrl = e.metaKey || e.ctrlKey;
        const isAlt = e.altKey;
        if (!isShift && !isCtrl && selectedStyle === idKey) {
            (0, store_1.setSelectedStyle)("");
            (0, store_1.setSelectedName)("");
            (0, store_1.setSelectedCollection)("");
            (0, store_1.setSelectedIndex)();
            return;
        }
        (0, store_1.setSelectedStyle)(idKey);
        (0, store_1.setSelectedName)(name);
        (0, store_1.setSelectedCollection)(collection);
        (0, store_1.setSelectedIndex)(index);
        if (isCtrl && !isShift) {
            (0, onApplyStyle_1.default)(true);
        }
        else if (isCtrl && isShift) {
            (0, onApplyStyle_1.default)(false);
        }
        else if (isShift) {
            const targetCollection = data.styles[collection];
            if (!targetCollection)
                return false;
            const targetStyle = data.styles[collection][index];
            if (!targetStyle)
                return false;
            (0, store_2.setEditTargetCollection)(collection);
            (0, store_2.setEditStyle)(JSON.parse(JSON.stringify(targetStyle)));
        }
        /* if(isShift) onApplyStyle(false);
        else if(isCtrl) onRemoveStyle(collection, index); */
    }
    exports["default"] = onThumbClick;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Content/index.tsx":
/*!*******************************************************!*\
  !*** ./client/components/LoadStyle/Content/index.tsx ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts"), __webpack_require__(/*! ./ThumbsList */ "./client/components/LoadStyle/Content/ThumbsList.tsx"), __webpack_require__(/*! ./DetailedList */ "./client/components/LoadStyle/Content/DetailedList.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, ThumbsList_1, DetailedList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function LoadStyleContent() {
        const isSimpleView = (0, store_1.default)(state => state.isSimpleView);
        if (isSimpleView)
            return React.createElement(ThumbsList_1.default, null);
        return React.createElement(DetailedList_1.default, null);
    }
    exports["default"] = LoadStyleContent;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Content/utils/getStyles.ts":
/*!****************************************************************!*\
  !*** ./client/components/LoadStyle/Content/utils/getStyles.ts ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getStyles() {
        const { data } = Database_1.default;
        let styles = [];
        for (const collectionId in data.styles) {
            for (let i = 0; i < data.styles[collectionId].length; i++) {
                const styleItem = data.styles[collectionId][i];
                styles.push(Object.assign(Object.assign({}, styleItem), { id: collectionId, index: i }));
            }
        }
        styles.sort((A, B) => {
            if (A.name > B.name)
                return 1;
            if (A.name < B.name)
                return -1;
            return 0;
        });
        return styles;
    }
    exports["default"] = getStyles;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/Filter.tsx":
/*!************************************************!*\
  !*** ./client/components/LoadStyle/Filter.tsx ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ./store */ "./client/components/LoadStyle/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Filter() {
        const { data } = Database_1.default;
        const isSimpleView = (0, store_1.default)(state => state.isSimpleView);
        const filterStyleCollection = (0, store_1.default)(state => state.filterStyleCollection);
        const filterStyleName = (0, store_1.default)(state => state.filterStyleName);
        const JSXStyles = [];
        for (const collectionId in data.styles) {
            JSXStyles.push(React.createElement("option", { key: collectionId, value: collectionId }, collectionId));
        }
        return (React.createElement("div", { className: "PBE_row PBE_stylesFilter" },
            React.createElement("div", { title: "Toggles simplified view mode", className: isSimpleView ? "PBE_toggleButton PBE_toggledButton" : "PBE_toggleButton", style: { height: "16px" }, onClick: () => (0, store_1.setIsSimpleView)(!isSimpleView) }, "Simple mode"),
            React.createElement("select", { value: filterStyleCollection, onChange: e => (0, store_1.setFilterStyleCollection)(e.currentTarget.value), className: "PBE_generalInput PBE_select" },
                React.createElement("option", { value: "" }, "Any"),
                JSXStyles),
            React.createElement("input", { value: filterStyleName, placeholder: "Search name", className: "PBE_generalInput PBE_input", onChange: e => (0, store_1.setFilterStyleName)(e.currentTarget.value) })));
    }
    exports["default"] = Filter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/events/onApplyStyle.ts":
/*!************************************************************!*\
  !*** ./client/components/LoadStyle/events/onApplyStyle.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, ActivePrompts_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onApplyStyle(isAfter) {
        const selectedStyle = store_1.default.getState().selectedStyle;
        if (!selectedStyle)
            return false;
        const lastIndex = selectedStyle.lastIndexOf("_");
        const collectionId = selectedStyle.substring(0, lastIndex);
        const index = Number(selectedStyle.substring(lastIndex + 1));
        const { data } = Database_1.default;
        if (!data.styles)
            return false;
        if (!collectionId || Number.isNaN(index))
            return false;
        const targetCollection = data.styles[collectionId];
        if (!targetCollection)
            return false;
        const targetStyle = data.styles[collectionId][index];
        if (!targetStyle)
            return false;
        ActivePrompts_1.default.applyStyle(targetStyle, isAfter);
        return true;
    }
    exports["default"] = onApplyStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/events/onRemoveStyle.ts":
/*!*************************************************************!*\
  !*** ./client/components/LoadStyle/events/onRemoveStyle.ts ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onRemoveStyle(selectedCollection, selectedIndex) {
        const { readonly } = Database_1.default.meta;
        const { data } = Database_1.default;
        if (readonly || !data.styles)
            return;
        if (!selectedCollection && selectedIndex === undefined) {
            selectedCollection = store_1.default.getState().selectedCollection;
            selectedIndex = store_1.default.getState().selectedIndex;
        }
        if (!selectedCollection || selectedIndex === undefined)
            return;
        const targetCollection = data.styles[selectedCollection];
        if (!targetCollection)
            return;
        const targetStyle = data.styles[selectedCollection][selectedIndex];
        if (!targetStyle)
            return;
        if (confirm(`Remove style "${targetStyle.name}" from catalogue "${selectedCollection}"?`)) {
            targetCollection.splice(selectedIndex, 1);
            Database_1.default.updateStyles(selectedCollection);
            (0, store_1.iterateStore)();
        }
    }
    exports["default"] = onRemoveStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/events/onRenameStyle.ts":
/*!*************************************************************!*\
  !*** ./client/components/LoadStyle/events/onRenameStyle.ts ***!
  \*************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onRenameStyle(selectedCollection, selectedIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const { readonly } = Database_1.default.meta;
            const { data } = Database_1.default;
            if (readonly || !data.styles)
                return;
            const { newName } = store_1.default.getState();
            if (!newName)
                return;
            if (!selectedCollection && selectedIndex === undefined) {
                selectedCollection = store_1.default.getState().selectedCollection;
                selectedIndex = store_1.default.getState().selectedIndex;
            }
            if (!selectedCollection || selectedIndex === undefined)
                return;
            const targetCollection = data.styles[selectedCollection];
            if (!targetCollection)
                return;
            const targetStyle = data.styles[selectedCollection][selectedIndex];
            if (!targetStyle)
                return;
            for (const styleItem of targetCollection) {
                if (styleItem.name === newName) {
                    alert("Style name already used");
                    return;
                }
            }
            if (confirm(`Rename style "${targetStyle.name}" to "${newName}"?`)) {
                yield Database_1.default.renameStyle(selectedCollection, targetStyle.name, newName);
                (0, store_1.setNewName)("");
                (0, store_1.iterateStore)();
            }
        });
    }
    exports["default"] = onRenameStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/events/onUpdatePreview.ts":
/*!***************************************************************!*\
  !*** ./client/components/LoadStyle/events/onUpdatePreview.ts ***!
  \***************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onUpdatePreview(selectedCollection, selectedName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!selectedCollection && !selectedName) {
                selectedCollection = store_1.default.getState().selectedCollection;
                selectedName = store_1.default.getState().selectedName;
            }
            if (!selectedCollection || !selectedName)
                return;
            yield Database_1.default.updateStylePreview({ collectionId: selectedCollection, styleId: selectedName });
            (0, store_1.iterateStore)();
        });
    }
    exports["default"] = onUpdatePreview;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/events/onUpdateStyle.ts":
/*!*************************************************************!*\
  !*** ./client/components/LoadStyle/events/onUpdateStyle.ts ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/utils/getStyle */ "./client/utils/getStyle.ts"), __webpack_require__(/*! ../store */ "./client/components/LoadStyle/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, getStyle_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onUpdateStyle(selectedCollection, selectedIndex) {
        const { readonly } = Database_1.default.meta;
        const { data } = Database_1.default;
        if (readonly || !data.styles)
            return;
        if (!selectedCollection && selectedIndex === undefined) {
            selectedCollection = store_1.default.getState().selectedCollection;
            selectedIndex = store_1.default.getState().selectedIndex;
        }
        if (!selectedCollection || selectedIndex === undefined)
            return;
        const targetCollection = data.styles[selectedCollection];
        if (!targetCollection)
            return;
        const targetStyle = data.styles[selectedCollection][selectedIndex];
        if (!targetStyle)
            return;
        if (confirm(`Replace style "${targetStyle.name}" params to the currently selected?`)) {
            const newStyle = (0, getStyle_1.default)({ collectionId: selectedCollection, isUpdate: true });
            if (!newStyle)
                return;
            for (const i in newStyle) {
                targetStyle[i] = newStyle[i];
            }
            /**
             * Removing fields that are not part of the style anymore.
             * Some fields like name or previewImage must be kept in the object.
             * TODO: I probably should check dictionary of fields that can be added/removed
             * instead of hardcoding check for things like a name
             */
            for (const i in targetStyle) {
                if (i === "name")
                    continue;
                if (i === "previewImage")
                    continue;
                if (!newStyle[i])
                    delete targetStyle[i];
            }
            Database_1.default.updateStyles(selectedCollection);
            (0, store_1.iterateStore)();
        }
    }
    exports["default"] = onUpdateStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/index.tsx":
/*!***********************************************!*\
  !*** ./client/components/LoadStyle/index.tsx ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./mount */ "./client/components/LoadStyle/mount.tsx"), __webpack_require__(/*! ./Filter */ "./client/components/LoadStyle/Filter.tsx"), __webpack_require__(/*! ./Actions */ "./client/components/LoadStyle/Actions/index.tsx"), __webpack_require__(/*! ./Content */ "./client/components/LoadStyle/Content/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, mount_1, Filter_1, Actions_1, Content_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.mount = void 0;
    exports.mount = mount_1.default;
    function LoadStyle({ parent }) {
        const showLoadStyle = (0, store_1.default)(state => state.showLoadStyle);
        (0, react_1.useEffect)(() => {
            if (!showLoadStyle) {
                parent.style.display = "none";
            }
            else {
                parent.style.display = "flex";
            }
        }, [showLoadStyle]);
        if (!showLoadStyle)
            return React.createElement("div", null);
        return (React.createElement(React.Fragment, null,
            React.createElement(Filter_1.default, null),
            React.createElement(Content_1.default, null),
            React.createElement(Actions_1.default, null),
            React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide" },
                React.createElement("button", { className: "PBE_button", onClick: () => (0, store_1.setShowLoadStyle)(false) }, "Close"))));
    }
    exports["default"] = LoadStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/mount.tsx":
/*!***********************************************!*\
  !*** ./client/components/LoadStyle/mount.tsx ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/LoadStyle/index.tsx"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/staticStore */ "./client/staticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1, store_1, staticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper }) {
        const loadStyle = document.createElement("div");
        loadStyle.className = "PBE_generalWindow PBE_stylesWindow";
        loadStyle.id = "PBE_stylesWindow";
        loadStyle.style.zIndex = "200";
        loadStyle.style.display = "none";
        wrapper.appendChild(loadStyle);
        loadStyle.addEventListener("mouseenter", () => {
            staticStore_1.default.onClose = () => (0, store_1.setShowLoadStyle)(false);
        });
        const root = (0, client_1.createRoot)(loadStyle);
        root.render(React.createElement(index_1.default, { parent: loadStyle }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/LoadStyle/store.ts":
/*!**********************************************!*\
  !*** ./client/components/LoadStyle/store.ts ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.setFilterStyleName = exports.setFilterStyleCollection = exports.setIsSimpleView = exports.setNewName = exports.setSelectedIndex = exports.setSelectedName = exports.setSelectedCollection = exports.setSelectedStyle = exports.iterateStore = void 0;
    const loadStyleStore = (0, zustand_1.create)((set) => ({
        iterate: 0,
        selectedCollection: "",
        selectedName: "",
        selectedIndex: undefined,
        selectedStyle: "",
        newName: "",
        isSimpleView: true,
        filterStyleCollection: "",
        filterStyleName: "",
    }));
    const iterateStore = () => loadStyleStore.setState({ iterate: loadStyleStore.getState().iterate + 1 });
    exports.iterateStore = iterateStore;
    const setSelectedStyle = (selectedStyle) => loadStyleStore.setState({ selectedStyle });
    exports.setSelectedStyle = setSelectedStyle;
    const setSelectedCollection = (selectedCollection) => loadStyleStore.setState({ selectedCollection });
    exports.setSelectedCollection = setSelectedCollection;
    const setSelectedName = (selectedName) => loadStyleStore.setState({ selectedName });
    exports.setSelectedName = setSelectedName;
    const setSelectedIndex = (selectedIndex) => loadStyleStore.setState({ selectedIndex });
    exports.setSelectedIndex = setSelectedIndex;
    const setNewName = (newName) => loadStyleStore.setState({ newName });
    exports.setNewName = setNewName;
    const setIsSimpleView = (isSimpleView) => loadStyleStore.setState({ isSimpleView });
    exports.setIsSimpleView = setIsSimpleView;
    const setFilterStyleCollection = (filterStyleCollection) => loadStyleStore.setState({ filterStyleCollection });
    exports.setFilterStyleCollection = setFilterStyleCollection;
    const setFilterStyleName = (filterStyleName) => loadStyleStore.setState({ filterStyleName });
    exports.setFilterStyleName = setFilterStyleName;
    exports["default"] = loadStyleStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PreviewSave/hooks/useSetDefault.ts":
/*!**************************************************************!*\
  !*** ./client/components/PreviewSave/hooks/useSetDefault.ts ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/PreviewSave/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, react_1, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function useSetDefault(previewCollection, tabName) {
        (0, react_1.useEffect)(() => {
            const { data } = Database_1.default;
            if (previewCollection && data.original[previewCollection])
                return;
            for (const collectionId in data.original) {
                (0, store_1.setPreviewCollection)(collectionId);
                break;
            }
        }, [previewCollection, tabName]);
    }
    exports["default"] = useSetDefault;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PreviewSave/index.tsx":
/*!*************************************************!*\
  !*** ./client/components/PreviewSave/index.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./store */ "./client/components/PreviewSave/store.ts"), __webpack_require__(/*! ./hooks/useSetDefault */ "./client/components/PreviewSave/hooks/useSetDefault.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1, store_2, useSetDefault_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function PreviewSave({ tabName }) {
        const selectedPrompt = (0, store_1.default)(state => state.selectedPrompt);
        const previewCollection = (0, store_2.default)(state => state.previewCollection);
        const { data } = Database_1.default;
        const { readonly } = Database_1.default.meta;
        (0, useSetDefault_1.default)(previewCollection, tabName);
        if (readonly || !selectedPrompt)
            return React.createElement("div", { style: { display: "none" } });
        const JSXOptions = [];
        for (const collectionId in data.original) {
            JSXOptions.push(React.createElement("option", { key: collectionId, value: collectionId }, collectionId));
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("select", { className: "PBE_generalInput PBE_select PBE_savePromptSelect", onChange: e => (0, store_2.setPreviewCollection)(e.currentTarget.value), value: previewCollection }, JSXOptions),
            React.createElement("div", { className: "PBE_actionButton PBE_savePromptPreview", title: "Save the generated preview for the selected prompt", onClick: () => Database_1.default.savePromptPreview() }, "Save preview")));
    }
    exports["default"] = PreviewSave;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PreviewSave/mount.tsx":
/*!*************************************************!*\
  !*** ./client/components/PreviewSave/mount.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/PreviewSave/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper, tabName }) {
        const previewSave = document.createElement("div");
        wrapper.appendChild(previewSave);
        const root = (0, client_1.createRoot)(previewSave);
        root.render(React.createElement(index_1.default, { tabName: tabName }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PreviewSave/store.ts":
/*!************************************************!*\
  !*** ./client/components/PreviewSave/store.ts ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.setPreviewCollection = void 0;
    const previewStore = (0, zustand_1.create)((set) => ({
        previewCollection: "",
    }));
    const setPreviewCollection = (previewCollection) => previewStore.setState({ previewCollection });
    exports.setPreviewCollection = setPreviewCollection;
    exports["default"] = previewStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/AddSetup.tsx":
/*!***************************************************!*\
  !*** ./client/components/PromptEdit/AddSetup.tsx ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function AddSetup() {
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const { editPrompt } = store_1.default.getState();
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { "data-iterate": iterate, className: "PBE_rowBlock", style: { height: "40px" } },
                React.createElement("label", { htmlFor: "PBE_promptEdit_addAtStart" }, "Add at the beginning:"),
                React.createElement("input", { className: "PBE_promptEdit_addAtStart", type: "checkbox", id: "PBE_promptEdit_addAtStart", name: "PBE_promptEdit_addAtStart", checked: editPrompt.addAtStart, onChange: e => {
                        editPrompt.addAtStart = e.currentTarget.checked;
                        setIterate(iterate + 1);
                    } })),
            React.createElement("div", { "data-iterate": iterate, className: "PBE_rowBlock", style: { height: "40px" } },
                React.createElement("label", null, "Subsequent prompts:"),
                React.createElement("input", { className: "PBE_generalInput PBE_promptEdit_addAfter", type: "text", value: editPrompt.addAfter, onChange: e => {
                        editPrompt.addAfter = e.currentTarget.value;
                        setIterate(iterate + 1);
                    } })),
            React.createElement("div", { "data-iterate": iterate, className: "PBE_rowBlock", style: { height: "40px" } },
                React.createElement("label", null, "Add prompts at the start:"),
                React.createElement("input", { className: "PBE_generalInput PBE_promptEdit_addStart", type: "text", value: editPrompt.addStart, onChange: e => {
                        editPrompt.addStart = e.currentTarget.value;
                        setIterate(iterate + 1);
                    } })),
            React.createElement("div", { "data-iterate": iterate, className: "PBE_rowBlock", style: { height: "40px" } },
                React.createElement("label", null, "Add prompts at the end:"),
                React.createElement("input", { className: "PBE_generalInput PBE_promptEdit_addEnd", type: "text", value: editPrompt.addEnd, onChange: e => {
                        editPrompt.addEnd = e.currentTarget.value;
                        setIterate(iterate + 1);
                    } }))));
    }
    exports["default"] = AddSetup;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/AutoGenBlock.tsx":
/*!*******************************************************!*\
  !*** ./client/components/PromptEdit/AutoGenBlock.tsx ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function AutoGenBlock() {
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const { editPrompt } = store_1.default.getState();
        const { data } = Database_1.default;
        const JSXCollections = [];
        const JSXStyles = [];
        const { autogen = {} } = editPrompt;
        for (const colId in data.styles)
            JSXCollections.push(React.createElement("option", { key: colId, value: colId }, colId));
        if (autogen.collection) {
            const targetCollection = data.styles[autogen.collection];
            if (targetCollection) {
                for (const styleItem of targetCollection) {
                    JSXStyles.push(React.createElement("option", { key: styleItem.name, value: styleItem.name }, styleItem.name));
                }
            }
        }
        return (React.createElement("div", { "data-iterate": iterate, className: "PBE_rowBlock", style: {
                height: "40px",
            } },
            "Autogen:",
            React.createElement("select", { id: "PBE_autoGentCollection", className: "PBE_generalInput", value: autogen.collection || "__none", onChange: e => {
                    const value = e.currentTarget.value;
                    if (!editPrompt.autogen)
                        editPrompt.autogen = {};
                    if (!value || value === "__none") {
                        delete editPrompt.autogen;
                        setIterate(iterate + 1);
                        return;
                    }
                    editPrompt.autogen.collection = value;
                    const targetCollection = data.styles[value];
                    if (!targetCollection)
                        return;
                    editPrompt.autogen.style = "";
                    for (const styleItem of targetCollection) {
                        editPrompt.autogen.style = styleItem.name;
                        break;
                    }
                    setIterate(iterate + 1);
                } },
                React.createElement("option", { value: "__none" }, "None"),
                JSXCollections),
            React.createElement("select", { id: "PBE_autoGentStyle", className: "PBE_generalInput", value: autogen.style || "", onChange: e => {
                    if (!editPrompt.autogen)
                        editPrompt.autogen = {};
                    editPrompt.autogen.style = e.currentTarget.value;
                    setIterate(iterate + 1);
                } }, JSXStyles)));
    }
    exports["default"] = AutoGenBlock;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/CategoriesBlock.tsx":
/*!**********************************************************!*\
  !*** ./client/components/PromptEdit/CategoriesBlock.tsx ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onAddCategory(value) {
        const { editPrompt } = store_1.default.getState();
        if (!editPrompt)
            return;
        if (editPrompt.category.includes(value))
            return;
        editPrompt.category.push(value);
    }
    function getFirstNewCategory() {
        const { data } = Database_1.default;
        const categories = data.categories;
        const { editPrompt } = store_1.default.getState();
        const targetCategory = categories.find(item => {
            var _a;
            if (!editPrompt || !((_a = editPrompt.category) === null || _a === void 0 ? void 0 : _a.length))
                return true;
            if (editPrompt.category.includes(item))
                return false;
            return true;
        });
        return targetCategory || "";
    }
    function CategoriesBlock() {
        const { data } = Database_1.default;
        const categories = data.categories;
        const { editPrompt } = store_1.default.getState();
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const [addCategory, setAddCategory] = (0, react_1.useState)(getFirstNewCategory());
        const JSXCategories = [];
        const JSXOptions = [];
        if (editPrompt) {
            for (const categoryItem of editPrompt.category) {
                const categoryElement = document.createElement("div");
                categoryElement.className = "PBE_promptEditInfoItem";
                categoryElement.innerText = categoryItem;
                JSXCategories.push(React.createElement("div", { key: categoryItem, className: "PBE_promptEditInfoItem", onClick: e => {
                        if (!e.metaKey && !e.ctrlKey)
                            return;
                        const target = e.currentTarget;
                        const categoryId = target.innerText;
                        editPrompt.category = editPrompt.category.filter(item => item !== categoryId);
                        setIterate(iterate + 1);
                    } }, categoryItem));
            }
            categories.forEach(catItem => {
                if (editPrompt.category.includes(catItem))
                    return;
                JSXOptions.push(React.createElement("option", { key: catItem, value: catItem }, catItem));
            });
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "PBE_rowBlock", style: { marginBottom: "0" } },
                React.createElement("div", null, "Categories:"),
                React.createElement("div", { className: "PBE_List PBE_Scrollbar PBE_tagsList" }, JSXCategories)),
            React.createElement("div", { className: "PBE_rowBlock" },
                React.createElement("select", { value: addCategory, className: "PBE_generalInput", onChange: e => setAddCategory(e.currentTarget.value) }, JSXOptions),
                React.createElement("button", { className: "PBE_button", onClick: () => {
                        onAddCategory(addCategory);
                        setAddCategory(getFirstNewCategory());
                        setIterate(iterate + 1);
                    } }, "Add category"))));
    }
    exports["default"] = CategoriesBlock;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/CollectionAction.tsx":
/*!***********************************************************!*\
  !*** ./client/components/PromptEdit/CollectionAction.tsx ***!
  \***********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./events/onMovePrompt */ "./client/components/PromptEdit/events/onMovePrompt.ts"), __webpack_require__(/*! ./events/onCopyPrompt */ "./client/components/PromptEdit/events/onCopyPrompt.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, index_1, store_1, react_1, onMovePrompt_1, onCopyPrompt_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function CollectionAction() {
        const { data } = index_1.default;
        const { united } = data;
        const editPrompt = (0, store_1.default)(state => state.editPrompt);
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        const targetItem = united.find(item => item.id === editPrompt.id);
        const [copyOrMoveTo, setCopyOrMoveTo] = (0, react_1.useState)("");
        let firstPossibleCollection = false;
        const JSXOptions = [];
        for (const collectionId in data.original) {
            if (targetItem && (targetItem === null || targetItem === void 0 ? void 0 : targetItem.collections.includes(collectionId)))
                continue;
            if (!firstPossibleCollection)
                firstPossibleCollection = collectionId;
            JSXOptions.push(React.createElement("option", { key: collectionId, value: collectionId }, collectionId));
        }
        (0, react_1.useEffect)(() => {
            if (firstPossibleCollection)
                setCopyOrMoveTo(firstPossibleCollection);
        }, [1]);
        if (!targetItem)
            return React.createElement("div", null);
        if (!firstPossibleCollection)
            return React.createElement("div", null);
        return (React.createElement("div", { className: "PBE_rowBlock", "data-iteration": filesIteration },
            React.createElement("select", { className: "PBE_generalInput", value: copyOrMoveTo, onChange: e => setCopyOrMoveTo(e.currentTarget.value) }, JSXOptions),
            React.createElement("button", { className: "PBE_button", onClick: () => (0, onCopyPrompt_1.default)({ copyOrMoveTo }) }, "Copy"),
            React.createElement("button", { className: "PBE_button", onClick: () => (0, onMovePrompt_1.default)({ copyOrMoveTo }) }, "Move")));
    }
    exports["default"] = CollectionAction;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/CollectionSelector.tsx":
/*!*************************************************************!*\
  !*** ./client/components/PromptEdit/CollectionSelector.tsx ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function CollectionSelector() {
        const { data } = Database_1.default;
        const { united } = data;
        const editPrompt = (0, store_1.default)(state => state.editPrompt);
        const editTargetCollection = (0, store_1.default)(state => state.editTargetCollection);
        const targetItem = united.find(item => item.id === editPrompt.id);
        const JSXOptions = [];
        if (!targetItem || !targetItem.collections)
            return React.createElement("div", null);
        if (targetItem.collections.length === 1) {
            return (React.createElement("div", { className: "PBE_promptEditSingleCollection" }, targetItem.collections[0]));
        }
        for (const collectionItem of targetItem.collections) {
            JSXOptions.push(React.createElement("option", { key: collectionItem, value: collectionItem }, collectionItem));
        }
        return (React.createElement("select", { className: "PBE_generalInput", value: editTargetCollection, onChange: e => {
                const value = e.currentTarget.value;
                (0, store_1.setEditTargetCollection)(value);
                const { united, original } = Database_1.default.data;
                if (!targetItem)
                    return;
                let collection = original[value];
                if (!collection)
                    return false;
                const originalItem = collection.find(item => item.id === targetItem.id);
                if (!originalItem)
                    return false;
                (0, store_1.setEditPrompt)(JSON.parse(JSON.stringify(originalItem)));
            } }, JSXOptions));
    }
    exports["default"] = CollectionSelector;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/Footer.tsx":
/*!*************************************************!*\
  !*** ./client/components/PromptEdit/Footer.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./events/onSavePrompt */ "./client/components/PromptEdit/events/onSavePrompt.ts"), __webpack_require__(/*! ./events/onClose */ "./client/components/PromptEdit/events/onClose.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, onSavePrompt_1, onClose_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Footer() {
        return (React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide", style: {
                justifyContent: "space-around",
            } },
            React.createElement("button", { className: "PBE_button PBE_buttonCancel", onClick: onClose_1.default }, "Cancel"),
            React.createElement("button", { className: "PBE_button", onClick: onSavePrompt_1.default }, "Save")));
    }
    exports["default"] = Footer;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/MetaBlock.tsx":
/*!****************************************************!*\
  !*** ./client/components/PromptEdit/MetaBlock.tsx ***!
  \****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function MetaBlock() {
        var _a;
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const { editPrompt } = store_1.default.getState();
        let url = "";
        if ((_a = editPrompt === null || editPrompt === void 0 ? void 0 : editPrompt.meta) === null || _a === void 0 ? void 0 : _a.url)
            url = editPrompt.meta.url;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "PBE_rowBlock", "data-iterate": iterate },
                React.createElement("label", null, "Associated url:"),
                React.createElement("input", { className: "PBE_generalInput PBE_promptEdit_url", type: "text", value: url, onChange: e => {
                        const value = e.currentTarget.value;
                        if (!editPrompt.meta)
                            editPrompt.meta = {};
                        if (!value)
                            delete editPrompt.meta.url;
                        else
                            editPrompt.meta.url = value;
                        setIterate(iterate + 1);
                    } }),
                url &&
                    React.createElement("a", { href: url, target: "_blank", rel: "noopener noreferrer" }, "Open")),
            React.createElement("textarea", { "data-iterate": iterate, id: "PBE_commentArea", className: "PBE_Textarea PBE_Scrollbar", value: editPrompt.comment || "", onChange: e => {
                    editPrompt.comment = e.currentTarget.value;
                    setIterate(iterate + 1);
                } })));
    }
    exports["default"] = MetaBlock;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/Previews.tsx":
/*!***************************************************!*\
  !*** ./client/components/PromptEdit/Previews.tsx ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/components/PromptItem/index */ "./client/components/PromptItem/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ShowPreviews({ prompt }) {
        const { data } = Database_1.default;
        const { unitedList } = data;
        const targetItem = unitedList[prompt.id];
        if (!targetItem)
            return;
        const { knownPreviews = {}, knownModelPreviews = {} } = targetItem;
        const JSXPromptPreviews = [];
        for (let collectionId in knownModelPreviews) {
            const collectionPreviews = knownModelPreviews[collectionId];
            for (let modelId in collectionPreviews) {
                const id = `${collectionId} - ${modelId}`;
                let url = Database_1.default.getPromptPreviewURL({ prompt: prompt.id, collectionId, model: modelId });
                JSXPromptPreviews.push(React.createElement(index_1.default, { key: id, id: id, prompt: { id }, src: url }));
            }
        }
        for (let collectionId in knownPreviews) {
            const id = `${collectionId}`;
            let url = Database_1.default.getPromptPreviewURL({ prompt: prompt.id, collectionId, model: false });
            JSXPromptPreviews.push(React.createElement(index_1.default, { key: id, id: id, prompt: { id }, src: url }));
        }
        return (React.createElement("div", { className: "PBE_dataBlock PBE_Scrollbar", style: { maxWidth: "500px" } }, JSXPromptPreviews));
    }
    exports["default"] = ShowPreviews;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/TagsBlock.tsx":
/*!****************************************************!*\
  !*** ./client/components/PromptEdit/TagsBlock.tsx ***!
  \****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/components/ui/TagTooltip */ "./client/components/ui/TagTooltip/index.tsx"), __webpack_require__(/*! ./events/onAddTags */ "./client/components/PromptEdit/events/onAddTags.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, TagTooltip_1, onAddTags_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function TagsBlock() {
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const [addTagArr, setAddTagArr] = (0, react_1.useState)([]);
        const { editPrompt } = store_1.default.getState();
        const JSXTags = [];
        if (editPrompt) {
            for (const tagItem of editPrompt.tags) {
                JSXTags.push(React.createElement("div", { key: tagItem, className: "PBE_promptEditInfoItem", onClick: e => {
                        if (!e.metaKey && !e.ctrlKey)
                            return;
                        const target = e.currentTarget;
                        const tagId = target.innerText;
                        editPrompt.tags = editPrompt.tags.filter(item => item !== tagId);
                        setIterate(iterate + 1);
                    } }, tagItem));
            }
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "PBE_rowBlock", style: { marginBottom: "0" } },
                React.createElement("div", null, "Tags:"),
                React.createElement("div", { className: "PBE_List PBE_Scrollbar PBE_tagsList" }, JSXTags)),
            React.createElement("div", { className: "PBE_rowBlock" },
                React.createElement(TagTooltip_1.default, { iteration: iterate, tags: addTagArr, onUpdate: newTags => {
                        setAddTagArr(newTags || []);
                    }, onSubmit: () => {
                        (0, onAddTags_1.default)(addTagArr);
                        setAddTagArr([]);
                        setIterate(iterate + 1);
                    } }),
                React.createElement("button", { className: "PBE_button", onClick: () => {
                        (0, onAddTags_1.default)(addTagArr);
                        setAddTagArr([]);
                        setIterate(iterate + 1);
                    } }, "Add tag"))));
    }
    exports["default"] = TagsBlock;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/events/onAddTags.ts":
/*!**********************************************************!*\
  !*** ./client/components/PromptEdit/events/onAddTags.ts ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onAddTags(tags) {
        const { editPrompt } = store_1.default.getState();
        if (!editPrompt)
            return;
        //removing empty tags
        tags = tags.filter(item => item);
        for (const tag of tags) {
            if (editPrompt.tags.includes(tag))
                continue;
            editPrompt.tags.push(tag);
        }
    }
    exports["default"] = onAddTags;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/events/onClose.ts":
/*!********************************************************!*\
  !*** ./client/components/PromptEdit/events/onClose.ts ***!
  \********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onClose() {
        (0, store_1.setEditPrompt)(undefined);
        (0, store_1.setEditTargetCollection)(undefined);
    }
    exports["default"] = onClose;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/events/onCopyPrompt.ts":
/*!*************************************************************!*\
  !*** ./client/components/PromptEdit/events/onCopyPrompt.ts ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onCopyPrompt({ copyOrMoveTo }) {
        const { data } = Database_1.default;
        const state = store_1.default.getState();
        const editPrompt = state.editPrompt;
        const editTargetCollection = state.editTargetCollection;
        if (!editPrompt || !copyOrMoveTo || !editTargetCollection)
            return;
        const to = copyOrMoveTo;
        const from = editTargetCollection;
        if (!to || !from)
            return;
        if (!data.original[to] || !data.original[from])
            return;
        const originalItem = data.original[from].find(item => item.id === editPrompt.id);
        if (!originalItem)
            return;
        if (data.original[to].some(item => item.id === editPrompt.id))
            return;
        data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
        Database_1.default.movePreviewImage(editPrompt.id, from, to, "copy");
        Database_1.default.saveJSONData(to, true);
        Database_1.default.updateMixedList();
        (0, store_1.updateFilesIteration)();
    }
    exports["default"] = onCopyPrompt;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/events/onMovePrompt.ts":
/*!*************************************************************!*\
  !*** ./client/components/PromptEdit/events/onMovePrompt.ts ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onMovePrompt({ copyOrMoveTo }) {
        const { data } = Database_1.default;
        const state = store_1.default.getState();
        const editPrompt = state.editPrompt;
        const editTargetCollection = state.editTargetCollection;
        if (!editPrompt || !copyOrMoveTo || !editTargetCollection)
            return;
        const to = copyOrMoveTo;
        const from = editTargetCollection;
        if (!to || !from)
            return;
        if (!data.original[to] || !data.original[from])
            return;
        const originalItem = data.original[from].find(item => item.id === editPrompt.id);
        if (!originalItem)
            return;
        if (!data.original[to].some(item => item.id === editPrompt.id)) {
            data.original[to].push(JSON.parse(JSON.stringify(originalItem)));
        }
        data.original[from] = data.original[from].filter(item => item.id !== editPrompt.id);
        Database_1.default.movePreviewImage(editPrompt.id, from, to, "move");
        Database_1.default.saveJSONData(to, true);
        Database_1.default.saveJSONData(from, true);
        Database_1.default.updateMixedList();
        (0, store_1.updateFilesIteration)();
    }
    exports["default"] = onMovePrompt;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/events/onSavePrompt.ts":
/*!*************************************************************!*\
  !*** ./client/components/PromptEdit/events/onSavePrompt.ts ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function cleanPromptObject(promptItem) {
        if (!promptItem.addAtStart)
            delete promptItem.addAtStart;
        if (!promptItem.addAfter)
            delete promptItem.addAfter;
        if (!promptItem.addStart)
            delete promptItem.addStart;
        if (!promptItem.addEnd)
            delete promptItem.addEnd;
    }
    function onSavePrompt() {
        const { data } = Database_1.default;
        const state = store_1.default.getState();
        const editPrompt = state.editPrompt;
        const editTargetCollection = state.editTargetCollection;
        if (!editPrompt || !editTargetCollection)
            return;
        const collection = data.original[editTargetCollection];
        if (!collection)
            return;
        cleanPromptObject(editPrompt);
        const indexInOrigin = collection.findIndex(item => item.id === editPrompt.id);
        if (indexInOrigin !== -1)
            collection[indexInOrigin] = editPrompt;
        else
            collection.push(editPrompt);
        Database_1.default.saveJSONData(editTargetCollection);
        Database_1.default.updateMixedList();
        (0, store_1.setEditPrompt)(undefined);
        (0, store_1.setEditTargetCollection)(undefined);
    }
    exports["default"] = onSavePrompt;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/index.tsx":
/*!************************************************!*\
  !*** ./client/components/PromptEdit/index.tsx ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ./TagsBlock */ "./client/components/PromptEdit/TagsBlock.tsx"), __webpack_require__(/*! ./CategoriesBlock */ "./client/components/PromptEdit/CategoriesBlock.tsx"), __webpack_require__(/*! ./CollectionAction */ "./client/components/PromptEdit/CollectionAction.tsx"), __webpack_require__(/*! ./CollectionSelector */ "./client/components/PromptEdit/CollectionSelector.tsx"), __webpack_require__(/*! ./Previews */ "./client/components/PromptEdit/Previews.tsx"), __webpack_require__(/*! ./Footer */ "./client/components/PromptEdit/Footer.tsx"), __webpack_require__(/*! ./AutoGenBlock */ "./client/components/PromptEdit/AutoGenBlock.tsx"), __webpack_require__(/*! ./AddSetup */ "./client/components/PromptEdit/AddSetup.tsx"), __webpack_require__(/*! ./MetaBlock */ "./client/components/PromptEdit/MetaBlock.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, Database_1, TagsBlock_1, CategoriesBlock_1, CollectionAction_1, CollectionSelector_1, Previews_1, Footer_1, AutoGenBlock_1, AddSetup_1, MetaBlock_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function PromptEdit({ parent }) {
        const { original } = Database_1.default.data;
        const editPrompt = (0, store_1.default)(state => state.editPrompt);
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        (0, react_1.useEffect)(() => {
            if (!editPrompt) {
                parent.style.display = "none";
            }
            else {
                parent.style.display = "flex";
            }
        }, [editPrompt ? editPrompt.id : false]);
        if (!editPrompt)
            return React.createElement("div", { "data-iteration": filesIteration });
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide", "data-iteration": filesIteration, style: {
                    justifyContent: "space-around",
                } },
                React.createElement("div", { className: "PBE_promptEditTitle" }, editPrompt.id),
                React.createElement(CollectionSelector_1.default, null)),
            React.createElement("div", { className: "PBE_dataBlock PBE_Scrollbar PBE_windowContent", style: {
                    width: "100%",
                } },
                React.createElement("div", { className: "PBE_contentPanel" },
                    (Object.keys(original).length > 1) &&
                        React.createElement(CollectionAction_1.default, null),
                    React.createElement(TagsBlock_1.default, null),
                    React.createElement(CategoriesBlock_1.default, null),
                    React.createElement(AutoGenBlock_1.default, null),
                    React.createElement(AddSetup_1.default, null),
                    React.createElement(Previews_1.default, { prompt: editPrompt })),
                React.createElement("div", { className: "PBE_contentPanel" },
                    React.createElement(MetaBlock_1.default, null))),
            React.createElement(Footer_1.default, null)));
    }
    exports["default"] = PromptEdit;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptEdit/mount.tsx":
/*!************************************************!*\
  !*** ./client/components/PromptEdit/mount.tsx ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/PromptEdit/index.tsx"), __webpack_require__(/*! ./events/onClose */ "./client/components/PromptEdit/events/onClose.ts"), __webpack_require__(/*! client/staticStore */ "./client/staticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1, onClose_1, staticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper }) {
        const promptEdit = document.createElement("div");
        promptEdit.className = "PBE_promptEdit PBE_generalWindow";
        promptEdit.id = "PBE_promptEdit";
        promptEdit.style.zIndex = "202";
        promptEdit.style.display = "none";
        wrapper.appendChild(promptEdit);
        promptEdit.addEventListener("mouseenter", () => {
            staticStore_1.default.onClose = onClose_1.default;
        });
        const root = (0, client_1.createRoot)(promptEdit);
        root.render(React.createElement(index_1.default, { parent: promptEdit }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/GroupItem.tsx":
/*!****************************************************!*\
  !*** ./client/components/PromptItem/GroupItem.tsx ***!
  \****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ./events/onDragStart */ "./client/components/PromptItem/events/onDragStart.ts"), __webpack_require__(/*! ./events/onDragEnter */ "./client/components/PromptItem/events/onDragEnter.ts"), __webpack_require__(/*! ./events/onDragLeave */ "./client/components/PromptItem/events/onDragLeave.ts"), __webpack_require__(/*! ./events/onDrop */ "./client/components/PromptItem/events/onDrop.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Config_1, const_1, ActivePrompts_1, onDragStart_1, onDragEnter_1, onDragLeave_1, onDrop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function GroupItem({ children, group, index, noWrap = false, allowMove = false, onClick, onWheel }) {
        const { cardHeight = 100 } = Config_1.default.getConfig();
        return (React.createElement("div", { className: group.folded ? "PBE_promptsGroup PBE_promptsGroupFolded" : "PBE_promptsGroup", style: {
                flexWrap: noWrap ? "nowrap" : "wrap",
            } },
            React.createElement("div", { className: "PBE_groupHead", "data-id": group.groupId, "data-index": index, "data-group": group.parentGroup, "data-isgroup": "true", style: { height: cardHeight + "px" }, onClick: onClick, onWheel: onWheel, draggable: allowMove, onDragStart: allowMove ? onDragStart_1.default : undefined, onDragOver: allowMove ? (e => e.preventDefault()) : undefined, onDragEnter: allowMove ? onDragEnter_1.default : undefined, onDragLeave: allowMove ? onDragLeave_1.default : undefined, onDrop: allowMove ? onDrop_1.default : undefined },
                group.folded ? ActivePrompts_1.default.makeGroupKey(group) : "",
                (group.weight && group.weight !== const_1.DEFAULT_PROMPT_WEIGHT) ?
                    React.createElement("div", { className: "PBE_groupHeadWeight" }, group.weight)
                    : ""),
            children));
    }
    exports["default"] = GroupItem;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/WeightContainer.tsx":
/*!**********************************************************!*\
  !*** ./client/components/PromptItem/WeightContainer.tsx ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function WeightContainer({ weight, color }) {
        return (React.createElement("div", { className: "PBE_promptElementWeight", style: { color } }, weight));
    }
    exports["default"] = WeightContainer;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/events/DnDInfo.ts":
/*!********************************************************!*\
  !*** ./client/components/PromptItem/events/DnDInfo.ts ***!
  \********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.clearDnD = void 0;
    const DnDInfo = {};
    function clearDnD() {
        delete DnDInfo.id;
        delete DnDInfo.index;
        delete DnDInfo.groupId;
    }
    exports.clearDnD = clearDnD;
    exports["default"] = DnDInfo;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/events/onDragEnter.ts":
/*!************************************************************!*\
  !*** ./client/components/PromptItem/events/onDragEnter.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./DnDInfo */ "./client/components/PromptItem/events/DnDInfo.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, DnDInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onDragEnter(e) {
        const target = e.currentTarget;
        e.preventDefault();
        const dragIndex = Number(target.dataset.index);
        let dragGroup = Number(target.dataset.group);
        if (Number.isNaN(dragGroup))
            dragGroup = false;
        const dropIndex = DnDInfo_1.default.index;
        const dropGroup = DnDInfo_1.default.groupId;
        //invalid element
        if (Number.isNaN(dragIndex) || dropIndex === undefined)
            return;
        //is the same element
        if (dragIndex === dropIndex && dragGroup === dropGroup)
            return;
        target.classList.add("PBE_swap");
    }
    exports["default"] = onDragEnter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/events/onDragLeave.ts":
/*!************************************************************!*\
  !*** ./client/components/PromptItem/events/onDragLeave.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onDragLeave(e) {
        const target = e.currentTarget;
        target.classList.remove("PBE_swap");
    }
    exports["default"] = onDragLeave;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/events/onDragStart.ts":
/*!************************************************************!*\
  !*** ./client/components/PromptItem/events/onDragStart.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./DnDInfo */ "./client/components/PromptItem/events/DnDInfo.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, DnDInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onDragStart(e) {
        const target = e.currentTarget;
        let index = Number(target.dataset.index);
        let group = Number(target.dataset.group);
        if (Number.isNaN(index))
            return;
        if (Number.isNaN(group))
            group = false;
        DnDInfo_1.default.index = index;
        DnDInfo_1.default.groupId = group;
        e.dataTransfer.setData("text", index + "");
    }
    exports["default"] = onDragStart;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/events/onDrop.ts":
/*!*******************************************************!*\
  !*** ./client/components/PromptItem/events/onDrop.ts ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./DnDInfo */ "./client/components/PromptItem/events/DnDInfo.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ActivePrompts_1, store_1, DnDInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onDrop(e) {
        const target = e.currentTarget;
        const dragIndex = Number(target.dataset.index);
        let dragGroup = Number(target.dataset.group);
        if (Number.isNaN(dragGroup))
            dragGroup = false;
        const dropIndex = DnDInfo_1.default.index;
        const dropGroup = DnDInfo_1.default.groupId;
        target.classList.remove("PBE_swap");
        (0, DnDInfo_1.clearDnD)();
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) {
            ActivePrompts_1.default.groupPrompts({
                from: { index: dropIndex, groupId: dropGroup },
                to: { index: dragIndex, groupId: dragGroup },
            });
        }
        else {
            ActivePrompts_1.default.movePrompt({
                from: { index: dropIndex, groupId: dropGroup },
                to: { index: dragIndex, groupId: dragGroup },
            });
        }
        (0, store_1.updateCurrentIteration)();
        ActivePrompts_1.default.updateTextArea();
    }
    exports["default"] = onDrop;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/events/onMouseOver.ts":
/*!************************************************************!*\
  !*** ./client/components/PromptItem/events/onMouseOver.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onPromptCardHover(e) {
        const { splashCardWidth = 200, splashCardHeight = 300 } = Config_1.default.getConfig();
        const target = e.currentTarget;
        const splash = target.querySelector(".PBE_promptElementSplash");
        if (!splash)
            return;
        const BIG_CARD_HEIGHT = splashCardHeight;
        splash.style.display = "";
        const position = target.getBoundingClientRect();
        const bottomPosition = position.y + position.height + BIG_CARD_HEIGHT;
        if (bottomPosition < window.innerHeight)
            splash.style.top = position.top + "px";
        else
            splash.style.top = (position.top - position.height - BIG_CARD_HEIGHT) + "px";
        splash.style.left = position.left + "px";
    }
    exports["default"] = onPromptCardHover;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/getSaveName.ts":
/*!*****************************************************!*\
  !*** ./client/components/PromptItem/getSaveName.ts ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getSaveName(promptName) {
        promptName = (0, index_1.replaceAllRegex)(promptName, "\\\\", "");
        promptName = (0, index_1.replaceAllRegex)(promptName, ":", ": ");
        promptName = (0, index_1.replaceAllRegex)(promptName, "_", " ");
        promptName = (0, index_1.replaceAllRegex)(promptName, "{", "");
        promptName = (0, index_1.replaceAllRegex)(promptName, "}", "");
        return promptName;
    }
    exports["default"] = getSaveName;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/getWeightStyle.ts":
/*!********************************************************!*\
  !*** ./client/components/PromptItem/getWeightStyle.ts ***!
  \********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/const */ "./client/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getWeightStyle(weight) {
        if (weight === const_1.DEFAULT_PROMPT_WEIGHT)
            return false;
        let weightStyle = {
            transform: "",
            zIndex: 1,
            color: "",
        };
        if (weight < 1 && weight > 0.6) {
            weightStyle = {
                transform: "scale(0.9)",
                zIndex: 3,
                color: "green",
            };
        }
        else if (weight <= 0.6 && weight > 0.4) {
            weightStyle = {
                transform: "scale(0.8)",
                zIndex: 2,
                color: "blue",
            };
        }
        else if (weight <= 0.4) {
            weightStyle = {
                transform: "scale(0.7)",
                zIndex: 1,
                color: "purple",
            };
        }
        if (weight > 1 && weight <= 1.2) {
            weightStyle = {
                transform: "scale(1.1)",
                zIndex: 4,
                color: "orange",
            };
        }
        else if (weight > 1.2 && weight <= 1.3) {
            weightStyle = {
                transform: "scale(1.2)",
                zIndex: 5,
                color: "orangered",
            };
        }
        else if (weight > 1.3) {
            weightStyle = {
                transform: "scale(1.3)",
                zIndex: 6,
                color: "red",
            };
        }
        return weightStyle;
    }
    exports["default"] = getWeightStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptItem/index.tsx":
/*!************************************************!*\
  !*** ./client/components/PromptItem/index.tsx ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! ./getWeightStyle */ "./client/components/PromptItem/getWeightStyle.ts"), __webpack_require__(/*! ./getSaveName */ "./client/components/PromptItem/getSaveName.ts"), __webpack_require__(/*! ./WeightContainer */ "./client/components/PromptItem/WeightContainer.tsx"), __webpack_require__(/*! ./events/onMouseOver */ "./client/components/PromptItem/events/onMouseOver.ts"), __webpack_require__(/*! ./events/onDragStart */ "./client/components/PromptItem/events/onDragStart.ts"), __webpack_require__(/*! ./events/onDragEnter */ "./client/components/PromptItem/events/onDragEnter.ts"), __webpack_require__(/*! ./events/onDragLeave */ "./client/components/PromptItem/events/onDragLeave.ts"), __webpack_require__(/*! ./events/onDrop */ "./client/components/PromptItem/events/onDrop.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Config_1, const_1, getWeightStyle_1, getSaveName_1, WeightContainer_1, onMouseOver_1, onDragStart_1, onDragEnter_1, onDragLeave_1, onDrop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function PromptItem({ id = "", src, prompt, options = {}, onClick, onDblClick, onWheel }) {
        const { cardWidth = 50, cardHeight = 100, splashCardWidth = 200, splashCardHeight = 300 } = Config_1.default.getConfig();
        const { index = 0, parentGroup = false, isShadowed = false, noSplash = false, showIndex = false, allowMove = false, className } = options;
        const { weight = const_1.DEFAULT_PROMPT_WEIGHT, isExternalNetwork = false, isSyntax = false } = prompt;
        const promptName = isSyntax ? id : (0, getSaveName_1.default)(id);
        const weightStyle = isSyntax ? false : (0, getWeightStyle_1.default)(weight);
        let addClass = ["PBE_promptElement", "PBE_currentElement"];
        if (className)
            addClass.push(className);
        if (isExternalNetwork)
            addClass.push("PBE_externalNetwork");
        if (isShadowed)
            addClass.push("PBE_shadowedElement");
        if (isSyntax)
            addClass.push("PBE_syntaxElement");
        return (React.createElement("div", { key: id, className: addClass.join(" "), style: {
                backgroundImage: src,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                zIndex: weightStyle ? weightStyle.zIndex : "",
                transform: weightStyle ? weightStyle.transform : "",
            }, "data-prompt": id, "data-index": index + "", "data-group": parentGroup !== false ? parentGroup : undefined, "data-issyntax": isSyntax ? "true" : "", onMouseOver: onMouseOver_1.default, onClick: onClick, onDoubleClick: onDblClick, onWheel: onWheel, draggable: allowMove, onDragStart: allowMove ? onDragStart_1.default : undefined, onDragOver: allowMove ? (e => e.preventDefault()) : undefined, onDragEnter: allowMove ? onDragEnter_1.default : undefined, onDragLeave: allowMove ? onDragLeave_1.default : undefined, onDrop: allowMove ? onDrop_1.default : undefined },
            showIndex && React.createElement("div", { className: "PBE_promptElementIndex" }, index),
            weight !== const_1.DEFAULT_PROMPT_WEIGHT &&
                React.createElement(WeightContainer_1.default, { weight: weight, color: weightStyle ? weightStyle.color : "" }),
            promptName,
            (!noSplash && !isSyntax) &&
                React.createElement("div", { className: "PBE_promptElementSplash PBE_currentElement", style: {
                        backgroundImage: src,
                        width: `${splashCardWidth}px`,
                        height: `${splashCardHeight}px`,
                        marginTop: `${cardHeight}px`,
                    } },
                    weight !== const_1.DEFAULT_PROMPT_WEIGHT &&
                        React.createElement(WeightContainer_1.default, { weight: weight, color: weightStyle ? weightStyle.color : "" }),
                    promptName)));
    }
    exports["default"] = React.memo(PromptItem);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/Header.tsx":
/*!***************************************************!*\
  !*** ./client/components/PromptScribe/Header.tsx ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/components/PreviewSave/store */ "./client/components/PreviewSave/store.ts"), __webpack_require__(/*! client/components/ui/ToggleButton */ "./client/components/ui/ToggleButton/index.tsx"), __webpack_require__(/*! ./store */ "./client/components/PromptScribe/store.ts"), __webpack_require__(/*! ./events/onToggleAll */ "./client/components/PromptScribe/events/onToggleAll.ts"), __webpack_require__(/*! ./events/onSelectAll */ "./client/components/PromptScribe/events/onSelectAll.ts"), __webpack_require__(/*! ./events/onAddNewPrompts */ "./client/components/PromptScribe/events/onAddNewPrompts.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1, ToggleButton_1, store_2, onToggleAll_1, onSelectAll_1, onAddNewPrompts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Header() {
        const { data } = Database_1.default;
        const previewCollection = (0, store_1.default)(state => state.previewCollection);
        const newInAllCollections = (0, store_2.default)(state => state.newInAllCollections);
        const JSXCollections = [];
        for (const collectionId in data.original) {
            JSXCollections.push(React.createElement("option", { value: collectionId, key: collectionId }, collectionId));
        }
        return (React.createElement("div", { className: "PBE_newPromptsHeader" },
            React.createElement("button", { className: "PBE_button", style: {
                    marginRight: "10px",
                }, onClick: onToggleAll_1.default }, "Toggle all"),
            React.createElement(ToggleButton_1.default, { name: "All collections", title: "Toggle if only unknown in all collections should be shown or only in the current collection", toggled: newInAllCollections, onChange: toggled => {
                    (0, store_2.setNewInAllCollections)(toggled);
                    (0, onSelectAll_1.default)();
                }, style: {
                    height: "24px",
                } }),
            React.createElement("select", { className: "PBE_generalInput PBE_select", style: {
                    height: "30px",
                }, onChange: e => {
                    (0, store_1.setPreviewCollection)(e.currentTarget.value);
                    (0, onSelectAll_1.default)();
                }, value: previewCollection }, JSXCollections),
            React.createElement("button", { className: "PBE_button", style: {
                    marginLeft: "10px",
                }, onClick: onAddNewPrompts_1.default }, "Add new prompts")));
    }
    exports["default"] = Header;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/UnknownPrompts.tsx":
/*!***********************************************************!*\
  !*** ./client/components/PromptScribe/UnknownPrompts.tsx ***!
  \***********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/components/PreviewSave/store */ "./client/components/PreviewSave/store.ts"), __webpack_require__(/*! ./store */ "./client/components/PromptScribe/store.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/components/PromptItem */ "./client/components/PromptItem/index.tsx"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! ./events/onTogglePrompt */ "./client/components/PromptScribe/events/onTogglePrompt.ts"), __webpack_require__(/*! ./events/onSelectAll */ "./client/components/PromptScribe/events/onSelectAll.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, Database_1, store_1, store_2, ActivePrompts_1, PromptItem_1, const_1, onTogglePrompt_1, onSelectAll_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function UnknownPrompts() {
        const { data } = Database_1.default;
        let database = data.united;
        const previewCollection = (0, store_1.default)(state => state.previewCollection);
        const newInAllCollections = (0, store_2.default)(state => state.newInAllCollections);
        const selectedNewPrompts = (0, store_2.default)(state => state.selectedNewPrompts);
        const uniquePrompts = ActivePrompts_1.default.getUnique();
        (0, react_1.useEffect)(() => {
            (0, onSelectAll_1.default)();
        }, []);
        if (!newInAllCollections && previewCollection && data.original[previewCollection]) {
            database = data.original[previewCollection];
        }
        let unknownPromptsList = [];
        for (const item of uniquePrompts) {
            if (item.isSyntax)
                continue;
            let isKnown = false;
            for (const knownPrompt of database) {
                if (knownPrompt.id.toLowerCase() === item.id.toLowerCase()) {
                    isKnown = true;
                    break;
                }
            }
            if (!isKnown) {
                unknownPromptsList.push(item);
            }
        }
        const JSXUnknownPrompts = [];
        for (let prompt of unknownPromptsList) {
            JSXUnknownPrompts.push(React.createElement(PromptItem_1.default, { key: prompt.id, id: prompt.id, src: const_1.NEW_CARD_GRADIENT, prompt: prompt, options: {
                    className: selectedNewPrompts.includes(prompt.id) ? "PBE_selectedNewElement" : "",
                }, onClick: onTogglePrompt_1.default }));
        }
        return (React.createElement("div", { className: "PBE_dataBlock PBE_Scrollbar PBE_windowContent" }, JSXUnknownPrompts));
    }
    exports["default"] = UnknownPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/events/onAddNewPrompts.ts":
/*!******************************************************************!*\
  !*** ./client/components/PromptScribe/events/onAddNewPrompts.ts ***!
  \******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/components/PreviewSave/store */ "./client/components/PreviewSave/store.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/PromptScribe/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, ActivePrompts_1, store_1, store_2, store_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onAddNewPrompts() {
        const { data } = Database_1.default;
        let { selectedNewPrompts = [] } = store_3.default.getState();
        let { previewCollection } = store_1.default.getState();
        const uniquePrompts = ActivePrompts_1.default.getUnique();
        if (!previewCollection)
            return;
        const targetCollection = data.original[previewCollection];
        if (!targetCollection)
            return;
        let newPrompts = false;
        for (const prompt of uniquePrompts) {
            if (!selectedNewPrompts.includes(prompt.id))
                continue;
            const known = targetCollection.some(item => item.id === prompt.id);
            if (!known) {
                if (!newPrompts)
                    newPrompts = true;
                const targetItem = { id: prompt.id, tags: [], category: [] };
                if (prompt.isExternalNetwork)
                    targetItem.isExternalNetwork = true;
                targetCollection.push(targetItem);
                //removing from the selected
                selectedNewPrompts = selectedNewPrompts.filter(item => item !== prompt.id);
            }
        }
        if (!newPrompts)
            return;
        Database_1.default.saveJSONData(previewCollection);
        Database_1.default.updateMixedList();
        (0, store_3.setSelectedNewPrompts)(selectedNewPrompts);
        (0, store_2.updateFilesIteration)();
    }
    exports["default"] = onAddNewPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/events/onClose.ts":
/*!**********************************************************!*\
  !*** ./client/components/PromptScribe/events/onClose.ts ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/PromptScribe/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onClose() {
        (0, store_1.setShowPromptScribe)(false);
        (0, store_2.setSelectedNewPrompts)([]);
    }
    exports["default"] = onClose;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/events/onSelectAll.ts":
/*!**************************************************************!*\
  !*** ./client/components/PromptScribe/events/onSelectAll.ts ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/components/PreviewSave/store */ "./client/components/PreviewSave/store.ts"), __webpack_require__(/*! ../store */ "./client/components/PromptScribe/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, ActivePrompts_1, store_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onSelectAll() {
        const { data } = Database_1.default;
        let database = data.united;
        const uniquePrompts = ActivePrompts_1.default.getUnique();
        const { newInAllCollections } = store_2.default.getState();
        const { previewCollection } = store_1.default.getState();
        let selectedNewPrompts = [];
        if (!newInAllCollections && previewCollection && data.original[previewCollection]) {
            database = data.original[previewCollection];
        }
        for (const item of uniquePrompts) {
            if (item.isSyntax)
                continue;
            let isKnown = false;
            for (const knownPrompt of database) {
                if (knownPrompt.id.toLowerCase() === item.id.toLowerCase()) {
                    isKnown = true;
                    break;
                }
            }
            if (!isKnown)
                selectedNewPrompts.push(item.id);
        }
        (0, store_2.setSelectedNewPrompts)(selectedNewPrompts);
    }
    exports["default"] = onSelectAll;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/events/onToggleAll.ts":
/*!**************************************************************!*\
  !*** ./client/components/PromptScribe/events/onToggleAll.ts ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/PromptScribe/store.ts"), __webpack_require__(/*! ./onSelectAll */ "./client/components/PromptScribe/events/onSelectAll.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, onSelectAll_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onToggleAll() {
        const selectedNewPrompts = store_1.default.getState().selectedNewPrompts;
        if (!selectedNewPrompts.length) {
            (0, onSelectAll_1.default)();
            return;
        }
        (0, store_1.setSelectedNewPrompts)([]);
    }
    exports["default"] = onToggleAll;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/events/onTogglePrompt.ts":
/*!*****************************************************************!*\
  !*** ./client/components/PromptScribe/events/onTogglePrompt.ts ***!
  \*****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/PromptScribe/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onTogglePrompt(e) {
        const target = e.currentTarget;
        const id = target.dataset.prompt;
        if (!id)
            return;
        let selectedNewPrompts = store_1.default.getState().selectedNewPrompts;
        if (selectedNewPrompts.includes(id)) {
            selectedNewPrompts = selectedNewPrompts.filter(item => item !== id);
        }
        else {
            selectedNewPrompts.push(id);
        }
        (0, store_1.setSelectedNewPrompts)([...selectedNewPrompts]);
    }
    exports["default"] = onTogglePrompt;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/index.tsx":
/*!**************************************************!*\
  !*** ./client/components/PromptScribe/index.tsx ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./mount */ "./client/components/PromptScribe/mount.tsx"), __webpack_require__(/*! ./Header */ "./client/components/PromptScribe/Header.tsx"), __webpack_require__(/*! ./UnknownPrompts */ "./client/components/PromptScribe/UnknownPrompts.tsx"), __webpack_require__(/*! ./events/onClose */ "./client/components/PromptScribe/events/onClose.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, mount_1, Header_1, UnknownPrompts_1, onClose_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.mount = void 0;
    exports.mount = mount_1.default;
    function PromptScribe({ parent }) {
        const showPromptScribe = (0, store_1.default)(state => state.showPromptScribe);
        (0, react_1.useEffect)(() => {
            if (!showPromptScribe) {
                parent.style.display = "none";
            }
            else {
                parent.style.display = "flex";
            }
        }, [showPromptScribe]);
        if (!showPromptScribe)
            return React.createElement("div", null);
        return (React.createElement(React.Fragment, null,
            React.createElement(Header_1.default, null),
            React.createElement(UnknownPrompts_1.default, null),
            React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide" },
                React.createElement("button", { className: "PBE_button", onClick: onClose_1.default }, "Close"))));
    }
    exports["default"] = PromptScribe;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/mount.tsx":
/*!**************************************************!*\
  !*** ./client/components/PromptScribe/mount.tsx ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! client/staticStore */ "./client/staticStore.ts"), __webpack_require__(/*! ./index */ "./client/components/PromptScribe/index.tsx"), __webpack_require__(/*! ./events/onClose */ "./client/components/PromptScribe/events/onClose.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, staticStore_1, index_1, onClose_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper }) {
        const promptScribe = document.createElement("div");
        promptScribe.className = "PBE_generalWindow PBE_promptScribe";
        promptScribe.id = "PBE_promptScribe";
        promptScribe.style.display = "none";
        wrapper.appendChild(promptScribe);
        promptScribe.addEventListener("mouseenter", () => {
            staticStore_1.default.onClose = onClose_1.default;
        });
        const root = (0, client_1.createRoot)(promptScribe);
        root.render(React.createElement(index_1.default, { parent: promptScribe }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptScribe/store.ts":
/*!*************************************************!*\
  !*** ./client/components/PromptScribe/store.ts ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.setSelectedNewPrompts = exports.setNewInAllCollections = exports.iterateStore = void 0;
    const promptScribeStore = (0, zustand_1.create)((set) => ({
        iterate: 0,
        newInAllCollections: true,
        selectedNewPrompts: [],
    }));
    const iterateStore = () => promptScribeStore.setState({ iterate: promptScribeStore.getState().iterate + 1 });
    exports.iterateStore = iterateStore;
    const setNewInAllCollections = (newInAllCollections) => promptScribeStore.setState({ newInAllCollections });
    exports.setNewInAllCollections = setNewInAllCollections;
    const setSelectedNewPrompts = (selectedNewPrompts) => promptScribeStore.setState({ selectedNewPrompts });
    exports.setSelectedNewPrompts = setSelectedNewPrompts;
    exports["default"] = promptScribeStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/ConfigPanel.tsx":
/*!*******************************************************!*\
  !*** ./client/components/PromptTools/ConfigPanel.tsx ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./store */ "./client/components/PromptTools/store.ts"), __webpack_require__(/*! client/components/ui/ToggleButton */ "./client/components/ui/ToggleButton/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, ToggleButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ConfigPanel() {
        const showAll = (0, store_1.default)(state => state.showAll);
        const replaceMode = (0, store_1.default)(state => state.replaceMode);
        const simByCategory = (0, store_1.default)(state => state.simByCategory);
        const simByName = (0, store_1.default)(state => state.simByName);
        const simByTags = (0, store_1.default)(state => state.simByTags);
        return (React.createElement("div", { className: "PBE_List PBE_toolsSetup" },
            React.createElement("fieldset", { className: "PBE_fieldset" },
                React.createElement("legend", null, "Setup"),
                React.createElement(ToggleButton_1.default, { name: "Show All", toggled: showAll, onChange: store_1.setShowAll }),
                React.createElement(ToggleButton_1.default, { name: "Replace mode", toggled: replaceMode, onChange: store_1.setReplaceMode })),
            React.createElement("fieldset", { className: "PBE_fieldset" },
                React.createElement("legend", null, "Similarity by:"),
                React.createElement(ToggleButton_1.default, { name: "Tags", toggled: simByTags, onChange: store_1.setSimByTags }),
                React.createElement(ToggleButton_1.default, { name: "Category", toggled: simByCategory, onChange: store_1.setSimByCategory }),
                React.createElement(ToggleButton_1.default, { name: "Name", toggled: simByName, onChange: store_1.setSimByName }))));
    }
    exports["default"] = ConfigPanel;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/FiltersCurrent.tsx":
/*!**********************************************************!*\
  !*** ./client/components/PromptTools/FiltersCurrent.tsx ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../ui/PromptsSimpleFilter */ "./client/components/ui/PromptsSimpleFilter/index.tsx"), __webpack_require__(/*! ./store */ "./client/components/PromptTools/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, PromptsSimpleFilter_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function FiltersCurrent() {
        const filtersCurrent = (0, store_1.default)(state => state.filtersCurrent);
        return (React.createElement("div", { className: "PBE_dataBlock PBE_toolsFilter" },
            React.createElement(PromptsSimpleFilter_1.default, { filters: filtersCurrent, onUpdate: store_1.iterateStore })));
    }
    exports["default"] = FiltersCurrent;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/FiltersPossible.tsx":
/*!***********************************************************!*\
  !*** ./client/components/PromptTools/FiltersPossible.tsx ***!
  \***********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../ui/PromptsSimpleFilter */ "./client/components/ui/PromptsSimpleFilter/index.tsx"), __webpack_require__(/*! ./store */ "./client/components/PromptTools/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, PromptsSimpleFilter_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function FiltersPossible() {
        const filtersPossible = (0, store_1.default)(state => state.filtersPossible);
        return (React.createElement("div", { className: "PBE_dataBlock PBE_toolsFilter" },
            React.createElement(PromptsSimpleFilter_1.default, { filters: filtersPossible, onUpdate: store_1.iterateStore })));
    }
    exports["default"] = FiltersPossible;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/PromptsCurrent.tsx":
/*!**********************************************************!*\
  !*** ./client/components/PromptTools/PromptsCurrent.tsx ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/components/PromptsList */ "./client/components/PromptsList/index.tsx"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ./events/horizontalScroll */ "./client/components/PromptTools/events/horizontalScroll.ts"), __webpack_require__(/*! ./store */ "./client/components/PromptTools/store.ts"), __webpack_require__(/*! client/utils */ "./client/utils/index.ts"), __webpack_require__(/*! ./ConfigPanel */ "./client/components/PromptTools/ConfigPanel.tsx"), __webpack_require__(/*! ./events/onChangeSelected */ "./client/components/PromptTools/events/onChangeSelected.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, PromptsList_1, store_1, ActivePrompts_1, horizontalScroll_1, store_2, utils_1, ConfigPanel_1, onChangeSelected_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function PromptsCurrent() {
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        const currentIteration = (0, store_1.default)(state => state.currentIteration);
        const filtersCurrent = (0, store_2.default)(state => state.filtersCurrent);
        const iterate = (0, store_2.default)(state => state.iterate);
        const activePrompts = (0, utils_1.clone)(ActivePrompts_1.default.getCurrentPrompts());
        return (React.createElement("div", { className: "PBE_dataBlock PBE_toolsHeader" },
            React.createElement("div", { className: "PBE_windowCurrentList PBE_Scrollbar", onWheel: horizontalScroll_1.default },
                React.createElement(PromptsList_1.default, { iteration: currentIteration + filesIteration + iterate, filterSimple: filtersCurrent, prompts: activePrompts, allowMove: false, onClick: onChangeSelected_1.default, onWheel: undefined, onDblClick: undefined })),
            React.createElement(ConfigPanel_1.default, null)));
    }
    exports["default"] = PromptsCurrent;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/PromptsPossible.tsx":
/*!***********************************************************!*\
  !*** ./client/components/PromptTools/PromptsPossible.tsx ***!
  \***********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/components/PromptItem */ "./client/components/PromptItem/index.tsx"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./store */ "./client/components/PromptTools/store.ts"), __webpack_require__(/*! ./events/onSelectNew */ "./client/components/PromptTools/events/onSelectNew.ts"), __webpack_require__(/*! ./utils/sortPrompts */ "./client/components/PromptTools/utils/sortPrompts.ts"), __webpack_require__(/*! ./utils/getPossible */ "./client/components/PromptTools/utils/getPossible.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, ActivePrompts_1, PromptItem_1, store_1, store_2, onSelectNew_1, sortPrompts_1, getPossible_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function PromptsPossible({ index, groupId }) {
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        const filterCollection = (0, store_1.default)(state => state.filterCollection);
        const selectedPrompt = (0, store_1.default)(state => state.selectedPrompt);
        const iterate = (0, store_2.default)(state => state.iterate);
        const filtersPossible = (0, store_2.default)(state => state.filtersPossible);
        const showAll = (0, store_2.default)(state => state.showAll);
        const simByCategory = (0, store_2.default)(state => state.simByCategory);
        const simByName = (0, store_2.default)(state => state.simByName);
        const simByTags = (0, store_2.default)(state => state.simByTags);
        const { sorting = "sim" } = filtersPossible;
        const uniquePrompts = ActivePrompts_1.default.getUniqueIds();
        const targetPrompt = ActivePrompts_1.default.getPromptByIndex(index, groupId);
        if (!targetPrompt || !targetPrompt.id)
            return;
        const possiblePrompts = [];
        const addedIds = [];
        (0, getPossible_1.default)({
            targetPrompt, possiblePrompts, filtersPossible,
            showAll, simByTags, simByCategory, simByName,
        });
        (0, sortPrompts_1.default)({ sorting, possiblePrompts });
        const JSXPossiblePrompts = [];
        possiblePrompts.forEach((promptItem, index) => {
            if (addedIds.includes(promptItem.id))
                return;
            const isShadowed = uniquePrompts.includes(promptItem.id);
            addedIds.push(promptItem.id);
            const imageSrc = Database_1.default.getPromptPreviewURL({ prompt: promptItem.id, filesIteration, collectionId: filterCollection });
            let key = `${index}_${promptItem.id}`;
            JSXPossiblePrompts.push(React.createElement(PromptItem_1.default, { key: key, id: promptItem.id, src: imageSrc, prompt: promptItem, options: {
                    isShadowed,
                }, onClick: onSelectNew_1.default }));
        });
        return (React.createElement("div", { className: "PBE_dataBlock PBE_Scrollbar PBE_windowContent", "data-iterate": iterate, "data-selected": selectedPrompt }, JSXPossiblePrompts));
    }
    exports["default"] = PromptsPossible;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/events/horizontalScroll.ts":
/*!******************************************************************!*\
  !*** ./client/components/PromptTools/events/horizontalScroll.ts ***!
  \******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function horizontalScroll(e) {
        const target = e.currentTarget;
        if (!e.deltaY)
            return;
        target.scrollLeft += e.deltaY + e.deltaX;
        e.preventDefault();
    }
    exports["default"] = horizontalScroll;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/events/onChangeSelected.ts":
/*!******************************************************************!*\
  !*** ./client/components/PromptTools/events/onChangeSelected.ts ***!
  \******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, Database_1, ActivePrompts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onChangeSelected(e) {
        const { data } = Database_1.default;
        const { united, original } = data;
        const { readonly } = Database_1.default.meta;
        const target = e.currentTarget;
        const { editPromptIndex: index, editPromptGroup: groupId } = store_1.default.getState();
        if (index === undefined)
            return;
        const clickPrompt = target.dataset.prompt;
        const newIndex = Number(target.dataset.index);
        let newGroup = Number(target.dataset.group);
        if (Number.isNaN(newGroup))
            newGroup = false;
        const targetPrompt = united.find(item => item.id === clickPrompt);
        if (!targetPrompt)
            return;
        if (!readonly && e.shiftKey) {
            if (targetPrompt) {
                const targetItem = united.find(item => item.id === targetPrompt.id);
                if (!targetItem)
                    return false;
                if (!targetItem.collections)
                    return false;
                if (!targetItem.collections[0])
                    return false;
                let collection = original[targetItem.collections[0]];
                if (!collection)
                    return false;
                const originalItem = collection.find(item => item.id === targetPrompt.id);
                if (!originalItem)
                    return false;
                (0, store_1.setEditPrompt)(JSON.parse(JSON.stringify(originalItem)));
                (0, store_1.setEditTargetCollection)(targetItem.collections[0]);
            }
            return;
        }
        if (e.metaKey || e.ctrlKey) { //remove prompt
            if (Number.isNaN(newIndex))
                return;
            ActivePrompts_1.default.removePrompt(newIndex, newGroup);
            (0, store_1.updateCurrentIteration)();
            ActivePrompts_1.default.updateTextArea();
            return;
        }
        else { //select new prompt
            if (index === newIndex && groupId === newGroup)
                return; //same prompt
            (0, store_1.setEditPromptGroup)(newGroup);
            (0, store_1.setEditPromptIndex)(newIndex);
            (0, store_1.setSelectedPrompt)(targetPrompt.id);
            (0, store_1.updateCurrentIteration)();
        }
    }
    exports["default"] = onChangeSelected;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/events/onSelectNew.ts":
/*!*************************************************************!*\
  !*** ./client/components/PromptTools/events/onSelectNew.ts ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../store */ "./client/components/PromptTools/store.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, store_2, const_1, ActivePrompts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onSelectNew(e) {
        const target = e.currentTarget;
        const { data } = Database_1.default;
        const { united, original } = data;
        const { readonly } = Database_1.default.meta;
        const { editPromptIndex: index, editPromptGroup: groupId } = store_1.default.getState();
        const { replaceMode } = store_2.default.getState();
        const clickPrompt = target.dataset.prompt;
        if (index === false || !clickPrompt)
            return;
        const targetPrompt = united.find(item => item.id === clickPrompt);
        if (!targetPrompt)
            return;
        if (!readonly && e.shiftKey) {
            if (targetPrompt) {
                const targetItem = united.find(item => item.id === targetPrompt.id);
                if (!targetItem)
                    return false;
                if (!targetItem.collections)
                    return false;
                if (!targetItem.collections[0])
                    return false;
                let collection = original[targetItem.collections[0]];
                if (!collection)
                    return false;
                const originalItem = collection.find(item => item.id === targetPrompt.id);
                if (!originalItem)
                    return false;
                (0, store_1.setEditPrompt)(JSON.parse(JSON.stringify(originalItem)));
                (0, store_1.setEditTargetCollection)(targetItem.collections[0]);
            }
            return;
        }
        const newItem = {
            id: clickPrompt,
            weight: const_1.DEFAULT_PROMPT_WEIGHT,
            isExternalNetwork: targetPrompt.isExternalNetwork,
        };
        let action = "add";
        if (replaceMode)
            action = e.altKey ? "add" : "replace";
        else
            action = e.altKey ? "replace" : "add";
        if (action === "add")
            ActivePrompts_1.default.insertPrompt(newItem, index + 1, groupId);
        else
            ActivePrompts_1.default.replacePrompt(newItem, index, groupId);
        (0, store_1.setSelectedPrompt)(targetPrompt.id);
        ActivePrompts_1.default.updateTextArea();
        (0, store_1.updateCurrentIteration)();
    }
    exports["default"] = onSelectNew;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/index.tsx":
/*!*************************************************!*\
  !*** ./client/components/PromptTools/index.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./mount */ "./client/components/PromptTools/mount.tsx"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ./FiltersCurrent */ "./client/components/PromptTools/FiltersCurrent.tsx"), __webpack_require__(/*! ./FiltersPossible */ "./client/components/PromptTools/FiltersPossible.tsx"), __webpack_require__(/*! ./PromptsPossible */ "./client/components/PromptTools/PromptsPossible.tsx"), __webpack_require__(/*! ./PromptsCurrent */ "./client/components/PromptTools/PromptsCurrent.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, mount_1, ActivePrompts_1, Database_1, FiltersCurrent_1, FiltersPossible_1, PromptsPossible_1, PromptsCurrent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.mount = void 0;
    exports.mount = mount_1.default;
    function PromptTools({ parent }) {
        const showPromptTools = (0, store_1.default)(state => state.showPromptTools);
        const index = (0, store_1.default)(state => state.editPromptIndex);
        const groupId = (0, store_1.default)(state => state.editPromptGroup);
        (0, react_1.useEffect)(() => {
            if (!showPromptTools) {
                parent.style.display = "none";
            }
            else {
                parent.style.display = "flex";
            }
        }, [showPromptTools]);
        if (!showPromptTools || index === false)
            return React.createElement("div", null);
        const targetPrompt = ActivePrompts_1.default.getPromptByIndex(index, groupId);
        if (!targetPrompt || !targetPrompt.id)
            return React.createElement("div", null);
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "PBE_toolsBackImage", style: {
                    backgroundImage: Database_1.default.getPromptPreviewURL({ prompt: targetPrompt.id }),
                } }),
            React.createElement(FiltersCurrent_1.default, null),
            React.createElement(PromptsCurrent_1.default, null),
            React.createElement(FiltersPossible_1.default, null),
            React.createElement(PromptsPossible_1.default, { index: index, groupId: groupId }),
            React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide", style: { zIndex: 1 } },
                React.createElement("button", { className: "PBE_button", onClick: () => (0, store_1.setShowPromptTools)(false) }, "Close"))));
    }
    exports["default"] = PromptTools;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/mount.tsx":
/*!*************************************************!*\
  !*** ./client/components/PromptTools/mount.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/PromptTools/index.tsx"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/staticStore */ "./client/staticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1, store_1, staticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper }) {
        const promptTools = document.createElement("div");
        promptTools.className = "PBE_generalWindow PBE_promptTools";
        promptTools.id = "PBE_promptTools";
        promptTools.style.zIndex = "200";
        promptTools.style.display = "none";
        wrapper.appendChild(promptTools);
        promptTools.addEventListener("mouseenter", () => {
            staticStore_1.default.onClose = () => (0, store_1.setShowPromptTools)(false);
        });
        const root = (0, client_1.createRoot)(promptTools);
        root.render(React.createElement(index_1.default, { parent: promptTools }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/store.ts":
/*!************************************************!*\
  !*** ./client/components/PromptTools/store.ts ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.setSimByName = exports.setSimByCategory = exports.setSimByTags = exports.setReplaceMode = exports.setShowAll = exports.setFiltersPossible = exports.setFiltersCurrent = exports.iterateStore = void 0;
    const promptToolsStore = (0, zustand_1.create)((set) => ({
        iterate: 0,
        filtersCurrent: {},
        filtersPossible: {},
        showAll: false,
        replaceMode: true,
        simByTags: true,
        simByCategory: true,
        simByName: true,
    }));
    const iterateStore = () => promptToolsStore.setState({ iterate: promptToolsStore.getState().iterate + 1 });
    exports.iterateStore = iterateStore;
    const setFiltersCurrent = (filtersCurrent) => promptToolsStore.setState({ filtersCurrent });
    exports.setFiltersCurrent = setFiltersCurrent;
    const setFiltersPossible = (filtersPossible) => promptToolsStore.setState({ filtersPossible });
    exports.setFiltersPossible = setFiltersPossible;
    const setShowAll = (showAll) => promptToolsStore.setState({ showAll });
    exports.setShowAll = setShowAll;
    const setReplaceMode = (replaceMode) => promptToolsStore.setState({ replaceMode });
    exports.setReplaceMode = setReplaceMode;
    const setSimByTags = (simByTags) => promptToolsStore.setState({ simByTags });
    exports.setSimByTags = setSimByTags;
    const setSimByCategory = (simByCategory) => promptToolsStore.setState({ simByCategory });
    exports.setSimByCategory = setSimByCategory;
    const setSimByName = (simByName) => promptToolsStore.setState({ simByName });
    exports.setSimByName = setSimByName;
    exports["default"] = promptToolsStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/utils/getPossible.ts":
/*!************************************************************!*\
  !*** ./client/components/PromptTools/utils/getPossible.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/utils */ "./client/utils/index.ts"), __webpack_require__(/*! client/components/ui/PromptsSimpleFilter */ "./client/components/ui/PromptsSimpleFilter/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, Config_1, utils_1, PromptsSimpleFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getPossible({ targetPrompt, possiblePrompts, filtersPossible, showAll, simByTags, simByCategory, simByName, }) {
        const { data } = Database_1.default;
        const { united } = data;
        const { maxCardsShown = 1000 } = Config_1.default.getConfig();
        const nameArr = targetPrompt.id.split(" ");
        let targetTags = [];
        let targetCategories = [];
        let targetNameWords = (0, utils_1.replaceAllRegex)(targetPrompt.id.toLowerCase(), "_", " ").split(" ");
        let shownItems = 0;
        const targetPromptSource = united.find(item => item.id === targetPrompt.id);
        if (targetPromptSource) {
            targetTags = targetPromptSource.tags || [];
            targetCategories = targetPromptSource.category || [];
        }
        for (const index in united) {
            const item = united[index];
            if (shownItems > maxCardsShown)
                break;
            const { id, tags, category } = item;
            if (!(0, PromptsSimpleFilter_1.checkFilter)(id, filtersPossible))
                continue;
            //similarity index based on the same tags, categories and words used in the prompt name
            let simIndex = 0;
            if (id === targetPrompt.id)
                continue;
            let nameWords = (0, utils_1.replaceAllRegex)(id.toLowerCase(), "_", " ").split(" ");
            if (simByTags)
                targetTags.forEach(tagItem => { if (tags.includes(tagItem))
                    simIndex++; });
            if (simByCategory)
                targetCategories.forEach(catItem => { if (category.includes(catItem))
                    simIndex++; });
            if (simByName)
                targetNameWords.forEach(wordItem => { if (nameWords.includes(wordItem))
                    simIndex++; });
            if (showAll) {
                possiblePrompts.push(Object.assign(Object.assign({}, item), { simIndex }));
                shownItems++;
                continue;
            }
            if (simByTags && targetTags.length) {
                targetTags.some(targetTag => {
                    if (tags.includes(targetTag)) {
                        possiblePrompts.push(Object.assign(Object.assign({}, item), { simIndex }));
                        shownItems++;
                        return true;
                    }
                });
            }
            if (simByCategory && targetCategories.length) {
                targetCategories.some(targetCategory => {
                    if (category.includes(targetCategory)) {
                        possiblePrompts.push(Object.assign(Object.assign({}, item), { simIndex }));
                        shownItems++;
                        return true;
                    }
                });
            }
            if (simByName) {
                const itemNameArr = id.split(" ");
                wordLoop: for (const word of nameArr) {
                    for (const itemWord of itemNameArr) {
                        if (itemWord.toLowerCase().includes(word.toLowerCase())) {
                            possiblePrompts.push(Object.assign(Object.assign({}, item), { simIndex }));
                            shownItems++;
                            break wordLoop;
                        }
                    }
                }
            }
        }
        ;
    }
    exports["default"] = getPossible;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTools/utils/sortPrompts.ts":
/*!************************************************************!*\
  !*** ./client/components/PromptTools/utils/sortPrompts.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function sortPrompts({ sorting, possiblePrompts }) {
        switch (sorting) {
            case "__none": break;
            case "alph":
                //sorting possible prompts alphabetically
                possiblePrompts.sort((A, B) => {
                    if (A.id.toLowerCase() < B.id.toLowerCase())
                        return -1;
                    if (A.id.toLowerCase() > B.id.toLowerCase())
                        return 1;
                    return 0;
                });
                break;
            case "alphReversed":
                //sorting possible prompts alphabetically in reverse orderd
                possiblePrompts.sort((A, B) => {
                    if (A.id.toLowerCase() < B.id.toLowerCase())
                        return 1;
                    if (A.id.toLowerCase() > B.id.toLowerCase())
                        return -1;
                    return 0;
                });
                break;
            default:
            case "sim":
                //sorting possible prompts based on their similarity to the selected prompt
                possiblePrompts.sort((A, B) => {
                    if (A.simIndex < B.simIndex)
                        return 1;
                    if (A.simIndex > B.simIndex)
                        return -1;
                    if (A.id.toLowerCase() < B.id.toLowerCase())
                        return -1;
                    if (A.id.toLowerCase() > B.id.toLowerCase())
                        return 1;
                    return 0;
                });
        }
    }
    exports["default"] = sortPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/ShowHints.tsx":
/*!*******************************************************!*\
  !*** ./client/components/PromptTooltip/ShowHints.tsx ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./events/onClickHint */ "./client/components/PromptTooltip/events/onClickHint.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, onClickHint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ShowHints({ hints = [] }) {
        const JSXHints = [];
        for (let hintItem of hints) {
            const { name, index = 0, isStyle, collection } = hintItem;
            let className = "PBE_hintItem";
            if (index === 0)
                className += " PBE_hintItemSelected";
            JSXHints.push(React.createElement("div", { className: className, key: isStyle ? "__style_" + name : name, onClick: onClickHint_1.default, "data-index": index, "data-id": name, "data-collection": collection, "data-isstyle": isStyle ? "true" : "" }, isStyle ? "Style: " + name : name));
        }
        return JSXHints;
    }
    exports["default"] = ShowHints;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/const.ts":
/*!**************************************************!*\
  !*** ./client/components/PromptTooltip/const.ts ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.STOP_SYMBOLS = exports.MAX_HINTS = void 0;
    exports.MAX_HINTS = 20;
    exports.STOP_SYMBOLS = [",", "(", ")", "<", ">", ":", "|", "{", "}"];
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/events/filterNewPromptsOnly.ts":
/*!************************************************************************!*\
  !*** ./client/components/PromptTooltip/events/filterNewPromptsOnly.ts ***!
  \************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/utils */ "./client/utils/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, utils_1, ActivePrompts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function filterNewPromptsOnly(str) {
        if (!str)
            return "";
        const newStrPromptsArr = [];
        const uniquePrompts = ActivePrompts_1.default.getUnique();
        const newArr = str.split(",");
        for (let prompt of newArr) {
            const newPrompt = (0, utils_1.promptStringToObject)({ prompt });
            if (uniquePrompts.some(item => item.id === newPrompt.id))
                continue;
            newStrPromptsArr.push(prompt);
        }
        return newStrPromptsArr.join(", ");
    }
    exports["default"] = filterNewPromptsOnly;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/events/onApplyHint.ts":
/*!***************************************************************!*\
  !*** ./client/components/PromptTooltip/events/onApplyHint.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/PromptTooltip/store.ts"), __webpack_require__(/*! ../state */ "./client/components/PromptTooltip/state.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ../getContainer */ "./client/components/PromptTooltip/getContainer.ts"), __webpack_require__(/*! ./filterNewPromptsOnly */ "./client/components/PromptTooltip/events/filterNewPromptsOnly.ts"), __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, state_1, Database_1, store_2, DOMCache_1, getContainer_1, filterNewPromptsOnly_1, synchroniseCurrentPrompts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onApplyHint(start, end, newPrompt) {
        const { currentContainer } = store_2.default.getState();
        if (!currentContainer)
            return false;
        const { data } = Database_1.default;
        const { united } = data;
        const targetContainer = DOMCache_1.default.containers[currentContainer];
        if (!targetContainer)
            return false;
        const textArea = targetContainer.textArea;
        if (!textArea)
            return;
        const autoCompleteBox = (0, getContainer_1.default)();
        if (!autoCompleteBox)
            return;
        if (!textArea || !autoCompleteBox)
            return;
        const targetItem = united.find(item => item.id === newPrompt);
        autoCompleteBox.style.display = "none";
        let newValue = "";
        const addAfter = targetItem && targetItem.addAfter ? (0, filterNewPromptsOnly_1.default)(targetItem.addAfter) : "";
        const addStart = targetItem && targetItem.addStart ? (0, filterNewPromptsOnly_1.default)(targetItem.addStart) : "";
        const addEnd = targetItem && targetItem.addEnd ? (0, filterNewPromptsOnly_1.default)(targetItem.addEnd) : "";
        if (targetItem && targetItem.addAtStart) {
            const oldValue = textArea.value.substring(0, start) + textArea.value.substring(end);
            if (targetItem.isExternalNetwork)
                newPrompt = `<${newPrompt}>`;
            if (addAfter)
                newPrompt += ", " + addAfter + ", ";
            newValue += newPrompt;
            if (addStart)
                newValue += addStart + ", ";
            newValue += oldValue;
            if (addEnd)
                newValue += addEnd;
        }
        else {
            const prefix = textArea.value.substring(0, start);
            const postfix = textArea.value.substring(end);
            if (addStart)
                newValue += addStart + ", ";
            if (prefix)
                newValue += prefix + " ";
            if (targetItem) {
                if (targetItem.isExternalNetwork)
                    newPrompt = `<${newPrompt}>`;
                if (addAfter)
                    newPrompt += ", " + addAfter;
                newValue += newPrompt;
            }
            else
                newValue += newPrompt;
            if (postfix)
                newValue += postfix;
            else
                newValue += ", ";
            if (addEnd)
                newValue += addEnd;
        }
        textArea.value = newValue;
        state_1.default.selected = 0;
        (0, synchroniseCurrentPrompts_1.default)(false);
        (0, store_1.setHints)([]);
    }
    exports["default"] = onApplyHint;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/events/onApplyStyleHint.ts":
/*!********************************************************************!*\
  !*** ./client/components/PromptTooltip/events/onApplyStyleHint.ts ***!
  \********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ../store */ "./client/components/PromptTooltip/store.ts"), __webpack_require__(/*! ../state */ "./client/components/PromptTooltip/state.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ../getContainer */ "./client/components/PromptTooltip/getContainer.ts"), __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ActivePrompts_1, store_1, state_1, Database_1, store_2, DOMCache_1, getContainer_1, synchroniseCurrentPrompts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onApplyStyleHint(start, end, style, collection) {
        const { currentContainer } = store_2.default.getState();
        if (!currentContainer)
            return false;
        const { data } = Database_1.default;
        const { styles } = data;
        const targetContainer = DOMCache_1.default.containers[currentContainer];
        if (!targetContainer)
            return false;
        const textArea = targetContainer.textArea;
        if (!textArea)
            return;
        const autoCompleteBox = (0, getContainer_1.default)();
        if (!autoCompleteBox)
            return;
        if (!textArea || !autoCompleteBox)
            return;
        if (!style || !collection)
            return;
        const targetCollection = styles[collection];
        if (!targetCollection)
            return;
        const targetStyle = targetCollection.find(item => item.name === style);
        if (!targetStyle)
            return;
        autoCompleteBox.style.display = "none";
        let newValue = "";
        const prefix = textArea.value.substring(0, start);
        const postfix = textArea.value.substring(end);
        newValue += prefix;
        newValue += postfix;
        textArea.value = newValue;
        state_1.default.selected = 0;
        (0, synchroniseCurrentPrompts_1.default)(false);
        (0, store_1.setHints)([]);
        ActivePrompts_1.default.applyStyle(targetStyle, true, false);
    }
    exports["default"] = onApplyStyleHint;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/events/onCarretPosition.ts":
/*!********************************************************************!*\
  !*** ./client/components/PromptTooltip/events/onCarretPosition.ts ***!
  \********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! ../store */ "./client/components/PromptTooltip/store.ts"), __webpack_require__(/*! client/utils/gradioApp */ "./client/utils/gradioApp.ts"), __webpack_require__(/*! ./updateWindowPosition */ "./client/components/PromptTooltip/events/updateWindowPosition.ts"), __webpack_require__(/*! ../const */ "./client/components/PromptTooltip/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Config_1, store_1, gradioApp_1, updateWindowPosition_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onCarretPosition(e) {
        const target = e.currentTarget;
        const { autocomplitePromptMode = "prompts" } = Config_1.default.getConfig();
        if (autocomplitePromptMode === "off")
            return;
        const doc = (0, gradioApp_1.default)();
        const activeElement = doc.activeElement || document.activeElement;
        const textArea = target;
        const isFocused = activeElement === textArea;
        if (!isFocused) {
            (0, store_1.setWord)("");
            return;
        }
        ;
        const value = textArea.value;
        const caret = textArea.selectionStart;
        let position = caret;
        let word = "";
        let wordStart = caret;
        let wordEnd = caret;
        while (value[position]) {
            if (value[position] && const_1.STOP_SYMBOLS.includes(value[position]))
                break;
            word += value[position];
            position++;
            wordEnd = position;
        }
        position = caret - 1;
        while (value[position]) {
            if (value[position] && const_1.STOP_SYMBOLS.includes(value[position]))
                break;
            word = value[position] + word;
            wordStart = position;
            position--;
        }
        word = word.trim();
        if (!word) {
            (0, store_1.setWord)("");
            return;
        }
        word = word.toLowerCase();
        (0, updateWindowPosition_1.default)();
        (0, store_1.setWord)(word);
        (0, store_1.setEnd)(wordEnd);
        (0, store_1.setStart)(wordStart);
    }
    exports["default"] = onCarretPosition;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/events/onClickHint.ts":
/*!***************************************************************!*\
  !*** ./client/components/PromptTooltip/events/onClickHint.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/PromptTooltip/store.ts"), __webpack_require__(/*! ./onApplyHint */ "./client/components/PromptTooltip/events/onApplyHint.ts"), __webpack_require__(/*! ./onApplyStyleHint */ "./client/components/PromptTooltip/events/onApplyStyleHint.ts"), __webpack_require__(/*! ../store */ "./client/components/PromptTooltip/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, onApplyHint_1, onApplyStyleHint_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onClickHint(e) {
        const target = e.currentTarget;
        if (!target)
            return;
        const name = target.dataset.id;
        if (!name)
            return;
        const collection = target.dataset.collection;
        const { start, end } = store_1.default.getState();
        const isStyle = !!target.dataset.isstyle;
        if (isStyle)
            (0, onApplyStyleHint_1.default)(start, end, name, collection);
        else
            (0, onApplyHint_1.default)(start, end, name);
        (0, store_2.setIsActive)(true);
    }
    exports["default"] = onClickHint;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/events/onHintWindowKey.ts":
/*!*******************************************************************!*\
  !*** ./client/components/PromptTooltip/events/onHintWindowKey.ts ***!
  \*******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/PromptTooltip/store.ts"), __webpack_require__(/*! client/components/PromptTooltip/getContainer */ "./client/components/PromptTooltip/getContainer.ts"), __webpack_require__(/*! ../state */ "./client/components/PromptTooltip/state.ts"), __webpack_require__(/*! ./onApplyHint */ "./client/components/PromptTooltip/events/onApplyHint.ts"), __webpack_require__(/*! ./onApplyStyleHint */ "./client/components/PromptTooltip/events/onApplyStyleHint.ts"), __webpack_require__(/*! ../store */ "./client/components/PromptTooltip/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, getContainer_1, state_1, onApplyHint_1, onApplyStyleHint_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onHintWindowKey(e) {
        const { total = 0 } = state_1.default;
        let { selected = 0 } = state_1.default;
        const tooltipWindow = (0, getContainer_1.default)();
        if (!tooltipWindow)
            return;
        if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13)
            return false;
        if (e.keyCode === 13) {
            const { hints, start, end } = store_1.default.getState();
            const selectedHint = hints[selected];
            if (!selectedHint)
                return false;
            const { name, isStyle = false, collection } = selectedHint;
            if (isStyle)
                (0, onApplyStyleHint_1.default)(start, end, name, collection);
            else
                (0, onApplyHint_1.default)(start, end, name);
            (0, store_2.setIsActive)(true);
            return;
        }
        const isDown = e.keyCode == 40;
        if (isDown)
            selected++;
        else
            selected--;
        if (selected < 0)
            selected = total - 1;
        else if (selected > total - 1)
            selected = 0;
        state_1.default.selected = selected;
        const hints = document.querySelectorAll("#PBE_autocompliteBox .PBE_hintItem");
        hints.forEach(nodeItem => {
            if (nodeItem.dataset.index === selected + "")
                nodeItem.classList.add("PBE_hintItemSelected");
            else
                nodeItem.classList.remove("PBE_hintItemSelected");
        });
        return true;
    }
    exports["default"] = onHintWindowKey;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/events/onTextAreaKeyDown.ts":
/*!*********************************************************************!*\
  !*** ./client/components/PromptTooltip/events/onTextAreaKeyDown.ts ***!
  \*********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! ../store */ "./client/components/PromptTooltip/store.ts"), __webpack_require__(/*! ../getContainer */ "./client/components/PromptTooltip/getContainer.ts"), __webpack_require__(/*! ./onHintWindowKey */ "./client/components/PromptTooltip/events/onHintWindowKey.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Config_1, store_1, getContainer_1, onHintWindowKey_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onKeyDown(e) {
        const { autocomplitePromptMode = "prompts" } = Config_1.default.getConfig();
        if (autocomplitePromptMode === "off")
            return;
        const autoCompleteBox = (0, getContainer_1.default)();
        if (!autoCompleteBox)
            return;
        if (autoCompleteBox.style.display === "none")
            return;
        if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13)
            return;
        const hints = store_1.default.getState().hints;
        if (!hints || !hints.length)
            return;
        (0, onHintWindowKey_1.default)(e);
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
    }
    exports["default"] = onKeyDown;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/events/updateWindowPosition.ts":
/*!************************************************************************!*\
  !*** ./client/components/PromptTooltip/events/updateWindowPosition.ts ***!
  \************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! client/components/PromptTooltip/getContainer */ "./client/components/PromptTooltip/getContainer.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, DOMCache_1, getContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function updateWindowPosition() {
        const { currentContainer } = store_1.default.getState();
        const { textArea } = DOMCache_1.default.containers[currentContainer];
        if (!textArea)
            return;
        const tooltipWindow = (0, getContainer_1.default)();
        if (!tooltipWindow)
            return;
        const caret = textArea.selectionStart;
        const textAreaPosition = textArea.getBoundingClientRect();
        const caretePos = getCaretCoordinates(textArea, caret);
        tooltipWindow.style.bottom = textAreaPosition.height + "px";
        tooltipWindow.style.left = caretePos.left + 10 + "px";
    }
    exports["default"] = updateWindowPosition;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/getContainer.ts":
/*!*********************************************************!*\
  !*** ./client/components/PromptTooltip/getContainer.ts ***!
  \*********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, DOMCache_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getContainer() {
        const { currentContainer } = store_1.default.getState();
        if (!currentContainer)
            return false;
        const targetContainer = DOMCache_1.default.containers[currentContainer];
        if (!targetContainer)
            return false;
        if (targetContainer.tooltipWindow)
            return targetContainer.tooltipWindow;
        const tooltipWindow = document.getElementById("PBE_autocompliteBox");
        if (!tooltipWindow)
            return false;
        targetContainer.tooltipWindow = tooltipWindow;
        return targetContainer.tooltipWindow;
    }
    exports["default"] = getContainer;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/getPossiblePrompts.ts":
/*!***************************************************************!*\
  !*** ./client/components/PromptTooltip/getPossiblePrompts.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getPossiblePrompts(word) {
        const promptsList = Database_1.default.data.united;
        const possiblePrompts = [];
        for (const prompt of promptsList) {
            if (!prompt.id)
                continue;
            if (prompt.id.toLowerCase().includes(word))
                possiblePrompts.push(prompt.id);
        }
        possiblePrompts.sort();
        return possiblePrompts;
    }
    exports["default"] = getPossiblePrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/getPossibleStyles.ts":
/*!**************************************************************!*\
  !*** ./client/components/PromptTooltip/getPossibleStyles.ts ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const MAX_STYLES = 5;
    const IGNORED_COLLECTIONS = ["autogen"];
    function getPossibleStyles(word) {
        const { styles } = Database_1.default.data;
        const possibleStyles = [];
        let addedStyles = 0;
        topLoop: for (const collectionId in styles) {
            if (IGNORED_COLLECTIONS.includes(collectionId))
                continue;
            for (let i = 0; i < styles[collectionId].length; i++) {
                const styleItem = styles[collectionId][i];
                if (!styleItem.name)
                    continue;
                if (styleItem.name.toLowerCase().includes(word)) {
                    possibleStyles.push({ collection: collectionId, name: styleItem.name });
                    addedStyles++;
                }
                if (addedStyles > MAX_STYLES)
                    break topLoop;
            }
        }
        possibleStyles.sort((A, B) => {
            if (A.name > B.name)
                return 1;
            if (A.name < B.name)
                return -1;
            return 0;
        });
        return possibleStyles;
    }
    exports["default"] = getPossibleStyles;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/hooks/useToggleBox.ts":
/*!***************************************************************!*\
  !*** ./client/components/PromptTooltip/hooks/useToggleBox.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ../store */ "./client/components/PromptTooltip/store.ts"), __webpack_require__(/*! ../getContainer */ "./client/components/PromptTooltip/getContainer.ts"), __webpack_require__(/*! ../utils/getHintItems */ "./client/components/PromptTooltip/utils/getHintItems.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, react_1, store_1, getContainer_1, getHintItems_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function useToggleBox(word, isActive) {
        (0, react_1.useEffect)(() => {
            const autoCompleteBox = (0, getContainer_1.default)();
            if (!autoCompleteBox)
                return;
            if (!isActive) {
                autoCompleteBox.style.display = "none";
                return;
            }
            const hints = (0, getHintItems_1.default)({ word });
            (0, store_1.setHints)(hints);
            if (!hints || !hints.length)
                autoCompleteBox.style.display = "none";
            else
                autoCompleteBox.style.display = "";
        }, [word, isActive]);
    }
    exports["default"] = useToggleBox;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/index.tsx":
/*!***************************************************!*\
  !*** ./client/components/PromptTooltip/index.tsx ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./store */ "./client/components/PromptTooltip/store.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! ./state */ "./client/components/PromptTooltip/state.ts"), __webpack_require__(/*! ./ShowHints */ "./client/components/PromptTooltip/ShowHints.tsx"), __webpack_require__(/*! ./hooks/useToggleBox */ "./client/components/PromptTooltip/hooks/useToggleBox.ts"), __webpack_require__(/*! ./utils/initEvents */ "./client/components/PromptTooltip/utils/initEvents.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, react_1, store_1, Config_1, state_1, ShowHints_1, useToggleBox_1, initEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    let initedEvents = false;
    function PromptTooltip({ tabName }) {
        const isActive = (0, store_1.default)(state => state.isActive);
        const word = (0, store_1.default)(state => state.word);
        const hints = (0, store_1.default)(state => state.hints);
        const { autocomplitePromptMode = "prompts" } = Config_1.default.getConfig();
        if (autocomplitePromptMode === "off")
            return [];
        (0, react_1.useEffect)(() => {
            state_1.default.total = hints.length;
        }, [hints.length]);
        if (!initedEvents) {
            if (!(0, initEvents_1.default)())
                return [];
            initedEvents = true;
        }
        (0, useToggleBox_1.default)(word, isActive);
        return (0, ShowHints_1.default)({ hints }) || [];
    }
    exports["default"] = PromptTooltip;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/mount.tsx":
/*!***************************************************!*\
  !*** ./client/components/PromptTooltip/mount.tsx ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/PromptTooltip/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper, tabName }) {
        const promptTooltip = document.createElement("div");
        promptTooltip.className = "PBE_autocompliteBox";
        promptTooltip.id = "PBE_autocompliteBox";
        promptTooltip.style.zIndex = "10";
        wrapper.appendChild(promptTooltip);
        const root = (0, client_1.createRoot)(promptTooltip);
        root.render(React.createElement(index_1.default, { tabName: tabName }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/state.ts":
/*!**************************************************!*\
  !*** ./client/components/PromptTooltip/state.ts ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const state = {
        selected: 0,
        total: 0,
    };
    exports["default"] = state;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/store.ts":
/*!**************************************************!*\
  !*** ./client/components/PromptTooltip/store.ts ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.tooltipStore = exports.setIsActive = exports.setHints = exports.setWord = exports.setEnd = exports.setStart = void 0;
    const tooltipStore = (0, zustand_1.create)((set) => ({
        isActive: false,
        start: 0,
        end: 0,
        word: "",
        selected: 0,
        hints: [],
    }));
    exports.tooltipStore = tooltipStore;
    const setStart = (start) => tooltipStore.setState({ start });
    exports.setStart = setStart;
    const setEnd = (end) => tooltipStore.setState({ end });
    exports.setEnd = setEnd;
    const setWord = (word) => tooltipStore.setState({ word });
    exports.setWord = setWord;
    const setHints = (hints) => tooltipStore.setState({ hints });
    exports.setHints = setHints;
    const setIsActive = (isActive) => tooltipStore.setState({ isActive });
    exports.setIsActive = setIsActive;
    exports["default"] = tooltipStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/utils/getHintItems.ts":
/*!***************************************************************!*\
  !*** ./client/components/PromptTooltip/utils/getHintItems.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ../getPossiblePrompts */ "./client/components/PromptTooltip/getPossiblePrompts.ts"), __webpack_require__(/*! ../getPossibleStyles */ "./client/components/PromptTooltip/getPossibleStyles.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ../const */ "./client/components/PromptTooltip/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, getPossiblePrompts_1, getPossibleStyles_1, Config_1, DOMCache_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getHintItems({ word = "" }) {
        const hints = [];
        if (!word)
            return hints;
        const { currentContainer } = store_1.default.getState();
        if (!currentContainer || !DOMCache_1.default.containers[currentContainer])
            return hints;
        const textArea = DOMCache_1.default.containers[currentContainer].textArea;
        if (!textArea)
            return hints;
        const { autocomplitePromptMode = "prompts" } = Config_1.default.getConfig();
        let currHints = 0;
        if (autocomplitePromptMode === "off")
            return hints;
        const showPrompts = autocomplitePromptMode === "prompts" || autocomplitePromptMode === "all";
        const showStyles = autocomplitePromptMode === "styles" || autocomplitePromptMode === "all";
        const possiblePrompts = showPrompts ? (0, getPossiblePrompts_1.default)(word) : [];
        const possibleStyles = showStyles ? (0, getPossibleStyles_1.default)(word) : [];
        if (showPrompts)
            for (const item of possiblePrompts) {
                if (currHints >= const_1.MAX_HINTS)
                    break;
                hints.push({
                    name: item,
                    index: currHints,
                });
                currHints++;
            }
        if (showStyles)
            for (const item of possibleStyles) {
                if (currHints >= const_1.MAX_HINTS)
                    break;
                hints.push({
                    name: item.name,
                    index: currHints,
                    isStyle: true,
                    collection: item.collection,
                });
                currHints++;
            }
        return hints;
    }
    exports["default"] = getHintItems;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptTooltip/utils/initEvents.ts":
/*!*************************************************************!*\
  !*** ./client/components/PromptTooltip/utils/initEvents.ts ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ../events/onCarretPosition */ "./client/components/PromptTooltip/events/onCarretPosition.ts"), __webpack_require__(/*! ../events/onTextAreaKeyDown */ "./client/components/PromptTooltip/events/onTextAreaKeyDown.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, DOMCache_1, onCarretPosition_1, onTextAreaKeyDown_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function initEvents() {
        const { currentContainer } = store_1.default.getState();
        if (!currentContainer || !DOMCache_1.default.containers[currentContainer])
            return false;
        const textArea = DOMCache_1.default.containers[currentContainer].textArea;
        if (!textArea)
            return false;
        textArea.addEventListener("keydown", onTextAreaKeyDown_1.default);
        textArea.addEventListener("keyup", onCarretPosition_1.default);
        textArea.addEventListener("click", onCarretPosition_1.default);
        return true;
    }
    exports["default"] = initEvents;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptsList/getCards.tsx":
/*!****************************************************!*\
  !*** ./client/components/PromptsList/getCards.tsx ***!
  \****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/components/PromptItem/index */ "./client/components/PromptItem/index.tsx"), __webpack_require__(/*! client/components/PromptItem/GroupItem */ "./client/components/PromptItem/GroupItem.tsx"), __webpack_require__(/*! ./utils/sortPrompts */ "./client/components/PromptsList/utils/sortPrompts.ts"), __webpack_require__(/*! ../ui/PromptsSimpleFilter */ "./client/components/ui/PromptsSimpleFilter/index.tsx"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, index_1, GroupItem_1, sortPrompts_1, PromptsSimpleFilter_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getCards(props) {
        const { prompts, focusOn, filesIteration, filterCollection, allowMove = false, noWrap = false } = props;
        const { filterSimple } = props;
        const { onClick, onDblClick, onWheel } = props;
        const { editPromptGroup, editPromptIndex } = store_1.default.getState();
        const JSXCards = [];
        if (filterSimple === null || filterSimple === void 0 ? void 0 : filterSimple.sorting)
            (0, sortPrompts_1.default)(prompts, filterSimple.sorting);
        for (let index = 0; index < prompts.length; index++) {
            const promptItem = prompts[index];
            const useIndex = promptItem.index !== undefined ? promptItem.index : index;
            if ("groupId" in promptItem) {
                let groupCards;
                if (!promptItem.folded)
                    groupCards = getCards(Object.assign(Object.assign({}, props), { prompts: promptItem.prompts }));
                JSXCards.push(React.createElement(GroupItem_1.default, { key: "group_" + promptItem.groupId, index: useIndex, group: promptItem, noWrap: noWrap, allowMove: allowMove, onClick: onClick, onWheel: onWheel }, groupCards));
                continue;
            }
            //check filters
            if (filterSimple && !(0, PromptsSimpleFilter_1.checkFilter)(promptItem.id, filterSimple))
                continue;
            const { id, parentGroup = false, isSyntax = false } = promptItem;
            let isShadowed = false;
            if (focusOn) {
                isShadowed = true;
                if (useIndex === focusOn.index && parentGroup === focusOn.groupId)
                    isShadowed = false;
            }
            let isSelected = false;
            if (editPromptGroup === parentGroup && editPromptIndex === useIndex)
                isSelected = true;
            const imageSrc = Database_1.default.getPromptPreviewURL({ prompt: promptItem.id, filesIteration, collectionId: filterCollection });
            let key = `${index}_${promptItem.id}`;
            if (promptItem.parentGroup !== false)
                key += `_${promptItem.parentGroup}`;
            JSXCards.push(React.createElement(index_1.default, { key: key, id: promptItem.id, src: imageSrc, prompt: promptItem, options: {
                    index: useIndex,
                    parentGroup,
                    isShadowed,
                    allowMove: isSyntax ? false : allowMove,
                    className: isSelected ? "PBE_selectedCurrentElement" : "",
                }, onClick: isSyntax ? undefined : onClick, onDblClick: isSyntax ? undefined : onDblClick, onWheel: isSyntax ? undefined : onWheel }));
        }
        return JSXCards;
    }
    exports["default"] = getCards;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptsList/index.tsx":
/*!*************************************************!*\
  !*** ./client/components/PromptsList/index.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./getCards */ "./client/components/PromptsList/getCards.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, getCards_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function PromptsList(props) {
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        const filterCollection = (0, store_1.default)(state => state.filterCollection);
        const cards = (0, getCards_1.default)(Object.assign(Object.assign({}, props), { filesIteration, filterCollection }));
        return (React.createElement(React.Fragment, null, cards));
    }
    exports["default"] = PromptsList;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/PromptsList/utils/sortPrompts.ts":
/*!************************************************************!*\
  !*** ./client/components/PromptsList/utils/sortPrompts.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function sortPrompts(prompts, sorting) {
        //store original index
        for (let index = 0; index < prompts.length; index++) {
            const promptItem = prompts[index];
            if ("id" in promptItem)
                promptItem.index = index;
        }
        switch (sorting) {
            case "alph":
                //sorting prompts alphabetically
                prompts.sort((A, B) => {
                    if ("groupId" in A && "groupId" in B)
                        return 0;
                    if ("id" in A && "groupId" in B)
                        return -1;
                    if ("id" in B && "groupId" in A)
                        return 1;
                    if ("id" in A && "id" in B) {
                        if (A.id.toLowerCase() < B.id.toLowerCase())
                            return -1;
                        if (A.id.toLowerCase() > B.id.toLowerCase())
                            return 1;
                    }
                    return 0;
                });
                break;
            case "alphReversed":
                //sorting prompts alphabetically in reverse orderd
                prompts.sort((A, B) => {
                    if ("groupId" in A && "groupId" in B)
                        return 0;
                    if ("id" in A && "groupId" in B)
                        return -1;
                    if ("id" in B && "groupId" in A)
                        return 1;
                    if ("id" in A && "id" in B) {
                        if (A.id.toLowerCase() < B.id.toLowerCase())
                            return 1;
                        if (A.id.toLowerCase() > B.id.toLowerCase())
                            return -1;
                    }
                    return 0;
                });
                break;
            case "weight":
                //sorting prompts based on their weight
                prompts.sort((A, B) => {
                    if ("id" in A && "groupId" in B)
                        return -1;
                    if ("id" in B && "groupId" in A)
                        return 1;
                    if (A.weight < B.weight)
                        return 1;
                    if (A.weight > B.weight)
                        return -1;
                    return 0;
                });
        }
    }
    exports["default"] = sortPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SaveStyle/AddStyle.tsx":
/*!**************************************************!*\
  !*** ./client/components/SaveStyle/AddStyle.tsx ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./store */ "./client/components/SaveStyle/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/components/LoadStyle/Actions/MetaCheckboxes */ "./client/components/LoadStyle/Actions/MetaCheckboxes.tsx"), __webpack_require__(/*! client/components/LoadStyle/Actions/StyleSetup */ "./client/components/LoadStyle/Actions/StyleSetup.tsx"), __webpack_require__(/*! ./events/onSaveStyle */ "./client/components/SaveStyle/events/onSaveStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, Database_1, MetaCheckboxes_1, StyleSetup_1, onSaveStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function AddStyle() {
        const { data } = Database_1.default;
        const JSXCollectionOptions = [];
        const collectionId = (0, store_1.default)(state => state.collectionId);
        const styleName = (0, store_1.default)(state => state.styleName);
        (0, react_1.useEffect)(() => {
            if (!collectionId)
                for (const collectionId in data.styles) {
                    (0, store_1.setCollectionId)(collectionId);
                    break;
                }
        }, []);
        for (const collectionId in data.styles) {
            JSXCollectionOptions.push(React.createElement("option", { value: collectionId, key: collectionId }, collectionId));
        }
        return (React.createElement("div", { className: "PBE_row" },
            React.createElement("div", { className: "PBE_List PBE_stylesSetup" },
                React.createElement("input", { value: styleName, onChange: e => (0, store_1.setStyleName)(e.currentTarget.value), maxLength: 100, className: "PBE_generalInput PBE_newStyleName", placeholder: "Style name", id: "PBE_newStyleName" }),
                React.createElement("div", { className: "PBE_row" },
                    React.createElement("select", { value: collectionId, onChange: e => (0, store_1.setCollectionId)(e.currentTarget.value), className: "PBE_generalInput PBE_select", style: {
                            height: "30px",
                            marginRight: "5px",
                        } }, JSXCollectionOptions),
                    React.createElement("button", { className: "PBE_button", onClick: onSaveStyle_1.default }, "Save as style"))),
            React.createElement(MetaCheckboxes_1.default, null),
            React.createElement(StyleSetup_1.default, null)));
    }
    exports["default"] = AddStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SaveStyle/CurrentPrompts.tsx":
/*!********************************************************!*\
  !*** ./client/components/SaveStyle/CurrentPrompts.tsx ***!
  \********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/components/PromptsList */ "./client/components/PromptsList/index.tsx"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ./store */ "./client/components/SaveStyle/store.ts"), __webpack_require__(/*! client/utils */ "./client/utils/index.ts"), __webpack_require__(/*! ./events/onClickPrompt */ "./client/components/SaveStyle/events/onClickPrompt.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, PromptsList_1, store_1, ActivePrompts_1, store_2, utils_1, onClickPrompt_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function PromptsCurrent() {
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        const currentIteration = (0, store_1.default)(state => state.currentIteration);
        const iterate = (0, store_2.default)(state => state.iterate);
        const activePrompts = (0, utils_1.clone)(ActivePrompts_1.default.getCurrentPrompts());
        return (React.createElement("div", { className: "PBE_dataBlock PBE_Scrollbar PBE_windowContent" },
            React.createElement(PromptsList_1.default, { iteration: currentIteration + filesIteration + iterate, prompts: activePrompts, allowMove: false, onClick: onClickPrompt_1.default })));
    }
    exports["default"] = PromptsCurrent;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SaveStyle/events/onClickPrompt.ts":
/*!*************************************************************!*\
  !*** ./client/components/SaveStyle/events/onClickPrompt.ts ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ActivePrompts_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onClickPrompt(e) {
        const target = e.currentTarget;
        const index = Number(target.dataset.index);
        let group = Number(target.dataset.group);
        if (Number.isNaN(group))
            group = false;
        if (e.ctrlKey || e.metaKey) {
            ActivePrompts_1.default.removePrompt(index, group);
            (0, store_1.updateCurrentIteration)();
            ActivePrompts_1.default.updateTextArea();
            return;
        }
    }
    exports["default"] = onClickPrompt;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SaveStyle/events/onSaveStyle.ts":
/*!***********************************************************!*\
  !*** ./client/components/SaveStyle/events/onSaveStyle.ts ***!
  \***********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/SaveStyle/store.ts"), __webpack_require__(/*! client/utils/getStyle */ "./client/utils/getStyle.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, getStyle_1, store_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onSaveStyle() {
        const { data } = Database_1.default;
        const { styleName, collectionId } = store_1.default.getState();
        if (!styleName || !collectionId)
            return;
        const targetCollection = data.styles[collectionId];
        if (!targetCollection)
            return;
        const newStyle = (0, getStyle_1.default)({ styleName, collectionId });
        if (!newStyle)
            return;
        targetCollection.push(newStyle);
        Database_1.default.updateStyles(collectionId);
        (0, store_2.updateCurrentIteration)();
        (0, store_2.setShowSaveStyle)(false);
    }
    exports["default"] = onSaveStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SaveStyle/index.tsx":
/*!***********************************************!*\
  !*** ./client/components/SaveStyle/index.tsx ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./mount */ "./client/components/SaveStyle/mount.tsx"), __webpack_require__(/*! ./CurrentPrompts */ "./client/components/SaveStyle/CurrentPrompts.tsx"), __webpack_require__(/*! ./AddStyle */ "./client/components/SaveStyle/AddStyle.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, mount_1, CurrentPrompts_1, AddStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.mount = void 0;
    exports.mount = mount_1.default;
    function SaveStyle({ parent }) {
        const showSaveStyle = (0, store_1.default)(state => state.showSaveStyle);
        (0, react_1.useEffect)(() => {
            if (!showSaveStyle) {
                parent.style.display = "none";
            }
            else {
                parent.style.display = "flex";
            }
        }, [showSaveStyle]);
        if (!showSaveStyle)
            return React.createElement("div", null);
        return (React.createElement(React.Fragment, null,
            React.createElement(AddStyle_1.default, null),
            React.createElement(CurrentPrompts_1.default, null),
            React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide" },
                React.createElement("button", { className: "PBE_button", onClick: () => (0, store_1.setShowSaveStyle)(false) }, "Close"))));
    }
    exports["default"] = SaveStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SaveStyle/mount.tsx":
/*!***********************************************!*\
  !*** ./client/components/SaveStyle/mount.tsx ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/staticStore */ "./client/staticStore.ts"), __webpack_require__(/*! ./index */ "./client/components/SaveStyle/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, store_1, staticStore_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper }) {
        const saveStyle = document.createElement("div");
        saveStyle.className = "PBE_generalWindow PBE_stylesWindow";
        saveStyle.id = "PBE_saveStyleWindow";
        saveStyle.style.display = "none";
        wrapper.appendChild(saveStyle);
        saveStyle.addEventListener("mouseenter", () => {
            staticStore_1.default.onClose = () => (0, store_1.setShowSaveStyle)(false);
        });
        const root = (0, client_1.createRoot)(saveStyle);
        root.render(React.createElement(index_1.default, { parent: saveStyle }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SaveStyle/store.ts":
/*!**********************************************!*\
  !*** ./client/components/SaveStyle/store.ts ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.setCollectionId = exports.setStyleName = exports.iterateStore = void 0;
    const saveStyleStore = (0, zustand_1.create)((set) => ({
        iterate: 0,
        styleName: "",
        collectionId: "",
    }));
    const iterateStore = () => saveStyleStore.setState({ iterate: saveStyleStore.getState().iterate + 1 });
    exports.iterateStore = iterateStore;
    const setStyleName = (styleName) => saveStyleStore.setState({ styleName });
    exports.setStyleName = setStyleName;
    const setCollectionId = (collectionId) => saveStyleStore.setState({ collectionId });
    exports.setCollectionId = setCollectionId;
    exports["default"] = saveStyleStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SetupWindow/CreateNew.tsx":
/*!*****************************************************!*\
  !*** ./client/components/SetupWindow/CreateNew.tsx ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./store */ "./client/components/SetupWindow/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function CreateNew() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "PBE_row PBE_setupWindowTopBlock" },
                React.createElement("button", { className: "PBE_button", onClick: e => {
                        (0, store_1.setMode)("prompts");
                        (0, store_1.setColName)("");
                    } }, "New prompts collection"),
                React.createElement("button", { className: "PBE_button", onClick: e => {
                        (0, store_1.setMode)("styles");
                        (0, store_1.setColName)("");
                    } }, "New styles collection")),
            React.createElement("div", { className: "PBE_windowContent PBE_Scrollbar" })));
    }
    exports["default"] = CreateNew;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SetupWindow/NewCollection.tsx":
/*!*********************************************************!*\
  !*** ./client/components/SetupWindow/NewCollection.tsx ***!
  \*********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./store */ "./client/components/SetupWindow/store.ts"), __webpack_require__(/*! client/types/collection */ "./client/types/collection.ts"), __webpack_require__(/*! ./events/onChangeName */ "./client/components/SetupWindow/events/onChangeName.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, collection_1, onChangeName_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function NewCollection({ isStyles = false }) {
        const colName = (0, store_1.default)(state => state.colName);
        const colType = (0, store_1.default)(state => state.colType);
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "PBE_row PBE_setupWindowTopBlock" }, isStyles ?
                "New styles collection"
                :
                    "New prompts collection"),
            React.createElement("div", { className: "PBE_windowContent PBE_Scrollbar" },
                React.createElement("div", { className: "PBE_rowBlock", style: {
                        maxWidth: "none",
                    } },
                    React.createElement("div", null, "Collection name"),
                    React.createElement("input", { maxLength: 100, className: "PBE_generalInput PBE_input PBE_newCollectionName", type: "text", value: colName, onChange: onChangeName_1.default })),
                React.createElement("div", { className: "PBE_rowBlock", style: {
                        maxWidth: "none",
                    } },
                    React.createElement("div", null, "Store format"),
                    React.createElement("select", { className: "PBE_generalInput PBE_select PBE_newCollectionFormat", value: colType, onChange: e => (0, store_1.setColType)(e.currentTarget.value) },
                        React.createElement("option", { value: collection_1.CollectionFormat.SHORT }, "Short"),
                        React.createElement("option", { value: collection_1.CollectionFormat.EXPANDED }, "Expanded"))))));
    }
    exports["default"] = NewCollection;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SetupWindow/events/onChangeName.ts":
/*!**************************************************************!*\
  !*** ./client/components/SetupWindow/events/onChangeName.ts ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/utils */ "./client/utils/index.ts"), __webpack_require__(/*! ../store */ "./client/components/SetupWindow/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, utils_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onChangeName(e) {
        const target = e.currentTarget;
        let value = target.value;
        if (!value)
            return;
        value = (0, utils_1.makeFileNameSafe)(value);
        (0, store_1.setColName)(value);
    }
    exports["default"] = onChangeName;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SetupWindow/events/onCreate.ts":
/*!**********************************************************!*\
  !*** ./client/components/SetupWindow/events/onCreate.ts ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/SetupWindow/store.ts"), __webpack_require__(/*! client/utils */ "./client/utils/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onCrate() {
        let { colName } = store_1.default.getState();
        const { colType, mode } = store_1.default.getState();
        if (mode === "main")
            return;
        if (!colName || !colType)
            return;
        colName = (0, utils_1.makeFileNameSafe)(colName);
        if (mode === "prompts")
            Database_1.default.createNewCollection(colName, colType);
        else if (mode === "styles")
            Database_1.default.createNewStylesCollection(colName, colType);
        (0, store_1.setMode)("main");
        (0, store_1.setColName)("");
    }
    exports["default"] = onCrate;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SetupWindow/index.tsx":
/*!*************************************************!*\
  !*** ./client/components/SetupWindow/index.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./store */ "./client/components/SetupWindow/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ./CreateNew */ "./client/components/SetupWindow/CreateNew.tsx"), __webpack_require__(/*! ./NewCollection */ "./client/components/SetupWindow/NewCollection.tsx"), __webpack_require__(/*! ./events/onCreate */ "./client/components/SetupWindow/events/onCreate.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, store_2, Database_1, CreateNew_1, NewCollection_1, onCreate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function SetupWindow({ parent }) {
        const { readonly } = Database_1.default.meta;
        const showSetupWindow = (0, store_1.default)(state => state.showSetupWindow);
        const mode = (0, store_2.default)(state => state.mode);
        (0, react_1.useEffect)(() => {
            if (!showSetupWindow) {
                parent.style.display = "none";
            }
            else {
                parent.style.display = "flex";
            }
        }, [showSetupWindow]);
        if (!showSetupWindow)
            return React.createElement("div", null);
        return (React.createElement(React.Fragment, null,
            (mode === "main" && readonly === false) && React.createElement(CreateNew_1.default, null),
            mode === "prompts" && React.createElement(NewCollection_1.default, null),
            mode === "styles" && React.createElement(NewCollection_1.default, { isStyles: true }),
            React.createElement("div", { className: "PBE_setupWindowStatus PBE_row" },
                "version: ",
                Database_1.default.meta.version,
                React.createElement("a", { target: '_blank', href: 'https://github.com/AlpacaInTheNight/PromptsBrowser' }, "Project Page")),
            React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide" },
                mode === "main" &&
                    React.createElement("button", { className: "PBE_button", onClick: () => (0, store_1.setShowSetupWindowe)(false) }, "Close"),
                mode !== "main" &&
                    React.createElement("button", { className: "PBE_button", onClick: onCreate_1.default, style: {
                            marginRight: "10px",
                        } }, "Create"),
                mode !== "main" &&
                    React.createElement("button", { className: "PBE_button PBE_buttonCancel", onClick: () => (0, store_2.setMode)("main") }, "Cancel"))));
    }
    exports["default"] = SetupWindow;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SetupWindow/mount.tsx":
/*!*************************************************!*\
  !*** ./client/components/SetupWindow/mount.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/staticStore */ "./client/staticStore.ts"), __webpack_require__(/*! ./index */ "./client/components/SetupWindow/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, store_1, staticStore_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper }) {
        const setupWindow = document.createElement("div");
        setupWindow.className = "PBE_setupWindow PBE_generalWindow";
        setupWindow.style.display = "none";
        setupWindow.style.zIndex = "200";
        wrapper.appendChild(setupWindow);
        setupWindow.addEventListener("mouseenter", () => {
            staticStore_1.default.onClose = () => (0, store_1.setShowSetupWindowe)(false);
        });
        const root = (0, client_1.createRoot)(setupWindow);
        root.render(React.createElement(index_1.default, { parent: setupWindow }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/SetupWindow/store.ts":
/*!************************************************!*\
  !*** ./client/components/SetupWindow/store.ts ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js"), __webpack_require__(/*! client/types/collection */ "./client/types/collection.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1, collection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.setColType = exports.setColName = exports.setMode = exports.iterateStore = void 0;
    const setupWindowStore = (0, zustand_1.create)((set) => ({
        iterate: 0,
        colName: "",
        colType: collection_1.CollectionFormat.SHORT,
        mode: "main",
    }));
    const iterateStore = () => setupWindowStore.setState({ iterate: setupWindowStore.getState().iterate + 1 });
    exports.iterateStore = iterateStore;
    const setMode = (mode) => setupWindowStore.setState({ mode });
    exports.setMode = setMode;
    const setColName = (colName) => setupWindowStore.setState({ colName });
    exports.setColName = setColName;
    const setColType = (colType) => setupWindowStore.setState({ colType });
    exports.setColType = setColType;
    exports["default"] = setupWindowStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/StyleEdit/Footer.tsx":
/*!************************************************!*\
  !*** ./client/components/StyleEdit/Footer.tsx ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./events/onSaveStyle */ "./client/components/StyleEdit/events/onSaveStyle.ts"), __webpack_require__(/*! ./events/onClose */ "./client/components/StyleEdit/events/onClose.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, onSaveStyle_1, onClose_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function Footer() {
        return (React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide", style: {
                justifyContent: "space-around",
            } },
            React.createElement("button", { className: "PBE_button PBE_buttonCancel", onClick: onClose_1.default }, "Cancel"),
            React.createElement("button", { className: "PBE_button", onClick: onSaveStyle_1.default }, "Save")));
    }
    exports["default"] = Footer;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/StyleEdit/MetaBlock.tsx":
/*!***************************************************!*\
  !*** ./client/components/StyleEdit/MetaBlock.tsx ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/components/ui/InputRow */ "./client/components/ui/InputRow/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, InputRow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function MetaBlock() {
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const { editStyle } = store_1.default.getState();
        return (React.createElement(React.Fragment, null,
            React.createElement(InputRow_1.default, { type: "number", label: "Width", iterate: iterate, value: editStyle.width || 0, nonSpecified: editStyle.width === undefined, onUpdate: value => {
                    editStyle.width = Number(value);
                    setIterate(iterate + 1);
                } }),
            React.createElement(InputRow_1.default, { type: "number", label: "Height", iterate: iterate, value: editStyle.height || 0, nonSpecified: editStyle.height === undefined, onUpdate: value => {
                    editStyle.height = Number(value);
                    setIterate(iterate + 1);
                } }),
            React.createElement(InputRow_1.default, { type: "number", label: "CFG", iterate: iterate, value: editStyle.cfg || 0, nonSpecified: editStyle.cfg === undefined, onUpdate: value => {
                    let cfg = Number(value);
                    if (cfg <= 0)
                        cfg = 1;
                    if (cfg > 30)
                        cfg = 30;
                    editStyle.cfg = cfg;
                    setIterate(iterate + 1);
                } }),
            React.createElement(InputRow_1.default, { type: "number", label: "Steps", iterate: iterate, value: editStyle.steps || 0, nonSpecified: editStyle.steps === undefined, onUpdate: value => {
                    let steps = Number(value);
                    if (steps <= 0)
                        steps = 1;
                    if (steps > 150)
                        steps = 150;
                    editStyle.steps = steps;
                    setIterate(iterate + 1);
                } }),
            React.createElement(InputRow_1.default, { type: "number", label: "Seed", iterate: iterate, value: editStyle.seed || 0, nonSpecified: editStyle.seed === undefined, onUpdate: seed => {
                    editStyle.seed = Number(seed);
                    setIterate(iterate + 1);
                } })));
    }
    exports["default"] = MetaBlock;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/StyleEdit/PromptsBlock.tsx":
/*!******************************************************!*\
  !*** ./client/components/StyleEdit/PromptsBlock.tsx ***!
  \******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/components/PromptsList */ "./client/components/PromptsList/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, PromptsList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function PromptsBlock() {
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const { editStyle } = store_1.default.getState();
        if (!editStyle)
            return React.createElement("div", { style: { display: "none" } });
        const { positive, negative = "" } = editStyle;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "PBE_stylesCurrentList PBE_Scrollbar", style: {
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignContent: "flex-start",
                } }, (positive && positive.length !== 0) &&
                React.createElement(PromptsList_1.default, { prompts: positive, allowMove: false, noWrap: false })),
            React.createElement("textarea", { "data-iterate": iterate, id: "PBE_commentArea", className: "PBE_Textarea PBE_Scrollbar", value: negative, onChange: e => {
                    editStyle.negative = e.currentTarget.value;
                    setIterate(iterate + 1);
                } })));
    }
    exports["default"] = PromptsBlock;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/StyleEdit/events/onClose.ts":
/*!*******************************************************!*\
  !*** ./client/components/StyleEdit/events/onClose.ts ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onClose() {
        (0, store_1.setEditStyle)(undefined);
    }
    exports["default"] = onClose;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/StyleEdit/events/onSaveStyle.ts":
/*!***********************************************************!*\
  !*** ./client/components/StyleEdit/events/onSaveStyle.ts ***!
  \***********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onSaveStyle() {
        const { editStyle, editTargetCollection } = store_1.default.getState();
        const { readonly } = Database_1.default.meta;
        const { data } = Database_1.default;
        if (readonly || !data.styles)
            return;
        if (!editStyle || !editTargetCollection)
            return;
        const targetCollection = data.styles[editTargetCollection];
        if (!targetCollection)
            return;
        const targetIndex = targetCollection.findIndex(styleItem => styleItem.name === editStyle.name);
        if (targetIndex === -1)
            return;
        targetCollection[targetIndex] = editStyle;
        Database_1.default.updateStyles(editTargetCollection);
        (0, store_1.setEditStyle)(undefined);
        (0, store_1.setEditTargetCollection)(undefined);
    }
    exports["default"] = onSaveStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/StyleEdit/index.tsx":
/*!***********************************************!*\
  !*** ./client/components/StyleEdit/index.tsx ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./PromptsBlock */ "./client/components/StyleEdit/PromptsBlock.tsx"), __webpack_require__(/*! ./MetaBlock */ "./client/components/StyleEdit/MetaBlock.tsx"), __webpack_require__(/*! ./Footer */ "./client/components/StyleEdit/Footer.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, store_1, PromptsBlock_1, MetaBlock_1, Footer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function StyleEdit({ parent }) {
        const editStyle = (0, store_1.default)(state => state.editStyle);
        const filesIteration = (0, store_1.default)(state => state.filesIteration);
        (0, react_1.useEffect)(() => {
            if (!editStyle) {
                parent.style.display = "none";
            }
            else {
                parent.style.display = "flex";
            }
        }, [editStyle ? editStyle.name : false]);
        if (!editStyle)
            return React.createElement("div", { "data-iteration": filesIteration });
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "PBE_rowBlock PBE_rowBlock_wide", "data-iteration": filesIteration, style: {
                    justifyContent: "space-around",
                } },
                React.createElement("div", { className: "PBE_promptEditTitle" }, editStyle.name)),
            React.createElement("div", { className: "PBE_dataBlock PBE_Scrollbar PBE_windowContent", style: {
                    width: "100%",
                } },
                React.createElement("div", { className: "PBE_contentPanel", style: { width: "40%" } },
                    React.createElement(MetaBlock_1.default, null)),
                React.createElement("div", { className: "PBE_contentPanel", style: { width: "40%" } },
                    React.createElement(PromptsBlock_1.default, null))),
            React.createElement(Footer_1.default, null)));
    }
    exports["default"] = StyleEdit;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/StyleEdit/mount.tsx":
/*!***********************************************!*\
  !*** ./client/components/StyleEdit/mount.tsx ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/StyleEdit/index.tsx"), __webpack_require__(/*! ./events/onClose */ "./client/components/StyleEdit/events/onClose.ts"), __webpack_require__(/*! client/staticStore */ "./client/staticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1, onClose_1, staticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper }) {
        const styleEdit = document.createElement("div");
        styleEdit.className = "PBE_promptEdit PBE_generalWindow";
        styleEdit.id = "PBE_styleEdit";
        styleEdit.style.zIndex = "202";
        styleEdit.style.display = "none";
        wrapper.appendChild(styleEdit);
        styleEdit.addEventListener("mouseenter", () => {
            staticStore_1.default.onClose = onClose_1.default;
        });
        const root = (0, client_1.createRoot)(styleEdit);
        root.render(React.createElement(index_1.default, { parent: styleEdit }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/TextareaButtons/index.tsx":
/*!*****************************************************!*\
  !*** ./client/components/TextareaButtons/index.tsx ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./mount */ "./client/components/TextareaButtons/mount.tsx"), __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, store_1, mount_1, synchroniseCurrentPrompts_1, ActivePrompts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.mount = void 0;
    exports.mount = mount_1.default;
    function TextareaButtons({ tabName }) {
        const currentContainer = (0, store_1.default)(state => state.currentContainer);
        const { readonly } = Database_1.default.meta;
        if (currentContainer !== tabName)
            return React.createElement("div", { style: { display: "none" } });
        return (React.createElement(React.Fragment, null,
            React.createElement("button", { className: "PBE_actionButton", onClick: () => (0, store_1.setShowLoadStyle)(true) }, "Styles"),
            readonly !== true &&
                React.createElement("button", { className: "PBE_actionButton", onClick: () => (0, store_1.setShowSaveStyle)(true) }, "Save style"),
            readonly !== true &&
                React.createElement("button", { className: "PBE_actionButton", onClick: () => (0, store_1.setShowPromptScribe)(true) }, "Add Unknown"),
            React.createElement("button", { className: "PBE_actionButton", onClick: () => {
                    (0, synchroniseCurrentPrompts_1.default)(true, true);
                    ActivePrompts_1.default.updateTextArea();
                } }, "Normalize")));
    }
    exports["default"] = TextareaButtons;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/TextareaButtons/mount.tsx":
/*!*****************************************************!*\
  !*** ./client/components/TextareaButtons/mount.tsx ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./index */ "./client/components/TextareaButtons/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ positivePrompts, tabName }) {
        const textareaButtons = document.createElement("div");
        textareaButtons.className = "PBE_textarea_buttons_wrapper";
        positivePrompts.prepend(textareaButtons);
        const root = (0, client_1.createRoot)(textareaButtons);
        root.render(React.createElement(index_1.default, { tabName: tabName }));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/CheckBox/index.tsx":
/*!*************************************************!*\
  !*** ./client/components/ui/CheckBox/index.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function CheckBox({ checked, name, title, reverse = false, onChange }) {
        const inputRef = React.useRef(null);
        return (React.createElement("div", null,
            React.createElement("input", { ref: inputRef, type: "checkbox", checked: checked, onChange: e => {
                    if (inputRef.current)
                        onChange(inputRef.current.checked);
                } }),
            React.createElement("label", { title: title, onClick: e => {
                    if (inputRef.current)
                        onChange(!inputRef.current.checked);
                } }, name)));
    }
    exports["default"] = CheckBox;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/InputRow/index.tsx":
/*!*************************************************!*\
  !*** ./client/components/ui/InputRow/index.tsx ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function InputRow({ type, label, value, iterate, nonSpecified = false, onUpdate }) {
        const style = {
            height: "40px",
        };
        if (nonSpecified) {
            style.opacity = "0.5";
        }
        return (React.createElement("div", { "data-iterate": iterate, className: "PBE_rowBlock", style: style },
            React.createElement("label", null,
                label,
                ":"),
            React.createElement("input", { className: "PBE_generalInput", type: type, value: value, onChange: e => onUpdate(e.currentTarget.value) })));
    }
    exports["default"] = InputRow;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsFilter/ActiveFilters.tsx":
/*!**************************************************************!*\
  !*** ./client/components/ui/PromptsFilter/ActiveFilters.tsx ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./store */ "./client/components/ui/PromptsFilter/store.ts"), __webpack_require__(/*! ./events/onRemoveFilter */ "./client/components/ui/PromptsFilter/events/onRemoveFilter.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, onRemoveFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ActiveFilters({ onChange }) {
        const promptsFilter = (0, store_1.default)(state => state.promptsFilter);
        return (React.createElement("div", { className: "PBE_row", style: { flexWrap: "wrap" } }, promptsFilter.map((filterItem, index) => {
            const { action, type, value } = filterItem;
            const isInclude = action === "include";
            return (React.createElement("div", { key: index, className: "PBE_filterItem" +
                    (isInclude ? "" : " PBE_filterItemNegative") },
                isInclude ? "+" : "-",
                `${type}: ${value}`,
                React.createElement("div", { className: "PBE_filterItemRemove PBE_buttonCancel", "data-index": index, onClick: e => (0, onRemoveFilter_1.default)(e, onChange) }, "\u2715")));
        })));
    }
    exports["default"] = ActiveFilters;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsFilter/AdditionalSetup.tsx":
/*!****************************************************************!*\
  !*** ./client/components/ui/PromptsFilter/AdditionalSetup.tsx ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/components/ui/TagTooltip */ "./client/components/ui/TagTooltip/index.tsx"), __webpack_require__(/*! ./type */ "./client/components/ui/PromptsFilter/type.ts"), __webpack_require__(/*! ./store */ "./client/components/ui/PromptsFilter/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, Database_1, TagTooltip_1, type_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function AdditionalSetup({ type, onSubmit }) {
        const iterate = (0, store_1.default)(state => state.iterate);
        const filterMeta = (0, store_1.default)(state => state.meta);
        const filterCategory = (0, store_1.default)(state => state.category);
        const filterName = (0, store_1.default)(state => state.name);
        const filterTag = (0, store_1.default)(state => state.tag);
        if (type === "meta") {
            return (React.createElement("select", { className: "PBE_generalInput PBE_select PBE_filterMeta", value: filterMeta, onChange: e => (0, store_1.setMeta)(e.currentTarget.value) },
                React.createElement("option", { value: type_1.FilterMeta.PREVIEW }, "Have preview image"),
                React.createElement("option", { value: type_1.FilterMeta.PREVIEW_MODEL }, "Have preview for the model"),
                React.createElement("option", { value: type_1.FilterMeta.CATEGORIES }, "Have categories"),
                React.createElement("option", { value: type_1.FilterMeta.CATEGORIES3 }, "Have at least 3 categories"),
                React.createElement("option", { value: type_1.FilterMeta.TAGS }, "Have tags"),
                React.createElement("option", { value: type_1.FilterMeta.TAGS3 }, "Have at least 3 tags"),
                React.createElement("option", { value: type_1.FilterMeta.COMMENT }, "Have comment"),
                React.createElement("option", { value: type_1.FilterMeta.AUTOGEN }, "Have autogen style"),
                React.createElement("option", { value: type_1.FilterMeta.PNG }, "Is PNG"),
                React.createElement("option", { value: type_1.FilterMeta.JPG }, "Is JPG")));
        }
        if (type === "category") {
            const { data } = Database_1.default;
            const categories = data.categories;
            const JSXOptions = [];
            for (const categoryItem of categories) {
                JSXOptions.push(React.createElement("option", { value: categoryItem, key: categoryItem }, categoryItem));
            }
            return (React.createElement("select", { className: "PBE_generalInput PBE_select PBE_filterCategory", value: filterCategory, onChange: e => (0, store_1.setCategory)(e.currentTarget.value) },
                React.createElement("option", { value: "" }, "All"),
                React.createElement("option", { value: "__none" }, "Uncategorised"),
                JSXOptions));
        }
        if (type === "name") {
            return (React.createElement("input", { className: "PBE_generalInput PBE_input PBE_filterName", value: filterName, onChange: e => (0, store_1.setName)(e.currentTarget.value), onKeyDown: e => {
                    if (onSubmit && e.key === 'Enter')
                        onSubmit();
                } }));
        }
        if (type === "tag") {
            return (React.createElement(TagTooltip_1.default, { iteration: iterate, tags: filterTag.split(","), onUpdate: (tags) => {
                    (0, store_1.setTag)(tags.join(", "));
                }, onSubmit: onSubmit }));
        }
        return (React.createElement("div", null));
    }
    exports["default"] = AdditionalSetup;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsFilter/checkFilter.ts":
/*!***********************************************************!*\
  !*** ./client/components/ui/PromptsFilter/checkFilter.ts ***!
  \***********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/utils/getCheckpoint */ "./client/utils/getCheckpoint.ts"), __webpack_require__(/*! ./type */ "./client/components/ui/PromptsFilter/type.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, getCheckpoint_1, type_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Returns true if prompt passes filter requirements
     * @param {*} prompt
     * @param {*} filter
     * @returns boolean
     */
    function checkFilter(prompt, filter) {
        var _a;
        if (!filter || !filter.length)
            return true; //no filter requirements
        let { id, comment = "", autogen = {} } = prompt;
        if (!id)
            return false; //invalid prompt
        const checkpoint = (0, index_1.makeFileNameSafe)((0, getCheckpoint_1.default)() || "");
        const { tags = [], category = [], previewImage, previews = {} } = prompt;
        let fulfil = false;
        id = id.toLowerCase();
        comment = comment.toLowerCase();
        const haveAutogen = autogen.collection && autogen.style ? true : false;
        for (const filterItem of filter) {
            const { action, type, value } = filterItem;
            const isInclude = action === type_1.FilterAction.INCLUDE;
            fulfil = false;
            if (type === type_1.FilterType.NAME) {
                if (id.includes(value))
                    fulfil = isInclude ? true : false;
                else if (!isInclude)
                    fulfil = true;
            }
            else if (type === type_1.FilterType.CATEGORY) {
                if (value === "__none") {
                    if (!category.length)
                        fulfil = isInclude ? true : false;
                }
                else {
                    if (category.includes(value))
                        fulfil = isInclude ? true : false;
                    else if (!isInclude)
                        fulfil = true;
                }
            }
            else if (type === type_1.FilterType.TAG) {
                if (tags.includes(value))
                    fulfil = isInclude ? true : false;
                else if (!isInclude)
                    fulfil = true;
            }
            else if (type === type_1.FilterType.META) {
                let modelPreview = "";
                if (value === type_1.FilterMeta.PREVIEW || value === type_1.FilterMeta.PNG || value === type_1.FilterMeta.JPG) {
                    if (previews) {
                        for (const modelId in previews) {
                            if ((_a = previews[modelId]) === null || _a === void 0 ? void 0 : _a.file) {
                                modelPreview = previews[modelId].file;
                                break;
                            }
                        }
                    }
                }
                const previewFinal = previewImage ? previewImage : modelPreview;
                if (value === type_1.FilterMeta.PREVIEW)
                    fulfil = isInclude ? !!previewFinal : !previewFinal;
                else if (value === type_1.FilterMeta.PNG)
                    fulfil = isInclude ? previewFinal === "png" : previewFinal !== "png";
                else if (value === type_1.FilterMeta.JPG)
                    fulfil = isInclude ? previewFinal === "jpg" : previewFinal !== "jpg";
                else if (value === type_1.FilterMeta.CATEGORIES)
                    fulfil = isInclude ? !!category.length : !category.length;
                else if (value === type_1.FilterMeta.TAGS)
                    fulfil = isInclude ? !!tags.length : !tags.length;
                else if (value === type_1.FilterMeta.COMMENT)
                    fulfil = isInclude ? !!comment : !comment;
                else if (value === type_1.FilterMeta.AUTOGEN)
                    fulfil = isInclude ? haveAutogen : !haveAutogen;
                else if (value === type_1.FilterMeta.CATEGORIES3)
                    fulfil = isInclude ? category.length >= 3 : category.length < 3;
                else if (value === type_1.FilterMeta.TAGS3)
                    fulfil = isInclude ? tags.length >= 3 : tags.length < 3;
                else if (value === type_1.FilterMeta.PREVIEW_MODEL)
                    fulfil = isInclude ? !!previews[checkpoint] : !previews[checkpoint];
            }
            if (!fulfil)
                return false;
        }
        return true;
    }
    exports["default"] = checkFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsFilter/events/onAddNewFilter.ts":
/*!*********************************************************************!*\
  !*** ./client/components/ui/PromptsFilter/events/onAddNewFilter.ts ***!
  \*********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/ui/PromptsFilter/store.ts"), __webpack_require__(/*! ../type */ "./client/components/ui/PromptsFilter/type.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, type_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onAddNewFilter(onChange) {
        const { promptsFilter, action, type, meta, category, name, tag } = store_1.default.getState();
        let value = "";
        if (type === type_1.FilterType.META) {
            if (!meta)
                return;
            value = meta;
        }
        else if (type === type_1.FilterType.CATEGORY) {
            value = category;
            (0, store_1.setCategory)("");
        }
        else if (type === type_1.FilterType.NAME) {
            if (!name)
                return;
            value = name;
            (0, store_1.setName)("");
        }
        else if (type === type_1.FilterType.TAG) {
            if (!tag)
                return;
            value = tag;
            (0, store_1.setTag)("");
        }
        promptsFilter.push({ action, type, value });
        const newFilters = [...promptsFilter];
        (0, store_1.setPromptsFilter)(newFilters);
        onChange(newFilters);
        (0, store_1.iterateStore)();
    }
    exports["default"] = onAddNewFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsFilter/events/onRemoveFilter.ts":
/*!*********************************************************************!*\
  !*** ./client/components/ui/PromptsFilter/events/onRemoveFilter.ts ***!
  \*********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/ui/PromptsFilter/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onRemoveFilter(e, onChange) {
        const { promptsFilter } = store_1.default.getState();
        const target = e.currentTarget;
        const index = Number(target.dataset.index);
        if (Number.isNaN(index))
            return;
        promptsFilter.splice(index, 1);
        const newFilters = [...promptsFilter];
        (0, store_1.setPromptsFilter)(newFilters);
        onChange(newFilters);
        (0, store_1.iterateStore)();
    }
    exports["default"] = onRemoveFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsFilter/index.tsx":
/*!******************************************************!*\
  !*** ./client/components/ui/PromptsFilter/index.tsx ***!
  \******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./AdditionalSetup */ "./client/components/ui/PromptsFilter/AdditionalSetup.tsx"), __webpack_require__(/*! ./store */ "./client/components/ui/PromptsFilter/store.ts"), __webpack_require__(/*! ./type */ "./client/components/ui/PromptsFilter/type.ts"), __webpack_require__(/*! ./events/onAddNewFilter */ "./client/components/ui/PromptsFilter/events/onAddNewFilter.ts"), __webpack_require__(/*! ./ActiveFilters */ "./client/components/ui/PromptsFilter/ActiveFilters.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, AdditionalSetup_1, store_1, type_1, onAddNewFilter_1, ActiveFilters_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function PromptsFilter({ onChange }) {
        const showAddFilter = (0, store_1.default)(state => state.showAddFilter);
        const action = (0, store_1.default)(state => state.action);
        const type = (0, store_1.default)(state => state.type);
        return (React.createElement("div", { className: "PBE_filtersWrapper" },
            React.createElement(ActiveFilters_1.default, { onChange: onChange }),
            showAddFilter && React.createElement(React.Fragment, null,
                React.createElement("div", { className: "PBE_row PBE_newFilterContainer" },
                    React.createElement("div", { className: "PBE_filterAction", "data-action": action, onClick: () => (0, store_1.setAction)(action === type_1.FilterAction.EXCLUDE ? type_1.FilterAction.INCLUDE : type_1.FilterAction.EXCLUDE) }, action === "include" ? "Include" : "Exclude"),
                    React.createElement("select", { className: "PBE_generalInput PBE_select PBE_filterType", style: { margin: "0 5px" }, value: type, onChange: (e) => (0, store_1.setType)(e.target.value) },
                        React.createElement("option", { value: type_1.FilterType.NAME }, "Name"),
                        React.createElement("option", { value: type_1.FilterType.TAG }, "Tag"),
                        React.createElement("option", { value: type_1.FilterType.CATEGORY }, "Category"),
                        React.createElement("option", { value: type_1.FilterType.META }, "Meta")),
                    React.createElement(AdditionalSetup_1.default, { type: type, onSubmit: () => { (0, onAddNewFilter_1.default)(onChange); } })),
                React.createElement("div", { className: "PBE_filtersAddNew PBE_filtersAddNewButton", onClick: e => (0, onAddNewFilter_1.default)(onChange) }, "\u2713"),
                React.createElement("div", { className: "PBE_filtersAddNew PBE_filtersRemoveNew PBE_buttonCancel", onClick: e => (0, store_1.setShowAddFilter)(false) }, "\u2715")),
            (showAddFilter === false) &&
                React.createElement("div", { className: "PBE_filtersAddNew PBE_filtersAddNewButton", onClick: e => (0, store_1.setShowAddFilter)(true) }, "+")));
    }
    exports["default"] = PromptsFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsFilter/store.ts":
/*!*****************************************************!*\
  !*** ./client/components/ui/PromptsFilter/store.ts ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js"), __webpack_require__(/*! ./type */ "./client/components/ui/PromptsFilter/type.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1, type_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.setPromptsFilter = exports.setTag = exports.setName = exports.setCategory = exports.setMeta = exports.setType = exports.setAction = exports.setShowAddFilter = exports.iterateStore = void 0;
    const promptsFilterStore = (0, zustand_1.create)((set) => ({
        iterate: 0,
        showAddFilter: true,
        action: type_1.FilterAction.INCLUDE,
        type: type_1.FilterType.NAME,
        meta: type_1.FilterMeta.PREVIEW,
        category: "",
        name: "",
        tag: "",
        promptsFilter: [],
    }));
    const iterateStore = () => promptsFilterStore.setState({ iterate: promptsFilterStore.getState().iterate + 1 });
    exports.iterateStore = iterateStore;
    const setShowAddFilter = (showAddFilter) => promptsFilterStore.setState({ showAddFilter });
    exports.setShowAddFilter = setShowAddFilter;
    const setAction = (action) => promptsFilterStore.setState({ action });
    exports.setAction = setAction;
    const setType = (type) => promptsFilterStore.setState({ type });
    exports.setType = setType;
    const setMeta = (meta) => promptsFilterStore.setState({ meta });
    exports.setMeta = setMeta;
    const setCategory = (category) => promptsFilterStore.setState({ category });
    exports.setCategory = setCategory;
    const setName = (name) => promptsFilterStore.setState({ name });
    exports.setName = setName;
    const setTag = (tag) => promptsFilterStore.setState({ tag });
    exports.setTag = setTag;
    const setPromptsFilter = (promptsFilter) => promptsFilterStore.setState({ promptsFilter });
    exports.setPromptsFilter = setPromptsFilter;
    exports["default"] = promptsFilterStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsFilter/type.ts":
/*!****************************************************!*\
  !*** ./client/components/ui/PromptsFilter/type.ts ***!
  \****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.FilterMeta = exports.FilterType = exports.FilterAction = void 0;
    var FilterAction;
    (function (FilterAction) {
        FilterAction["INCLUDE"] = "include";
        FilterAction["EXCLUDE"] = "exclude";
    })(FilterAction = exports.FilterAction || (exports.FilterAction = {}));
    var FilterType;
    (function (FilterType) {
        FilterType["META"] = "meta";
        FilterType["CATEGORY"] = "category";
        FilterType["NAME"] = "name";
        FilterType["TAG"] = "tag";
    })(FilterType = exports.FilterType || (exports.FilterType = {}));
    var FilterMeta;
    (function (FilterMeta) {
        FilterMeta["PREVIEW"] = "preview";
        FilterMeta["PREVIEW_MODEL"] = "previewModel";
        FilterMeta["CATEGORIES"] = "categories";
        FilterMeta["CATEGORIES3"] = "categories3";
        FilterMeta["TAGS"] = "tags";
        FilterMeta["TAGS3"] = "tags3";
        FilterMeta["COMMENT"] = "comment";
        FilterMeta["AUTOGEN"] = "autogen";
        FilterMeta["PNG"] = "png";
        FilterMeta["JPG"] = "jpg";
    })(FilterMeta = exports.FilterMeta || (exports.FilterMeta = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsSimpleFilter/checkFilter.ts":
/*!*****************************************************************!*\
  !*** ./client/components/ui/PromptsSimpleFilter/checkFilter.ts ***!
  \*****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Returns true if prompt passes filters params
     * @param {*} promptId
     * @param {*} filters
     * @returns
     */
    function checkFilter(promptId, filters = {}) {
        if (!promptId)
            return false;
        const { data } = Database_1.default;
        const { unitedList } = data;
        let onlyName = false;
        const { collection = "", category = "", tags = [], name = "" } = filters;
        if (!collection && !category && !name && !tags.length)
            return true;
        if (!collection && !category && !tags.length && name)
            onlyName = true;
        //checkinig name first in order to be able to filter new prompts name not yet in collections.
        //cheking name
        if (name && !promptId.toLowerCase().includes(name))
            return false;
        if (onlyName)
            return true;
        const unitedPrompt = unitedList[promptId];
        //prompt data not found
        if (!unitedPrompt)
            return false;
        //checking collections
        if (collection && !unitedPrompt.collections.includes(collection))
            return false;
        //checking categories
        if (category) {
            if (category === "__none" && unitedPrompt.category.length)
                return false;
            else if (category !== "__none" && !unitedPrompt.category.includes(category))
                return false;
        }
        //checking tags
        if (tags.length) {
            for (const tagItem of tags) {
                if (!unitedPrompt.tags.includes(tagItem))
                    return false;
            }
        }
        return true;
    }
    exports["default"] = checkFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/PromptsSimpleFilter/index.tsx":
/*!************************************************************!*\
  !*** ./client/components/ui/PromptsSimpleFilter/index.tsx ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! ./checkFilter */ "./client/components/ui/PromptsSimpleFilter/checkFilter.ts"), __webpack_require__(/*! client/components/ui/TagTooltip */ "./client/components/ui/TagTooltip/index.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, index_1, checkFilter_1, TagTooltip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.checkFilter = void 0;
    exports.checkFilter = checkFilter_1.default;
    function PromptsSimpleFilter({ filters = {}, onUpdate }) {
        const [iterate, setIterate] = (0, react_1.useState)(0);
        const { data } = index_1.default;
        const { categories, original } = data;
        const { collection = "", category = "", tags = [], name = "", sorting = "", sortingOptions } = filters;
        const JSXCollectionOptions = [];
        for (const collectionId in original) {
            JSXCollectionOptions.push(React.createElement("option", { value: collectionId, key: collectionId }, collectionId));
        }
        const JSXCategoriesOptions = [];
        for (const categoryId of categories) {
            JSXCategoriesOptions.push(React.createElement("option", { value: categoryId, key: categoryId }, categoryId));
        }
        const JSXSortingOptions = [];
        if (sortingOptions) {
            for (const sortOption of sortingOptions) {
                const { id, name } = sortOption;
                JSXCollectionOptions.push(React.createElement("option", { value: id, key: id }, name));
            }
        }
        return (React.createElement("div", { className: "PBE_filtersContainer" },
            React.createElement("select", { className: "PBE_generalInput PBE_select", value: collection, onChange: e => {
                    filters.collection = e.currentTarget.value;
                    setIterate(iterate + 1);
                    onUpdate();
                } },
                React.createElement("option", { value: "" }, "All collections"),
                JSXCollectionOptions),
            React.createElement("select", { className: "PBE_generalInput PBE_select", value: category, onChange: e => {
                    filters.category = e.currentTarget.value;
                    setIterate(iterate + 1);
                    onUpdate();
                } },
                React.createElement("option", { value: "" }, "All categories"),
                React.createElement("option", { value: "__none" }, "Uncategorised"),
                JSXCategoriesOptions),
            React.createElement(TagTooltip_1.default, { tags: tags, onUpdate: newTags => {
                    filters.tags = newTags || [];
                    setIterate(iterate + 1);
                    onUpdate();
                } }),
            React.createElement("input", { className: "PBE_generalInput PBE_input", value: name, type: "text", placeholder: 'by name', onChange: e => {
                    filters.name = e.currentTarget.value.toLowerCase();
                    setIterate(iterate + 1);
                    onUpdate();
                } }),
            sortingOptions &&
                React.createElement("select", { className: "PBE_generalInput PBE_select", value: sorting, onChange: e => {
                        filters.sorting = e.currentTarget.value;
                        setIterate(iterate + 1);
                        onUpdate();
                    } }, JSXSortingOptions)));
    }
    exports["default"] = PromptsSimpleFilter;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/AutocompliteBox.tsx":
/*!*************************************************************!*\
  !*** ./client/components/ui/TagTooltip/AutocompliteBox.tsx ***!
  \*************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./store */ "./client/components/ui/TagTooltip/store.ts"), __webpack_require__(/*! ./events/onClickHint */ "./client/components/ui/TagTooltip/events/onClickHint.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, store_1, onClickHint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function AutocompliteBox() {
        const possibleTags = (0, store_1.default)(state => state.possibleTags);
        const MAX_HINTS = 20;
        let currHints = 0;
        const JSXHints = [];
        for (const tag of possibleTags) {
            if (currHints >= MAX_HINTS)
                break;
            const { value, wordStart, wordEnd } = tag;
            let className = "PBE_hintItem";
            if (currHints === 0)
                className += " PBE_hintItemSelected";
            JSXHints.push(React.createElement("div", { key: value, className: className, "data-index": currHints, "data-start": wordStart + "", "data-end": wordEnd + "", onClick: onClickHint_1.default }, value));
            currHints++;
        }
        return (React.createElement(React.Fragment, null, JSXHints));
    }
    exports["default"] = AutocompliteBox;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/events/onBlur.ts":
/*!**********************************************************!*\
  !*** ./client/components/ui/TagTooltip/events/onBlur.ts ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/ui/TagTooltip/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    let blurTimout = 0;
    function onBlur() {
        const boxContainer = store_1.default.getState().autocompliteBox;
        clearTimeout(blurTimout);
        blurTimout = setTimeout(() => {
            boxContainer.style.display = "none";
        }, 300);
    }
    exports["default"] = onBlur;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/events/onChange.ts":
/*!************************************************************!*\
  !*** ./client/components/ui/TagTooltip/events/onChange.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/ui/TagTooltip/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onChange(value) {
        const onUpdate = store_1.TagTooltipStaticStore.onUpdate;
        if (!onUpdate)
            return;
        let tags = value.split(",").map(item => item.trim());
        //removing empty tags
        tags = tags.filter(item => item);
        onUpdate(tags);
    }
    exports["default"] = onChange;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/events/onClickHint.ts":
/*!***************************************************************!*\
  !*** ./client/components/ui/TagTooltip/events/onClickHint.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../utils/applyHint */ "./client/components/ui/TagTooltip/utils/applyHint.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, applyHint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onClickHint(e) {
        const target = e.currentTarget;
        if (!target)
            return;
        const start = Number(target.dataset.start);
        const end = Number(target.dataset.end);
        const newTag = target.innerText;
        if (Number.isNaN(start) || Number.isNaN(end))
            return;
        (0, applyHint_1.default)({ start, end, newTag });
    }
    exports["default"] = onClickHint;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/events/onHintWindowKey.ts":
/*!*******************************************************************!*\
  !*** ./client/components/ui/TagTooltip/events/onHintWindowKey.ts ***!
  \*******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/ui/TagTooltip/store.ts"), __webpack_require__(/*! ../utils/applyHint */ "./client/components/ui/TagTooltip/utils/applyHint.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, applyHint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onHintWindowKey(e) {
        const autoCompleteBox = store_1.default.getState().autocompliteBox;
        const inputElement = store_1.default.getState().inputElement;
        const { selectedIndex } = store_1.TagTooltipStaticStore;
        if (!autoCompleteBox || !inputElement)
            return false;
        if (autoCompleteBox.style.display === "none")
            return false;
        if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13)
            return false;
        const hintElements = autoCompleteBox.querySelectorAll(".PBE_hintItem");
        if (!hintElements || !hintElements.length)
            return false;
        if (e.keyCode === 13) {
            const selectedHint = autoCompleteBox.querySelector(".PBE_hintItemSelected");
            if (!selectedHint)
                return false;
            const start = Number(selectedHint.dataset.start);
            const end = Number(selectedHint.dataset.end);
            const newTag = selectedHint.innerText;
            if (Number.isNaN(start) || Number.isNaN(end))
                return false;
            (0, applyHint_1.default)({ start, end, newTag });
            return true;
        }
        const isDown = e.keyCode == 40;
        let newSelectedIndex = selectedIndex;
        if (isDown)
            newSelectedIndex++;
        else
            newSelectedIndex--;
        if (newSelectedIndex < 0)
            newSelectedIndex = hintElements.length - 1;
        else if (newSelectedIndex > hintElements.length - 1)
            newSelectedIndex = 0;
        store_1.TagTooltipStaticStore.selectedIndex = newSelectedIndex;
        const hints = document.querySelectorAll("#PBE_autocompliteTags .PBE_hintItem");
        hints.forEach(nodeItem => {
            if (nodeItem.dataset.index === newSelectedIndex + "")
                nodeItem.classList.add("PBE_hintItemSelected");
            else
                nodeItem.classList.remove("PBE_hintItemSelected");
        });
        return true;
    }
    exports["default"] = onHintWindowKey;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/events/processCarretPosition.ts":
/*!*************************************************************************!*\
  !*** ./client/components/ui/TagTooltip/events/processCarretPosition.ts ***!
  \*************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/ui/TagTooltip/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function processCarretPosition(e) {
        const target = e.currentTarget;
        const { knownTags = [] } = store_1.default.getState();
        const MAX_HINTS = 20;
        let currHints = 0;
        const value = target.value;
        const caret = target.selectionStart;
        const stopSymbols = [",", "(", ")", "<", ">", ":"];
        let position = caret;
        let word = "";
        let wordStart = caret;
        let wordEnd = caret;
        while (value[position]) {
            if (value[position] && stopSymbols.includes(value[position]))
                break;
            word += value[position];
            position++;
            wordEnd = position;
        }
        position = caret - 1;
        while (value[position]) {
            if (value[position] && stopSymbols.includes(value[position]))
                break;
            word = value[position] + word;
            wordStart = position;
            position--;
        }
        word = word.trim();
        if (!word) {
            target.dataset.hint = "";
            (0, store_1.setPossibleTags)([]);
            return;
        }
        word = word.toLowerCase();
        const possibleTags = [];
        for (const tag of knownTags) {
            if (currHints >= MAX_HINTS)
                break;
            if (tag.toLowerCase().includes(word)) {
                possibleTags.push({
                    value: tag,
                    wordStart,
                    wordEnd,
                });
                currHints++;
            }
        }
        (0, store_1.setPossibleTags)(possibleTags);
    }
    exports["default"] = processCarretPosition;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/index.tsx":
/*!***************************************************!*\
  !*** ./client/components/ui/TagTooltip/index.tsx ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! ./utils/setBoxPosition */ "./client/components/ui/TagTooltip/utils/setBoxPosition.ts"), __webpack_require__(/*! ./store */ "./client/components/ui/TagTooltip/store.ts"), __webpack_require__(/*! ./events/processCarretPosition */ "./client/components/ui/TagTooltip/events/processCarretPosition.ts"), __webpack_require__(/*! ./utils/updateTagsList */ "./client/components/ui/TagTooltip/utils/updateTagsList.ts"), __webpack_require__(/*! ./events/onChange */ "./client/components/ui/TagTooltip/events/onChange.ts"), __webpack_require__(/*! ./events/onBlur */ "./client/components/ui/TagTooltip/events/onBlur.ts"), __webpack_require__(/*! ./events/onHintWindowKey */ "./client/components/ui/TagTooltip/events/onHintWindowKey.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, react_1, setBoxPosition_1, store_1, processCarretPosition_1, updateTagsList_1, onChange_1, onBlur_1, onHintWindowKey_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function TagTooltip({ tags, iteration = 0, onUpdate, onSubmit }) {
        const boxContainer = store_1.default.getState().autocompliteBox;
        const inputRef = (0, react_1.useRef)(null);
        (0, react_1.useEffect)(() => {
            (0, updateTagsList_1.default)();
            boxContainer.style.display = "none";
            return () => { boxContainer.style.display = "none"; };
        }, []);
        (0, react_1.useEffect)(() => {
            inputRef.current.value = tags.join(", ");
        }, [iteration, inputRef]);
        return (React.createElement("input", { ref: inputRef, className: "PBE_generalInput PBE_input", type: "text", defaultValue: tags.join(", "), placeholder: "tag1, tag2, tag3", onChange: e => {
                boxContainer.style.display = "flex";
                store_1.TagTooltipStaticStore.onUpdate = onUpdate;
                const value = e.currentTarget.value;
                (0, onChange_1.default)(value);
            }, onKeyDown: e => {
                if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
                    const block = (0, onHintWindowKey_1.default)(e);
                    if (block) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                }
                if (!onSubmit)
                    return;
                const { autocompliteBox, possibleTags } = store_1.default.getState();
                if (possibleTags.length && autocompliteBox.style.display !== "none")
                    return;
                if (e.key === 'Enter')
                    onSubmit();
            }, onKeyUp: processCarretPosition_1.default, onFocus: e => {
                store_1.TagTooltipStaticStore.onUpdate = onUpdate;
                (0, store_1.setInputElement)(e.currentTarget);
                (0, processCarretPosition_1.default)(e);
                boxContainer.style.display = "flex";
                (0, setBoxPosition_1.default)(inputRef.current);
            }, onBlur: onBlur_1.default }));
    }
    exports["default"] = TagTooltip;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/mount.tsx":
/*!***************************************************!*\
  !*** ./client/components/ui/TagTooltip/mount.tsx ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js"), __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"), __webpack_require__(/*! ./AutocompliteBox */ "./client/components/ui/TagTooltip/AutocompliteBox.tsx"), __webpack_require__(/*! ./store */ "./client/components/ui/TagTooltip/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React, client_1, AutocompliteBox_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mount({ wrapper }) {
        const autocompliteBox = document.createElement("div");
        autocompliteBox.className = "PBE_autocompliteBox PBE_autocompliteTags";
        autocompliteBox.id = "PBE_autocompliteTags";
        autocompliteBox.style.position = "fixed";
        autocompliteBox.style.display = "none";
        wrapper.appendChild(autocompliteBox);
        (0, store_1.setAutocompliteBox)(autocompliteBox);
        const root = (0, client_1.createRoot)(autocompliteBox);
        root.render(React.createElement(AutocompliteBox_1.default, null));
    }
    exports["default"] = mount;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/store.ts":
/*!**************************************************!*\
  !*** ./client/components/ui/TagTooltip/store.ts ***!
  \**************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.setPossibleTags = exports.setInputElement = exports.setAutocompliteBox = exports.setKnownTags = exports.iterateStore = exports.TagTooltipStaticStore = void 0;
    exports.TagTooltipStaticStore = {
        onUpdate: undefined,
        selectedIndex: 0,
    };
    const tagTooltipStore = (0, zustand_1.create)((set) => ({
        iterate: 0,
        knownTags: [],
        possibleTags: [],
        autocompliteBox: undefined,
        inputElement: undefined,
    }));
    const iterateStore = () => tagTooltipStore.setState({ iterate: tagTooltipStore.getState().iterate + 1 });
    exports.iterateStore = iterateStore;
    const setKnownTags = (knownTags) => tagTooltipStore.setState({ knownTags });
    exports.setKnownTags = setKnownTags;
    const setAutocompliteBox = (autocompliteBox) => tagTooltipStore.setState({ autocompliteBox });
    exports.setAutocompliteBox = setAutocompliteBox;
    const setInputElement = (inputElement) => tagTooltipStore.setState({ inputElement });
    exports.setInputElement = setInputElement;
    const setPossibleTags = (possibleTags) => tagTooltipStore.setState({ possibleTags });
    exports.setPossibleTags = setPossibleTags;
    exports["default"] = tagTooltipStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/utils/applyHint.ts":
/*!************************************************************!*\
  !*** ./client/components/ui/TagTooltip/utils/applyHint.ts ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/ui/TagTooltip/store.ts"), __webpack_require__(/*! ../events/onChange */ "./client/components/ui/TagTooltip/events/onChange.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, onChange_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function applyHint({ newTag, start, end }) {
        const autocompliteBox = store_1.default.getState().autocompliteBox;
        const inputElement = store_1.default.getState().inputElement;
        if (!autocompliteBox || !inputElement)
            return;
        autocompliteBox.style.display = "none";
        inputElement.dataset.hint = "";
        let newValue = "";
        const prefix = inputElement.value.substring(0, start);
        const postfix = inputElement.value.substring(end);
        if (prefix)
            newValue += prefix + " ";
        newValue += newTag;
        if (postfix)
            newValue += postfix;
        inputElement.value = newValue;
        store_1.TagTooltipStaticStore.selectedIndex = 0;
        (0, onChange_1.default)(inputElement.value);
    }
    exports["default"] = applyHint;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/utils/setBoxPosition.ts":
/*!*****************************************************************!*\
  !*** ./client/components/ui/TagTooltip/utils/setBoxPosition.ts ***!
  \*****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../store */ "./client/components/ui/TagTooltip/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function setBoxPosition(inputContainer) {
        const boxContainer = store_1.default.getState().autocompliteBox;
        if (!inputContainer || !boxContainer)
            return;
        const rect = inputContainer.getBoundingClientRect();
        boxContainer.style.top = rect.top + rect.height + "px";
        boxContainer.style.left = rect.left + "px";
        boxContainer.style.zIndex = "1000";
    }
    exports["default"] = setBoxPosition;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/TagTooltip/utils/updateTagsList.ts":
/*!*****************************************************************!*\
  !*** ./client/components/ui/TagTooltip/utils/updateTagsList.ts ***!
  \*****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! ../store */ "./client/components/ui/TagTooltip/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Creates a list of known tags used in the database
     * @returns
     */
    function updateTagsList() {
        const { data } = Database_1.default;
        if (!data || !data.united)
            return;
        const knownTags = [];
        const promptsList = data.united;
        for (const prompt of promptsList) {
            if (!prompt.tags)
                continue;
            for (const tagItem of prompt.tags) {
                if (!knownTags.includes(tagItem))
                    knownTags.push(tagItem);
            }
        }
        knownTags.sort();
        (0, store_1.setKnownTags)(knownTags);
    }
    exports["default"] = updateTagsList;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/components/ui/ToggleButton/index.tsx":
/*!*****************************************************!*\
  !*** ./client/components/ui/ToggleButton/index.tsx ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! react */ "./node_modules/react/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function ToggleButton({ toggled, name, title, style, onChange }) {
        let className = "PBE_toggleButton";
        if (toggled)
            className += " PBE_toggledButton";
        return (React.createElement("div", { title: title, className: className, onClick: () => onChange(!toggled), style: style }, name));
    }
    exports["default"] = ToggleButton;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/const.ts":
/*!*************************!*\
  !*** ./client/const.ts ***!
  \*************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.DEFAULT_CONTAINER_NAME = exports.DEFAULT_CONTAINER_ID = exports.NEW_CARD_GRADIENT = exports.EMPTY_CARD_GRADIENT = exports.PROMPT_WEIGHT_FACTOR = exports.DEFAULT_PROMPT_WEIGHT = void 0;
    const DEFAULT_PROMPT_WEIGHT = 1;
    exports.DEFAULT_PROMPT_WEIGHT = DEFAULT_PROMPT_WEIGHT;
    const PROMPT_WEIGHT_FACTOR = 1.1;
    exports.PROMPT_WEIGHT_FACTOR = PROMPT_WEIGHT_FACTOR;
    const EMPTY_CARD_GRADIENT = "linear-gradient(135deg, rgba(179,220,237,1) 0%,rgba(41,184,229,1) 50%,rgba(188,224,238,1) 100%)";
    exports.EMPTY_CARD_GRADIENT = EMPTY_CARD_GRADIENT;
    const NEW_CARD_GRADIENT = "linear-gradient(135deg, rgba(180,221,180,1) 0%,rgba(131,199,131,1) 17%,rgba(82,177,82,1) 33%,rgba(0,138,0,1) 67%,rgba(0,87,0,1) 83%,rgba(0,36,0,1) 100%)";
    exports.NEW_CARD_GRADIENT = NEW_CARD_GRADIENT;
    const DEFAULT_CONTAINER_ID = "img2Img";
    exports.DEFAULT_CONTAINER_ID = DEFAULT_CONTAINER_ID;
    const DEFAULT_CONTAINER_NAME = "txt2img";
    exports.DEFAULT_CONTAINER_NAME = DEFAULT_CONTAINER_NAME;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/index.ts":
/*!*************************!*\
  !*** ./client/index.ts ***!
  \*************************/
/***/ ((module, exports, __webpack_require__) => {

var __webpack_unused_export__;
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/supportedContainers */ "./client/supportedContainers.ts"), __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/utils/gradioApp */ "./client/utils/gradioApp.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ./Database */ "./client/Database/index.ts"), __webpack_require__(/*! ./main/mountContainer */ "./client/main/mountContainer.ts"), __webpack_require__(/*! ./main/mountGlobal */ "./client/main/mountGlobal.ts"), __webpack_require__(/*! ./main/events/onChangeTab */ "./client/main/events/onChangeTab.ts"), __webpack_require__(/*! ./main/events/onDocumentKey */ "./client/main/events/onDocumentKey.ts"), __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, supportedContainers_1, index_1, gradioApp_1, store_1, DOMCache_1, Database_1, mountContainer_1, mountGlobal_1, onChangeTab_1, onDocumentKey_1, store_2) {
    "use strict";
    __webpack_unused_export__ = ({ value: true });
    let timeoutPBUpdatePrompt = 0;
    function tryToHook(tries = 0) {
        const mainContainer = (0, gradioApp_1.default)();
        if (tries > 100) {
            (0, index_1.log)("No prompt wrapper container found or server did not returned prompts data.");
            return;
        }
        const checkContainer = mainContainer.querySelector("#txt2img_prompt_container");
        if (!checkContainer) {
            timeoutPBUpdatePrompt = setTimeout(() => tryToHook(tries + 1), 1000);
            return;
        }
        DOMCache_1.default.mainContainer = mainContainer;
        //Automatic1111
        let modelCheckpoint = mainContainer.querySelector("#setting_sd_model_checkpoint");
        //Forge
        if (!modelCheckpoint) {
            const forgeModelCheckpoint = mainContainer.querySelector("#quicksettings .model_selection");
            if (forgeModelCheckpoint)
                modelCheckpoint = forgeModelCheckpoint;
        }
        DOMCache_1.default.modelCheckpoint = modelCheckpoint;
        if (DOMCache_1.default.modelCheckpoint) {
            const inputElement = DOMCache_1.default.modelCheckpoint.querySelector("input");
            inputElement === null || inputElement === void 0 ? void 0 : inputElement.addEventListener("blur", store_2.iterateModel);
        }
        const tabsContainer = mainContainer.querySelector("#tabs > div:first-child");
        tabsContainer.removeEventListener("click", onChangeTab_1.default);
        tabsContainer.addEventListener("click", onChangeTab_1.default);
        document.removeEventListener('keyup', onDocumentKey_1.default);
        document.addEventListener('keyup', onDocumentKey_1.default);
        for (const containerId in supportedContainers_1.default)
            (0, mountContainer_1.default)({ containerId, mainContainer });
        (0, mountGlobal_1.default)({ mainContainer });
    }
    document.addEventListener('DOMContentLoaded', function () {
        (0, store_1.loadUIConfig)();
        Database_1.default.load();
        tryToHook();
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/main/addTextAreaEvents.ts":
/*!******************************************!*\
  !*** ./client/main/addTextAreaEvents.ts ***!
  \******************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts/index.ts"), __webpack_require__(/*! client/components/PromptTooltip/store */ "./client/components/PromptTooltip/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, synchroniseCurrentPrompts_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Adds listeners to the main prompt container.
     * @param textArea - HTML text area prompt container
     * @returns
     */
    function addTextAreaEvents(textArea) {
        if (!textArea || textArea.dataset.pbelistenerready)
            return false;
        textArea.dataset.pbelistenerready = "true";
        textArea.removeEventListener("input", () => (0, synchroniseCurrentPrompts_1.default)(true, false)); //TODO: does this line really needed?
        textArea.addEventListener("input", () => (0, synchroniseCurrentPrompts_1.default)(true, false));
        textArea.addEventListener("focus", () => (0, store_1.setIsActive)(true));
        textArea.addEventListener("blur", () => setTimeout(() => (0, store_1.setIsActive)(false), 200));
        return true;
    }
    exports["default"] = addTextAreaEvents;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/main/events/onChangeTab.ts":
/*!*******************************************!*\
  !*** ./client/main/events/onChangeTab.ts ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onChangeTab(e) {
        const target = e.target;
        const tagName = target.tagName.toLowerCase();
        if (tagName !== "button")
            return;
        const tabName = target.innerText.trim();
        if (!tabName)
            return;
        (0, store_1.setCurrentContainer)(tabName.toLowerCase());
    }
    exports["default"] = onChangeTab;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/main/events/onDocumentKey.ts":
/*!*********************************************!*\
  !*** ./client/main/events/onDocumentKey.ts ***!
  \*********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/staticStore */ "./client/staticStore.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, staticStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function onDocumentKey(e) {
        if (e.key !== "Escape")
            return;
        if (staticStore_1.default.onClose) {
            staticStore_1.default.onClose();
            staticStore_1.default.onClose = undefined;
        }
    }
    exports["default"] = onDocumentKey;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/main/mountContainer.ts":
/*!***************************************!*\
  !*** ./client/main/mountContainer.ts ***!
  \***************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/supportedContainers */ "./client/supportedContainers.ts"), __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! client/components/ControlPanel/mount */ "./client/components/ControlPanel/mount.tsx"), __webpack_require__(/*! client/components/KnownPrompts/mount */ "./client/components/KnownPrompts/mount.tsx"), __webpack_require__(/*! client/components/CurrentPrompts/mount */ "./client/components/CurrentPrompts/mount.tsx"), __webpack_require__(/*! client/components/PromptTooltip/mount */ "./client/components/PromptTooltip/mount.tsx"), __webpack_require__(/*! client/components/TextareaButtons/mount */ "./client/components/TextareaButtons/mount.tsx"), __webpack_require__(/*! client/components/PreviewSave/mount */ "./client/components/PreviewSave/mount.tsx"), __webpack_require__(/*! ./addTextAreaEvents */ "./client/main/addTextAreaEvents.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, supportedContainers_1, index_1, store_1, DOMCache_1, mount_1, mount_2, mount_3, mount_4, mount_5, mount_6, addTextAreaEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mountContainer({ containerId, mainContainer }) {
        const store = store_1.default.getState();
        const showViews = store.showViews;
        const container = supportedContainers_1.default[containerId];
        if (!container) {
            (0, index_1.log)(`No speck for container "${containerId}"`);
            return false;
        }
        const { tabName = "" } = container;
        DOMCache_1.default.containers[tabName] = {};
        const domContainer = DOMCache_1.default.containers[tabName];
        if (!domContainer) {
            (0, index_1.log)(`Tab container for "${tabName}" not found`);
            return false;
        }
        if (container.prompt) {
            const promptContainer = mainContainer.querySelector(`#${container.prompt}`);
            const positivePrompts = mainContainer.querySelector(`#${container.prompt} > div`);
            const negativePrompts = mainContainer.querySelector(`#${container.prompt} > div:nth-child(2)`);
            if (!positivePrompts || !negativePrompts) {
                (0, index_1.log)(`No prompt containers found for ${tabName}`);
                return false;
            }
            domContainer.promptContainer = promptContainer;
            domContainer.positivePrompts = positivePrompts;
            domContainer.negativePrompts = negativePrompts;
            if (!showViews.includes(store_1.ViewType.POSITIVE))
                positivePrompts.style.display = "none";
            if (!showViews.includes(store_1.ViewType.NEGATIVE))
                negativePrompts.style.display = "none";
            //in order to be able to place buttons correctly
            positivePrompts.style.position = "relative";
            if (container.buttons) {
                const buttonsContainer = mainContainer.querySelector(`#${container.buttons}`);
                if (buttonsContainer) {
                    domContainer.buttonsContainer = buttonsContainer;
                    const generateButton = buttonsContainer.querySelector(".primary");
                    if (generateButton)
                        domContainer.generateButton = generateButton;
                }
            }
            if (container.results) {
                const resultsContainer = mainContainer.querySelector(`#${container.results}`);
                if (resultsContainer) {
                    domContainer.resultsContainer = resultsContainer;
                }
            }
            //caching prompts textArea element
            domContainer.textArea = positivePrompts.querySelector("textarea");
            (0, addTextAreaEvents_1.default)(domContainer.textArea);
            if (container.gallery) {
                domContainer.imageArea = mainContainer.querySelector(`#${container.gallery}`);
                (0, mount_6.default)({ wrapper: domContainer.imageArea, tabName });
            }
            (0, mount_4.default)({ wrapper: positivePrompts, tabName });
            (0, mount_1.default)({ wrapper: promptContainer, tabName });
            (0, mount_2.default)({ wrapper: promptContainer, positivePrompts: domContainer.positivePrompts, tabName });
            (0, mount_3.default)({ wrapper: promptContainer, tabName });
            (0, mount_5.default)({ positivePrompts: domContainer.positivePrompts, tabName });
        }
        if (container.seed)
            domContainer.seedInput = mainContainer.querySelector(`#${container.seed} input`);
        if (container.width)
            domContainer.widthInput = mainContainer.querySelector(`#${container.width} input`);
        if (container.height)
            domContainer.heightInput = mainContainer.querySelector(`#${container.height} input`);
        if (container.steps)
            domContainer.stepsInput = mainContainer.querySelector(`#${container.steps} input`);
        if (container.cfg)
            domContainer.cfgInput = mainContainer.querySelector(`#${container.cfg} input`);
        if (container.sampling)
            domContainer.samplingInput = mainContainer.querySelector(`#${container.sampling} input`);
        return true;
    }
    exports["default"] = mountContainer;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/main/mountGlobal.ts":
/*!************************************!*\
  !*** ./client/main/mountGlobal.ts ***!
  \************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/components/SetupWindow/mount */ "./client/components/SetupWindow/mount.tsx"), __webpack_require__(/*! client/components/PromptEdit/mount */ "./client/components/PromptEdit/mount.tsx"), __webpack_require__(/*! client/components/StyleEdit/mount */ "./client/components/StyleEdit/mount.tsx"), __webpack_require__(/*! client/components/LoadStyle/mount */ "./client/components/LoadStyle/mount.tsx"), __webpack_require__(/*! client/components/SaveStyle/mount */ "./client/components/SaveStyle/mount.tsx"), __webpack_require__(/*! client/components/PromptScribe/mount */ "./client/components/PromptScribe/mount.tsx"), __webpack_require__(/*! client/components/CollectionTools/mount */ "./client/components/CollectionTools/mount.tsx"), __webpack_require__(/*! client/components/PromptTools/mount */ "./client/components/PromptTools/mount.tsx"), __webpack_require__(/*! client/components/ui/TagTooltip/mount */ "./client/components/ui/TagTooltip/mount.tsx")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, mount_1, mount_2, mount_3, mount_4, mount_5, mount_6, mount_7, mount_8, mount_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function mountGlobal({ mainContainer }) {
        (0, mount_1.default)({ wrapper: mainContainer });
        (0, mount_4.default)({ wrapper: mainContainer });
        (0, mount_5.default)({ wrapper: mainContainer });
        (0, mount_6.default)({ wrapper: mainContainer });
        (0, mount_7.default)({ wrapper: mainContainer });
        (0, mount_8.default)({ wrapper: mainContainer });
        (0, mount_2.default)({ wrapper: mainContainer });
        (0, mount_3.default)({ wrapper: mainContainer });
        (0, mount_9.default)({ wrapper: mainContainer });
    }
    exports["default"] = mountGlobal;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/applyStyle.ts":
/*!*****************************************************!*\
  !*** ./client/managers/ActivePrompts/applyStyle.ts ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! clientTypes/style */ "./client/types/style.ts"), __webpack_require__(/*! ./index */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ./utils/applyForm */ "./client/managers/ActivePrompts/utils/applyForm.ts"), __webpack_require__(/*! ./utils/applyPositive */ "./client/managers/ActivePrompts/utils/applyPositive.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, style_1, index_1, applyForm_1, applyPositive_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function applyStyle(style, isAfter, override = false) {
        if (!style)
            return;
        const { positive, addType = style_1.AddStyleType.UniqueRoot } = style;
        if (override)
            index_1.default.setCurrentPrompts([]);
        (0, applyPositive_1.default)(positive, isAfter, addType);
        (0, applyForm_1.default)(style);
        index_1.default.updateTextArea();
        return true;
    }
    exports["default"] = applyStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/convertToGroup.ts":
/*!*********************************************************!*\
  !*** ./client/managers/ActivePrompts/convertToGroup.ts ***!
  \*********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./index */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function convertToGroup({ index, groupId = false, currentGroupId = false, branch, terminator = 0 }) {
        if (terminator > 100)
            return false;
        let isRoot = false;
        let isTargetBranch = false;
        if (!branch) {
            branch = index_1.default.getCurrentPrompts();
            isRoot = true;
        }
        if (isRoot && groupId === false)
            isTargetBranch = true;
        else if (groupId === currentGroupId)
            isTargetBranch = true;
        if (isTargetBranch) {
            const targetEntity = branch[index];
            if (!targetEntity)
                return false;
            const newGroup = {
                groupId: undefined,
                parentGroup: currentGroupId,
                weight: 0,
                prompts: [targetEntity],
            };
            branch[index] = newGroup;
            return branch[index];
        }
        else {
            for (const branchItem of branch) {
                if ("groupId" in branchItem) {
                    const result = convertToGroup({
                        index,
                        groupId,
                        currentGroupId: branchItem.groupId,
                        branch: branchItem.prompts,
                        terminator: terminator + 1
                    });
                    if (result)
                        return result;
                }
            }
        }
        return false;
    }
    exports["default"] = convertToGroup;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/getPromptByIndexInBranch.ts":
/*!*******************************************************************!*\
  !*** ./client/managers/ActivePrompts/getPromptByIndexInBranch.ts ***!
  \*******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./index */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getPromptByIndexInBranch({ index, branch, terminator = 0, groupId = false, currentGroupId = false }) {
        if (terminator > 100)
            return false;
        if (!branch)
            branch = index_1.default.getCurrentPrompts();
        if (groupId === currentGroupId) {
            const target = branch[index];
            if (target && "id" in target)
                return target;
            else
                return false;
        }
        for (const branchItem of branch) {
            if (groupId !== false && "groupId" in branchItem) {
                const { prompts } = branchItem;
                const result = getPromptByIndexInBranch({
                    index,
                    branch: prompts,
                    terminator: terminator + 1,
                    groupId,
                    currentGroupId: branchItem.groupId,
                });
                if (result)
                    return result;
            }
        }
        return false;
    }
    exports["default"] = getPromptByIndexInBranch;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/index.ts":
/*!************************************************!*\
  !*** ./client/managers/ActivePrompts/index.ts ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ./reindexPromptGroups */ "./client/managers/ActivePrompts/reindexPromptGroups.ts"), __webpack_require__(/*! ./getPromptByIndexInBranch */ "./client/managers/ActivePrompts/getPromptByIndexInBranch.ts"), __webpack_require__(/*! ./insertPromptInBranch */ "./client/managers/ActivePrompts/insertPromptInBranch.ts"), __webpack_require__(/*! ./removePromptInBranch */ "./client/managers/ActivePrompts/removePromptInBranch.ts"), __webpack_require__(/*! ./convertToGroup */ "./client/managers/ActivePrompts/convertToGroup.ts"), __webpack_require__(/*! ./unGroupInBranch */ "./client/managers/ActivePrompts/unGroupInBranch.ts"), __webpack_require__(/*! client/synchroniseCurrentPrompts */ "./client/synchroniseCurrentPrompts/index.ts"), __webpack_require__(/*! ./applyStyle */ "./client/managers/ActivePrompts/applyStyle.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, store_1, DOMCache_1, reindexPromptGroups_1, getPromptByIndexInBranch_1, insertPromptInBranch_1, removePromptInBranch_1, convertToGroup_1, unGroupInBranch_1, synchroniseCurrentPrompts_1, applyStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class ActivePrompts {
        static getUniqueIdsInBranch(uniqueArray, branch) {
            let isRoot = false;
            if (!branch) {
                branch = ActivePrompts.getCurrentPrompts();
                isRoot = true;
            }
            for (const branchItem of branch) {
                if ("groupId" in branchItem)
                    ActivePrompts.getUniqueIdsInBranch(uniqueArray, branchItem.prompts);
                else if (!branchItem.isSyntax) {
                    if (!uniqueArray.includes(branchItem.id))
                        uniqueArray.push(branchItem.id);
                }
            }
        }
        static getUniqueIds(branch) {
            const uniqueArray = [];
            ActivePrompts.getUniqueIdsInBranch(uniqueArray, branch);
            return uniqueArray;
        }
        static getUniqueInBranch(uniqueArray, branch) {
            let isRoot = false;
            if (!branch) {
                branch = ActivePrompts.getCurrentPrompts();
                isRoot = true;
            }
            for (const branchItem of branch) {
                if ("groupId" in branchItem)
                    ActivePrompts.getUniqueInBranch(uniqueArray, branchItem.prompts);
                else if (!branchItem.isSyntax) {
                    if (!uniqueArray.some(item => item.id === branchItem.id))
                        uniqueArray.push(branchItem);
                }
            }
        }
        static getUnique() {
            const uniqueArray = [];
            ActivePrompts.getUniqueInBranch(uniqueArray);
            return uniqueArray;
        }
        static getPromptByIndex(index, groupId) {
            return (0, getPromptByIndexInBranch_1.default)({ index, groupId });
        }
        static getPromptById({ id, groupId = false, currentGroupId = false, branch, terminator = 0 }) {
            if (terminator > 100)
                return false;
            if (!branch)
                branch = ActivePrompts.getCurrentPrompts();
            for (const branchItem of branch) {
                if ("id" in branchItem && branchItem.id === id && groupId === currentGroupId)
                    return branchItem;
                if (groupId !== false && "groupId" in branchItem) {
                    const { prompts } = branchItem;
                    const result = ActivePrompts.getPromptById({
                        id,
                        branch: prompts,
                        terminator: terminator + 1
                    });
                    if (result && result.id === id)
                        return result;
                }
            }
            return false;
        }
        static removePrompt(index, groupId) {
            (0, removePromptInBranch_1.default)({ index, groupId });
            (0, reindexPromptGroups_1.default)();
        }
        static insertPrompt(prompt, index, groupId = false) {
            const result = (0, insertPromptInBranch_1.default)({ prompt, index, groupId });
            if (result)
                (0, reindexPromptGroups_1.default)();
            return result;
        }
        static replacePrompt(prompt, index, groupId = false) {
            (0, insertPromptInBranch_1.default)({ prompt, index, groupId, isReplace: true });
        }
        static movePrompt({ from, to }) {
            const origin = (0, index_1.clone)(ActivePrompts.getCurrentPrompts());
            const fromElement = (0, removePromptInBranch_1.default)(Object.assign({}, from));
            if (!fromElement || !fromElement[0])
                return false;
            const result = ActivePrompts.insertPrompt(fromElement[0], to.index, to.groupId);
            if (!result)
                ActivePrompts.setCurrentPrompts(origin);
            return result;
        }
        static groupPrompts({ from, to }) {
            const origin = (0, index_1.clone)(ActivePrompts.getCurrentPrompts());
            const result = (0, convertToGroup_1.default)(Object.assign({}, to));
            if (!result)
                return false;
            const fromElement = (0, removePromptInBranch_1.default)(Object.assign({}, from));
            if (!fromElement || !fromElement[0]) {
                ActivePrompts.setCurrentPrompts(origin);
                return false;
            }
            result.prompts.push(fromElement[0]);
            (0, reindexPromptGroups_1.default)();
            return true;
        }
        static getGroupById(id, branch) {
            if (!branch)
                branch = ActivePrompts.getCurrentPrompts();
            for (const branchItem of branch) {
                if ("groupId" in branchItem) {
                    if (branchItem.groupId === id)
                        return branchItem;
                    const result = ActivePrompts.getGroupById(id, branchItem.prompts);
                    if (result)
                        return result;
                }
            }
            return false;
        }
        static makeGroupKey(group) {
            if (typeof group === "number")
                group = ActivePrompts.getGroupById(group);
            if (!group || !group.prompts)
                return false;
            const uniquePrompts = ActivePrompts.getUniqueIds(group.prompts);
            const key = uniquePrompts.join(" ");
            return key;
        }
        static updateFoldedKeys(branch) {
            if (!branch) {
                ActivePrompts.foldedGroups = [];
                branch = ActivePrompts.getCurrentPrompts();
            }
            for (const branchItem of branch) {
                if ("groupId" in branchItem) {
                    if (branchItem.folded) {
                        const key = ActivePrompts.makeGroupKey(branchItem);
                        if (key)
                            ActivePrompts.foldedGroups.push(key);
                    }
                    if (branchItem === null || branchItem === void 0 ? void 0 : branchItem.prompts.length)
                        ActivePrompts.updateFoldedKeys(branchItem.prompts);
                }
            }
        }
        static toggleGroupFold(groupId) {
            const targetGroup = ActivePrompts.getGroupById(groupId);
            if (!targetGroup)
                return false;
            targetGroup.folded = targetGroup.folded ? false : true;
            ActivePrompts.updateFoldedKeys();
            return true;
        }
        static unGroup(groupId) {
            if (groupId === undefined)
                return false;
            const result = (0, unGroupInBranch_1.default)({ groupId });
            if (result)
                (0, reindexPromptGroups_1.default)();
            return result;
        }
        static addStrToActive(str, atStart = false, supportExtendedSyntax = false) {
            const arr = (0, index_1.stringToPromptsArray)(str, supportExtendedSyntax);
            if (!arr || !arr.length)
                return;
            const activePrompts = ActivePrompts.getCurrentPrompts();
            const uniquePrompots = ActivePrompts.getUnique();
            for (let prompt of arr) {
                if (uniquePrompots.some(item => item.id === prompt.id))
                    continue;
                atStart ? activePrompts.unshift(prompt) : activePrompts.push(prompt);
            }
        }
    }
    exports["default"] = ActivePrompts;
    ActivePrompts.currentPromptsList = {};
    ActivePrompts.foldedGroups = [];
    ActivePrompts.getCurrentPrompts = () => {
        const { currentContainer } = store_1.default.getState();
        if (!ActivePrompts.currentPromptsList[currentContainer]) {
            ActivePrompts.currentPromptsList[currentContainer] = [];
        }
        return ActivePrompts.currentPromptsList[currentContainer];
    };
    ActivePrompts.setCurrentPrompts = (currentPrompts = []) => {
        const { currentContainer } = store_1.default.getState();
        ActivePrompts.currentPromptsList[currentContainer] = currentPrompts;
    };
    ActivePrompts.updateTextArea = () => {
        const { currentContainer } = store_1.default.getState();
        const activePrompts = ActivePrompts.getCurrentPrompts();
        const textArea = DOMCache_1.default.containers[currentContainer].textArea;
        if (!textArea)
            return;
        (0, synchroniseCurrentPrompts_1.synchroniseListToTextarea)(activePrompts);
    };
    ActivePrompts.applyStyle = applyStyle_1.default;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/insertPromptInBranch.ts":
/*!***************************************************************!*\
  !*** ./client/managers/ActivePrompts/insertPromptInBranch.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./index */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function insertPromptInBranch({ prompt, isReplace = false, index, branch, terminator = 0, groupId, currentGroupId }) {
        if (terminator > 100)
            return false;
        let isRoot = false;
        let isTargetBranch = false;
        if (!branch) {
            branch = index_1.default.getCurrentPrompts();
            isRoot = true;
        }
        if (isRoot && groupId === false)
            isTargetBranch = true;
        else if (groupId === currentGroupId)
            isTargetBranch = true;
        if (isTargetBranch) {
            if (isReplace && "id" in prompt) {
                const targetPrompt = branch[index];
                if (!targetPrompt || "groupId" in targetPrompt)
                    return false;
                targetPrompt.id = prompt.id;
                targetPrompt.isExternalNetwork = prompt.isExternalNetwork;
            }
            else
                branch.splice(index, 0, prompt);
            return true;
        }
        else {
            for (const branchItem of branch) {
                if ("groupId" in branchItem) {
                    const result = insertPromptInBranch({
                        prompt,
                        index,
                        groupId,
                        isReplace,
                        currentGroupId: branchItem.groupId,
                        branch: branchItem.prompts,
                        terminator: terminator + 1
                    });
                    if (result)
                        return true;
                }
            }
        }
        return false;
    }
    exports["default"] = insertPromptInBranch;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/reindexPromptGroups.ts":
/*!**************************************************************!*\
  !*** ./client/managers/ActivePrompts/reindexPromptGroups.ts ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./index */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function reindexPromptGroups(branch, parentGroup) {
        let isRoot = false;
        if (!branch) {
            branch = index_1.default.getCurrentPrompts();
            isRoot = true;
        }
        for (const branchItem of branch) {
            if ("groupId" in branchItem)
                reindexPromptGroups(branchItem.prompts, branchItem.groupId);
            if (isRoot)
                delete branchItem.parentGroup;
            else if (branchItem.parentGroup !== parentGroup)
                branchItem.parentGroup = parentGroup;
        }
    }
    exports["default"] = reindexPromptGroups;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/removePromptInBranch.ts":
/*!***************************************************************!*\
  !*** ./client/managers/ActivePrompts/removePromptInBranch.ts ***!
  \***************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./index */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function removePromptInBranch({ index, branch, terminator = 0, groupId, currentGroupId }) {
        if (terminator > 100)
            return false;
        let isRoot = false;
        let isTargetBranch = false;
        if (!branch) {
            branch = index_1.default.getCurrentPrompts();
            isRoot = true;
        }
        if (isRoot && groupId === false)
            isTargetBranch = true;
        else if (groupId === currentGroupId)
            isTargetBranch = true;
        if (isTargetBranch) {
            return branch.splice(index, 1);
        }
        else {
            for (const branchItem of branch) {
                if ("groupId" in branchItem) {
                    const result = removePromptInBranch({
                        index,
                        groupId,
                        currentGroupId: branchItem.groupId,
                        branch: branchItem.prompts,
                        terminator: terminator + 1
                    });
                    if (result !== false)
                        return result;
                }
            }
        }
        return false;
    }
    exports["default"] = removePromptInBranch;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/unGroupInBranch.ts":
/*!**********************************************************!*\
  !*** ./client/managers/ActivePrompts/unGroupInBranch.ts ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./index */ "./client/managers/ActivePrompts/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function unGroupInBranch({ groupId, currentGroupId = false, branch, terminator = 0 }) {
        if (terminator > 100)
            return false;
        if (!branch)
            branch = index_1.default.getCurrentPrompts();
        for (let index = 0; index < branch.length; index++) {
            const branchItem = branch[index];
            if ("groupId" in branchItem) {
                if (branchItem.groupId === groupId) {
                    const { prompts = [] } = branchItem;
                    branch.splice(index, 1, ...prompts);
                    return true;
                }
                const result = unGroupInBranch({
                    groupId,
                    currentGroupId: branchItem.groupId,
                    branch: branchItem.prompts,
                    terminator: terminator + 1
                });
                if (result)
                    return result;
            }
        }
        return false;
    }
    exports["default"] = unGroupInBranch;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/utils/addBranch.ts":
/*!**********************************************************!*\
  !*** ./client/managers/ActivePrompts/utils/addBranch.ts ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.addItem = void 0;
    function addItem(isRoot, branchItem, activePrompts, isAfter, unique) {
        if ("groupId" in branchItem) {
            const { prompts } = branchItem;
            branchItem.prompts = [];
            addBranch(false, prompts, branchItem.prompts, isAfter, unique);
            if (isRoot && !isAfter)
                activePrompts.unshift(branchItem);
            else
                activePrompts.push(branchItem);
        }
        else {
            const { id, isSyntax } = branchItem;
            if (!isSyntax && unique.includes(id))
                return;
            if (isRoot && !isAfter)
                activePrompts.unshift(Object.assign({}, branchItem));
            else
                activePrompts.push(Object.assign({}, branchItem));
        }
    }
    exports.addItem = addItem;
    function addBranch(isRoot, branch, activePrompts, isAfter, unique) {
        if (isRoot && !isAfter) {
            for (let i = branch.length - 1; i >= 0; i--) {
                const branchItem = branch[i];
                addItem(isRoot, branchItem, activePrompts, isAfter, unique);
            }
        }
        else {
            for (const branchItem of branch) {
                addItem(isRoot, branchItem, activePrompts, isAfter, unique);
            }
        }
    }
    exports["default"] = addBranch;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/utils/applyForm.ts":
/*!**********************************************************!*\
  !*** ./client/managers/ActivePrompts/utils/applyForm.ts ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ./triggerEvents */ "./client/managers/ActivePrompts/utils/triggerEvents.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, store_1, DOMCache_1, triggerEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    let _timerSamplerA = 0;
    let _timerSamplerB = 0;
    function applyForm(style) {
        if (!style)
            return false;
        const { currentContainer } = store_1.default.getState();
        const targetContainer = DOMCache_1.default.containers[currentContainer];
        if (!targetContainer)
            return false;
        const { negative, seed, width, height, steps, cfg, sampling } = style;
        const negativePrompts = targetContainer.negativePrompts;
        const seedInput = targetContainer.seedInput;
        const widthInput = targetContainer.widthInput;
        const heightInput = targetContainer.heightInput;
        const stepsInput = targetContainer.stepsInput;
        const cfgInput = targetContainer.cfgInput;
        const samplingInput = targetContainer.samplingInput;
        if (seed !== undefined && seedInput) {
            seedInput.value = seed + "";
            (0, triggerEvents_1.default)(seedInput);
        }
        if (negativePrompts && negative) {
            const negativeTextAreas = negativePrompts.getElementsByTagName("textarea");
            if (negativeTextAreas && negativeTextAreas[0]) {
                const textArea = negativeTextAreas[0];
                textArea.value = negative;
                (0, triggerEvents_1.default)(textArea);
            }
        }
        if (widthInput && width !== undefined) {
            widthInput.value = width + "";
            (0, triggerEvents_1.default)(widthInput);
        }
        if (heightInput && height !== undefined) {
            heightInput.value = height + "";
            (0, triggerEvents_1.default)(heightInput);
        }
        if (stepsInput && steps !== undefined) {
            stepsInput.value = steps + "";
            (0, triggerEvents_1.default)(stepsInput);
        }
        if (cfgInput && cfg !== undefined) {
            cfgInput.value = cfg + "";
            (0, triggerEvents_1.default)(cfgInput);
        }
        if (samplingInput && sampling) {
            const inputWrapper = samplingInput.parentElement.parentElement;
            const enterKeyEvent = new KeyboardEvent('keydown', {
                code: 'Enter',
                key: 'Enter',
                charCode: 13,
                keyCode: 13,
                view: window,
                bubbles: true
            });
            inputWrapper.style.opacity = "0";
            samplingInput.dispatchEvent(new KeyboardEvent('focus'));
            clearTimeout(_timerSamplerA);
            clearTimeout(_timerSamplerB);
            _timerSamplerA = setTimeout(() => {
                samplingInput.value = sampling;
                samplingInput.dispatchEvent(new KeyboardEvent('keydown'));
                samplingInput.dispatchEvent(new KeyboardEvent('keyup'));
                samplingInput.dispatchEvent(new KeyboardEvent('input'));
                _timerSamplerB = setTimeout(() => {
                    samplingInput.dispatchEvent(enterKeyEvent);
                    inputWrapper.style.opacity = "";
                }, 100);
            }, 100);
        }
    }
    exports["default"] = applyForm;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/utils/applyPositive.ts":
/*!**************************************************************!*\
  !*** ./client/managers/ActivePrompts/utils/applyPositive.ts ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! clientTypes/style */ "./client/types/style.ts"), __webpack_require__(/*! ./addBranch */ "./client/managers/ActivePrompts/utils/addBranch.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ActivePrompts_1, style_1, addBranch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function applyPositive(positive, isAfter, addType = style_1.AddStyleType.UniqueRoot) {
        if (!positive || !positive.length)
            return false;
        const uniqueUsedPrompts = ActivePrompts_1.default.getUniqueIds();
        const activePrompts = ActivePrompts_1.default.getCurrentPrompts();
        if (addType === style_1.AddStyleType.UniqueRoot || addType === style_1.AddStyleType.All) {
            if (isAfter) {
                for (const prompt of positive) {
                    if ("groupId" in prompt) {
                        activePrompts.push(Object.assign({}, prompt));
                        continue;
                    }
                    const { id, isSyntax } = prompt;
                    if (addType === style_1.AddStyleType.UniqueRoot && !isSyntax && uniqueUsedPrompts.includes(id))
                        continue;
                    activePrompts.push(Object.assign({}, prompt));
                }
            }
            else {
                for (let i = positive.length - 1; i >= 0; i--) {
                    const prompt = positive[i];
                    if ("groupId" in prompt) {
                        activePrompts.unshift(Object.assign({}, prompt));
                        continue;
                    }
                    const { id, isSyntax } = prompt;
                    if (addType === style_1.AddStyleType.UniqueRoot && !isSyntax && uniqueUsedPrompts.includes(id))
                        continue;
                    activePrompts.unshift(Object.assign({}, prompt));
                }
            }
        }
        else if (addType === style_1.AddStyleType.UniqueOnly) {
            (0, addBranch_1.default)(true, positive, activePrompts, isAfter, uniqueUsedPrompts);
        }
    }
    exports["default"] = applyPositive;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/ActivePrompts/utils/triggerEvents.ts":
/*!**************************************************************!*\
  !*** ./client/managers/ActivePrompts/utils/triggerEvents.ts ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    //making sure Svelte will pick up and delegate changes in the input value
    function triggerEvents(element) {
        element.dispatchEvent(new KeyboardEvent('keypress'));
        element.dispatchEvent(new KeyboardEvent('input'));
        element.dispatchEvent(new KeyboardEvent('blur'));
    }
    exports["default"] = triggerEvents;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/managers/Config/index.ts":
/*!*****************************************!*\
  !*** ./client/managers/Config/index.ts ***!
  \*****************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! clientTypes/style */ "./client/types/style.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, style_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    class ConfigManager {
        static getConfig() {
            return Object.assign({}, ConfigManager.config);
        }
        static setConfig(config = {}) {
            ConfigManager.config = Object.assign(Object.assign({}, ConfigManager.config), config);
            localStorage.setItem("PBE_config", JSON.stringify(ConfigManager.config));
        }
    }
    exports["default"] = ConfigManager;
    ConfigManager.config = {
        belowOneWeight: 0.05,
        aboveOneWeight: 0.02,
        toLowerCase: true,
        spaceMode: "space",
        showPromptIndex: false,
        autocomplitePromptMode: "all",
        cardWidth: 50,
        cardHeight: 100,
        splashCardWidth: 200,
        splashCardHeight: 300,
        rowsInKnownCards: 3,
        maxCardsShown: 1000,
        resizeThumbnails: true,
        resizeThumbnailsMaxWidth: 300,
        resizeThumbnailsMaxHeight: 300,
        resizeThumbnailsFormat: "JPG",
        supportExtendedSyntax: true,
        savePreviewForModel: false,
        saveStyleMeta: {
            addType: style_1.AddStyleType.UniqueRoot,
            positive: true,
            seed: false,
            size: false,
            quality: false,
            sampler: false,
            negative: false,
        },
        updateStyleMeta: {
            addType: style_1.AddStyleType.UniqueRoot,
            positive: true,
            seed: false,
            size: false,
            quality: false,
            sampler: false,
            negative: false,
        },
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/staticStore.ts":
/*!*******************************!*\
  !*** ./client/staticStore.ts ***!
  \*******************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const appStaticStore = {
        onClose: undefined,
    };
    exports["default"] = appStaticStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/store.ts":
/*!*************************!*\
  !*** ./client/store.ts ***!
  \*************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! zustand */ "./node_modules/zustand/index.js"), __webpack_require__(/*! ./DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ./const */ "./client/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, zustand_1, DOMCache_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.loadUIConfig = exports.setShowPromptTools = exports.setShowCollectionTools = exports.setShowPromptScribe = exports.setShowSaveStyle = exports.setShowLoadStyle = exports.setShowSetupWindowe = exports.setEditTargetCollection = exports.setSelectedPrompt = exports.setEditPromptGroup = exports.setEditPromptIndex = exports.setEditPrompt = exports.setEditStyle = exports.updateCollectionsIteration = exports.updateCurrentIteration = exports.updateFilesIteration = exports.setFilterTags = exports.setFilterName = exports.setSortKnownPrompts = exports.setFilterCategory = exports.setFilterCollection = exports.iterateModel = exports.toggleView = exports.setShowViews = exports.setShowControlPanel = exports.setCurrentContainer = exports.appStore = exports.ViewType = void 0;
    var ViewType;
    (function (ViewType) {
        ViewType["KNOWN"] = "known";
        ViewType["CURRENT"] = "current";
        ViewType["POSITIVE"] = "positive";
        ViewType["NEGATIVE"] = "negative";
    })(ViewType = exports.ViewType || (exports.ViewType = {}));
    exports.appStore = (0, zustand_1.create)((set) => ({
        modelIteration: 0,
        currentContainer: const_1.DEFAULT_CONTAINER_NAME,
        showControlPanel: true,
        showViews: [ViewType.KNOWN, ViewType.CURRENT, ViewType.POSITIVE, ViewType.NEGATIVE],
        currentIteration: 0,
        collectionsIteration: 0,
        filesIteration: 0,
        sortKnownPrompts: undefined,
        filterCollection: undefined,
        filterCategory: undefined,
        filterName: undefined,
        filterTags: [],
        selectedPrompt: undefined,
        editPrompt: undefined,
        editStyle: undefined,
        editPromptIndex: false,
        editPromptGroup: false,
        editTargetCollection: undefined,
        showSetupWindow: false,
        showLoadStyle: false,
        showSaveStyle: false,
        showPromptScribe: false,
        showCollectionTools: false,
        showPromptTools: false,
    }));
    const setCurrentContainer = (currentContainer) => exports.appStore.setState({ currentContainer });
    exports.setCurrentContainer = setCurrentContainer;
    const setShowControlPanel = (showControlPanel) => {
        localStorage.setItem("showControlPanel", JSON.stringify(showControlPanel));
        exports.appStore.setState({ showControlPanel });
    };
    exports.setShowControlPanel = setShowControlPanel;
    const setShowViews = (showViews) => exports.appStore.setState({ showViews });
    exports.setShowViews = setShowViews;
    const toggleView = (viewUpdate) => exports.appStore.setState(state => {
        let newShowViews = [];
        if (state.showViews.includes(viewUpdate))
            newShowViews = state.showViews.filter(viewItem => viewItem !== viewUpdate);
        else
            newShowViews = [...state.showViews, viewUpdate];
        if ((viewUpdate === ViewType.POSITIVE || viewUpdate === ViewType.NEGATIVE) && DOMCache_1.default && DOMCache_1.default.containers) {
            const showPositive = newShowViews.includes(ViewType.POSITIVE);
            const showNegative = newShowViews.includes(ViewType.NEGATIVE);
            for (let containerId in DOMCache_1.default.containers) {
                const container = DOMCache_1.default.containers[containerId];
                if (container.negativePrompts)
                    container.negativePrompts.style.display = showNegative ? "" : "none";
                if (container.positivePrompts)
                    container.positivePrompts.style.display = showPositive ? "" : "none";
            }
        }
        localStorage.setItem("PBE_showViews", JSON.stringify(newShowViews));
        return { showViews: newShowViews };
    });
    exports.toggleView = toggleView;
    const iterateModel = () => exports.appStore.setState(store => ({ modelIteration: store.modelIteration + 1 }));
    exports.iterateModel = iterateModel;
    const setFilterCollection = (filterCollection) => exports.appStore.setState(store => ({ filterCollection, filesIteration: store.filesIteration + 1 }));
    exports.setFilterCollection = setFilterCollection;
    const setFilterCategory = (filterCategory) => exports.appStore.setState({ filterCategory });
    exports.setFilterCategory = setFilterCategory;
    const setSortKnownPrompts = (sortKnownPrompts) => exports.appStore.setState({ sortKnownPrompts });
    exports.setSortKnownPrompts = setSortKnownPrompts;
    const setFilterName = (filterName) => exports.appStore.setState({ filterName });
    exports.setFilterName = setFilterName;
    const setFilterTags = (filterTags) => exports.appStore.setState({ filterTags });
    exports.setFilterTags = setFilterTags;
    const updateFilesIteration = () => exports.appStore.setState(store => ({ filesIteration: store.filesIteration + 1 }));
    exports.updateFilesIteration = updateFilesIteration;
    const updateCurrentIteration = () => exports.appStore.setState(store => ({ currentIteration: store.currentIteration + 1 }));
    exports.updateCurrentIteration = updateCurrentIteration;
    const updateCollectionsIteration = () => exports.appStore.setState(store => ({ collectionsIteration: store.collectionsIteration + 1 }));
    exports.updateCollectionsIteration = updateCollectionsIteration;
    const setEditStyle = (editStyle) => exports.appStore.setState({ editStyle });
    exports.setEditStyle = setEditStyle;
    const setEditPrompt = (editPrompt) => exports.appStore.setState({ editPrompt });
    exports.setEditPrompt = setEditPrompt;
    const setEditPromptIndex = (editPromptIndex = false) => exports.appStore.setState({ editPromptIndex });
    exports.setEditPromptIndex = setEditPromptIndex;
    const setEditPromptGroup = (editPromptGroup = false) => exports.appStore.setState({ editPromptGroup });
    exports.setEditPromptGroup = setEditPromptGroup;
    const setSelectedPrompt = (selectedPrompt) => exports.appStore.setState({ selectedPrompt });
    exports.setSelectedPrompt = setSelectedPrompt;
    const setEditTargetCollection = (editTargetCollection) => exports.appStore.setState({ editTargetCollection });
    exports.setEditTargetCollection = setEditTargetCollection;
    const setShowSetupWindowe = (showSetupWindow) => exports.appStore.setState({ showSetupWindow });
    exports.setShowSetupWindowe = setShowSetupWindowe;
    const setShowLoadStyle = (showLoadStyle) => exports.appStore.setState({ showLoadStyle });
    exports.setShowLoadStyle = setShowLoadStyle;
    const setShowSaveStyle = (showSaveStyle) => exports.appStore.setState({ showSaveStyle });
    exports.setShowSaveStyle = setShowSaveStyle;
    const setShowPromptScribe = (showPromptScribe) => exports.appStore.setState({ showPromptScribe });
    exports.setShowPromptScribe = setShowPromptScribe;
    const setShowCollectionTools = (showCollectionTools) => exports.appStore.setState({ showCollectionTools });
    exports.setShowCollectionTools = setShowCollectionTools;
    const setShowPromptTools = (showPromptTools) => exports.appStore.setState({ showPromptTools });
    exports.setShowPromptTools = setShowPromptTools;
    function loadUIConfig() {
        const lsShowViews = localStorage.getItem("PBE_showViews");
        if (lsShowViews) {
            const showViews = JSON.parse(lsShowViews);
            (0, exports.setShowViews)(showViews);
        }
        const showControlPanel = localStorage.getItem("showControlPanel");
        if (showControlPanel === "false")
            (0, exports.setShowControlPanel)(false);
    }
    exports.loadUIConfig = loadUIConfig;
    exports["default"] = exports.appStore;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/supportedContainers.ts":
/*!***************************************!*\
  !*** ./client/supportedContainers.ts ***!
  \***************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const supportedContainers = {
        text2Img: {
            tabName: "txt2img",
            prompt: "txt2img_prompt_container",
            results: "txt2img_results",
            gallery: "txt2img_gallery_container",
            buttons: "txt2img_generate_box",
            settings: "txt2img_settings",
            seed: "txt2img_seed",
            width: "txt2img_width",
            height: "txt2img_height",
            steps: "txt2img_steps",
            cfg: "txt2img_cfg_scale",
            sampling: "txt2img_sampling",
        },
        img2Img: {
            tabName: "img2img",
            prompt: "img2img_prompt_container",
            results: "img2img_results",
            gallery: "img2img_gallery_container",
            buttons: "img2img_generate_box",
            settings: "img2img_settings",
            seed: "img2img_seed",
            width: "img2img_width",
            height: "img2img_height",
            steps: "img2img_steps",
            cfg: "img2img_cfg_scale",
            sampling: "img2img_sampling",
        }
    };
    exports["default"] = supportedContainers;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/synchroniseCurrentPrompts/createPromptObjects.ts":
/*!*****************************************************************!*\
  !*** ./client/synchroniseCurrentPrompts/createPromptObjects.ts ***!
  \*****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database/index */ "./client/Database/index.ts"), __webpack_require__(/*! client/const */ "./client/const.ts"), __webpack_require__(/*! client/utils/index */ "./client/utils/index.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, const_1, index_2, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function createPromptObjects({ value, activePrompts, groupId, nestingLevel = 0, normalize = false }) {
        const { data } = index_1.default;
        const { supportExtendedSyntax = true } = Config_1.default.getConfig();
        const KEEP_SYNTAX_SYMBOLS = ["{", "}", "|"];
        const DELIMITER_CHAR = ",";
        const SPACE_CHAR = " ";
        let prompts = [];
        if (supportExtendedSyntax) {
            prompts = value.split(/([,{}|])/g);
            prompts = prompts.filter(strItem => strItem);
            prompts = prompts.map((strItem, i, arr) => {
                if (typeof strItem !== "string")
                    return strItem;
                let trimStr = strItem.trim();
                if (KEEP_SYNTAX_SYMBOLS.includes(trimStr)) {
                    const prevItem = i > 0 ? arr[i - 1] : "";
                    const nextItem = arr[i + 1];
                    if (prevItem && prevItem[prevItem.length - 1] === SPACE_CHAR)
                        strItem = SPACE_CHAR + strItem;
                    if (nextItem && nextItem[0] === SPACE_CHAR)
                        strItem += SPACE_CHAR;
                }
                return strItem;
            });
            prompts = prompts.filter(strItem => strItem && strItem.trim());
        }
        else {
            prompts = value.split(",");
            prompts = prompts.filter(strItem => strItem && strItem.trim());
        }
        for (let i = 0; i < prompts.length; i++) {
            let promptItem = prompts[i];
            if (!promptItem)
                continue;
            if (!promptItem || promptItem === ",")
                continue;
            const { id, weight, isExternalNetwork, isSyntax = false, nestedWeight } = (0, index_2.promptStringToObject)({ prompt: promptItem, nestedWeight: 0 });
            if (!id)
                continue;
            promptItem = id;
            if (normalize && !isExternalNetwork && !isSyntax)
                promptItem = (0, index_2.normalizePrompt)({ prompt: promptItem, data });
            const targetItem = {
                id: promptItem,
                parentGroup: groupId,
                weight: weight !== undefined ? weight : const_1.DEFAULT_PROMPT_WEIGHT
            };
            if (isExternalNetwork)
                targetItem.isExternalNetwork = true;
            /**
             * If it is a syntax token - also checking if it needs delimiters on its sides in a string.
             */
            if (isSyntax) {
                const prevItem = i > 0 ? prompts[i - 1] : "";
                const nextItem = prompts[i + 1];
                targetItem.isSyntax = true;
                targetItem.delimiter = "none";
                if (prevItem === DELIMITER_CHAR && nextItem === DELIMITER_CHAR)
                    targetItem.delimiter = "both";
                else if (prevItem === DELIMITER_CHAR)
                    targetItem.delimiter = "prev";
                else if (nextItem === DELIMITER_CHAR)
                    targetItem.delimiter = "next";
            }
            activePrompts.push(targetItem);
        }
    }
    exports["default"] = createPromptObjects;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/synchroniseCurrentPrompts/index.ts":
/*!***************************************************!*\
  !*** ./client/synchroniseCurrentPrompts/index.ts ***!
  \***************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./synchroniseListToTextarea */ "./client/synchroniseCurrentPrompts/synchroniseListToTextarea.ts"), __webpack_require__(/*! ./syncCurrentPrompts */ "./client/synchroniseCurrentPrompts/syncCurrentPrompts.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, synchroniseListToTextarea_1, syncCurrentPrompts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.synchroniseListToTextarea = void 0;
    exports.synchroniseListToTextarea = synchroniseListToTextarea_1.default;
    exports["default"] = syncCurrentPrompts_1.default;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/synchroniseCurrentPrompts/processGroup.ts":
/*!**********************************************************!*\
  !*** ./client/synchroniseCurrentPrompts/processGroup.ts ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/ActivePrompts/index */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! ./createPromptObjects */ "./client/synchroniseCurrentPrompts/createPromptObjects.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, createPromptObjects_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function processGroup({ entityArray, activePrompts, normalize = false, nestingLevel = 0, groupId = false }) {
        for (const entity of entityArray) {
            if (typeof entity === "string") {
                (0, createPromptObjects_1.default)({
                    value: entity,
                    normalize,
                    activePrompts,
                    nestingLevel,
                    groupId,
                });
            }
            else if ("id" in entity) {
                const { id, weight, body } = entity;
                const newGroup = {
                    groupId: id,
                    parentGroup: groupId,
                    weight: weight,
                    prompts: [],
                };
                activePrompts.push(newGroup);
                processGroup({
                    entityArray: body,
                    activePrompts: newGroup.prompts,
                    normalize,
                    nestingLevel: nestingLevel + 1,
                    groupId: id,
                });
                if (index_1.default.foldedGroups.length) {
                    const keyForGroup = index_1.default.makeGroupKey(newGroup);
                    if (keyForGroup && index_1.default.foldedGroups.includes(keyForGroup)) {
                        newGroup.folded = true;
                    }
                }
            }
        }
    }
    exports["default"] = processGroup;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/synchroniseCurrentPrompts/syncCurrentPrompts.ts":
/*!****************************************************************!*\
  !*** ./client/synchroniseCurrentPrompts/syncCurrentPrompts.ts ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/managers/ActivePrompts/index */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/utils/parseGroups */ "./client/utils/parseGroups.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./processGroup */ "./client/synchroniseCurrentPrompts/processGroup.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1, store_1, parseGroups_1, DOMCache_1, store_2, processGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Synchronises text content of the textarea with the array of active prompts used by the extension.
     * TODO: remove noTextAreaUpdate as it is relict from previous implementation.
     */
    function syncCurrentPrompts(noTextAreaUpdate = true, normalize = false) {
        const { currentContainer } = store_2.default.getState();
        const textArea = DOMCache_1.default.containers[currentContainer].textArea;
        if (!textArea)
            return;
        let value = textArea.value;
        //trying to fix LORAs/Hypernetworks added without a preceding comma
        value = value.replace(/([^,])\ </g, "$1,\ <");
        const newActivePrompts = [];
        (0, processGroup_1.default)({
            entityArray: (0, parseGroups_1.parseGroups)(value),
            activePrompts: newActivePrompts,
            normalize,
        });
        index_1.default.setCurrentPrompts(newActivePrompts);
        (0, store_1.updateCurrentIteration)();
    }
    exports["default"] = syncCurrentPrompts;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/synchroniseCurrentPrompts/syncListToTextareaBranch.ts":
/*!**********************************************************************!*\
  !*** ./client/synchroniseCurrentPrompts/syncListToTextareaBranch.ts ***!
  \**********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/const */ "./client/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function syncListToTextareaBranch(activePrompts, prompts = []) {
        for (const entity of activePrompts) {
            if ("groupId" in entity) {
                prompts.push({ text: "(", src: { id: "(", isSyntax: true, delimiter: "prev" } });
                syncListToTextareaBranch(entity.prompts, prompts);
                if (entity.weight)
                    prompts.push({ text: `: ${entity.weight}`, src: { id: "", isSyntax: true, delimiter: "none" } });
                prompts.push({ text: ")", src: { id: ")", isSyntax: true, delimiter: "next" } });
                continue;
            }
            const { id, weight, isExternalNetwork } = entity;
            if (isExternalNetwork) {
                if (weight !== undefined && weight !== const_1.DEFAULT_PROMPT_WEIGHT)
                    prompts.push({ text: `<${id}:${weight}>`, src: entity });
                else
                    prompts.push({ text: `<${id}>`, src: entity });
            }
            else {
                if (weight !== undefined && weight !== const_1.DEFAULT_PROMPT_WEIGHT)
                    prompts.push({ text: `(${id}: ${weight})`, src: entity });
                else
                    prompts.push({ text: id, src: entity });
            }
        }
    }
    exports["default"] = syncListToTextareaBranch;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/synchroniseCurrentPrompts/synchroniseListToTextarea.ts":
/*!***********************************************************************!*\
  !*** ./client/synchroniseCurrentPrompts/synchroniseListToTextarea.ts ***!
  \***********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! ./syncListToTextareaBranch */ "./client/synchroniseCurrentPrompts/syncListToTextareaBranch.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, DOMCache_1, store_1, syncListToTextareaBranch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function synchroniseListToTextarea(activePrompts) {
        const { currentContainer } = store_1.default.getState();
        const textArea = DOMCache_1.default.containers[currentContainer].textArea;
        if (!textArea)
            return;
        const prompts = [];
        textArea.value = "";
        (0, syncListToTextareaBranch_1.default)(activePrompts, prompts);
        let addTextValue = "";
        for (let i = 0; i < prompts.length; i++) {
            const { text, src } = prompts[i];
            const nextPromptSrc = prompts[i + 1] ? prompts[i + 1].src : undefined;
            addTextValue += text;
            let addDelimiter = true;
            if (!nextPromptSrc)
                addDelimiter = false;
            else if (src.delimiter) {
                if (src.delimiter === "prev" || src.delimiter === "none")
                    addDelimiter = false;
            }
            else if (nextPromptSrc.delimiter) {
                if (nextPromptSrc.delimiter === "next" || nextPromptSrc.delimiter === "none")
                    addDelimiter = false;
            }
            if (nextPromptSrc && text === ")" && nextPromptSrc.id === ")")
                addDelimiter = false;
            if (addDelimiter)
                addTextValue += ", ";
        }
        textArea.value = addTextValue;
        //Just to be sure every api listening to changes in textarea done their job
        textArea.dispatchEvent(new Event('focus'));
        textArea.dispatchEvent(new Event('input'));
        textArea.dispatchEvent(new KeyboardEvent('keyup'));
        textArea.dispatchEvent(new KeyboardEvent('keypress'));
        textArea.dispatchEvent(new Event('blur'));
    }
    exports["default"] = synchroniseListToTextarea;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/types/collection.ts":
/*!************************************!*\
  !*** ./client/types/collection.ts ***!
  \************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.CollectionFormat = void 0;
    var CollectionFormat;
    (function (CollectionFormat) {
        CollectionFormat["SHORT"] = "short";
        CollectionFormat["EXPANDED"] = "expanded";
    })(CollectionFormat = exports.CollectionFormat || (exports.CollectionFormat = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/types/style.ts":
/*!*******************************!*\
  !*** ./client/types/style.ts ***!
  \*******************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.AddStyleType = void 0;
    var AddStyleType;
    (function (AddStyleType) {
        AddStyleType["UniqueOnly"] = "unique only";
        AddStyleType["UniqueRoot"] = "unique root";
        AddStyleType["All"] = "all";
    })(AddStyleType || (AddStyleType = {}));
    exports.AddStyleType = AddStyleType;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/utils/formModelId.ts":
/*!*************************************!*\
  !*** ./client/utils/formModelId.ts ***!
  \*************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function formModelId(checkpoint) {
        //removing the cache marker.
        const arr = checkpoint.split(" ");
        const lastPart = arr[arr.length - 1];
        if (lastPart && lastPart[0] === "[")
            arr.pop();
        checkpoint = arr.join(" ");
        //removing file extension
        checkpoint = checkpoint.replace(".safetensors", "");
        checkpoint = checkpoint.trim();
        return checkpoint;
    }
    exports["default"] = formModelId;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/utils/getCheckpoint.ts":
/*!***************************************!*\
  !*** ./client/utils/getCheckpoint.ts ***!
  \***************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts"), __webpack_require__(/*! ./formModelId */ "./client/utils/formModelId.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, DOMCache_1, formModelId_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getCheckpoint() {
        const checkpointSelector = DOMCache_1.default.modelCheckpoint;
        if (!checkpointSelector)
            return false;
        const input = checkpointSelector.querySelector("input");
        if (!input || !input.value)
            return false;
        const checkpoint = input.value;
        return (0, formModelId_1.default)(checkpoint);
    }
    exports["default"] = getCheckpoint;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/utils/getStyle.ts":
/*!**********************************!*\
  !*** ./client/utils/getStyle.ts ***!
  \**********************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/Database */ "./client/Database/index.ts"), __webpack_require__(/*! client/store */ "./client/store.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts"), __webpack_require__(/*! client/managers/ActivePrompts */ "./client/managers/ActivePrompts/index.ts"), __webpack_require__(/*! client/DOMCache */ "./client/DOMCache.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Database_1, store_1, Config_1, ActivePrompts_1, DOMCache_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function getStyle({ styleName, collectionId, isUpdate = false }) {
        const { data } = Database_1.default;
        const { saveStyleMeta = {}, updateStyleMeta = {} } = Config_1.default.getConfig();
        const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;
        const { currentContainer } = store_1.default.getState();
        if (!collectionId)
            return;
        const activePrompts = ActivePrompts_1.default.getCurrentPrompts();
        if (!collectionId)
            return false;
        if (!data.styles)
            return false;
        const newStyle = {};
        let seed = undefined;
        let negative = undefined;
        let width = undefined;
        let height = undefined;
        let steps = undefined;
        let cfg = undefined;
        let sampling = undefined;
        const seedInput = DOMCache_1.default.containers[currentContainer].seedInput;
        const negativePrompts = DOMCache_1.default.containers[currentContainer].negativePrompts;
        const widthInput = DOMCache_1.default.containers[currentContainer].widthInput;
        const heightInput = DOMCache_1.default.containers[currentContainer].heightInput;
        const stepsInput = DOMCache_1.default.containers[currentContainer].stepsInput;
        const cfgInput = DOMCache_1.default.containers[currentContainer].cfgInput;
        const samplingInput = DOMCache_1.default.containers[currentContainer].samplingInput;
        if (seedInput) {
            const seedValue = Number(seedInput.value);
            if (seedValue !== undefined && seedValue !== -1 && !Number.isNaN(seedValue))
                seed = seedValue;
        }
        if (negativePrompts) {
            const negativeTextAreas = negativePrompts.getElementsByTagName("textarea");
            if (negativeTextAreas && negativeTextAreas[0])
                negative = negativeTextAreas[0].value;
        }
        if (widthInput)
            width = Number(widthInput.value);
        if (heightInput)
            height = Number(heightInput.value);
        if (stepsInput)
            steps = Number(stepsInput.value);
        if (cfgInput)
            cfg = Number(cfgInput.value);
        if (samplingInput)
            sampling = samplingInput.value;
        if (Number.isNaN(width))
            width = undefined;
        if (Number.isNaN(height))
            height = undefined;
        if (Number.isNaN(steps))
            steps = undefined;
        if (Number.isNaN(cfg))
            cfg = undefined;
        const targetCollection = data.styles[collectionId];
        if (!targetCollection)
            return;
        if (styleName)
            newStyle.name = styleName;
        //positive prompts. added as array of prompt objects
        if (targetMeta.positive) {
            if (activePrompts && activePrompts.length)
                newStyle.positive = JSON.parse(JSON.stringify(activePrompts));
            else
                newStyle.positive = [];
        }
        if (targetMeta.seed && seed !== undefined)
            newStyle.seed = seed;
        //negative prompts. currently added as a string, may be changed to array of prompts in the future
        if (targetMeta.negative && negative !== undefined)
            newStyle.negative = negative;
        if (targetMeta.size && width !== undefined)
            newStyle.width = width;
        if (targetMeta.size && height !== undefined)
            newStyle.height = height;
        if (targetMeta.quality && steps !== undefined)
            newStyle.steps = steps;
        if (targetMeta.quality && cfg !== undefined)
            newStyle.cfg = cfg;
        if (targetMeta.sampler && sampling)
            newStyle.sampling = sampling;
        if (targetMeta.addType)
            newStyle.addType = targetMeta.addType;
        return newStyle;
    }
    exports["default"] = getStyle;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/utils/gradioApp.ts":
/*!***********************************!*\
  !*** ./client/utils/gradioApp.ts ***!
  \***********************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    function gradioApp() {
        const elems = document.getElementsByTagName('gradio-app');
        const gradioShadowRoot = elems.length == 0 ? null : elems[0].shadowRoot;
        return !!gradioShadowRoot ? gradioShadowRoot : document.body;
    }
    exports["default"] = gradioApp;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/utils/index.ts":
/*!*******************************!*\
  !*** ./client/utils/index.ts ***!
  \*******************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./promptStringToObject */ "./client/utils/promptStringToObject.ts"), __webpack_require__(/*! ./parseGroups */ "./client/utils/parseGroups.ts"), __webpack_require__(/*! client/managers/Config */ "./client/managers/Config/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, promptStringToObject_1, parseGroups_1, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.log = exports.randomIntFromInterval = exports.stringToPromptsArray = exports.promptStringToObject = exports.parseGroups = exports.normalizePrompt = exports.makeFileNameSafe = exports.replaceAllRegex = exports.clone = void 0;
    exports.promptStringToObject = promptStringToObject_1.default;
    exports.parseGroups = parseGroups_1.default;
    const regex = {
        REGX_SINGLE_UNDERSCORE: /(?<!_)_(?!_)/g,
    };
    function clone(obj) {
        if (structuredClone)
            return structuredClone(obj);
        else
            return JSON.parse(JSON.stringify(obj));
    }
    exports.clone = clone;
    function replaceAllRegex(str, oldStr, newStr) {
        if (!str || !oldStr)
            return str;
        return str.replace(new RegExp(oldStr, 'g'), newStr);
    }
    exports.replaceAllRegex = replaceAllRegex;
    ;
    /**
     * Make sure to update server-side makeFileNameSafe method as well
     */
    function makeFileNameSafe(fileName) {
        if (!fileName)
            return;
        const { REGX_SINGLE_UNDERSCORE } = regex;
        fileName = replaceAllRegex(fileName, REGX_SINGLE_UNDERSCORE, " ");
        //unix/win
        fileName = replaceAllRegex(fileName, "/", "_fsl_");
        //win
        fileName = replaceAllRegex(fileName, ":", "_col_");
        fileName = replaceAllRegex(fileName, "\\\\", "_bsl_");
        fileName = replaceAllRegex(fileName, "<", "_lt_");
        fileName = replaceAllRegex(fileName, ">", "_gt_");
        fileName = replaceAllRegex(fileName, "\"", "_dq_");
        fileName = replaceAllRegex(fileName, "\\|", "_pip_");
        fileName = replaceAllRegex(fileName, "\\?", "_qm_");
        fileName = replaceAllRegex(fileName, "\\*", "_ast_");
        fileName = fileName.trim();
        return fileName;
    }
    exports.makeFileNameSafe = makeFileNameSafe;
    /**
     * Modifies prompt input so that prompts conform to the same style.
     * @param {*} prompt
     * @returns
     */
    function normalizePrompt({ prompt, data }) {
        const { unitedList } = data;
        const config = Config_1.default.getConfig();
        const { REGX_SINGLE_UNDERSCORE } = regex;
        if (!prompt)
            return prompt;
        prompt = prompt.trim();
        if (!prompt)
            return prompt;
        //do not modify saved prompts
        if (unitedList[prompt])
            return prompt;
        //Skip external networks prompts.
        if (prompt.startsWith("<") && prompt.endsWith(">"))
            return prompt;
        if (config.toLowerCase)
            prompt = prompt.toLowerCase();
        if (config.spaceMode === "space")
            prompt = prompt.replaceAll(REGX_SINGLE_UNDERSCORE, " ");
        else if (config.spaceMode === "underscore")
            prompt = prompt.replaceAll(" ", "_");
        return prompt;
    }
    exports.normalizePrompt = normalizePrompt;
    function stringToPromptsArray(str, supportExtendedSyntax) {
        if (!str)
            return false;
        const promptsArray = [];
        const arr = str.split(",");
        for (let prompt of arr) {
            prompt = prompt.trim();
            if (!prompt)
                continue;
            const newPrompt = (0, promptStringToObject_1.default)({ prompt, supportExtendedSyntax });
            promptsArray.push(newPrompt);
        }
        return promptsArray;
    }
    exports.stringToPromptsArray = stringToPromptsArray;
    function log(message) {
        console.log(message);
    }
    exports.log = log;
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    exports.randomIntFromInterval = randomIntFromInterval;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/utils/parseGroups.ts":
/*!*************************************!*\
  !*** ./client/utils/parseGroups.ts ***!
  \*************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.parseGroups = void 0;
    let assignGroupId = 0;
    function parseBranch(str, container = []) {
        let newStr = str;
        let currChar = "";
        let body = "";
        let weightMarker = "";
        let grabMarker = false;
        let isEscape = false;
        let isExternalNetwork = false;
        while (str.length) {
            if (isEscape) {
                isEscape = false;
                str = str.substring(1);
                continue;
            }
            currChar = str.charAt(0);
            if (currChar === "\\") {
                isEscape = true;
                body += "\\";
                body += str.charAt(1);
                str = str.substring(1);
                continue;
            }
            if (currChar === "<")
                isExternalNetwork = true;
            else if (currChar === ">")
                isExternalNetwork = false;
            if (isExternalNetwork) {
                if (currChar === "(" || currChar === ")" || currChar === ",") {
                    isExternalNetwork = false;
                }
                else {
                    body += currChar;
                    str = str.substring(1);
                    newStr = str;
                    continue;
                }
            }
            if (currChar === "(") {
                if (body)
                    container.push(body);
                body = "";
                const { container: newContainer, newStr, weight } = parseBranch(str.substring(1), []);
                str = newStr;
                if (newContainer && newContainer.length) {
                    let isGroup = true;
                    //detect if it is a single prompt with weight or a group of prompts
                    if (newContainer.length === 1 &&
                        typeof newContainer[0] === "string" &&
                        !newContainer[0].includes(",") &&
                        !newContainer[0].includes("|"))
                        isGroup = false;
                    if (isGroup) {
                        container.push({
                            id: assignGroupId,
                            weight: weight ? Number(weight) : undefined,
                            body: newContainer,
                        });
                        assignGroupId++;
                    }
                    else {
                        if (weight)
                            container.push(`(${newContainer}: ${weight})`);
                        else
                            container.push(`(${newContainer})`);
                    }
                }
            }
            else if (currChar === ")") {
                if (body)
                    container.push(body);
                body = "";
                break;
            }
            else if (currChar === ":") {
                grabMarker = true;
            }
            else if (grabMarker) {
                if (currChar === "." || (currChar >= "0" && currChar <= "9"))
                    weightMarker += currChar;
                else if (currChar !== " ")
                    grabMarker = false;
            }
            else
                body += currChar;
            str = str.substring(1);
            newStr = str;
        }
        if (body)
            container.push(body);
        return { container, newStr, weight: weightMarker };
    }
    /**
     * Parses prompts string and splices it to groups of strings based on group delimeter syntax.
     * @param str
     * @returns
     */
    function parseGroups(str) {
        assignGroupId = 0;
        const result = parseBranch(str);
        return result.container;
    }
    exports.parseGroups = parseGroups;
    exports["default"] = parseGroups;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./client/utils/promptStringToObject.ts":
/*!**********************************************!*\
  !*** ./client/utils/promptStringToObject.ts ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! client/const */ "./client/const.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    /**
     * Converts prompt string to prompt object (including meta data like weight and external network).
     * @param {*} promptItem
     */
    function promptStringToObject({ prompt, nestedWeight = 0, supportExtendedSyntax = true }) {
        const KEEP_SYNTAX_SYMBOLS = ["{", "}", "|"];
        if (supportExtendedSyntax && KEEP_SYNTAX_SYMBOLS.includes(prompt.trim()))
            return { id: prompt, isSyntax: true };
        else
            prompt = prompt.trim();
        //prompt weight
        let weight = const_1.DEFAULT_PROMPT_WEIGHT;
        //prompt is a marker for usage of LORA/Hypernetwork
        let isExternalNetwork = false;
        let currChar = "";
        let isEscape = false;
        let i = 0;
        //entering weight
        while (i < prompt.length) {
            if (isEscape) {
                isEscape = false;
                i++;
                continue;
            }
            currChar = prompt.charAt(i);
            if (currChar === "\\") {
                isEscape = true;
                i++;
                continue;
            }
            if (currChar !== "(")
                break;
            nestedWeight += 1;
            i++;
        }
        //getting prompt weight
        weight = Number(Math.pow(const_1.PROMPT_WEIGHT_FACTOR, nestedWeight).toFixed(2));
        //outing weight
        i = prompt.length - 1;
        while (i < prompt.length) {
            if (isEscape) {
                isEscape = false;
                i--;
                continue;
            }
            currChar = prompt.charAt(i);
            if (prompt.charAt(i - 1) === "\\") {
                isEscape = true;
                i--;
                continue;
            }
            if (currChar !== ")")
                break;
            nestedWeight -= 1;
            i--;
        }
        //getting new prompt name without weight syntax characters
        i = 0;
        isEscape = false;
        let newPromptItem = "";
        while (i < prompt.length) {
            currChar = prompt.charAt(i);
            if (currChar === "\\") {
                isEscape = true;
                newPromptItem += currChar;
                i++;
                continue;
            }
            if ((currChar !== "(" && currChar !== ")") || isEscape)
                newPromptItem += currChar;
            if (isEscape)
                isEscape = false;
            i++;
        }
        prompt = newPromptItem;
        //detecting external network prompt
        if (prompt.startsWith("<") && prompt.endsWith(">")) {
            isExternalNetwork = true;
            prompt = prompt.substring(1);
            prompt = prompt.substring(0, prompt.length - 1);
        }
        //detecting weight marker
        if (prompt.includes(":")) {
            const promptArr = prompt.split(":");
            const weightDataItem = Number(promptArr.pop());
            if (!Number.isNaN(weightDataItem)) {
                const base = promptArr.join(":").trim();
                prompt = base;
                weight = weightDataItem;
            }
        }
        const promptObject = { id: prompt, weight, isExternalNetwork, nestedWeight };
        return promptObject;
    }
    exports["default"] = promptStringToObject;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkpromptsbrowser"] = self["webpackChunkpromptsbrowser"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./client/index.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map