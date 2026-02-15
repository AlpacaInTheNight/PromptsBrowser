import * as React from 'react'
import appStore from 'client/store'
import ConfigManager from 'client/managers/Config'
import getCards from './getCards'


export default function ShowContent() {
    const filesIteration = appStore(state => state.filesIteration);
    const filterCollection = appStore(state => state.filterCollection);
    const filterCategory = appStore(state => state.filterCategory);
    const sortKnownPrompts = appStore(state => state.sortKnownPrompts);
    const filterName = appStore(state => state.filterName);
    const filterTags = appStore(state => state.filterTags);
    const modelIteration = appStore(state => state.modelIteration);

    const cards = getCards({filesIteration, filterCollection, filterCategory, filterName, filterTags, sortKnownPrompts});
    const {cardHeight = 100, rowsInKnownCards = 3} = ConfigManager.getConfig();

    return (
        <div
            data-model={modelIteration}
            className="PBE_promptsCatalogueContent PBE_Scrollbar"
            style={{
                maxHeight: `${cardHeight * rowsInKnownCards}px`,
            }}
        >
            {cards}
        </div>
    );
}
