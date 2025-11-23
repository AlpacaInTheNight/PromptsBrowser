import { GenerateRequest } from "../../type"


const StaticStore: {
    generateQueue: GenerateRequest[];

    /**
     * Auto generate previews timer.
     */
    generateNextTimer: any;
} = {
    generateQueue: [],

    generateNextTimer: 0,
}

export default StaticStore;
