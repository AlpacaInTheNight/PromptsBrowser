import Database from "client/Database";


export default function getPossiblePrompts(word: string) {
    const promptsList = Database.data.united;
    const possiblePrompts = [];

    for(const prompt of promptsList) {
        if(!prompt.id) continue;
        if(prompt.id.toLowerCase().includes(word)) possiblePrompts.push(prompt.id);
    }

    possiblePrompts.sort();

    return possiblePrompts;
}
