import * as React from 'react';
import { JSX, useRef, useState, useEffect } from 'react';
import AdditionalSetup from './AdditionalSetup';
import promptsFilterStore, {setShowAddFilter, setAction, setType} from './store';
import { FilterAction, FilterType } from './type';
import Filter from "clientTypes/filter";
import onAddNewFilter from './events/onAddNewFilter';
import ActiveFilters from './ActiveFilters';


export default function PromptsFilter({onChange}: {
    onChange: (filters: Filter[]) => void;
}) {
    const showAddFilter = promptsFilterStore(state => state.showAddFilter);
    const action = promptsFilterStore(state => state.action);
    const type = promptsFilterStore(state => state.type);

    return (
        <div className="PBE_filtersWrapper">

            <ActiveFilters onChange={onChange}/>

            {showAddFilter && <>
                <div className="PBE_row PBE_newFilterContainer">
                    <div
                        className="PBE_filterAction"
                        data-action={action}
                        onClick={() => setAction(action === FilterAction.EXCLUDE ? FilterAction.INCLUDE : FilterAction.EXCLUDE)}
                    >
                        {action === "include" ? "Include" : "Exclude"}
                    </div>

                    <select
                        className="PBE_generalInput PBE_select PBE_filterType"
                        style={{ margin: "0 5px" }}
                        value={type}
                        onChange={(e) => setType(e.target.value as FilterType)}
                    >
                        <option value={FilterType.NAME}>Name</option>
                        <option value={FilterType.TAG}>Tag</option>
                        <option value={FilterType.CATEGORY}>Category</option>
                        <option value={FilterType.META}>Meta</option>
                    </select>

                    <AdditionalSetup type={type} onSubmit={() => {onAddNewFilter(onChange)}} />
                </div>

                <div
                    className="PBE_filtersAddNew PBE_filtersAddNewButton"
                    onClick={e => onAddNewFilter(onChange)}
                >
                    ✓
                </div>

                <div
                    className="PBE_filtersAddNew PBE_filtersRemoveNew PBE_buttonCancel"
                    onClick={e => setShowAddFilter(false)}
                >
                    ✕
                </div>
            </>}

            {(showAddFilter === false) &&
                <div
                    className="PBE_filtersAddNew PBE_filtersAddNewButton"
                    onClick={e => setShowAddFilter(true)}
                >
                    +
                </div>
            }
        </div>
    );
}
