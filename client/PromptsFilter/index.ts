import PromptsBrowser from "client/index";
import Database from "client/Database/index";
import CollectionTools from "client/CollectionTools/index";
import TagTooltip from "client/TagTooltip/index";

class PromptsFilter {
    
    private static onAddNewFilter(e: MouseEvent) {
        const {promptsFilter} = PromptsBrowser.state;
        const target = e.currentTarget as HTMLElement;
        if(!target || !target.dataset.id) return;
        const parent = target.parentElement;
        if(!parent) return;

        if(target.innerText === "+") {
            const cancelButton = parent.querySelector(".PBE_filtersRemoveNew") as HTMLElement;
            const newFilterContainer = parent.querySelector(".PBE_newFilterContainer") as HTMLElement;
            if(!cancelButton || !newFilterContainer) return;

            target.innerText = "✓";
            cancelButton.style.display = "flex";
            newFilterContainer.style.display = "flex";

            return;
        }

        const filterTypeSelector = target.parentElement.querySelector(".PBE_filterType") as HTMLSelectElement;
        const filterActionElement = target.parentElement.querySelector(".PBE_filterAction") as HTMLSelectElement;
        if(!filterTypeSelector || !filterTypeSelector.value) return;
        if(!filterActionElement || !filterActionElement.dataset.action) return;

        const id = target.dataset.id;
        const action = filterActionElement.dataset.action as "include" | "exclude";
        const type = filterTypeSelector.value;
        let value = "";

        if(type === "meta") {
            const metaSelector = target.parentElement.querySelector(".PBE_filterMeta") as HTMLSelectElement;
            if(!metaSelector || !metaSelector.value) return;
            value = metaSelector.value;

        } else if(type === "category") {
            const categorySelector = target.parentElement.querySelector(".PBE_filterCategory") as HTMLSelectElement;
            if(!categorySelector || !categorySelector.value) return;
            value = categorySelector.value;

        } else {
            const nameInput = target.parentElement.querySelector(".PBE_filterName") as HTMLInputElement;
            if(!nameInput || !nameInput.value) return;
            value = nameInput.value;
        }

        if(!promptsFilter[id]) promptsFilter[id] = [];

        promptsFilter[id].push({action, type: type as any, value});
        
        CollectionTools.update();
    }

    private static onHideNewFilter(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        if(!target) return;
        const parent = target.parentElement;
        if(!parent) return;
        const addButton = parent.querySelector(".PBE_filtersAddNewButton") as HTMLElement;
        const newFilterContainer = parent.querySelector(".PBE_newFilterContainer") as HTMLElement;
        if(!addButton || !newFilterContainer) return;

        addButton.innerText = "+";
        target.style.display = "none";
        newFilterContainer.style.display = "none";
    }

    private static onRemoveFilter(e: MouseEvent) {
        const {promptsFilter} = PromptsBrowser.state;
        const target = e.currentTarget as HTMLElement;
        const id = target.dataset.id;
        const index = Number(target.dataset.index);
        if(!id || Number.isNaN(index)) return;
        if(!promptsFilter[id]) return;

        promptsFilter[id].splice(index, 1);
        CollectionTools.update();
    }

    private static showActiveFilters(wrapper: HTMLElement, filterId: string) {
        const {promptsFilter = {}} = PromptsBrowser.state;
        const filterSetup = promptsFilter[filterId];
        if(!filterSetup) return;

        for(let i = 0; i < filterSetup.length; i++) {
            const filterItem = filterSetup[i];
            const {action, type, value} = filterItem;
            const isInclude = action === "include";

            const filterElement = document.createElement("div");
            filterElement.className = "PBE_filterItem";
            if(!isInclude) filterElement.className += " PBE_filterItemNegative";

            filterElement.innerText = action === "include" ? "+" : "-";
            filterElement.innerText += `${type}: ${value}`;

            const removeButton = document.createElement("div");
            removeButton.className = "PBE_filterItemRemove PBE_buttonCancel";
            removeButton.innerText = "✕";
            removeButton.dataset.id = filterId;
            removeButton.dataset.index = i + "";

            removeButton.addEventListener("click", PromptsFilter.onRemoveFilter);

            filterElement.appendChild(removeButton);

            wrapper.appendChild(filterElement);
        }
    }

