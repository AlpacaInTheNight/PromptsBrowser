import Filter from "clientTypes/filter";
import promptsFilterStore, {setPromptsFilter, iterateStore} from "../store";


export default function onRemoveFilter(e: React.MouseEvent, onChange: (filters: Filter[]) => void) {
    const {promptsFilter} = promptsFilterStore.getState();
    const target = e.currentTarget as HTMLElement;
    const index = Number(target.dataset.index);
    if(Number.isNaN(index)) return;

    promptsFilter.splice(index, 1);

    const newFilters = [...promptsFilter];

    setPromptsFilter(newFilters);
    onChange(newFilters);
    iterateStore();
}