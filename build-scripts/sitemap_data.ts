import { type Language_html } from "./i18n.ts";
import * as fs from "node:fs";
import * as path from "node:path";

/* Sitemap must have:
siteDomains:string[] <== domains, first is resource reference (release build) ex.: cleyson.eng.br
siteRoots:SiteRoots <== domains + relative folder ex.: / or /english/
siteMap:SiteMap     <== pages in roots (any domain) ex.: {
	root: root_key
	name: index.html or apps/my_app.html
	src: <src relative>/site_page/index_pt.astro
	lang: "pt_br"
}

siteRoots_current = DEBUG?mapRootsLocal(siteRoots, siteDomains):mapRootsDomain(siteRoots, DOMAIN);
pageLink = make_realLink('', siteMap, siteRoots_current);
*/

//! "site_root_key":"absolute_real_base_link"
export type SiteRoots = Record<string,string>;
export interface SitePage {
	iname:string
	root:string
	name:string
	src:string
	lang?:Language_html
};
export type SiteMap = SitePage[];
export function pagei18n(
	iname:string,
	i18n:Record<Language_html,{
		root:string,
		name:string,
	}>,
	src:string,
):SitePage[] {
	return Object.keys(i18n).map((lang)=>({
		iname,
		root:i18n[lang as Language_html].root,
		name:i18n[lang as Language_html].name,
		src,
		lang,
	} as SitePage));
}


function trimPath(x:string) {
	while (x.startsWith('/')) x = x.substring(1);
	return x;
}
export function make_realLink(prefix:string, ref_siteMap:SiteMap, ref_siteRoots:SiteRoots) {
	return function (iname:string, lang?:Language_html) {
		const filtered = ref_siteMap.filter((ref)=>ref.iname == iname && ref_siteRoots[ref.root] != undefined);
		if (filtered.length <= 0)
			throw iname+`: NOT FOUND!`;
		let s = filtered[0] as (SitePage | undefined);
		if (filtered.length > 1 && lang != undefined)
			s = filtered.find((ref)=>ref.lang == lang);
		if (s == undefined)
			throw iname+` [lang=${lang}]: NOT FOUND FOT THAT LANGUAGE!`;
		return prefix + ref_siteRoots[s.root] + trimPath(s.name);
	};
}
function writeFile(file_path:string, txt:string) {
	console.log('write: '+file_path);
	const folder_path = path.resolve(file_path, '..');
	if (!fs.existsSync(folder_path))
		fs.mkdirSync(folder_path, {recursive:true});
	else if (fs.existsSync(file_path) && fs.readFileSync(file_path, 'utf-8') == txt)
		return;
	fs.writeFileSync(file_path, txt, 'utf-8');
}
export function genMapLinks(project_root:string, link_folder:string, siteRoots:SiteRoots, siteMap:SiteMap) {
	let data:Record<string, SitePage> = {};
	siteMap.forEach((page)=>{
		if (siteRoots[page.root] == undefined) return;
		const link = siteRoots[page.root]+page.name;
		data[link] = page;
	});
	Object.keys(data).forEach((key)=>{
		const page = data[key];
		const file_path = path.resolve(trimPath(project_root), trimPath(link_folder), trimPath(key));
		writeFile(
			file_path,
`---
import X from "${path.relative(path.join(link_folder, trimPath(key), '..'), page.src).replaceAll('\\','/')}";
---
<X${page.lang?` lang="${page.lang}"`:''} name="${page.iname}"/>
`		);
	});
}
export function mapRootsLocal(siteRoots:SiteRoots, siteDomains:string[]) {
	const new_siteRoots:SiteRoots = {};
	Object.keys(siteRoots).forEach((key)=>{
		const id = siteDomains.findIndex((siteDomain)=>siteRoots[key].startsWith(siteDomain+'/'));
		new_siteRoots[key] = 
			((id == 0)?'':id)+
			((id >= 0)?
				siteRoots[key].substring(siteDomains[id].length):
				siteRoots[key]);
	});
	return new_siteRoots;
}
export function mapRootsDomain(siteRoots:SiteRoots, filter_domain:string) {
	const new_siteRoots:SiteRoots = {};
	Object.keys(siteRoots).forEach((key)=>{
		if (!siteRoots[key].startsWith(filter_domain+'/'))
			return;
		new_siteRoots[key] = siteRoots[key].substring(filter_domain.length);
	});
	return new_siteRoots;
}
export function domainAsVarName(domain:string) {
	return domain.replace(/(https?:\/\/)?/,'').replace(/\/[\S]*/,'').replaceAll('.','_');
}
export function domainFullHttps(domain:string) {
	return 'https://'+domain.replace(/(https?:\/\/)?/,'').replace(/\/[\S]*/,'')+'/';
}