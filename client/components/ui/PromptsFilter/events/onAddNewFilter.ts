import promptsFilterStore, {iterateStore, setCategory, setName, setPromptsFilter, setTag} from "../store";
import Filter from "clientTypes/filter";
import { FilterType } from "../type";


export default function onAddNewFilter(onChange: (filters: Filter[]) => void) {
    const {promptsFilter, action, type, meta, category, name, tag} = promptsFilterStore.getState();

    let value = "";

    if(type === FilterType.META) {
        if(!meta) return;
        value = meta;

    } else if(type === FilterType.CATEGORY) {
        value = category;
        setCategory("");

    } else if(type === FilterType.NAME) {
        if(!name) return;
        value = name;
        setName("");

    } else if(type === FilterType.TAG) {
        if(!tag) return;

        value = tag;
        setTag("");
    }

    promptsFilter.push({action, type, value});

    const newFilters = [...promptsFilter];
    
    setPromptsFilter(newFilters);
    onChange(newFilters);
    iterateStore();
}
