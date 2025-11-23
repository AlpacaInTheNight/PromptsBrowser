import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import promptsFilterStore from './store';
import onRemoveFilter from './events/onRemoveFilter';
import Filter from "clientTypes/filter";


export default function ActiveFilters({onChange}: {
    onChange: (filters: Filter[]) => void;
}) {
    const promptsFilter = promptsFilterStore(state => state.promptsFilter);

    return (
        <div
            className="PBE_row"
            style={{ flexWrap: "wrap" }}
        >
            {promptsFilter.map((filterItem, index) => {
                const { action, type, value } = filterItem;
                const isInclude = action === "include";

                return (
                    <div
                        key={index}
                        className={
                            "PBE_filterItem" +
                            (isInclude ? "" : " PBE_filterItemNegative")
                        }
                    >
                        {isInclude ? "+" : "-"}
                        {`${type}: ${value}`}

                        <div
                            className="PBE_filterItemRemove PBE_buttonCancel"
                            data-index={index}
                            onClick={e => onRemoveFilter(e, onChange)}
                        >
                            ✕
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
