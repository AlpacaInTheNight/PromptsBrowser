import Database from 'client/Database'
import Prompt from 'clientTypes/prompt'
import appStore, { updateCurrentIteration } from 'client/store'
import ActivePrompts from 'client/managers/ActivePrompts'
import checkFilter from '../checkFilter'
import addPromptItem from './addPromptItem'


export default function onAddRandom() {
    const {filterCollection} = appStore.getState();
    const {data} = Database;
    const {united} = data;
    const usedPrompts = ActivePrompts.getUniqueIds();
    let dataArr: Prompt[] = [];

    if(filterCollection) {
        const targetCategory = data.original[filterCollection];
        if(targetCategory) {
            for(const id in targetCategory) {
                const targetOriginalItem = targetCategory[id];
                const targetMixedItem = united.find(item => item.id === targetOriginalItem.id);
                if(targetMixedItem && checkFilter(targetMixedItem)) dataArr.push({...targetMixedItem});
            }
        }

    } else {
        for(const id in united) {
            if(checkFilter(united[id])) dataArr.push({...united[id]});
        }
    }

    dataArr = dataArr.filter(dataItem => !usedPrompts.includes(dataItem.id));

    const randomPrompt = dataArr[Math.floor(Math.random() * dataArr.length)];

    addPromptItem(randomPrompt);
    ActivePrompts.updateTextArea();
    updateCurrentIteration();
}
