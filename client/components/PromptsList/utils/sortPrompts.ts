import { PromptEntity } from "clientTypes/prompt";


export default function sortPrompts(prompts: PromptEntity[], sorting: string) {

    //store original index
    for(let index = 0; index < prompts.length; index++) {
        const promptItem = prompts[index];
        if("id" in promptItem) promptItem.index = index;
    }

    switch(sorting) {

        case "alph":
            //sorting prompts alphabetically
            prompts.sort( (A, B) => {
                if("groupId" in A && "groupId" in B) return 0;
                if("id" in A && "groupId" in B) return -1;
                if("id" in B && "groupId" in A) return 1;

                if("id" in A && "id" in B) {
                    if(A.id.toLowerCase() < B.id.toLowerCase()) return -1;
                    if(A.id.toLowerCase() > B.id.toLowerCase()) return 1;
                }

                return 0;
            });
            break;

        case "alphReversed":
            //sorting prompts alphabetically in reverse orderd
            prompts.sort( (A, B) => {
                if("groupId" in A && "groupId" in B) return 0;
                if("id" in A && "groupId" in B) return -1;
                if("id" in B && "groupId" in A) return 1;

                if("id" in A && "id" in B) {
                    if(A.id.toLowerCase() < B.id.toLowerCase()) return 1;
                    if(A.id.toLowerCase() > B.id.toLowerCase()) return -1;
                }

                return 0;
            });
            break;

        case "weight":
            //sorting prompts based on their weight
            prompts.sort( (A, B) => {
                if("id" in A && "groupId" in B) return -1;
                if("id" in B && "groupId" in A) return 1;

                if(A.weight < B.weight) return 1;
                if(A.weight > B.weight) return -1;

                return 0;
            });
    }
}
