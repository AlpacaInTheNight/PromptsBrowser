import Database from "./index"


export default async function renameStyle(collection: string, oldName: string, newName: string) {
    const {data} = Database;

    if(!collection || !oldName || !newName) return;

    const url = Database.getAPIurl("renameStyle");

    await (async () => {
        const saveData = {oldName, newName, collection};

        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveData)
        });

        const targetStylesCollection = data.styles[collection];
        if(targetStylesCollection) {
            targetStylesCollection.some(item => {
                if(item.name === oldName) {
                    item.name = newName;
    
                    return true;
                }
            });
        }
    })();
}
