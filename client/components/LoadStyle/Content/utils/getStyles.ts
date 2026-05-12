import Database from 'client/Database'
import Style from "clientTypes/style";


export default function getStyles() {
    const {data} = Database;
    let styles: (Style & {index: number})[] = [];

    for(const collectionId in data.styles) {
        for(let i = 0; i < data.styles[collectionId].length; i++) {
            const styleItem = data.styles[collectionId][i];

            styles.push({...styleItem, id: collectionId, index: i});
        }
    }
    
    styles.sort( (A, B) => {
        if(A.name > B.name) return 1;
        if(A.name < B.name) return -1;

        return 0;
    });

    return styles;
}
