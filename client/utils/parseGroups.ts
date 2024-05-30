import Prompt, { PromptEntity, PromptGroup } from "clientTypes/prompt";

let assignGroupId = 0;

type PromptStringGroup = {
    id: number;
    weight?: number;
    body: (string | PromptStringGroup)[],
}

type PromptStringEntity = string | PromptStringGroup;

function parseBranch(str: string, container: PromptStringEntity[] = []) {
    let newStr = str;
    let currChar = "";
    let body = "";
    let weightMarker = "";
    let grabMarker = false;
    let isEscape = false;
    let isExternalNetwork = false;

    while(str.length) {
        if(isEscape) {isEscape = false; str = str.substring(1); continue}
        currChar = str.charAt(0);

        if(currChar === "\\") {
            isEscape = true;
            body += "\\";
            body += str.charAt(1);
            str = str.substring(1);
            continue
        }

        if(currChar === "<") isExternalNetwork = true;
        else if(currChar === ">") isExternalNetwork = false;

        if(isExternalNetwork) {
            if(currChar === "(" || currChar === ")" || currChar === ",") {
                isExternalNetwork = false;

            } else {
                body += currChar;

                str = str.substring(1);
                newStr = str;

                continue;
            }
        }

        if(currChar === "(") {
            if(body) container.push(body);
            body = "";

            const {container: newContainer, newStr, weight} = parseBranch(str.substring(1), []);
            str = newStr;
            
            if(newContainer && newContainer.length) {
                let isGroup = true;

                //detect if it is a single prompt with weight or a group of prompts
                if(
                    newContainer.length === 1 &&
                    typeof newContainer[0] === "string" &&
                    !newContainer[0].includes(",") &&
                    !newContainer[0].includes("|")
                ) isGroup = false;

                if(isGroup) {
                    container.push({
                        id: assignGroupId,
                        weight: weight ? Number(weight) : undefined,
                        body: newContainer,
                    });
    
                    assignGroupId++;

                } else {
                    if(weight) container.push(`(${newContainer}: ${weight})`);
                    else container.push(`(${newContainer})`);
                }

            }

        } else if(currChar === ")") {
            if(body) container.push(body);
            body = "";

            break;

        } else if(currChar === ":") {
            grabMarker = true;

        } else if(grabMarker) {
            if(currChar === "." || (currChar >= "0" && currChar <= "9")) weightMarker += currChar;
            else if(currChar !== " ") grabMarker = false;

        } else body += currChar;

        str = str.substring(1);
        newStr = str;
    }

    if(body) container.push(body);

    return {container, newStr, weight: weightMarker};
}

/**
 * Parses prompts string and splices it to groups of strings based on group delimeter syntax.
 * @param str 
 * @returns 
 */
function parseGroups(str: string): PromptStringEntity[] {
    assignGroupId = 0;
    const result = parseBranch(str);

    return result.container;
}

export {
    parseGroups,
    PromptStringGroup,
    PromptStringEntity,
}

export default parseGroups;
