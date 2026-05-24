import {get_env} from './util.ts';

//<Language-config>
export const Language = {
	PT_BR:0,
	EN_US:1,
} as const;
export const Language_html = ["pt-br","en-us"] as const;
export const Language_default = 0 as Language;
export const Language_title = [["português","portuguese"],["inglês","english"]];
//</Language-config>
//<Fixed>
export type Language = typeof Language[keyof typeof Language];
export type Language_html = typeof Language_html[number];

const lang_env = get_env('SITE_LANG');
const lang_env_index = (lang_env?Language_html.findIndex((r)=>r==lang_env):-1);
export const Language_current = ((lang_env_index>=0)?lang_env_index:Language_default) as Language;
//</Fixed>