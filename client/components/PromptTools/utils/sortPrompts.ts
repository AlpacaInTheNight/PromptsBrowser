import { PossiblePrompts } from "../type";


export default function sortPrompts({sorting, possiblePrompts}: {
    sorting: string;
    possiblePrompts: PossiblePrompts[];
}) {

    switch(sorting) {

        case "__none": break;

        case "alph":
            //sorting possible prompts alphabetically
            possiblePrompts.sort( (A, B) => {
                if(A.id.toLowerCase() < B.id.toLowerCase()) return -1;
                if(A.id.toLowerCase() > B.id.toLowerCase()) return 1;

                return 0;
            });
            break;

        case "alphReversed":
            //sorting possible prompts alphabetically in reverse orderd
            possiblePrompts.sort( (A, B) => {
                if(A.id.toLowerCase() < B.id.toLowerCase()) return 1;
                if(A.id.toLowerCase() > B.id.toLowerCase()) return -1;

                return 0;
            });
            break;

        default:
        case "sim":
            //sorting possible prompts based on their similarity to the selected prompt
            possiblePrompts.sort( (A, B) => {
                if(A.simIndex < B.simIndex) return 1;
                if(A.simIndex > B.simIndex) return -1;

                if(A.id.toLowerCase() < B.id.toLowerCase()) return -1;
                if(A.id.toLowerCase() > B.id.toLowerCase()) return 1;

                return 0;
            });
    }
    
}
