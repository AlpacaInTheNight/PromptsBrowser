import * as React from 'react'
import Database from 'client/Database'
import ConfigManager from 'client/managers/Config'
import PromptItem from 'client/components/PromptItem/index'
import checkFilter from './checkFilter'
import onPromptClick from './events/onPromptClick'
import onAddRandom from './events/onAddRandom'


export default function getCards({filesIteration = 0, filterCollection = "", filterCategory, filterName, sortKnownPrompts}: {
    filterCollection?: string;
    filterCategory?: string;
    sortKnownPrompts?: string;
    filterName?: string;
    filterTags?: string[];
    filesIteration?: number;
}) {
    const {data} = Database;
    const {readonly} = Database.meta;
    const {united} = data;
    const {cardWidth = 50, cardHeight = 100, showPromptIndex = false, maxCardsShown = 1000} = ConfigManager.getConfig();
    let dataArr = [];
    let shownItems = 0;
    const JSXCards: React.JSX.Element[] = [];
    const showIndex = (showPromptIndex && filterCollection) ? true : false;

    /**
     * TODO: not sure about that part. Some early versions optimisation or something.
     * checkFilter function will do filtering anyway.
     * Need to measure render time with and without this.
     */
    if(filterCollection) {
        const targetCategory = data.original[filterCollection];
        if(targetCategory) {
            for(const id in targetCategory) {
                const targetOriginalItem = targetCategory[id];
                const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
                if(targetMixedItem) dataArr.push({...targetMixedItem});
            }
        }

    } else {
        for(const id in united) dataArr.push({...united[id]});
    }

    //sorting prompts array
    if(sortKnownPrompts === "alph" || sortKnownPrompts === "alphReversed") {
        dataArr.sort( (A, B) => {
            if(sortKnownPrompts === "alph") {
                if(A.id > B.id) return 1;
                if(A.id < B.id) return -1;

            } else {
                if(A.id > B.id) return -1;
                if(A.id < B.id) return 1;
            }

            return 0;
        });
    } else if(sortKnownPrompts === "reversed") dataArr.reverse();

    //show Add Random card
    if(dataArr.length) {
        JSXCards.push(
            <div
                className="PBE_promptElement PBE_promptElement_random"
                key="__random"
                style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                }}
                onClick={onAddRandom}
            >
                Add random
            </div>
        );
    }

    for(const index in dataArr) {
        const prompt = dataArr[index];
        if(shownItems >= maxCardsShown) break;

        if(!checkFilter(prompt)) continue;

        const imageSrc = Database.getPromptPreviewURL({prompt: prompt.id, filesIteration, collectionId: filterCollection});

        JSXCards.push(
            <PromptItem
                key={prompt.id}
                id={prompt.id}
                src={imageSrc}
                prompt={prompt}
                options={{isShadowed: false, showIndex, index}}

                onClick={onPromptClick}
            />
        );
        shownItems++;
    }

    return JSXCards;
}
