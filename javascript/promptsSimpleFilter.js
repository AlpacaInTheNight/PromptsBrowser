if(!window.PromptsBrowser) window.PromptsBrowser = {};

PromptsBrowser.promptsSimpleFilter = {};

/**
 * Returns true if prompt passes filters params
 * @param {*} promptId 
 * @param {*} filters 
 * @returns 
 */
PromptsBrowser.promptsSimpleFilter.checkFilter = (promptId, filters = {}) => {
    if(!promptId) return false;
    const {state, data} = PromptsBrowser;
    const {unitedList} = data;
    const {collection = "", category = "", tags = [], name = ""} = filters;

    const unitedPrompt = unitedList[promptId];
    if(!unitedPrompt) return false;

    //checking collections
    if(collection && !unitedPrompt.collections.includes(collection)) return false;

    //checking categories
    if(category) {
        if(category === "__none" && unitedPrompt.category.length) return false;
        else if(category !== "__none" && !unitedPrompt.category.includes(category)) return false;
    }

    //checking tags
    if(tags.length) {
        for(const tagItem of tags) {
            if(!unitedPrompt.tags.includes(tagItem)) return false;
        }
    }

    //cheking name
    if(name && !unitedPrompt.id.toLowerCase().includes(name)) return false;

    return true;
}

/**
 * Showing filters block
 * @param {*} wrapper 
 * @param {*} filters 
 * @param {*} callback 
 * @returns 
 */
PromptsBrowser.promptsSimpleFilter.show = (wrapper, filters = {}, callback) => {
    if(!wrapper || !callback) return;
    const {state, data, makeElement, makeSelect} = PromptsBrowser;
    const {categories} = data;
    const {collection = "", category = "", tags = [], name = "", sorting = "", sortingOptions} = filters;

    const filtersContainer = makeElement({element: "div", className: "PBE_filtersContainer"});

    //collections filter
    const colOptions = [{id: "", name: "All collections"}];

    for(const collectionId in data.original)
        colOptions.push({id: collectionId, name: collectionId});

    const collectionSelector = makeSelect({
        className: "PBE_generalInput PBE_select",
        value: collection,
        options: colOptions,
        onChange: e => {
            filters.collection = e.currentTarget.value;
            callback();
        }
    });

    //categories filter
    const catOptions = [
        {id: "", name: "All categories"},
        {id: "__none", name: "Uncategorised"},
    ];

    for(const categoryId of categories)
        catOptions.push({id: categoryId, name: categoryId});

    const categorySelector = makeSelect({
        className: "PBE_generalInput PBE_select",
        value: category,
        options: catOptions,
        onChange: e => {
            filters.category = e.currentTarget.value;
            callback();
        }
    });

    //tags filter
    const tagsInput = makeElement({
        element: "input",
        className: "PBE_generalInput PBE_input",
        value: tags.join(", "),
        placeholder: "tag1, tag2, tag3",
        onChange: e => {
            const value = e.currentTarget.value;
            let tags = value.split(",").map(item => item.trim());

            //removing empty tags
            tags = tags.filter(item => item);

            filters.tags = tags || [];
            callback();
        }
    });

    PromptsBrowser.tagTooltip.add(tagsInput);

    //name filter
    const nameInput = makeElement({
        element: "input",
        className: "PBE_generalInput PBE_input",
        value: name,
        placeholder: "by name",
        onChange: e => {
            filters.name = e.currentTarget.value.toLowerCase();
            callback();
        }
    });

    filtersContainer.appendChild(collectionSelector);
    filtersContainer.appendChild(categorySelector);
    filtersContainer.appendChild(tagsInput);
    filtersContainer.appendChild(nameInput);

    //sorting selector
    if(sortingOptions) {
        const sortingSelector = makeSelect({
            className: "PBE_generalInput PBE_select",
            value: sorting,
            options: sortingOptions,
            onChange: e => {
                filters.sorting = e.currentTarget.value;
                callback();
            }
        });

        filtersContainer.appendChild(sortingSelector);
    }

    

    wrapper.appendChild(filtersContainer);
}