import Database from "client/Database";


const MAX_STYLES = 5;
const IGNORED_COLLECTIONS = ["autogen"];

export default function getPossibleStyles(word: string) {
    const {styles} = Database.data;
    const possibleStyles = [];
    let addedStyles = 0;

    topLoop: for(const collectionId in styles) {
        if(IGNORED_COLLECTIONS.includes(collectionId)) continue;

        for(let i = 0; i < styles[collectionId].length; i++) {
            const styleItem = styles[collectionId][i];
            if(!styleItem.name) continue;

            if(styleItem.name.toLowerCase().includes(word)) {
                possibleStyles.push({collection: collectionId, name: styleItem.name});
                addedStyles++;
            }

            if(addedStyles > MAX_STYLES) break topLoop;
        }
    }

    possibleStyles.sort( (A, B) => {
        if(A.name > B.name) return 1;
        if(A.name < B.name) return -1;

        return 0;
    });

    return possibleStyles;
}
