import * as React from 'react'
import appStore, {setShowCollectionTools} from 'client/store'
import Database from 'client/Database'
import ShowSorting from './ShowSorting';
import ShowCollections from './ShowCollections';
import ShowCategories from './ShowCategories';
import updateFilterName from './utils/updateFilterName';
import updateFilterTags from './utils/updateFilterTags';
import TagTooltip from 'client/components/ui/TagTooltip';


export default function ShowHeader() {
    const {readonly = true} = Database.meta;
    const collectionsIteration = appStore(state => state.collectionsIteration);
    const filterCollection = appStore(state => state.filterCollection);
    const filterCategory = appStore(state => state.filterCategory);
    const sortKnownPrompts = appStore(state => state.sortKnownPrompts);
    const filterName = appStore(state => state.filterName);
    const filterTags = appStore(state => state.filterTags) || [];

    const disabled = filterCollection ? false : true;

    return (
        <div className="PBE_promptsCatalogueHeader" data-iterate={collectionsIteration}>
            {!readonly &&
                <button
                    className="PBE_button"
                    style={{
                        marginRight: "10px",
                        opacity: disabled ? 0.2 : 1,
                        cursor: disabled ? "default" : "pointer",
                    }}
                    onClick={disabled ? undefined : () => setShowCollectionTools(true)}
                    disabled={disabled}
                >
                    Edit collection
                </button>
            }

            <ShowCollections value={filterCollection} />
            <ShowCategories value={filterCategory}/>

            <TagTooltip
                tags={filterTags}
                onUpdate={updateFilterTags}
            />

            <input
                className="PBE_generalInput"
                placeholder="by name"
                defaultValue={filterName}
                onChange={updateFilterName}
            />

            <ShowSorting value={sortKnownPrompts} />
        </div>
    );
}
