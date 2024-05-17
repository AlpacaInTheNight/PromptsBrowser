
type Filter = {
    action: "include" | "exclude";

    type: "name" | "category" | "tag" | "meta";

    value: string;
}

type FilterSimple = {
    collection?: string;
    category?: string;
    tags?: string[];
    name?: string;
    sorting?: string;
    sortingOptions?: {id: string; name: string; }[];
}

export {FilterSimple};
export default Filter;