    public static update(wrapper: HTMLElement, filterId: string) {
        if(!wrapper || !filterId) return;
        const {promptsFilter} = PromptsBrowser.state;
        wrapper.innerHTML = "";

        const filtersContainer = document.createElement("div");
        filtersContainer.className = "PBE_filtersWrapper";

        const addFilterButton = document.createElement("div");
        addFilterButton.className = "PBE_filtersAddNew PBE_filtersAddNewButton";
        addFilterButton.dataset.id = filterId;
        addFilterButton.innerText = "✓";

        const cancelButton = document.createElement("div");
        cancelButton.className = "PBE_filtersAddNew PBE_filtersRemoveNew .PBE_buttonCancel";
        cancelButton.innerText = "✕";

        const newFilterContainer = document.createElement("div");
        newFilterContainer.className = "PBE_row PBE_newFilterContainer";

        const activeFilters = document.createElement("div");
        activeFilters.className = "PBE_row";
        activeFilters.style.flexWrap = "wrap";
        
        const actionButton = document.createElement("div");
        actionButton.className = "PBE_filterAction"
        actionButton.innerText = "Include";
        actionButton.dataset.action = "include";
        
        const typeSelect = document.createElement("select");
        typeSelect.className = "PBE_generalInput PBE_select PBE_filterType";
        typeSelect.style.margin = "0 5px";
        typeSelect.innerHTML = `
            <option value="name">Name</option>
            <option value="tag">Tag</option>
            <option value="category">Category</option>
            <option value="meta">Meta</option>
        `;

        const addionalSetup = document.createElement("div");

        actionButton.addEventListener("click", (e) => {
            const target = e.currentTarget as HTMLSelectElement;
            const action = target.dataset.action;

            if(action === "include") {
                target.dataset.action = "exclude";
                target.innerText = "Exclude";
            } else {
                target.dataset.action = "include";
                target.innerText = "Include";
            }
        });

        typeSelect.addEventListener("change", (e) => {
            const target = e.currentTarget as HTMLSelectElement;
            const value = target.value;

            PromptsFilter.updateAdditionalSetup(addionalSetup, value, addFilterButton);
        });

        addFilterButton.addEventListener("click", PromptsFilter.onAddNewFilter);
        cancelButton.addEventListener("click", PromptsFilter.onHideNewFilter);

        PromptsFilter.showActiveFilters(activeFilters, filterId);
        PromptsFilter.updateAdditionalSetup(addionalSetup, "name", addFilterButton);
        newFilterContainer.appendChild(actionButton);
        newFilterContainer.appendChild(typeSelect);
        newFilterContainer.appendChild(addionalSetup);

        filtersContainer.appendChild(activeFilters);
        filtersContainer.appendChild(newFilterContainer);
        filtersContainer.appendChild(addFilterButton);
        filtersContainer.appendChild(cancelButton);

        wrapper.appendChild(filtersContainer);
    }

    private static updateAdditionalSetup(wrapper: HTMLElement, type: string, addFilterButton: HTMLElement) {
        wrapper.innerHTML = "";

        if(type === "meta") {
            const metaSelect = document.createElement("select");
            metaSelect.className = "PBE_generalInput PBE_select PBE_filterMeta";
            metaSelect.innerHTML = `
                <option value="preview">Have preview image</option>
                <option value="categories">Have categories</option>
                <option value="categories3">Have at least 3 categories</option>
                <option value="tags">Have tags</option>
                <option value="tags3">Have at least 3 tags</option>
                <option value="comment">Have comment</option>
                <option value="comment">comment</option>
                <option value="autogen">Have autogen style</option>
                <option value="png">Is PNG</option>
                <option value="jpg">Is JPG</option>
            `;

            wrapper.appendChild(metaSelect);
            return;
        }

        if(type === "category") {
            const {data} = Database;
            const categories = data.categories;
            const categorySelector = document.createElement("select");
            categorySelector.className = "PBE_generalInput PBE_select PBE_filterCategory";

            let options = `
                <option value="">All</option>
                <option value="__none">Uncategorised</option>
            `;

            for(const categoryItem of categories) {
                options += `<option value="${categoryItem}">${categoryItem}</option>`;
            }
            categorySelector.innerHTML = options;

            wrapper.appendChild(categorySelector);
            return;
        }

        if(type === "tag" || type === "name") {
            const inputElement = document.createElement("input");
            inputElement.className = "PBE_generalInput PBE_input PBE_filterName";

            if(type === "tag") TagTooltip.add(inputElement, true);

            inputElement.addEventListener("keydown", (e) => {
                if(e.keyCode !== 13) return;

                addFilterButton.dispatchEvent(new Event('click'));
            });

            wrapper.appendChild(inputElement);
            return;
        }
    }

}

export default PromptsFilter;
