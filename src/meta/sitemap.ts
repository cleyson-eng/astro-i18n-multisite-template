import { type Language_html } from "../../build-scripts/i18n.ts";
import { make_realLink, mapRootsDomain, mapRootsLocal, type SiteMap, type SiteRoots } from "../../build-scripts/sitemap_data.ts";
import { DEBUG, DOMAIN } from "../../build-scripts/util.ts";

export const siteDomains = [
	"https://cleyson.eng.br",
	"https://en.cleyson.eng.br"
];
export const siteRoots:SiteRoots = {
	"PT":"https://cleyson.eng.br/",
	"EN":"https://en.cleyson.eng.br/"	
}
export const siteMap:SiteMap = [
	{
		iname:"INDEX",
		name:"index.astro",
		root:"PT",
		src:"content/index.astro",
		lang:"pt-br"
	}, {
		iname:"INDEX",
		name:"index.astro",
		root:"EN",
		src:"content/index.astro",
		lang:"en-us"
	}
];



export const siteRoots_current = DEBUG?mapRootsLocal(siteRoots, siteDomains):mapRootsDomain(siteRoots, DOMAIN);
export const pageLink = make_realLink("", siteMap, siteRoots_current);