import Database from 'client/Database'
import ConfigManager from 'client/managers/Config'
import { replaceAllRegex } from 'client/utils'
import { checkFilter } from 'client/components/ui/PromptsSimpleFilter'
import Prompt from 'client/types/prompt'
import { FilterSimple } from 'client/types/filter'
import { PossiblePrompts } from '../type'


export default function getPossible({
    targetPrompt, possiblePrompts, filtersPossible,
    showAll, simByTags, simByCategory, simByName,
}: {
    targetPrompt: Prompt;
    possiblePrompts: PossiblePrompts[];
    filtersPossible: FilterSimple;

    showAll: boolean;
    simByTags: boolean;
    simByCategory: boolean;
    simByName: boolean;
}) {
    const {data} = Database;
    const {united} = data;
    const {maxCardsShown = 1000} = ConfigManager.getConfig();

    const nameArr: string[] = targetPrompt.id.split(" ");
    let targetTags: string[] = [];
    let targetCategories: string[] = [];
    let targetNameWords: string[] = replaceAllRegex(targetPrompt.id.toLowerCase(), "_", " ").split(" ");
    let shownItems = 0;

    const targetPromptSource = united.find(item => item.id === targetPrompt.id);
    if(targetPromptSource) {
        targetTags = targetPromptSource.tags || [];
        targetCategories = targetPromptSource.category || [];
    }

    for(const index in united) {
        const item = united[index];
        if(shownItems > maxCardsShown) break;

        const {id, tags, category} = item;

        if(!checkFilter(id, filtersPossible)) continue;

        //similarity index based on the same tags, categories and words used in the prompt name
        let simIndex = 0;

        if(id === targetPrompt.id) continue;

        let nameWords = replaceAllRegex(id.toLowerCase(), "_", " ").split(" ");

        if(simByTags)
            targetTags.forEach(tagItem => {if(tags.includes(tagItem)) simIndex++});
        
        if(simByCategory)
            targetCategories.forEach(catItem => {if(category.includes(catItem)) simIndex++});
        
        if(simByName)
            targetNameWords.forEach(wordItem => {if(nameWords.includes(wordItem)) simIndex++});

        if(showAll) {
            possiblePrompts.push({...item, simIndex});
            shownItems++;
            continue
        }

        if(simByTags && targetTags.length) {
            targetTags.some(targetTag => {
                if(tags.includes(targetTag)) {
                    possiblePrompts.push({...item, simIndex});
                    shownItems++;

                    return true;
                }
            });
        }

        if(simByCategory && targetCategories.length) {
            targetCategories.some(targetCategory => {
                if(category.includes(targetCategory)) {
                    possiblePrompts.push({...item, simIndex});
                    shownItems++;

                    return true;
                }
            });
        }

        if(simByName) {
            const itemNameArr = id.split(" ");

            wordLoop:
            for(const word of nameArr) {
                for(const itemWord of itemNameArr) {
                    
                    if( itemWord.toLowerCase().includes(word.toLowerCase()) ) {
                        possiblePrompts.push({...item, simIndex});
                        shownItems++;

                        break wordLoop;
                    }
                }
            }
        }
    };
    
}
