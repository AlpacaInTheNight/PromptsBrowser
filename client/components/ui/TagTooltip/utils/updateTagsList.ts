import Database from "client/Database";
import {setKnownTags} from "../store";


/**
 * Creates a list of known tags used in the database
 * @returns 
 */
export default function updateTagsList() {
    const {data} = Database;
    if(!data || !data.united) return;
    const knownTags: string[] = [];

    const promptsList = data.united;

    for(const prompt of promptsList) {
        if(!prompt.tags) continue;

        for(const tagItem of prompt.tags) {
            if(!knownTags.includes(tagItem)) knownTags.push(tagItem)
        }
    }

    knownTags.sort();

    setKnownTags(knownTags);
}
