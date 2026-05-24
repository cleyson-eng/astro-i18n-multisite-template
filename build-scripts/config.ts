import * as fs from "node:fs/promises";
import * as path from "node:path";

const root = import.meta.dirname as string;
const language_json_path = path.resolve(root, '../src/meta/languages.json');
const i18n_path = path.resolve(root, './i18n.ts');
const i18n_astro_path = path.resolve(root, './i18n.astro');

interface LanguageConfig {
	name:string[]//     enumeration name
	html:string[]//     html iso (en-us)
	default:number//    index of default
	matrix:string[][]// language name matrix [reading name][in language]
};

async function language_json_load() {
	return JSON.parse(await fs.readFile(language_json_path, 'utf-8')) as LanguageConfig;
}
function find_replace_tag(src:string, tag:string, txt:string) {
	//tag = RegExp.
	return src.replace(new RegExp(`\\<${tag}\\>[\\s\\S]*\\<\\/${tag}\\>`), txt);
}

async function main() {
	const config = await language_json_load();
	//TS
	let txt = await fs.readFile(i18n_path, 'utf-8');
	txt = find_replace_tag(txt, 'Language-config',
`<Language-config>
export const Language = {
${config.name.map((x,i)=>'\t'+x+':'+i+',\n').join('')
} as const;
export type Language = typeof Language[keyof typeof Language];
export const Language_html = ${JSON.stringify(config.html)} as const;
export const Language_default = ${config.default} as Language;
export const Language_title = ${JSON.stringify(config.matrix)};
//</Language-config>`
	);
	await fs.writeFile(i18n_path, txt, 'utf-8');
	console.log('updated: '+i18n_path);
	//ASTRO
	txt = await fs.readFile(i18n_astro_path, 'utf-8');
	txt = find_replace_tag(txt, 'Language-switch',
`<Language-switch> -->
${
	config.name.map((v,i)=>
		`{(Language_current==Language.${v})&&<slot name="${config.html[i]}"/>}`
	).join('\n')
}
<!-- </Language-switch>`
	);
	await fs.writeFile(i18n_astro_path, txt, 'utf-8');
	console.log('updated: '+i18n_astro_path);
}
main();