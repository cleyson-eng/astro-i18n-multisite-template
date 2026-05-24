import path from "node:path";

//<Fixed>
export function get_env(key:string) {
	//@ts-ignore
	try { if(typeof process !== "undefined" && process.env) return process.env[key];
	}catch(_) {}
	//@ts-ignore
	try { if (typeof Deno !== "undefined" && Deno.env)  Deno.env.get(key);
	}catch(_) {}
	return undefined;
}
//@ts-ignore
if (globalThis._noCDNAssets0 == undefined) globalThis._noCDNAssets0 = new Map<string, boolean>();
//@ts-ignore
export const _noCDNAssets = globalThis._noCDNAssets0 as Map<string, boolean>;
export function noCDNAsset(url:string) {
	if (DEBUG) return url;
	_noCDNAssets.set(path.basename(url), true);
	return url.replace(/^(https?:\/\/)?[A-z]+\.[A-z.]*/,'');
}
//</Fixed>

export const DOMAIN = get_env("SITE_DOMAIN") as string;
export const DEBUG = DOMAIN == undefined;

