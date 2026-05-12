import { replaceAllRegex } from 'client/utils/index'


export default function getSaveName(promptName: string): string {
    promptName = replaceAllRegex(promptName, "\\\\", "");
    promptName = replaceAllRegex(promptName, ":", ": ");
    promptName = replaceAllRegex(promptName, "_", " ");
    promptName = replaceAllRegex(promptName, "{", "");
    promptName = replaceAllRegex(promptName, "}", "");

    return promptName;
}
