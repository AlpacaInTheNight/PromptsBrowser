
if(!window.PromptsBrowser) window.PromptsBrowser = {};

window.PromptsBrowser.replaceAllRegex = function(str, oldStr, newStr) {
	if(!str || !oldStr) return str;

	return str.replace(new RegExp(oldStr, 'g'), newStr);
};

/**
 * Make sure to update server-side makeFileNameSafe method as well
 */
window.PromptsBrowser.makeFileNameSafe = function(fileName) {
	if(!fileName) return;
	const {replaceAllRegex} = window.PromptsBrowser;

	fileName = replaceAllRegex(fileName, "_", " ");

	//unix/win
	fileName = replaceAllRegex(fileName, "/", "_fsl_");

	//win
	fileName = replaceAllRegex(fileName, ":", "_col_");
	fileName = replaceAllRegex(fileName, "\\\\", "_bsl_");
	fileName = replaceAllRegex(fileName, "<", "_lt_");
	fileName = replaceAllRegex(fileName, ">", "_gt_");
	fileName = replaceAllRegex(fileName, "\"", "_dq_");
	fileName = replaceAllRegex(fileName, "\\|", "_pip_");
	fileName = replaceAllRegex(fileName, "\\?", "_qm_");
	fileName = replaceAllRegex(fileName, "\\*", "_ast_");

	fileName = fileName.trim();

	return fileName;
}

window.PromptsBrowser.normalizePrompt = function(prompt) {
	const {state} = PromptsBrowser;
	const {config} = state;

	if(!prompt) return prompt;

	prompt = prompt.trim();
	if(!prompt) return prompt;

	//Skip external networks prompts.
	if(prompt.startsWith("<") && prompt.endsWith(">")) return prompt;

	if(config.toLowerCase) prompt = prompt.toLowerCase();
	
	if(config.spaceMode === "space") prompt = prompt.replaceAll("_", " ");
	else if(config.spaceMode === "underscore") prompt = prompt.replaceAll(" ", "_");

	return prompt;
}